import React from 'react';
import { getLink } from '../../../utils';

const Item = (props) => {
  const { feature } = props;
  return (
    <li className="feature-list-item">
      <img src={getLink(feature.img)} />
      <div>
        <h4>{feature.title}</h4>
        <ul>
        {feature.content.map(c => <li>{c}</li>)}
        </ul>
      </div>
    </li>
  );
};

export default Item;
