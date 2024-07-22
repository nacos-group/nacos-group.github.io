---
title: How to Contribute
keywords: [Contribution, Source Code]
description: We warmly welcome your contributions and participation, whether it's minor cleanups or major new features.
sidebar:
    order: 1
---

# How to Contribute

We warmly welcome your contributions and involvement, be it trivial cleanups or substantial new features. Our aim is to provide high-quality, well-documented code for every programming language.

Code isn't the only way to contribute to the project. We highly value improvements in documentation, integration with other projects, and gladly accept enhancements in these areas.

## Reach Out to Us

#### Nacos Gitter - [https://gitter.im/alibaba/nacos](https://gitter.im/alibaba/nacos)
#### Nacos Weibo - [https://weibo.com/u/6574374908](https://weibo.com/u/6574374908)
#### Nacos SegmentFault - [https://segmentfault.com/t/nacos](https://segmentfault.com/t/nacos)

#### Mailing List

The mailing list is recommended for discussing anything related to Nacos. Refer to the [Reference Manual](https://github.com/apache/incubator-dubbo/wiki/Mailing-list-subscription-guide) for instructions on subscribing to our mailing lists.

- [dev-nacos@googlegroups.com](https://lark.alipay.com/nacos/nacosdocs/vl19q1): Development mailing list. If you encounter any issues while using or developing Nacos, feel free to ask here.
- [commits-nacos@googlegroups.com](https://lark.alipay.com/nacos/nacosdocs/vl19q1): All commits are sent to this mailing list. Subscribe if you're interested in Nacos' development.
- [users-nacos@googlegroups.com](https://lark.alipay.com/nacos/nacosdocs/vl19q1): Issues raised, updates, and [feature requests](https://github.com/alibaba/nacos/pulls) on Github are sent here.
- [nacos_dev@linux.alibaba.com](https://lark.alipay.com/nacos/nacosdocs/vl19q1).

## Contributing Code

### Guidelines for Contributing Code

Before contributing code, please confirm and check the following:

#### Read Nacos' [Coding Convention](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md) and set up your IDE's code style and validation plugins accordingly.

#### If changes are minor, write some unit tests that cover the new functionality.

#### If introducing a brand-new feature or API, initiate a wiki discussion and reach a consensus on the basic design before proceeding.

### Contribution Workflow

Here is a general workflow for contributors:

* Fork the current GitHub repository.
* Create a branch as the base for your contribution, typically the develop branch.
* Make some changes and commit them.
* Ensure commit messages follow the correct format (see below).
* Push your changes to your forked repository.
* Follow the checklist in the [Pull Request Template](./pull-request.md).
* Before submitting a pull request, sync your fork repository with the upstream one to simplify your pull request. Details are as follows:
```bash
git remote add upstream git@github.com:alibaba/nacos.git
git fetch upstream
git rebase upstream/master
git checkout -b your_awesome_patch
... add some work
git push origin your_awesome_patch
```
* Submit a pull request to alibaba/nacos and await feedback. If replies are slow, kindly remind us.

* For a detailed contribution process, refer to [Contribution Flow](./contributing-flow.md).

## Contributing Documentation

### Guidelines for Contributing Documentation

Before contributing documentation, please confirm and check the following:

#### Confirm that the documentation indeed contains errors or is missing information.

#### Familiarity with [Markdown](https://www.markdownguide.org/getting-started).

#### Familiarity with [docsite](https://github.com/txd-team/docsite), at least able to complete local debugging based on the [official documentation README.md](https://github.com/nacos-group/nacos-group.github.io).

### Contribution Workflow

Refer to [Contribution Flow](./contributing-flow.md).

## Becoming a Committer

We actively onboard new contributors. We prioritize a series of continuous contributions, good taste, and sustained interest in maintaining the project. If you wish to become a Committer, let an existing Committer know; they will assist you in joining through your contributions.

Currently, we have several key areas for contribution:

#### Wiki & JavaDoc
#### Nacos Console
#### Nacos SDK (C++, .Net, PHP, Python, Go, Node.js)

#### Prerequisites

If you wish to contribute to these areas, you must adhere to some prerequisites:

##### Readability – An API must have JavaDoc, and some crucial methods must also have JavaDoc.

##### Testability – Unit test coverage for the testing process should be at least 80%.

##### Maintainability – Must comply with our [Coding Convention](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md) and have an update frequency of at least once every three months.

##### Deployability – We encourage deployments to the [Maven Repository](http://search.maven.org/)