# @suspensive/codemods

@suspensive/codemods provides a collection of codemods to help you migrate and transform your Suspensive codebase more effectively. These automated code transformations make it easier to upgrade between versions and adopt new patterns.

[![npm version](https://img.shields.io/npm/v/@suspensive/codemods?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/codemods)
[![npm](https://img.shields.io/npm/dm/@suspensive/codemods?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/codemods)

## Installation

No installation required! Run codemods directly using npx:

```shell
npx @suspensive/codemods
```

## Usage

Navigate to your project's root directory and run:

```shell
npx @suspensive/codemods <transform> <path>
```

### Available Transforms

- **tanstack-query-import**: Update import paths to use TanStack Query
- **migrate-query-client-consumer-props**: Transform QueryClientConsumer component props
- **migrate-with-api**: Convert to the new with API pattern
- **remove-networkmode**: Remove deprecated networkMode configurations

### Examples

```shell
# Transform TanStack Query imports
npx @suspensive/codemods tanstack-query-import src/

# Migrate QueryClientConsumer props
npx @suspensive/codemods migrate-query-client-consumer-props src/

# Convert to with API pattern
npx @suspensive/codemods migrate-with-api src/

# Remove networkMode configurations
npx @suspensive/codemods remove-networkmode src/
```

## Features

- 🚀 **Automated Migration**: Automatically transform your codebase
- 🎯 **Precise Transformations**: Target specific patterns and APIs
- 🔄 **Version Upgrades**: Easy migration between Suspensive versions
- 🛡️ **Safe Transformations**: Preserves code functionality while updating syntax
- 📦 **No Installation**: Run directly with npx

## Documentation

For comprehensive guides on available codemods and migration strategies, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
