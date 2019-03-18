## 如何贡献

我们非常欢迎您的贡献和加入，无论是微不足道的清理或大的新功能。我们希望为每个编程语言提供高质量、有良好文档的代码。

这也不是代码是唯一有贡献项目的方式。我们非常重视文档、与其他项目的集成，并欣然接受这些方面的改进。

联系
gitter https://gitter.im/alibaba/nacos


#### 邮件列表

邮件列表是讨论与Dubbo相关的几乎所有内容的推荐方式。有关如何订阅的详细文档，请参阅此[指南](https://github.com/apache/incubator-dubbo/wiki/Mailing-list-subscription-guide)。

- <a href="mailto:dev-nacos%2Bsubscribe@googlegroups.com">dev-nacos@googlegroups.com</a>：开发邮件列表，如果您在使用或开发Nacos时遇到任何问题，可以在此处提问。
- <a href="mailto:commits-nacos%2Bsubscribe@googlegroups.com">commits-nacos@googlegroups.com</a>：所有提交都将发送到此邮件列表。如果您对Nacos的开发感兴趣，可以订阅它。
- <a href="mailto:users-nacos%2Bsubscribe@googlegroups.com">users-nacos@googlegroups.com</a>：所有Github [issues](https://github.com/alibaba/nacos/issues)更新和[pull request]（https://github.com/alibaba/nacos/pulls)更新将发送到此邮件列表。

- 有任何问题可以联系<a href="mailto:nacos_dev@linux.alibaba.com">nacos_dev@linux.alibaba.com</a>。
#### 贡献流程
这是贡献者的工作流程的大致轮廓：

fork当前存储github库。
创建一个分支，作为贡献的基础。 这通常是master分支。
做出一些变更提交。
确保提交消息的格式正确（见下文）。
推送变更到你的fork仓库中。
按照拉取请求模板中的清单进行操作
在发送拉取请求之前，请将您的fork仓库与远程存储库同步。 这将使您的拉取请求变得简单明了。 见下面的指南：
```
git remote add upstream git@github.com:alibaba/nacos.git
git fetch upstream
git rebase upstream/master
git checkout -b your_awesome_patch
... add some work
git push origin your_awesome_patch
```
提交pull request 到 alibaba/nacos，等待回复。如果回复的慢，请无情的催促。
## 贡献代码

请提交代码时候，检查以下内容：

#### 如果变化不大，请编写一些覆盖新功能的单元测试。

#### 如果你正在引入一个全新的特性或API，那么首先启动wiki并在基本设计上达成共识，再开始投入。

#### 我们的工作是及时跟进补丁。如果我们没有及时跟进，请无情的催促我们。



## 成为贡献者

We are always interested in adding new contributors. What we look for are series of contributions, good taste and ongoing interest in the project. If you are interested in becoming a committer, please let one of the existing committers know and they can help you walk through the process.

Nowadays,we have several important contribution points:


我们会积极纳入新的贡献者。我们更关注的是一系列的持续贡献，良好的品味和对项目维护的持续兴趣。如果你想成为一个提交者（Committer），请让一个现有的提交者(Committer)知道，他们会帮助你通过贡献加入我们。

现在，我们有几个重要的贡献点：
#### Wiki & JavaDoc
#### Nacos Console
#### Nacos SDK(C++\.Net\Php\Python\Go\Node.js)

##### 前提
如果你想贡献以上的项，请你必须遵守我们的一些先决条件：

###### 可读性，一个API必须具有JavaDoc，一些非常重要的方法也必须有JavaDoc。

###### 可测性，关于测试过程的单元测试覆盖率（80%）

###### 可维护性，可满足我们的[PMD spec](style/codeStyle.xml)，以及至少3个月的更新频率

###### 可部署性，我们可以鼓励您部署到[maven repository](http://search.maven.org/)
 
