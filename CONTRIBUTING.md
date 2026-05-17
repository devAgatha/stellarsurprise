# Contributing to StellarSurprise

## How to Contribute

1. Browse [open issues](https://github.com/yourorg/stellarsurprise/issues)
2. Fork the repo and create a branch from `main`
3. Make changes, write tests, open a PR

```bash
git clone https://github.com/YOUR-USERNAME/stellarsurprise.git
cd stellarsurprise
git checkout -b feat/your-feature
npm install && npm run dev
```

## Commit Convention
```
feat: add gift expiry support
fix: correct unlock timestamp validation
docs: update API reference
```

## Testing
```bash
npm test              # unit tests
npm run contract:test # Rust contract tests
```

## Code Style
- TypeScript strict mode
- ESLint + Prettier
- Rust: cargo fmt + cargo clippy
