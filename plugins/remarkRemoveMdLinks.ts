/**
 * @description: remark插件，删除.md后缀内容
 */
import { visit } from 'unist-util-visit';

export default function remarkRemoveMdLinks() {
	return (tree) => {
		visit(tree, 'link', (node) => {
			// http或者 https 开头的
			if (node.url.startsWith("http://") || node.url.startsWith("https://") || node.url.startsWith("//")) {
				return;
			}

			if (node.url.endsWith('.md') || node.url.endsWith('.mdx')) {
				if(node.url.endsWith('.mdx')) {
					node.url = node.url.slice(0, -4) + '/';	
				} else {
					node.url = node.url.slice(0, -3) + '/';
				}
				if (/^[^\.|~\/].+/.test(node.url)) {
					node.url = "./" + node.url;
				}
				let url = '';
				if (/^\.\//.test(node.url)) {
					// ./deployment.md
					url = node.url.replace(/^\.\//, '../');
				} else if (/^\.\.\//.test(node.url)) {
					// ../deployment.md
					url = node.url.replace(/^\.\.\//, '../../');
				}
				node.url = url;
			}
			if (node.url.includes('.md#')) {
				let [url, anchor] = node.url.split('#');
				node.url = url.slice(0, -3) + '/';	
				if (/^[^\.|~\/].+/.test(node.url)) {
					node.url = "./" + node.url;
				}
				if (/^\.\//.test(node.url)) {
					// ./deployment.md
					url = node.url.replace(/^\.\//, '../');
				} else if (/^\.\.\//.test(node.url)) {
					// ../deployment.md
					url = node.url.replace(/^\.\.\//, '../../');
				}
				node.url = url + '#' + anchor;
			}
			if (node.url.includes('.mdx#')) {
				let [url, anchor] = node.url.split('#');
				node.url = url.slice(0, -4) + '/';	
				if (/^[^\.|~\/].+/.test(node.url)) {
					node.url = "./" + node.url;
				}
				if (/^\.\//.test(node.url)) {
					// ./deployment.md
					url = node.url.replace(/^\.\//, '../');
				} else if (/^\.\.\//.test(node.url)) {
					// ../deployment.md
					url = node.url.replace(/^\.\.\//, '../../');
				}
				node.url = url + '#' + anchor;
			}
		});
	};
}
