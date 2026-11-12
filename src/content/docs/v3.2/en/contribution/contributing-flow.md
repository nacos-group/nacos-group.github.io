---
title: Contributing Flow
keywords: [Contributing,Source Code]
description: This contribution flow is applicable to all Nacos community content, including but not limited to Nacos, Nacos wiki/doc, Nacos SDK.
sidebar:
    order: 2
---

# Nacos Contributing Flow

This contribution flow is applicable to all Nacos community content, including but not limited to `Nacos`, `Nacos wiki/doc`, `Nacos SDK`.

The following use contributing `Nacos` as an example to explain the contribution flow in detail.

## 1. Fork Alibaba/Nacos repository to your Github.

## 2. Clone your fork Nacos repository to local.

```
git clone ${your fork nacos repo address}

cd nacos
```

## 3. Add Alibaba/Nacos repository as upstream repo.

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

## 4. Choose a basic branch of development usually upstream/develop,and create a new branch based on it.

```
(checkout branch from remote repo to local）
git checkout -b upstream-develop upstream/develop

(Create a development branch from the local branch, usually using the issue number as the development branch name）
git checkout -b develop-issue#${issue-number}

```

## 5. Do your change in your local develop branch.

First please make sure you read and set the `Nacos code style` correctly, please read the related content [Code of Conduct](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md).

When making changes, please ensure that the changes on this branch are **only relevant to the issue**, and try to be as small as possible, so that **only one thing is modified in one branch, and only one thing is modified in one PR**.

At the same time, please use your English description as much as possible for your commits. It is mainly described by **predicate + object**, such as: `Fix xxx problem/bug`.

Some simple commits can be described using `For xxx`, such as: `For codestyle`. 

If the commits is related to an ISSUE, you can add the ISSUE number as a prefix, such as: `For #10000, Fix xxx problem/bug`.

## 6. Rebase develop branch

When you make changes, other people's changes may have commited and merged. At this time, there may be conflicts. Please use the rebase command to merge and resolve. There are two main benefits:

1. Your submission record will be very clean, without the words `Merge xxxx branch`.
2. After rebase, the commit log of your branch is also a single chain, it is easier to check back.

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

**If you are using Intellij IDEA**, it is recommended to use the IDE version control, which has a more convenient visual panel to resolve conflicts and squash operations.

## 7. Push your develop branch to your fork repository.

```
git push origin develop-issue#${issue-number}
```

## 8. Create Pull Request according to the pull request template

[pull request template](./pull-request.md)

The Nacos community will review your Pull Request and may propose comments.

You can return to step 5 to modify code according to the comments and use step 6 to resubmit.

**If you are prompted that there are conflicts when you push to fork repo again, Force push to your fork branch will be ok.** The reason of conflicts is that the commit ID has changed after you rebase with others changes.


## 9. If no more problem, Nacos community will merge your PR. Congratulations for you becoming a official contributor of Nacos.

