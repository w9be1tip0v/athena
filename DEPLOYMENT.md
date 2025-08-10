# Deployment & Workflow Guide

This project follows a **Development → Preview → Production** workflow using Vercel and GitHub.

## 🎯 Branch Strategy & Workflow

### Branch Structure

```
main (production) ← preview (staging) ← development (dev)
     🚀                   🔄                  🔧
```

| Branch        | Purpose                  | Deployment                | Direct Push       |
| ------------- | ------------------------ | ------------------------- | ----------------- |
| `development` | 🔧 Development & Testing | ❌ None                   | ✅ Allowed        |
| `preview`     | 🔄 Staging & Review      | ✅ Preview Environment    | ⚠️ Limited        |
| `main`        | 🚀 Production            | ✅ Production Environment | ❌ **Restricted** |

### Environment Details

#### 1. Development Environment

- **Branch**: `development` / feature branches
- **URL**: `http://localhost:3000`
- **Environment**: `development`
- **Sentry Environment**: `development`
- **Database**: Local/Development database

#### 2. Preview Environment

- **Branch**: `preview`
- **URL**: `https://athena-git-preview-[team].vercel.app`
- **Environment**: `preview`
- **Sentry Environment**: `staging`
- **Database**: Production database (read-only recommended)

#### 3. Production Environment

- **Branch**: `main`
- **URL**: `https://athena-[team].vercel.app`
- **Environment**: `production`
- **Sentry Environment**: `production`
- **Database**: Production database

## 📋 Recommended Development Flow

### 1. Development Phase

```bash
# Start new feature/fix
git checkout development
git pull origin development

# Create feature branch (optional)
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: implement new feature"
git push origin development
```

**Result**:

- ✅ GitHub Actions runs tests & linting
- ❌ No deployment (fast feedback)

### 2. Staging Phase

```bash
# Create PR: development → preview
gh pr create --base preview --head development --title "feat: new feature for review"

# Or manually:
git checkout preview
git merge development
git push origin preview
```

**Result**:

- ✅ Code review process
- ✅ Deploy to Preview environment
- ✅ Staging environment testing

### 3. Production Phase

```bash
# After preview testing, create PR: preview → main
gh pr create --base main --head preview --title "release: deploy to production"

# Or manually:
git checkout main
git merge preview
git push origin main
```

**Result**:

- ✅ Final review & approval
- ✅ Deploy to Production environment
- ✅ Controlled production release

## 🚀 Quick Deployment Commands

### Essential Commands

```bash
# Deploy to preview
pnpm run deploy:preview

# Deploy to production
pnpm run deploy:production

# Check current environment
pnpm run env:check
```

### GitHub CLI Shortcuts

```bash
# Development to Preview
gh pr create --base preview --head development

# Preview to Production
gh pr create --base main --head preview
```

## 🔒 Branch Protection Setup

### Recommended GitHub Settings

#### Main Branch Protection

```
Repository Settings → Branches → Add protection rule

Branch pattern: main
☑️ Restrict pushes that create files
☑️ Require a pull request before merging
  ☑️ Require approvals (1+)
  ☑️ Dismiss stale PR approvals when new commits are pushed
  ☑️ Require review from code owners
☑️ Require status checks to pass before merging
  ☑️ Require branches to be up to date before merging
  ☑️ GitHub Actions workflows
☑️ Require conversation resolution before merging
☑️ Include administrators
```

#### Preview Branch Protection (Optional)

```
Branch pattern: preview
☑️ Require a pull request before merging
☑️ Require status checks to pass before merging
```

## 🤖 Automated Deployments

### GitHub Actions Workflows

The project includes comprehensive GitHub Actions workflows:

#### 1. Branch-based Deployment (`.github/workflows/deployment.yml`)

- **Development**: Tests & linting only
- **Preview**: Deploy to Vercel preview environment
- **Production**: Deploy to Vercel production environment
- **Pull Requests**: Validation & automated comments

#### 2. Workflow Validation

- ✅ **Development**: Code validation completed
- ✅ **Preview PR**: Flow verification + staging deployment
- ✅ **Production PR**: Enhanced validation + production deployment
- ⚠️ **Direct main push**: Warning + guidance

### Required GitHub Secrets

Set these secrets in your GitHub repository:

- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `VERCEL_PREVIEW_DEPLOY_HOOK`: Preview deploy hook (optional)
- `VERCEL_PRODUCTION_DEPLOY_HOOK`: Production deploy hook (optional)

## 🔧 Environment Variables

### Vercel Environment Variables

Configure these in the Vercel dashboard for each environment:

#### Preview Environment

- `DATABASE_URL`: Production database URL (read-only user recommended)
- `PAYLOAD_SECRET`: Staging secret
- `BLOB_READ_WRITE_TOKEN`: Staging blob token
- `NEXT_PUBLIC_VERCEL_ENV`: `preview`
- `SENTRY_DSN`: Sentry project DSN
- `NODE_ENV`: `production`

#### Production Environment

- `DATABASE_URL`: Production database URL
- `PAYLOAD_SECRET`: Production secret
- `BLOB_READ_WRITE_TOKEN`: Production blob token
- `NEXT_PUBLIC_VERCEL_ENV`: `production`
- `SENTRY_DSN`: Sentry project DSN
- `NODE_ENV`: `production`

### Local Environment (.env.local)

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zeus_dev"

# Payload CMS
PAYLOAD_SECRET="your-local-secret"
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Sentry
SENTRY_DSN="your-sentry-dsn"
```

## ⚠️ Emergency Procedures

### Hotfix for Production

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Make minimal fix
# ... fix the critical issue ...

# 3. Push and create emergency PR
git push origin hotfix/critical-fix
gh pr create --base main --head hotfix/critical-fix --title "hotfix: critical production fix"

# 4. After merge, sync back to preview and development
git checkout preview
git pull origin main
git push origin preview

git checkout development
git pull origin preview
git push origin development
```

## ✅ Best Practices

### 1. Branch Protection

- Protect `main` branch with required PR reviews
- Require status checks to pass before merging
- Require branches to be up to date before merging

### 2. Testing Strategy

- Test thoroughly in development
- Deploy to preview for stakeholder review
- Only merge to production after preview approval

### 3. Database Migrations

- Test migrations in development first
- Run migrations in preview environment
- Schedule production migrations during low-traffic periods

### 4. Rollback Strategy

- Keep previous deployments available in Vercel
- Use Git tags for important releases
- Have a rollback plan for database migrations

### 5. Monitoring

- Monitor Sentry for errors in each environment
- Use Vercel Analytics for performance metrics
- Set up alerts for critical issues

## 🆘 Troubleshooting

### Common Issues

#### "Direct push to main" Warning

```
⚠️ WARNING: Direct push to main branch detected!

Solution:
1. Set up branch protection rules
2. Use PR workflow: preview → main
```

#### Failed Status Checks

```
❌ Status checks failing

Solution:
1. Check GitHub Actions logs
2. Fix issues in development branch
3. Create new PR after fixes
```

#### Build Failures

```bash
# Check build locally
pnpm build

# Check for linting issues
pnpm lint

# Regenerate types
pnpm generate:types
```

#### Environment Variable Issues

```bash
# Check environment configuration
pnpm run env:check

# Verify Vercel environment variables
vercel env ls
```

#### Database Connection Issues

- Verify database URLs in each environment
- Check database user permissions
- Ensure network access from Vercel

#### Deployment Not Triggered

```
❌ Deployment not triggered

Check:
1. Vercel Git integration settings
2. Deploy hooks configuration
3. Environment variables setup
4. Branch protection rules
```

## 📊 Workflow Validation

### Automated Checks

- ✅ **Development**: Tests & linting only
- ✅ **Preview PR**: Code validation + flow verification
- ✅ **Production PR**: Enhanced validation + deployment approval
- ⚠️ **Direct main push**: Warning + guidance

### Manual Reviews

- 📋 **Code Review**: Required for preview → main
- 🧪 **Staging Test**: Manual testing in preview environment
- ✅ **Production Approval**: Final sign-off before production

## 📞 Support

For deployment issues:

1. Check GitHub Actions logs
2. Review Vercel deployment logs
3. Monitor Sentry for runtime errors
4. Contact the development team
