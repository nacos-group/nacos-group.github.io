import { useEffect, useState, useRef } from "preact/hooks";
import Tableplugin from "./Tableplugin.jsx";
import MobileTable from "./MobileTable.jsx";
import UpDown from "./UpDown.jsx";
import { isSafari } from "@/utils/util.ts";
import "./style.css";
import { useTranslations } from "@i18n/util";
import { getDataSource } from "./BaseData.js";


const FunctionalCompare = ({ url }) => {
  const t = useTranslations({ url });
  const versionDataSource = getDataSource(t);
  const dataVersion = [
    { key: "1", label: t('cloud.introduce.community.edition') },
    { key: "2", label: t('cloud.introduce.develop.pkg') },
    { key: "3", label: t('cloud.introduce.regular.pkg') },
    { key: "4", label: t('cloud.introduce.serverless.pkg') },
  ];
  const getLabel = (key) => {
    return dataVersion.find(item => item.key === key)?.label;
  };

  const versionContain = {
    '1': 'free',
    '2': 'develop',
    '3': 'speciality',
    '4': 'serverless',
  }
  const [isSafariBrowser, setIsSafariBrowser] = useState(true);
  const [version, setVersion] = useState("1");
  const [isSticky, setIsSticky] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const functionalCompareWrapperRef = useRef(null);

  const handleScroll = () => {
    const wrapper = functionalCompareWrapperRef.current;
    const rem_4 = 180; // 简略版表格头的高度
    if (wrapper) {
      const distanceFromTop = wrapper.getBoundingClientRect();
      setIsSticky(distanceFromTop.top < 0 && (distanceFromTop.bottom - rem_4) > 0); // 当距离顶部大于0时展示元素
    }
  };

  useEffect(() => {
    // 判断是否为safari浏览器
    setIsSafariBrowser(isSafari());
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // 移除事件监听器
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    {
      // 简略版表格头 top: 4rem
      isSticky && isCollapsed && (
        <table class="table table-fixed sticky-title-top bg-gray-02">
          <tr>
            <th class="col1 border-0" />
            <th class="col2 overflow-hidden">
              <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.feature.capability_comparison')}</p>
            </th>
            <th class="col3 overflow-hidden">
              <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.community.edition')}</p>
            </th>
            <th class="col4">
              <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.develop.pkg')}</p>
            </th>
            <th class="col5">
              <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.regular.pkg')}</p>
            </th>
            <th class="col6">
              <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.serverless.pkg')}</p>
            </th>
          </tr>
        </table>
      )
    }
    <functional-compare
      ref={functionalCompareWrapperRef}
      class="functional-compare-wrapper top-[100px] flex flex-col justify-center items-center mt-10"
    >
      <div id='collapse-fold' class="collapse bg-base-200 collapse-arrow bg-gray-02">
      {
          !isSafariBrowser && (<input type="checkbox" checked={isCollapsed} onChange={() => setIsCollapsed(!isCollapsed)} />)
        } 
        <div class="collapse-title text-2xl font-normal">{t('cloud.introduce.feature.capability_comparison')}</div>
        <div class={`${!isSafariBrowser && 'collapse-content'}`}>
          {versionDataSource.map((item, index) => {
            return (
              <Tableplugin 
                t={t}
                dataSource={item.data} 
                title={item.title} 
                isHead={index == 0} 
                isFold={isSticky && isCollapsed}
              />
            )
          })}
        </div>
      </div>

      {/* <!-- 移动端 --> */}
      <div class="mobile-content">
        <div>
          <label htmlFor="my_modal_6" className="text-center mb-4 inline-block w-full"  >
            <span class="text-xl">{getLabel(version)}</span>
            <UpDown class="w-8 h-4" />
          </label>

          <input type="checkbox" id="my_modal_6" className="modal-toggle" checked={isShow} onChange={(e) => setIsShow(e.target.checked)} />
          {
            isShow && <div className="modal" role="dialog">
              <div className="modal-box">
                <div className="mb-6" >
                  <span class="text-lg font-bold">{t('cloud.introduce.select_version')}</span>
                  <span
                    class="absolute right-8  "
                    onclick={() => { setIsShow(false) }}
                  >✕</span>
                </div>
                <div class="flex flex-col">
                  {dataVersion.map((it, index) => {
                    return (
                      <button
                        class="btn-select h-12 mb-4 bg-gray-02"
                        onClick={() => { 
                          setVersion(it.key); 
                          setIsShow(false) 
                        }}
                      >
                        {it.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>}
        </div>
        <div>
          {
            versionDataSource.map((item, index) => {
              return (
                <MobileTable
                  dataSource={item.data}
                  title={item.title}
                  version={versionContain[version]}
                />
              );
            })
          }
        </div>
      </div>
    </functional-compare>
    </>
  );
};

export default FunctionalCompare;