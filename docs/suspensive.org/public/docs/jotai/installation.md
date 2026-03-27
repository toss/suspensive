---
url: /docs/jotai/installation
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

### Check supported react, jotai version

<br />

  <tbody>
    {[
      { library: 'react', version: '^18 || ^19' },
      { library: 'jotai', version: '^2' },
    ].map((item) => (
      
        {item.library}
        {item.version}
      
    ))}
  </tbody>

### Add as Dependencies

@suspensive/jotai lives in npm. To install the latest stable version, run the following command.

```shell npm2yarn
npm install @suspensive/jotai
```
