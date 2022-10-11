import React from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import siteConfig from '../../../site_config/site';
import { getLink } from '../../../utils';
import './index.scss';

const languageSwitch = [
  {
    text: '中',
    value: 'en-us',
  },
  {
    text: 'En',
    value: 'zh-cn',
  },
];
const searchSwitch = {
  baidu: {
    logo: 'https://img.alicdn.com/tfs/TB1n6DQayLaK1RjSZFxXXamPFXa-300-300.png',
    url: 'https://www.baidu.com/s?wd=',
  },
  google: {
    logo: 'https://img.alicdn.com/tfs/TB1REfuaCzqK1RjSZFjXXblCFXa-300-300.jpg',
    url: 'https://www.google.com/search?q=',
  },
};
const noop = () => { };

const defaultProps = {
  type: 'primary',
  language: 'en-us',
  onLanguageChange: noop,
};

@autobind
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuBodyVisible: false,
      language: props.language,
      search: siteConfig.defaultSearch,
      searchValue: '',
      inputVisible: false,
    };
  }

  toggleMenu() {
    this.setState({
      menuBodyVisible: !this.state.menuBodyVisible,
    });
  }

  switchLang() {
    let language;
    if (this.state.language === 'zh-cn') {
      language = 'en-us';
    } else {
      language = 'zh-cn';
    }
    this.setState({
      language,
    });
    this.props.onLanguageChange(language);
  }

  switchSearch() {
    let search;
    if (this.state.search === 'baidu') {
      search = 'google';
    } else {
      search = 'baidu';
    }
    this.setState({
      search,
    });
  }

  toggleSearch() {
    this.setState({
      searchVisible: !this.state.searchVisible,
    });
  }

  onInputChange(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }

  goSearch() {
    const { search, searchValue } = this.state;
    window.open(`${searchSwitch[search].url}${window.encodeURIComponent(`${searchValue} site:${siteConfig.domain}`)}`);
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.goSearch();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      language: nextProps.language,
    });
  }

  render() {
    const { type, logo, onLanguageChange, currentKey } = this.props;
    const { menuBodyVisible, language, search, searchVisible } = this.state;
    return (
      <header
        className={
          classnames({
            'header-container': true,
            [`header-container-${type}`]: true,
          })
        }
      >
        <div className="header-body">
          <a href={getLink(`/${language}/index.html`)}>
            <img className="logo" alt={siteConfig.name} title={siteConfig.name} src={logo} />
          </a>
          {
            siteConfig.defaultSearch ?
              (
                <div
                  className={classnames({
                    search: true,
                    [`search-${type}`]: true,
                  })}
                >
                  <span className="icon-search" onClick={this.toggleSearch} />
                  {
                    searchVisible ?
                      (
                        <div className="search-input">
                          <img src={searchSwitch[search].logo} onClick={this.switchSearch} />
                          <input autoFocus onChange={this.onInputChange} onKeyDown={this.onKeyDown} />
                        </div>
                      ) : null
                  }
                </div>
              ) : null
          }
          {
            onLanguageChange !== noop ?
              (<span
                className={
                  classnames({
                    'language-switch': true,
                    [`language-switch-${type}`]: true,
                  })
                }
                onClick={this.switchLang}
              >
                {languageSwitch.find(lang => lang.value === language).text}
              </span>)
              :
              null
          }
          <div
            className={
              classnames({
                'header-menu': true,
                'header-menu-open': menuBodyVisible,
              })
            }
          >
            <img
              className="header-menu-toggle"
              onClick={this.toggleMenu}
              src={type === 'primary' ? getLink('/img/menu_white.png') : getLink('/img/menu_gray.png')}
            />
            <ul>
              {siteConfig[language].pageMenu.map((item) => (
                <li
                  key={item.key}
                  className={classnames({
                    'menu-item': true,
                    [`menu-item-${type}`]: true,
                    [`menu-item-${type}-active`]: currentKey === item.key,
                  })}
                >
                  {item.link ? <span><a href={getLink(item.link)}>{item.text}</a>{item.imgUrl ? <img className={"menu-img"} src={item.imgUrl} /> : null}</span> : null}
                  {item.children ? <div className="nav-container"><div className="word"><a >{item.text}</a>{item.imgUrl ? <img className={"menu-img"} src={item.imgUrl} /> : null}</div><ul className="sub-nav-container" style={{ width: language === 'zh-cn' ? 220 : 290 }}>{item.children.map((child) => <li><a href={child.link} target="_blank">{child.text}</a></li>)}</ul> </div> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
    );
  }
}

Header.defaultProps = defaultProps;
export default Header;
