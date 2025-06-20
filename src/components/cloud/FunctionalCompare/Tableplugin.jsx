
import Correct from "./Correct";
import False from "./False";
import "./style.tableplugin.css";

const Tableplugin = (props) => {
  const { dataSource, title, isHead = false, isFold = false, t = () => {} } = props;
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
                <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.community.edition')}</p>
                <div class='min-h-40 text-gray-08 text-xs mb-1'>
                  <p class='mb-2'>{t('cloud.introduce.community.edition.1')}</p>
                  <p class='mb-2'>{t('cloud.introduce.version_description')}{t('cloud.introduce.full_control')}</p>
                  <p class='mb-2'>{t('cloud.introduce.application_scenarios')}{t('cloud.introduce.deployment_environments')}</p>
                </div>
              </th>
              <th class="col4">
                <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.develop.pkg')}</p>
                <div class='min-h-40 text-gray-08 text-xs mb-1'>
                  <p class='mb-1'>{t('cloud.introduce.catalog_price')}{t('cloud.introduce.price_118')}</p>
                  <p class='mb-1'>{t('cloud.introduce.discount_price')}{t('cloud.introduce.price_47_2')}</p>
                  <p class='mb-2'>{t('cloud.introduce.discount_details')}{t('cloud.introduce.discount_monthly_annual')}</p>
                  <p class='mb-2'>{t('cloud.introduce.version_description')}{t('cloud.introduce.compatible_open_source_1')}</p>
                  <p class='mb-2'>{t('cloud.introduce.application_scenarios')}{t('cloud.introduce.dev_test_environment')}</p>
                </div>

              </th>
              <th class="col5">
                <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.regular.pkg')}</p>
                <div class='min-h-40 text-gray-08 text-xs'>
                  <p class='mb-1'>{t('cloud.introduce.catalog_price')}{t('cloud.introduce.price_498')}</p>
                  <p class='mb-1'>{t('cloud.introduce.discount_price')}{t('cloud.introduce.price_209_2')}</p>
                  <p class='mb-2'>{t('cloud.introduce.discount_details')}{t('cloud.introduce.discount_first_purchase')}</p>
                  <p class='mb-2'>{t('cloud.introduce.version_description')}{t('cloud.introduce.compatible_open_source_2')}</p>
                  <p class='mb-2'>{t('cloud.introduce.application_scenarios')}{t('cloud.introduce.all_environments_1')}</p>
                </div>

              </th>
              <th class="col6">
                <p class="mb-6 text-2xl font-normal">{t('cloud.introduce.serverless.pkg')}</p>
                <div class='min-h-40 text-gray-08 text-xs'>
                  <p class='mb-1'>{t('cloud.introduce.catalog_price')}{t('cloud.introduce.price_0_16')}</p>
                  <p class='mb-1'>{t('cloud.introduce.discount_price')}{t('cloud.introduce.price_0_15')}</p>
                  <p class='mb-2'>{t('cloud.introduce.discount_details')}{t('cloud.introduce.discount_saving_plan')}</p>
                  <p class='mb-2'>{t('cloud.introduce.version_description')}{t('cloud.introduce.compatible_open_source_3')}</p>
                  <p class='mb-2'>{t('cloud.introduce.application_scenarios')}{t('cloud.introduce.all_environments_1')}</p>
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