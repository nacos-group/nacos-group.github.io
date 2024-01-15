---
title: How to Contribute
keywords: [contribute,code]
description: We are always very happy to have contributions, whether for trivial cleanups or big new features.
sidebar:
    order: 1
---

# How to Contribute

Nacos is released under the non-restrictive Apache 2.0 license, and follows a very standard Github development process, using Github tracker for issues and merging pull requests into master. If you want to contribute even something trivial, please do not hesitate, but follow the guidelines below.

We are always very happy to have contributions, whether for trivial cleanups or big new features.
We want to have high quality, well documented codes for each programming language.

Nor is code the only way to contribute to the project. We strongly value documentation, integration with other project, and gladly accept improvements for these aspects.

## Contact us

##### Nacos Gitter- [https://gitter.im/alibaba/nacos](https://gitter.im/alibaba/nacos)
##### Nacos weibo- [https://weibo.com/u/6574374908](https://weibo.com/u/6574374908)
##### Nacos segmentfault- [https://segmentfault.com/t/nacos](https://segmentfault.com/t/nacos)

#### Mailing list

Mailing list is recommended for discussing almost anything related to Nacos. Please refer to this?[guide](https://github.com/apache/incubator-dubbo/wiki/Mailing-list-subscription-guide)?for detailed documentation on how to subscribe to our mailing lists.

* [dev-nacos@googlegroups.com](mailto:dev-nacos%2Bsubscribe@googlegroups.com): The develop mailing list. You can ask questions here if you encounter any problem when using or developing Nacos.
* [commits-nacos@googlegroups.com](mailto:commits-nacos%2Bsubscribe@googlegroups.com): All commits will be sent to this mailing list. You can subscribe to it if you are interested in Nacos' development.
* [users-nacos@googlegroups.com](mailto:users-nacos%2Bsubscribe@googlegroups.com): All Github?[issue](https://github.com/alibaba/nacos/issues)?updates and?[pull request](https://github.com/alibaba/nacos/pulls)?updates will be sent to this mailing list.
* [nacos_dev@linux.alibaba.com](mailto:nacos_dev@linux.alibaba.com).

## Contributing Code

### Notice

To submit a change for inclusion, please do the following:

#### Read Nacos [Code of Conduct](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md), and make sure your IDE has set code style and install plugin.

#### If the change is non-trivial, please include unit tests that cover the new functionality.

#### If you are introducing a completely new feature or API, it is a good idea to start a wiki and get consensus on the basic design first.

### Contribution flow

This is a rough outline of what a contributor's workflow looks like:

* Fork the current repository.
* Create a topic branch from where to base the contribution. This is usually the master branch.
* Make commits of logical units.
* Make sure commit messages are in the proper format (see below).
* Push changes in a topic branch to your forked repository.
* Follow the checklist in the [pull request template](./pull-request.md).
* Before you send the pull request, please sync your forked repository with remote repository. This will make your pull request simple and clear. See guide below:
```
git remote add upstream git@github.com:alibaba/nacos.git
git fetch upstream
git rebase upstream/master
git checkout -b your_awesome_patch
... add some work
git push origin your_awesome_patch
```
* Submit a pull request to alibaba/nacos and wait for reply.

* Detail contribution flow see [Contribution Flow](./contributing-flow.md)

Thanks for contributing!

## Contributing Document

### Notice

When contributing documents, please confirm and check the following:

#### Has been confirmed that the document is indeed wrong or missing.

#### Familiar with [Markdown](https://www.markdownguide.org/getting-started)

#### Familiar with [docsite](https://github.com/txd-team/docsite), at least be able to complete local debugging according to the [document README.md](https://github.com/nacos-group/nacos-group.github.io).

## Becoming a Committer

We are always interested in adding new contributors. What we look for are series of contributions, good taste and ongoing interest in the project. If you are interested in becoming a committer, please let one of the existing committers know and they can help you walk through the process.

Nowadays, we have several important contribution points:

#### Wiki & JavaDoc
#### Nacos Console
#### Nacos SDK(C++\.Net\PHP\Python\Go\Node.js)

#### Prerequisites

If you want to contribute to the above listing points, you must abide by the prerequisites listed below:

##### Readability - APIs as well as important methods must have Javadoc.

##### Testability - Ensure over 80% unit test coverage for main processes.

##### Maintainability - Comply with our [Code of Conduct](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md), with an update frequency at least once every 3 months.

##### Deployability - We encourage you to deploy into [maven repository](http://search.maven.org/).
