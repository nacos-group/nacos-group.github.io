import { useEffect, useState, useRef } from "preact/hooks";
import Tableplugin from "./Tableplugin.jsx";
import MobileTable from "./MobileTable.jsx";
import UpDown from "./UpDown.jsx";
import {
  versionDataSource
} from "../../../consts.ts";
import { isSafari } from "@/utils/util.ts";
import "./style.css";


const FunctionalCompare = (props) => {
  const dataVersion = ['社区版', '开发版', '专业版', 'Serverless 版']

  const versionContain = {
    '社区版': 'free',
    '开发版': 'develop',
    '专业版': 'speciality',
    'Serverless 版': 'serverless',
  }
  const [isSafariBrowser, setIsSafariBrowser] = useState(true);
  const [version, setVersion] = useState('社区版');
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
              <p class="mb-6 text-2xl font-normal">各个版本能力对比</p>
            </th>
            <th class="col3 overflow-hidden">
              <p class="mb-6 text-2xl font-normal">社区版</p>
            </th>
            <th class="col4">
              <p class="mb-6 text-2xl font-normal">MSE Nacos 开发版</p>
            </th>
            <th class="col5">
              <p class="mb-6 text-2xl font-normal">MSE Nacos 专业版</p>
            </th>
            <th class="col6">
              <p class="mb-6 text-2xl font-normal">MSE Nacos Serverless 版</p>
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
        <div class="collapse-title text-2xl font-normal">各个版本能力对比</div>
        <div class={`${!isSafariBrowser && 'collapse-content'}`}>
          {versionDataSource.map((item, index) => {
            return (
              <Tableplugin 
                dataSource={item.data} 
                title={item.title} 
                isHead={index == 0} 
                isFold={isSticky && isCollapsed}
              />
            )
          })}
        </div>
      </div>
      {/* <!-- 吸底 --> */}
      {/* {isSticky && isCollapsed && <div id='sticky-table-bottom' class='table table-fixed bg-gray-02 mt-6 px-4'>
        <table class='w-full'>
          <tr>
            <th class="col1 border-0" />
            <th class="col2 border-0" />
            <th class="col3 overflow-hidden">
              <p class="mb-6 text-2xl font-normal"> 社区版</p>
              <div class='h-40 text-gray-08 text-xs mb-1'>
                <p class='mb-2'>免费试用</p>
                <p class='mb-2'>版本描述：完全可控，定制性好，但需要使用者需要有一定的 Nacos 开发运维经验</p>
                <p class='mb-2'>适用场景：可在公共云、专有云、以及其他私有化部署</p>
              </div>
            </th>
            <th class="col4">
              <p class="mb-6 text-2xl font-normal">MSE Nacos 开发版</p>
              <div class='h-40 text-gray-08 text-xs mb-1'>
                <p class='mb-1'>目录价：118元/月起</p>
                <p class='mb-1'>折扣价：47.2元/月起</p>
                <p class='mb-2'>折扣详情：月包7折，年包4折，新老同享</p>
                <p class='mb-2'>版本描述：兼容开源能力，提供默认安全、一定可观测能力、更易用的自动化运维服务</p>
                <p class='mb-2'>适用场景：适用于开发和测试环境（不能升级到专业版，仅用于试用和测试）</p>
              </div>

            </th>
            <th class="col5">
              <p class="mb-6 text-2xl font-normal">MSE Nacos 专业版</p>
              <div class='h-40 text-gray-08 text-xs'>
                <p class='mb-1'>目录价：498元/月起</p>
                <p class='mb-1'>折扣价：209.2元/月起</p>
                <p class='mb-2'>折扣详情：首购4.2折</p>
                <p class='mb-2'>版本描述：兼容开源能力，提供高可用，默认安全、最高性能、完整可观测能力、更易用的自动化运维服务</p>
                <p class='mb-2'>适用场景：适用于所有环境（开发、测试、生产）</p>
              </div>

            </th>
            <th class="col6">
              <p class="mb-6 text-2xl font-normal">MSE Nacos Serverless 版</p>
              <div class='lg:h-60 xl:h-40 text-gray-08 text-xs'>
                <p class='mb-1'>目录价：0.16元/10个连接起</p>
                <p class='mb-1'>折扣价：0.15元/10个连接起</p>
                <p class='mb-2'>折扣详情：节省计划9.5折，新老同享</p>
                <p class='mb-2'>版本描述：兼容开源能力，综合能力接近专业版，提供自动弹性的免运维服务</p>
                <p class='mb-2'>适用场景：适用于所有环境（开发、测试、生产），在每日流量波动大或者是小流量场景，性价比比专业版更高</p>
              </div>
            </th>
          </tr>
        </table>
      </div>
      } */}

      {/* <!-- 移动端 --> */}
      <div class="mobile-content">
        <div>
          <label htmlFor="my_modal_6" className="text-center mb-4 inline-block w-full"  >
            <span class="text-xl">{version}</span>
            <UpDown class="w-8 h-4" />
          </label>

          <input type="checkbox" id="my_modal_6" className="modal-toggle" checked={isShow} onChange={(e) => setIsShow(e.target.checked)} />
          {
            isShow && <div className="modal" role="dialog">
              <div className="modal-box">
                <div className="mb-6" >
                  <span class="text-lg font-bold">选择版本</span>
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
                        onClick={() => { setVersion(it); setIsShow(false) }}
                      >{it}</button>
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