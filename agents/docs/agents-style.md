# AGENTS Style Guide

## Purpose
Canonical format for all project AGENTS files.

## Writing Contract
| Rule | Requirement |
| --- | --- |
| Format | Use the clearest structure for scanability: lists for short enumerations, tables for comparisons/matrices, snippets for commands/examples. |
| Brevity | Keep prose short; avoid paragraph-heavy sections. |
| Specificity | Use exact paths, commands, and function signatures. |
| Duplication | Do not repeat rules already defined in another AGENTS file; reference the source doc. |
| Scope | Keep each AGENTS file local to its package/folder responsibility. |
| Deep detail | Move long workflows/policy detail to docs under [agents/docs](./). |
| .md references | Write `.md` file mentions as relative links with readable titles. |
| Link titles | Do not use backticks in markdown link titles. |
| File tree style | Use canonical tree block from [Architecture](architecture.md). |

## Structure Selection
- Use lists when linking small sets (for example package guides and references).
- Use tables when mapping fields (for example command-to-purpose or rule-to-requirement).

## Root AGENTS Template
| Section | Content |
| --- | --- |
| Goal | One sentence describing repo goal. |
| Package Guides | Links to package-level AGENTS files. |
| Repository Layout | Canonical tree block from [Architecture](architecture.md). |
| Common Commands | Root commands valid for all contributors. |
| Git Workflow | Single pointer to [Git Workflow](git-workflow.md). |
| Global Rules | Cross-repo conventions only. |
| Deep Docs | Links to docs in `agents/docs`. |

## Package AGENTS Template
| Section | Content |
| --- | --- |
| Scope | Exact source/tests/output paths for the package. |
| Entry Points | Public API files and key internals. |
| Commands | Package-local commands from package.json. |
| Guardrails | Package-specific rules only. |
| References | Links to root AGENTS and required deep docs. |

## Nested Folder AGENTS Template
| Section | Content |
| --- | --- |
| Scope | Files owned by that nested folder. |
| Commands | Only commands required for that nested scope. |
| Inputs/Outputs | Upstream sources and generated outputs. |
| References | Links to parent package guide and deep docs. |

## Anti-Patterns
| Avoid | Replace with |
| --- | --- |
| Repeated workflow prose | One canonical deep doc + links from AGENTS files. |
| Mixed ownership sections | Split by package/folder and cross-reference. |
