---
url: /docs/react-query/installation
---

# Installation

### Check supported browsers

Suspensive Libraries are optimized for modern browsers. It is compatible with the following browsers config.

<br />

  <tbody>
    {[
      { browser: 'Chrome', version: '>= 51' },
      { browser: 'Firefox', version: '>= 53' },
      { browser: 'Edge', version: '>= 18' },
      { browser: 'Safari', version: '>= 11' },
      { browser: 'iOS', version: '>= 11' },
      { browser: 'Opera', version: '>= 38' },
    ].map((item) => (
      
        {item.browser}
        {item.version}
      
    ))}
  </tbody>

> Depending on your environment, you might need to add polyfills. If you want to support older browsers, you need to transpile the library from node_modules yourselves.

### Check supported react, @tanstack/react-query version

<br />

  <tbody>
    {[
      { library: 'react', version: '^18 || ^19' },
      { library: '@tanstack/react-query', version: '^4 || ^5' },
    ].map((item) => (
      
        {item.library}
        {item.version}
      
    ))}
  </tbody>

### Add as Dependencies

Install the package that matches your @tanstack/react-query version.

#### @tanstack/react-query v5

```shell npm2yarn
npm install @suspensive/react-query@npm:@suspensive/react-query-5 @tanstack/react-query@5
```

#### @tanstack/react-query v4

@tanstack/react-query v4 supports [lower version browsers](/docs/react-query/motivation#v5-drops-support-for-older-browsers) compared to v5.

```shell npm2yarn
npm install @suspensive/react-query@npm:@suspensive/react-query-4 @tanstack/react-query@4
```

> **Info:** By using npm aliases, the import path remains `@suspensive/react-query` across your codebase. When upgrading your @tanstack/react-query version, you only need to change the alias in package.json — no code changes required.
