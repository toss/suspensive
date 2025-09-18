# @suspensive/react-dom

## 3.9.1

### Patch Changes

- [#1737](https://github.com/toss/suspensive/pull/1737) [`458812c`](https://github.com/toss/suspensive/commit/458812cb875356aefacba2f3ba9515a30720b57e) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - feat: add npm OIDC authentication support

  This adds OIDC (OpenID Connect) authentication support for npm publishing in GitHub Actions. The implementation enables secure, tokenless publishing to npm using GitHub's OIDC tokens with provenance support.

  Key features:
  - **OIDC Authentication**: Uses GitHub Actions `id-token: write` permission for secure publishing
  - **Provenance Support**: Enables npm package provenance through `NPM_CONFIG_PROVENANCE=true`
  - **Backward Compatibility**: Maintains NPM_TOKEN as fallback for existing workflows

  This enhances security by reducing dependency on long-lived npm tokens while providing package provenance for better supply chain security.

## 3.9.0

## 3.8.0

## 3.7.0

## 3.6.0

### Minor Changes

- [#1678](https://github.com/toss/suspensive/pull/1678) [`b2f7f44`](https://github.com/toss/suspensive/commit/b2f7f44f69768aaf92bf20fc52e15f2b573e7664) Thanks [@gwansikk](https://github.com/gwansikk)! - chore(\*): migrate tsdown

## 3.5.0

## 3.4.0

## 3.3.2

## 3.3.1

### Patch Changes

- [#1661](https://github.com/toss/suspensive/pull/1661) [`27bda1d`](https://github.com/toss/suspensive/commit/27bda1df5675c068e2cbb6f202b4ceb00ced4465) Thanks [@manudeli](https://github.com/manudeli)! - perf(react, react-query): reduce size

## 3.3.0

## 3.2.3

### Patch Changes

- [#1631](https://github.com/toss/suspensive/pull/1631) [`9ba127e`](https://github.com/toss/suspensive/commit/9ba127ee1e7e21b626e7dca8ad2ad56a0c3ee2dc) Thanks [@sukvvon](https://github.com/sukvvon)! - feat(react-dom): add JSDoc comments explaining IntersectionObserver usage

## 3.2.2

### Patch Changes

- [#1590](https://github.com/toss/suspensive/pull/1590) [`cd72194`](https://github.com/toss/suspensive/commit/cd72194871b6b330e6b05d442a0ba1e7d52c6891) Thanks [@manudeli](https://github.com/manudeli)! - chore(\*): npm tag as latest

## 3.2.1

## 3.2.0

## 3.1.1

## 3.1.0

## 3.0.0

### Major Changes

- [#1467](https://github.com/toss/suspensive/pull/1467) [`f1fa810`](https://github.com/toss/suspensive/commit/f1fa8101a17285dc343f4e342d372a1cac40d29f) Thanks [@manudeli](https://github.com/manudeli)! - feat(react-dom): v3.0.0

- [#1528](https://github.com/toss/suspensive/pull/1528) [`5739fd8`](https://github.com/toss/suspensive/commit/5739fd84b2cb16196eb1ac9d47e0c21ee9e9dcf4) Thanks [@manudeli](https://github.com/manudeli)! - feat(react-dom): is prefix, for InView

### Minor Changes

- [#1518](https://github.com/toss/suspensive/pull/1518) [`9a00852`](https://github.com/toss/suspensive/commit/9a008524ec69b35a59ca735e3d60379c4d350030) Thanks [@manudeli](https://github.com/manudeli)! - feat(react-dom): onInView, onInViewEnd

### Patch Changes

- [#1497](https://github.com/toss/suspensive/pull/1497) [`e400035`](https://github.com/toss/suspensive/commit/e4000352b7d3e42f0164983cca2bcde9fd24751c) Thanks [@kangju2000](https://github.com/kangju2000)! - chore: improve JSR imports sync with consistent dependency formatting

- [#1511](https://github.com/toss/suspensive/pull/1511) [`3f87359`](https://github.com/toss/suspensive/commit/3f873592847e40170252e04b267911dee6559c7e) Thanks [@kangju2000](https://github.com/kangju2000)! - chore(\*): remove JSR support and related files

- [#1475](https://github.com/toss/suspensive/pull/1475) [`c44994b`](https://github.com/toss/suspensive/commit/c44994b3510d6c41ed09504cb74999a99dd99253) Thanks [@kangju2000](https://github.com/kangju2000)! - feat: add JSR support and publishing workflow

## 3.0.0-next.19

### Major Changes

- [#1528](https://github.com/toss/suspensive/pull/1528) [`5739fd8`](https://github.com/toss/suspensive/commit/5739fd84b2cb16196eb1ac9d47e0c21ee9e9dcf4) Thanks [@manudeli](https://github.com/manudeli)! - feat(react-dom): is prefix, for InView

## 3.0.0-next.18

### Minor Changes

- [#1518](https://github.com/toss/suspensive/pull/1518) [`9a00852`](https://github.com/toss/suspensive/commit/9a008524ec69b35a59ca735e3d60379c4d350030) Thanks [@manudeli](https://github.com/manudeli)! - feat(react-dom): onInView, onInViewEnd

## 3.0.0-next.17

## 3.0.0-next.16

### Patch Changes

- [#1511](https://github.com/toss/suspensive/pull/1511) [`3f87359`](https://github.com/toss/suspensive/commit/3f873592847e40170252e04b267911dee6559c7e) Thanks [@kangju2000](https://github.com/kangju2000)! - chore(\*): remove JSR support and related files

## 3.0.0-next.15

### Patch Changes

- [#1497](https://github.com/toss/suspensive/pull/1497) [`e400035`](https://github.com/toss/suspensive/commit/e4000352b7d3e42f0164983cca2bcde9fd24751c) Thanks [@kangju2000](https://github.com/kangju2000)! - chore: improve JSR imports sync with consistent dependency formatting

## 3.0.0-next.14

## 3.0.0-next.13

## 3.0.0-next.12

## 3.0.0-next.11

## 3.0.0-next.10

## 3.0.0-next.9

## 3.0.0-next.8

## 3.0.0-next.7

### Patch Changes

- [#1475](https://github.com/toss/suspensive/pull/1475) [`c44994b`](https://github.com/toss/suspensive/commit/c44994b3510d6c41ed09504cb74999a99dd99253) Thanks [@kangju2000](https://github.com/kangju2000)! - feat: add JSR support and publishing workflow

## 3.0.0-next.6

### Major Changes

- [#1467](https://github.com/toss/suspensive/pull/1467) [`f1fa810`](https://github.com/toss/suspensive/commit/f1fa8101a17285dc343f4e342d372a1cac40d29f) Thanks [@manudeli](https://github.com/manudeli)! - feat(react-dom): v3.0.0

## 0.2.1

### Patch Changes

- [#1389](https://github.com/toss/suspensive/pull/1389) [`d381f94`](https://github.com/toss/suspensive/commit/d381f9496913f58ee5f698b04c4a90285b8df045) Thanks [@manudeli](https://github.com/manudeli)! - feat(\*): support react 19

## 0.2.0

### Minor Changes

- [#1362](https://github.com/toss/suspensive/pull/1362) [`244b305`](https://github.com/toss/suspensive/commit/244b305998fcf768998b9545238a64f1ed854703) Thanks [@manudeli](https://github.com/manudeli)! - feat(react-dom): add `<FadeIn/>`

## 0.1.5

### Patch Changes

- [#1290](https://github.com/toss/suspensive/pull/1290) [`d84ee5c`](https://github.com/toss/suspensive/commit/d84ee5c4e635c5334b8d5e2c31f45b790df1a8ca) Thanks [@manudeli](https://github.com/manudeli)! - chore(@suspensive/utils): remove package

## 0.1.4

### Patch Changes

- [#1272](https://github.com/toss/suspensive/pull/1272) [`89f5b5c`](https://github.com/toss/suspensive/commit/89f5b5c4d9b16bcbed77ef3e17bb1f34babe2921) Thanks [@love1ace](https://github.com/love1ace)! - docs(\*): update description of package.json

- Updated dependencies [[`89f5b5c`](https://github.com/toss/suspensive/commit/89f5b5c4d9b16bcbed77ef3e17bb1f34babe2921)]:
  - @suspensive/utils@2.17.1

## 0.1.3

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.17.0

## 0.1.2

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.16.1

## 0.1.1

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.16.0

## 0.1.0

### Minor Changes

- [`1a881a8`](https://github.com/toss/suspensive/commit/1a881a8e137785756fcb9ba547c2ef79c1436276) Thanks [@manudeli](https://github.com/manudeli)! - feat(react-dom): add InView, useInView

## 0.0.9

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.15.0

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.14.2

## 0.0.7

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.14.1

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.14.0

## 0.0.5

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.13.1

## 0.0.4

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.13.0

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.12.3

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.12.2

## 0.0.1

### Patch Changes

- [#1182](https://github.com/toss/suspensive/pull/1182) [`6859215`](https://github.com/toss/suspensive/commit/68592157565eafbf39f2a93f85c6e22b87cf9ef3) Thanks [@manudeli](https://github.com/manudeli)! - feat(react-dom): init @suspensive/react-dom
