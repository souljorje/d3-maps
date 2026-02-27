# docs

## Scope
| Area | Path |
| --- | --- |
| Main pages | [Docs Home](index.md), [Guide](guide/index.md), [Components](components/index.md), [Examples](examples/index.md), [API](api/index.md) |
| VitePress config | packages/docs/.vitepress/config.js |
| Theme runtime | packages/docs/.vitepress/theme/index.js |
| Demo sources | packages/docs/.vitepress/examples |
| Public assets | packages/docs/public |

## Commands
| Command | Purpose |
| --- | --- |
| `pnpm --filter docs dev` | Run VitePress locally. |
| `pnpm docs:build` | Build docs site (includes docs generation). |
| `pnpm --filter docs preview` | Preview built docs site. |
| `pnpm docs:gen` | Regenerate examples wrappers and API docs. |

## Routing
- [API Guide](api/AGENTS.md)
- [Examples Guide](examples/AGENTS.md)

## Guardrails
| Rule | Requirement |
| --- | --- |
| Navigation | Keep nav/sidebar changes in packages/docs/.vitepress/config.js. |
| Theme registration | Register global demo components in packages/docs/.vitepress/theme/index.js. |
| Generated content | Do not hand-edit generated files in packages/docs/examples and generated API markdown in packages/docs/api/core. |
| Parts usage | Extract duplicated content to parts with `_` prefix and reuse across files, `_*.md` are ignored by vitepress |
| Core concepts | /guide/core-concepts must be composed with parts. |
| Progressive snippets | In progressive guides (for example `guide/core-concepts`), each snippet must build on the previous snippet and only add/change lines for the current concept. |
| Snippet highlighting | Use VitePress line highlighting to mark newly added or changed lines in progressive snippets. |
| Progressive diff integrity | In progressive guides, each snippet MUST preserve the previous snippet verbatim except the concept-specific delta for the current section. |
| No hidden edits | Do not reorder, delete, or rewrite unchanged lines in the next step unless that edit belongs to the current concept and is explicitly highlighted. |
| Highlight completeness | VitePress highlight ranges MUST cover all changed lines for the current step in snippets for all supported adapters. |
| Adapter parity | Progressive snippets for supported adapters MUST represent the same conceptual delta at each step. |
| Tone | Use a friendly, concise, instructional developer-doc tone. |
| Sentence style | Prefer short declarative sentences with light imperative phrasing and minimal context. |
| Approachability | Keep writing approachable but not chatty. |
| Paragraph size | Prefer 1-2 sentences per paragraph and one idea per paragraph. |
| Voice | Use active voice when possible. |
| Section orientation | Start sections with a short purpose line when it helps orientation. |
| Inline code | Use backticks for API names, props, events, and code identifiers. |
| Link strategy | Prefer internal links and use external links only when no internal reference exists. |
| Duplication | Avoid repeating content across pages and link instead. |
| Headings | Keep headings short and free of trailing punctuation. |
| Snippet scope | Keep snippets minimal, concept-focused, and free of unrelated boilerplate. |
| Code groups | Use `code-group` only when showing multiple variants. |
| Snippet consistency | Keep related snippets consistent in naming, data shapes, and structure. |
| Vue examples | Prefer `<script setup lang="ts">` and Composition API unless the surrounding page already uses a different pattern. |
| Migration guide sync | When `@d3-maps/react` APIs or behavior change, update [react-simple-maps migration guide](guide/migration-from-react-simple-maps.md). |

## Skills
| Skill | When to use |
|-------|-------------|
| [vitepress](../../.agents/skills/vitepress/SKILL.md) | Changing VitePress config, theme behavior, markdown features, or docs site navigation/content structure. |

## References
- [Root Guide](../../AGENTS.md)
- [Architecture](../../.agents/references/architecture.md)
- [Docs Generation Workflow](../../.agents/references/docs-generation.md)
- [Code Style](../../.agents/references/code-style.md)
