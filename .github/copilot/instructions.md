# GitHub Copilot Instructions for Suspensive

## Quick Context

You are working on **Suspensive**, a library that simplifies React Suspense usage. The project provides declarative error boundaries, SSR-safe Suspense components, and integrations with @tanstack/react-query.

## Key Architecture Points

### Monorepo Structure
- **Main packages** in `packages/`: react, react-query, react-dom, react-native, next, jotai, codemods
- **Documentation** in `docs/suspensive.org/`: Next.js app with Nextra
- **Examples** in `examples/`: Working demo applications
- **Configs** in `configs/`: Shared configurations

### Core Libraries
1. **@suspensive/react**: Core utilities (`<ErrorBoundary/>`, `<Suspense/>`, `<Delay/>`, etc.)
2. **@suspensive/react-query**: TanStack Query integration with auto-detection for v4/v5
3. **@suspensive/react-dom**: DOM utilities (`<InView/>`, `<FadeIn/>`)

## Development Quick Start

```bash
# Setup
corepack enable && corepack prepare
pnpm install
pnpm run build

# Development
pnpm run dev          # Watch mode
pnpm run ci:all       # Full CI check
```

## Code Patterns to Follow

### Component Pattern
```typescript
import type { ComponentProps, ReactNode } from 'react'

interface MyComponentProps {
  children: ReactNode
  fallback?: ReactNode
}

export const MyComponent = ({ children, fallback }: MyComponentProps) => {
  // Implementation
}
```

### Hook Pattern
```typescript
export const useMyHook = <T,>(initialValue: T) => {
  // Implementation with proper TypeScript generics
}
```

### Error Boundary Pattern
```typescript
<ErrorBoundary fallback={({ error, reset }) => (
  <div>
    <p>{error.message}</p>
    <button onClick={reset}>Retry</button>
  </div>
)}>
  <AsyncComponent />
</ErrorBoundary>
```

## Testing Guidelines

- Co-locate tests with source files
- Use `.spec.tsx` for runtime tests
- Use `.test-d.tsx` for type tests
- Leverage React Testing Library patterns
- Ensure SSR compatibility in tests

## Documentation Standards

- Update MDX docs in `docs/suspensive.org/src/content/`
- Support both English (`/en/`) and Korean (`/ko/`)
- Include runnable code examples
- Add migration guides for breaking changes

## Common Commands by Package

Each package supports:
- `build`: Build the package
- `ci:eslint`: Lint
- `ci:test`: Run tests
- `ci:type`: Type check

## Important Conventions

1. **Naming**: PascalCase for components, camelCase for hooks (with `use` prefix)
2. **Exports**: Public APIs in `index.ts`, internal utilities in subdirectories
3. **Types**: Always export prop types for extensibility
4. **SSR**: Consider server-side rendering in all implementations
5. **Bundle Size**: Keep dependencies minimal and code tree-shakeable

## When Suggesting Code

- Maintain consistency with existing patterns
- Ensure TypeScript types are complete and accurate
- Consider SSR implications (check for `window`, `document` usage)
- Follow React best practices (hooks rules, component patterns)
- Keep bundle size in mind
- Add appropriate JSDoc comments for public APIs

## Package-Specific Notes

### @suspensive/react
- Core package, no external dependencies
- Must work in SSR and CSR environments
- Focus on declarative APIs

### @suspensive/react-query
- Auto-detects TanStack Query version (v4 or v5)
- Wraps around react-query-4 and react-query-5 packages
- Includes CLI tools for version management

### @suspensive/react-dom
- Browser-only utilities
- Uses Intersection Observer API
- Handles viewport-based interactions

### Documentation Site
- Built with Next.js 15 and Nextra
- Supports i18n (English and Korean)
- Uses Tailwind CSS for styling

## Useful Patterns in Codebase

### Wrapping Components
The library uses a pattern of wrapping React components to add functionality:
```typescript
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

### Fallback Props
Consistent pattern for fallback rendering:
```typescript
fallback={({ error, reset }) => <ErrorUI error={error} onReset={reset} />}
```

### SSR Safety
Use `clientOnly` prop for SSR-unsafe components:
```typescript
<Suspense clientOnly fallback={<Loading />}>
  <ClientOnlyFeature />
</Suspense>
```

## Build System

- **Build tool**: tsdown (rolldown-based)
- **Outputs**: ESM (`.js`, `.d.ts`), CJS (`.cjs`, `.d.cts`)
- **Monorepo tool**: Turborepo with caching
- **Quality checks**: ESLint, TypeScript, Vitest

## Don't Do

- Don't add unnecessary dependencies
- Don't break SSR compatibility
- Don't forget to update both English and Korean docs
- Don't modify types without updating type tests
- Don't skip the build step before testing
- Don't create inconsistent API patterns
- Don't forget to add migration guides for breaking changes

## Do

- Follow existing patterns in the codebase
- Add comprehensive tests for new features
- Update documentation with examples
- Consider edge cases (SSR, error states, loading states)
- Keep bundle size minimal
- Maintain backward compatibility when possible
- Use TypeScript generics appropriately
- Add JSDoc comments for public APIs
