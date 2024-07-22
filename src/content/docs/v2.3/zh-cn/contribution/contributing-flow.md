---
title: 贡献流程
keywords: [Nacos, 贡献流程, 源码, GitHub, 社区贡献, Pull Request, Rebase]
description: 本文详细介绍了向Nacos社区贡献代码的标准化流程，包括如何Fork项目、克隆代码、设置上游仓库、创建开发分支、遵循代码规范、Rebase解决冲突、推送更改及创建Pull Request，旨在帮助新贡献者顺利参与Nacos开源项目。
sidebar:
    order: 2
---

# Nacos 贡献流程

此贡献流程适用于所有的Nacos社区内容，包括但不限于`Nacos`、`Nacos wiki/doc`、`Nacos SDK`。

以下以贡献`Nacos`为例，详细说明贡献流程。

## 1. fork Alibaba/Nacos 项目到您的github库

## 2. 克隆或下载您fork的Nacos代码仓库到您本地

```
git clone ${your fork nacos repo address}

cd nacos
```

## 3. 添加Alibaba/Nacos仓库为upstream仓库

```
git remote add upstream https://github.com/alibaba/nacos.git

git remote -v 

    origin	   ${your fork nacos repo address} (fetch)
    origin	   ${your fork nacos repo address} (push)
    upstream	https://github.com/alibaba/nacos.git (fetch)
    upstream	https://github.com/alibaba/nacos.git (push)
    
git fetch origin
git fetch upstream
```

## 4. 选择一个开发的基础分支，通常是upstream/develop，并基于此创建一个新的分支

```
(从远程仓库拉取分支到本地）
git checkout -b upstream-develop upstream/develop

(从本地分支创建开发分支, 通常以该PR对应的issue号作为开发分支名）
git checkout -b develop-issue#${issue-number}

```

## 5. 在本地新建的开发分支上进行各种修改

首先请保证您阅读并正确设置`Nacos code style`, 相关内容请阅读[Nacos 代码规约](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md) 。

修改时请保证该分支上的修改**仅和issue相关**，并尽量细化，做到**一个分支只修改一件事，一个PR只修改一件事**。

同时，您的提交记录请尽量使用英文描述，主要以**谓 + 宾**进行描述，如：`Fix xxx problem/bug`。少量简单的提交可以使用`For xxx`来描述，如：`For codestyle`。 如果该提交和某个ISSUE相关，可以添加ISSUE号作为前缀，如：`For #10000, Fix xxx problem/bug`。

## 6. Rebase 基础分支和开发分支

您修改的时候，可能别人的修改已经提交并被合并，此时可能会有冲突，这里请使用rebase命令进行合并解决，主要有2个好处：

1. 您的提交记录将会非常优雅，不会出现`Merge xxxx branch` 等字样
2. rebase后您分支的提交日志也是一条单链，基本不会出现各种分支交错的情况，回查时更轻松

```
git fetch upstream

git rebase -i upstream/develop

```

OR

```
git checkout upstream-develop
git pull 
git checkout develop-issue#${issue-number}
git rebase -i upstream-develop
```

**如果您使用的是Intellij IDEA**，建议使用IDE的版本管理模块，有可视化界面，更方便解决冲突和squash操作

## 7. 将您开发完成rebase后的分支，上传到您fork的仓库

```
git push origin develop-issue#${issue-number}
```

## 8. 按照拉取请求模板中的清单创建Pull Request

[拉取请求模板](./pull-request.md)

Nacos社区将会Review您的Pull Request，并可能提出修改意见，您可以根据修改意见回到步骤5进行修改，并使用步骤6进行重新提交。

**如果您再次提交时提示您存在提交记录冲突，这是因为您修改期间，有其他的修改合并到了基础分支，您rebase后，commit ID发生了变化，此时需要force push 到您的fork分支上即可**

## 9. 如果没有问题，Nacos社区将会把您的修改合并到基础分支中，恭喜您成为Nacos的官方贡献者。

