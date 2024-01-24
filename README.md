# Nacos Official WebSite

This project keeps all sources used for building up [Nacos](https://github.com/alibaba/nacos) official website which's served at http://nacos.io.

# README.md

- en [English](README.md)
- zh_CN [简体中文](README.zh_CN.md)

## Build instruction

1. Run `npm i` in the root directory to install the dependencies.
2. Run `npm run dev` in the root directory to start a local server, you will see the website in `localhost:4321`.
3. Run `npm run build` to build source code.

## Requirements

Node.js version >= 18.14.1

## How to Contribute

1. Create an issue first to description the issue
2. Do not use `git add .` to commit all the changes.
3. Just push your changed files, such as:
    * `*.md`
    * _sidebar.json
4. Send a PR to `master` branch.

## SEO

Make sure each .md starts with the following texts:

```
---
title: title
keywords: [keywords1,keywords2,keywords3]
description: some description
sidebar:
    order: Article table of contents order(optional)
---
```

Refer to [this blog](src/content/docs/latest/what-is-nacos)
**Note:**
1. `title` can not include `:` 
2. `keywords` must be a `Array`

## Guide for adding new document

### Add a new doc

1. Add new .md file under `docs/en` or `docs/zh-cn`.
2. Update `_sidebar.json`, add a new entry to the blog in either en or zh-cn.
3. Send the pull request contains the `.md` and `_sidebar.json` only.

## 👀 Want to learn more?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
