const assert = require("node:assert/strict")

const { TyporaEditorAdapter } = require("../latex-suite/editor-adapter")
const {
    createInlineMathLocator,
    getEditingRoot,
    getInlineMathElement,
    getInlineMathSource,
    resolveInlineMathElement,
    resolveLiveInlineMathSource,
} = require("../latex-suite/dom-context")
const { compileSnippets, matchSnippet, parseReplacement, renderSnippetReplacement } = require("../latex-suite/matcher")
const { PluginSession } = require("../latex-suite/session")
const {
    createSnippets,
    PHYSICS_COMMAND_PATTERN,
    resolveUsePhysicsPackage,
} = require("../latex-suite/snippets")

function testMatcher() {
    const snippets = compileSnippets(createSnippets({ toggleInlineMath() {}, toggleDisplayMath() {} }))
    const mathAuto = { inMath: true, inNewLine: false, inInlineMath: false, isAutoKey: true }

    const beta = matchSnippet(snippets, "beta", mathAuto)
    assert.equal(beta.match[0], "beta", "beta must not degrade into b + eta")

    const hat = matchSnippet(snippets, "hat", mathAuto)
    assert.equal(hat.match[0], "hat", "standalone hat must win at a token boundary")

    const inlineStartCases = new Map([
        ["$beta", ["beta", "\\beta"]],
        ["$phi", ["phi", "\\phi"]],
        ["$hat", ["hat", "\\hat{  }"]],
        ["$ln", ["ln", "\\ln"]],
    ])
    for (const [input, [matched, expected]] of inlineStartCases) {
        const result = matchSnippet(snippets, input, mathAuto)
        assert.ok(result, `${input} must expand at the start of inline math`)
        assert.equal(result.match[0], matched, `${input} must not consume the inline $ delimiter`)
        const replacement = renderSnippetReplacement(result.snippet, result.match)
        assert.equal(parseReplacement(replacement).finalText, expected)
    }

    const delayedGreekSeparator = matchSnippet(snippets, "\\betax", mathAuto)
    assert.ok(delayedGreekSeparator, "typing after a Greek command must insert its separator lazily")
    assert.equal(
        parseReplacement(renderSnippetReplacement(delayedGreekSeparator.snippet, delayedGreekSeparator.match)).finalText,
        "\\beta x"
    )

    for (const input of ["\\alpha hat", "\\alphahat"]) {
        const wrapped = matchSnippet(snippets, input, mathAuto)
        assert.equal(wrapped.snippet.priority, 30, `${input} must prefer the Greek-atom wrapper`)
        const replacement = renderSnippetReplacement(wrapped.snippet, wrapped.match)
        assert.equal(parseReplacement(replacement).finalText, "\\hat{\\alpha}")
    }

    const blackboard = matchSnippet(snippets, "abb", mathAuto)
    assert.equal(parseReplacement(renderSnippetReplacement(blackboard.snippet, blackboard.match)).finalText, "\\mathbb{a}")

    const vector = matchSnippet(snippets, "vbb", mathAuto)
    assert.equal(parseReplacement(renderSnippetReplacement(vector.snippet, vector.match)).finalText, "\\vb{}")
    assert.notEqual(vector.snippet.replacement, "\\mathbb{[[0]]}", "vbb must remain the vector shorthand")

    const autoSubscriptCases = new Map([
        ["\\alpha2", "\\alpha_{2}"],
        ["\\beta2", "\\beta_{2}"],
        ["\\theta_{2}3", "\\theta_{23}"],
        ["\\hat{\\beta}2", "\\hat{\\beta}_{2}"],
        ["\\hat{\\vec{\\theta}}3", "\\hat{\\vec{\\theta}}_{3}"],
    ])
    for (const [input, expected] of autoSubscriptCases) {
        const result = matchSnippet(snippets, input, mathAuto)
        assert.ok(result, `${input} must match an auto-subscript rule`)
        const replacement = renderSnippetReplacement(result.snippet, result.match)
        assert.equal(parseReplacement(replacement).finalText, expected)
    }

    for (const input of ["~=", "\\~="]) {
        const result = matchSnippet(snippets, input, mathAuto)
        assert.equal(result.match[0], input)
        assert.equal(parseReplacement(renderSnippetReplacement(result.snippet, result.match)).finalText, "\\approx ")
    }

    const environment = matchSnippet(snippets, "align", { ...mathAuto, inInlineMath: true })
    assert.notEqual(environment?.snippet.environment, true, "environment snippets are disabled in inline math")

    const manualOnly = compileSnippets([{ trigger: "xx", replacement: "ok", options: "m" }])
    assert.equal(matchSnippet(manualOnly, "xx", mathAuto), null, "manual snippets must not auto-expand")
    assert.ok(matchSnippet(manualOnly, "xx", { ...mathAuto, isAutoKey: false }))

    const overlapping = compileSnippets([
        { trigger: "bc", replacement: "short", options: "mA" },
        { trigger: "abc", replacement: "long", options: "mA" },
    ])
    assert.equal(
        matchSnippet(overlapping, "abc", mathAuto).snippet.replacement,
        "long",
        "equal-priority snippets must prefer the longest match"
    )

    const conflictCases = new Map([
        ["iiint", "\\iiint"],
        ["<->", "\\leftrightarrow "],
        ["eset", "\\emptyset "],
    ])
    for (const [input, expected] of conflictCases) {
        const result = matchSnippet(snippets, input, mathAuto)
        assert.equal(parseReplacement(renderSnippetReplacement(result.snippet, result.match)).finalText, expected)
    }

    const mathManual = { ...mathAuto, isAutoKey: false }
    const manualConflictCases = new Map([
        ["ddot", "\\ddot{}"],
        ["cdot", "\\cdot "],
        ["para", "\\parallel "],
    ])
    for (const [input, expected] of manualConflictCases) {
        const result = matchSnippet(snippets, input, mathManual)
        assert.equal(parseReplacement(renderSnippetReplacement(result.snippet, result.match)).finalText, expected)
    }

    assert.deepEqual(parseReplacement("\\frac{${0:x}}{$1}$2"), {
        finalText: "\\frac{x}{}",
        tabstops: [
            { idx: 0, start: 6, end: 7 },
            { idx: 1, start: 9, end: 9 },
            { idx: 2, start: 10, end: 10 },
        ],
    })

    assert.deepEqual(parseReplacement("\\{ ${0} \\}$1"), {
        finalText: "\\{  \\}",
        tabstops: [
            { idx: 0, start: 3, end: 3 },
            { idx: 1, start: 6, end: 6 },
        ],
    }, "braced tabstops without defaults must remain navigable")
}

function testSnippetProfiles() {
    const actions = { toggleInlineMath() {}, toggleDisplayMath() {} }
    const physics = createSnippets({ ...actions, usePhysicsPackage: true })
    const noPhysics = createSnippets({ ...actions, usePhysicsPackage: false })

    assert.equal(resolveUsePhysicsPackage(), true, "physics must remain the default profile")
    assert.equal(resolveUsePhysicsPackage({}), true)
    assert.equal(resolveUsePhysicsPackage({ use_physics_package: true }), true)
    assert.equal(resolveUsePhysicsPackage({ use_physics_package: false }), false)
    assert.throws(() => resolveUsePhysicsPackage({ use_physics_package: "false" }), /must be true or false/)
    assert.equal(noPhysics.length, physics.length, "profiles must expose the same triggers")

    const ids = physics.map(snippet => snippet.id)
    assert.equal(new Set(ids).size, physics.length, "snippet ids must be unique")
    assert.ok(ids.every(Boolean), "every snippet must have a stable id")
    const changedIds = physics
        .filter((snippet, index) =>
            typeof snippet.replacement === "string" &&
            snippet.replacement !== noPhysics[index].replacement
        )
        .map(snippet => snippet.id)
    assert.equal(changedIds.length, 60, "all profile-specific replacements must remain selectable")

    for (const snippet of noPhysics) {
        if (typeof snippet.replacement === "string") {
            assert.doesNotMatch(snippet.replacement, PHYSICS_COMMAND_PATTERN)
        }
    }

    const compiled = compileSnippets(noPhysics)
    const mathAuto = { inMath: true, inNewLine: false, inInlineMath: false, isAutoKey: true }
    const cases = new Map([
        ["vbb", "\\mathbf{}"],
        ["ddx", "\\,\\mathrm{d}x"],
        ["abs", "\\left|  \\right|"],
        ["lr(", "\\left(  \\right)"],
        ["mat(", "\\begin{pmatrix}\n\n\\end{pmatrix}"],
    ])
    for (const [input, expected] of cases) {
        const result = matchSnippet(compiled, input, mathAuto)
        assert.ok(result, `${input} must exist in the no-physics profile`)
        assert.equal(parseReplacement(renderSnippetReplacement(result.snippet, result.match)).finalText, expected)
    }
}

function testSession() {
    const editor = {}
    const session = new PluginSession(editor)
    session.tabstops.push({ start: 1, end: 2 })
    session.lastExpansion = { finalText: "x" }
    session.activeInlineLocator = { cid: "block-1", index: 0 }
    const autoToken = session.autoExpandToken
    const jumpToken = session.tabstopJumpToken

    session.resetForDocument()
    assert.equal(session.editor, editor)
    assert.deepEqual(session.tabstops, [])
    assert.equal(session.lastExpansion, null)
    assert.equal(session.activeInlineLocator, null)
    assert.equal(session.autoExpandToken, autoToken + 1)
    assert.equal(session.tabstopJumpToken, jumpToken + 1)

    session.lastExpansion = {
        matched: "@a",
        finalText: "\\alpha",
        isCm: true,
        input: {},
        startIndex: 0,
    }
    assert.equal(session.undoLastExpansion(), false)
    assert.notEqual(session.lastExpansion, null)
    assert.equal(session.releaseCodeMirrorUndo(), true)
    assert.equal(session.lastExpansion, null)

    session.dispose()
    assert.equal(session.disposed, true)
    assert.equal(session.editor, null)
}

function createEventTarget() {
    const listeners = new Map()
    return {
        listeners,
        addEventListener(type, listener) { listeners.set(type, listener) },
        removeEventListener(type, listener) {
            if (listeners.get(type) === listener) listeners.delete(type)
        },
    }
}

function testAdapter() {
    const write = createEventTarget()
    const document = createEventTarget()
    document.querySelector = selector => selector === "#write" ? write : null
    document.execCommand = (...args) => args

    const hubListeners = new Map()
    const eventHub = {
        eventType: { fileContentLoaded: "fileContentLoaded" },
        addEventListener(type, listener) { hubListeners.set(type, listener) },
        removeEventListener(type, listener) {
            if (hubListeners.get(type) === listener) hubListeners.delete(type)
        },
    }
    const selectionApi = {
        setRange(range, preserve) {
            this.range = range
            this.preserve = preserve
        },
    }
    const window = { File: { editor: { selection: selectionApi } } }
    const adapter = new TyporaEditorAdapter({ entities: { eWrite: write }, eventHub }, { window, document })
    const handlers = { onKeyDown() {}, onInput() {}, onSelectionChange() {} }
    const removeEditing = adapter.addEditingListeners(handlers)
    const removeFile = adapter.addFileContentLoadedListener(() => {})

    assert.deepEqual([...write.listeners.keys()].sort(), ["input", "keydown"])
    assert.ok(document.listeners.has("selectionchange"))
    assert.ok(hubListeners.has("fileContentLoaded"))
    assert.deepEqual(adapter.replaceDomSelection("x"), ["insertText", false, "x"])

    const range = {
        startContainer: { textContent: "a" },
        startOffset: 1,
        endContainer: { textContent: "b" },
        endOffset: 0,
    }
    assert.equal(adapter.setDomSelection(range), true)
    assert.equal(selectionApi.range, range)
    assert.equal(selectionApi.preserve, true)

    removeEditing()
    removeFile()
    assert.equal(write.listeners.size, 0)
    assert.equal(document.listeners.size, 0)
    assert.equal(hubListeners.size, 0)
}

function testDomContext() {
    const source = { nodeType: 1, tagName: "SCRIPT", parentElement: null }
    const paragraph = {
        nodeType: 1,
        tagName: "P",
        parentElement: null,
        isConnected: true,
        hasAttribute: name => name === "cid",
        getAttribute: name => name === "cid" ? "block-1" : null,
        querySelectorAll: selector => selector === ".md-inline-math" ? [inline] : [],
    }
    const inline = {
        nodeType: 1,
        parentElement: paragraph,
        isConnected: true,
        classList: { contains: name => name === "md-inline-math" },
        querySelector: selector => selector === "script" ? source : null,
    }
    source.parentElement = inline
    const sourceText = { nodeType: 3, parentElement: source }
    const paragraphText = { nodeType: 3, parentElement: paragraph }

    assert.equal(getInlineMathSource(sourceText), source)
    assert.equal(getInlineMathElement(sourceText), inline)
    assert.equal(getEditingRoot(sourceText, () => paragraph), source,
        "inline math offsets must be relative to the TeX source, not its paragraph or MathJax preview")
    assert.equal(getEditingRoot(paragraphText, () => paragraph), paragraph)

    const activeSource = { nodeType: 1, isConnected: true, parentElement: null }
    const activeInline = {
        nodeType: 1,
        isConnected: true,
        classList: { contains: name => name === "md-inline-math" },
        querySelector(selector) {
            if (selector === "script") return null
            return selector === ".md-after.md-meta" ? activeSource : null
        },
    }
    activeSource.parentElement = activeInline
    const activeText = { nodeType: 3, parentElement: activeSource }
    assert.equal(getInlineMathSource(activeText), activeSource,
        "expanded inline math must use Typora's editable md-after source when no script exists")

    const locator = createInlineMathLocator(inline)
    assert.equal(locator.cid, "block-1")
    assert.equal(locator.index, 0)

    source.isConnected = false
    inline.isConnected = false
    paragraph.isConnected = false
    const liveSource = { nodeType: 1, tagName: "SCRIPT", isConnected: true, parentElement: null }
    const rebuiltInline = {
        nodeType: 1,
        isConnected: true,
        classList: { contains: name => name === "md-inline-math" },
        querySelector: selector => selector === "script" ? liveSource : null,
    }
    liveSource.parentElement = rebuiltInline
    const rebuiltParagraph = {
        isConnected: true,
        getAttribute: name => name === "cid" ? "block-1" : null,
        querySelectorAll: selector => selector === ".md-inline-math" ? [rebuiltInline] : [],
    }
    rebuiltInline.parentElement = rebuiltParagraph
    const document = {
        querySelectorAll: selector => selector === "[cid]" ? [rebuiltParagraph] : [],
    }

    assert.equal(resolveInlineMathElement(locator, document), rebuiltInline,
        "a detached inline wrapper must be resolved from its block cid and formula index")
    assert.deepEqual(resolveLiveInlineMathSource(locator, null, document), {
        inline: rebuiltInline,
        source: liveSource,
    }, "tabstops must survive Typora rebuilding both the wrapper and source node")
}

function testEntrypoint() {
    global.BaseCustomPlugin = class {}
    const exported = require("../latexSuitePlugin")
    assert.equal(typeof exported.plugin, "function")

    const write = createEventTarget()
    const document = createEventTarget()
    document.activeElement = null
    document.body = write
    document.querySelector = selector => selector === "#write" ? write : null
    document.execCommand = () => true
    document.dispatchEvent = () => {}
    const eventHub = {
        eventType: { fileContentLoaded: "fileContentLoaded" },
        listener: null,
        addEventListener(type, listener) { this.listener = listener },
        removeEventListener(type, listener) {
            if (this.listener === listener) this.listener = null
        },
    }
    const file = { option: { noPairingMatch: false }, editor: {} }
    global.Node = { ELEMENT_NODE: 1, TEXT_NODE: 3 }
    global.document = document
    global.window = { document, File: file, getSelection: () => null }
    global.File = file

    const instance = new exported.plugin()
    instance.utils = { entities: { eWrite: write }, eventHub }
    instance.process()
    assert.ok(write.listeners.has("keydown"), "keyboard handling must be scoped to #write")
    assert.ok(write.listeners.has("input"), "input handling must be scoped to #write")
    assert.equal(typeof eventHub.listener, "function", "file lifecycle reset must be registered")

    const inline = {
        nodeType: Node.ELEMENT_NODE,
        tagName: "SPAN",
        parentElement: null,
        classList: { contains: name => name === "md-inline-math" },
        getAttribute: () => null,
    }
    const activeInput = {
        nodeType: Node.ELEMENT_NODE,
        tagName: "INPUT",
        parentElement: inline,
        value: "beta",
        selectionStart: 4,
        selectionEnd: 4,
        closest(selector) {
            if (selector === ".CodeMirror") return null
            if (selector.includes(".md-inline-math")) return inline
            return null
        },
        setRangeText(text, start, end) {
            this.value = this.value.slice(0, start) + text + this.value.slice(end)
            this.selectionStart = this.selectionEnd = start + text.length
        },
        dispatchEvent() {},
    }
    const staleOutsideSelection = {
        nodeType: Node.ELEMENT_NODE,
        tagName: "P",
        parentElement: null,
        classList: { contains: () => false },
        getAttribute: () => null,
    }
    document.activeElement = activeInput
    window.getSelection = () => ({ anchorNode: staleOutsideSelection, rangeCount: 0 })
    write.listeners.get("input")({ inputType: "insertText" })
    assert.equal(activeInput.value, "\\beta", "focused inline input must win over a stale outside selection")

    eventHub.listener()
    global.window.__latexSuitePluginListeners__.cleanup()
    assert.equal(write.listeners.size, 0)
    assert.equal(eventHub.listener, null)

    delete global.BaseCustomPlugin
    delete global.Node
    delete global.document
    delete global.window
    delete global.File
}

testMatcher()
testSnippetProfiles()
testSession()
testAdapter()
testDomContext()
testEntrypoint()
console.log("All Latex Suite tests passed")
