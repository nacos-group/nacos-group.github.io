---
title: Nacos Contribution Workflow
keywords: [Nacos, Contribution Process, Source Code, GitHub, Community Contribution, Pull Request, Rebase]
description: This contribution workflow is applicable to all Nacos community content, including but not limited to `Nacos`, `Nacos Wiki/Doc`, and `Nacos SDK`.
---

# Nacos Contribution Workflow

This contribution workflow is universal for all Nacos community content, encompassing elements like `Nacos`, `Nacos Wiki/Documentation`, and `Nacos SDK`.

Below, we use contributing to `Nacos` as an example to elaborate on the contribution process.

## 1. Fork the Alibaba/Nacos Project to Your GitHub Repository

## 2. Clone or Download the Forked Nacos Code Repository Locally

```shell
git clone ${your fork nacos repo address}

cd nacos
```

## 3. Add the Alibaba/Nacos Repository as the Upstream Repository

```shell
git remote add upstream https://github.com/alibaba/nacos.git

git remote -v 

    origin    ${your fork nacos repo address} (fetch)
    origin    ${your fork nacos repo address} (push)
    upstream  https://github.com/alibaba/nacos.git (fetch)
    upstream  https://github.com/alibaba/nacos.git (push)
    
git fetch origin
git fetch upstream
```

## 4. Choose a Development Base Branch, Typically upstream/develop, and Create a New Branch from It

```shell
# Fetch the branch from the remote repository to local
git checkout -b upstream-develop upstream/develop

# From the local branch, create a development branch, usually named after the related issue number
git checkout -b develop-issue#${issue-number}
```

## 5. Make Modifications on the Newly Created Local Development Branch

Before modifying, ensure you've read and set up the `Nacos Code Style`. Refer to [Nacos Coding Convention](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md).

When making changes, ensure they are **solely related to the issue** and as granular as possible, adhering to the principle of **one branch, one modification, one PR**.

Commit messages should primarily be in English, structured as **Verb + Object**, e.g., `Fix xxx problem/bug`. For minor adjustments, use `For xxx`, e.g., `For codestyle`. If the commit relates to a specific ISSUE, prefix it with the ISSUE number, e.g., `For #10000, Fix xxx problem/bug`.

## 6. Rebase the Base Branch with the Development Branch

During your modifications, others' changes might have been merged, potentially causing conflicts. Use the rebase command to resolve these, which benefits in two ways:

1. Your commit history will be clean, devoid of `Merge xxxx branch` entries.
2. After rebasing, your branch's commit log forms a single chain, simplifying traceback.

```shell
git fetch upstream

git rebase -i upstream/develop

```

OR

```shell
git checkout upstream-develop
git pull 
git checkout develop-issue#${issue-number}
git rebase -i upstream-develop
```

**For IntelliJ IDEA users**, the version control module provides a visual interface for conflict resolution and squashing operations.

## 7. Push Your Developed and Rebased Branch to Your Forked Repository

```shell
git push origin develop-issue#${issue-number}
```

## 8. Create a Pull Request Following the Pull Request Template

[Pull Request Template](./pull-request.md)

The Nacos community will review your Pull Request and may provide feedback for adjustments. You can return to step 5 for modifications and use step 6 to resubmit.

**If prompted about commit record conflicts upon resubmission, force push to your forked branch since your commit ID changed post-rebase due to new merges in the base branch.**

## 9. Once approved, your changes will be merged into the base branch, congratulating you on becoming an official Nacos contributor.