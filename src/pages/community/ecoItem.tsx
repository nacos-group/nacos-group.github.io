import React from 'react';
import { getLink } from '../../utils';
import BrowserOnly from '@docusaurus/BrowserOnly';

export type EcoData = {
  title: string;
  content: string | React.ReactElement;
  tags: any;
}
type Props = {
  eco: EcoData;
};
const EcoItem = (props:Props) => {
  const { eco } = props;
  // const { title, content, tags } = eco || {};
  return (
    <BrowserOnly>
      {() => (
        <div className="eco-item">
          <h4>{eco.title}</h4>
          <p>{eco.content}</p>
          <div className="tags">
            {
              eco.tags.map((tag, i) => (
                <a
                  key={i}
                  href={getLink(tag.link)}
                  target={tag.target || '_self'}
                  style={{ background: tag.bgColor }}
                >
                  {
                    tag.text
                  }
                </a>
              ))
            }
          </div>
        </div>
      )}
    </BrowserOnly>
  );
};

export default EcoItem;
