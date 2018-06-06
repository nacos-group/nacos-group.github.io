import React from 'react';
import { scroller } from 'react-scroll';
import path from 'path';
import Header from '../../components/header';
import Bar from '../../components/bar';
import Sidemenu from '../../components/sidemenu';
import Footer from '../../components/footer';
import siteConfig from '../../../site_config/site';
import docsConfig from '../../../site_config/docs';
import docsData from '../../../md_json/docs.json';
import './index.scss';

// 锚点正则
const anchorReg = /^#[^/]/;
// 相对地址正则，包括./、../、直接文件夹名称开头、直接文件开头
const relativeReg = /^((\.{1,2}\/)|([\w-]+[/.]))/;

class Documentation extends React.Component {

  componentDidMount() {
    const filename = this.props.match.url.split('/').slice(2).join('/');
    // 获取当前文档所在的部分的相对路径，除去文件名
    const relativePath = filename.split('/').slice(0, -1).join('/');
    const language = siteConfig.defaultLanguage;
    const imgs = Array.from(this.markdownContainer.querySelectorAll('img'));
    const alinks = Array.from(this.markdownContainer.querySelectorAll('a'));
    imgs.forEach((img) => {
      const src = img.getAttribute('src');
      if (relativeReg.test(src)) {
        img.src = path.join('./docs', language, relativePath, src);
      }
    });
    alinks.forEach((alink) => {
      const href = alink.getAttribute('href');
      if (relativeReg.test(href)) {
        alink.href = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}#/${path.join('./docs', relativePath, href)}`;
      }
    });
    this.markdownContainer.addEventListener('click', (e) => {
      const isAnchor = e.target.nodeName.toLowerCase() === 'a' && e.target.getAttribute('href') && anchorReg.test(e.target.getAttribute('href'));
      if (isAnchor) {
        e.preventDefault();
        const id = e.target.getAttribute('href').slice(1);
        scroller.scrollTo(id, {
          duration: 1000,
          smooth: 'easeInOutQuint',
        });
      }
    });
  }

  componentDidUpdate() {
    // 需要加上这个，否则点击浏览器回退时，componentDidMount不触发
    this.componentDidMount();
  }

  render() {
    const language = siteConfig.defaultLanguage;
    const dataSource = docsConfig[language];
    const filename = this.props.match.url.split('/').slice(2).join('/');
    const md = docsData[language].find(doc => doc.filename === filename);
    const __html = md && md.__html ? md.__html : '';
    return (
      <div className="documentation-page">
        <Header type="normal" logo="./img/nacos_colorful.png" />
        <Bar img="./img/docs.png" text={dataSource.barText} />
        <section className="content-section">
          <div className="content-body">
            <Sidemenu dataSource={dataSource.sidemenu} />
            <div
              className="doc-content markdown-body"
              ref={(node) => { this.markdownContainer = node; }}
              dangerouslySetInnerHTML={{ __html }}
            />
          </div>
        </section>
        <Footer logo="./img/nacos_gray.png" />
      </div>
    );
  }
}

export default Documentation;
