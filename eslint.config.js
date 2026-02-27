import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  vue: true,
  typescript: true,
  ignores: ['**/*.md', 'packages/docs/public/example-data/*'],
})
  .overrideRules({
    // eslint
    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],

    // eslint-plugin-antfu
    'antfu/if-newline': 0,
    'antfu/consistent-list-newline': 0,
    'perfectionist/sort-imports': [
      'error',
      {
        newlinesBetween: 1,
        type: 'alphabetical',
        groups: [
          'vitest',
          'type',
          [
            'parent-type',
            'sibling-type',
            'index-type',
            'internal-type',
          ],
          'builtin',
          'external',
          'internal',
          [
            'parent',
            'sibling',
            'index',
          ],
          'side-effect',
          'object',
          'unknown',
        ],
        customGroups: [
          {
            groupName: 'vitest',
            selector: 'external',
            elementNamePattern: '^vitest$',
          },
        ],
      },
    ],

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
  .append({
    name: 'd3-maps/adapter-boundaries',
    files: [
      'packages/vue/src/**/*.{ts,vue}',
      'packages/vue/tests/**/*.{ts,vue}',
      'packages/react/src/**/*.{ts,tsx}',
      'packages/react/tests/**/*.{ts,tsx}',
    ],
    rules: {
      'eslint-comments/require-description': 'error',
      'no-restricted-imports': ['error', {
        paths: [
          {
            name: 'd3',
            message: 'Adapters must not import D3 directly. Add helpers to `@d3-maps/core` and import from `@d3-maps/core`.',
          },
        ],
        patterns: [
          {
            group: ['d3-*'],
            message: 'Adapters must not import `d3-*` directly. Add helpers to `@d3-maps/core` and import from `@d3-maps/core`.',
          },
          {
            group: ['topojson-*'],
            message: 'Adapters must not import `topojson-*` directly. Add helpers to `@d3-maps/core` and import from `@d3-maps/core`.',
          },
          {
            group: [
              '@d3-maps/core/**',
              '!@d3-maps/core/index.css',
            ],
            message: 'Adapters must only import the core public entrypoint (`@d3-maps/core`) and `@d3-maps/core/index.css`.',
          },
        ],
      }],
    },
  })
