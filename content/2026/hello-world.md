---
title: Hello Nuxt Blog
date: 2026-01-01
tags: [nuxt, blog]
description: My first fully controlled Nuxt blog
---

# Hello World

This is a **fully TypeScript controlled** Nuxt 3 blog.

这里有一个术语提示示例：<Tooltip text="范畴论里的基本构造：给定 A、B，积 A×B 满足一个泛性质。" tone="info">积 (product)</Tooltip>。

两个范畴 $\mathbf{C}$ 与 $\mathbf{D}$ 的积范畴定义为 $\mathbf{C} \times \mathbf{D}$，其对象为有序对 $(C,D)$，其中 $C \in \mathrm{Ob}(\mathbf{C})$ 且 $D \in \mathrm{Ob}(\mathbf{D})$。
其态射定义为：$\mathrm{Hom}_{\mathbf{C}\times\mathbf{D}}\big((C,D),(C',D')\big)=\mathrm{Hom}_{\mathbf{C}}(C,C')\times\mathrm{Hom}_{\mathbf{D}}(D,D')$。

积范畴的复合运算逐分量定义：$(f,g)\circ(f',g')=(f\circ f',\, g\circ g')$。

---

在范畴 $\mathbf{C}$ 内，给定两个对象 $A,B\in\mathrm{Ob}(\mathbf{C})$，它们的积 (product) 定义为一个对象 $A\times B$，配备投影态射 $\pi_A:A\times B\to A$ 与 $\pi_B:A\times B\to B$，满足如下泛性质：
对任意对象 $X$ 及态射 $f:X\to A,\, g:X\to B$，存在唯一态射 $\langle f,g\rangle:X\to A\times B$ 使得 $\pi_A\circ\langle f,g\rangle=f$ 且 $\pi_B\circ\langle f,g\rangle=g$。

---

相对地，余积 (coproduct) 定义为对象 $A\sqcup B$，配备单射 $i_A:A\to A\sqcup B,\, i_B:B\to A\sqcup B$，满足如下泛性质：
对任意对象 $Y$ 及态射 $f:A\to Y,\, g:B\to Y$，存在唯一态射 $[f,g]:A\sqcup B\to Y$ 使得 $[f,g]\circ i_A=f$ 且 $[f,g]\circ i_B=g$。

---

最后，对于两个态射 $m:A\to B$ 与 $m':C\to D$，在积范畴 $\mathbf{C}\times\mathbf{D}$ 中，它们组成的态射为 $(m,m'):(A,C)\to(B,D)$。
排序规则是逐分量的，即先看 $\mathbf{C}$ 分量 $m$，再看 $\mathbf{D}$ 分量 $m'$。
