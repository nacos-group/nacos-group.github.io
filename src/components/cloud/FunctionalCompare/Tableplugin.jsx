import Correct from "./Correct";
import False from "./False";
import "./style.tableplugin.css";

const Tableplugin = (props) => {
  const { dataSource, tabType, title, isHead = false, isFold = false, t = () => { } } = props;
  const totalRows = dataSource.length;

  return (
    <div class="overflow-x-auto rounded-2xl mb-6">
      {
        isHead && !isFold && (
          <table class="table table-fixed sticky-table-top">
            <thead>
              <tr>
                <th class="col1 border-0" />
                <th class="col2 border-0" />
                <th class="col3 overflow-hidden">
                  <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.community.edition')}</p>
                </th>
                {tabType.value === "private" ? <th class="col4">
                  <p class="mb-6 text-2xl font-normal">飞天专属版</p>
                </th> : <>
                  <th class="col4">
                    <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.develop.pkg')}</p>
                  </th>
                  <th class="col5">
                    <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.regular.pkg')}</p>
                  </th>
                  <th class="col6">
                    <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.serverless.pkg')}</p>
                  </th>
                </>}
              </tr>
            </thead>
          </table>
        )
      }
      <table class="table bg-gray-01 rounded-2xl table-fixed">
        <tbody>
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
                  {item.develop && <td class="col4 text-center">
                    {typeof item.develop.checked === 'boolean' && (item.develop.checked ? <Correct /> : <False />)}
                    {item.develop.des && (
                      <p class="text-xs font-normal color-gray-08">
                        {item.develop.des}
                      </p>
                    )}

                  </td>}
                  {item.exclusive && <td class="col4 text-center">
                    {typeof item.exclusive.checked === 'boolean' && (item.exclusive.checked ? <Correct /> : <False />)}
                    {item.exclusive.des && (
                      <p class="text-xs font-normal color-gray-08">
                        {item.exclusive.des}
                      </p>
                    )}

                  </td>}
                  {item.speciality && <td class="col5 text-center">
                    {typeof item.speciality.checked === 'boolean' && (item.speciality.checked ? <Correct /> : <False />)}
                    {item.speciality.des && (
                      <p class="text-xs font-normal color-gray-08">
                        {item.speciality.des}
                      </p>
                    )}
                  </td>}
                  {item.serverless && <td class="col6 text-center">
                    {typeof item.serverless.checked === 'boolean' && (item.serverless.checked ? <Correct /> : <False />)}
                    {item.serverless.des && (
                      <p class="text-xs font-normal color-gray-08">
                        {item.serverless.des}
                      </p>
                    )}
                  </td>}
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default Tableplugin;