# @suspensive/jotai

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

## 3.3.0

## 3.2.3

## 3.2.2

### Patch Changes

- [#1590](https://github.com/toss/suspensive/pull/1590) [`cd72194`](https://github.com/toss/suspensive/commit/cd72194871b6b330e6b05d442a0ba1e7d52c6891) Thanks [@manudeli](https://github.com/manudeli)! - chore(\*): npm tag as latest

## 3.2.1

## 3.2.0

## 3.1.1

## 3.1.0

## 3.0.0

### Patch Changes

- [#1497](https://github.com/toss/suspensive/pull/1497) [`e400035`](https://github.com/toss/suspensive/commit/e4000352b7d3e42f0164983cca2bcde9fd24751c) Thanks [@kangju2000](https://github.com/kangju2000)! - chore: improve JSR imports sync with consistent dependency formatting

- [#1511](https://github.com/toss/suspensive/pull/1511) [`3f87359`](https://github.com/toss/suspensive/commit/3f873592847e40170252e04b267911dee6559c7e) Thanks [@kangju2000](https://github.com/kangju2000)! - chore(\*): remove JSR support and related files

- [#1475](https://github.com/toss/suspensive/pull/1475) [`c44994b`](https://github.com/toss/suspensive/commit/c44994b3510d6c41ed09504cb74999a99dd99253) Thanks [@kangju2000](https://github.com/kangju2000)! - feat: add JSR support and publishing workflow

## 3.0.0-next.19

## 3.0.0-next.18

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

## 3.0.0-next.5

## 3.0.0-next.4

## 3.0.0-next.3

## 3.0.0-next.2

## 3.0.0-next.1

## 3.0.0-next.0

## 2.18.13

## 2.18.12

## 2.18.11

## 2.18.10

### Patch Changes

- [#1389](https://github.com/toss/suspensive/pull/1389) [`d381f94`](https://github.com/toss/suspensive/commit/d381f9496913f58ee5f698b04c4a90285b8df045) Thanks [@manudeli](https://github.com/manudeli)! - feat(\*): support react 19

## 2.18.9

## 2.18.8

## 2.18.7

## 2.18.6

### Patch Changes

- [#1364](https://github.com/toss/suspensive/pull/1364) [`9db2983`](https://github.com/toss/suspensive/commit/9db298363b0df84225e03e54bbbe950814c55495) Thanks [@kangju2000](https://github.com/kangju2000)! - fix(\*): fix typo in jsdoc

- [#1364](https://github.com/toss/suspensive/pull/1364) [`9db2983`](https://github.com/toss/suspensive/commit/9db298363b0df84225e03e54bbbe950814c55495) Thanks [@kangju2000](https://github.com/kangju2000)! - fix(react-query, jotai, react): fix typo in jsdoc

## 2.18.5

## 2.18.4

## 2.18.3

## 2.18.2

## 2.18.1

## 2.18.0

## 2.17.4

## 2.17.3

## 2.17.2

### Patch Changes

- [#1290](https://github.com/toss/suspensive/pull/1290) [`d84ee5c`](https://github.com/toss/suspensive/commit/d84ee5c4e635c5334b8d5e2c31f45b790df1a8ca) Thanks [@manudeli](https://github.com/manudeli)! - chore(@suspensive/utils): remove package

## 2.17.1

### Patch Changes

- [#1272](https://github.com/toss/suspensive/pull/1272) [`89f5b5c`](https://github.com/toss/suspensive/commit/89f5b5c4d9b16bcbed77ef3e17bb1f34babe2921) Thanks [@love1ace](https://github.com/love1ace)! - docs(\*): update description of package.json

- Updated dependencies [[`89f5b5c`](https://github.com/toss/suspensive/commit/89f5b5c4d9b16bcbed77ef3e17bb1f34babe2921)]:
  - @suspensive/utils@2.17.1

## 2.17.0

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.17.0

## 2.16.1

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.16.1

## 2.16.0

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.16.0

## 2.15.0

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.15.0

## 2.14.2

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.14.2

## 2.14.1

### Patch Changes

- [#1241](https://github.com/toss/suspensive/pull/1241) [`afbb430`](https://github.com/toss/suspensive/commit/afbb43056d89ccb7a650495758b594587a3d0728) Thanks [@gwansikk](https://github.com/gwansikk)! - feat(jotai): add jsdoc to jotai component

- Updated dependencies []:
  - @suspensive/utils@2.14.1

## 2.14.0

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.14.0

## 2.13.1

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.13.1

## 2.13.0

### Minor Changes

- [#1205](https://github.com/toss/suspensive/pull/1205) [`4b9acdb`](https://github.com/toss/suspensive/commit/4b9acdb68c93ad7aedb2274a004bc188a4bdf2dd) Thanks [@gwansikk](https://github.com/gwansikk)! - feat(jotai): escape version 0

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.13.0

## 0.0.13

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.12.3

## 0.0.12

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.12.2

## 0.0.11

### Patch Changes

- [#1180](https://github.com/toss/suspensive/pull/1180) [`f79b96c`](https://github.com/toss/suspensive/commit/f79b96c728e15ebe819445cf5d1c2e33e6c96ef4) Thanks [@manudeli](https://github.com/manudeli)! - fix(\*): remove unnecessary devDeps(react-dom, @types/react-dom)

- Updated dependencies []:
  - @suspensive/utils@2.12.1

## 0.0.10

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.12.0

## 0.0.9

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.11.0

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.10.0

## 0.0.7

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.9.4

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.9.3

## 0.0.5

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.9.2

## 0.0.4

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.9.1

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @suspensive/utils@2.9.0

## 0.0.2

### Patch Changes

- Updated dependencies [[`2326b13`](https://github.com/toss/suspensive/commit/2326b1341f167454a889953fb0bbf58449e1ca98)]:
  - @suspensive/utils@2.8.1

## 0.0.1

### Patch Changes

- [#1042](https://github.com/toss/suspensive/pull/1042) [`cb94914`](https://github.com/toss/suspensive/commit/cb9491494b6c66d22ab8d43a3cad354736442a59) Thanks [@gwansikk](https://github.com/gwansikk)! - feat(jotai): add @suspensive/jotai package
