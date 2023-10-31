import React from "react";
import { translate } from "@docusaurus/Translate";
import { Button, ButtonType } from "../../components";

import BrowserOnly from "@docusaurus/BrowserOnly";
import { getLink } from "../../utils";

// import './index.scss';
// import '../../tailwind.css'

const topData = {
  brandName: "Nacos",
  title: "Nacos Cloud",
  desc: "这里是占位文字这里是占位文字这里是占位文字这里是占位文字这里是占位文字这里是占位文字",
  cardList: [
    {
      title: "免费试用",
      price: "FREE",
      unit: "",
      desc: "免费测试和体验",
      linkName: "点击试用",
      link: "https://free.aliyun.com/?searchKey=nacos&spm=nacos.cloud.topbar.0.0.0",
      feature: ["未购买商业版的用户可领取免费试用", "开发版1C2G，1个月"],
    },
    {
      title: "开发版",
      price: "47.2元",
      unit: "/月起",
      desc: "用于开发环境",
      linkName: "点击订阅",
      link: "https://www.aliyun.com/product/aliware/mse?spm=nacos.cloud.topbar.0.0.0",
      feature: ["月包6折，年包4折，续费不涨价", "1C2G，1个月"],
    },
    {
      title: "生产 - Serverless 实例",
      price: "0.16元",
      unit: "/小时",
      desc: "流量波动大、中小流量等场景，成本更低",
      linkName: "点击订阅",
      link: "https://www.aliyun.com/product/aliware/mse?spm=nacos.cloud.topbar.0.0.0",
      feature: ["按连接数收费", "<=10个连接数"],
    },
    {
      title: "生产 - 普通实例",
      price: "348.6元",
      unit: "/月起",
      desc: "3节点配置，可用性高",
      linkName: "点击订阅",
      link: "https://www.aliyun.com/product/aliware/mse?spm=nacos.cloud.topbar.0.0.0",
      feature: ["按实例子规格收费", "1C2G，1个月"],
    },
  ],
};

const Top = ({ language }: { language?: string }) => {
  return (
    <BrowserOnly>
      {() => (
        <section className="bg-gradient-to-b from-white to-blue-400">
          <div className="mb-8">
            <p className="pt-16 pb-16 text-center text-5xl text-[#4190FF] font-semibold">{topData.title}</p>
            {/* <p className="text-center text-[#353535] font-normal leading-6 mt-14">{topData.desc}</p> */}
          </div>
          <div className="flex justify-center flex-wrap text-center0 pb-8">
            {topData?.cardList?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-[6px] w-80 h-96 mr-4 mb-4 text-center p-8"
                  style={{ boxShadow: "0 -2px 4px 0 rgba(0,0,0,0.06), 0 2px 4px 0 rgba(0,0,0,0.06)" }}
                >
                  <div className="text-[#000] text-base font-[PingFangSC] font-medium">{item?.title}</div>
                  <div className="mt-[24px] text-[#000] text-5xl font-[DINAlternate-Bold]">
                    {item?.price}
                    {item?.unit && <span className="text-xl ml-1.5">{item?.unit}</span>}
                  </div>
                  <div className="mt-[24px]">
                    <Button
                      customStyle={{
                        width: "100%",
                        height: "40px",
                        lineHeight: "40px",
                        // backgroundColor: !item?.unit ? "#267DF7" : "#fff",
                        // color: !item?.unit ? "#fff" : "#267DF7",
                      }}
                      type={!item?.unit ? "free" : "secondary"}
                      link={item?.link}
                      target="_blank"
                    >
                      {item?.linkName}
                    </Button>
                  </div>
                  <div className="my-2 text-[#626262] text-xs">{item?.desc}</div>
                  {item?.feature?.map((el, i) => {
                    return (
                      <div
                        key={i}
                        className="text-left text-xs border-t border-[#979797] leading-9 text-[#000]"
                      >
                        <img
                          src="img/success.png"
                          style={{ width: "13px", display: "inline-block", marginRight: "10px" }}
                        />
                        {el}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {/* <div className="text-left text-xs border-t border-[#979797] leading-5 text-[#000] pt-2 flex">
            <div>
              <img
                src="img/success.png"
                style={{ width: "13px", display: "inline-block", marginRight: "10px" }}
              />
            </div>
            <div>按计算和内存规格付费，500连接数以上推荐实例版</div>
          </div> */}
        </section>
      )}
    </BrowserOnly>
  );
};

export default Top;
