# Typora Latex-Suite 插件

> 本插件使用 AI Agent 工具 辅助编写。

## 安装说明

1. 先下载 [obgnail/typora_plugin: Typora plugin. Feature enhancement tool](https://github.com/obgnail/typora_plugin) 插件并按要求配置；

2. 在 Typora 的安装目录下 `./plugin/global/settings/custom_plugin.user.toml` 位置插入代码：

   ```toml
   [latexSuitePlugin]
   name = "Latex Suite"
   enable = true
   hide = false
   order = 1
   use_physics_package = true
   ```

3. 将 `latexSuitePlugin.js` 文件和 `latex-suite` 目录复制到 `./plugin/custom/plugins` 目录下。

## 快速上手

查看目录下的 [cheatsheet](./cheatsheet.md) 获取插件支持的 snippets 列表。您也可以通过修改 `snippets.js` 文件添加自定义配置。

## 切换片段配置

默认使用已经加载 `physics` 宏包的片段配置。切换时编辑 Typora 安装目录中的
`./plugin/global/settings/custom_plugin.user.toml`：

```toml
[latexSuitePlugin]
use_physics_package = true # false
```

可选值为：

- `true`：`snippets.js` 输出使用 `physics` 宏包命令，这是默认值；
- `false`：同一份 `snippets.js` 输出标准 LaTeX/amsmath 命令。

运行 `npm test` 可以执行不依赖 Typora 的回归测试。当前实现以 typora_plugin 1.17.x 的接口为兼容基线。

## 开发

插件入口以 [typora_plugin](https://github.com/obgnail/typora_plugin) 规范统一为 `latexSuitePlugin.js`，核心实现位于 `latex-suite`：

- `controller.js`：Typora 事件和片段展开流程；
- `editor-adapter.js`：Typora/DOM 编辑接口适配；
- `matcher.js`：可独立测试的匹配与占位符解析；
- `session.js`：文档级临时状态；
- `snippets.js`：统一的片段定义。可自定义相关 snippet 配置。

## 引用与致谢

本项目 **Typora Latex Suite** 使用 [typora_plugin](https://github.com/obgnail/typora_plugin)
提供的 Typora 自定义插件框架。

snippet 的设计、语法及部分默认规则参考并改编自
[Obsidian Latex Suite](https://github.com/artisticat1/obsidian-latex-suite)。
