import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Top from "./home/top";
import MseMap from "./home/msemap";
import Feature from "./home/feature";
import User from "./home/users";
// import Community from './home/community';
import { Footer } from "../components";
import "./index.scss";
import Function from "./home/function/index";
import { getLink } from "../utils";
import "tailwindcss/tailwind.css";
import "./tailwind.css";

export default function Home(): React.Element {
  const { siteConfig, i18n } = useDocusaurusContext();
  const curLang = i18n.currentLocale;
  const el = React.useRef<HTMLDivElement>(null);

  const setEleBg = (ele: HTMLDivElement, isTransparent: boolean) => {
    if (isTransparent) {
      ele.style.backgroundColor = "transparent";
      ele.style.boxShadow = "unset";
      const allLink = ele?.childNodes[0]?.childNodes[1]?.childNodes;
      allLink?.forEach((item, index) => {
        if (index === 1 || index === 8) {
          // @ts-ignore
          item.childNodes[0].className = "navbar__link text-white";
        } else {
          // @ts-ignore
          if (item?.className === "navbar__item navbar__link") {
            // @ts-ignore
            item.className = "navbar__item navbar__link text-white";
          }
        }
      });
      // @ts-ignore
      ele.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].src = "img/nacos_white.png";
    } else {
      ele.style.backgroundColor = "#fff";
      ele.style.boxShadow = "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px";
      const allLink = ele?.childNodes[0]?.childNodes[1]?.childNodes;
      allLink?.forEach((item, index) => {
        if (index === 1 || index === 8) {
          // @ts-ignore
          item.childNodes[0].className = "navbar__link";
        } else {
          // @ts-ignore
          if (item?.className === "navbar__item navbar__link text-white") {
            // @ts-ignore
            item.className = "navbar__item navbar__link";
          }
        }
      });
      // @ts-ignore
      ele.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].src =
        "img/nacos_colorful.png";
    }
  };

  React.useEffect(() => {
    el.current = document.getElementsByClassName("navbar")[0] as HTMLDivElement;
    el.current.style.position = "fixed";
    el.current.style.width = "100%";
    setEleBg(el.current, true);
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      setEleBg(el.current, scrollTop < 150);
    };
    window.addEventListener("scroll", onScroll);
  }, []);

  return (
    <Layout title={"Nacos"} description="Nacos official site">
      <div ref={el} className="home-page">
        <Top language={curLang} />
        <Function />
        <MseMap />
        <Feature />
        <User />
        {/* <Community /> */}
        <Footer
          logo={getLink(
            "https://img.alicdn.com/imgextra/i3/O1CN01rPQVls1KsLgvPZ6tf_!!6000000001219-2-tps-204-40.png"
          )}
        />
      </div>
    </Layout>
  );
}
