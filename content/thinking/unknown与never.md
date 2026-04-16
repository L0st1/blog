---
title: unknown与never的区别
path: thinking/typescript-unknown-and-never
date: 2026-04-16
tags: [TypeScript]
description: 既生never，何生unknown
---

# TS 中的 `unknown` 与 `never`

### 从 `IsNever` 认识 `never`

`IsNever` 用于判断一个类型是否为 `never`，不妨思索一下如何判断一个类型是 `never`，下方是正确写法

::Spoiler{:reveal-after-ms="1000" hint="悬停 1 秒以查看"}
  ```ts
  type IsNever<T> = [T] extends [never] ? true : false
  ```
::

为什么不是这个呢
::Spoiler{:reveal-after-ms="1000" hint="悬停 1 秒以查看"}
```ts
type IsNever<T> = T extends never ? true : false
```
::

因为 `never` 在 `extends` 时被当作空的联合类型分发，所以三元运算符一定输出 `false`

正确的写法中，包裹一层以后作为一个整体看待，不会被分发

所以可以将 `never` 看作一个恒为空的联合类型（但实际上 `never` 是类似于 `number`、`string` 一样的一个类型）

或者这样表述更为合理——[never](https://github.com/microsoft/TypeScript/issues/23182#issuecomment-379094672)

### unknown

`unknown` 是晚于 `never` 诞生的，它和 `never` 很像，但有本质区别

在 `TS` 的类型系统中，除去复杂类型，有以下基础类型

- `string`
- `number`
- `boolean`
- `symbol`
- `bigint`
- `null`
- `undefined`

并有以下特殊类型

- `never`
- `unknown`
- `any`
- `void`

其中，存在 `never extends T` 恒为 `true`，`T extends unknown` 恒为 `true`

这很难让人不联想到范畴论中的<Tooltip text="从它出发到任何对象都有唯一箭头" tone="info">初始对象</Tooltip>与<Tooltip text="从任何对象到它都有唯一箭头" tone="info">终端对象</Tooltip>

所以 `never` 象征着底层，而 `unknown` 象征着顶层

### any

说到了 `unknown`，不得不提及 `any`

如果把 `TS` 的类型系统看作一个范畴，`any` 既不是终端对象，也不是初始对象，更像是打破范畴的特殊单元。`any` 可以主动绕过 `TS` 的校验，让原有的类型系统变得不可预测；但为了保持灵活、降低上手难度，`any` 又不得不存在
