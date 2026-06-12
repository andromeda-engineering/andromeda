# Contributing to Andromeda

Thanks for your interest! This repository is the public home for Andromeda's open
packages, and contributions are welcome.

## Ground rules

- **This repo must stay self-contained.** Nothing here may reference or depend on the
  private Andromeda packages (`@andromeda-eng/chronicle`, `connectors`, `foldspace`,
  `workbench`, or the `andromeda-internal` repo). CI enforces this via
  `pnpm check:no-private`.
- Every package/crate must **lint, typecheck, test, and build** before a PR is merged.

## Workflow

1. Fork and branch from `main`.
2. Make your change. Match the surrounding style (`@stylistic` for TS, `rustfmt` for Rust).
3. Run the full local gate:
   ```bash
   pnpm ci
   cargo fmt --all --check && cargo clippy --workspace --all-targets -- -D warnings && cargo test --workspace
   ```
4. Open a PR. CI runs the same `TypeScript` and `Rust` checks.

## Adding a package or crate

Mirror an existing one: same `package.json` / `tsconfig.json` shape (TS) or `Cargo.toml`
with `*.workspace = true` (Rust). Add new crates to the root `Cargo.toml` `members` list.
The pnpm workspace picks up new packages under `packages/*` and `apps/*` automatically.

## Conduct

By participating you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).
