class TyporaEditorAdapter {
    constructor(utils, host = { window, document }) {
        this.utils = utils
        this.window = host.window
        this.document = host.document
    }

    get writeRoot() {
        return this.utils?.entities?.eWrite || this.document.querySelector("#write")
    }

    addEditingListeners({ onKeyDown, onInput, onSelectionChange }) {
        const root = this.writeRoot
        if (!root) throw new Error("Latex Suite could not find Typora's writing area")

        root.addEventListener("keydown", onKeyDown, true)
        root.addEventListener("input", onInput, false)
        this.document.addEventListener("selectionchange", onSelectionChange, false)

        return () => {
            root.removeEventListener("keydown", onKeyDown, true)
            root.removeEventListener("input", onInput, false)
            this.document.removeEventListener("selectionchange", onSelectionChange, false)
        }
    }

    addFileContentLoadedListener(listener) {
        const eventHub = this.utils?.eventHub
        const type = eventHub?.eventType?.fileContentLoaded
        if (!eventHub || !type) return () => {}

        eventHub.addEventListener(type, listener)
        return () => eventHub.removeEventListener(type, listener)
    }

    replaceDomSelection(text) {
        if (text === "") {
            return this.document.execCommand("delete")
        }
        return this.document.execCommand("insertText", false, text)
    }

    undoDomEdit() {
        return this.document.execCommand("undo", false, null)
    }

}

module.exports = { TyporaEditorAdapter }
