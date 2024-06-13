import DocsMenu from "./DocsMenu.astro";
import CommunityMenu from "./CommunityMenu.astro";

export default [
  {
    label: "文档",
    translations: {
      en: "DOCS",
    },
    trigger: "hover",
    slot: DocsMenu,
    position: "absolute",
    activePath: ["/docs"],
  },
  {
    label: "企业版 NACOS",
    translations: {
      en: "NACOS CLOUD",
    },
    trigger: "click",
    route: "/cloud/",
    target: "_self",
    activePath: ["/cloud"],
  },
  {
    label: "社区",
    translations: {
      en: "COMMUNITY",
    },
    trigger: "hover",
    slot: CommunityMenu,
    position: "absolute",
    relativePosition: 'page',
    activePath: ["/news", "/activity", "/blog", "/docs/ebook/", "/download"],
  },
  {
    label: "博客",
    translations: {
      en: "BLOG",
    },
    trigger: "click",
    target: "_self",
    route: "/blog/",
  },
  {
    label: "下载",
    translations: {
      en: "DOWNLOAD",
    },
    trigger: "click",
    target: "_self",
    route: "/download/nacos-server/",
  },
  {
    label: "控制台样例",
    translations: {
      en: "DEMO",
    },
    trigger: "click",
    target: "_blank",
    route: "http://console.nacos.io/nacos/index.html",
  },
  {
    label: "答疑样例",
    translations: {
      en: "FAQ",
    },
    trigger: "click",
    target: "_self",
    route: "/wuyi/",
  },
];
