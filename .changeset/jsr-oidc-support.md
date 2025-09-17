---
"@suspensive/jotai": patch
"@suspensive/react-dom": patch
"@suspensive/react-native": patch
"@suspensive/react-query-4": patch
"@suspensive/react-query-5": patch
"@suspensive/react-query": patch
"@suspensive/react": patch
---

feat: re-implement JSR support with OIDC authentication

This re-adds JSR (JavaScript Registry) publishing support with GitHub Actions OIDC authentication that was previously removed. The implementation includes:

- JSR configuration files (jsr.json) for all packages
- JSR publishing and version sync scripts
- Updated package.json scripts for JSR workflow
- GitHub Actions OIDC permissions for tokenless publishing

The JSR support enables publishing to the JavaScript Registry using OIDC tokens instead of manual token management.