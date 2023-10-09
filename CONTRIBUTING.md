# Contributing to Suspensive libraries

Welcome contribution from everyone <br/>
All communications in this repository will be by English.

> Every contributor to Suspensive libraries should adhere to [our Code of Conduct](./CODE_OF_CONDUCT.md). Please read it to understand what actions will and will not be tolerated.

## Contributing as issue

### 1. Search for duplicates

[Search the existing issues](https://github.com/suspensive/react/issues) before logging a new one.

### 2. Have a question?

The issue tracker is for **issues**, in other words, bugs and suggestions.
If you have a _question_, please use [GitHub Discussions](https://github.com/suspensive/react/discussions), your favorite search engine, or other resources.

### 3. Found a bug?

When logging a bug, please be sure to include the following:

- What version of TypeScript you're using (run `tsc --v`)
- If at all possible, an _isolated_ way to reproduce the behavior
- The behavior you expect to see, and the actual behavior

### 4. Feature suggestion?

We also accept suggestions in the [issue tracker](https://github.com/suspensive/react/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=%5BFeature%5D%3A).

In general, things we find useful when reviewing suggestions are:

- A description of the problem you're trying to solve
- An overview of the suggested solution

## Contributing as code

### Prerequisites

0. [Choose an issue about bug or feature you want to work on](https://github.com/suspensive/react/issues)
1. Clone the repository
    ```shell
    git clone git@github.com:suspensive/react.git
    ```
2. Install relative packages. [We use pnpm v8. Install it please if need](https://pnpm.io/installation)
    ```shell
    pnpm install
    ```

### Pull Requests

> [Opening a pull request](https://github.com/suspensive/react/pulls)

All commit message and title of your Pull Request should match the following format:

```
<type>[optional package scope]: <description>

[optional body]

[optional footer(s)]
```

> We adhere [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). We check your commits on pre-commit(git-hook) by husky with our rules. please follow it.

Several predefined GitHub Workflows will check qualities. If you fail our checks, please check the error message and update the Pull Request.
