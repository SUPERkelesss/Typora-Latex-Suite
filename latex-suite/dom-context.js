function asElement(node) {
    return node?.nodeType === 1 ? node : node?.parentElement
}

function getInlineMathElement(node) {
    let element = asElement(node)
    while (element) {
        if (element.classList?.contains("md-inline-math")) {
            return element
        }
        element = element.parentElement
    }
    return null
}

function getInlineMathSourceElement(inline) {
    if (!inline) return null
    return inline.querySelector?.("script") || inline.querySelector?.(".md-after.md-meta") || null
}

function getInlineMathSource(node) {
    return getInlineMathSourceElement(getInlineMathElement(node))
}

function getEditingRoot(node, fallback) {
    return getInlineMathSource(node) || fallback(node)
}

function getInlineMathContainer(inline) {
    let element = inline?.parentElement || null
    while (element) {
        if (element.hasAttribute?.("cid") || element.id === "write") return element
        element = element.parentElement
    }
    return null
}

function createInlineMathLocator(inline) {
    if (!inline) return null

    const container = getInlineMathContainer(inline)
    const formulas = Array.from(container?.querySelectorAll?.(".md-inline-math") || [])
    const foundIndex = formulas.indexOf(inline)
    return {
        inline,
        container,
        cid: container?.getAttribute?.("cid") || null,
        index: foundIndex >= 0 ? foundIndex : 0,
    }
}

function findContainerByCid(doc, cid) {
    if (!doc || !cid) return null
    return Array.from(doc.querySelectorAll?.("[cid]") || [])
        .find(element => element.getAttribute?.("cid") === cid) || null
}

function resolveInlineMathElement(locator, doc) {
    if (!locator) return null
    if (locator.inline && locator.inline.isConnected !== false) return locator.inline

    let container = locator.container && locator.container.isConnected !== false
        ? locator.container
        : null
    if (!container) container = findContainerByCid(doc, locator.cid)

    const formulas = Array.from(container?.querySelectorAll?.(".md-inline-math") || [])
    return formulas[locator.index] || null
}

function resolveLiveInlineMathSource(locator, activeInline, doc) {
    let owner = resolveInlineMathElement(locator, doc) || activeInline || null
    let source = getInlineMathSourceElement(owner)
    if (!source || source.isConnected === false) return null
    return { inline: owner, source }
}

module.exports = {
    createInlineMathLocator,
    getEditingRoot,
    getInlineMathElement,
    getInlineMathSource,
    resolveInlineMathElement,
    resolveLiveInlineMathSource,
}
