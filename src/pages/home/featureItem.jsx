import React from 'react';

const Item = (props) => {
  const { feature } = props;
  return (
    <li className="feature-list-item">
      <img src={feature.img} />
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
