---
import type { InferGetStaticPropsType } from 'astro';
import { generateRouteData } from './utils/route-data';
import { paths } from './utils/routing';
import Page from './components/Page.astro';
import _ from 'lodash';

export async function getStaticPaths() {
	const currentPath = paths.filter((item) => {
		// 支持类似 v2.3.2 的格式，默认slug会去掉 .
		const slug = item.props.id.replace(/.md$/, "") === item.props.slug ? item.props.slug : item.props.id.replace(/.md$/, "")
		const [version, lang, ...rest] = slug.split('/');

		/**
		 * 默认每个目录都会生成一份路由，因为有版本的概念，会多生成一份
		 * 所以使用中文生成的路由，同时把相关的信息刷成英文格式
		 */
		if(lang === 'en' || lang === 'zh-cn') {
			const versionSlug = `${version}/`;
			if(lang === 'en') {
				item.props.lang='en';
				item.props.locale='en';
				item.props.entryMeta.lang='en';
				item.props.entryMeta.locale='en';
				item.params.slug = `${lang}/docs/${versionSlug}${rest.join('/')}`;
			} else {
				item.params.slug = `docs/${versionSlug}${rest.join('/')}`;
			}
			return true;
		} else {
			// 有一层目录是不需要的
			return false;
		}
	});
	return currentPath;
}

const categorySidebar = (await import.meta.glob("../../../src/content/**/_sidebar.json", { eager: true }));

const regex = /\/content\/docs\/(latest|ebook|next|v[0-9]\.[0-9]\.[0-9]|v[0-9]\.[0-9]|v[0-9]|[0-9]\.[0-9]\.[0-9]|[0-9]\.[0-9]|[0-9]).*/;
const categories = {}
_.each(categorySidebar,(item, key) => {
	const match = regex.exec(key);
	if(match && match[1]) {
		const version = match[1];
		const siderBarList = item.default;
		// 自动加上版本相关信息
		makeTranslate(siderBarList, version);
		categories[version] = siderBarList;
	}
});

function makeTranslate(list: any[], version: string) {
	const regex = /latest|next|ebook|v[0-9]\.[0-9]\.[0-9]|v[0-9]\.[0-9]|v[0-9]|[0-9]\.[0-9]\.[0-9]|[0-9]\.[0-9]|[0-9]/;
	for (const item of list) {
		if(!item['translations']) {
			item['translations'] = {
				en: item['label']
			};
		}
		if(item['autogenerate']) {
			const [curVersion, ...rest] = _.split(item['autogenerate']['directory'], '/');
			const match = regex.exec(curVersion);
			if(!match) {
				item['autogenerate']['directory'] = `${version}/zh-cn/${item['autogenerate']['directory']}`
			}
		}
		if(item['link']) {
			const [_docs, ...rest] = _.split(item['link'], '/');
			const match = regex.exec(rest[0]);
			if(!match) {
				item['link'] = `${_docs}/${version}/${_.join(rest, '/')}`
			}
		}
		if(item['items']) {
			makeTranslate(item['items'], version);
		}
	}
}


type Props = InferGetStaticPropsType<typeof getStaticPaths>;
const { Content, headings } = await Astro.props.entry.render();

const route = generateRouteData({ props: { ...Astro.props, headings, categories: categories }, url: Astro.url });


const regexs = /\/docs\/(latest|ebook|next|v[0-9]\.[0-9]\.[0-9]|v[0-9]\.[0-9]|v[0-9]|[0-9]\.[0-9]\.[0-9]|[0-9]\.[0-9]|[0-9])\/.+/;

const match = regexs.exec(Astro.url.pathname)
if(!match) {
	return Astro.redirect('/docs'+ '/latest' + Astro.url.pathname.split('/docs').join(''));
}
---
<Page {...route}><Content /></Page>
