# Nacos Official WebSite
All website material of https://nacos.io.


## Starlight Starter Kit: Basics

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

```

npm create astro@latest -- --template starlight
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/starlight/tree/main/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/starlight/tree/main/examples/basics)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## Quick Start

1. `npm install`

2. `npm run dev`

3. Visit
```
localhost:4321/
```

## Requirements
Node.js version >=18.14.1
## 🚀 Project Structure

Inside of your Astro + Starlight project, you'll see the following folders and files:

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

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

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
2. Update `_sidebar.json`, add a new entry to the blog in either en-us or zh-cn.
3. Send the pull request contains the .md and _sidebar.json only.

## 👀 Want to learn more?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
