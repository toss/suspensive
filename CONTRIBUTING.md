# Contributing to Suspensive libraries

Welcome contribution from everyone <br/>
All communications in this repository will be by English.

> Every contributor to Suspensive libraries should adhere to [our Code of Conduct](./CODE_OF_CONDUCT.md). Please read it to understand what actions will and will not be tolerated.

## Contributing as issue

### 1. Search for duplicates

[Search the existing issues](https://github.com/toss/suspensive/issues) before logging a new one.

### 2. Found a bug?

When logging a bug, please be sure to include the following:

- What version of TypeScript you're using (run `tsc --v`)
- If at all possible, an _isolated_ way to reproduce the behavior
- The behavior you expect to see, and the actual behavior

### 3. Feature suggestion?

We also accept suggestions in the [issue tracker](https://github.com/toss/suspensive/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=%5BFeature%5D%3A).

In general, things we find useful when reviewing suggestions are:

- A description of the problem you're trying to solve
- An overview of the suggested solution

## Contributing as code

### Prerequisites

0. [Choose an issue about bug or feature you want to work on](https://github.com/toss/suspensive/issues)
1. Fork this repository.
2. Clone the repository

   ```shell
   git clone git@github.com:{username}/suspensive.git
   ```

3. Please use the correct node version. You can use the version declared in [.nvmrc](https://github.com/toss/suspensive/blob/main/.nvmrc). We strongly recommend [nvm](https://github.com/nvm-sh/nvm) to control local machine's node version easily. also We recommend [nvm's deeper shell integration](https://github.com/nvm-sh/nvm#deeper-shell-integration) too.
4. Install packages. [We use pnpm@9.15.4. Install pnpm with corepack please if you can](https://pnpm.io/installation#using-corepack). We recommend using corepack for pnpm to automatically use the version declared in the packageManager field of package.json.

   ```shell
   corepack enable && corepack prepare
   pnpm install
   ```

### Pull Requests

> [Opening a pull request](https://github.com/toss/suspensive/pulls)

All commit message and title of your Pull Request should match the following format:

```
<type>[optional package scope]: <description>

[optional body]

[optional footer(s)]
```

> We adhere [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

Several predefined GitHub Workflows will check qualities. If you fail our checks, please check the error message and update the Pull Request.
