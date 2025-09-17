---
"@suspensive/jotai": patch
"@suspensive/react-dom": patch
"@suspensive/react-native": patch
"@suspensive/react-query-4": patch
"@suspensive/react-query-5": patch
"@suspensive/react-query": patch
"@suspensive/react": patch
---

feat: add npm OIDC authentication support

This adds OIDC (OpenID Connect) authentication support for npm publishing in GitHub Actions. The implementation enables secure, tokenless publishing to npm using GitHub's OIDC tokens with provenance support.

Key features:
- **OIDC Authentication**: Uses GitHub Actions `id-token: write` permission for secure publishing
- **Provenance Support**: Enables npm package provenance through `NPM_CONFIG_PROVENANCE=true`
- **Backward Compatibility**: Maintains NPM_TOKEN as fallback for existing workflows

This enhances security by reducing dependency on long-lived npm tokens while providing package provenance for better supply chain security.