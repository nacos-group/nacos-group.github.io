import { useEffect, useState } from "preact/hooks";
import Correct from "./Correct";

const MobileTable = (props) =>{
const {dataSource, title ,version} = props;


	return (
    <div class="overflow-x-auto rounded-2xl mb-6">
    <table class="table bg-gray-01 rounded-2xl table-fixed">
      {
        dataSource.map((item, index) => {
          return (
            <>
              {index === 0 && <tr>
                <td class="text-xl align-top text-left border-dotted border-b-2  border-gray-03" colspan={2}>
                  {title}
                </td>
              </tr>}
              <tr>
                <td class="text-base font-normal color-gray-14">
                  {item.name.title && <p>{item.name.title}</p>}
                  {item.name.des && <p class="text-xs">{item.name.des}</p>}
                </td>
                <td class="text-center">
                  {item[version]?.checked && <Correct />}
                  {item[version]?.des && (
                    <p class="text-xs font-normal color-gray-08">
                      {item[version]?.des}
                    </p>
                  )}
                </td>
              </tr>
            </>
          );
        })
      }
    </table>
  </div>  
	);
};

export default MobileTable;