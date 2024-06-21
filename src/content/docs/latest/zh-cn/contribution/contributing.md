---
title: 如何贡献
keywords: [贡献, 源码, Nacos, 代码规约, 文档, 提交者, 拉取请求]
description: 本文详细介绍了如何向Nacos项目贡献代码和文档，包括联系项目团队、遵循代码规范、贡献流程、文档编辑要求以及成为提交者的路径，强调了持续贡献、代码质量与项目参与的重要性。
sidebar:
    order: 1
---

# 如何贡献

我们非常欢迎您的贡献和加入，无论是微不足道的清理或大的新功能。我们希望为每个编程语言提供高质量、有良好文档的代码。

这也不是代码是唯一有贡献项目的方式。我们非常重视文档、与其他项目的集成，并欣然接受这些方面的改进。

## 联系我们

#### Nacos Gitter-[https://gitter.im/alibaba/nacos](https://gitter.im/alibaba/nacos)
#### Nacos 微博-[https://weibo.com/u/6574374908](https://weibo.com/u/6574374908)
#### Nacos segmentfault-[https://segmentfault.com/t/nacos](https://segmentfault.com/t/nacos)

#### 邮件列表

邮件列表建议讨论任何与Nacos有关的事情。具体请看[参考手册](https://github.com/apache/incubator-dubbo/wiki/Mailing-list-subscription-guide)描述如何订阅我们的邮件列表。

* [dev-nacos@googlegroups.com](https://lark.alipay.com/nacos/nacosdocs/vl19q1): 开发邮件列表。如果你在使用或开发Nacos中遇到任何问题,可以在这里提问题。
* [commits-nacos@googlegroups.com](https://lark.alipay.com/nacos/nacosdocs/vl19q1): 所有提交将被发送到这个邮件列表。如果你有兴趣Nacos的发展，你可以订阅它。
* [users-nacos@googlegroups.com](https://lark.alipay.com/nacos/nacosdocs/vl19q1): 在Github中[提问题](https://github.com/alibaba/nacos/issues)、更新和[提交需求](https://github.com/alibaba/nacos/pulls)将被发送到这个邮件列表。
* [nacos\_dev@linux.alibaba.com](https://lark.alipay.com/nacos/nacosdocs/vl19q1).

## 贡献代码

### 贡献代码须知

请贡献代码时候，请先确认和检查以下内容：

#### 阅读Nacos[代码规约](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md) ，并根据指引设置IDE的codeStyle及校验插件。

#### 如果变化不大，请编写一些覆盖新功能的单元测试。

#### 如果你正在引入一个全新的特性或API，那么首先启动wiki并在基本设计上达成共识，再开始投入。

### 贡献流程

这是贡献者的大致工作流程：

* fork当前存储github库。
* 创建一个分支，作为贡献的基础，这通常是develop分支。
* 做出一些变更提交。
* 确保提交消息的格式正确（见下文）。
* 推送变更到你的fork仓库中。
* 按照[拉取请求模板](./pull-request.md)中的清单进行操作。
* 在发送拉取请求之前，请将您的fork仓库与远程存储库同步，这将使您的拉取请求变得简单明了。详情见下面的指南：
```
git remote add upstream git@github.com:alibaba/nacos.git
git fetch upstream
git rebase upstream/master
git checkout -b your_awesome_patch
... add some work
git push origin your_awesome_patch
```
* 提交pull request 到 alibaba/nacos，等待回复。如果回复的慢，请无情的催促。

* 详细的贡献流程可参考[贡献流程](./contributing-flow.md)

## 贡献文档

### 贡献文档须知

请贡献文档时候，请先确认和检查以下内容：

#### 已确认过文档确实有误或存在缺失。

#### 熟悉[Markdown](https://www.markdownguide.org/getting-started) 。

#### 熟悉[docsite](https://github.com/txd-team/docsite) ，至少能够根据[官方文档README.md](https://github.com/nacos-group/nacos-group.github.io) 的引导完成本地调试

### 贡献流程

可参考[贡献流程](./contributing-flow.md)

## 成为提交者

我们会积极纳入新的贡献者。我们更关注的是一系列的持续贡献，良好的品味和对项目维护的持续兴趣。如果你想成为一个提交者（Committer），请让一个现有的提交者(Committer)知道，他们会帮助你通过贡献加入我们。

现在，我们有几个重要的贡献点：

#### Wiki & JavaDoc
#### Nacos Console
#### Nacos SDK(C++\.Net\Php\Python\Go\Node.js)

#### 前提

如果你想贡献以上的项，请你必须遵守我们的一些先决条件：

##### 可读性，一个API必须具有JavaDoc，一些非常重要的方法也必须有JavaDoc。

##### 可测性，关于测试过程的单元测试覆盖率（80%）

##### 可维护性，可满足我们的[代码规约](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md) ，以及至少3个月的更新频率

##### 可部署性，我们可以鼓励您部署到[maven repository](http://search.maven.org/)
