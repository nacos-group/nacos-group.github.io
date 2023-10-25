import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Top from './home/top';
import MseMap from './home/msemap';
import Feature from './home/feature';
import User from './home/users';
// import Community from './home/community';
import { Footer } from '../components';
import './index.scss';
import Function from './home/function/index';
import { getLink } from '../utils';
import 'tailwindcss/tailwind.css';
import './tailwind.css'

export default function Home(): React.Element {
  const { siteConfig, i18n } = useDocusaurusContext();
  const curLang = i18n.currentLocale;
  const el = React.useRef<HTMLDivElement>(null);

//   const setEleBg = (ele: HTMLDivElement, isTransparent: boolean) => {
//     if (isTransparent) {
//       ele.style.backgroundColor = 'transparent';
//       ele.style.boxShadow = 'unset';
//     } else {
//       ele.style.backgroundColor = '#fff';
//       ele.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 1px 2px 0px';
//     }
//   };

//   React.useEffect(() => {
//     el.current = document.getElementsByClassName('navbar')[0] as HTMLDivElement;
//     el.current.style.position = 'fixed';
//     el.current.style.width = '100%';

//     setEleBg(el.current, true);
//     const onScroll = () => {
//       const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
//       setEleBg(el.current, scrollTop < 60);
//     };
//     window.addEventListener('scroll', onScroll);
//   }, []);

  return (
    <Layout title={'Nacos'} description="Nacos official site">
    <div ref={el} className="home-page">
      <Top language={curLang} />
      <Function />
      <MseMap />
      <Feature />
      <User />
      {/* <Community /> */}
      <Footer logo={getLink("img/nacos_gray.png")} />
    </div>
  </Layout>
  );
}