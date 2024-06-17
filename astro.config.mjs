import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import locales from "./src/i18n/languages";
import tailwind from "@astrojs/tailwind";
import rehypeExternalLinks from "rehype-external-links";
import preact from "@astrojs/preact";
import remarkRemoveMdLinks from "./plugins/remarkRemoveMdLinks";
import remarkRemovePlainLanguageCode from "./plugins/remarkRemovePlainLanguageCode";
import remarkRemoveRepeatHeader from "./plugins/remarkRemoveRepeatHeader";
import addPrefixImageLink from "./plugins/addPrefixImageLink";
import setLinkReferrer from "./plugins/remarkReferer";
import { starlightAsides } from "./node_modules/@astrojs/starlight/integrations/asides";
import goatConfig from "./goat.config";
import topLevelAwait from "vite-plugin-top-level-await";
// https://astro.build/config
export default defineConfig({
  site: process.env.DEPLOY_SITE || "https://nacos.io",
  image: {
    domain: ["img.alicdn"],
  },
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Nacos 官网",
      favicon: "/favicon.ico",
      head: [],
      expressiveCode: {
        themes: ["github-dark"],
        // 完全可以自定义
        // https://github.com/expressive-code/expressive-code/tree/main/packages/astro-expressive-code
        // https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme
        // https://vscodethemes.com/ 主题预览
        // themes: [markdownTheme],
      },
      components: {
        TableOfContents: "./src/components/starlight/TableOfContents.astro",
        Header: "./src/components/starlight/Header.astro",
        Head: "./src/components/starlight/Head.astro",
        Sidebar: "./src/components/starlight/Sidebar.astro",
        PageFrame: "./src/components/starlight/PageFrame.astro",
        SkipLink: "./src/components/starlight/SkipLink.astro",
        TwoColumnContent: "./src/components/starlight/TwoColumnContent.astro",
        PageSidebar: "./src/components/starlight/PageSidebar.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
        ContentPanel: "./src/components/starlight/ContentPanel.astro",
        Pagination: "./src/components/starlight/Pagination.astro",
        Banner: "./src/components/starlight/Banner.astro",
      },
      editLink: {
        baseUrl:
          "https://github.com/nacos-group/nacos-group.github.io/tree/develop-astro-nacos",
      },
      locales,
      customCss: ["./src/style/global.css", "./src/style/fonts.css"],
    }),
    tailwind({ applyBaseStyles: false }),
    {
      name: "@goat:config",
      hooks: {
        "astro:server:setup": async (options) => {
          await goatConfig();
        },
        "astro:build:setup": async (options) => {
          await goatConfig();
        },
      },
    },
    preact({ compat: true }),
  ],
  markdown: {
    rehypePlugins: [
      // 在这里添加 rehype-external-links 插件配置
      [
        rehypeExternalLinks,
        {
          target: "_blank",
        },
      ],
    ],
    remarkPlugins: [
      remarkRemoveMdLinks,
      remarkRemovePlainLanguageCode,
      remarkRemoveRepeatHeader,
      addPrefixImageLink,
      starlightAsides,
      setLinkReferrer,
    ],
  },
  redirects: {
    "/en-us/": "/en/",
    "/[...slug].html": "/[...slug]",
    "/docs/": "/docs/latest/what-is-nacos/",
  },
  vite: {
    build: {
      target: "chrome68",
    },
    plugins: [topLevelAwait()],
  },
});
