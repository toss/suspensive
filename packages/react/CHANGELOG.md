# @suspensive/react

## 2.0.0-beta.1

## 2.0.0-beta.0

### Major Changes

- ea1c4ed: feat(react): rename Suspensive defaultOptions -> defaultProps
- 78f5bd4: feat(react, react-query): remove deprecated apis
- 837ed18: feat(\*): remove target react v16, v17

## 1.25.2

### Patch Changes

- a6d279e: fix(\*): add use-sync-external-store

## 1.25.1

### Patch Changes

- 37f5465: feat(react): add ErrorBoundary.Consumer, ErrorBoundaryGroup.Consumer

## 1.25.0

### Minor Changes

- caed129: feat(react): add `shouldCatch` prop of ErrorBoundary

## 1.24.0

### Minor Changes

- 89c3283: feat(react): add fallback prop of Delay

## 1.23.2

### Patch Changes

- 9bced99: fix(tsup): remove treeshaking, minification

## 1.23.1

### Patch Changes

- c526ad3: fix(react): assert message correctly, test code simply

## 1.23.0

### Minor Changes

- e776d52: feat(react): add svg logo for `<DevMode/>`

## 1.22.2

### Patch Changes

- f56c40e: fix(react): add OmitKeyOf to remove PropsWithoutChildren, PropsWithoutDevMode

## 1.22.1

### Patch Changes

- 3782ae8: ci(eslint): add plugin:@typescript-eslint/strict-type-checked

## 1.22.0

### Minor Changes

- d1d7d1a: feat(react): add Suspense clientOnly prop to deprecate Suspense.CSROnly, wrap.Suspense.CSROnly

## 1.21.0

### Minor Changes

- 45ce93f: feat(react): add DevMode

### Patch Changes

- 6239ebb: fix(react): remove assert.message

## 1.20.10

### Patch Changes

- 416a85c: fix: treeshake and minify to reduce bundle size

## 1.20.9

### Patch Changes

- 685054a: ci(eslint): add import/no-cycle to prevent memory leak

## 1.20.8

### Patch Changes

- 4a3e7eb: fix(tsup): add splitting to reduce bundle size dramatically

## 1.20.7

### Patch Changes

- b69d651: fix(tsup): add supported browsers

## 1.20.6

### Patch Changes

- 88c1585: refactor(react, react-await, react-image): replace createElement by jsx

## 1.20.5

### Patch Changes

- b5888b2: fix(react): make wrap as stable and deprecate all withXXXs
- bce7c1d: fix(react): deprecate AsyncBoundary

## 1.20.4

### Patch Changes

- acbc787: refactor: extract unnecessary packages to root

## 1.20.3

### Patch Changes

- 60f7fcc: refactor(react, react-query): remove unnecessary `as` by `Object.assign`

## 1.20.2

### Patch Changes

- e37fbcc: chore(deps-dev): Bump @types/react from 18.2.34 to 18.2.37

## 1.20.1

## 1.20.0

### Minor Changes

- 3f92ae8: feat(react): re-throw received error with no fallback of ErrorBoundary

### Patch Changes

- 4fe94af: perf(react): reduce ErrorBoundaryGroup size

## 1.19.0

### Minor Changes

- f78ed7d: feat(react): add experimental wrap to remove unnecessary hocs' implementation

## 1.18.3

### Patch Changes

- 38c1247: chore: update project's dependencies

## 1.18.2

### Patch Changes

- a06c31f: fix(react): remove useless variable assigning in useIsomorphicLayoutEffect

## 1.18.1

### Patch Changes

- e825f93: fix(tsup): remove entry of experimental

## 1.18.0

### Minor Changes

- 4ec2a19: feat(react): useErrorBoundary to stable from experimental

## 1.17.7

### Patch Changes

- 257b672: fix: add module field of package.json

## 1.17.6

### Patch Changes

- b962122: test(react): add useTimeout test case
- c09f52a: perf(react): remove unnecessary useSetTimeout's callback calling

## 1.17.5

### Patch Changes

- 84d293a: refactor: add @suspensive/test-utils as dev dependency to remove unnecessary repetitive code

## 1.17.4

### Patch Changes

- 70d8128: fix(react): convert Suspense.CSROnly's useEffect into useIsomorphicLayoutEffect to prevent unnecessary layout shift

## 1.17.3

### Patch Changes

- b908c02: fix(react): remove unnecessary @types/use-sync-external-store

## 1.17.2

### Patch Changes

- 7e01577: fix(react): remove `<Await/>`

## 1.17.1

### Patch Changes

- 7e423e7: docs: update jsdoc links

## 1.17.0

### Minor Changes

- 8ded1b2: feat(react): add all props type of all components

## 1.16.1

### Patch Changes

- d415299: chore: remove docs in packages

## 1.16.0

### Minor Changes

- a711c19: feat(react): add useErrorBoundaryFallbackProps

## 1.15.5

### Patch Changes

- 62c3384: chore(eslint): add no-duplicates, consistent-type-imports

## 1.15.4

### Patch Changes

- ba1e1a6: refactor(react): to easier code

## 1.15.3

### Patch Changes

- b05b4e2: docs(react): update doc for Delay
- e1e9a6b: docs(react): update doc for ErrorBoundaryGroup

## 1.15.2

### Patch Changes

- cbfbc02: docs(docusaurus): add npm2yarn plugin
- cfcafd2: docs(react): update tips as admonitions

## 1.15.1

### Patch Changes

- 5dfdf71: fix: remove awaitClient from ErrorBoundary
- c9bc99d: docs: update experimental feature mark as admonitions of docusaurus

## 1.15.0

### Minor Changes

- b431a4d: feat(react): add useErrorBoundary

## 1.14.9

## 1.14.8

### Patch Changes

- dd75647: feat(react): add getError, remove unnecessary generic
- a803b48: fix(react): fix ErrorBoundary reset using render prop

## 1.14.7

### Patch Changes

- 085cbe6: refactor(react): apply assert

## 1.14.6

### Patch Changes

- eac6832: fix(react): add assertion function to assert condition

## 1.14.5

### Patch Changes

- da0bd52: refactor(react): clarify variable name
- 2c30f6d: refactor(react): add useSetTimeout to reduce code

## 1.14.4

### Patch Changes

- 8d8ef53: fix(react): object that elment of key don't care field's order by hashKey
- 482cfc4: fix(react): update BaseErrorBoundary method simply
- d636e85: fix(react): ErrorBoundary should catch null thrown by children
- 8d8ef53: fix(react): replace useEffect to use-sync-external-store

## 1.14.3

### Patch Changes

- da62f3a: refactor(react): merge hoc's code into original component file

## 1.14.2

### Patch Changes

- ada618e: chore(package.json): more detail

## 1.14.1

### Patch Changes

- c5906c9: refactor(react, react-query): remove **test** directory to collocate

## 1.14.0

### Minor Changes

- 252d1d3: fix(react): rename useSuspenseCache to useAwait, suspenseCache to SuspensiveCache

## 1.13.0

### Minor Changes

- 95be8a2: fix(react): change experimental Delay, SuspensiveProvider to stable

## 1.12.2

### Patch Changes

- 6237e94: feat(vitest): add @suspensive/vitest generating named config automatically by packageJson.name
- 6c5e097: ci(test): migrate jest to vitest

## 1.12.1

### Patch Changes

- 7109191: fix(esm): cjs to esm as default

## 1.12.0

### Minor Changes

- e3df644: feat(react): add ErrorBoundaryFallbackProps type

### Patch Changes

- f4b1ac7: fix(react): enable hook in ErrorBoundary
- 8c23785: refactor(eslint, tsconfig): simply

## 1.11.7

### Patch Changes

- f23a241: fix(typescript): update version from v4 to v5

## 1.11.6

### Patch Changes

- eb8b6a9: fix(react, react-query): remove unnecessary files by package.json's files

## 1.11.5

### Patch Changes

- resolve @suspensive/tsup error

## 1.11.4

### Patch Changes

- 80cc215: chore(bundler): migrate from rollup to tsup

## 1.11.4-beta.0

### Patch Changes

- 5b87ae4: chore(bundler): migrate from rollup to tsup

## 1.11.3

### Patch Changes

- a9b97c2: fix(react): remove ErrorBoundaryGroup's unnecessary rerender by usePrevious, remove not on purpose situation's group.reset by isMounted's side effect

## 1.11.2

### Patch Changes

- ef0350c: fix(react): fix useErrorBoundaryGroup to guarantee parent ErrorBoundaryGroup

## 1.11.1

## 1.11.0

### Minor Changes

- a89dd4f: feat(react): add useSuspenseCache, suspenseCache(experimental)

## 1.10.0

## 1.9.6

### Patch Changes

- 1a9f364: fix(react): add next.js appRouter 'use client' directive

## 1.9.5

## 1.9.4

## 1.9.3

### Patch Changes

- 6e99b89: changelog initialization
