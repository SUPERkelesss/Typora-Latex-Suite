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

3. 将 `latexSuitePlugin.js` 文件复制到 `./plugin/custom/plugins` 目录下。
