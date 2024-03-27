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

			let isMdxLink = node.url.includes('.mdx')
      
      // Process internal markdown links (.md or .mdx)
      if (node.url.includes('.md') || isMdxLink ) {
        const extensionLength = isMdxLink ? 4 : 3;
        const parts = node.url.split('#');
        parts[0] = parts[0].slice(0, -extensionLength) + '/'; // Remove extension and add trailing slash
        
        // Ensure relative links start with ./
        if (!/^[.~/]/.test(parts[0])) {
          parts[0] = './' + parts[0];
        }
        
        node.url = parts.join('#');
      }

      // Adjust relative paths
      if (/^\.\//.test(node.url)) {
        node.url = node.url.replace(/^\.\//, '../');
      } else if (/^\.\.\//.test(node.url)) {
        node.url = node.url.replace(/^\.\.\//, '../../');
      }
		});
	};
}
