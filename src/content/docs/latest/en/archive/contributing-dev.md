---
title: Contributing to Nacos
keywords: [Nacos, Contribution, Code of Conduct, GitHub, Pull Request, Community Roles, Committer]
description: This guide outlines the steps for contributing to the Nacos project, from adhering to the code of conduct, submitting issues, engaging in the development workflow, understanding code review standards, to becoming a Committer.
---
# Contributing to Nacos
Welcome to Nacos! This document serves as a guide on how to contribute to Nacos.

If you spot inaccuracies or missing content, please leave feedback and suggestions.

## Before You Begin

### Code of Conduct

Ensure you read and abide by our [Code of Conduct](https://github.com/alibaba/nacos/blob/master/CODE_OF_CONDUCT.md).

## Contributions and the Nacos Community Structure

Nacos warmly welcomes new participants in any role, including users, contributors, committers, and PMC members.

![Contributor Definition](http://acm-public.oss-cn-hangzhou.aliyuncs.com/contributor_definition.png)

We encourage newcomers to actively engage in the Nacos community, which has mechanisms in place to facilitate progression from a user role to a committer or even a PMC role. To achieve this, newcomers must actively participate in the Nacos community. The following paragraphs outline how to contribute to Nacos and advance within the community.

#### Reporting Issues

If you find typos in the documentation, errors in the code, desire new features, or wish to offer suggestions, you can [open an issue on GitHub](https://github.com/alibaba/Nacos/issues/new) to report them.

If you're eager to get started, consider issues labeled in our GitHub repository:
- [good first issue](https://github.com/alibaba/nacos/labels/good%20first%20issue): Ideal entry points for beginners.
- [contribution welcome](https://github.com/alibaba/nacos/labels/contribution%20welcome): Critical issues or important modules needing attention and contributions.

We highly value documentation and integrations with projects like Spring Cloud, Kubernetes, Dubbo, etc. Research into these areas is greatly appreciated.

Note that any PR (Pull Request) must be associated with a valid issue; otherwise, the PR will be rejected.

#### Starting Your Contribution

To contribute, create a new pull request.

Our `develop` branch serves as the development branch, indicating instability.

Moreover, our branching model adheres to [https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model). We strongly advise new members to review this article before creating a PR.

When ready, follow this workflow:

1. Fork the Nacos repository to your GitHub account.
2. Clone the forked repository locally.
3. Create a new branch and make changes.
4. Keep your branch synchronized.
5. Commit your changes (ensuring commit messages are concise).
6. Push your commits to your GitHub remote repository.
7. Initiate a Pull Request targeting the **develop** branch.

When creating a PR:

1. Adhere to the [Pull Request template](https://github.com/alibaba/nacos/blob/master/.github/PULL_REQUEST_TEMPLATE.md).
2. Direct the PR to the **develop** branch.
3. Ensure the PR links to a corresponding issue.
4. If your PR involves substantial changes such as component refactoring or new components, document their design and usage thoroughly.
5. Avoid overly large PRs; split extensive changes into several smaller PRs if necessary.
6. After creating a PR, reviewers will be assigned.
7. Prior to merging, pay attention to the commit nodes, including addressing review feedback, typos, merges. The final commit message should be clear and concise.

### Code Review Guidelines

Committers rotate reviewing code to ensure timely review of all PRs by at least one committer. If we fall short (which happens occasionally), we welcome volunteers for code reviews.

Key principles include readability, elegance, testability, and maintainability, adhering to our [coding conventions](https://github.com/alibaba/nacos/blob/master/style/codeStyle.md), with updates maintained at least every three months.

### Becoming a Committer

Typically, by contributing eight non-trivial patches and having at least three different individuals review them (indicating community support), you may then request nomination. Demonstrate:

- At least eight PRs and related issues,
- Collaborative skills with the team,
- Familiarity with the project's codebase and coding style,
- Ability to write high-quality code.

Current committers nominate via Nacos issues, sharing:
- Your full name,
- A link to your Git profile,
- Explanation for your suitability as a Committer,
- Highlighting your top three PRs and related issues.

![Nomination Process](http://acm-public.oss-cn-hangzhou.aliyuncs.com/nomination_process.png)