import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  vue: true,
  typescript: true,
  ignores: ['**/*.md'],
})
  .overrideRules({
    // eslint
    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],

    // eslint-plugin-antfu
    'antfu/if-newline': 0,

    // eslint.vue
    'vue/block-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
    'vue/component-api-style': ['error', ['script-setup', 'composition']],

    // eslint.style
    'style/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
    'style/brace-style': 'error',
    'style/arrow-parens': ['error', 'always'],
    'style/quote-props': ['error', 'as-needed', { keywords: false }],
  })
