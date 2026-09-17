class PluginSession {
    constructor(editor = null) {
        this.editor = editor
        this.disposed = false
        this.modeToggleToken = 0
        this.autoExpandToken = 0
        this.tabstopJumpToken = 0
        this.tabstops = []
        this.tabstopIdx = 0
        this.suppressAutoExpand = false
        this.tabstopDirty = false
        this.lastExpansion = null
        this.activeInlineLocator = null
    }

    dispose() {
        this.disposed = true
        this.modeToggleToken++
        this.autoExpandToken++
        this.tabstopJumpToken++
        this.clearTransientState()
        this.editor = null
    }

    resetForDocument() {
        this.modeToggleToken++
        this.autoExpandToken++
        this.tabstopJumpToken++
        this.clearTransientState()
    }

    undoLastExpansion() {
        const expansion = this.lastExpansion
        if (!expansion || !this.editor) return false

        if (expansion.isCm) return false

        if (expansion.input) {
            const input = expansion.input
            const start = expansion.startIndex
            const end = start + expansion.finalText.length
            input.setRangeText(expansion.matched, start, end, "end")
            input.dispatchEvent(new Event("input", { bubbles: true }))
        } else {
            this.editor.undoDomEdit()
        }

        this.lastExpansion = null
        return true
    }

    releaseCodeMirrorUndo() {
        if (!this.lastExpansion?.isCm) return false
        this.lastExpansion = null
        return true
    }

    clearTransientState() {
        this.tabstops = []
        this.tabstopIdx = 0
        this.suppressAutoExpand = false
        this.tabstopDirty = false
        this.lastExpansion = null
        this.activeInlineLocator = null
    }
}

module.exports = { PluginSession }
