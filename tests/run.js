const assert = require("node:assert/strict")

const { TyporaEditorAdapter } = require("../latex-suite/editor-adapter")
const { compileSnippets, matchSnippet, parseReplacement, renderSnippetReplacement } = require("../latex-suite/matcher")
const { PluginSession } = require("../latex-suite/session")
const { createSnippets } = require("../latex-suite/snippets")

function testMatcher() {
    const snippets = compileSnippets(createSnippets({ toggleInlineMath() {}, toggleDisplayMath() {} }))
    const mathAuto = { inMath: true, inNewLine: false, inInlineMath: false, isAutoKey: true }

    const beta = matchSnippet(snippets, "beta", mathAuto)
    assert.equal(beta.match[0], "beta", "beta must not degrade into b + eta")

    const hat = matchSnippet(snippets, "hat", mathAuto)
    assert.equal(hat.match[0], "hat", "standalone hat must win at a token boundary")

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

    const environment = matchSnippet(snippets, "align", { ...mathAuto, inInlineMath: true })
    assert.notEqual(environment?.snippet.environment, true, "environment snippets are disabled in inline math")

    const manualOnly = compileSnippets([{ trigger: "xx", replacement: "ok", options: "m" }])
    assert.equal(matchSnippet(manualOnly, "xx", mathAuto), null, "manual snippets must not auto-expand")
    assert.ok(matchSnippet(manualOnly, "xx", { ...mathAuto, isAutoKey: false }))

    assert.deepEqual(parseReplacement("\\frac{${0:x}}{$1}$2"), {
        finalText: "\\frac{x}{}",
        tabstops: [
            { idx: 0, start: 6, end: 7 },
            { idx: 1, start: 9, end: 9 },
            { idx: 2, start: 10, end: 10 },
        ],
    })
}

function testSession() {
    const editor = {}
    const session = new PluginSession(editor)
    session.tabstops.push({ start: 1, end: 2 })
    session.lastExpansion = { finalText: "x" }
    const autoToken = session.autoExpandToken

    session.resetForDocument()
    assert.equal(session.editor, editor)
    assert.deepEqual(session.tabstops, [])
    assert.equal(session.lastExpansion, null)
    assert.equal(session.autoExpandToken, autoToken + 1)

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
    const adapter = new TyporaEditorAdapter({ entities: { eWrite: write }, eventHub }, { window: {}, document })
    const handlers = { onKeyDown() {}, onInput() {}, onSelectionChange() {} }
    const removeEditing = adapter.addEditingListeners(handlers)
    const removeFile = adapter.addFileContentLoadedListener(() => {})

    assert.deepEqual([...write.listeners.keys()].sort(), ["input", "keydown"])
    assert.ok(document.listeners.has("selectionchange"))
    assert.ok(hubListeners.has("fileContentLoaded"))
    assert.deepEqual(adapter.replaceDomSelection("x"), ["insertText", false, "x"])

    removeEditing()
    removeFile()
    assert.equal(write.listeners.size, 0)
    assert.equal(document.listeners.size, 0)
    assert.equal(hubListeners.size, 0)
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
testSession()
testAdapter()
testEntrypoint()
console.log("All Latex Suite tests passed")
