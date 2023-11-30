# Nacos 官方网站

[![CI](https://github.com/nacos-group/nacos-group.github.io/actions/workflows/CI.yml/badge.svg)](https://github.com/nacos-group/nacos-group.github.io/actions/workflows/CI.yml)

此仓库包含 https://nacos.io 的所有网站材料，使用的开源框架是 Docusaurus。

# README.md同时有以下语言的版本
- en [English](../README.md)
- zh_CN [简体中文](README.zh_CN.md)

### 快速开始

1. `npm install`

2. `npm run start -- --locale en` 用于在本地上启动 Nacos 的 **英文** 网站。

    `npm run start -- --locale zh-cn` 用于在本地上启动 Nacos 的 **中文** 网站。

3. Visit
```
localhost:3000/
```

### 构建

1. `npm run build`

2. `npm run serve`

3. Visit
```
localhost:3000/
```

## 版本要求
Base docusaurus v2.4.1  
Node.js version 19.5.0

## 国际化（i18n）注意事项
请注意，如果您使用 `npm run start -- --locale zh-cn` 或 `npm run start -- --locale en` 以开发模式启动网站，**语言切换功能将不起作用**。请使用构建过程在生产模式下运行网站，以启用语言切换功能。

## 网站文件结构概览
我们使用 **Docusaurus 国际化 (i18n)** 来支持英语 (en) 和简体中文 (zh-cn) 两种语言的 Nacos 网站。此外，我们还使用 **Docusaurus 多版本**，对文档划分了版本。

版本化和国际化文档网站结构如下所示：

```
website  
├── sidebars.json        # 当前文档版本的侧边栏  
├── docs                 # 当前文档版本的文档目录  
│   ├── foo  
│   │   └── bar.md       # https://mysite.com/docs/next/foo/bar  
│   └── hello.md         # https://mysite.com/docs/next/hello  
├── versions.json        # 表明哪些版本可用的文件  
├── versioned_docs  
│   ├── version-1.1.0  
│   │   ├── foo  
│   │   │   └── bar.md   # https://mysite.com/docs/foo/bar  
│   │   └── hello.md  
│   └── version-1.0.0  
│       ├── foo  
│       │   └── bar.md   # https://mysite.com/docs/1.0.0/foo/bar  
│       └── hello.md  
├── versioned_sidebars  
│   ├── version-1.1.0-sidebars.json  
│   └── version-1.0.0-sidebars.json  
├── blog 
├── docusaurus.config.js  
├── package.json  
├── i18n
│   ├── en
│   │   ├── docusaurus-plugin-content-docs
│   │   │   ├── current
│   │   │   ├── version-1.0.0
│   │   │   └── version-1.1.0
│   │   ├── docusaurus-plugin-content-blog
│   │   └── ...
│   └── zh-cn
│   │   ├── docusaurus-plugin-content-docs
│   │   │   ├── current
│   │   │   ├── version-1.0.0
│   │   │   └── version-1.1.0
│   │   ├── docusaurus-plugin-content-blog
│   │   └── ...
```

## 如何新增文档

### 新增文档相关的目录
docs - 放置 current(**最新版**)文档 (仅作占位，为了让 sidebar 索引到)  
    文档中内容：Placeholder. DO NOT DELETE.

sidebars.json - 设置 current(**最新版**)侧边栏

versioned_docs - 放置**之前版本**文档 (仅作占位，为了让 sidebar 索引到)  
    文档中内容：Placeholder. DO NOT DELETE.

versioned_sidebars - 设置 **之前版本**侧边栏

i18-`en`-docusaurus-plugin-content-docs-`current` - 放置**最新版 英文**文档 (实际文档)  
i18-`en`-docusaurus-plugin-content-docs-`version-1.0.0` - 放置**1.0.0版 英文**文档 (实际文档)     

i18-`zh-cn`-docusaurus-plugin-content-docs-`current` - 放置**最新版 中文**文档 (实际文档)     
i18-`zh-cn`-docusaurus-plugin-content-docs-`version-1.0.0` - 放置**1.0.0版 中文**文档 (实际文档)   

### 总结
新增**最新版**文档的步骤：

1. docs目录下（位于根目录）-路径 放置占位文档
2. sidebars.json 侧边栏增加该文档的路径。
3. i18-`en`-docusaurus-plugin-content-docs-`current`-路径 放置英文文档
4. i18-`zh-cn`-docusaurus-plugin-content-docs-`current`-路径 放置中文文档

新增**之前某版本**文档的步骤：

1. versioned_docs目录下某版本-路径 放置占位文档
2. versioned_sidebars某版本 侧边栏增加该文档的路径。
3. i18-`en`-docusaurus-plugin-content-docs-`某版本号`-路径 放置英文文档
4. i18-`zh-cn`-docusaurus-plugin-content-docs-`某版本号`-路径 放置中文文档

> 注意：相同内容的对应中/英文文件，且中/英文文件名要一致。

## 如何新增博客
我们没有分版本的博客，因此添加博客更为方便。添加新博客时，会自动添加到博客侧栏中，其中博客的顺序按博客文件中 SEO 中的“日期”字段自动排序。

### 新增博客相关的目录
blog - 放置所有博客 (仅作占位，为了让博客的 sidebar 索引到)  
    文档中内容：Placeholder. DO NOT DELETE.

i18-`en`-docusaurus-plugin-content-blog - 放置所有的英文博客 (实际博客)  

i18-`zh-cn`-docusaurus-plugin-content-blog - 放置所有的中文博客 (实际博客)     

### 总结
新增博客的步骤：

1. blog目录下（位于根目录）-路径 放置占位博客
2. i18-`en`-docusaurus-plugin-content-blog 放置英文博客
3. i18-`zh-cn`-docusaurus-plugin-content-blog 放置中文博客

> 注意：相同内容的对应中/英文文件，且中/英文文件名要一致。

## 新增文件（文档和博客）都需要写搜索引擎优化（SEO）

md 文件开头的格式为：
```
---
title: title
keywords: [keywords1,keywords2]
description: some description
author: author name
date: 2018-12-29
custom_edit_url: https://github.com/nacos-group/nacos-group.github.io/blob/docusaurus/i18n/en/docusaurus-plugin-content-blog/download.md
---
```
**注意：**
1. 'title'不能包含'：'
2. 'keywords' 必须是 'Array'
<!-- 3. “custom_edit_url”是指向此存储库中文档的链接，是必需的。 -->

## .md 文件注意事项
1. 不要使用不正确的 html 标签，如 `<img>、<br>`，将其替换为`<img /> <br />`
2. 如果要显示 `<xx>`，请替换为`&lt;xx&gt;`

## 其他

+ 请参考 Docusaurus 的官方文档：[https://docusaurus.io/zh-CN/docs](https://docusaurus.io/zh-CN/docs)
