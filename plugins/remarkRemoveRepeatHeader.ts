/**
 * @description: remark插件，删除重复的h1 的 Header
 * @refer: https://github.com/alvinometric/remark-remove-comments/blob/main/transformer.js
 */
import { visit } from 'unist-util-visit';

export default function remarkRemoveMdLinks() {
	return (tree, file) => {
		visit(tree, 'heading', (node, index, parent) => {
			if (node.depth === 1) {
				/**
				 * {
					type: 'heading',
					depth: 2,
					children: [ { type: 'text', value: 'Nacos常规问题', position: [Object] } ],
					position: {
							start: { line: 47, column: 1, offset: 1108 },
							end: { line: 47, column: 13, offset: 1120 }
						}
					}
				 */
				const h1HeaderNode = node.children[0];
				if (h1HeaderNode && h1HeaderNode.type === 'text' && h1HeaderNode.value === file.data.astro.frontmatter.title){
					parent.children.splice(index, 1);
				}
			}
		});
	};
}
