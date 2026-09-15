# Typora Latex-Suite 插件

> 本插件使用 AI Agent 工具 辅助编写。

## 安装说明

1. 先下载 [obgnail/typora_plugin: Typora plugin. Feature enhancement tool | Typora 插件，功能增强工具](https://github.com/obgnail/typora_plugin) 插件并按要求配置；

2. 在 Typora 的安装目录下 `./plugin/global/settings/custom_plugin.user.toml` 位置插入代码：

   ```toml
   [latexSuitePlugin]
   name = "Latex Suite"
   enable = true
   hide = false
   order = 1
   ```

3. 将 `latexSuitePlugin.js` 文件和 `latex-suite` 目录复制到 `./plugin/custom/plugins` 目录下。

## 开发

插件入口保持为 `latexSuitePlugin.js`，核心实现位于 `latex-suite`：

- `controller.js`：Typora 事件和片段展开流程；
- `editor-adapter.js`：Typora/DOM 编辑接口适配；
- `matcher.js`：可独立测试的匹配与占位符解析；
- `session.js`：文档级临时状态；
- `snippets.js`：片段定义。

运行 `npm test` 可以执行不依赖 Typora 的回归测试。当前实现以 typora_plugin 1.17.x 的接口为兼容基线。
