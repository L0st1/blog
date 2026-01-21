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
      { value: 'feat', name: '1) feat:     ✨  新功能', emoji: ':sparkles:' },
      { value: 'fix', name: '2) fix:      🐛  Bug修复', emoji: ':bug:' },
      { value: 'docs', name: '3) docs:     📝  文档变更', emoji: ':memo:' },
      { value: 'style', name: '4) style:    💄  不影响逻辑的代码格式调整', emoji: ':lipstick:' },
      { value: 'refactor', name: '5) refactor: ♻️   重构（修改代码结构、变量名、函数名）', emoji: ':recycle:' },
      { value: 'perf', name: '6) perf:     ⚡️  性能优化', emoji: ':zap:' },
      { value: 'test', name: '7) test:     ✅  测试用例', emoji: ':white_check_mark:' },
      { value: 'build', name: '8) build:    📦️  修改项目构建系统（修改依赖库、外部接口或者升级 Node 版本）', emoji: ':package:' },
      { value: 'ci', name: '9) ci:       🎡  持续集成', emoji: ':ferris_wheel:' },
      { value: 'chore', name: '0) chore:    🔨  非业务性代码的修改（构建过程或辅助工具变更）', emoji: ':hammer:' },
      { value: 'revert', name: '/) revert:   ⏪️  回滚', emoji: ':rewind:' },
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
