# 重构后的 Markdown 容器示例

这是普通文本，下面是不同类型的容器：

::: note
基础提示容器，无标题。
支持 Markdown 语法，如 *斜体* 和 **粗体**。
:::

::: warning 注意事项
这是带标题的警告容器！
- 禁止随意修改配置
- 操作前请备份数据
:::

::: tip 实用技巧
可以通过修改 \`registerContainer\` 函数扩展新容器类型，例如添加 \`success\` 类型。
:::

::: danger 危险操作
此操作会删除所有数据，**请谨慎执行**！
:::

::: info 版本说明
当前版本：v1.0.0  
更新时间：2023-01-01
:::

> [!note]
> This is note text

> [!important]
> This is important text

> [!tip]
> This is tip text

> [!warning]
> This is warning text

> [!caution]
> This is caution text

!!你好!!