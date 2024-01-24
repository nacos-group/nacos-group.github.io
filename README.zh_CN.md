# Nacos 官方网站

该项目保留了用于构建 [Nacos](https://github.com/alibaba/nacos)官方网站的所有资源，该网站服务于http://nacos.io。

# README.md同时有以下语言的版本

- en [English](README.md)
- zh_CN [简体中文](README.zh_CN.md)

## 构建指令

1. 在 `npm i` 根目录中运行以安装依赖项。
2. 在根目录下运行 `npm run dev` 启动本地服务器，您将在“http://localhost:4321/”中看到网站。
3. 运行 `npm run build` 以构建源代码。

## 版本要求

Node.js 版本 >= 18.14.1

## 如何贡献

1. 首先创建一个问题来描述问题
2. 不要用于`git add .`提交所有更改。
3. 只需推送更改的文件，例如：
    * `*.md`
    * _sidebar.json
4. 向`master`分支发送 PR。

## 搜索引擎优化（SEO）

确保每个 .md 以以下文本开头：

```
---
title: title
keywords: [keywords1,keywords2,keywords3]
description: some description
sidebar:
    order: Article table of contents order(optional)
---
```

参考[这篇博客](src/content/docs/latest/en/what-is-nacos)

**注意：**
1. 'title'不能包含'：'
2. 'keywords' 必须是 'Array'

## 添加新文档指南

### 添加新文档

1. 在`docs/en`或`docs/zh-cn`下添加新的 `.md` 文件。
2. 更新 `_sidebar.json` ，在 en 或 zh-cn 博客中添加新目录。
3. 推送拉取请求仅包含 `.md` 和 `_sidebar.json`。

## 👀 想了解更多吗？

查看 [Starlight的文档](https://starlight.astro.build/), 阅读 [ Astro文档 ](https://docs.astro.build)，或跳转到 [Astro Discord 服务器](https://astro.build/chat).
