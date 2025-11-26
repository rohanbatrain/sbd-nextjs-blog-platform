# Contributing to sbd-nextjs-blog-platform

Thank you for contributing! This project uses strict CI/CD enforcement to maintain code quality.

## 🚀 Quick Start

1. **Clone and install**:
   ```bash
   git clone <repo-url>
   cd sbd-nextjs-cluster-dashboard
   npm install
   ```

2. **The `npm install` automatically sets up**:
   - Git hooks (Husky)
   - Pre-commit checks (ESLint, Prettier)
   - Commit message validation

## 📝 Branch Naming Convention

**Required Format**: `<type>/<name>`

### Allowed Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat/` | New features | `feat/user-dashboard` |
| `fix/` | Bug fixes | `fix/login-timeout` |
| `perf/` | Performance improvements | `perf/optimize-queries` |
| `refactor/` | Code refactoring | `refactor/api-client` |
| `docs/` | Documentation | `docs/update-readme` |
| `chore/` | Maintenance tasks | `chore/upgrade-deps` |
| `hotfix/` | Critical fixes | `hotfix/security-patch` |
| `release/` | Release preparation | `release/v1.2.0` |

**Examples**:
- ✅ `feat/cluster-monitoring`
- ✅ `fix/chart-rendering`
- ❌ `feature/new-thing` (wrong type)
- ❌ `random-branch` (no type)

## 💬 Commit Message Format

**Required Format**: `<type>: <message>` or `<type>(<scope>): <message>`

### Examples

- ✅ `feat: add cluster health monitoring`
- ✅ `fix(api): resolve timeout issue`
- ✅ `docs: update API documentation`
- ❌ `Added new feature` (no type prefix)
- ❌ `feat - new thing` (wrong separator)

**Auto-validated** by commit-msg hook!

## 🔨 Development Workflow

### 1. Create a feature branch

```bash
git checkout -b feat/my-awesome-feature
```

### 2. Make your changes

```bash
# Develop your feature
npm run dev
```

### 3. Run checks locally

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Lint with auto-fix
npm run lint:fix

# Build
npm run build
```

### 4. Commit (will auto-validate)

```bash
git add .
git commit -m "feat: add awesome feature"
```

**Pre-commit hooks automatically**:
- ✅ Run ESLint with auto-fix
- ✅ Run Prettier formatting
- ✅ Check for secrets (gitleaks)
- ✅ Validate file integrity

**Commit-msg hook validates**:
- ✅ Conventional commit format

### 5. Push (will run additional checks)

```bash
git push origin feat/my-awesome-feature
```

**Pre-push hook runs**:
- ✅ Branch name validation
- ✅ TypeScript type checking
- ✅ ESLint (no warnings allowed)

## 🔄 Pull Request Process

### 1. Create PR

**PR Title MUST follow the same format as commits**:

```
<type>: <message>
```

Examples:
- ✅ `feat: Add cluster health monitoring`
- ✅ `fix(ui): Resolve chart rendering bug`
- ❌ `New feature` (invalid)

### 2. Automated Checks

Your PR will trigger **GitHub Actions CI** that runs:

| Check | Description |
|-------|-------------|
| **Branch Validation** | Ensures branch name follows conventions |
| **PR Title Validation** | Ensures PR title follows conventions |
| **Lint** | Runs ESLint with zero warnings |
| **Type Check** | Runs TypeScript type checking |
| **Build** | Builds the Next.js application |
| **Tests** | Runs unit/integration tests (if present) |

**All checks must pass before merge!**

### 3. Auto-Labeling

PRs are automatically labeled based on branch type:
- `feat/*` → 🏷️ `feature`
- `fix/*` → 🏷️ `bug`
- `docs/*` → 🏷️ `documentation`
- etc.

### 4. Merge

Once approved and all checks pass:
- Merge to `main`
- **Release Please** automatically creates a release PR
- Release PR includes:
  - Version bump in `package.json`
  - Updated `CHANGELOG.md`
  - GitHub Release draft

## 🚫 Common Mistakes

### ❌ Direct push to `main`

```bash
git push origin main
```

**Error**: `remote: error: GH006: Protected branch update failed`

**Solution**: Create a PR instead!

### ❌ Invalid branch name

```bash
git checkout -b feature-branch
git push
```

**Error**: Pre-push hook rejects invalid branch names

**Solution**: Use proper format: `feat/feature-branch`

### ❌ Invalid commit message

```bash
git commit -m "did some stuff"
```

**Error**: Commit-msg hook rejects non-conventional commits

**Solution**: Use format: `feat: add feature description`

### ❌ Linting errors

```bash
git push
```

**Error**: Pre-push hook fails on linting errors

**Solution**: Run `npm run lint:fix` first

## 🛠️ Troubleshooting

### Hooks not working?

```bash
# Reinstall hooks
npm run prepare
```

### Want to skip hooks (⚠️ NOT RECOMMENDED)?

```bash
# Skip pre-commit
git commit --no-verify -m "message"

# Skip pre-push
git push --no-verify
```

**Warning**: CI checks will still run on GitHub and may fail!

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🙋 Questions?

Open an issue or contact the maintainers!
