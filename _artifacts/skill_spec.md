# Suspensive — Skill Spec

Suspensive is a set of declarative React components and hooks that fill the practical gaps in React Suspense, Error Boundaries, and lazy, plus render-prop integrations for TanStack Query and Jotai. Its core idea: declare boundaries and data-fetching as JSX at the same depth (render props) so components handle only the success case.

Maintainer decisions baked into this spec (2026-07-04):

- The `@suspensive/react-query` facade package is being **phased out** — all react-query skills ship in `@suspensive/react-query-4` and `@suspensive/react-query-5`.
- `@suspensive/next` (v0.0.9, experimental) is excluded.
- `@suspensive/codemods` is covered inside migration/deprecation content, not as a standalone skill.

## Domains

| Domain         | Description                                                | Skills                                                   |
| -------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| error-handling | Catching, filtering, resetting, propagating render errors  | error-handling, suspensive-react                         |
| loading-ux     | Fallbacks, flash-of-loading prevention, global defaults    | loading-ux                                               |
| ssr            | Per-boundary SSR skip, hydration safety, server prefetch   | ssr-client-only, ssr-hydration                           |
| code-splitting | lazy preloading, chunk-failure recovery                    | code-splitting                                           |
| data-fetching  | Render-prop queries/mutations/prefetch over TanStack Query | react-query, declarative-queries, mutations, prefetching |
| jotai-atoms    | Render-prop components for Jotai atoms                     | jotai                                                    |
| migration      | v2→v3 breaking changes and codemods                        | migrate-to-v3                                            |

## Skill Inventory

| Skill               | Type        | Package(s)                   | What it covers                                                    | Failure modes |
| ------------------- | ----------- | ---------------------------- | ----------------------------------------------------------------- | ------------- |
| react               | core        | @suspensive/react            | Entry point, decision tree, .with() pattern                       | (routes only) |
| error-handling      | sub-skill   | @suspensive/react            | ErrorBoundary, shouldCatch, ErrorBoundaryGroup, fallback hooks    | 5             |
| loading-ux          | sub-skill   | @suspensive/react            | Suspense, Delay, isDelayed, DefaultPropsProvider                  | 3             |
| ssr-client-only     | sub-skill   | @suspensive/react            | clientOnly, ClientOnly, useIsClient                               | 3             |
| code-splitting      | sub-skill   | @suspensive/react            | lazy, createLazy, reloadOnError                                   | 2             |
| migrate-to-v3       | lifecycle   | @suspensive/react            | wrap→.with(), AsyncBoundary, HOC removal, codemods                | 3             |
| react-query         | core        | react-query-4, react-query-5 | Package selection, TSQ-vs-Suspensive import boundary              | 3             |
| declarative-queries | sub-skill   | react-query-4, react-query-5 | SuspenseQuery/Queries/InfiniteQuery, IsFetching                   | 3             |
| mutations           | sub-skill   | react-query-4, react-query-5 | Mutation, mutationOptions                                         | 2             |
| prefetching         | sub-skill   | react-query-4, react-query-5 | usePrefetchQuery, PrefetchQuery components                        | 2             |
| ssr-hydration       | sub-skill   | react-query-4, react-query-5 | createGetQueryClient, QueriesHydration, skipSsrOnError            | 5             |
| suspensive-react    | composition | react-query-4, react-query-5 | ErrorBoundary + query error reset, QueryErrorBoundary replacement | 2             |
| jotai               | core        | @suspensive/jotai            | Atom, AtomValue, SetAtom, async atoms + Suspense                  | 3             |

Skills for react-query are generated **twice** (once per versioned package) with version-specific deltas:

| Concern                  | react-query-4                                                      | react-query-5                     |
| ------------------------ | ------------------------------------------------------------------ | --------------------------------- |
| Peer                     | @tanstack/react-query@4 (Safari < 15 OK)                           | @tanstack/react-query@5           |
| QueryClientConsumer prop | `context`                                                          | `queryClient`                     |
| Hydration internals      | `Hydrate`                                                          | `HydrationBoundary`               |
| GC option name           | `cacheTime` (server-forced Infinity)                               | `gcTime` (server-forced Infinity) |
| Backported deprecations  | useSuspenseQuery etc. official at TSQ 4.40+; mutationOptions 4.44+ | official in v5                    |

## Tensions

| Tension                                       | Skills                            | Agent implication                                                    |
| --------------------------------------------- | --------------------------------- | -------------------------------------------------------------------- |
| clientOnly simplicity vs SSR value            | ssr-client-only ↔ ssr-hydration   | clientOnly used to silence hydration errors that need real hydration |
| Suspensive components vs official hooks       | react-query ↔ declarative-queries | Everything imported from Suspensive incl. deprecated re-exports      |
| Getting-started simplicity vs server security | ssr-hydration                     | SPA-style global QueryClient copied into SSR apps                    |

## Cross-References

| From             | To                  | Reason                                                         |
| ---------------- | ------------------- | -------------------------------------------------------------- |
| suspensive-react | error-handling      | QueryErrorBoundary replacement is an ErrorBoundary composition |
| ssr-client-only  | ssr-hydration       | clientOnly removes the need for server prefetch under it       |
| loading-ux       | declarative-queries | Delay composes inside Suspense fallbacks around queries        |
| migrate-to-v3    | error-handling      | v3 changed fallback error propagation                          |

## Recommended Skill File Structure

- **Core/entry skills:** `react` (packages/react), `react-query` (packages/react-query-4 and -5), `jotai` (packages/jotai)
- **Sub-skills:** nested under each entry skill directory
- **Lifecycle:** `lifecycle/migrate-to-v3` (packages/react)
- **Composition:** `compositions/suspensive-react` (packages/react-query-4 and -5)
- **Reference files:** none required (no skill projected over 500 lines; no 3+ adapter subsystems)

## Composition Opportunities

| Library               | Integration points                                                                  | Composition skill?           |
| --------------------- | ----------------------------------------------------------------------------------- | ---------------------------- |
| @tanstack/react-query | ErrorBoundary + useQueryErrorResetBoundary, Suspense fallbacks around SuspenseQuery | yes — suspensive-react       |
| jotai                 | async atoms suspend into @suspensive/react Suspense                                 | covered inside jotai skill   |
| next                  | App Router RSC (QueriesHydration, createGetQueryClient)                             | covered inside ssr-hydration |
