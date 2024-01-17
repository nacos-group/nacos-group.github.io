---
import { getEntry } from 'astro:content';
import config from 'virtual:starlight/user-config';
import EmptyContent from './components/EmptyMarkdown.md';
import Page from './components/Page.astro';
import { generateRouteData } from './utils/route-data';
import type { StarlightDocsEntry } from './utils/routing';
import { useTranslations } from './utils/translations';

const { lang = 'en', dir = 'ltr' } = config.defaultLocale || {};
let locale = config.defaultLocale?.locale;
if (locale === 'root') locale = undefined;

const entryMeta = { dir, lang, locale };
const t = useTranslations(locale);

const fallbackEntry: StarlightDocsEntry = {
	slug: '404',
	id: '404.md' as StarlightDocsEntry['id'],
	body: '',
	collection: 'docs',
	data: {
		title: '404',
		template: 'splash',
		editUrl: false,
		head: [],
		hero: { tagline: t('404.text'), actions: [] },
		pagefind: false,
		sidebar: { hidden: false, attrs: {} },
	},
	render: async () => ({
		Content: EmptyContent,
		headings: [],
		remarkPluginFrontmatter: {},
	}),
};

const userEntry = await getEntry('docs', '404');
const entry = userEntry || fallbackEntry;
const { Content, headings } = await entry.render();
const route = generateRouteData({
	props: { ...entryMeta, entryMeta, headings, entry, id: entry.id, slug: entry.slug },
	url: Astro.url,
});

---

<Page {...route}><Content /></Page>


<script>
	const pathname = window?.location?.pathname;
	const regexs = /\/docs\/(latest|ebook|next|v[0-9]\.[0-9]\.[0-9]|v[0-9]\.[0-9]|v[0-9]|[0-9]\.[0-9]\.[0-9]|[0-9]\.[0-9]|[0-9])\/.+/;
	const match = regexs.exec(pathname)
	if(!match) {
		const [lang, rest] = pathname.split('/docs');
		if(lang === '/en-us') {
			window.location.pathname = '/en/docs'+ '/latest' + rest
		} else {
			window.location.pathname = '/docs'+ '/latest' + pathname.split('/docs').join('')
		}
	}
</script>
