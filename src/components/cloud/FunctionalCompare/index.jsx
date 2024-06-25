import { useEffect, useState, useRef } from "preact/hooks";
import Tableplugin from "./Tableplugin.jsx";
import MobileTable from "./MobileTable.jsx";
import UpDown from "./UpDown.jsx";
import {
  versionDataSource
} from "../../../consts.ts";
import "./style.css";


const FunctionalCompare = (props) => {
  const dataVersion = ['免费版', '开发版', '专业版', 'Serverless 版']

  const versionContain = {
    '免费版': 'free',
    '开发版': 'develop',
    '专业版': 'speciality',
    'Serverless 版': 'serverless',
  }
  const [version, setVersion] = useState('免费版');
  const [isSticky, setIsSticky] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const functionalCompareWrapperRef = useRef(null);

  const handleScroll = () => {
    const wrapper = functionalCompareWrapperRef.current;
    if (wrapper) {
      const distanceFromTop = wrapper.getBoundingClientRect().top;
      setIsSticky(distanceFromTop < 0); // 当距离顶部大于0时展示元素
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // 移除事件监听器
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <functional-compare
      ref={functionalCompareWrapperRef}
      class="functional-compare-wrapper top-[100px] flex flex-col justify-center items-center mt-10"
    >
      <div class="collapse bg-base-200 collapse-arrow bg-gray-02">
        <input type="checkbox" checked />
        <div class="collapse-title text-2xl font-normal">不同版本功能对比</div>
        <div class="collapse-content">
          {versionDataSource.map((item, index) => {
            return (
              <Tableplugin dataSource={item.data} title={item.title} isHead={index == 0} />
            )
          })}
        </div>
      </div>
      {/* <!-- 吸底 --> */}
      {isSticky && <table
        class={`table table-fixed sticky-table-bottom bg-gray-02 mt-6`}
      >
        <tr>
              <th class="col1 border-0" />
              <th class="col2 border-0" />
              <th class="col3 overflow-hidden">
                <p class="mb-6 "> 免费版</p>
                <div class='text-gray-08 text-xs h-16 leading-8'>免费试用</div>
              </th>
              <th class="col4">
                <p class="mb-6"> 开发版</p>
                <p class='text-gray-08 text-xs mb-1'>目录价：118元/月起</p>
                <p class='text-gray-08 text-xs mb-1'>折扣价：47.2元/月起</p>
                <p class='text-gray-08 text-xs mb-1'>折扣详情：月包7折，年包4折，新老同享</p>
              </th>
              <th class="col5">
                <p class="mb-6"> 专业版</p>
                <p class='text-gray-08 text-xs mb-1'>目录价：498元/月起</p>
                <p class='text-gray-08 text-xs mb-1'>折扣价：209.16元/月起</p>
                <p class='text-gray-08 text-xs mb-1'>折扣详情：首购4.2折</p>
              </th>
              <th class="col6">
                <p class="mb-6"> Serverless 版</p>
                <p class='text-gray-08 text-xs mb-1'>目录价：0.16元/10个连接起</p>
                <p class='text-gray-08 text-xs mb-1'>折扣价：0.15元/10个连接起</p>
                <p class='text-gray-08 text-xs mb-1'>折扣详情：节省计划9.5折，新老同享</p>
              </th>
            </tr>
      </table>}

      {/* <!-- 移动端 --> */}
      <div class="mobile-content">
        <div>
          <label htmlFor="my_modal_6" className="text-center mb-4 inline-block w-full"  >
            <span class="text-xl">{version}</span>
            <UpDown class="w-8 h-4" />
          </label>

          <input type="checkbox" id="my_modal_6" className="modal-toggle" checked={isShow}  onChange={(e) => setIsShow(e.target.checked)} />
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
  );
};

export default FunctionalCompare;