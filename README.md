# Nacos Official WebSite

This project keeps all sources used for building up [Nacos](https://github.com/alibaba/nacos) official website which's served at http://nacos.io.


## Attention

If your version of [docsite](https://github.com/txd-team/docsite) is less then `1.0.0`, please upgrade to `1.0.0`. you can check version with 

```java
docsite --version
```

## Build instruction

1. Run `npm install docsite -g` to install the docsite dev tool.
2. Run `npm i` in the root directory to install the dependencies.
3. Run `docsite start` in the root directory to start a local server, you will see the website in 'http://127.0.0.1:8080'.
4. Run `docsite build` to build source code.
5. Verify your change locally: `python -m SimpleHTTPServer 8000`

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

