import React from 'react';
import { Link } from 'react-router-dom';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

export default class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: props.item.opened,
    };
  }

  @autobind
  onItemClick(e) {
    window.scrollTo && window.scrollTo(0, 0);
    e.stopPropagation();
  }

  @autobind
  toggle() {
    this.setState({
      opened: !this.state.opened,
    });
  }

  @autobind
  renderSubMenu(data) {
    return (
      <ul>
      {
        data.map((item, index) => (
          <li
            className={classnames({
              'menu-item': true,
              'menu-item-level-3': true,
              'menu-item-selected': item.link === window.location.hash.slice(1),
            })}
            key={index}
            onClick={this.onItemClick}
          >
            <Link to={item.link}>{item.title}</Link>
          </li>
        ))
      }
      </ul>
    );
  }

  render() {
    const { item } = this.props;
    const hasChildren = item.children && item.children.length;
    const { opened } = this.state;
    const cls = classnames({
      'menu-item': true,
      'menu-item-level-2': true,
      'menu-item-selected': item.link === window.location.hash.slice(1),
      'menu-item-opened': hasChildren && (opened || item.children.find(child => child.link === window.location.hash.slice(1))),
    });
    const style = {
      height: hasChildren && opened ? (36 * item.children.length) + 48 : 48,
      overflow: 'hidden',
    };
    if (hasChildren) {
      return (
        <li style={style} className={cls} onClick={this.toggle}>
        {
          <span>
            {item.title}
            <img style={{ transform: `rotate(${opened ? 0 : -90}deg)` }} className="menu-toggle" src="./img/arrow_down.png" />
          </span>
        }
        {this.renderSubMenu(item.children)}
        </li>
      );
    }
    return (
      <li style={style} className={cls} onClick={this.onItemClick}>
        <Link to={item.link}>{item.title}</Link>
      </li>
    );
  }
}
