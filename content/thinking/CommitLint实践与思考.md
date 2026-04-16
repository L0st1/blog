---
title: CommitLint实践与思考
date: 2025-05-22
tags: [git]
description: 完备的Git CommitLint实践以及为什么这么做
---

# CommitLint

## 提交规范工程化实践

```sh
pnpm add -D simple-git-hooks lint-staged @commitlint/cli @commitlint/config-conventional cz-git
```

#### 为什么使用`@commitlint/cli` `@commitlint/config-conventional`

`@commitlint/cli` 用于提交信息校验

`@commitlint/config-conventional`用于使用`Conventional Commits`即 [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 作为默认校验规则集

#### 与`commitlint`的不同

`commitlint`是旧的使用方式，官方推荐以这种按需引用的方式安装
`commitlint`提供了用于提示的插件，但功能上`cz-git`更全面

#### 为什么使用`simple-git-hooks`

提供轻量的`git hooks`
相较`husky`，`simple-git-hooks`无需配置开箱即用

#### 为什么使用`lint-staged`

在预提交时触发 `eslint --fix`

#### 为什么使用`cz-git`

[cz-git | 一款工程性更强，轻量级，高度自定义，标准输出格式的 Commitizen 适配器](https://cz-git.qbb.sh/zh/)

提供友好的命令行`git`提交体验，也可以集成 AI 来生成 commit

## 具体配置

package.json
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite --port 3333 --open",
    "lint": "eslint .",
    "postinstall": "npx simple-git-hooks",
    "commit": "cz-git"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged",
    "commit-msg": "pnpm commitlint --edit"
  },
  "lint-staged": {
    "*": "eslint --fix"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

commitlint.config.mjs
```js
import { defineConfig } from 'cz-git'

export default defineConfig({
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'build', 'ci', 'revert']], // type 类型必须在以下类型范围内
    'type-case': [2, 'always', 'lower-case'], // type 必须使用小写
    'type-empty': [2, 'never'], // type 不能为空

    // 'scope-enum': [2, 'always', ['login', 'user', 'api']], // scope 范围必须在以下范围范围内
    'scope-case': [2, 'always', 'lower-case'], // scope 必须使用小写
    'scope-empty': [0], // scope 可以为空

    'subject-empty': [2, 'never'], // 描述内容不能为空
    'subject-full-stop': [2, 'never', ['.', '，', '。', ',', ';', '；']], // 描述内容禁止以标点符号结尾

    'header-max-length': [2, 'always', 100], // 头部最大长度
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围 :',
      subject: '填写简短精炼的变更描述 :\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixesSelect: '选择关联issue前缀（可选）:',
      customFooterPrefix: '输入自定义issue前缀 :',
      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
      confirmCommit: '是否提交或修改commit ?',
    },
    types: [
      { value: 'feat', name: '1) feat:    ✨ 新功能', emoji: ':sparkles:' },
      { value: 'fix', name: '2) fix:     🐛 Bug修复', emoji: ':bug:' },
      { value: 'docs', name: '3) docs:    📝 文档变更', emoji: ':memo:' },
      { value: 'style', name: '4) style:   💄 不影响逻辑的代码格式调整', emoji: ':lipstick:' },
      { value: 'refactor', name: '5) refactor: ♻️ 重构（修改代码结构、变量名、函数名）', emoji: ':recycle:' },
      { value: 'perf', name: '6) perf:    ⚡️ 性能优化', emoji: ':zap:' },
      { value: 'test', name: '7) test:    ✅ 测试用例', emoji: ':white_check_mark:' },
      { value: 'build', name: '8) build:   📦️ 修改项目构建系统（修改依赖库、外部接口或者升级 Node 版本）', emoji: ':package:' },
      { value: 'ci', name: '9) ci:      🎡 持续集成', emoji: ':ferris_wheel:' },
      { value: 'chore', name: '0) chore:   🔨 非业务性代码的修改（构建过程或辅助工具变更）', emoji: ':hammer:' },
      { value: 'revert', name: '/) revert:  ⏪️ 回滚', emoji: ':rewind:' },
    ],
    useEmoji: true,
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,
    themeColorCode: '',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'top',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: ['body', 'footer', 'footerPrefix', 'breaking'],
    issuePrefixes: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
  },
})
```

运行 `pnpm postinstall` 后，使用 `pnpm cz` 即可触发提交交互
