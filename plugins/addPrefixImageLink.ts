/**
 * @description: remark插件，删除.md后缀内容
 */
import { visit } from 'unist-util-visit';

export default function remarkRemoveMdLinks() {
  return (tree) => {
      visit(tree, 'image', (node) => {
        //   将博客的img链接替换。从相对路径替换至从public文件夹取
          if (node.url.startsWith('img')) {
            node.url = '/' + node.url
          } 
    });
  };
}
