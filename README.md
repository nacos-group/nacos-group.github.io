# Nacos Official WebSite

This project keeps all sources used for building up [Nacos](https://github.com/alibaba/nacos) official website which's served at http://nacos.io.


## Attention

Nacos website is powered by [docsite](https://github.com/txd-team/docsite). If your version of docsite is less then 1.3.3, please upgrade to 1.3.3. Please also make sure your node version is 8.x, versions higher than 8.x is not supported by docsite yet.

> **NOTE**: `docsite` can not support the latest `node@11`, you need to install older version of `node`, for example, you can use following commands to do this on **MacOS** with `brew`
> 
> ```
> brew search node
> brew install node@8
> 
> install `npm` with specific node version `node@8`
> ``` 
> 
> we tested successfully with 
> 
> `node 8.9.4 | npm 5.6.0 | docsite 1.3.2`
> 


## Build WebSite Locally

1. Run `npm install docsite -g` to install the docsite dev tool.
2. Run `npm i` in the project's root directory to install the dependencies.
3. Run `docsite start` in the project's root directory to start a local server, you will see the website in 'http://127.0.0.1:8080'.
4. Run `docsite build` to build source code.

## How to Contribute

1. Create an issue first to description the issue
2. Do not use `git add .` to commit all the changes.
3. Just push your changed files, such as:
    * *.md
    * blog.js or docs.js or site.js
4. Send a PR to `develop` branch.

## SEO

Make sure each .md starts with the following texts:

```
---
title: title
keywords: keywords1,keywords2,keywords3
description: some description
---
```

## Guide for adding new document

### Add a new blog

1. Add new .md file under blog/en-us or blog/zh-cn.
2. Update site_config/blog.js, add a new entry to the blog in either en-us or zh-cn.
3. Run docsite start locally to verify the blog can be displayed correctly.
4. Send the pull request contains the .md and blog.js only.


### Add a new article for developers

1. Add new .md file under docs/en-us/developers or docs/zh-cn/developers, the file name should end up with _dev.md. Note that the suffix _dev is necessary.
2. Update site_config/develop.js, add a new entry in either en-us or zh-cn.
3. Run docsite start locally to verify the article can be displayed correctly.
4. Send the pull request contains the *_dev.md and develop.js only.
