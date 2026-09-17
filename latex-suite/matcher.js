function isRegExpLike(value) {
    return Boolean(
        value &&
        typeof value === "object" &&
        typeof value.source === "string" &&
        typeof value.flags === "string"
    )
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function compileSnippets(rawSnippets) {
    return rawSnippets
        .map(snippet => {
            const regexTrigger = isRegExpLike(snippet.trigger)
            const triggerRe = regexTrigger
                ? new RegExp(snippet.trigger.source, snippet.trigger.flags)
                : (String(snippet.options || "").includes("r")
                    ? new RegExp(String(snippet.trigger) + "$")
                    : new RegExp(escapeRegex(String(snippet.trigger)) + "$"))
            const flags = triggerRe.flags.replace(/g/g, "")
            const source = triggerRe.source.endsWith("$")
                ? triggerRe.source
                : triggerRe.source + "$"

            return {
                ...snippet,
                triggerRe,
                matchRe: new RegExp(source, flags),
                priority: snippet.priority || 0,
            }
        })
        .sort((left, right) => right.priority - left.priority)
}

function matchSnippet(snippets, before, context) {
    let bestMatch = null

    for (const snippet of snippets) {
        if (bestMatch && snippet.priority < bestMatch.snippet.priority) break

        const options = snippet.options || ""
        if (options.includes("m") && !context.inMath) continue
        if (options.includes("t") && context.inMath) continue
        if (snippet.environment && context.inInlineMath) continue
        if (!options.includes("A") && context.isAutoKey) continue
        if (options.includes("M") && !context.inNewLine) continue
        if (options.includes("n") && context.inNewLine) continue

        const match = before.match(snippet.matchRe)
        if (!match) continue

        if (options.includes("w")) {
            const previous = before[before.length - match[0].length - 1]
            if (previous && /\w/.test(previous)) continue
        }

        if (!bestMatch || match[0].length > bestMatch.match[0].length) {
            bestMatch = { snippet, match }
        }
    }

    return bestMatch
}

function parseReplacement(replacement) {
    // Support every placeholder form used by the snippet table: $0,
    // ${0}, and ${0:default}.  Previously `${0}` was left as literal text,
    // so the first tabstop disappeared and every following jump was wrong.
    const placeholder = /\$\{(\d+)(?::([^}]*))?\}|\$(\d+)/g
    const positions = []
    let finalText = ""
    let last = 0
    let match

    while ((match = placeholder.exec(replacement)) !== null) {
        finalText += replacement.slice(last, match.index)
        const idx = Number.parseInt(match[1] ?? match[3], 10)
        const text = match[2] ?? ""
        const start = finalText.length
        finalText += text
        positions.push({ idx, start, end: finalText.length })
        last = match.index + match[0].length
    }
    finalText += replacement.slice(last)

    const firstByIndex = new Map()
    for (const position of positions) {
        if (!firstByIndex.has(position.idx)) firstByIndex.set(position.idx, position)
    }

    return {
        finalText,
        tabstops: [...firstByIndex.values()].sort((left, right) => left.idx - right.idx),
    }
}

function renderSnippetReplacement(snippet, match) {
    if (typeof snippet.replacement === "function") return snippet.replacement(match)
    return snippet.replacement.replace(/\[\[(\d+)\]\]/g, (_, n) => match[Number.parseInt(n, 10) + 1] || "")
}

module.exports = { compileSnippets, matchSnippet, parseReplacement, renderSnippetReplacement }
