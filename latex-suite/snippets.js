// Cloned and modified from Obsidian Latex Suite's default snippets.
function snippetId(trigger) {
    if (trigger instanceof RegExp) return `regexp:${trigger.source}/${trigger.flags}`
    return `string:${String(trigger)}`
}

function addSnippetIds(snippets) {
    const seen = new Set()
    return snippets.map(snippet => {
        const id = snippet.id || snippetId(snippet.trigger)
        if (seen.has(id)) throw new Error(`Duplicate Latex Suite snippet id: ${id}`)
        seen.add(id)
        return { ...snippet, id }
    })
}

const PHYSICS_COMMAND_PATTERN = /\\(?:Tr|rank|erf|Res|grad|curl|laplacian|va|vb|vu|bra|ket|dd|dv|pdv|qty|abs|norm|ev|ip|op|mel|comm|acomm|pmqty|bmqty|mdet|imat|dmat|xmat)(?![A-Za-z])/

function resolveUsePhysicsPackage(config = {}) {
    const value = config?.use_physics_package
    if (value === undefined) return true
    if (typeof value !== "boolean") {
        throw new TypeError("Latex Suite use_physics_package must be true or false")
    }
    return value
}

function createSnippets({ toggleInlineMath, toggleDisplayMath, usePhysicsPackage = true }) {
    const GREEK   = "alpha|beta|gamma|Gamma|delta|Delta|epsilon|zeta|eta|theta|Theta|iota|kappa|lambda|Lambda|mu|nu|xi|Xi|pi|Pi|rho|sigma|Sigma|tau|upsilon|Upsilon|phi|Phi|chi|psi|Psi|omega|Omega"
    const SYMBOL  = "perp|forall|nabla|exists|partial|pm|mp|hbar|ell"
    const ACCENT  = "hat|bar|dot|ddot|tilde|vec|underline|overline|mathbf|boldsymbol|va|vb|vu|ket|bra"
    const MORE_SYMBOLS = "infty|cdot|times|otimes|oplus|cup|cap|subset|supset|in|notin|to|mapsto|implies|iff|leftarrow|rightarrow|leftrightarrow|Rightarrow|Leftarrow|Leftrightarrow|equiv|neq|geq|leq|gg|ll|sim|simeq|propto|setminus|emptyset|complement|parallel"
    
    function expandVars(str) {
        return str
            .replace(/\$\{GREEK\}/g, GREEK)
            .replace(/\$\{SYMBOL\}/g, SYMBOL)
            .replace(/\$\{ACCENT\}/g, ACCENT)
            .replace(/\$\{MORE_SYMBOLS\}/g, MORE_SYMBOLS)
    }

    function profileReplacement(physicsReplacement, standardReplacement) {
        return usePhysicsPackage ? physicsReplacement : standardReplacement
    }

    const snippets = [
        // Default profile: optimized for documents that load the physics package.
        // Modes
        {
            trigger: "mk", 
            replacement: () => {
                toggleInlineMath()
                return "";
            }, 
            options: "tA"
        },
        {
            trigger: /(\S)mk/, 
            replacement: (match) => {
                toggleInlineMath()
                return match[1] + " ";
            }, 
            options: "trA", priority: 1
        },
        {
            trigger: "dm",
            replacement: () => {
                toggleDisplayMath()
                return "";
            },
            options: "tA"
        },
        {
            trigger: /(\S)dm/,
            replacement: (match) => {
                toggleDisplayMath()
                return match[1];
            },
            options: "trA", priority: 1
        },
        {trigger: "dps", replacement: "\\displaystyle", options: "mA"},
    
        // Greek Latters
        {trigger: "@a", replacement: "\\alpha", options: "mA"},
        {trigger: "@b", replacement: "\\beta", options: "mA"},
        {trigger: "@g", replacement: "\\gamma", options: "mA"},
        {trigger: "@G", replacement: "\\Gamma", options: "mA"},
        {trigger: "@d", replacement: "\\delta", options: "mA"},
        {trigger: "@D", replacement: "\\Delta", options: "mA"},
        {trigger: "@e", replacement: "\\epsilon", options: "mA"},
        {trigger: ":e", replacement: "\\varepsilon", options: "mA"},
        {trigger: "@z", replacement: "\\zeta", options: "mA"},
        {trigger: "@t", replacement: "\\theta", options: "mA"},
        {trigger: "@T", replacement: "\\Theta", options: "mA"},
        {trigger: ":t", replacement: "\\vartheta", options: "mA"},
        {trigger: "@i", replacement: "\\iota", options: "mA"},
        {trigger: "@k", replacement: "\\kappa", options: "mA"},
        {trigger: "@l", replacement: "\\lambda", options: "mA"},
        {trigger: "@L", replacement: "\\Lambda", options: "mA"},
        {trigger: "@s", replacement: "\\sigma", options: "mA"},
        {trigger: "@S", replacement: "\\Sigma", options: "mA"},
        {trigger: "@u", replacement: "\\upsilon", options: "mA"},
        {trigger: "@U", replacement: "\\Upsilon", options: "mA"},
        {trigger: "@o", replacement: "\\omega", options: "mA"},
        {trigger: "@O", replacement: "\\Omega", options: "mA"},
        {trigger: "ome", replacement: "\\omega", options: "mA"},
        {trigger: "Ome", replacement: "\\Omega", options: "mA"},
        {trigger: ":p", replacement: "\\varphi", options: "mA"},
        
        // text
        {trigger: "text", replacement: "\\text{ $0 }", options: "mA"},
        {trigger: "\"",   replacement: "\\text{ $0 }$1", options: "mA"},
    
        // Basic Operations
        {trigger: "sr",   replacement: "^{2}", options: "mA", priority: -1},
        {trigger: "cb",   replacement: "^{3}", options: "mA", priority: -1},
        {trigger: "^^",   replacement: "^{$0}$1", options: "mA"},
        {trigger: expandVars("\\\\(${GREEK}|${SYMBOL}) sr"), replacement: "\\[[0]]^{2}", options: "rmA", priority: -1},
        {trigger: expandVars("\\\\(${GREEK}|${SYMBOL}) cb"), replacement: "\\[[0]]^{3}", options: "rmA", priority: -1},
        {trigger: expandVars("\\\\(${GREEK}|${SYMBOL}) ^^"), replacement: "\\[[0]]^{$0}$1", options: "rmA"},
        {trigger: "__",    replacement: "_{$0}$1", options: "mA"},
        {trigger: expandVars("\\\\(${GREEK}|${SYMBOL}) __"), replacement: "\\[[0]]_{$0}$1", options: "rmA"},
        {trigger: "sts",  replacement: "_\\text{ $0 }$1", options: "mA"},
        {trigger: "sq",   replacement: "\\sqrt{ $0 }$1", options: "mA", priority: -1},
        {trigger: "//",   replacement: "\\frac{ $0 }{ $1 }$2", options: "mA"},
        {trigger: "ee",   replacement: "e^{ $0 }$1", options: "mA"},
        {trigger: "inv", replacement: "^{-1}", options: "mA"},
        {trigger: /(?<![\\])(exp|log|ln)/, replacement: "\\[[0]]", options: "rmA"},
        {trigger: "conj", replacement: "^{*}", options: "mA"},
        {trigger: "Re",   replacement: "\\Re", options: "mA"},
        {trigger: "Im",   replacement: "\\Im", options: "mA"},
        {trigger: "bf",   replacement: "\\mathbf{$0}", options: "mA"},
        {trigger: "rm",   replacement: "\\mathrm{$0}$1", options: "mA"},
        {trigger: "cal",   replacement: "\\mathcal{$0}$1", options: "mA"},
        {trigger: "([a-zA-Z]),\\.",  replacement: "\\mathbf{[[0]]}", options: "rmA", priority: 8},
        {trigger: "([a-zA-Z])\\.,",  replacement: "\\mathbf{[[0]]}", options: "rmA", priority: 8},
        {trigger: expandVars("\\\\(${GREEK}),\\."),  replacement: "\\boldsymbol{\\[[0]]}", options: "rmA", priority: 9},
        {trigger: expandVars("\\\\(${GREEK})\\.,"), replacement: "\\boldsymbol{\\[[0]]}", options: "rmA", priority: 9},
        {trigger: "([a-uw-zA-UW-Z])bb", replacement: "\\mathbb{[[0]]}", options: "rmA", priority: 10},
        {trigger: /([^\\])(det)/, replacement: "[[0]]\\[[1]] ", options: "rmA"},
        {trigger: "Tr", replacement: profileReplacement("\\Tr", "\\operatorname{Tr}"), options: "mA"},
        
        // operations
        {trigger: "([a-zA-Z])hat",   replacement: "\\hat{[[0]]}", options: "rmA", priority: 10},
        {trigger: "([a-gi-zA-Z])bar",   replacement: "\\bar{[[0]]}", options: "rm", priority: 10},
        {trigger: "([a-zA-Z])dot",   replacement: "\\dot{[[0]]}", options: "rm", priority: 9},
        {trigger: "([a-zA-Z])ddot",  replacement: "\\ddot{[[0]]}", options: "rm", priority: 11},
        {trigger: "([a-zA-Z])tilde", replacement: "\\tilde{[[0]]}", options: "rm", priority: 10},
        {trigger: "([a-zA-Z])und",   replacement: "\\underline{[[0]]}", options: "rm", priority: 10},
        {trigger: "([a-zA-z])over",   replacement: "\\overline{[[0]]}", options: "rm", priority: 10},
        {trigger: "([a-zA-Z])vec",   replacement: "\\vec{[[0]]}", options: "rm", priority: 10},
        {trigger: "([a-zA-Z])vaa", replacement: profileReplacement("\\va{[[0]]}", "\\vec{[[0]]}"), options: "rm", priority: 10},
        {trigger: "([a-zA-Z])vbb", replacement: profileReplacement("\\vb{[[0]]}", "\\mathbf{[[0]]}"), options: "rm", priority: 10},
        {trigger: "([a-zA-Z])vuu", replacement: profileReplacement("\\vu{[[0]]}", "\\hat{\\mathbf{[[0]]}}"), options: "rm", priority: 10},
        {trigger: "([a-zA-Z])bra", replacement: profileReplacement("\\bra{[[0]]}", "\\langle [[0]] \\rvert"), options: "rm", priority: 10},
        {trigger: "([a-zA-Z])ket", replacement: profileReplacement("\\ket{[[0]]}", "\\lvert [[0]] \\rangle"), options: "rm", priority: 10},
        {trigger: /(?<![a-zA-Z])hat/, replacement: "\\hat{ $0 }$1", options: "rmA", priority: 20},
        {trigger: "bar",   replacement: "\\bar{$0}$1", options: "mA", priority: -1},
        {trigger: "dot",   replacement: "\\dot{$0}$1", options: "mA", priority: -2},
        {trigger: "ddot",  replacement: "\\ddot{$0}$1", options: "mA", priority: -1},
        {trigger: "tilde", replacement: "\\tilde{$0}$1", options: "mA"},
        {trigger: "und",   replacement: "\\underline{$0}$1", options: "mA"},
        {trigger: "over",   replacement: "\\overline{$0}$1", options: "mA"},
        {trigger: "vec",   replacement: "\\vec{$0}$1", options: "mA"},
        {trigger: "pmod",  replacement: "\\pmod{${0:n}}$1", options: "mA"},
        {trigger: "vaa", replacement: profileReplacement("\\va{$0}$1", "\\vec{$0}$1"), options: "mA"},
        {trigger: "vbb", replacement: profileReplacement("\\vb{$0}$1", "\\mathbf{$0}$1"), options: "mA"},
        {trigger: "vuu", replacement: profileReplacement("\\vu{$0}$1", "\\hat{\\mathbf{$0}}$1"), options: "mA"},
        {trigger: "bra", replacement: profileReplacement("\\bra{$0} $1", "\\left\\langle $0 \\right\\rvert $1"), options: "mA"},
        {trigger: "ket", replacement: profileReplacement("\\ket{$0} $1", "\\left\\lvert $0 \\right\\rangle $1"), options: "mA"},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*hat"),   replacement: "\\hat{\\[[0]]}", options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*dot"),   replacement: "\\dot{\\[[0]]}", options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*ddot"),  replacement: "\\ddot{\\[[0]]}", options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*bar"),   replacement: "\\bar{\\[[0]]}", options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*vec"),   replacement: "\\vec{\\[[0]]}", options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*tilde"), replacement: "\\tilde{\\[[0]]}", options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*und"),   replacement: "\\underline{\\[[0]]}", options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*over"),  replacement: "\\overline{\\[[0]]}", options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*vaa"), replacement: profileReplacement("\\va{\\[[0]]}", "\\vec{\\[[0]]}"), options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*vbb"), replacement: profileReplacement("\\vb{\\[[0]]}", "\\boldsymbol{\\[[0]]}"), options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*vuu"), replacement: profileReplacement("\\vu{\\[[0]]}", "\\hat{\\boldsymbol{\\[[0]]}}"), options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*pmod"),  replacement: "\\pmod{\\[[0]]}", options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*bra"), replacement: profileReplacement("\\bra{\\[[0]]}", "\\langle \\[[0]] \\rvert"), options: "rmA", priority: 30},
        {trigger: expandVars("\\\\(${GREEK})[ \\t]*ket"), replacement: profileReplacement("\\ket{\\[[0]]}", "\\lvert \\[[0]] \\rangle"), options: "rmA", priority: 30},
        {trigger: expandVars("(?<![\\\\a-zA-Z])(${GREEK})"), replacement: "\\[[0]] ", options: "rmA", priority: 10},
        
        // auto subscript
        {trigger: expandVars("(\\\\(?:${GREEK})|[A-Za-z])(\\d)"),               replacement: "[[0]]_{[[1]]}", options: "rmA", priority: -1},
        {trigger: expandVars("(\\\\(?:${GREEK})|[A-Za-z])_{(\\d+)}(\\d)"),      replacement: "[[0]]_{[[1]][[2]]}", options: "rmA", priority: -1},
        {trigger: expandVars("\\\\(${ACCENT})\\{(\\\\(?:${GREEK})|[A-Za-z])\\}(\\d)"), replacement: "\\[[0]]{[[1]]}_{[[2]]}", options: "rmA", priority: -1},
        {trigger: expandVars("\\\\(${ACCENT})\\{(\\\\(?:${GREEK})|[A-Za-z])\\}_\\{(\\d+)\\}(\\d)"), replacement: "\\[[0]]{[[1]]}_{[[2]][[3]]}", options: "rmA", priority: -1},
        {trigger: expandVars("\\\\(${ACCENT})\\{\\\\(${ACCENT})\\{(\\\\(?:${GREEK})|[A-Za-z])\\}\\}(\\d)"), replacement: "\\[[0]]{\\[[1]]{[[2]]}}_{[[3]]}", options: "rmA", priority: -1},
        {trigger: expandVars("\\\\(${ACCENT})\\{\\\\(${ACCENT})\\{(\\\\(?:${GREEK})|[A-Za-z])\\}\\}_\\{(\\d+)\\}(\\d)"), replacement: "\\[[0]]{\\[[1]]{[[2]]}}_{[[3]][[4]]}", options: "rmA", priority: -1},
        
        {trigger: "xnn", replacement: "x_{n}", options: "mA"},
        {trigger: "\\xi i", replacement: "x_{i}", options: "mA", priority: 1},
        {trigger: "xjj", replacement: "x_{j}", options: "mA"},
        {trigger: "xp1", replacement: "x_{n+1}", options: "mA"},
        {trigger: "xm1", replacement: "x_{n-1}", options: "mA"},
        {trigger: "ynn", replacement: "y_{n}", options: "mA"},
        {trigger: "yii", replacement: "y_{i}", options: "mA"},
        {trigger: "yjj", replacement: "y_{j}", options: "mA"},
        
        //symbols
        {trigger: "cdot",  replacement: "\\cdot ", options: "mA"},
        {trigger: "ooo",  replacement: "\\infty", options: "mA"},
        {trigger: "sum",  replacement: "\\sum", options: "mA", priority: -1},
        {trigger: "prod", replacement: "\\prod", options: "mA", priority: -1},
        {trigger: "ssum",  replacement: "\\sum_{${0:i} = ${1:1}}^{${2:N}} $3", options: "mA", priority: 1},
        {trigger: "pprod", replacement: "\\prod_{${0:i} = ${1:1}}^{${2:N}} $3", options: "mA", priority: 1},
        {trigger: "lim",  replacement: "\\lim_{ ${0:n} \\to ${1:\\infty} } $2", options: "mA"},
        {trigger: "+-",   replacement: "\\pm ", options: "mA"},
        {trigger: "-+",   replacement: "\\mp ", options: "mA"},
        {trigger: "...",  replacement: "\\cdots ", options: "mA"},
        {trigger: "v..",  replacement: "\\vdots ", options: "mA"},
        {trigger: "d..",  replacement: "\\ddots ", options: "mA"},
        {trigger: "nabl", replacement: "\\nabla ", options: "mA"},
        {trigger: "grad", replacement: profileReplacement("\\grad ", "\\nabla "), options: "mA"},
        {trigger: "div", replacement: "\\div ", options: "mA"},
        {trigger: "curl", replacement: profileReplacement("\\curl ", "\\nabla \\times "), options: "mA"},
        {trigger: "lapl", replacement: profileReplacement("\\laplacian ", "\\nabla^{2} "), options: "mA"},
        {trigger: "xx",   replacement: "\\times ", options: "mA"},
        {trigger: "**",   replacement: "\\cdot ", options: "mA"},
        {trigger: "para", replacement: "\\parallel ", options: "mA"},
        {trigger: "===",  replacement: "\\equiv ", options: "mA"},
        {trigger: "!=",   replacement: "\\neq ", options: "mA"},
        {trigger: ">=",   replacement: "\\geq ", options: "mA"},
        {trigger: "<=",   replacement: "\\leq ", options: "mA"},
        {trigger: ">>",   replacement: "\\gg ", options: "mA"},
        {trigger: "<<",   replacement: "\\ll ", options: "mA"},
        {trigger: "simm", replacement: "\\sim ", options: "mA"},
        {trigger: "sim=", replacement: "\\simeq ", options: "mA"},
        {trigger: /\\?~=/, replacement: "\\approx ", options: "rmA"},
        {trigger: "prop", replacement: "\\propto ", options: "mA"},
        {trigger: "<->",  replacement: "\\leftrightarrow ", options: "mA"},
        {trigger: "->",   replacement: "\\to ", options: "mA"},
        {trigger: "!>",   replacement: "\\mapsto ", options: "mA"},
        {trigger: "=>",   replacement: "\\implies ", options: "mA"},
        {trigger: "=<",   replacement: "\\impliedby ", options: "mA"},
        {trigger: "and",  replacement: "\\cap ", options: "mA"},
        {trigger: "orr",  replacement: "\\cup ", options: "mA"},
        {trigger: "inn",  replacement: "\\in ", options: "mA"},
        {trigger: "notin",replacement: "\\not\\in ", options: "mA"},
        {trigger: "\\\\\\", replacement: "\\setminus ", options: "mA"},
        {trigger: "sub=", replacement: "\\subseteq ", options: "mA"},
        {trigger: "sup=", replacement: "\\supseteq ", options: "mA"},
        {trigger: "eset", replacement: "\\emptyset ", options: "mA"},
        {trigger: "set",  replacement: "\\{ $0 \\}$1", options: "mA"},
        {trigger: "e\\xi sts", replacement: "\\exists ", options: "mA", priority: 1},
        {trigger: "exp",  replacement: "\\exp ", options: "mA"},
        {trigger: "ln",  replacement: "\\ln ", options: "mA"},
        {trigger: "log",  replacement: "\\log ", options: "mA"},
        {trigger: "det",  replacement: "\\det ", options: "mA"},
        {trigger: "Pr",  replacement: "\\Pr ", options: "mA"},
        {trigger: "rank", replacement: profileReplacement("\\rank ", "\\operatorname{rank} "), options: "mA"},
        {trigger: "erf", replacement: profileReplacement("\\erf ", "\\operatorname{erf} "), options: "mA"},
        {trigger: "Res", replacement: profileReplacement("\\Res ", "\\operatorname{Res} "), options: "mA"},
        {trigger: "LL",   replacement: "\\mathcal{L}", options: "mA"},
        {trigger: "HH",   replacement: "\\mathcal{H}", options: "mA"},
        {trigger: "UU",   replacement: "\\mathcal{U}", options: "mA"},
        {trigger: "CC",   replacement: "\\mathbb{C}", options: "mA"},
        {trigger: "RR",   replacement: "\\mathbb{R}", options: "mA"},
        {trigger: "ZZ",   replacement: "\\mathbb{Z}", options: "mA"},
        {trigger: "NN",   replacement: "\\mathbb{N}", options: "mA"},
    
        // Deritives
        {trigger: /\(([^()/]*(?:\([^()/]*\)[^()/]*)*)\)\s*\//, replacement: "\\frac{[[0]]}{$0}$1", options: "rm"},
        {trigger: /([a-zA-Z0-9_\\^{}]+)\s*\//, replacement: "\\frac{[[0]]}{$0}$1", options: "rm"},
        {trigger: /\(([^()/]*(?:\([^()/]*\)[^()/]*)*)\)\s*\/\s*\(([^()/]*(?:\([^()/]*\)[^()/]*)*)\)/, replacement: "\\frac{[[0]]}{[[1]]}", options: "rm"},
        {trigger: /\(([^()/]*(?:\([^()/]*\)[^()/]*)*)\)\s*\/\s*([a-zA-Z0-9_\\^{}]+)/, replacement: "\\frac{[[0]]}{[[1]]}", options: "rm"},
        {trigger: /([a-zA-Z0-9_\\^{}]+)\s*\/\s*\(([^()/]*(?:\([^()/]*\)[^()/]*)*)\)/, replacement: "\\frac{[[0]]}{[[1]]}", options: "rm"},
        {trigger: /([a-zA-Z0-9_\\^{}]+)\s*\/\s*([a-zA-Z0-9_\\^{}]+)/, replacement: "\\frac{[[0]]}{[[1]]}", options: "rm"},
        {trigger: "ddx", replacement: profileReplacement("\\dd{x}$0", "\\,\\mathrm{d}x$0"), options: "mA"},
        {trigger: "ddt", replacement: profileReplacement("\\dd{t}$0", "\\,\\mathrm{d}t$0"), options: "mA"},
        {trigger: "ddd", replacement: profileReplacement("\\dd{$0}$1", "\\,\\mathrm{d}t$0"), options: "mA"},
        {trigger: "dd1", replacement: profileReplacement("\\dd{$0}$1", "\\,\\mathrm{d}t$0"), options: "mA"},
        {trigger: /dd([2-9])/, replacement: profileReplacement("\\dd[[0]]{$0} $1", "\\,\\mathrm{d}$0 $1"), options: "mA"},
        {trigger: "pdv0", replacement: profileReplacement("\\pdv{ ${0:x} } $2", "\\frac{\\partial}{\\partial ${0:x}} $2"), options: "mA"},
        {trigger: "pdv1", replacement: profileReplacement("\\pdv{ ${0:y} }{ ${1:x} } $2", "\\frac{\\partial ${0:y}}{\\partial ${1:x}} $2"), options: "mA"},
        {trigger: "pdvv", replacement: profileReplacement("\\pdv{ ${0:y} }{ ${1:x} } $2", "\\frac{\\partial ${0:y}}{\\partial ${1:x}} $2"), options: "mA"},
        {trigger: /pdv([2-9])/, replacement: profileReplacement("\\pdv[[[0]]]{ ${0:y} }{ ${1:x} } $2", "\\frac{\\partial^{[[0]]} ${0:y}}{\\partial ${1:x}^{[[0]]}} $2"), options: "mA"},
        {trigger: "pdv:", replacement: profileReplacement("\\pdv{ ${0:z} }{ ${1:x} }{ ${2:y} } $3", "\\frac{\\partial^{2} ${0:z}}{\\partial ${1:x}\\,\\partial ${2:y}} $3"), options: "mA"},
        {trigger: "pdv_", replacement: profileReplacement("\\qty(\\pdv{ ${0:y} }{ ${1:x} })_{ ${2:t} } $3", "\\left(\\frac{\\partial ${0:y}}{\\partial ${1:x}}\\right)_{${2:t}} $3"), options: "mA"},
        {trigger: /pa([A-Za-z])([A-Za-z])/, replacement: profileReplacement("\\pdv{ [[0]] }{ [[1]] } ", "\\frac{\\partial [[0]]}{\\partial [[1]]} "), options: "rm"},
        {trigger: /pa([A-Za-z])([A-Za-z])([A-Za-z])/, replacement: profileReplacement("\\pdv{ [[0]] }{ [[1]] }{ [[2]] } ", "\\frac{\\partial^{2} [[0]]}{\\partial [[1]]\\,\\partial [[2]]} "), options: "rm"},
        {trigger: /pa([A-Za-z])([A-Za-z])_([A-Za-z])/, replacement: profileReplacement("\\qty(\\pdv{ [[0]] }{ [[1]] })_{ [[2]] } ", "\\left(\\frac{\\partial [[0]]}{\\partial [[1]]}\\right)_{[[2]]} "), options: "rm"},
        {trigger: /pa([1-9])([A-Za-z])([A-Za-z])/, replacement: profileReplacement("\\pdv[[[0]]]{ [[1]] }{ [[2]] } ", "\\frac{\\partial^{[[0]]} [[1]]}{\\partial [[2]]^{[[0]]}} "), options: "rm"},
        {trigger: "dv0", replacement: profileReplacement("\\dv{ ${0:x} }$1", "\\frac{\\mathrm{d}}{\\mathrm{d}${0:x}}$1"), options: "mA"},
        {trigger: "dv1", replacement: profileReplacement("\\dv{ ${0:y} }{ ${1:x} }$2", "\\frac{\\mathrm{d}${0:y}}{\\mathrm{d}${1:x}}$2"), options: "mA"},
        {trigger: /dv([2-9])/, replacement: profileReplacement("\\dv[[[0]]]{ ${0:y} }{ ${1:x} } $2", "\\frac{\\mathrm{d}^{[[0]]}${0:y}}{\\mathrm{d}${1:x}^{[[0]]}} $2"), options: "mA"},
        {trigger: /([^\\])int/, replacement: "[[0]]\\int", options: "mA", priority: -1},
        {trigger: "dint", replacement: profileReplacement("\\int_{${0:0}}^{${1:1}} $2 \\dd{${3:x}} $4", "\\int_{${0:0}}^{${1:1}} $2 \\,\\mathrm{d}${3:x} $4"), options: "mA"},
        {trigger: "oint",  replacement: "\\oint", options: "mA"},
        {trigger: "iint",  replacement: "\\iint", options: "mA"},
        {trigger: "iiint", replacement: "\\iiint", options: "mA"},
        {trigger: "oinf", replacement: profileReplacement("\\int_{0}^{\\infty} $0 \\dd{${1:x}} $2", "\\int_{0}^{\\infty} $0 \\,\\mathrm{d}${1:x} $2"), options: "mA"},
        {trigger: "infi", replacement: profileReplacement("\\int_{-\\infty}^{\\infty} $0 \\dd{${1:x}} $2", "\\int_{-\\infty}^{\\infty} $0 \\,\\mathrm{d}${1:x} $2"), options: "mA"},
    
        // Trig
        {trigger: /(^|$|[^\\a-zA-Z])(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)/, replacement: "[[0]]\\[[1]]", options: "rmA"},
        {trigger: /\\(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)([A-Za-gi-z])/, replacement: "\\[[0]] [[1]]", options: "rmA"},
        {trigger: /\\(sinh|cosh|tanh|coth)([A-Za-z])/, replacement: "\\[[0]] [[1]]", options: "rmA"},
        {trigger: /(arccsc|arcsec|arccot)/, replacement: "\\operatorname{[[0]]}$0", options: "mA", priority: 1},
    
        {trigger: expandVars("\\\\(${GREEK}|${SYMBOL}|${MORE_SYMBOLS})([A-Za-z])"), replacement: "\\[[0]] [[1]]", options: "rmA"},
        
        // physics
        {trigger: "kbt",   replacement: "k_{B}T", options: "mA"},
        {trigger: "hbar",   replacement: "\\hbar ", options: "mA", priority: 10},
        {trigger: "msun",  replacement: "M_{\\odot}", options: "mA"},
        {trigger: "dag",   replacement: "^{\\dagger}", options: "mA"},
        {trigger: "o+",    replacement: "\\oplus ", options: "mA"},
        {trigger: "ox",    replacement: "\\otimes ", options: "mA"},
        // {trigger: "brk",   replacement: "\\braket{ $0 | $1 } $2", options: "mA"},
        // {trigger: "outer", replacement: "\\ket{${0:\\psi}} \\bra{${0:\\psi}} $1", options: "mA"},
        {trigger: "pu",    replacement: "\\pu{ $0 }", options: "mA"},
        {trigger: "cee",   replacement: "\\ce{ $0 }", options: "mA", priority: 1},
        {trigger: "he4",   replacement: "{}^{4}_{2}He ", options: "mA"},
        {trigger: "he3",   replacement: "{}^{3}_{2}He ", options: "mA"},
        {trigger: "iso",   replacement: "{}^{${0:4}}_{${1:2}}${2:He}", options: "mA"},
    
        // brackets
        // {trigger: /([pbBvV]mat)/,         replacement: "\\begin{[[0]]rix}\n$0\n\\end{[[0]]rix}", options: "rMA"},
        {trigger: /(matrix|cases|align|array|gathered)/, replacement: "\\begin{[[0]]}\n$0\n\\end{[[0]]}", options: "rmA", environment: true},
        // {trigger: "avg",   replacement: "\\langle $0 \\rangle $1", options: "mA"},
        {trigger: "abs", replacement: profileReplacement("\\abs{ $0 }$1", "\\left| $0 \\right|$1"), options: "mA", priority: 1},
        {trigger: "norm", replacement: profileReplacement("\\norm{ $0 }$1", "\\left\\lVert $0 \\right\\rVert$1"), options: "mA", priority: 1},
        {trigger: "ceil",  replacement: "\\lceil $0 \\rceil $1", options: "mA"},
        {trigger: "floor", replacement: "\\lfloor $0 \\rfloor $1", options: "mA"},
        {trigger: "evv", replacement: profileReplacement("\\ev{ $0 }$1", "\\left\\langle $0 \\right\\rangle$1"), options: "mA"},
        {trigger: "ipp", replacement: profileReplacement("\\ip{ $0 }{ $1 }$2", "\\left\\langle $0 \\middle| $1 \\right\\rangle$2"), options: "mA"},
        {trigger: "opp", replacement: profileReplacement("\\op{ $0 }{ $1 }$2", "\\left| $0 \\right\\rangle\\!\\left\\langle $1 \\right|$2"), options: "mA"},
        {trigger: "mel", replacement: profileReplacement("\\mel{ $0 }{ $1 }{ $2 }$3", "\\left\\langle $0 \\middle| $1 \\middle| $2 \\right\\rangle$3"), options: "mA"},
        {trigger: "comm", replacement: profileReplacement("\\comm{ $0 }{ $1 }$2", "\\left[ $0, $1 \\right]$2"), options: "mA"},
        {trigger: "acomm", replacement: profileReplacement("\\acomm{ $0 }{ $1 }$2", "\\left\\{ $0, $1 \\right\\}$2"), options: "mA", priority: 1},
        {trigger: "vert", replacement: "\\vert", options: "mA"},
        {trigger: "lr(", replacement: profileReplacement("\\qty( $0 )$1", "\\left( $0 \\right)$1"), options: "mA"},
        {trigger: "lr[", replacement: profileReplacement("\\qty[ $0 ]$1", "\\left[ $0 \\right]$1"), options: "mA"},
        {trigger: "lr{", replacement: profileReplacement("\\qty{ $0 }$1", "\\left\\{ $0 \\right\\}$1"), options: "mA"},
        {trigger: "(", replacement: "( $0 )$1", options: "mA"},
        {trigger: "[", replacement: "[ $0 ]$1", options: "mA"},
        {trigger: "\\{", replacement: "\\{ ${0} \\}$1", options: "mA"},
        {trigger: "{", replacement: "{ $0 }$1", options: "mA"},
        {trigger: "|", replacement: "| $0 |$1", options: "mA"},
        {trigger: "mat(", replacement: profileReplacement("\\pmqty{\n$0\n}", "\\begin{pmatrix}\n$0\n\\end{pmatrix}"), options: "mA", priority: 1},
        {trigger: "mat[", replacement: profileReplacement("\\bmqty{\n$0\n}", "\\begin{bmatrix}\n$0\n\\end{bmatrix}"), options: "mA", priority: 1},
        {trigger: "mat|", replacement: profileReplacement("\\mdet{\n$0\n}", "\\begin{vmatrix}\n$0\n\\end{vmatrix}"), options: "mA", priority: 1},
        {trigger: "binom", replacement: "\\binom{ ${0:n} }{ ${1:k} }$2", options: "mA"},
        {trigger: "imat", replacement: profileReplacement("\\imat{$0}$1", "\\begin{pmatrix}\n$0\n\\end{pmatrix}$1"), options: "mA", priority: 2},
        {trigger: "dmat", replacement: profileReplacement("\\dmat{$0}$1", "\\begin{pmatrix}\n$0\n\\end{pmatrix}$1"), options: "mA", priority: 2},
        {trigger: "xmat", replacement: profileReplacement("\\xmat{$0}$1", "\\begin{pmatrix}\n$0\n\\end{pmatrix}$1"), options: "mA", priority: 2},
        {trigger: "b\\otimes ed", replacement: "\\boxed{\n$0\n}", options: "mA", priority: 2},
    
        // {trigger: "mod",   replacement: "|${0}|$1", options: "mA"},
        // {trigger: "tayl", replacement: "${0:f}(${1:x} + ${2:h}) = ${0:f}(${1:x}) + ${0:f}'(${1:x})${2:h} + ${0:f}''(${1:x}) \\frac{${2:h}^{2}}{2!} + \\dots$3", options: "mA"},
        // {trigger: /iden(\d)/, replacement: (match) => {
        //     const n = parseInt(match[1])
        //     let arr = []
        //     for (let j = 0; j < n; j++) {
        //         arr[j] = []
        //         for (let i = 0; i < n; i++) arr[j][i] = (i === j) ? 1 : 0
        //     }
        //     const output = arr.map(el => el.join(" & ")).join(" \\\\\\\\\n")
        //     return `\\begin{pmatrix}\n${output}\n\\end{pmatrix}`
        // }, options: "mA"},
    
    ]

    return addSnippetIds(snippets)
}

module.exports = {
    addSnippetIds,
    createSnippets,
    PHYSICS_COMMAND_PATTERN,
    resolveUsePhysicsPackage,
    snippetId,
}
