# Contributing to Suspensive libraries

We welcome contribution from everyone in the community. <br/>
All communications in this repo will be by English.

> Every contributor to Suspensive libraries should adhere to our Code of Conduct.
> <br/>Please read the [full text](./CODE_OF_CONDUCT.md) to understand what actions will and will not be tolerated.

# Instructions for Logging Issues

## 1. Search for Duplicates

[Search the existing issues](https://github.com/suspensive/react/issues) before logging a new one.

Some search tips:

- _Don't_ restrict your search to only open issues. An issue with a title similar to yours may have been closed as a duplicate of one with a less-findable title.
- Check for synonyms. For example, if your bug involves an interface, it likely also occurs with type aliases or classes.
- Search for the title of the issue you're about to log. This sounds obvious but 80% of the time this is sufficient to find a duplicate when one exists.
- Read more than the first page of results. Many bugs here use the same words so relevancy sorting is not particularly strong.
- If you have a crash, search for the first few topmost function names shown in the call stack.

## 2. Do you have a question?

The issue tracker is for **issues**, in other words, bugs and suggestions.
If you have a _question_, please use [Stack Overflow](https://stackoverflow.com/questions/tagged/suspensive), your favorite search engine, or other resources.

## 3. Did you find a bug?

When logging a bug, please be sure to include the following:

- What version of TypeScript you're using (run `tsc --v`)
- If at all possible, an _isolated_ way to reproduce the behavior
- The behavior you expect to see, and the actual behavior

## 4. Do you have a suggestion?

We also accept suggestions in the [issue tracker](https://github.com/suspensive/react/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=%5BFeature%5D%3A).

In general, things we find useful when reviewing suggestions are:

- A description of the problem you're trying to solve
- An overview of the suggested solution

# Instructions for Contributing Code

## What You'll Need

0. [A bug or feature you want to work on](https://github.com/suspensive/react/labels/help%20wanted)
1. clone the repository `git clone git@github.com:suspensive/react.git`
2. install relative packages `pnpm install`

## Pull Requests

> [Opening a pull request](https://github.com/suspensive/react/compare) <br/>

You can raise your own PR. The title of your PR should match the following format:

```
<type>[package scope]: <description>
```

> We do not care about the number, or style of branch in your history <br/>
> We adhere [commit-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) you didn't adhere this rule you can't commit by pre-commit script <br/>
> Feel free to commit in whatever style you feel comfortable with.

When you create a Pull Request, several predefined test pipelines work. If you fail, please check the error message and update the PR.
