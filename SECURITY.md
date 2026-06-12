# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue:

- Use GitHub's **private vulnerability reporting** (Security → Report a vulnerability), or
- Contact the maintainer directly.

Please include reproduction steps and the affected package/crate + version.

## Scope notes

- This repository contains only Andromeda's **public, open-source** packages. Commercial
  and credential-bearing code is not part of this repo; a CI guard (`pnpm check:no-private`)
  fails the build if any private/internal reference leaks in.
- Do not commit secrets. `.env*` files are gitignored; use `.env.example` for shape.

## Supported versions

Pre-1.0: only the latest `main` is supported.
