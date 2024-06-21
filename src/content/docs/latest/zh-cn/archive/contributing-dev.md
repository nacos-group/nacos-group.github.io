---
title: 为 Nacos 做贡献
keywords: [Nacos, 贡献, 行为守则, GitHub, Pull Request, 社区角色, Committer]
description: 欢迎来到Nacos！本文档是关于如何为Nacos做出贡献的指南。
---

# 为 Nacos 做贡献

欢迎来到Nacos！本文档是关于如何为Nacos做出贡献的指南。

如果您发现不正确或遗失的内容，请留下意见/建议。

## 开始之前

### 行为守则

请务必阅读并遵守我们的[行为准则](https://github.com/alibaba/nacos/blob/master/CODE_OF_CONDUCT.md)。

## 贡献和Nacos社区构成

Nacos欢迎任何角色的新参与者，包括用户，贡献者，提交者和PMC。

![](http://acm-public.oss-cn-hangzhou.aliyuncs.com/contributor_definition.png)


我们鼓励新来者积极参与Nacos社区，社区有一套机制可以使您，从用户角色到提交者角色，甚至是PMC角色。为了实现这一目标，新来者需要积极参与Nacos社区。以下段落介绍了如何为Nacos做出贡献并且晋升社区角色。

#### 打开/提取准备问题

如果您在文档中发现拼写错误，在代码中发现错误，或想要新功能或想要提供建议，您可以[在GitHub上打开一个问题](https://github.com/alibaba/Nacos/issues/new)报告。

如果您想开始着手，可以选择github仓库中有以下标签的issues。
    

 -  [good first issue](https://github.com/alibaba/nacos/labels/good%20first%20issue)：对于新手来说是非常好的入门issues。
 
 -  [contribution welcome](https://github.com/alibaba/nacos/labels/contribution%20欢迎)：非常需要解决的问题和非常重要的模块，但目前缺少贡献者，欢迎贡献者来贡献。

    

我们非常重视文档以及与Spring Cloud，Kubernetes，Dubbo等其他项目的集成。我们很希望能够就这些方面的任何问题进行研究。

请注意，任何PR（Pull Request）必须与有效issues相关联。否则PR将被打回。

#### 开始你的贡献

现在，如果您想贡献，请创建一个新的拉取请求。

我们使用`develop`分支作为开发分支，这表明这是一个不稳定的分支。

此外，我们的分支模型符合[https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model)。我们强烈建议新成员在创建PR之前完成上述文章。

现在，如果您准备创建PR，这里是贡献者的工作流程：

1. fork Nacos仓库到你的github仓库
    
2. 克隆fork到本地仓库
    
3. 创建一个新分支并进行处理
    
4. 保持分支同步
    
5. 提交您的更改（确保您的提交消息简明扼要）
    
6. 将提交推送到你的github远程仓库
    
7. 创建一个指向**开发**分支的Pull Request
    

创建Pull Request时：

1. 请遵循[拉取请求模板](https://github.com/alibaba/nacos/blob/master/.github/PULL_REQUEST_TEMPLATE.md)。
    
2. 请创建**开发**分支的请求。
    
3. 请确保PR有相应的问题。
    
4. 如果您的PR包含大量更改，例如组件重构或新组件，请写下有关其设计和使用的详细文档。
    
5. 请注意，单个PR不应该太大。如果需要进行大量更改，最好将更改分成几个单独的PR。
    
6. 创建PR后，将为拉取请求分配一个或多个审阅者。
    
7. 在合并PR之前，请注意合并提交节点（git commit），包括修复审核反馈，拼写错误，合并。最终提交消息应该清晰简洁。
    

如果您的PR包含大量更改，例如组件重构或新组件，请写下有关其设计和使用的详细文档。

### 代码审查指南

提交者将轮流审查代码，以确保在合并之前及时审核所有PR以及至少一个提交者。如果我们不做我们的工作（有时我们放弃的东西）。和往常一样，我们欢迎志愿者进行代码审查。

一些原则：

 - 可读性 - 重要的代码应该有详细记录。 API应该有Javadoc。代码样式应符合现有代码样式。
    
 - 优雅：新功能，类或组件应精心设计。
    
 - 可测试性 - 单元测试用例应涵盖80％的新代码。
    
 - 可维护性 - 遵守我们的[代码规约](https://github.com/alibaba/nacos/blob/master/style/codeStyle.md) ，至少应保持3个月的频率更新。
    

### 现在尝试成为一个Committer怎么样？

一般来说，贡献8个非平凡的补丁并让至少三个不同的人来审查它们（你需要三个人来支持你）。然后请别人提名你。你正在展示你的：

 - 至少8个PR以及与项目相关的问题，
    
 - 与团队协作的能力，
    
 - 了解项目的代码库和编码风格，
    
 - 编写优秀代码的能力（并非最不重要）
    

当前的提交者通过标签“提名”在Nacos issues里边，让社区了解

 - 你的名字和姓氏
    
 - 指向您的Git个人资料的链接
    
 - 解释为什么你应该成为一名提交者，
    
 - 详细说明您提交的前三的PR和相关issues

![](http://acm-public.oss-cn-hangzhou.aliyuncs.com/nomination_process.png)
