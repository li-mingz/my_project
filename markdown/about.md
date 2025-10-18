# (未命名模组) 模组简介
本模组是**方块与深蓝之树(Caerula Arbor)**[^1] 的附属模组

> 改编自《明日方舟》相关游戏机制和剧情。

[^1]: [方块与深蓝之树(Caerula Arbor)模组百科链接](https://www.mcmod.cn/class/19586.html "方块与深蓝之树(Caerula Arbor)")

> [!important]
> 需要[方块与深蓝之树(Caerula Arbor)](https://www.mcmod.cn/class/19586.html "方块与深蓝之树(Caerula Arbor)")，[GeckoLib](https://www.mcmod.cn/class/3232.html "GeckoLib") 作为前置

::: warning 警告
模组处于!!棍木!!阶段。~~可能存在无法预期的错误或未来的改动，请在添加模组前备份你的存档。~~ 你很可能玩不到它。
:::

## 模组内容
### 4结局事件 (未完成)

清除存档内位于主世界的所有**可蔓延溟痕类方块**[^2]以及**相关刷怪方块**[^3]，
并将其所在区块标记为**富营养的区块**

[^2]: 懒得写
[^3]: 也是懒得写

#### 1.富营养的区块与食物

在<span style="color: green; font-weight: bold;">富营养的区块</span>内的所有**可食用的**方块掉落物将转化为<span style="color: green; font-weight: bold;">富营养的</span>对应食物，
<span style="color: green; font-weight: bold;">富营养的</span>食物会额外增加 饱和度和饱食度，
相关计算公式为`食物补充的基本饱和度或饱食度 * 富营养值` 即 $S \times E$，其中 $S$ 为食物补充的基本饱和度或饱食度，$E$ 为富营养值
<span style="color: green; font-weight: bold;">富营养的</span>食物的初始富营养值为`1.0f` !!我吃两份!!
富营养值可通过合成途径继承，包括但不限于熔炉，工作台，切石机(这个没测试过)，
富营养值继承的公式为`合成表中所有原料的富营养值相加 / 产物数量` 即 $\frac{\sum E}{n}$，其中 $\sum E$为原料总富营养值，$n$为产物数量。

使用以下指令手动触发该事件
```
/ending_by_4
```