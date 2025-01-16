
import { useEffect, useState } from "preact/hooks";
import Correct from "./Correct";
import False from "./False";
import "./style.tableplugin.css";



const Tableplugin = (props) => {
  const { dataSource, title, isHead = false, isFold = false } = props;
  const totalRows = dataSource.length;

  return (
    <div class="overflow-x-auto rounded-2xl mb-6">
      {
        isHead && !isFold && (
          <table class="table table-fixed sticky-table-top">
            <tr>
              <th class="col1 border-0" />
              <th class="col2 border-0" />
              <th class="col3 overflow-hidden">
                <p class="mb-6 text-2xl font-normal">社区版</p>
                <div class='h-40 text-gray-08 text-xs mb-1'>
                  <p class='mb-2'>免费</p>
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
        )
      }
      <table class="table bg-gray-01 rounded-2xl table-fixed">
        {
          dataSource.map((item, index) => {
            return (
              <tr>
                {index === 0 && (
                  <td
                    class="col1 text-[12px] align-top text-center leading-8"
                    rowspan={totalRows}
                  >
                    {title}
                  </td>
                )}
                <td class="col2 text-base font-normal color-gray-14">
                  {item.name.title && <p>{item.name.title}</p>}
                  {item.name.des && <p class="text-xs">{item.name.des}</p>}
                </td>
                <td class="col3 text-center">
                  {typeof item.free.checked === 'boolean' && (item.free.checked ? <Correct /> : <False />)}
                  {item.free.des && (
                    <p class="text-xs font-normal color-gray-08">
                      {item.free.des}
                    </p>
                  )}
                </td>
                <td class="col4 text-center">
                  {typeof item.develop.checked === 'boolean' && (item.develop.checked ? <Correct /> : <False />)}
                  {item.develop.des && (
                    <p class="text-xs font-normal color-gray-08">
                      {item.develop.des}
                    </p>
                  )}

                </td>
                <td class="col5 text-center">
                  {typeof item.speciality.checked === 'boolean' && (item.speciality.checked ? <Correct /> : <False />)}
                  {item.speciality.des && (
                    <p class="text-xs font-normal color-gray-08">
                      {item.speciality.des}
                    </p>
                  )}
                </td>
                <td class="col6 text-center">
                  {typeof item.serverless.checked === 'boolean' && (item.serverless.checked ? <Correct /> : <False />)}
                  {item.serverless.des && (
                    <p class="text-xs font-normal color-gray-08">
                      {item.serverless.des}
                    </p>
                  )}
                </td>
              </tr>
            );
          })
        }
      </table>
    </div>
  );
};

export default Tableplugin;