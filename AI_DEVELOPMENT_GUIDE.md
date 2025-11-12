# AI-Friendly Project Documentation

This file provides quick reference information for AI assistants working with the Suspensive codebase.

## Project Identity

**Name**: Suspensive  
**Type**: React library for Suspense utilities  
**License**: MIT  
**Maintainer**: Toss (Viva Republica, Inc.)

## What is Suspensive?

Suspensive is a collection of utilities that make React Suspense easier to use. It solves common pain points:

1. **SSR Issues**: Provides `clientOnly` prop for Suspense to avoid SSR errors
2. **Complex Error Boundaries**: Simplifies error boundary fallback interfaces
3. **TanStack Query Integration**: Provides Suspense-ready hooks for react-query

## Quick Package Reference

| Package                    | Purpose                 | Key Exports                                                    |
| -------------------------- | ----------------------- | -------------------------------------------------------------- |
| `@suspensive/react`        | Core Suspense utilities | `<Suspense/>`, `<ErrorBoundary/>`, `<Delay/>`, `<ClientOnly/>` |
| `@suspensive/react-query`  | React Query integration | `useSuspenseQuery()`, `<SuspenseQuery/>`                       |
| `@suspensive/react-dom`    | DOM utilities           | `<InView/>`, `<FadeIn/>`                                       |
| `@suspensive/react-native` | React Native utilities  | Testing helpers                                                |
| `@suspensive/next`         | Next.js integration     | Next.js helpers                                                |
| `@suspensive/jotai`        | Jotai integration       | Jotai + Suspense utilities                                     |
| `@suspensive/codemods`     | Code migrations         | CLI for automated refactoring                                  |

## Directory Structure

```
suspensive/
├── packages/              # Main library packages
│   ├── react/            # Core package
│   ├── react-query/      # TanStack Query integration
│   ├── react-query-4/    # v4 support (internal)
│   ├── react-query-5/    # v5 support (internal)
│   ├── react-dom/        # DOM utilities
│   ├── react-native/     # React Native utilities
│   ├── next/             # Next.js utilities
│   ├── jotai/            # Jotai integration
│   └── codemods/         # Code transformation tools
├── docs/
│   └── suspensive.org/   # Documentation website (Next.js + Nextra)
├── examples/             # Example applications
├── configs/              # Shared configurations
└── .github/              # GitHub workflows and templates
```

## Core APIs

### @suspensive/react

```typescript
// Enhanced Suspense with SSR support
<Suspense fallback={<Loading />} clientOnly>
  <AsyncComponent />
</Suspense>

// Simplified Error Boundary
<ErrorBoundary fallback={({ error, reset }) => <Error />}>
  <Component />
</ErrorBoundary>

// Group error boundaries
<ErrorBoundaryGroup>
  <ErrorBoundary fallback={<Error />}>...</ErrorBoundary>
  <ErrorBoundary fallback={<Error />}>...</ErrorBoundary>
</ErrorBoundaryGroup>

// Delay showing content
<Delay ms={200}>
  <SlowComponent />
</Delay>

// Client-only rendering
<ClientOnly fallback={<SSRFallback />}>
  <BrowserOnlyComponent />
</ClientOnly>
```

### @suspensive/react-query

```typescript
// Suspense-enabled query hook
const { data } = useSuspenseQuery({
  queryKey: ['key'],
  queryFn: fetchData,
})
// data is always defined (no undefined checks needed)

// Suspense-enabled infinite query
const { data, fetchNextPage } = useSuspenseInfiniteQuery({
  queryKey: ['key'],
  queryFn: fetchPage,
})
```

### @suspensive/react-dom

```typescript
// Intersection Observer wrapper
<InView onChange={(inView) => console.log(inView)}>
  <Component />
</InView>

// Fade in animation
<FadeIn>
  <Component />
</FadeIn>
```

## Development Workflow

### Initial Setup

```bash
# 1. Enable pnpm via corepack
corepack enable && corepack prepare

# 2. Install dependencies
pnpm install

# 3. Build all packages (required before running examples/tests)
pnpm run build
```

### Development Loop

```bash
# Watch mode for development
pnpm run dev

# Run specific package tests
cd packages/react
pnpm run ci:test

# Run all CI checks
pnpm run ci:all
```

### Making Changes

```bash
# 1. Make your changes
# 2. Build if needed
pnpm run build

# 3. Run tests
pnpm run ci:test

# 4. Check types
pnpm run ci:type

# 5. Lint
pnpm run ci:eslint

# 6. Format
pnpm run format
```

## Testing Philosophy

1. **Co-located tests**: Tests live next to source files
2. **Type tests**: Use `.test-d.tsx` for TypeScript type testing
3. **Runtime tests**: Use `.spec.tsx` for behavior testing
4. **SSR testing**: Ensure components work in SSR environments
5. **Edge cases**: Test error states, loading states, and edge cases

## TypeScript Guidelines

- **Strict mode**: Always enabled
- **Generics**: Use for flexible, reusable components
- **Prop types**: Always export for user extensibility
- **Return types**: Explicit for public APIs
- **Type inference**: Leverage where appropriate

## Documentation Requirements

When adding/changing features:

1. **Update MDX files** in `docs/suspensive.org/src/content/`
2. **Support both languages**: English (`/en/`) and Korean (`/ko/`)
3. **Add examples**: Include runnable code snippets
4. **Update README**: If it affects the package README
5. **Migration guide**: For breaking changes

## Common Gotchas

1. **Build first**: Must build packages before running examples or tests
2. **Monorepo**: Changes in one package don't affect others until rebuilt
3. **SSR**: Always consider server-side rendering implications
4. **Peer dependencies**: React is a peer dependency, not a direct dependency
5. **Version detection**: react-query package auto-detects TanStack Query version

## File Naming Conventions

- Components: `ComponentName.tsx`
- Hooks: `useHookName.ts`
- Tests: `ComponentName.spec.tsx` (runtime), `ComponentName.test-d.tsx` (types)
- Types: `types.ts` or inline with component
- Utils: `utils.ts` or `utilityName.ts`

## Code Style

- **Functional components**: Prefer over class components (except ErrorBoundary)
- **TypeScript**: Full type coverage
- **Named exports**: Prefer over default exports
- **Destructuring**: Use for props and state
- **Arrow functions**: Prefer for inline functions
- **Const assertions**: Use for constant objects/arrays

## Import Conventions

```typescript
// React imports first
import { type ReactNode, Suspense as ReactSuspense } from 'react'

// External dependencies
import { useQuery } from '@tanstack/react-query'

// Internal imports
import { useErrorBoundary } from './hooks'
import type { ErrorBoundaryProps } from './types'
```

## Performance Considerations

- **Bundle size**: Keep it minimal, avoid large dependencies
- **Tree shaking**: Ensure code is tree-shakeable
- **Lazy loading**: Use React.lazy where appropriate
- **Memoization**: Use useMemo/useCallback judiciously
- **Re-renders**: Minimize unnecessary re-renders

## Version Support

- **React**: 18+ and 19+
- **TanStack Query**: v4.42.0+ and v5.82.0+
- **Node**: Version specified in `.nvmrc`
- **TypeScript**: Latest stable version

## Release Process

1. Changes are collected via Changesets
2. Version bumps follow semantic versioning
3. Changelogs auto-generated from changesets
4. Conventional commits for commit messages

## Community Guidelines

- **Open source**: MIT licensed, community-driven
- **Contributions**: Welcome via PRs following CONTRIBUTING.md
- **Issues**: Bug reports and feature requests via GitHub Issues
- **Discussions**: For questions and community support

## Quick Links

- Documentation: https://suspensive.org
- GitHub: https://github.com/toss/suspensive
- NPM: https://www.npmjs.com/package/@suspensive/react
- Discord: https://discord.gg/RFcR9WWmCH

---

For detailed AI assistant guidelines, see `.cursorrules` and `.github/copilot/instructions.md`
