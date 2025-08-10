# Local Development Guide

## 🚀 Quick Start

### Prerequisites

- **Node.js 22+**
- **Bun** package manager
- **PostgreSQL** database

### Initial Setup

```bash
# Install dependencies
bun install

# Copy environment template
cp .env.example .env.local

# Start development server
bun dev
```

### Development Server URLs

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **GraphQL Playground**: http://localhost:3000/api/graphql-playground
- **API Documentation**: http://localhost:3000/api

## 🔧 Essential Commands

### Development

```bash
# Start development server
bun dev

# Start on different port
bun dev -- -p 3001

# Build for production (test)
bun run build

# Check environment
bun run env:check
```

### Code Quality

```bash
# Type checking
bun run generate:types

# Linting
bun run lint
bun run lint:fix

# Format code
bun run format
```

### PayloadCMS

```bash
# Generate types
bun run generate:types

# Generate admin import map
bun run generate:importmap

# Database migrations
bun payload migrate

# Seed sample data
curl http://localhost:3000/next/seed
```

## 🛠️ Development Environment

### Environment Status Check

```bash
bun run env:check

# Expected output:
# Environment: development
# Vercel Env: local
# Database: Connected
# Sentry: Configured
```

### Local Environment Variables (.env.local)

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/athena_dev"

# Payload CMS
PAYLOAD_SECRET="your-32-character-local-secret"
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Sentry (optional for local dev)
SENTRY_DSN="your-sentry-dsn"

# Optional: Enable debug mode
DEBUG="payload:*"
```

## 🎯 Development Features

### Built-in Features

- ✅ **Hot Reload**: Automatic refresh on file changes
- ✅ **TypeScript**: Full type checking and IntelliSense
- ✅ **ESLint**: Code quality checks with auto-fix
- ✅ **Prettier**: Code formatting
- ✅ **Sentry Integration**: Error tracking (optional in dev)
- ✅ **Environment Indicator**: Visual environment badge
- ✅ **PayloadCMS Admin**: Content management interface

### Environment Indicator

Look for the colored badge in the top-right corner:

- **🟢 Green**: Development environment
- **🟡 Yellow**: Preview environment
- **🔴 Red**: Production environment

## 📁 Project Structure

### Key Directories

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Public-facing pages
│   ├── (payload)/         # Admin & API routes
│   └── globals.css        # Global styles
├── blocks/                # Reusable content blocks
├── collections/           # PayloadCMS collections
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── fields/               # PayloadCMS field configurations
├── providers/            # React context providers
├── utilities/            # Helper functions
│   ├── env.ts           # Environment utilities
│   └── ...              # Other utilities
├── payload-types.ts      # Generated types
└── server.ts            # PayloadCMS server
```

### Configuration Files

```
.env.local               # Local environment variables
.env.example            # Environment template
next.config.js          # Next.js configuration
payload.config.ts       # PayloadCMS configuration
tailwind.config.ts      # Tailwind CSS configuration
tsconfig.json          # TypeScript configuration
.eslintrc.js          # ESLint configuration
```

## 🧪 Testing & Debugging

### Sentry Testing

Visit these endpoints to test error tracking:

1. **http://localhost:3000/sentry-test**
   - **Client Error**: Test frontend error capturing
   - **Performance**: Test span/performance tracking
   - **Logging**: Test structured logging
   - **API Error**: Test backend error capturing

### PayloadCMS Admin

```bash
# Access admin panel
# http://localhost:3000/admin

# Default admin user (after seeding):
# Email: demo@payloadcms.com
# Password: demo
```

### Database Access

```bash
# Check migration status
bun payload migrate:status

# Create new migration
bun payload migrate:create

# Reset database (development only!)
bun payload migrate:reset
```

### GraphQL Playground

- **URL**: http://localhost:3000/api/graphql-playground
- **Endpoint**: http://localhost:3000/api/graphql

Example queries:

```graphql
# Get all posts
query {
  Posts {
    docs {
      id
      title
      slug
      publishedAt
    }
  }
}

# Get pages
query {
  Pages {
    docs {
      id
      title
      slug
    }
  }
}
```

## 🎨 Styling & UI Development

### Technologies

- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components
- **shadcn/ui**: Pre-built component library
- **Geist Font**: Modern typography
- **Lucide React**: Icon library

### Component Development

```bash
# Create new UI component
npx shadcn-ui@latest add button

# Component locations:
src/components/ui/        # Base UI components (shadcn)
src/components/          # Feature components
src/blocks/             # PayloadCMS content blocks
```

### Styling Guidelines

```css
/* Use Tailwind utilities */
className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"

/* Custom CSS in globals.css for complex styles */
.custom-component {
  @apply bg-gray-100 dark:bg-gray-800;
}
```

## 🔄 Hot Reload & File Watching

### Automatic Reload Triggers

- **React Components**: Instant hot reload
- **CSS/Tailwind**: Instant style updates
- **API Routes**: Server restart
- **PayloadCMS Config**: Server restart required

### Manual Restart Required

```bash
# Restart when changing:
# 1. PayloadCMS configuration (payload.config.ts)
# 2. Environment variables (.env.local)
# 3. Next.js configuration (next.config.js)
# 4. Package dependencies (package.json)

# Restart commands:
# Stop: Ctrl+C
# Start: bun dev
```

## 🐛 Common Development Issues

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
bun dev -- -p 3001
```

### TypeScript Errors

```bash
# Regenerate PayloadCMS types
bun run generate:types

# Clear Next.js cache
rm -rf .next
bun dev

# Check TypeScript explicitly
npx tsc --noEmit
```

### Database Connection Issues

```bash
# Check environment variables
cat .env.local | grep DATABASE_URL

# Test database connection
bun payload migrate:status

# Reset database (DEVELOPMENT ONLY!)
bun payload migrate:reset
```

### PayloadCMS Admin Issues

```bash
# Regenerate admin import map
bun run generate:importmap

# Clear all caches
rm -rf .next node_modules/.cache
bun install
bun dev
```

### Build Failures

```bash
# Test production build locally
bun run build

# Check for missing dependencies
bun install

# Check for TypeScript errors
bun run generate:types
npx tsc --noEmit
```

### Styling Issues

```bash
# Regenerate Tailwind CSS
rm -rf .next
bun dev

# Check Tailwind configuration
npx tailwindcss --version
```

## ⚡ Performance Tips

### Development Optimization

1. **Enable TypeScript strict mode**: Better error catching
2. **Use React DevTools**: Component profiling
3. **Monitor bundle size**: Use Next.js analyzer
4. **Optimize images**: Use Next.js Image component
5. **Lazy load components**: Use dynamic imports

### Fast Refresh Best Practices

- Keep components pure for better hot reload
- Avoid side effects in component bodies
- Use proper dependency arrays in useEffect
- Export components as default when possible

## 📝 Development Best Practices

### Code Organization

```bash
# File naming conventions
components/MyComponent.tsx       # PascalCase for components
utilities/myUtility.ts          # camelCase for utilities
types/myTypes.ts               # camelCase for types
constants/MY_CONSTANT.ts       # UPPER_CASE for constants
```

### Git Workflow for Development

```bash
# Work on development branch
git checkout development
git pull origin development

# Create feature branch for large features
git checkout -b feature/my-feature

# Regular commits with conventional format
git commit -m "feat: add new component"
git commit -m "fix: resolve rendering issue"
git commit -m "docs: update component documentation"

# Push frequently
git push origin development
```

### Environment Management

- ✅ Never commit `.env.local` files
- ✅ Use `.env.example` as template
- ✅ Test with `bun run env:check`
- ✅ Document new environment variables in `.env.example`

## 🆘 Getting Help

### Debugging Resources

1. **Browser DevTools**: Console, Network, React DevTools
2. **Next.js Docs**: https://nextjs.org/docs
3. **PayloadCMS Docs**: https://payloadcms.com/docs
4. **Tailwind CSS Docs**: https://tailwindcss.com/docs
5. **Sentry Docs**: https://docs.sentry.io

### Local Development Support

- Check terminal output for detailed error messages
- Use browser console for frontend debugging
- Monitor Sentry dashboard for error tracking
- Review ESLint/TypeScript output for code quality

### Useful Development Extensions (VS Code)

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Error Lens**
- **Prettier - Code formatter**
- **ESLint**

---

Happy coding! 🎉 For deployment and workflow information, see [DEPLOYMENT.md](./DEPLOYMENT.md).
