# Nacos 官方网站
此仓库包含 https://nacos.io 的所有网站材料

# README.md同时有以下语言的版本
- en [English](README.md)
- zh_CN [简体中文](README.zh_CN.md)

## Starlight Starter Kit: 基础知识

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

```

npm create astro@latest -- --template starlight
```

[![在StackBlitz中打开](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/starlight/tree/main/examples/basics)
[![使用CodeSandbox打开](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/starlight/tree/main/examples/basics)


### 快速开始

1. `npm install`

2. `npm run dev`

3. Visit
```
localhost:4321/
```

## 版本要求
Node.js version >=18.14.1

## 🚀 项目结构

在 Astro + Starlight 项目中，您将看到以下文件夹和文件：

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   ├── docs/
│   │   └── config.ts
│   └── env.d.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight 在目录中查找`.md`或`.mdx`文件 `src/content/docs/`。每个文件都根据其文件名公开为路由。

`src/assets/`可以通过相对链接将图像添加到Markdown 并嵌入到 Markdown 中。

静态资源（如网站图标）可以放置在该 `public/`目录中。

## 🧞 命令

所有命令都从项目的根目录的终端运行：

| 命令                      | 功能                                           |
| :------------------------ | :--------------------------------------------- |
| `npm install`             | 安装依赖项                                     |
| `npm run dev`             | 启动本地开发服务器 `localhost:4321`            |
| `npm run build`           | 将您的生产站点构建为 `./dist/`                 |
| `npm run preview`         | 部署之前在本地预览您的构建                     |
| `npm run astro ...`       | 运行 CLI 命令，例如 `astro add`, `astro check` |
| `npm run astro -- --help` | 使用 Astro CLI 获取帮助                        |

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
