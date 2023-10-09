import React from 'react';
import { getLink } from '../../utils';
import BrowserOnly from '@docusaurus/BrowserOnly';
export type ContributorData = {
  img: string;
  title: string;
  content: string | React.ReactElement;
};

type Props = {
  contributor: ContributorData;
};

const ContributorItem = (props: Props) => {
  const { contributor } = props;
  const { img, title, content } = contributor || {};
  return (
    <BrowserOnly>
      {() => (
        <div className="contributor-item">
          <img src={getLink(img)} />
          <div>{title}</div>
          <p>{content}</p>
        </div>
      )}
    </BrowserOnly>
  );
};

export default ContributorItem;