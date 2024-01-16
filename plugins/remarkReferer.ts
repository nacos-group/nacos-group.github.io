import {visit} from 'unist-util-visit';

function setLinkReferrer() {
  return (tree) => {
      visit(tree, 'link', (node) => {
        if (node.type === 'link' ) {
            // 为非图片链接设置referrer
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};
            node.data.hProperties.referrerpolicy = 'unsafe-url';
        }
    });

      visit(tree, 'image', (node) => {
      if (node.type === 'image') {
        // 为图片链接不设置referrer
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.referrerpolicy = 'no-referrer';
      }
    });
  };
}

export default setLinkReferrer;
