import React from 'react';
import ReactDOM from 'react-dom';
import { getScrollTop, getLink } from '../../../utils';
import Language from '../../components/language';
import Header from '../../components/header';
import Button from '../../components/button';
import Footer from '../../components/footer';
import Bone from '../../components/bone';
import FunctionItem from './functionItem';
import FeatureItem from './featureItem';
import homeConfig from '../../../site_config/home';
import './index.scss';

class Home extends Language {

  constructor(props) {
    super(props);
    this.state = {
      headerType: 'primary',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const scrollTop = getScrollTop();
      if (scrollTop > 66) {
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
    const language = this.getLanguage();
    const dataSource = homeConfig[language];
    const { headerType } = this.state;
    const headerLogo = headerType === 'primary' ? getLink('/img/nacos_white.png') : getLink('/img/nacos_colorful.png');
    return (
      <div className="home-page">
        <section className="top-section" style={{ background: `url(${getLink('/img/black_dot.png')}) repeat;` }}>
          <Header
            currentKey="home"
            type={headerType}
            logo={headerLogo}
            language={language}
            onLanguageChange={this.onLanguageChange}
          />
          <div className="vertical-middle">
            <img className="product-logo" src={getLink('/img/nacos.png')} />
            <p className="product-desc">{dataSource.brand.briefIntroduction}</p>
            <div className="button-area">
              {
                dataSource.brand.buttons.map(b => <Button type={b.type} key={b.type} link={b.link}>{b.text}</Button>)
              }
            </div>
            <div className="version-note">
              <a target="_blank" rel="noopener noreferrer" href={getLink(dataSource.brand.version.link)}>{dataSource.brand.version.text}</a>
              <a target="_blank" rel="noopener noreferrer" href={getLink(dataSource.brand.note.link)}>{dataSource.brand.note.text}</a>
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
        <Footer logo={getLink('/img/nacos_gray.png')} language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Home />, document.getElementById('root'));

export default Home;
