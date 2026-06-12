# Andromeda

Open-source primitives for the **Andromeda** agent stack — the public, MIT-licensed
foundation that the broader Andromeda suite is built on.

> **This is the public source-of-truth for Andromeda's open packages.** It builds and
> tests entirely on its own. Issues and pull requests are welcome here — this repo is a
> first-class home, not a read-only mirror. (The commercial/credentialed parts of the
> suite live in a separate private repository and consume these packages.)

## What's here

| Path | Package / crate | What it is |
| --- | --- | --- |
| `packages/core` | `@andromeda-eng/core` | Core primitives, types, and contracts |
| `packages/avml` | `@andromeda-eng/avml` | AVML format types + parser |
| `packages/graph` | `@andromeda-eng/graph` | Graph primitives |
| `packages/cli-kit` | `@andromeda-eng/cli-kit` | Building blocks for CLIs |
| `packages/config` | `@andromeda-eng/config` | Shared configuration helpers |
| `crates/andromeda-core` | `andromeda-core` | Rust core engine primitives |
| `crates/andromeda-graph` | `andromeda-graph` | Rust graph primitives |
| `apps/docs` | `@andromeda-eng/docs` | Documentation app |

## Develop

A dual **pnpm + turbo** (TypeScript) and **cargo** (Rust) workspace.

```bash
pnpm install
pnpm ci            # lint + no-private guard + typecheck + test + build

cargo fmt --all --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

Requirements: Node ≥ 22, pnpm 10, a stable Rust toolchain (`rustfmt` + `clippy`).

## Status

Pre-1.0 and **source-available**: packages are not yet published to npm / crates.io.
Build from source for now. License: [MIT](./LICENSE).
