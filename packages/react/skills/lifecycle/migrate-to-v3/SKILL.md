---
name: migrate-to-v3
description: >
  Migrate @suspensive/react v1/v2 code to v3: wrap builder → Component.with(),
  AsyncBoundary and withSuspense/withDelay/withErrorBoundary/withErrorBoundaryGroup
  removal, Suspense.CSROnly → clientOnly prop, ErrorBoundaryGroup.Reset →
  ErrorBoundaryGroup.Consumer, fallback error propagation change, React >= 18
  requirement, npx @suspensive/codemods. Load when upgrading @suspensive/react
  or when encountering wrap/AsyncBoundary/CSROnly in code or generated output.
metadata:
  type: lifecycle
  library: '@suspensive/react'
  library_version: '3.21.2'
  framework: react
requires:
  - 'react'
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/migration/migrate-to-v3.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/migration/migrate-to-v2.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/codemods/migrateWithAPI.mdx'
---

# Migrate @suspensive/react to v3

This skill builds on react. Read ../../react/SKILL.md first for the current v3 API surface.

Applies both v1→v2 and v2→v3 breaking changes. Agents trained on pre-v3 code still generate every removed API below — treat any occurrence of `wrap`, `AsyncBoundary`, `withSuspense`, or `Suspense.CSROnly` as code to migrate, never as code to write.

## Old → new API

| Removed API (version removed)                              | Replacement                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `wrap.ErrorBoundary(...).Suspense(...).on(Component)` (v3) | `ErrorBoundary.with(props, Suspense.with(props, Component))`                  |
| `AsyncBoundary` (v2)                                       | `<ErrorBoundary>` + `<Suspense>` composed                                     |
| `withSuspense(Component, props)` (v2)                      | `Suspense.with(props, Component)`                                             |
| `withDelay(Component, props)` (v2)                         | `Delay.with(props, Component)`                                                |
| `withErrorBoundary(Component, props)` (v2)                 | `ErrorBoundary.with(props, Component)`                                        |
| `withErrorBoundaryGroup(Component, props)` (v2)            | `ErrorBoundaryGroup.with(props, Component)`                                   |
| `<ErrorBoundaryGroup.Reset trigger={...}/>` (v2)           | `<ErrorBoundaryGroup.Consumer>{(group) => ...}</ErrorBoundaryGroup.Consumer>` |
| `<Suspense.CSROnly/>` (v2)                                 | `<Suspense clientOnly/>`                                                      |
| `new Suspensive({ defaultOptions })` (v2)                  | `new DefaultProps({...})` + `<DefaultPropsProvider/>`                         |

Behavior changes (no code removal, new semantics):

- v3: an error thrown in an `ErrorBoundary` fallback propagates to the parent `ErrorBoundary` instead of recursively re-rendering the same fallback (#1409). See [error-handling](../../react/error-handling/SKILL.md).
- v3.12: `Delay` children accept a render prop receiving `{ isDelayed }`.
- v2+: requires React >= 18.0 (native `useSyncExternalStore`).

## Codemods

```bash
# wrap builder / with* HOCs → .with() API (v2 → v3)
npx @suspensive/codemods migrate-with-api .

# remove ignored networkMode from suspense queries (only if @suspensive/react-query is used)
npx @suspensive/codemods remove-networkmode .
```

## Common Mistakes

### CRITICAL Generating the removed wrap builder API

Wrong:

```tsx
import { wrap } from '@suspensive/react'

const Page = wrap
  .ErrorBoundary({ fallback: ({ error }) => <>{error.message}</> })
  .Suspense({ fallback: <>loading...</> })
  .on(PageComponent)
```

Correct:

```tsx
import { ErrorBoundary, Suspense } from '@suspensive/react'

const Page = ErrorBoundary.with(
  { fallback: ({ error }) => <>{error.message}</> },
  Suspense.with({ fallback: <>loading...</> }, PageComponent)
)
```

`wrap.ErrorBoundaryGroup().ErrorBoundary().Suspense().on()` was removed in v3; each component now exposes `.with()`, which also lets bundlers include only the components you import. Fixed/removed in v3 but agents trained on older code still generate this pattern.

Source: docs/suspensive.org/src/content/en/docs/react/migration/migrate-to-v3.mdx (#1452)

### HIGH Generating removed AsyncBoundary or with\* HOCs

Wrong:

```tsx
import { AsyncBoundary } from '@suspensive/react'

const Example = ({ children }) => (
  <AsyncBoundary pendingFallback={<Spinner />} rejectedFallback={ErrorUI}>
    {children}
  </AsyncBoundary>
)
```

Correct:

```tsx
import { ErrorBoundary, Suspense } from '@suspensive/react'

const Example = ({ children }) => (
  <ErrorBoundary fallback={ErrorUI}>
    <Suspense fallback={<Spinner />}>{children}</Suspense>
  </ErrorBoundary>
)
```

`AsyncBoundary` and `withSuspense`/`withDelay`/`withErrorBoundary`/`withErrorBoundaryGroup` were removed in v2; compose `ErrorBoundary` + `Suspense` (or use `.with()`). Fixed/removed in v2 but agents trained on older code still generate this pattern.

Source: docs/suspensive.org/src/content/en/docs/react/migration/migrate-to-v2.mdx

### HIGH Generating removed ErrorBoundaryGroup.Reset

Wrong:

```tsx
import { ErrorBoundaryGroup } from '@suspensive/react'

const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset trigger={(group) => <button onClick={group.reset}>reset all</button>} />
  </ErrorBoundaryGroup>
)
```

Correct:

```tsx
import { ErrorBoundaryGroup } from '@suspensive/react'

const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Consumer>
      {(group) => <button onClick={group.reset}>reset all</button>}
    </ErrorBoundaryGroup.Consumer>
  </ErrorBoundaryGroup>
)
```

`ErrorBoundaryGroup.Reset` was renamed to `ErrorBoundaryGroup.Consumer` with a children render prop instead of `trigger`. Fixed/removed in v2 but agents trained on older code still generate this pattern.

Source: docs/suspensive.org/src/content/en/docs/react/migration/migrate-to-v2.mdx

### MEDIUM React 17 or useSyncExternalStore shim assumptions

Wrong:

```json
{
  "dependencies": {
    "react": "^17.0.2",
    "@suspensive/react": "^3.21.2"
  }
}
```

Correct:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "@suspensive/react": "^3.21.2"
  }
}
```

v2+ requires React >= 18.0 for native `useSyncExternalStore` (no shim is bundled); installing alongside React 17 fails peer dependency resolution.

Source: docs/suspensive.org/src/content/en/docs/react/migration/migrate-to-v2.mdx

See also: [error-handling](../../react/error-handling/SKILL.md) — v3 changed fallback error propagation semantics (errors thrown in a fallback are caught by the parent boundary).
