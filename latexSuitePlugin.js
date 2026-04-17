// This Project is made by Vibe Coding. Sorry for bad coding.
// Cloned from https://github.com/artisticat1/obsidian-latex-suite/blob/main/src/default_snippet_variables.js
const GREEK   = "alpha|beta|gamma|Gamma|delta|Delta|epsilon|zeta|eta|theta|Theta|iota|kappa|lambda|Lambda|mu|nu|xi|Xi|pi|Pi|rho|sigma|Sigma|tau|upsilon|Upsilon|phi|Phi|chi|psi|Psi|omega|Omega"
const SYMBOL  = "perp|forall|nabla|exists|partial|pm|mp|hbar|ell"
const ACCENT  = "hat|bar|dot|ddot|tilde|vec|underline|overline|va|vb|vu|ket|bra"
const MORE_SYMBOLS = "infty|cdot|times|otimes|oplus|cup|cap|subset|supset|in|notin|to|mapsto|implies|iff|leftarrow|rightarrow|leftrightarrow|Rightarrow|Leftarrow|Leftrightarrow|equiv|neq|geq|leq|gg|ll|sim|simeq|propto|setminus|emptyset|complement|parallel"

function expandVars(str) {
    return str
        .replace(/\$\{GREEK\}/g, GREEK)
        .replace(/\$\{SYMBOL\}/g, SYMBOL)
        .replace(/\$\{ACCENT\}/g, ACCENT)
        .replace(/\$\{MORE_SYMBOLS\}/g, MORE_SYMBOLS)
}

// Cloned and Modified from https://github.com/artisticat1/obsidian-latex-suite/blob/main/src/default_snippets.js
const RAW_SNIPPETS = [
    // for efficient formula typing, this table is typing asuuming physics package is activatied.
    // Modes
    {
        trigger: "mk", 
        replacement: () => {
            setTimeout(() => {
                try {
                    File.editor.stylize.toggleStyle("inline_math");
                } catch (e) {}
            }, 30);
            return "";
        }, 
        options: "tA"
    },
    {
        trigger: /(\S)mk/, 
        replacement: (match) => {
            setTimeout(() => {
                try {
                    File.editor.stylize.toggleStyle("inline_math");
                } catch (e) {}
            }, 30);
            return match[1] + " ";
        }, 
        options: "trA", priority: 1
    },
    {
        trigger: "dm",
        replacement: () => {
            setTimeout(() => {
                try {
                    File.editor.stylize.toggleMathBlock();
                } catch (e) {}
            }, 30);
            return "";
        },
        options: "tA"
    },
    {
        trigger: /(\S)dm/,
        replacement: (match) => {
            setTimeout(() => {
                try {
                    File.editor.stylize.toggleMathBlock();
                } catch (e) {}
            }, 30);
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
    {trigger: "text", replacement: "\\text{$0}", options: "mA"},
    // {trigger: "\"",   replacement: "\\text{$0}$1", options: "mA"}, // disabled for confliction to auto-bracket

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
    {trigger: "//",   replacement: "\\frac{$0}{$1}$2", options: "mA"},
    {trigger: "ee",   replacement: "e^{ $0 }$1", options: "mA"},
    {trigger: "inv", replacement: "^{-1}", options: "mA"},
    {trigger: /([^\\])(exp|log|ln)/, replacement: "[[0]]\\[[1]]", options: "rmA"},
    {trigger: "conj", replacement: "^{*}", options: "mA"},
    {trigger: "Re",   replacement: "\\Re", options: "mA"},
    {trigger: "Im",   replacement: "\\Im", options: "mA"},
    {trigger: "bf",   replacement: "\\mathbf{$0}", options: "mA"},
    {trigger: "rm",   replacement: "\\mathrm{$0}$1", options: "mA"},
    {trigger: "cal",   replacement: "\\mathcal{$0}$1", options: "mA"},
    {trigger: /([^\\])(det)/, replacement: "[[0]]\\[[1]] ", options: "rmA"},
    {trigger: "Tr", replacement: "\\Tr", options: "mA"},
    
    // operations
    {trigger: "([a-zA-Z])hat",   replacement: "\\hat{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-gi-zA-Z])bar",   replacement: "\\bar{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-Z])dot",   replacement: "\\dot{[[0]]}", options: "rmA", priority: 9},
    {trigger: "([a-zA-Z])ddot",  replacement: "\\ddot{[[0]]}", options: "rmA", priority: 11},
    {trigger: "([a-zA-Z])tilde", replacement: "\\tilde{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-Z])und",   replacement: "\\underline{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-z])over",   replacement: "\\overline{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-Z])vec",   replacement: "\\vec{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-Z])vaa",   replacement: "\\va{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-Z])vbb",   replacement: "\\vb{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-Z])vuu",   replacement: "\\vu{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-Z])bra",  replacement: "\\bra{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-Z])ket",  replacement: "\\ket{[[0]]}", options: "rmA", priority: 10},
    {trigger: "([a-zA-Z]),\\.",  replacement: "\\mathbf{[[0]]}", options: "rmA", priority: 8},
    {trigger: "([a-zA-Z])\\.,",  replacement: "\\mathbf{[[0]]}", options: "rmA", priority: 8},
    {trigger: expandVars("\\\\(${GREEK}),\\."),  replacement: "\\boldsymbol{\\[[0]]}", options: "rmA", priority: 9},
    {trigger: expandVars("\\\\(${GREEK})\\.,"), replacement: "\\boldsymbol{\\[[0]]}", options: "rmA", priority: 9},
    
    {trigger: "hat",   replacement: "\\hat{$0}$1", options: "mA", priority: -1},
    {trigger: "bar",   replacement: "\\bar{$0}$1", options: "mA", priority: -1},
    {trigger: "dot",   replacement: "\\dot{$0}$1", options: "mA", priority: -2},
    {trigger: "ddot",  replacement: "\\ddot{$0}$1", options: "mA", priority: -1},
    {trigger: "tilde", replacement: "\\tilde{$0}$1", options: "mA"},
    {trigger: "und",   replacement: "\\underline{$0}$1", options: "mA"},
    {trigger: "over",   replacement: "\\overline{$0}$1", options: "mA"},
    {trigger: "vec",   replacement: "\\vec{$0}$1", options: "mA"},
    {trigger: "pmod",  replacement: "\\pmod{${0:n}}$1", options: "mA"},
    {trigger: "vaa",  replacement: "\\va{$0}$1", options: "mA"},
    {trigger: "vbb",  replacement: "\\vb{$0}$1", options: "mA"},
    {trigger: "vuu",  replacement: "\\vu{$0}$1", options: "mA"},
    {trigger: "bra",   replacement: "\\bra{$0} $1", options: "mA"},
    {trigger: "ket",   replacement: "\\ket{$0} $1", options: "mA"},
    {trigger: expandVars("\\\\(${GREEK}) hat"),   replacement: "\\hat{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) dot"),   replacement: "\\dot{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) ddot"),  replacement: "\\ddot{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) bar"),   replacement: "\\bar{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) vec"),   replacement: "\\vec{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) tilde"), replacement: "\\tilde{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) und"),   replacement: "\\underline{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) over"),   replacement: "\\overline{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) vaa"),    replacement: "\\va{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) vbb"),    replacement: "\\vb{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) vuu"),    replacement: "\\vu{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) pmod"),  replacement: "\\pmod{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) bra"),   replacement: "\\bra{\\[[0]]}", options: "rmA"},
    {trigger: expandVars("\\\\(${GREEK}) ket"),   replacement: "\\ket{\\[[0]]}", options: "rmA"},

    {trigger: expandVars("([^\\\\])(${GREEK})"), replacement: "[[0]]\\[[1]] ", options: "rmA"},
    {trigger: expandVars("(^|$)(${GREEK})"), replacement: "\\[[1]] ", options: "rmA", priority: 1},
    
    // auto subscript
    {trigger: expandVars("(\\\\${GREEK}|[A-Za-z])(\\d)"),               replacement: "[[0]]_{[[1]]}", options: "rmA", priority: -1},
    {trigger: expandVars("(\\\\${GREEK}|[A-Za-z])_{(\\d+)}(\\d)"),      replacement: "[[0]]_{[[1]][[2]]}", options: "rmA", priority: -1},
    {trigger: expandVars("\\\\(${ACCENT})\\{(\\\\${GREEK}|[A-Za-z])\\}(\\d)"), replacement: "\\[[0]]{[[1]]}_{[[2]]}", options: "rmA", priority: -1},
    {trigger: expandVars("\\\\(${ACCENT})\\{(\\\\${GREEK}|[A-Za-z])\\}_\\{(\\d+)\\}(\\d)"), replacement: "\\[[0]]{[[1]]}_{[[2]][[3]]}", options: "rmA", priority: -1},
    {trigger: expandVars("\\\\(${ACCENT})\\{\\\\(${ACCENT})\\{(\\\\${GREEK}|[A-Za-z])\\}\\}(\\d)"), replacement: "\\[[0]]{\\[[1]]{[[2]]}}_{[[3]]}", options: "rmA", priority: -1},
    {trigger: expandVars("\\\\(${ACCENT})\\{\\\\(${ACCENT})\\{(\\\\${GREEK}|[A-Za-z])\\}\\}_\\{(\\d+)\\}(\\d)"), replacement: "\\[[0]]{\\[[1]]{[[2]]}}_{[[3]][[4]]}", options: "rmA", priority: -1},
    
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
    {trigger: "ssum",  replacement: "\\sum_{${0:i}=${1:1}}^{${2:N}} $3", options: "mA", priority: 1},
    {trigger: "pprod", replacement: "\\prod_{${0:i}=${1:1}}^{${2:N}} $3", options: "mA", priority: 1},
    {trigger: "lim",  replacement: "\\lim_{ ${0:n} \\to ${1:\\infty} } $2", options: "mA"},
    {trigger: "+-",   replacement: "\\pm ", options: "mA"},
    {trigger: "-+",   replacement: "\\mp ", options: "mA"},
    {trigger: "...",  replacement: "\\cdots ", options: "mA"},
    {trigger: "v..",  replacement: "\\vdots ", options: "mA"},
    {trigger: "d..",  replacement: "\\ddots ", options: "mA"},
    {trigger: "nabl", replacement: "\\nabla ", options: "mA"},
    {trigger: "grad", replacement: "\\grad ", options: "mA"},
    {trigger: "div", replacement: "\\div ", options: "mA"},
    {trigger: "curl", replacement: "\\curl ", options: "mA"},
    {trigger: "lapl", replacement: "\\laplacian ", options: "mA"},
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
    {trigger: "rank",  replacement: "\\rank ", options: "mA"},
    {trigger: "erf",  replacement: "\\erf ", options: "mA"},
    {trigger: "Res",  replacement: "\\Res ", options: "mA"},
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
    {trigger: "ddx", replacement: "\\dd{x}$0", options: "mA"},
    {trigger: "ddt", replacement: "\\dd{t}$0", options: "mA"},
    {trigger: "ddd", replacement: "\\dd{{$0}} $1", options: "mA"},
    {trigger: "pdv0", replacement: "\\pdv{ ${0:x} } $2", options: "mA"},
    {trigger: "pdv1", replacement: "\\pdv{ ${0:y} }{ ${1:x} } $2", options: "mA"},
    {trigger: /pdv([2-9])/, replacement: "\\pdv[[[0]]]{ ${0:y} }{ ${1:x} } $2", options: "mA"},
    {trigger: "pdv:", replacement: "\\pdv{ ${0:z} }{ ${1:x} }{ ${2:y} } $3", options: "mA"},
    {trigger: "pdv_", replacement: "\\qty(\\pdv{ ${0:y} }{ ${1:x} })_{ ${2:t} } $3", options: "mA"},
    {trigger: /pa([A-Za-z])([A-Za-z])/, replacement: "\\pdv{ [[0]] }{ [[1]] } ", options: "rm"},
    {trigger: /pa([A-Za-z])([A-Za-z])([A-Za-z])/, replacement: "\\pdv{ [[0]] }{ [[1]] }{ [[2]] } ", options: "rm"},
    {trigger: /pa([A-Za-z])([A-Za-z])_([A-Za-z])/, replacement: "\\qty(\\pdv{ [[0]] }{ [[1]] })_{ [[2]] } ", options: "rm"},
    {trigger: /pa([1-9])([A-Za-z])([A-Za-z])/, replacement: "\\pdv[[[0]]]{ [[1]] }{ [[2]] } ", options: "rm"},
    {trigger: "dv0",   replacement: "\\dv{ ${0:x} }", options: "mA"},
    {trigger: "dv1",   replacement: "\\dv{ ${0:y} }{ ${1:y} }", options: "mA"},
    {trigger: /dv([2-9])/, replacement: "\\dv[[[0]]]{ ${0:y} }{ ${1:x} } $2", options: "mA"},
    {trigger: /([^\\])int/, replacement: "[[0]]\\int", options: "mA", priority: -1},
    // {trigger: "\\int", replacement: "\\int $0 \\, d${1:x} $2", options: "m"},
    {trigger: "dint",  replacement: "\\int_{${0:0}}^{${1:1}} $2 \\dd{${3:x}} $4", options: "mA"},
    {trigger: "oint",  replacement: "\\oint", options: "mA"},
    {trigger: "iint",  replacement: "\\iint", options: "mA"},
    {trigger: "iiint", replacement: "\\iiint", options: "mA"},
    {trigger: "oinf",  replacement: "\\int_{0}^{\\infty} $0 \\dd{${1:x}} $2", options: "mA"},
    {trigger: "infi",  replacement: "\\int_{-\\infty}^{\\infty} $0 \\dd{${1:x}} $2", options: "mA"},

    // Trig
    {trigger: /(^|$|[^\\a-zA-Z])(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)/, replacement: "[[0]]\\[[1]]", options: "rmA"},
    {trigger: /\\(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)([A-Za-gi-z])/, replacement: "\\[[0]] [[1]]", options: "rmA"},
    {trigger: /\\(sinh|cosh|tanh|coth)([A-Za-z])/, replacement: "\\[[0]] [[1]]", options: "rmA"},
    {trigger: /(arccsc|arcsec|arccot)/, replacement: "\\operatorname{[[0]]}$0", options: "mA", priority: 1},

    {trigger: expandVars("\\\\(${GREEK}|${SYMBOL}|${MORE_SYMBOLS})([A-Za-z])"), replacement: "\\[[0]] [[1]]", options: "rmA"},
    {trigger: /([+=-])([A-Za-z1-9])/, replacement: "[[0]] [[1]]", options: "rmA"},

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
    {trigger: /(matrix|cases|align|array|gathered)/, replacement: "\\begin{[[0]]}\n$0\n\\end{[[0]]}", options: "rmA"},
    // {trigger: "avg",   replacement: "\\langle $0 \\rangle $1", options: "mA"},
    {trigger: "abs",  replacement: "\\abs{ $0 }$1", options: "mA", priority: 1},
    {trigger: "norm",  replacement: "\\norm{ $0 }$1", options: "mA", priority: 1},
    {trigger: "ceil",  replacement: "\\lceil $0 \\rceil $1", options: "mA"},
    {trigger: "floor", replacement: "\\lfloor $0 \\rfloor $1", options: "mA"},
    {trigger: "evv", replacement: "\\ev{$0}$1", options: "mA"},
    {trigger: "ipp", replacement: "\\ip{$0}{$1}$2", options: "mA"},
    {trigger: "opp", replacement: "\\op{$0}{$1}$2", options: "mA"},
    {trigger: "mel", replacement: "\\mel{$0}{$1}{$2}$3", options: "mA"},
    {trigger: "comm", replacement: "\\comm{$0}{$1}$2", options: "mA"},
    {trigger: "acomm", replacement: "\\acomm{$0}{$1}$2", options: "mA", priority: 1},
    {trigger: "vert", replacement: "\\vert", options: "mA"},
    {trigger: "lr(",   replacement: "\\qty( $0 )$1", options: "mA"},
    {trigger: "lr[",   replacement: "\\qty[ $0 ]$1", options: "mA"},
    {trigger: "lr{",   replacement: "\\qty{ $0 }$1", options: "mA"},
    {trigger: "(", replacement: "( $0 )$1", options: "mA"},
    {trigger: "[", replacement: "[ $0 ]$1", options: "mA"},
    {trigger: "\\{", replacement: "\\{ ${0} \\}$1", options: "mA"},
    {trigger: "{", replacement: "{ $0 }$1", options: "mA"},
    {trigger: "|", replacement: "| $0 |$1", options: "mA"},
    {trigger: "mat(", replacement: "\\pmqty{\n$0\n}", options: "mA", priority: 1},
    {trigger: "mat[", replacement: "\\bmqty{\n$0\n}", options: "mA", priority: 1},
    {trigger: "mat|", replacement: "\\mdet{\n$0\n}", options: "mA", priority: 1},
    {trigger: "binom", replacement: "\\binom{ ${0:n} }{ ${1:k} }$2", options: "mA"},
    {trigger: "imat", replacement: "\\imat{$0}$1", options: "mA", priority: 2},
    {trigger: "dmat", replacement: "\\dmat{$0}$1", options: "mA", priority: 2},
    {trigger: "xmat", replacement: "\\xmat{$0}$1", options: "mA", priority: 2},
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

// ── Preprocessing: Compile string triggers into RegEx / 预处理：将字符串 trigger 编译成 RegExp ─────────
function isRegExpLike(value) {
    return Boolean(
        value &&
        typeof value === "object" &&
        typeof value.source === "string" &&
        typeof value.flags === "string"
    )
}

const SNIPPETS = RAW_SNIPPETS
    .map(s => {
        const isRegexTrigger = isRegExpLike(s.trigger)
        return {
            ...s,
            triggerRe: isRegexTrigger
                ? new RegExp(s.trigger.source, s.trigger.flags)
                : (String(s.options || "").includes("r")
                    ? new RegExp(String(s.trigger) + "$")
                    : new RegExp(escapeRegex(String(s.trigger)) + "$")),
            priority: s.priority || 0,
        }
    })
    .sort((a, b) => b.priority - a.priority)

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// ── Typora Environment Detection / Typora 环境检测 ───────────────────────────────
function isInMath() {
    const activeEl = document.activeElement
    const node = window.getSelection()?.anchorNode?.parentElement || activeEl
    let el = node
    while (el) {
        const cls = el.classList
        if (cls && (
            cls.contains("md-math-container") ||
            cls.contains("md-inline-math") ||
            cls.contains("md-math-block") ||
            cls.contains("md-blockmath") ||
            cls.contains("mathjax-block") ||
            el.tagName === "MJXCONTAINER" ||
            el.getAttribute?.("data-type") === "math"
        )) return true
        el = el.parentElement
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
    const range = sel.getRangeAt(0)
    const node = range.startContainer
    const text = node.textContent || ""
    const before = text.slice(0, range.startOffset)
    return /^\s*$/.test(before)
}

function getCurrentBlock(node) {
    let el = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
    while (el && el.id !== "write" && el !== document.body) {
        if (el.hasAttribute?.("md-block") ||
            /^(P|H[1-6]|LI|BLOCKQUOTE|DIV|TR|TD|TABLE|TBODY|THEAD)$/.test(el.tagName)) {
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
function getEditorState(inMathOnly = false) {
    const inMath = isInMath()
    if (inMathOnly && !inMath) return null

    // Try CodeMirror only in math context
    if (inMath) {
        let cm = (window.File && window.File.editor && window.File.editor.mathBlock ? window.File.editor.mathBlock.currentCm : null) ||
                   (window.File && window.File.editor && window.File.editor.fences ? window.File.editor.fences.currentCm : null)

        if (!cm) {
            const active = document.activeElement
            if (active) {
                const cmNode = active.closest('.CodeMirror')
                if (cmNode && cmNode.CodeMirror) {
                    cm = cmNode.CodeMirror
                }
            }
        }

        if (cm) {
            const cursor = cm.getCursor()
            const textBefore = cm.getRange({line: 0, ch: 0}, cursor)
            const textAfter = cm.getRange(cursor, {line: cm.lineCount(), ch: 0})
            return { type: 'cm', cm, cursor, textBefore, textAfter }
        }
    }

    // Try input/textarea
    const active = getActiveTextInput()
    if (active) {
        const pos = active.selectionStart ?? 0
        return {
            type: 'input',
            input: active,
            textBefore: active.value.slice(0, pos),
            textAfter: active.value.slice(pos),
            pos
        }
    }

    // Try DOM selection
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
        const caret = sel.getRangeAt(0).cloneRange()
        caret.collapse(true)
        const block = getCurrentBlock(caret.endContainer)
        const pre = document.createRange()
        pre.selectNodeContents(block)
        pre.setEnd(caret.endContainer, caret.endOffset)
        const textBefore = pre.toString() || ""
        return { type: 'dom', textBefore, textAfter: "", block }
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

    const root = getCurrentBlock(caret.endContainer)
    const pre = document.createRange()
    pre.selectNodeContents(root)
    pre.setEnd(caret.endContainer, caret.endOffset)
    const caretIndex = pre.toString().length
    const startIndex = caretIndex - count
    if (startIndex < 0) return null

    return getRangeFromAbsoluteOffsets(startIndex, caretIndex, root)
}


function getRangeFromAbsoluteOffsets(startIndex, endIndex, root = getEditorRoot()) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node
    let total = 0
    let startNode = null
    let startOffset = 0
    let endNode = null
    let endOffset = 0
    let lastNode = null

    while ((node = walker.nextNode())) {
        lastNode = node
        const len = (node.textContent || "").length
        const nextTotal = total + len

        if (!startNode && startIndex < nextTotal) {
            startNode = node
            startOffset = Math.max(0, startIndex - total)
        }
        if (!endNode && endIndex <= nextTotal) {
            endNode = node
            endOffset = Math.max(0, endIndex - total)
        }

        total = nextTotal
        if (startNode && endNode) break
    }

    if (!startNode && lastNode && startIndex === total) {
        startNode = lastNode
        startOffset = lastNode.textContent.length
    }
    if (!endNode && lastNode && endIndex === total) {
        endNode = lastNode
        endOffset = lastNode.textContent.length
    }

    if (!startNode || !endNode) return null
    const range = document.createRange()
    try {
        range.setStart(startNode, startOffset)
        range.setEnd(endNode, endOffset)
    } catch(e) { return null }
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
        cursor: state.cursor
    }
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
        if (char === ')') p++
        else if (char === '(') p--
        else if (char === ']') b++
        else if (char === '[') b--
        else if (char === '}') {
            if (i > 0 && text[i - 1] === '\\') {
                i--
            } else {
                c++
            }
        } else if (char === '{') {
            if (i > 0 && text[i - 1] === '\\') {
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
let tabstops = []       // [{node, start, end, index}]
let tabstopIdx = 0
let suppressAutoExpand = false
let tabstopDirty = false
let lastExpansion = null // Record for Ctrl+Z undo

function clearTabstops() { tabstops = []; tabstopIdx = 0 }

function beginSuppressAutoExpand() {
    suppressAutoExpand = true
}

function endSuppressAutoExpandSoon() {
    // Delay until after the current event loop to avoid re-expansion triggered by programmatic input events
    // 延迟到当前事件循环之后，避免由程序化插入触发的 input 事件再次展开
    setTimeout(() => { suppressAutoExpand = false }, 0)
}

function getAbsoluteCaretIndex(root) {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    const caret = sel.getRangeAt(0).cloneRange()
    caret.collapse(true)
    const rangeRoot = root || getCurrentBlock(caret.endContainer)
    if (root && typeof root.contains === "function" && !root.contains(caret.endContainer)) return null
    const pre = document.createRange()
    pre.selectNodeContents(rangeRoot)
    pre.setEnd(caret.endContainer, caret.endOffset)
    return pre.toString().length
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
    const lines = slice.split('\n')
    const relLine = lines.length - 1
    const relCh = lines[relLine].length
    return {
        line: basePos.line + relLine,
        ch: relLine === 0 ? basePos.ch + relCh : relCh
    }
}

function shiftFollowingTabstops(currentIdx) {
    const cur = tabstops[currentIdx]
    if (!cur || currentIdx + 1 >= tabstops.length) return
    if (!tabstopDirty) return

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

        for (let i = currentIdx + 1; i < tabstops.length; i++) {
            const ts = tabstops[i]
            if (ts.input === cur.input) {
                ts.start += delta
                ts.end += delta
            }
        }
        tabstopDirty = false
        return
    }

    const caret = getAbsoluteCaretIndex(cur.root)
    if (caret == null) return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return

    const oldLen = Math.max(0, cur.endIndex - cur.startIndex)
    const stillSelected = !sel.getRangeAt(0).collapsed
    const newLen = stillSelected ? oldLen : Math.max(0, caret - cur.startIndex)
    const delta = newLen - oldLen
    if (!Number.isFinite(delta) || delta === 0) return

    cur.endIndex = cur.startIndex + newLen

    for (let i = currentIdx + 1; i < tabstops.length; i++) {
        const ts = tabstops[i]
        if (!ts.input) {
            ts.startIndex += delta
            ts.endIndex += delta
        }
    }
    tabstopDirty = false
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

    for (const s of SNIPPETS) {
        const opts = s.options || ""
        const isAuto   = opts.includes("A")
        const mathOnly = opts.includes("m")
        const textOnly = opts.includes("t")
        const wordBound= opts.includes("w")
        const newLine  = opts.includes("M")
        const notNewLine= opts.includes("n")
        const isRegex  = opts.includes("r")

        // Mode filtering / 模式过滤
        if (mathOnly && !inMath) continue
        if (textOnly && inMath) continue
        if (!isAuto && isAutoKey) continue
        if (newLine && !inNewLine) continue
        if (notNewLine && inNewLine) continue

        // Removed tabstop check to allow nested snippets

        // Match / 匹配
        const re = s.triggerRe
        const flags = (re.flags || "").replace(/g/g, "")
        const source = re.source.endsWith("$") ? re.source : re.source + "$"
        const fullRe = new RegExp(source, flags)
        const match = before.match(fullRe)
        if (!match) continue

        // Word boundary detection / 单词边界检测
        if (wordBound) {
            const triggerStr = match[0]
            const prevChar = before[before.length - triggerStr.length - 1]
            if (prevChar && /\w/.test(prevChar)) continue
        }

        let actualMatched = match[0]
        
        // Smartly absorb leading backslash: prevent repeating into \\ after manually typing \, while preserving placeholder functionality
        // 智能吸收前导反斜杠：防止手打 \ 后重复补全为 \\，同时也保留 snippet 的占位符功能
        if (typeof s.trigger === "string" && !s.trigger.startsWith("\\")) {
            const prevChar = before[before.length - match[0].length - 1]
            if (prevChar === "\\") {
                const repStr = typeof s.replacement === "function" ? "" : s.replacement
                if (repStr.startsWith("\\")) {
                    actualMatched = "\\" + match[0]
                }
            }
        }

        // Calculate replacement content / 计算替换内容
        let replacement
        if (typeof s.replacement === "function") {
            replacement = s.replacement(match)
        } else {
            replacement = s.replacement
            // [[N]] -> Capture group / 捕获组
            replacement = replacement.replace(/\[\[(\d+)\]\]/g, (_, n) => match[parseInt(n) + 1] || "")
        }

        doExpand(actualMatched, replacement)
        return true
    }
    return false
}

// ── Actual Replacement + Tabstop Injection / 实际替换 + tabstop 注入 ───────────────────────
    function doExpand(matched, replacement) {
    // Parse placeholders and generate final text while recording placeholder positions within inserted text
    // 解析占位符并生成最终文本，同时记录占位符在插入文本内的位置
    const tsRe = /\$\{(\d+):([^}]*)\}|\$(\d+)/g
    const tabstopPositions = []
    let finalText = ""
    let last = 0
    let m

    while ((m = tsRe.exec(replacement)) !== null) {
        finalText += replacement.slice(last, m.index)
        const idx = parseInt(m[1] ?? m[3])
        const text = m[2] || ""
        const start = finalText.length
        finalText += text
        const end = finalText.length
        tabstopPositions.push({ idx, start, end })
        last = m.index + m[0].length
    }
    finalText += replacement.slice(last)

    // Keep only the first jump point for tabstops with same ID, jump in ascending order
    // 同编号 tabstop 只保留首个跳转点，按编号升序跳转
    const firstByIdx = new Map()
    for (const ts of tabstopPositions) {
        if (!firstByIdx.has(ts.idx)) {
            firstByIdx.set(ts.idx, ts)
        }
    }
    const orderedTabstops = [...firstByIdx.values()].sort((a, b) => a.idx - b.idx)

    const ctx = getMathContext()
    if (ctx && ctx.cm) {
        const cm = ctx.cm
        const curCursor = cm.getCursor()
        const cmText = cm.getValue()

        const endOffset = lineChToOffset(cmText, curCursor)
        // we check how much of the matched text has actually been synced to CodeMirror.
        const preText = cmText.slice(0, endOffset)
        let actualDeleteLen = matched.length
        if (matched.length > 0 && !preText.endsWith(matched)) {
            for (let i = matched.length - 1; i >= 0; i--) {
                if (preText.endsWith(matched.slice(0, i))) {
                    actualDeleteLen = i
                    break
                }
            }
        }

        const startOffset = Math.max(0, endOffset - actualDeleteLen)
        const startPos = offsetToLineCh(cmText, startOffset)

        lastExpansion = {
            time: Date.now(),
            matched: matched,
            finalText: finalText,
            isCm: true,
            input: cm,
            startIndex: startOffset
        }

        cm.replaceRange(finalText, startPos, curCursor)
        
        const cmTextAfter = cm.getValue()

        if (tabstops.length > 0 && tabstopIdx < tabstops.length) {
            tabstopDirty = true
            shiftFollowingTabstops(tabstopIdx)
        }

        if (orderedTabstops.length > 0) {
            const newTs = orderedTabstops.map(ts => {
                const absStart = offsetToAbsolutePosition(ts.start, finalText, startPos)
                const absEnd = offsetToAbsolutePosition(ts.end, finalText, startPos)
                return {
                    isCm: true,
                    input: cm,
                    start: lineChToOffset(cmTextAfter, absStart),
                    end: lineChToOffset(cmTextAfter, absEnd),
                }
            })
            if (tabstops.length > 0 && tabstopIdx < tabstops.length) {
                tabstops.splice(tabstopIdx + 1, 0, ...newTs)
                tabstopIdx++
                jumpToTabstop(tabstopIdx)
            } else {
                tabstops = newTs
                tabstopIdx = 0
                jumpToTabstop(0)
            }
        }
        endSuppressAutoExpandSoon()
        return
    }
    const active = getActiveTextInput()
    if (active) {
        const end = active.selectionStart ?? 0
        const start = Math.max(0, end - matched.length)
        
        lastExpansion = {
            time: Date.now(),
            matched: matched,
            finalText: finalText,
            isCm: false,
            input: active,
            startIndex: start
        }
        
        active.setRangeText(finalText, start, end, "end")
        active.dispatchEvent(new Event("input", { bubbles: true }))

        if (tabstops.length > 0 && tabstopIdx < tabstops.length) {
            tabstopDirty = true
            shiftFollowingTabstops(tabstopIdx)
        }

        if (orderedTabstops.length > 0) {
            const newTs = orderedTabstops.map(ts => ({
                input: active,
                start: start + ts.start,
                end: start + ts.end,
            }))
            if (tabstops.length > 0 && tabstopIdx < tabstops.length) {
                tabstops.splice(tabstopIdx + 1, 0, ...newTs)
                tabstopIdx++
                jumpToTabstop(tabstopIdx)
            } else {
                tabstops = newTs
                tabstopIdx = 0
                jumpToTabstop(0)
            }
        }
        endSuppressAutoExpandSoon()
        return
    }

    // Select trigger word (cross-node available) and replace
    // 选中触发词（跨节点可用）并替换
    const selected = selectPreviousChars(matched.length)
    if (!selected) {
        endSuppressAutoExpandSoon()
        return
    }

    const preSel = window.getSelection()
    let absoluteStartIndex = 0
    if (preSel && preSel.rangeCount > 0) {
        const caret = preSel.getRangeAt(0).cloneRange()
        const pre = document.createRange()
        pre.selectNodeContents(getCurrentBlock(caret.endContainer))
        pre.setEnd(caret.startContainer, caret.startOffset)
        absoluteStartIndex = pre.toString().length
    }

    lastExpansion = {
        time: Date.now(),
        matched: matched,
        finalText: finalText,
        isCm: false,
        startIndex: absoluteStartIndex
    }
    
    if (finalText === "") { document.execCommand("delete"); } else { document.execCommand("insertText", false, finalText); }
    try {
        const afterSel = window.getSelection();
        if (afterSel && afterSel.rangeCount > 0) {
            afterSel.collapseToEnd();
        }
    } catch(e) {}


    if (tabstops.length > 0 && tabstopIdx < tabstops.length) {
        tabstopDirty = true
        shiftFollowingTabstops(tabstopIdx)
    }

    // Record and jump to the first placeholder (prioritize smallest idx)
    // 记录并跳到第一个占位符（优先最小 idx）
    if (orderedTabstops.length > 0) {
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0) return
        const caret = sel.getRangeAt(0).cloneRange()
        const pre = document.createRange()
        pre.selectNodeContents(getCurrentBlock(caret.endContainer))
        pre.setEnd(caret.endContainer, caret.endOffset)
        const endIndex = pre.toString().length
        const startIndex = Math.max(0, endIndex - finalText.length)

            const root = getCurrentBlock(caret.endContainer);
            const newTs = orderedTabstops.map(ts => ({
                startIndex: startIndex + ts.start,
                endIndex: startIndex + ts.end,
                root: root
            }))
            if (tabstops.length > 0 && tabstopIdx < tabstops.length) {
                tabstops.splice(tabstopIdx + 1, 0, ...newTs)
                tabstopIdx++
                jumpToTabstop(tabstopIdx)
            } else {
                tabstops = newTs
                tabstopIdx = 0
                jumpToTabstop(0)
            }
        }
        endSuppressAutoExpandSoon()
    }

    function offsetToLineCh(text, offset) {
        const slice = text.slice(0, offset)
        const lines = slice.split("\n")
        return { line: lines.length - 1, ch: lines[lines.length - 1].replace(/\r/g, "").length }
    }

  function jumpToTabstop(idx) {
      if (idx >= tabstops.length) { clearTabstops(); return }
      const ts = tabstops[idx]
      tabstopDirty = false

      if (ts.isCm) {
          try {
              const cmText = ts.input.getValue()
              const startPos = offsetToLineCh(cmText, ts.start)
              const endPos = offsetToLineCh(cmText, ts.end)

              ts.input.focus()
              ts.input.setSelection(startPos, endPos)

              if (idx === tabstops.length - 1) clearTabstops()
              if (tabstops.length > 0) tabstopDirty = true
              return
            } catch (e) {
              clearTabstops()
              return
          }
      }

      if (ts.input) {
          try {
              ts.input.setSelectionRange(ts.start, ts.end)
              ts.input.focus()

              if (idx === tabstops.length - 1) clearTabstops()
              if (tabstops.length > 0) tabstopDirty = true
              return
            } catch (e) {
              clearTabstops()
              return
          }
      }

      try {
          const range = getRangeFromAbsoluteOffsets(ts.startIndex, ts.endIndex, ts.root)
          if (!range) {
              clearTabstops()
              return
          }
          const sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
          if (idx === tabstops.length - 1) clearTabstops()
          if (tabstops.length > 0) tabstopDirty = true
          } catch(e) { clearTabstops() }
  }

// ── Plugin Main Body / 插件主体 ──────────────────────────────────────
const LISTENER_STORE_KEY = "__latexSuitePluginListeners__"
const NO_PAIRING_BASELINE_KEY = "__latexSuitePluginNoPairingBaseline__"

class latexSuitePlugin extends BaseCustomPlugin {

    selector = () => "#write"

    process = () => {
        const prev = window[LISTENER_STORE_KEY]
        if (prev) {
            document.removeEventListener("keydown", prev.onKeyDown, true)
            document.removeEventListener("input", prev.onInput, false)
            if (prev.onSelectionChange) {
                document.removeEventListener("selectionchange", prev.onSelectionChange, false)
            }
        }

        if (window.File && File.option && typeof window[NO_PAIRING_BASELINE_KEY] !== "boolean") {
            window[NO_PAIRING_BASELINE_KEY] = Boolean(File.option.noPairingMatch)
        }

        document.addEventListener("keydown", this.onKeyDown, true)
        document.addEventListener("input", this.onInput, false)

        let cachedInMath = null
        let cachedNoPairingMatch = null
        let cachedCm = null
        let cachedAutoClose = null

        const onSelectionChange = () => {
            if (window.File && File.option) {
                if (typeof window[NO_PAIRING_BASELINE_KEY] !== "boolean") {
                    window[NO_PAIRING_BASELINE_KEY] = Boolean(File.option.noPairingMatch)
                }
                const initialNoPairingMatch = window[NO_PAIRING_BASELINE_KEY]
                
                const inMath = isInMath()
                const targetNoPairingMatch = inMath ? true : initialNoPairingMatch

                const cm = (File.editor && File.editor.mathBlock ? File.editor.mathBlock.currentCm : null) ||
                           (File.editor && File.editor.fences ? File.editor.fences.currentCm : null)
                const targetAutoClose = inMath ? false : !targetNoPairingMatch
                const canUseCmOption = Boolean(
                    cm &&
                    typeof cm.getOption === "function" &&
                    typeof cm.setOption === "function"
                )
                const cmAlreadySynced = !canUseCmOption || cm.getOption("autoCloseBrackets") === targetAutoClose

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
                    cm.setOption("autoCloseBrackets", targetAutoClose)
                }

                cachedInMath = inMath
                cachedNoPairingMatch = targetNoPairingMatch
                cachedCm = cm
                cachedAutoClose = targetAutoClose
            }
        }

        document.addEventListener("selectionchange", onSelectionChange, false)
        window[LISTENER_STORE_KEY] = {
            onKeyDown: this.onKeyDown,
            onInput: this.onInput,
            onSelectionChange,
        }
    }

    onKeyDown = (e) => {
        if (!isInEditableContext()) return

        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
            if (lastExpansion && Date.now() - lastExpansion.time < 5000) {
                e.preventDefault()
                e.stopPropagation()
                
                beginSuppressAutoExpand()
                if (lastExpansion.isCm) {
                    const cm = lastExpansion.input
                    const text = cm.getValue()
                    const startPos = offsetToLineCh(text, lastExpansion.startIndex)
                    const endPos = offsetToLineCh(text, lastExpansion.startIndex + lastExpansion.finalText.length)
                    cm.replaceRange(lastExpansion.matched, startPos, endPos)    
                } else if (lastExpansion.input) {
                    const input = lastExpansion.input
                    const start = lastExpansion.startIndex
                    const end = start + lastExpansion.finalText.length
                    input.setRangeText(lastExpansion.matched, start, end, "end")
                    input.dispatchEvent(new Event("input", { bubbles: true }))
                } else {
                    document.execCommand("undo", false, null)
                }
                endSuppressAutoExpandSoon()
                
                clearTabstops()
                lastExpansion = null
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
                        document.execCommand("insertText", false, "\n")
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
                            ctx.cm.setCursor({line: nextLine, ch: nextLineLen})
                        } else {
                            const curLineLen = ctx.cm.getLine(cur.line).length
                            ctx.cm.setCursor({line: cur.line, ch: curLineLen})
                        }
                    }
                    return
                } else {
                    e.preventDefault()
                    e.stopPropagation()
                    if (ctx.cm) {
                        ctx.cm.replaceSelection(" \\\\\n")
                    } else {
                        document.execCommand("insertText", false, " \\\\\n")
                    }
                    return
                }
            }
        }

        if (e.key === "Tab") {
            const before = getTextBeforeCursor(8)

            // 先同步一下手敲字符产生的位移，保证外层 tabstop 追踪正确
            if (tabstops.length > 0 && tabstopIdx < tabstops.length) {
                shiftFollowingTabstops(tabstopIdx)
            }

            const expanded = tryExpandSnippet(false)
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
            if (tabstops.length > 0 && tabstopIdx < tabstops.length) {
                e.preventDefault()
                e.stopPropagation()
                shiftFollowingTabstops(tabstopIdx)
                tabstopIdx++
                jumpToTabstop(tabstopIdx)
                return
            }

            const ctx = getMathContext()
            if (ctx && isInsideEnvironment(ctx) && !e.shiftKey) {
                e.preventDefault()
                e.stopPropagation()
                if (ctx.cm) {
                    ctx.cm.replaceSelection(" & ")
                } else {
                    document.execCommand("insertText", false, " & ")
                }
                return
            }
            return
        }

        if (e.key === "Escape"  || e.key === "ArrowRight" || e.key === "ArrowDown") {
            clearTabstops()
        }
    }

    // Auto-trigger (A flag): scan after every input
    // 自动触发（A 标志）：每次输入后扫描
    onInput = (e) => {
        if (suppressAutoExpand) return
        if (!isInEditableContext()) return
        
        // Disable auto-expansion when deleting or moving cursor, only trigger upon writing text
        if (e && e.inputType && (
            e.inputType.startsWith("delete") || 
            e.inputType === "historyUndo" ||
            e.inputType === "historyRedo"
        )) {
            return
        }

        // When navigating placeholders, record edit state and allow snippets without placeholders to continue expanding
        // 正在占位符导航时，记录编辑状态，并允许不含占位符的 snippet 继续展开
        if (tabstops.length > 0) {
            tabstopDirty = true
        }
        tryExpandSnippet(true)
    }
}

module.exports = { plugin: latexSuitePlugin }