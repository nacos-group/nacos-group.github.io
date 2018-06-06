import React from 'react';
import { getScrollTop } from '../../../utils';
import Header from '../../components/header';
import Button from '../../components/button';
import Footer from '../../components/footer';
import Bone from '../../components/bone';
import FunctionItem from './functionItem';
import FeatureItem from './featureItem';
import siteConfig from '../../../site_config/site';
import homeConfig from '../../../site_config/home';
import './index.scss';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      headerType: 'primary',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const scrollTop = getScrollTop();
      if (scrollTop) {
        this.setState({
          headerType: 'normal',
        });
      } else {
        this.setState({
          headerType: 'primary',
        });
      }
    });
  }

  render() {
    const language = siteConfig.defaultLanguage;
    const dataSource = homeConfig[language];
    const { headerType } = this.state;
    const headerLogo = headerType === 'primary' ? './img/nacos_white.png' : './img/nacos_colorful.png';
    return (
      <div className="home-page">
        <section className="top-section">
          <Header
            type={headerType}
            logo={headerLogo}
          />
          <div className="vertical-middle">
            <img className="product-logo" src="./img/nacos.png" />
            <p className="product-desc">{dataSource.brand.briefIntroduction}</p>
            <div className="button-area">
              {
                dataSource.brand.buttons.map(b => <Button type={b.type} link={b.link}>{b.text}</Button>)
              }
            </div>
            <div className="version-note">
              <a target="__blank" href={dataSource.brand.version.link}>{dataSource.brand.version.text}</a>
              <a target="__blank" href={dataSource.brand.note.link}>{dataSource.brand.note.text}</a>
            </div>
            <div className="release-date">{dataSource.brand.releaseDate}</div>
          </div>
          <div className="animation animation1" />
          <div className="animation animation2" />
          <div className="animation animation3" />
          <div className="animation animation4" />
          <div className="animation animation5" />
        </section>
        <section className="function-section">
          <h3>{dataSource.functions.title}</h3>
          <Bone type="dark" />
          <div>
          {
            dataSource.functions.list.map((func, i) => (
              <FunctionItem func={func} key={i} imgFirst={i % 2 === 0} />
            ))
          }
          </div>
        </section>
        <section className="feature-section">
          <div className="feature-section-body">
            <h3>{dataSource.features.title}</h3>
            <Bone type="light" />
            <ul className="feature-list">
            {
              dataSource.features.list.map((feature, i) => (
                <FeatureItem feature={feature} key={i} />
              ))
            }
            </ul>
          </div>
        </section>
        <Footer logo="./img/nacos_gray.png" />
      </div>
    );
  }
}


export default Home;
