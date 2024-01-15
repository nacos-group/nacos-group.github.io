import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
const curFilename = fileURLToPath(import.meta.url);
const curDirname = path.dirname(curFilename);

const starlightPath = path.join(curDirname, 'node_modules/@astrojs/starlight');

/**
 * @description: 替换 utils/route-data.ts
 * 传递 categories 参数
 */
const replaceRouteData = async () => {
	const originFile = path.join(starlightPath, "/utils/route-data.ts");
	const originContent = await fs.readFile(originFile);
	const replacedContent = originContent.toString().replace(
		/const sidebar = getSidebar.*?;\n/,
		'const sidebar = getSidebar(url.pathname, locale, props.categories);\n'
	);
	await fs.writeFile(originFile, replacedContent);
}


/**
 * @description: 替换 utils/navigation.ts
 *
 */
const replaceNavigation = async () => {
	/**
	 * 获取当前页面的 sidebar， 左侧菜单动态加载
	 * 根据页面路由获取sidebar
	 */
	const originFile = path.join(starlightPath, "/utils/navigation.ts");
	const originContent = await fs.readFile(originFile);
	const sideBarRegex = /export function getSidebar\(pathname\: string\, locale\: string \| undefined\).+\n(.+)/;
	const sideBarContent = originContent.toString().replace(
		sideBarRegex,
		`export function getSidebar(pathname: string, locale: string | undefined, categories: any): SidebarEntry[] {
		const routes = getLocaleRoutes(locale);
		const versionRegex = /\\/docs\\/(next|latest|ebook|v[0-9]\\.[0-9]\\.[0-9]|v[0-9]\\.[0-9]|v[0-9]|[0-9]\\.[0-9]\\.[0-9]|[0-9]\\.[0-9]|[0-9])/;
		const match = versionRegex.exec(pathname);
		const version = match ? match[1] : 'latest';
		if(categories && categories[version]){
			return categories[version].map((group) => configItemToEntry(group, pathname, locale, routes));
		}\n`
	);

	/**
	 * 核心的 sidebar Link链接构建
	 */
	/**
	 * /v2/en/quickstart/quick-start-docker.html => /docs/v2/quickstart/quick-start-docker.html
	 * /v2/zh-cn/quickstart/quick-start-kubernetes.html => /docs/v2/quickstart/quick-start-docker.html
	 */
	const sideBarLinkRegex = /href = formatPath\(href\).+\n.+\}/;
	const sideBarLinkContent = sideBarContent.replace(
		sideBarLinkRegex,
		`href = formatPath(href);
		const regex = /\\/(next|latest|ebook|v[0-9]\\.[0-9]\\.[0-9]|v[0-9]\\.[0-9]|v[0-9]|[0-9]\\.[0-9]\\.[0-9]|[0-9]\\.[0-9]|[0-9])\\/(en|zh-cn)/;
		href = href.replace(regex, '/docs/$1');
		}`
	);

	await fs.writeFile(originFile, sideBarLinkContent);
}


/**
 * @description: 替换 index.astro
 * 1. 动态替换核心路由能力
 * 2. 动态集成siderBar能力
 */
const replaceIndexAstro = async () => {
	const originFile = path.join(starlightPath, "index.astro");
	const replacedContent = await fs.readFile('./template/index.startlight.tpl');
	await fs.writeFile(originFile, replacedContent.toString());
}

/**
 * @description: 替换 404.astro
 */
const replace404Astro = async () => {
	const originFile = path.join(starlightPath, "404.astro");
	const replacedContent = await fs.readFile('./template/404.startlight.tpl');
	await fs.writeFile(originFile, replacedContent.toString());
}

export default async () => {
	await replaceRouteData();
	await replaceNavigation();
	await replaceIndexAstro();
	await replace404Astro();
}