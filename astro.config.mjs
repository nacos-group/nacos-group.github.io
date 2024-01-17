import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import locales from './src/i18n/languages';
import tailwind from '@astrojs/tailwind';
import rehypeExternalLinks from 'rehype-external-links'

import remarkRemoveMdLinks from "./plugins/remarkRemoveMdLinks"
import remarkRemovePlainLanguageCode from "./plugins/remarkRemovePlainLanguageCode"
import remarkRemoveRepeatHeader from "./plugins/remarkRemoveRepeatHeader"
import addPrefixImageLink from "./plugins/addPrefixImageLink"
import setLinkReferrer from './plugins/remarkReferer'
import { starlightAsides } from './node_modules/@astrojs/starlight/integrations/asides'
import goatConfig from './goat.config';

// https://astro.build/config
export default defineConfig({
	site: process.env.DEPLOY_SITE || 'https://nacos.io',
	image: {
		domain: ["img.alicdn"]
	},
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'Nacos',
			favicon: '/favicon.ico',
			head: [
			],
			expressiveCode: {
				themes: ['github-dark'],
				// 完全可以自定义
				// https://github.com/expressive-code/expressive-code/tree/main/packages/astro-expressive-code
				// https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme
				// https://vscodethemes.com/ 主题预览
				// themes: [markdownTheme],
			},
			components: {
				TableOfContents: './src/components/starlight/TableOfContents.astro',
				Header: './src/components/starlight/Header.astro',
				Head: './src/components/starlight/Head.astro',
				Sidebar: './src/components/starlight/Sidebar.astro',
			},
			editLink: {
				baseUrl: 'https://github.com/nacos-group/nacos-group.github.io/tree/develop-astro-nacos',
			},
			locales,
			customCss: ['./src/style/global.css','./src/style/fonts.css'],
		}),
		tailwind({ applyBaseStyles: false }),
		{
			name: '@goat:config',
			hooks: {
				"astro:server:setup": async (options) => {
					await goatConfig();
				},
				"astro:build:setup": async (options) => {
					await goatConfig();
				}
			}
		},
	],
	markdown: {
		rehypePlugins: [
			// 在这里添加 rehype-external-links 插件配置
			[rehypeExternalLinks, {
				target: '_blank'
			}]],
		remarkPlugins: [
			remarkRemoveMdLinks, 
			remarkRemovePlainLanguageCode, 
			remarkRemoveRepeatHeader, 
			addPrefixImageLink,
			starlightAsides,
			setLinkReferrer
		]
	},
	redirects: {
		'/zh-cn/': '/',
		'/en-us/': '/en',
		'/zh-cn/[...slug].html': '/[...slug]',
		'/[...slug].html': '/[...slug]',
		'/zh-cn/[...slug]': '/[...slug]',
	}
});