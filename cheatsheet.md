# Typora Latex Suite Snippet Cheatsheet

## 阅读约定

- <code>•</code> 表示占位符；按 <kbd>Tab</kbd> 依次跳转。
- 多数规则自动展开；复杂分式与部分正则规则可按 <kbd>Tab</kbd> 展开。
- 不想展开时可立即按 <kbd>Ctrl</kbd>+<kbd>Z</kbd>。
- 重复规则合并为模式行，但下列触发词覆盖全部启用的 snippets。

## 1. 公式模式

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>mk</code>（正文） | 切换行内公式 | 进入/退出 <code>\$…\$</code> |
| <code>dm</code>（正文） | 切换块级公式 | 进入/退出 <code>$$…$$</code> |

## 2. 希腊字母

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>@a @b @g</code> | <code>\alpha \beta \gamma</code> | $\alpha,\beta,\gamma$ |
| <code>@G @d @D</code> | <code>\Gamma \delta \Delta</code> | $\Gamma,\delta,\Delta$ |
| <code>@e :e @z</code> | <code>\epsilon \varepsilon \zeta</code> | $\epsilon,\varepsilon,\zeta$ |
| <code>@t @T :t</code> | <code>\theta \Theta \vartheta</code> | $\theta,\Theta,\vartheta$ |
| <code>@i @k @l @L</code> | <code>\iota \kappa \lambda \Lambda</code> | $\iota,\kappa,\lambda,\Lambda$ |
| <code>@s @S @u @U</code> | <code>\sigma \Sigma \upsilon \Upsilon</code> | $\sigma,\Sigma,\upsilon,\Upsilon$ |
| <code>@o</code>/<code>ome</code>, <code>@O</code>/<code>Ome</code> | <code>\omega</code>, <code>\Omega</code> | $\omega,\Omega$ |
| <code>:p</code> | <code>\varphi</code> | $\varphi$ |
| <code>alpha beta ... omega</code> | 自动补反斜杠 | $\alpha,\beta,\ldots,\omega$ |
| <code>Gamma Delta ... Omega</code> | 自动补反斜杠 | $\Gamma,\Delta,\ldots,\Omega$ |
| <code>betaE</code> 等 | 自动插入命令分隔空格 | $\beta E$ |

## 3. 文本、字体与字母样式

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>text</code> 或 <code>"</code> | <code>\text{ • }</code> | $\text{文本}$ |
| <code>bf rm cal</code> | <code>\mathbf{•} \mathrm{•} \mathcal{•}</code> | $\mathbf{x},\mathrm{x},\mathcal{F}$ |
| <code>a,.</code> 或 <code>a.,</code>（任意字母） | <code>\mathbf{a}</code> | $\mathbf{a}$ |
| <code>\alpha,.</code> 或 <code>\alpha.,</code> | <code>\boldsymbol{\alpha}</code> | $\boldsymbol{\alpha}$ |
| <code>abb</code>（除 v/V 外任意字母） | <code>\mathbb{a}</code> | $\mathbb{a}$ |
| <code>LL HH UU</code> | <code>\mathcal{L/H/U}</code> | $\mathcal{L},\mathcal{H},\mathcal{U}$ |
| <code>CC RR ZZ NN</code> | <code>\mathbb{C/R/Z/N}</code> | $\mathbb{C},\mathbb{R},\mathbb{Z},\mathbb{N}$ |
| <code>Re Im</code> | <code>\Re \Im</code> | $\Re z,\Im z$ |
| <code>Tr</code> | physics：<code>\Tr</code><br>标准：<code>\operatorname{Tr}</code> | $\operatorname{Tr}A$ |

## 4. 上标、下标、根式与分式

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>sr cb</code> | <code>^{2} ^{3}</code> | $x^2,x^3$ |
| <code>^^ __</code> | <code>^{•} _{•}</code> | $x^n,x_i$ |
| <code>\alpha sr/cb/^^/__</code>（任意希腊字母/基础符号） | 把上下标附到原命令 | $\alpha^2,\alpha_i$ |
| <code>sts sq //</code> | <code>_\text{•}</code>, <code>\sqrt{•}</code>, <code>\frac{•}{•}</code> | $x_{\text{label}},\sqrt{x},\frac{x}{y}$ |
| <code>ee inv conj dag</code> | <code>e^{•}</code>, <code>^{-1}</code>, <code>^{*}</code>, <code>^{\dagger}</code> | $e^x,A^{-1},z^*,A^\dagger$ |
| <code>x1</code>/<code>x12</code>，<code>\alpha1</code>/<code>\alpha12</code> | 自动合并数字下标 | $x_1,x_{12},\alpha_1,\alpha_{12}$ |
| <code>xhat1</code>、<code>@ahat1</code> 等 | 修饰后的整体自动下标 | $\hat{x}_1,\hat{\alpha}_1$ |
| <code>xnn xii xjj xp1 xm1</code> | <code>x_n x_i x_j x_{n+1} x_{n-1}</code> | $x_n,x_i,x_j,x_{n+1},x_{n-1}$ |
| <code>ynn yii yjj</code> | <code>y_n y_i y_j</code> | $y_n,y_i,y_j$ |

## 5. 修饰符、向量与态矢

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>hat bar dot ddot tilde vec</code> | 对应 LaTeX 修饰命令 | $\hat{x},\bar{x},\dot{x},\ddot{x},\tilde{x},\vec{x}$ |
| <code>und over</code> | <code>\underline{•} \overline{•}</code> | $\underline{x},\overline{x}$ |
| <code>xhat xbar xdot xddot xtilde xvec xund xover</code> | 直接吸收前面的字母 | $\hat{x},\bar{x},\dot{x},\ddot{x}$ |
| <code>@ahat</code>、<code>\alpha hat</code> 等 | 直接吸收希腊字母 | $\hat{\alpha}$ |
| <code>vaa</code>/<code>xvaa</code> | physics：<code>\va</code><br>标准：<code>\vec</code> | $\vec{x}$ |
| <code>vbb</code>/<code>xvbb</code> | physics：<code>\vb</code><br>标准：<code>\mathbf</code> | $\mathbf{x}$ |
| <code>vuu</code>/<code>xvuu</code> | physics：<code>\vu</code><br>标准：<code>\hat{\mathbf{•}}</code> | $\hat{\mathbf{x}}$ |
| <code>bra ket</code> | physics 命令或标准显式定界符 | $\langle\psi\vert,\vert\psi\rangle$ |
| <code>xbra xket</code>，或希腊字母后接 <code>bra/ket</code> | 吸收前面的字母 | $\langle x\vert,\vert\alpha\rangle$ |
| <code>pmod</code>，或字母/希腊字母后接 <code>pmod</code> | <code>\pmod{•}</code> | $x\pmod n$ |

## 6. 常用符号与关系

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>ooo nabl hbar</code> | <code>\infty \nabla \hbar</code> | $\infty,\nabla,\hbar$ |
| <code>+- -+</code> | <code>\pm \mp</code> | $\pm,\mp$ |
| <code>... v.. d..</code> | <code>\cdots \vdots \ddots</code> | $\cdots,\vdots,\ddots$ |
| <code>cdot</code> 或 <code>**</code> | <code>\cdot</code> | $a\cdot b$ |
| <code>xx ox o+</code> | <code>\times \otimes \oplus</code> | $\times,\otimes,\oplus$ |
| <code>grad</code> | physics：<code>\grad</code><br>标准：<code>\nabla</code> | $\nabla f$ |
| <code>div</code> | <code>\div</code> | $a\div b$ |
| <code>curl</code> | physics：<code>\curl</code><br>标准：<code>\nabla\times</code> | $\nabla\times\mathbf A$ |
| <code>lapl</code> | physics：<code>\laplacian</code><br>标准：<code>\nabla^2</code> | $\nabla^2f$ |
| <code>=== != &gt;= &lt;= &gt;&gt; &lt;&lt;</code> | <code>\equiv \neq \geq \leq \gg \ll</code> | $\equiv,\neq,\geq,\leq,\gg,\ll$ |
| <code>simm sim= ~= \~=</code> | <code>\sim \simeq \approx</code> | $\sim,\simeq,\approx$ |
| <code>prop para</code> | <code>\propto \parallel</code> | $\propto,\parallel$ |
| <code>&lt;-&gt; -&gt; !&gt;</code> | <code>\leftrightarrow \to \mapsto</code> | $\leftrightarrow,\to,\mapsto$ |
| <code>=&gt; =&lt;</code> | <code>\implies \impliedby</code> | $\implies,\impliedby$ |
| <code>and orr</code> | <code>\cap \cup</code> | $\cap,\cup$ |
| <code>inn notin</code> | <code>\in \not\in</code> | $\in,\notin$ |
| <code>sub= sup=</code> | <code>\subseteq \supseteq</code> | $\subseteq,\supseteq$ |
| <code>\\\</code> | <code>\setminus</code> | $A\setminus B$ |
| <code>eset set</code> | <code>\emptyset</code>, <code>\\{•\\}</code> | $\emptyset,\{x\}$ |
| <code>exists vert</code> | <code>\exists \vert</code> | $\exists x,\vert$ |

插件还会在已展开的希腊字母或这些命令后继续输入英文字母时自动补空格。

## 7. 求和、乘积与函数

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>sum prod</code> | <code>\sum \prod</code> | $\sum,\prod$ |
| <code>ssum pprod</code> | 带 i、1、N 占位符的求和/乘积 | $\sum_{i=1}^Nx_i,\prod_{i=1}^Nx_i$ |
| <code>lim</code> | <code>\lim_{n\to\infty}•</code> | $\lim_{n\to\infty}a_n$ |
| <code>exp ln log</code> | <code>\exp \ln \log</code> | $\exp x,\ln x,\log x$ |
| <code>det Pr</code> | <code>\det \Pr</code> | $\det A,\Pr(A)$ |
| <code>rank erf Res</code> | physics 命令；标准模式用 <code>\operatorname</code> | $\operatorname{rank}A,\operatorname{erf}x,\operatorname{Res}f$ |
| <code>sin cos tan csc sec cot</code> | 自动补反斜杠 | $\sin x,\cos x,\tan x,\csc x,\sec x,\cot x$ |
| <code>arcsin arccos arctan</code> | 自动补反斜杠 | $\arcsin x,\arccos x,\arctan x$ |
| <code>sinh cosh tanh coth</code> 后接字母 | 自动插入分隔空格 | $\sinh x,\cosh x,\tanh x,\coth x$ |
| <code>arccsc arcsec arccot</code> | <code>\operatorname{…}</code> | $\operatorname{arccsc}x,\operatorname{arcsec}x,\operatorname{arccot}x$ |

## 8. 分式

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>//</code> | <code>\frac{•}{•}</code> | $\frac{x}{y}$ |
| <code>a/</code>，<code>(a+b)/</code> | 把左侧字母串或括号内容作为分子 | $\frac a b,\frac{a+b}c$ |
| <code>a/b</code> | 把两侧字母串作为分子、分母 | $\frac a b$ |
| <code>(a+b)/c</code>，<code>a/(b+c)</code> | 自动识别单侧括号 | $\frac{a+b}c,\frac a{b+c}$ |
| <code>(a+b)/(c+d)</code> | 自动识别两侧括号 | $\frac{a+b}{c+d}$ |

## 9. 微分、偏导与积分

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>ddx ddt</code> | physics：<code>\dd{x/t}</code><br>标准：<code>\,\mathrm d x/t</code> | $\mathrm dx,\mathrm dt$ |
| <code>ddd dd1</code> | 一阶微分，占位符可编辑 | $\mathrm dx$ |
| <code>dd2</code>…<code>dd9</code> | 指定阶数的微分 | $\mathrm d^nx$ |
| <code>dv0 dv1</code> | 无分子/有分子的全导数 | $\frac{\mathrm d}{\mathrm dx},\frac{\mathrm dy}{\mathrm dx}$ |
| <code>dv2</code>…<code>dv9</code> | n 阶全导数 | $\frac{\mathrm d^ny}{\mathrm dx^n}$ |
| <code>pdv0 pdv1 pdvv</code> | 无分子/有分子的偏导 | $\frac{\partial}{\partial x},\frac{\partial y}{\partial x}$ |
| <code>pdv2</code>…<code>pdv9</code> | n 阶偏导 | $\frac{\partial^ny}{\partial x^n}$ |
| <code>pdv:</code> | 混合二阶偏导 | $\frac{\partial^2z}{\partial x\,\partial y}$ |
| <code>pdv_</code> | 带保持变量的偏导 | $\left(\frac{\partial y}{\partial x}\right)_t$ |
| <code>paFx paFxy paFx_y</code> | 紧凑偏导写法 | $\frac{\partial F}{\partial x},\frac{\partial^2F}{\partial x\partial y},\left(\frac{\partial F}{\partial x}\right)_y$ |
| <code>pa2Fx</code>…<code>pa9Fx</code> | 指定阶数偏导 | $\frac{\partial^nF}{\partial x^n}$ |
| <code>int oint iint iiint</code> | 对应积分符号 | $\int,\oint,\iint,\iiint$ |
| <code>dint</code> | 有限区间积分模板 | $\int_0^1f(x)\,\mathrm dx$ |
| <code>oinf infi</code> | 半无限/全实轴积分模板 | $\int_0^\infty f\,\mathrm dx,\int_{-\infty}^{\infty}f\,\mathrm dx$ |

## 10. 括号、量子力学与组合

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>( [ { \{ &#124;</code> | 自动补成对定界符 | $(x),[x],\{x\},\lvert x\rvert$ |
| <code>lr( lr[ lr{</code> | physics：<code>\qty</code><br>标准：<code>\left…\right</code> | $\left(x\right),\left[x\right],\left\{x\right\}$ |
| <code>abs norm</code> | physics 命令或标准显式定界符 | $\lvert x\rvert,\lVert x\rVert$ |
| <code>ceil floor</code> | <code>\lceil•\rceil \lfloor•\rfloor</code> | $\lceil x\rceil,\lfloor x\rfloor$ |
| <code>evv</code> | physics：<code>\ev</code><br>标准：角括号 | $\langle A\rangle$ |
| <code>ipp opp</code> | 内积、外积 | $\langle\phi\vert\psi\rangle,\vert\phi\rangle\!\langle\psi\vert$ |
| <code>mel</code> | 矩阵元 | $\langle\phi\vert A\vert\psi\rangle$ |
| <code>comm acomm</code> | 对易子、反对易子 | $[A,B],\{A,B\}$ |
| <code>binom</code> | <code>\binom{n}{k}</code> | $\binom nk$ |
| <code>boxed</code> |  <code>\boxed{•}</code> | $\boxed{x}$ |

## 11. 矩阵与环境

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>matrix cases align array gathered</code> | <code>\begin{环境} … \end{环境}</code> | 创建对应环境 |
| <code>mat(</code> | physics：<code>\pmqty</code><br>标准：<code>pmatrix</code> | $\begin{pmatrix}a&b\\c&d\end{pmatrix}$ |
| <code>mat[</code> | physics：<code>\bmqty</code><br>标准：<code>bmatrix</code> | $\begin{bmatrix}a&b\\c&d\end{bmatrix}$ |
| <code>mat&#124;</code> | physics：<code>\mdet</code><br>标准：<code>vmatrix</code> | $\begin{vmatrix}a&b\\c&d\end{vmatrix}$ |
| <code>imat dmat xmat</code> | physics 对应矩阵命令；标准模式使用 <code>pmatrix</code> | 单位、对角或一般矩阵模板 |

### 环境内按键

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <kbd>Tab</kbd> | 插入 <code>&amp;</code> | 下一列 |
| <kbd>Enter</kbd> | 插入 <code>\\</code> 并换行 | 下一行 |
| <kbd>Ctrl</kbd>+<kbd>Enter</kbd> | 逐行跳转，最后离开环境 | — |
| <kbd>Shift</kbd>+<kbd>Enter</kbd> | 仅换行 | — |

## 12. 物理、化学与核素

| 简写 | 展开 | 公式效果 |
| --- | --- | --- |
| <code>kbt msun</code> | <code>k_{B}T</code>, <code>M_{\odot}</code> | $k_BT,M_\odot$ |
| <code>pu</code> | <code>\pu{•}</code> | 物理单位（通常需要 <code>mhchem</code>） |
| <code>cee</code> | <code>\ce{•}</code> | 化学式（需要 <code>mhchem</code>） |
| <code>he4 he3</code> | <code>{}^{4}_{2}He</code>, <code>{}^{3}_{2}He</code> | ${}^{4}_{2}\mathrm{He},{}^{3}_{2}\mathrm{He}$ |
| <code>iso</code> | <code>{}^{•}_{•}•</code> | ${}^{A}_{Z}X$ |