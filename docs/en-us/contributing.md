## How to Contribute

Nacos is released under the non-restrictive Apache 2.0 license, and follows a very standard Github development process, using Github tracker for issues and merging pull requests into master. If you want to contribute even something trivial, please do not hesitate, but follow the guidelines below.

We are always very happy to have contributions, whether for trivial cleanups or big new features.
We want to have high quality, well documented codes for each programming language.

Nor is code the only way to contribute to the project. We strongly value documentation, integration with other project, and gladly accept improvements for these aspects.

### Contact

#### Gitter
https://gitter.im/alibaba/nacos


#### Mailing list

Mailing list is recommended for discussing almost anything related to Nacos. Please refer to this [guide](https://github.com/apache/incubator-dubbo/wiki/Mailing-list-subscription-guide) for detailed documentation on how to subscribe to mailing lists.

- [dev-nacos@googlegroups.com](mailto:dev-nacos+subscribe@googlegroups.comg): The develop mailing list. You can ask questions here if you encounter any problem when using or developing Nacos.
- [commits-nacos@googlegroups.com](mailto:commits+nacos-subscribe@googlegroups.com): All commits will be sent to this mailing list. You can subscribe to it if you are interested in Nacos's development.
- [users-nacos@googlegroups.com](mailto:users-nacos+subscribe@googlegroups.com): All  Github [issues](https://github.com/alibaba/nacos/issues) updates and [pull request](https://github.com/alibaba/nacos/pulls) updates will be sent to this mailing list.

- If you have any questions, please contact [nacos_dev@linux.alibaba.com](mailto:nacos_dev@linux.alibaba.com).

## Contribution flow

This is a rough outline of what a contributor's workflow looks like:

* Fork the current repository.
* Create a topic branch from where to base the contribution. This is usually the master branch.
* Make commits of logical units.
* Make sure commit messages are in the proper format (see below).
* Push changes in a topic branch to your forked repository.
* Follow the checklist in the [pull request template](https://lark.alipay.com/nacos/nacosdocs/askodu)
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

Thanks for contributing!

## Contributing Code

To submit a change for inclusion, please do the following:

#### If the change is non-trivial, please include unit tests that cover the new functionality.
#### If you are introducing a completely new feature or API, it is a good idea to start a wiki and get consensus on the basic design first.
#### It is our job to follow up on patches in a timely fashion. Nag us if we aren't doing our job (sometimes we drop things).

## Becoming a Committer

We are always interested in adding new contributors. What we look for are series of contributions, good taste and ongoing interest in the project. If you are interested in becoming a committer, please let one of the existing committers know and they can help you walk through the process.

Nowadays, we have several important contribution points:
#### Wiki & JavaDoc
#### Nacos Console
#### Nacos SDK(C++\.Net\PHP\Python\Go\Node.js)

##### Prerequisites
If you want to contribute to the above listing points, you must abide by the prerequisites listed below.

###### Readability - APIs as well as important methods must have Javadoc.
###### Testability - Ensure over 80% unit test coverage for main processes.
###### Maintainability - Comply with our [PMD spec](style/codeStyle.xml), with an update frequency at least once every 3 months.
###### Deployability - We encourage you to deploy into [maven repository](http://search.maven.org/).
