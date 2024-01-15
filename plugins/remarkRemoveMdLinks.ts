/**
 * @description: remark插件，删除.md后缀内容
 */
import { visit } from 'unist-util-visit';

export default function remarkRemoveMdLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (node.url.endsWith('.md')) {
        node.url = node.url.slice(0, -3);
      }
    });
  };
}
