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

