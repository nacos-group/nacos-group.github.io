
import { useEffect, useState } from "preact/hooks";
import Correct from "./Correct";
import "./style.tableplugin.css";



const Tableplugin = (props) => {
  const { dataSource, title, isHead = false } = props;
  const totalRows = dataSource.length;

  return (
    <div class="overflow-x-auto rounded-2xl mb-6">
      {
        isHead && (
          <table class="table table-fixed sticky-table-top">
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
                    class="col1 text-xs align-top text-center "
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
                  {item.free.checked && <Correct />}
                  {item.free.des && (
                    <p class="text-xs font-normal color-gray-08">
                      {item.free.des}
                    </p>
                  )}
                </td>
                <td class="col4 text-center">
                  {item.develop.checked && <Correct />}
                  {item.develop.des && (
                    <p class="text-xs font-normal color-gray-08">
                      {item.develop.des}
                    </p>
                  )}

                </td>
                <td class="col5 text-center">
                  {item.speciality.checked && <Correct />}
                  {item.speciality.des && (
                    <p class="text-xs font-normal color-gray-08">
                      {item.speciality.des}
                    </p>
                  )}
                </td>
                <td class="col6 text-center">
                  {item.serverless.checked && <Correct />}
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