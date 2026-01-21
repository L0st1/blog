import eslintConfig from '@antfu/eslint-config'

export default eslintConfig(
  {
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
    javascript: true,
    typescript: true,
    vue: true,
    ignores: [
      '.git',
      '.vscode',
      '.idea',
      '.husky',
      'node_modules',
      'dist',
    ],
  },
  {
    files: ['**/*.vue', '**/*.js', '**/*.ts'],
    rules: {
      // error
      'curly': ['error', 'all'],
      // warn
      'vue/no-parsing-error': 'warn',
      'unicorn/prefer-includes': 'warn',
      'no-console': 'warn',
      // off
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
)
