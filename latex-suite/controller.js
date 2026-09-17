// Latex Suite controller and snippet runtime.
// Cloned from https://github.com/artisticat1/obsidian-latex-suite/blob/main/src/default_snippet_variables.js
const { compileSnippets, matchSnippet, parseReplacement, renderSnippetReplacement } = require("./matcher")
const { PluginSession } = require("./session")
const { TyporaEditorAdapter } = require("./editor-adapter")
const {
    createInlineMathLocator,
    getEditingRoot,
    getInlineMathElement,
    getInlineMathSource,
    resolveInlineMathElement,
    resolveLiveInlineMathSource,
} = require("./dom-context")
const { createSnippets, resolveUsePhysicsPackage } = require("./snippets")

let session = new PluginSession()
let compiledSnippets = []
const INLINE_END_SENTINEL = "\u200B"
const INLINE_PLACEHOLDER_FILLER = "\u00A0"
const INLINE_TABSTOP_RESELECT_DELAY_MS = 150

function resetSession(editor = null) {
    session.dispose()
    session = new PluginSession(editor)
    return session
}

function scheduleModeToggle(action) {
    const owner = session
    const token = ++owner.modeToggleToken
    const activeInput = document.activeElement
    const selection = window.getSelection()
    const anchor = selection?.anchorNode || null
    const root = anchor ? getCurrentBlock(anchor) : null

    setTimeout(() => {
        if (owner.disposed || owner !== session || token !== owner.modeToggleToken || !isInEditableContext()) return

        if (activeInput && document.activeElement !== activeInput) return
        if (!activeInput && root) {
            const currentSelection = window.getSelection()
            const currentAnchor = currentSelection?.anchorNode
            if (!currentAnchor || getCurrentBlock(currentAnchor) !== root) return
        }

        try {
            action()
        } catch (e) {
            console.warn("Latex Suite mode toggle failed", e)
        }
    }, 30)
}

// ── Typora Environment Detection / Typora 环境检测 ───────────────────────────────
function isInMath() {
    const activeEl = document.activeElement
    const selectionNode = window.getSelection()?.anchorNode

    // At the start of an inline formula Typora can focus the math input while
    // its DOM selection still points to the paragraph outside.  Focus is the
    // authoritative editing surface; the selection is only a fallback.
    for (const node of [activeEl, selectionNode]) {
        let el = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
        while (el) {
            const cls = el.classList
            if (
                cls &&
                (cls.contains("md-math-container") ||
                    cls.contains("md-inline-math") ||
                    cls.contains("md-math-block") ||
                    cls.contains("md-blockmath") ||
                    cls.contains("mathjax-block") ||
                    el.tagName === "MJXCONTAINER" ||
                    el.getAttribute?.("data-type") === "math")
            )
                return true
            el = el.parentElement
        }
    }
    return false
}

function isNewLine() {
    const active = getActiveTextInput()
    if (active) {
        const pos = active.selectionStart ?? 0
        const before = active.value.slice(0, pos)
        const lineBefore = before.slice(before.lastIndexOf("\n") + 1)
        return /^\s*$/.test(lineBefore)
    }

    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return false
    const caret = sel.getRangeAt(0).cloneRange()
    caret.collapse(true)
    const root = getEditingRoot(caret.endContainer, getCurrentBlock)
    const pre = document.createRange()
    pre.selectNodeContents(root)
    pre.setEnd(caret.endContainer, caret.endOffset)
    const before = pre.toString() || ""
    const lineBefore = before.slice(before.lastIndexOf("\n") + 1)
    return /^\s*$/.test(lineBefore)
}

function getCurrentBlock(node) {
    let el = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
    while (el && el.id !== "write" && el !== document.body) {
        if (
            el.hasAttribute?.("md-block") ||
            /^(P|H[1-6]|LI|BLOCKQUOTE|DIV|TR|TD|TABLE|TBODY|THEAD)$/.test(el.tagName)
        ) {
            return el
        }
        el = el.parentElement
    }
    return document.querySelector("#write") || document.body
}

function getEditorRoot() {
    return document.querySelector("#write") || document.body
}

function getActiveTextInput() {
    const el = document.activeElement
    if (!el) return null
    const tag = el.tagName
    if (tag === "TEXTAREA") return el
    if (tag === "INPUT" && typeof el.selectionStart === "number") return el
    return null
}

function isInEditableContext() {
    const active = getActiveTextInput()
    if (active) {
        if (active.closest?.("#write")) return true
        if (active.closest?.(".md-math-container, .md-inline-math, .md-math-block, .md-blockmath")) return true
    }

    const anchor = window.getSelection()?.anchorNode
    const el = anchor?.nodeType === Node.ELEMENT_NODE ? anchor : anchor?.parentElement
    return Boolean(el?.closest?.("#write"))
}

// Unified editor state retrieval across all contexts (CodeMirror, input, DOM)
function isFocusedCodeMirror(cm) {
    if (!cm) return false

    const active = document.activeElement
    const input = typeof cm.getInputField === "function" ? cm.getInputField() : null
    if (input && active === input) return true

    const wrapper = typeof cm.getWrapperElement === "function" ? cm.getWrapperElement() : null
    if (wrapper && active && wrapper.contains(active)) return true

    return typeof cm.hasFocus === "function" && cm.hasFocus()
}

function getCodeMirrorState(cm) {
    if (!cm || typeof cm.getCursor !== "function" || typeof cm.getRange !== "function") return null
    const cursor = cm.getCursor()
    const textBefore = cm.getRange({ line: 0, ch: 0 }, cursor)
    const textAfter = cm.getRange(cursor, { line: cm.lineCount(), ch: 0 })
    return { type: "cm", cm, cursor, textBefore, textAfter }
}

function getFocusedCodeMirror() {
    const active = document.activeElement
    const activeCm = active?.closest?.(".CodeMirror")?.CodeMirror

    const selectionNode = window.getSelection()?.anchorNode
    const contextNode = selectionNode || active
    const contextEl = contextNode?.nodeType === Node.ELEMENT_NODE ? contextNode : contextNode?.parentElement
    let mathContainer = contextEl
    while (
        mathContainer &&
        !mathContainer.classList?.contains("md-inline-math") &&
        !mathContainer.classList?.contains("md-math-container") &&
        !mathContainer.classList?.contains("md-math-block") &&
        !mathContainer.classList?.contains("md-blockmath")
    ) {
        mathContainer = mathContainer.parentElement
    }

    if (isFocusedCodeMirror(activeCm)) {
        const wrapper = typeof activeCm.getWrapperElement === "function" ? activeCm.getWrapperElement() : null
        if (!mathContainer || !wrapper || mathContainer.contains(wrapper)) return activeCm
    }

    const candidates = [window.File?.editor?.mathBlock?.currentCm, window.File?.editor?.fences?.currentCm]
    return (
        candidates.find((cm) => {
            if (!isFocusedCodeMirror(cm)) return false
            if (!mathContainer || typeof cm.getWrapperElement !== "function") return true
            const wrapper = cm.getWrapperElement()
            return !wrapper || mathContainer.contains(wrapper)
        }) || null
    )
}

function getEditorState(inMathOnly = false) {
    const inMath = isInMath()
    if (inMathOnly && !inMath) return null

    // Prefer the CodeMirror instance that owns the active input. The global
    // mathBlock.currentCm can still point at a previously edited block while
    // the user is currently inside an inline formula.
    if (inMath) {
        const focusedCmState = getCodeMirrorState(getFocusedCodeMirror())
        if (focusedCmState) return focusedCmState
    }

    // Try input/textarea
    const active = getActiveTextInput()
    if (active) {
        const pos = active.selectionStart ?? 0
        return {
            type: "input",
            input: active,
            textBefore: active.value.slice(0, pos),
            textAfter: active.value.slice(pos),
            pos,
        }
    }

    // Try DOM selection
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
        const caret = sel.getRangeAt(0).cloneRange()
        caret.collapse(true)
        const block = getEditingRoot(caret.endContainer, getCurrentBlock)
        const pre = document.createRange()
        pre.selectNodeContents(block)
        pre.setEnd(caret.endContainer, caret.endOffset)
        const textBefore = pre.toString() || ""
        return { type: "dom", textBefore, textAfter: "", block }
    }

    return null
}

function getTextBeforeCursor(maxLen = 120) {
    const state = getEditorState()
    if (state) {
        const text = state.textBefore
        return text.slice(Math.max(0, text.length - maxLen))
    }
    return ""
}

function getRangeFromCaretBack(count) {
    const active = getActiveTextInput()
    if (active) {
        const end = active.selectionStart ?? 0
        const start = Math.max(0, end - count)
        return { input: active, start, end }
    }

    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || count <= 0) return null
    const caret = sel.getRangeAt(0).cloneRange()
    caret.collapse(true)

    const root = getEditingRoot(caret.endContainer, getCurrentBlock)
    const pre = document.createRange()
    pre.selectNodeContents(root)
    pre.setEnd(caret.endContainer, caret.endOffset)
    const caretIndex = pre.toString().length
    const startIndex = caretIndex - count
    if (startIndex < 0) return null

    return getRangeFromAbsoluteOffsets(startIndex, caretIndex, root)
}

function getRangeFromAbsoluteOffsets(startIndex, endIndex, root = getEditorRoot()) {
    if (!root || startIndex < 0 || endIndex < startIndex) return null

    function findBoundary(offset, preferNext) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        let node
        let total = 0
        let lastNode = null

        while ((node = walker.nextNode())) {
            lastNode = node
            const len = (node.textContent || "").length
            const nextTotal = total + len

            if (offset < nextTotal || (offset === nextTotal && !preferNext)) {
                return { node, offset: Math.max(0, offset - total) }
            }

            total = nextTotal
        }

        if (lastNode && offset === total) {
            return { node: lastNode, offset: (lastNode.textContent || "").length }
        }

        return null
    }

    // Empty placeholders frequently sit exactly between two text nodes. Use
    // one canonical boundary for both endpoints so the range never becomes
    // reversed (next-node start + previous-node end).
    const start = findBoundary(startIndex, true)
    const end = startIndex === endIndex ? start : findBoundary(endIndex, false)
    if (!start || !end) return null

    const range = document.createRange()
    try {
        range.setStart(start.node, start.offset)
        range.setEnd(end.node, end.offset)
    } catch {
        return null
    }
    return range
}
function getMathContext() {
    const state = getEditorState(true)
    if (!state) return null

    // Convert unified state back to expected format
    return {
        textBefore: state.textBefore,
        textAfter: state.textAfter,
        cm: state.cm,
        cursor: state.cursor,
    }
}

function getInlineMathElementFromFocus() {
    const candidates = [window.getSelection()?.anchorNode, document.activeElement]

    for (const candidate of candidates) {
        let el = candidate?.nodeType === Node.ELEMENT_NODE ? candidate : candidate?.parentElement
        while (el) {
            if (el.classList?.contains("md-inline-math")) return el
            el = el.parentElement
        }
    }

    return null
}

function getActiveInlineMathElement() {
    const focused = getInlineMathElementFromFocus()
    if (focused) return focused

    // During a Typora subtree rebuild the selection can temporarily remain on
    // a detached node. Only then fall back to the stored structural locator;
    // a connected selection outside math must remain authoritative.
    const anchor = window.getSelection()?.anchorNode
    if (anchor && anchor.isConnected !== false) return null
    return resolveInlineMathElement(session.activeInlineLocator, document)
}

function leaveInlineMath() {
    const inline = resolveInlineMathElement(session.activeInlineLocator, document) || getInlineMathElementFromFocus()
    if (!inline || !inline.classList.contains("md-expand")) return false
    const locator = createInlineMathLocator(inline) || session.activeInlineLocator

    const source = getInlineMathSource(inline)
    if (source?.textContent?.includes(INLINE_END_SENTINEL)) {
        const walker = document.createTreeWalker(source, NodeFilter.SHOW_TEXT)
        const textNodes = []
        let node
        while ((node = walker.nextNode())) textNodes.push(node)
        for (const textNode of textNodes) {
            textNode.textContent = (textNode.textContent || "").replace(/\u200B/g, "")
        }
    }

    // Collapse the inline editor first. Typora may rebuild its children while
    // doing this, so placing the caret before removing md-expand can move the
    // selection to the beginning of the formula.
    inline.classList.remove("md-expand")
    try {
        if (window.$) window.$(inline).trigger("inline-math-changed")
    } catch {}

    const placeAfter = () => {
        const liveInline = resolveInlineMathElement(locator, document)
        if (!liveInline) return
        const sel = window.getSelection()
        if (!sel) return
        const range = document.createRange()
        const next = liveInline.nextSibling
        if (next?.nodeType === Node.TEXT_NODE) {
            range.setStart(next, 0)
        } else {
            range.setStartAfter(liveInline)
        }
        range.collapse(true)
        if (!session.editor?.setDomSelection?.(range)) {
            sel.removeAllRanges()
            sel.addRange(range)
        }
        window.File?.editor?.refocus?.()
        document.dispatchEvent(new Event("selectionchange"))
    }

    placeAfter()
    setTimeout(placeAfter, INLINE_TABSTOP_RESELECT_DELAY_MS)
    session.activeInlineLocator = null
    return true
}

function getCurrentEnvironmentName(textBefore) {
    if (!textBefore) return null
    const envRe = /\\(begin|end)\{([a-zA-Z0-9*]+)\}/g
    let match
    const envStack = []

    while ((match = envRe.exec(textBefore)) !== null) {
        if (match[1] === "begin") {
            envStack.push(match[2])
        } else if (envStack.length > 0 && envStack[envStack.length - 1] === match[2]) {
            envStack.pop()
        }
    }

    return envStack.length > 0 ? envStack[envStack.length - 1] : null
}

function isMatrixLikeEnvironment(envName) {
    return !!envName && /(matrix|cases|align|array|gathered)/.test(envName)
}

function hasPhysicsMatrixShortcutContext(text) {
    if (!text) return false
    let p = 0
    let b = 0
    let c = 0

    for (let i = text.length - 1; i >= 0; i--) {
        const char = text[i]
        if (char === ")") p++
        else if (char === "(") p--
        else if (char === "]") b++
        else if (char === "[") b--
        else if (char === "}") {
            if (i > 0 && text[i - 1] === "\\") {
                i--
            } else {
                c++
            }
        } else if (char === "{") {
            if (i > 0 && text[i - 1] === "\\") {
                i--
            } else {
                c--
            }
        }

        if (p < 0 || b < 0 || c < 0) {
            const preStr = text.slice(0, i)
            return /\\([pbm]?mqty|mdet)$/.test(preStr)
        }
    }

    return false
}

function isInsideEnvironment(ctx) {
    if (!ctx || !ctx.textBefore) return false

    const currentEnv = getCurrentEnvironmentName(ctx.textBefore)
    if (isMatrixLikeEnvironment(currentEnv)) return true

    return hasPhysicsMatrixShortcutContext(ctx.textBefore)
}

// ── Tabstop State Management / Tabstop 状态管理 ──────────────────────────────

function scheduleAutoExpand() {
    const owner = session
    const token = ++owner.autoExpandToken
    setTimeout(() => {
        if (owner.disposed || owner !== session || token !== owner.autoExpandToken || owner.suppressAutoExpand) return
        if (!isInEditableContext()) return
        tryExpandSnippet(true)
    }, 0)
}

function isLastExpansionActive() {
    const expansion = session.lastExpansion
    if (!expansion || Date.now() - expansion.time >= 5000) return false

    if (expansion.isCm) {
        return getFocusedCodeMirror() === expansion.input
    }

    if (expansion.input) {
        return document.activeElement === expansion.input
    }

    const anchor = window.getSelection()?.anchorNode
    if (!anchor) return false
    const liveInline = resolveInlineMathElement(expansion.inlineLocator, document)
    if (liveInline?.contains?.(anchor)) return true
    return Boolean(expansion.root?.contains?.(anchor))
}

function clearTabstops() {
    session.tabstops = []
    session.tabstopIdx = 0
    session.tabstopDirty = false
}

function beginSuppressAutoExpand() {
    session.suppressAutoExpand = true
}

function endSuppressAutoExpandSoon() {
    // Delay until after the current event loop to avoid re-expansion triggered by programmatic input events
    // 延迟到当前事件循环之后，避免由程序化插入触发的 input 事件再次展开
    const owner = session
    setTimeout(() => {
        if (!owner.disposed && owner === session) owner.suppressAutoExpand = false
    }, 0)
}

function scheduleInlineTabstopReselect(idx) {
    const owner = session
    const token = ++owner.tabstopJumpToken

    // Typora's inline editor runs a delayed render pass (about 100 ms in
    // 1.14.10) that restores its own caret. Re-select the placeholder after
    // that pass so the first typed character lands in $0.
    setTimeout(() => {
        if (owner.disposed || owner !== session || token !== owner.tabstopJumpToken) return
        if (owner.tabstopIdx !== idx || idx >= owner.tabstops.length) return

        const tabstop = owner.tabstops[idx]
        if (!tabstop || tabstop.input || tabstop.isCm || !tabstop.inlineLocator) return
        jumpToTabstop(idx)
    }, INLINE_TABSTOP_RESELECT_DELAY_MS)
}

function getAbsoluteCaretIndex(root) {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    const caret = sel.getRangeAt(0).cloneRange()
    caret.collapse(true)
    const rangeRoot = root || getEditingRoot(caret.endContainer, getCurrentBlock)
    if (root && typeof root.contains === "function" && !root.contains(caret.endContainer)) return null
    const pre = document.createRange()
    pre.selectNodeContents(rangeRoot)
    pre.setEnd(caret.endContainer, caret.endOffset)
    return pre.toString().length
}

function getLiveTabstopRoot(tabstop) {
    if (!tabstop || tabstop.input) return null

    // Typora can rebuild both the <script> and its wrapper. Resolve by the
    // containing block's cid plus the formula index, not by the stale selection.
    const locator = tabstop.inlineLocator || session.activeInlineLocator
    const resolved = resolveLiveInlineMathSource(locator, getInlineMathElementFromFocus(), document)
    if (!resolved) return null
    tabstop.inlineLocator = createInlineMathLocator(resolved.inline) || locator
    session.activeInlineLocator = tabstop.inlineLocator
    tabstop.root = resolved.source
    return resolved.source
}

function lineChToOffset(text, pos) {
    const lines = text.split("\n")
    let offset = 0
    for (let i = 0; i < pos.line && i < lines.length; i++) {
        offset += lines[i].length + 1
    }
    return offset + pos.ch
}

// Convert relative offset within inserted text to absolute CodeMirror position
function offsetToAbsolutePosition(offset, insertedText, basePos) {
    const slice = insertedText.slice(0, offset)
    const lines = slice.split("\n")
    const relLine = lines.length - 1
    const relCh = lines[relLine].length
    return {
        line: basePos.line + relLine,
        ch: relLine === 0 ? basePos.ch + relCh : relCh,
    }
}

function shiftFollowingTabstops(currentIdx) {
    const cur = session.tabstops[currentIdx]
    if (!cur || currentIdx + 1 >= session.tabstops.length) return
    if (!session.tabstopDirty) return

    if (cur.input) {
        let selStart = cur.start
        let selEnd = cur.end

        if (cur.isCm) {
            const cm = cur.input
            const text = cm.getValue()
            const sels = cm.listSelections ? cm.listSelections() : []
            if (sels.length > 0) {
                const head = lineChToOffset(text, sels[0].head)
                const anchor = lineChToOffset(text, sels[0].anchor)
                selStart = Math.min(head, anchor)
                selEnd = Math.max(head, anchor)
            } else {
                const pos = cm.getCursor()
                const offset = lineChToOffset(text, pos)
                selStart = offset
                selEnd = offset
            }
        } else {
            if (document.activeElement !== cur.input) return
            selStart = cur.input.selectionStart ?? cur.start
            selEnd = cur.input.selectionEnd ?? cur.end
        }

        const oldLen = Math.max(0, cur.end - cur.start)
        const stillSelected = selStart === cur.start && selEnd === cur.end
        const newLen = stillSelected ? oldLen : Math.max(0, selStart - cur.start)
        const delta = newLen - oldLen
        if (!Number.isFinite(delta) || delta === 0) return

        cur.end = cur.start + newLen

        for (let i = currentIdx + 1; i < session.tabstops.length; i++) {
            const ts = session.tabstops[i]
            if (ts.input === cur.input) {
                ts.start += delta
                ts.end += delta
            }
        }
        session.tabstopDirty = false
        return
    }

    const liveRoot = getLiveTabstopRoot(cur)
    if (!liveRoot) {
        clearTabstops()
        return
    }
    const caret = getAbsoluteCaretIndex(liveRoot)
    if (caret == null) return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return

    const oldLen = Math.max(0, cur.endIndex - cur.startIndex)
    const stillSelected = !sel.getRangeAt(0).collapsed
    const newLen = stillSelected ? oldLen : Math.max(0, caret - cur.startIndex)
    const delta = newLen - oldLen
    if (!Number.isFinite(delta) || delta === 0) return

    cur.endIndex = cur.startIndex + newLen

    for (let i = currentIdx + 1; i < session.tabstops.length; i++) {
        const ts = session.tabstops[i]
        if (!ts.input) {
            ts.startIndex += delta
            ts.endIndex += delta
        }
    }
    session.tabstopDirty = false
}

function selectPreviousChars(count) {
    const sel = window.getSelection()
    if (count <= 0) return false

    const range = getRangeFromCaretBack(count)
    if (range?.input) {
        const { input, start, end } = range
        input.setSelectionRange(start, end)
        return true
    }

    if (!sel || sel.rangeCount === 0) return false
    if (range) {
        sel.removeAllRanges()
        sel.addRange(range)
        return true
    }

    // Compatible with cross-node backward selection (common in Typora editors)
    // 兼容跨节点回退选择（Typora 编辑区常见）
    if (typeof sel.modify === "function") {
        for (let i = 0; i < count; i++) {
            sel.modify("extend", "backward", "character")
        }
        return true
    }

    return false
}

// ── Core Expansion Function / 核心展开函数 ──────────────────────────────────
function tryExpandSnippet(isAutoKey) {
    const inMath = isInMath()
    const inNewLine = isNewLine()
    const before = getTextBeforeCursor()
    if (!before && !isAutoKey) return false

    const result = matchSnippet(compiledSnippets, before, {
        inMath,
        inNewLine,
        inInlineMath: Boolean(getActiveInlineMathElement()),
        isAutoKey,
    })
    if (!result) return false

    const { snippet, match } = result
    let actualMatched = match[0]

    // Smartly absorb leading backslash: prevent repeating into \\ after manually typing \, while preserving placeholder functionality
    // 智能吸收前导反斜杠：防止手打 \ 后重复补全为 \\，同时也保留 snippet 的占位符功能
    if (typeof snippet.trigger === "string" && !snippet.trigger.startsWith("\\")) {
        const prevChar = before[before.length - match[0].length - 1]
        if (prevChar === "\\") {
            const replacementText = typeof snippet.replacement === "function" ? "" : snippet.replacement
            if (replacementText.startsWith("\\")) {
                actualMatched = "\\" + match[0]
            }
        }
    }

    // Calculate replacement content / 计算替换内容
    const replacement = renderSnippetReplacement(snippet, match)

    return doExpand(actualMatched, replacement) !== false
}

function isCurrentTabstopSelectionActive() {
    const current = session.tabstops[session.tabstopIdx]
    if (!current) return false

    if (current.isCm) {
        const text = current.input.getValue()
        const selection = current.input.listSelections?.()[0]
        if (!selection) return false
        const head = lineChToOffset(text, selection.head)
        const anchor = lineChToOffset(text, selection.anchor)
        return Math.min(head, anchor) === current.start && Math.max(head, anchor) === current.end
    }

    if (current.input) {
        return (
            document.activeElement === current.input &&
            (current.input.selectionStart ?? -1) === current.start &&
            (current.input.selectionEnd ?? -1) === current.end
        )
    }

    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return false
    const liveRoot = getLiveTabstopRoot(current)
    if (!liveRoot) return false
    const range = sel.getRangeAt(0)
    if (!liveRoot.contains?.(range.startContainer) || !liveRoot.contains?.(range.endContainer)) return false

    try {
        const beforeStart = document.createRange()
        beforeStart.selectNodeContents(liveRoot)
        beforeStart.setEnd(range.startContainer, range.startOffset)
        const beforeEnd = document.createRange()
        beforeEnd.selectNodeContents(liveRoot)
        beforeEnd.setEnd(range.endContainer, range.endOffset)
        return beforeStart.toString().length === current.startIndex && beforeEnd.toString().length === current.endIndex
    } catch {
        return false
    }
}

function materializeInlineTabstops(text, tabstops) {
    const empty = tabstops
        .filter(tabstop => tabstop.start === tabstop.end && tabstop.start < text.length)
        .sort((left, right) => left.start - right.start || left.idx - right.idx)
    if (empty.length === 0) return { text, tabstops }

    let materialized = text
    for (let i = empty.length - 1; i >= 0; i--) {
        const position = empty[i].start
        materialized = materialized.slice(0, position) + INLINE_PLACEHOLDER_FILLER + materialized.slice(position)
    }

    const adjusted = tabstops.map(tabstop => {
        const preceding = empty.filter(candidate =>
            candidate.start < tabstop.start ||
            (candidate.start === tabstop.start && candidate.idx < tabstop.idx)
        ).length
        if (empty.includes(tabstop)) {
            const start = tabstop.start + preceding
            return { ...tabstop, start, end: start + 1, placeholderFiller: true }
        }

        const beforeEnd = empty.filter(candidate => candidate.start < tabstop.end).length
        return {
            ...tabstop,
            start: tabstop.start + preceding,
            end: tabstop.end + beforeEnd,
        }
    })
    return { text: materialized, tabstops: adjusted }
}

function clearUntouchedInlinePlaceholder() {
    const current = session.tabstops[session.tabstopIdx]
    if (!current?.placeholderFiller || current.input) return false

    const liveRoot = getLiveTabstopRoot(current)
    const selection = window.getSelection()
    if (!liveRoot || !selection || selection.rangeCount === 0) return false
    const range = selection.getRangeAt(0)
    if (range.toString() !== INLINE_PLACEHOLDER_FILLER) return false

    session.editor.replaceDomSelection("")
    current.endIndex--
    current.placeholderFiller = false
    for (let i = session.tabstopIdx + 1; i < session.tabstops.length; i++) {
        const tabstop = session.tabstops[i]
        if (!tabstop.input) {
            tabstop.startIndex--
            tabstop.endIndex--
        }
    }
    return true
}

// ── Actual Replacement + Tabstop Injection / 实际替换 + tabstop 注入 ───────────────────────
function doExpand(matched, replacement) {
    beginSuppressAutoExpand()

    const { finalText, tabstops: orderedTabstops } = parseReplacement(replacement)

    const ctx = getMathContext()
    if (ctx && ctx.cm) {
        const cm = ctx.cm
        const curCursor = cm.getCursor()
        const cmText = cm.getValue()

        const endOffset = lineChToOffset(cmText, curCursor)
        // we check how much of the matched text has actually been synced to CodeMirror.
        const preText = cmText.slice(0, endOffset)
        if (matched.length > 0 && !preText.endsWith(matched)) {
            // CodeMirror can dispatch the bubbling input event before its
            // document value has caught up. Never replace only a partial
            // suffix: that leaves the first/last character behind (for
            // example `beta` becoming `e\\beta`). The deferred auto-expand
            // will retry after CodeMirror has committed the input.
            endSuppressAutoExpandSoon()
            setTimeout(() => scheduleAutoExpand(), 0)
            return false
        }

        const actualDeleteLen = matched.length
        const startOffset = Math.max(0, endOffset - actualDeleteLen)
        const startPos = offsetToLineCh(cmText, startOffset)

        session.lastExpansion = {
            time: Date.now(),
            matched: matched,
            finalText: finalText,
            isCm: true,
            input: cm,
            startIndex: startOffset,
        }

        cm.replaceRange(finalText, startPos, curCursor)

        const cmTextAfter = cm.getValue()
        const insertedEndIndex = lineChToOffset(cmTextAfter, cm.getCursor())
        session.lastExpansion.endIndex = insertedEndIndex

        if (session.tabstops.length > 0 && session.tabstopIdx < session.tabstops.length) {
            session.tabstopDirty = true
            shiftFollowingTabstops(session.tabstopIdx)
        }

        if (orderedTabstops.length > 0) {
            const newTs = orderedTabstops.map((ts) => {
                const absStart = offsetToAbsolutePosition(ts.start, finalText, startPos)
                const absEnd = offsetToAbsolutePosition(ts.end, finalText, startPos)
                return {
                    isCm: true,
                    input: cm,
                    start: lineChToOffset(cmTextAfter, absStart),
                    end: lineChToOffset(cmTextAfter, absEnd),
                }
            })
            if (session.tabstops.length > 0 && session.tabstopIdx < session.tabstops.length) {
                session.tabstops.splice(session.tabstopIdx + 1, 0, ...newTs)
                session.tabstopIdx++
                jumpToTabstop(session.tabstopIdx)
            } else {
                session.tabstops = newTs
                session.tabstopIdx = 0
                jumpToTabstop(0)
            }
        }
        endSuppressAutoExpandSoon()
        return true
    }
    const active = getActiveTextInput()
    if (active) {
        const end = active.selectionStart ?? 0
        const start = Math.max(0, end - matched.length)

        session.lastExpansion = {
            time: Date.now(),
            matched: matched,
            finalText: finalText,
            isCm: false,
            input: active,
            startIndex: start,
        }

        active.setRangeText(finalText, start, end, "end")
        active.dispatchEvent(new Event("input", { bubbles: true }))

        if (session.tabstops.length > 0 && session.tabstopIdx < session.tabstops.length) {
            session.tabstopDirty = true
            shiftFollowingTabstops(session.tabstopIdx)
        }

        if (orderedTabstops.length > 0) {
            const newTs = orderedTabstops.map((ts) => ({
                input: active,
                start: start + ts.start,
                end: start + ts.end,
            }))
            if (session.tabstops.length > 0 && session.tabstopIdx < session.tabstops.length) {
                session.tabstops.splice(session.tabstopIdx + 1, 0, ...newTs)
                session.tabstopIdx++
                jumpToTabstop(session.tabstopIdx)
            } else {
                session.tabstops = newTs
                session.tabstopIdx = 0
                jumpToTabstop(0)
            }
        }
        endSuppressAutoExpandSoon()
        return true
    }

    // Select trigger word (cross-node available) and replace
    // 选中触发词（跨节点可用）并替换
    const selected = selectPreviousChars(matched.length)
    if (!selected) {
        endSuppressAutoExpandSoon()
        return false
    }

    const preSel = window.getSelection()
    let absoluteStartIndex = 0
    let expansionRoot = null
    if (preSel && preSel.rangeCount > 0) {
        const caret = preSel.getRangeAt(0).cloneRange()
        expansionRoot = getEditingRoot(caret.endContainer, getCurrentBlock)
        const pre = document.createRange()
        pre.selectNodeContents(expansionRoot)
        pre.setEnd(caret.startContainer, caret.startOffset)
        absoluteStartIndex = pre.toString().length
    }

    const expansionInline = getInlineMathElement(preSel?.getRangeAt(0)?.endContainer)
    const inlineLocator = createInlineMathLocator(expansionInline)
    if (inlineLocator) session.activeInlineLocator = inlineLocator

    session.lastExpansion = {
        time: Date.now(),
        matched: matched,
        finalText: finalText,
        isCm: false,
        startIndex: absoluteStartIndex,
        root: expansionRoot,
        inlineLocator,
    }

    let insertedText = finalText
    let inlineTabstops = orderedTabstops
    const inlineSource = getInlineMathSource(preSel?.getRangeAt(0)?.endContainer)
    if (inlineSource && inlineSource === expansionRoot && orderedTabstops.length > 0) {
        const materialized = materializeInlineTabstops(finalText, orderedTabstops)
        insertedText = materialized.text
        inlineTabstops = materialized.tabstops
    }

    session.editor.replaceDomSelection(insertedText)
    try {
        const afterSel = window.getSelection()
        if (afterSel && afterSel.rangeCount > 0) {
            afterSel.collapseToEnd()
        }
    } catch {}

    if (session.tabstops.length > 0 && session.tabstopIdx < session.tabstops.length) {
        session.tabstopDirty = true
        shiftFollowingTabstops(session.tabstopIdx)
    }

    // Record and jump to the first placeholder (prioritize smallest idx)
    // 记录并跳到第一个占位符（优先最小 idx）
    if (orderedTabstops.length > 0) {
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0) return false
        const caret = sel.getRangeAt(0).cloneRange()
        const pre = document.createRange()
        const root = getEditingRoot(caret.endContainer, getCurrentBlock)
        const inline = getInlineMathElement(caret.endContainer)
        const liveInlineLocator = createInlineMathLocator(inline) || inlineLocator
        if (liveInlineLocator) session.activeInlineLocator = liveInlineLocator
        pre.selectNodeContents(root)
        pre.setEnd(caret.endContainer, caret.endOffset)
        const endIndex = pre.toString().length
        const startIndex = Math.max(0, endIndex - insertedText.length)

        const newTs = inlineTabstops.map((ts) => ({
            startIndex: startIndex + ts.start,
            endIndex: startIndex + ts.end,
            root: root,
            inlineLocator: liveInlineLocator,
            placeholderFiller: ts.placeholderFiller,
        }))
        if (session.tabstops.length > 0 && session.tabstopIdx < session.tabstops.length) {
            session.tabstops.splice(session.tabstopIdx + 1, 0, ...newTs)
            session.tabstopIdx++
            jumpToTabstop(session.tabstopIdx)
            scheduleInlineTabstopReselect(session.tabstopIdx)
        } else {
            session.tabstops = newTs
            session.tabstopIdx = 0
            jumpToTabstop(0)
            scheduleInlineTabstopReselect(0)
        }
    }
    endSuppressAutoExpandSoon()
    return true
}

function offsetToLineCh(text, offset) {
    const slice = text.slice(0, offset)
    const lines = slice.split("\n")
    return { line: lines.length - 1, ch: lines[lines.length - 1].replace(/\r/g, "").length }
}

function jumpToTabstop(idx) {
    if (idx >= session.tabstops.length) {
        clearTabstops()
        return
    }
    const ts = session.tabstops[idx]
    session.tabstopDirty = false

    if (ts.isCm) {
        try {
            const cmText = ts.input.getValue()
            const startPos = offsetToLineCh(cmText, ts.start)
            const endPos = offsetToLineCh(cmText, ts.end)

            ts.input.focus()
            ts.input.setSelection(startPos, endPos)

            if (session.tabstops.length > 0) session.tabstopDirty = true
            return
        } catch {
            clearTabstops()
            return
        }
    }

    if (ts.input) {
        try {
            ts.input.setSelectionRange(ts.start, ts.end)
            ts.input.focus()

            if (session.tabstops.length > 0) session.tabstopDirty = true
            return
        } catch {
            clearTabstops()
            return
        }
    }

    try {
        const liveRoot = getLiveTabstopRoot(ts)
        if (!liveRoot) {
            clearTabstops()
            return
        }
        const range = getRangeFromAbsoluteOffsets(ts.startIndex, ts.endIndex, liveRoot)
        if (!range) {
            clearTabstops()
            return
        }
        if (!session.editor?.setDomSelection?.(range)) {
            const sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)
        }
        if (session.tabstops.length > 0) session.tabstopDirty = true
    } catch {
        clearTabstops()
    }
}

// ── Plugin Main Body / 插件主体 ──────────────────────────────────────
const LISTENER_STORE_KEY = "__latexSuitePluginListeners__"
const NO_PAIRING_BASELINE_KEY = "__latexSuitePluginNoPairingBaseline__"

class LatexSuitePlugin extends BaseCustomPlugin {
    selector = () => "#write"

    process = () => {
        const prev = window[LISTENER_STORE_KEY]
        if (prev) {
            if (typeof prev.cleanup === "function") {
                prev.cleanup()
            } else {
                if (typeof prev.restore === "function") prev.restore()
                document.removeEventListener("keydown", prev.onKeyDown, true)
                document.removeEventListener("input", prev.onInput, false)
                if (prev.onSelectionChange) {
                    document.removeEventListener("selectionchange", prev.onSelectionChange, false)
                }
            }
        }
        this.session = resetSession(new TyporaEditorAdapter(this.utils))
        const owner = this.session
        const usePhysicsPackage = resolveUsePhysicsPackage(this.config)
        compiledSnippets = compileSnippets(
            createSnippets({
                usePhysicsPackage,
                toggleInlineMath: () => scheduleModeToggle(() => File.editor.stylize.toggleStyle("inline_math")),
                toggleDisplayMath: () => scheduleModeToggle(() => File.editor.stylize.toggleMathBlock()),
            })
        )

        if (window.File && File.option && typeof window[NO_PAIRING_BASELINE_KEY] !== "boolean") {
            window[NO_PAIRING_BASELINE_KEY] = Boolean(File.option.noPairingMatch)
        }

        let cachedInMath = null
        let cachedNoPairingMatch = null
        let cachedCm = null
        let cachedAutoClose = null
        let lastMathCm = null

        const onSelectionChange = () => {
            if (window.File && File.option) {
                if (typeof window[NO_PAIRING_BASELINE_KEY] !== "boolean") {
                    window[NO_PAIRING_BASELINE_KEY] = Boolean(File.option.noPairingMatch)
                }
                const initialNoPairingMatch = window[NO_PAIRING_BASELINE_KEY]

                const inMath = isInMath()
                const focusedCm = getFocusedCodeMirror()
                if (inMath && focusedCm) lastMathCm = focusedCm
                const targetNoPairingMatch = inMath ? true : initialNoPairingMatch

                const cm = inMath ? focusedCm : lastMathCm
                const targetAutoClose = inMath ? false : !targetNoPairingMatch
                const canUseCmOption = Boolean(
                    cm && typeof cm.getOption === "function" && typeof cm.setOption === "function"
                )
                let cmAlreadySynced = true
                if (canUseCmOption) {
                    try {
                        cmAlreadySynced = cm.getOption("autoCloseBrackets") === targetAutoClose
                    } catch {
                        lastMathCm = null
                    }
                }

                const noStateChange =
                    cachedInMath === inMath &&
                    cachedNoPairingMatch === targetNoPairingMatch &&
                    cachedCm === cm &&
                    cachedAutoClose === targetAutoClose &&
                    cmAlreadySynced
                if (noStateChange) return

                if (File.option.noPairingMatch !== targetNoPairingMatch) {
                    File.option.noPairingMatch = targetNoPairingMatch
                }

                if (canUseCmOption && !cmAlreadySynced) {
                    try {
                        cm.setOption("autoCloseBrackets", targetAutoClose)
                    } catch {
                        lastMathCm = null
                    }
                }

                cachedInMath = inMath
                cachedNoPairingMatch = targetNoPairingMatch
                cachedCm = cm
                cachedAutoClose = targetAutoClose
            }
        }

        const restoreState = () => {
            if (!window.File || !File.option) return
            const baseline = window[NO_PAIRING_BASELINE_KEY]
            if (typeof baseline === "boolean") {
                File.option.noPairingMatch = baseline
                if (lastMathCm && typeof lastMathCm.setOption === "function") {
                    try {
                        lastMathCm.setOption("autoCloseBrackets", !baseline)
                    } catch {}
                }
            }
        }

        const resetForDocument = () => {
            owner.resetForDocument()
            cachedInMath = null
            cachedNoPairingMatch = null
            cachedCm = null
            cachedAutoClose = null
            lastMathCm = null
            onSelectionChange()
        }
        const removeEditingListeners = owner.editor.addEditingListeners({
            onKeyDown: this.onKeyDown,
            onInput: this.onInput,
            onSelectionChange,
        })
        const removeFileListener = owner.editor.addFileContentLoadedListener(resetForDocument)
        const cleanup = () => {
            removeEditingListeners()
            removeFileListener()
            restoreState()
            owner.dispose()
        }

        window[LISTENER_STORE_KEY] = {
            onKeyDown: this.onKeyDown,
            onInput: this.onInput,
            onSelectionChange,
            restore: restoreState,
            cleanup,
        }
        onSelectionChange()
    }

    onKeyDown = (e) => {
        if (!isInEditableContext()) return

        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
            if (isLastExpansionActive()) {
                if (session.releaseCodeMirrorUndo()) {
                    // Let this same key event reach CodeMirror. Calling undo()
                    // from the ancestor capture listener can run before
                    // CodeMirror has finalized the expansion history entry,
                    // producing a no-op on the first Ctrl+Z.
                    clearTabstops()
                    return
                }

                e.preventDefault()
                e.stopPropagation()

                beginSuppressAutoExpand()
                session.undoLastExpansion()
                endSuppressAutoExpandSoon()

                clearTabstops()
                return
            }
        }

        if (e.key === "Enter") {
            const ctx = getMathContext()
            if (ctx && isInsideEnvironment(ctx)) {
                if (e.shiftKey) {
                    e.preventDefault()
                    e.stopPropagation()
                    if (ctx.cm) {
                        ctx.cm.replaceSelection("\n")
                    } else {
                        session.editor.replaceDomSelection("\n")
                    }
                    return
                } else if (e.ctrlKey) {
                    e.preventDefault()
                    e.stopPropagation()
                    if (ctx.cm) {
                        const cur = ctx.cm.getCursor()
                        const nextLine = cur.line + 1
                        if (nextLine < ctx.cm.lineCount()) {
                            const nextLineLen = ctx.cm.getLine(nextLine).length
                            ctx.cm.setCursor({ line: nextLine, ch: nextLineLen })
                        } else {
                            const curLineLen = ctx.cm.getLine(cur.line).length
                            ctx.cm.setCursor({ line: cur.line, ch: curLineLen })
                        }
                    }
                    return
                } else {
                    e.preventDefault()
                    e.stopPropagation()
                    if (ctx.cm) {
                        ctx.cm.replaceSelection(" \\\\\n")
                    } else {
                        session.editor.replaceDomSelection(" \\\\\n")
                    }
                    return
                }
            }
        }

        if (e.key === "Tab") {
            // A pending auto-expansion must not run after an explicit Tab
            // expansion, otherwise the same trigger can be processed twice.
            session.autoExpandToken++
            const before = getTextBeforeCursor(8)

            // 先同步一下手敲字符产生的位移，保证外层 tabstop 追踪正确
            if (session.tabstops.length > 0 && session.tabstopIdx < session.tabstops.length) {
                shiftFollowingTabstops(session.tabstopIdx)
            }

            // When a placeholder (including a default such as `i`) is still
            // selected, Tab means navigation. Trying a snippet first would
            // inspect the text before the selection and can expand a boundary
            // token such as `{`, corrupting `ssum` into `\\sum_{ }i...`.
            const navigatingSelectedTabstop = isCurrentTabstopSelectionActive()
            if (navigatingSelectedTabstop) clearUntouchedInlinePlaceholder()
            const expanded = navigatingSelectedTabstop ? false : tryExpandSnippet(false)
            if (expanded) {
                e.preventDefault()
                e.stopPropagation()
                return
            }

            if (/mk$/.test(before)) {
                doExpand("mk", "$$0$")
                e.preventDefault()
                e.stopPropagation()
                return
            }

            // Intercept Tab only when really expanding/jumping, otherwise keep native tab behavior
            // 仅在真的要展开/跳转时拦截 Tab，未命中则保留原生制表行为
            if (session.tabstops.length > 0 && session.tabstopIdx < session.tabstops.length) {
                shiftFollowingTabstops(session.tabstopIdx)
                if (session.tabstopIdx < session.tabstops.length - 1) {
                    e.preventDefault()
                    e.stopPropagation()
                    session.tabstopIdx++
                    jumpToTabstop(session.tabstopIdx)
                    scheduleInlineTabstopReselect(session.tabstopIdx)
                    return
                }

                // Keep the final tabstop armed until the user presses Tab.
                // This is what makes a single-placeholder inline snippet
                // behave consistently with multi-placeholder snippets.
                clearTabstops()
                const finalCtx = getMathContext()
                if (finalCtx && isInsideEnvironment(finalCtx) && !e.shiftKey) {
                    e.preventDefault()
                    e.stopPropagation()
                    if (finalCtx.cm) {
                        finalCtx.cm.replaceSelection(" & ")
                    } else {
                        session.editor.replaceDomSelection(" & ")
                    }
                } else if (!e.shiftKey && leaveInlineMath()) {
                    e.preventDefault()
                    e.stopPropagation()
                }
                return
            }

            // Inline math has its own temporary editing surface in Typora.
            // Once the snippet tabstops are exhausted, consume the next Tab
            // to leave that surface instead of inserting a literal tab or
            // handing the key back to CodeMirror.
            if (!e.shiftKey && leaveInlineMath()) {
                e.preventDefault()
                e.stopPropagation()
                return
            }

            const ctx = getMathContext()
            if (ctx && isInsideEnvironment(ctx) && !e.shiftKey) {
                e.preventDefault()
                e.stopPropagation()
                if (ctx.cm) {
                    ctx.cm.replaceSelection(" & ")
                } else {
                    session.editor.replaceDomSelection(" & ")
                }
                return
            }
            return
        }

        if (
            ["Escape", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(
                e.key
            )
        ) {
            clearTabstops()
        }
    }

    // Auto-trigger (A flag): scan after every input
    // 自动触发（A 标志）：每次输入后扫描
    onInput = (e) => {
        if (session.suppressAutoExpand) return
        if (!isInEditableContext()) return

        // A later user edit owns the next undo step. Do not keep treating the
        // older snippet expansion as the top of the history stack.
        session.lastExpansion = null

        // Disable auto-expansion when deleting or moving cursor, only trigger upon writing text
        if (
            e &&
            e.inputType &&
            (e.inputType.startsWith("delete") || e.inputType === "historyUndo" || e.inputType === "historyRedo")
        ) {
            return
        }

        // When navigating placeholders, record edit state and allow snippets without placeholders to continue expanding
        // 正在占位符导航时，记录编辑状态，并允许不含占位符的 snippet 继续展开
        if (session.tabstops.length > 0) {
            session.tabstopDirty = true
        }
        const expanded = tryExpandSnippet(true)
        if (!expanded) scheduleAutoExpand()
    }
}

module.exports = { plugin: LatexSuitePlugin }
