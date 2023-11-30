# Nacos Official Website

[![CI](https://github.com/nacos-group/nacos-group.github.io/actions/workflows/CI.yml/badge.svg)](https://github.com/nacos-group/nacos-group.github.io/actions/workflows/CI.yml)

All website material of https://nacos.io, which uses a open source framework: Docusaurus.

# README.md
- en [English](README.md)
- zh_CN [简体中文](readme/README.zh_CN.md)

### Quick Start

1. `npm install`

2. `npm run start -- --locale en` for starting Nacos's **English** webpage in your local machine.

    `npm run start -- --locale zh-cn` for starting Nacos's **Chinese Simplified** webpage in your local machine.

3. Visit
```
localhost:3000/
```

### Build

1. `npm run build`

2. `npm run serve`

3. Visit
```
localhost:3000/
```

## Requirements
Base docusaurus v2.4.1  
Node.js version 19.5.0

## Note for i18n
Please be noted that **locale switching function doesn't work** if you start the website in development mode using `npm run start -- --locale zh-cn` or `npm run start -- --locale en`. Please run it in production mode using the build-and-serve process to enable the locale switching function.

## Overview of the Website Structure
We use the **Docusaurus internationalization (i18n)** to support both English(en) and Chinese Simplified(zh-cn) Nacos Website. Besides, we apply **Docusaurus Versioning** to get versioned docs.

Our website stucture with i18n and versioning looks like below:
```
website  
├── sidebars.json        # sidebar for the current docs version
├── docs                 # docs directory for the current docs version
│   ├── foo  
│   │   └── bar.md       # https://mysite.com/docs/next/foo/bar  
│   └── hello.md         # https://mysite.com/docs/next/hello  
├── versions.json        # file to indicate what versions are available
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

## How To Add Documents

### Directories Related to Adding Documents
docs - Contain the current (latest version) documents (placeholder for sidebar indexing purposes)  
    Document Content should be `Placeholder. DO NOT DELETE.`

sidebars.json - Set the sidebar for the current (latest version) documents.

versioned_docs - Contain the previous version documents (placeholder for sidebar indexing purposes)  
    Document Content should be `Placeholder. DO NOT DELETE.`

versioned_sidebars - Set the sidebar for the specific previous versions documents.

i18n-`en`-docusaurus-plugin-content-docs-`current` - Contain the actual **latest version** English documents.  
i18n-`en`-docusaurus-plugin-content-docs-`version-1.0.0` - Contain the actual **1.0.0 version** English documents.

i18n-`zh-cn`-docusaurus-plugin-content-docs-`current` - Contains the actual **latest version** Simplified Chinese documents.  
i18n-`zh-cn`-docusaurus-plugin-content-docs-`version-1.0.0` - Contain the actual **1.0.0 version** Simplified Chinese documents.

### Summary of Adding Documents
Steps to add a document for the **latest version**:

1. Place placeholder document under the docs directory which is located in the root directory.
2. Update sidebar.js, add a new entry to the path of this document.
3. Place the English document under the i18-`en`-docusaurus-plugin-content-docs-`current` directory.
4. Place the Chinese document under the i18-`zh-cn`-docusaurus-plugin-content-docs-`current` directory.

Steps to add a document for a **previous version**:

1. Place a placeholder document under the specific versioned_docs directory for the desired version which is located in the root directory.
2. Update specific versioned_sidebars file, add a new entry to the path of this document.
3. Place the English document under the i18-`en`-docusaurus-plugin-content-docs-`specific version number` directory.
4. Place the Chinese document under the i18-`zh-cn`-docusaurus-plugin-content-docs-`specific version number` directory.

>  Notes: Corresponding to Chinese file and English file of same contents, and the Chinese and English file names should be consistent.


## How To Add Blogs
We don't have a versioned blog, so it's easier to add a blog. When adding a new blog, it is automatically added in the Blog sidebar, where the order of blogs is sorted by the `date` field in SEO in the blog file.

### Directories Related to Adding Blogs
blog - Contain the blogs(placeholder for blog sidebar indexing purposes)  
    Blog Content should be `Placeholder. DO NOT DELETE.`

i18n-`en`-docusaurus-plugin-content-blog - Contain all the actual English blogs.  

i18n-`zh-cn`-docusaurus-plugin-content-blog - Contain all the actual Simplified Chinese blogs.  

### Summary of Adding Blogs
Steps to add a blog:

1. Place placeholder blog under the blog directory which is located in the root directory.
2. Place the English blog under the i18-`en`-docusaurus-plugin-content-blog directory.
3. Place the Chinese blog under the i18-`zh-cn`-docusaurus-plugin-content-blog directory.

>  Notes: Corresponding to Chinese file and English file of same contents, and the Chinese and English file names should be consistent.

## SEO Needed in Both Docs and Blogs

The type is :
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
**Note:**
1. `title` can not include `:` 
2. `keywords` must be a `Array`
<!-- 3. `custom_edit_url` is a link to the doc in this repo, required. -->

## Note for .md file
1. Do not use un correct html tag like `<img>、<br>`, replace with `<img /> <br />`
2. If you want show `<xx>`, replace with `&lt;xx&gt;`

## Others

+ This is official Docusaurus docs :[https://docusaurus.io/docs](https://docusaurus.io/docs)
