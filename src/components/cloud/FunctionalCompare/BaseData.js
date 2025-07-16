export const getDataSource = (t) => {
  return ([
    {
      title: '基础信息',
      data: [
        {
          name: { title: '版本描述' },
          free: {
            checked: '',
            des: '完全可控，定制性好，但需要使用者需要有一定的 Nacos 开发运维经验'
          },
          develop: {
            checked: '',
            des: '兼容开源能力，提供默认安全、一定可观测能力、更易用的自动化运维服务'
          },
          speciality: {
            checked: '',
            des: '兼容开源能力，提供高可用，默认全、最高性能、完整可观测能力、更易用的自动化运维服务'
          },
          serverless: {
            checked: '',
            des: '兼容 Nacos3.0，稳定性99.99%，提供云盘加密提升安全性，比开源自建高300%+推送性能，提供 MCP Router 和 Registry 能力。'
          },
        },
        {
          name: { title: '适用场景' },
          free: {
            checked: '',
            des: '可在公共云、专有云、以及其他私有化部署'
          },
          develop: {
            checked: '',
            des: '适用于开发和测试环境（不能升级到专业版，仅用于试用和测试）'
          },
          speciality: {
            checked: '',
            des: '适用于所有环境（开发、测试、生产）'
          },
          serverless: {
            checked: '',
            des: '适用于所有环境（开发、测试、生产），以及MCP 的开发和部署。'
          },
        },
        {
          name: { title: 'Nacos 3.0 托管' },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: '',
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },

      ]
    },
    {
      title: t('cloud.introduce.feature.ai_capability'),
      data: [
        {
          name: { title: 'MCP Router' },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: '',
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: { title: 'MCP Registry' },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: '',
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
      ]
    },
    {
      title: t('cloud.introduce.feature.availability'),
      data: [
        {
          name: {
            title: 'SLA',
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: t('cloud.introduce.feature.no_sla_guarantee')
          },
          speciality: {
            checked: '',
            des: '99.95%',
          },
          serverless: {
            checked: '',
            des: '99.99%'
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.risk_auto_scan_management'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.abnormal_node_self_healing'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.config_label_gray'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.multi_node_disaster_recovery'),
            des: ''
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.multi_availability_zone_disaster_recovery'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.empty_push_protection'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.traffic_protection'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.quota_management'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.lossless_change_capability'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        // {
        //     name: {
        //         title: t('cloud.introduce.feature.auto_scaling'),
        //     },
        //     free: {
        //         checked: '',
        //         des: ''
        //     },
        //     develop: {
        //         checked: '',
        //         des: ''
        //     },
        //     speciality: {
        //         checked: '',
        //         des: ''
        //     },
        //     serverless: {
        //         checked: '',
        //         des: ''
        //     },
        // },
      ]
    },
    {
      title: t('cloud.introduce.feature.security'),
      data: [
        {
          name: {
            title: t('cloud.introduce.feature.ram_authentication_system'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.access_mode_without_ak'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.acl_whitelist_access_control'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.tls_transmission_encryption'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.kms_config_storage_encryption'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.vulnerability_hot_fix'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.data_source_management'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: '',
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
      ]
    },
    {
      title: t('cloud.introduce.feature.ease_of_use'),
      data: [
        {
          name: {
            title: t('cloud.introduce.feature.automated_operation'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.domain_auto_binding'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.fault_node_self_healing'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.default_integration'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.smooth_migration_tool'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.eureka_protocol_compatibility'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.event_center'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.default_grafana_integration'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.default_monitoring_alert'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: true,
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.advanced_monitoring'),
          },
          free: {
            checked: '',
            des: ''
          },
          develop: {
            checked: '',
            des: ''
          },
          speciality: {
            checked: true,
            des: ''
          },
          serverless: {
            checked: true,
            des: ''
          },
        },
      ]
    },
    {
      title: t('cloud.introduce.feature.performance'),
      data: [
        {
          name: {
            title: t('cloud.introduce.feature.push_performance_improvement'),
          },
          free: {
            checked: '',
            des: t('cloud.introduce.feature.self_tuning'),
          },
          develop: {
            checked: '',
            des: t('cloud.introduce.feature.same_as_community'),
          },
          speciality: {
            checked: '',
            des: '202%',
          },
          serverless: {
            checked: '',
            des: '300%'
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.tps_performance_improvement'),
          },
          free: {
            checked: '',
            des: t('cloud.introduce.feature.self_tuning'),
          },
          develop: {
            checked: '',
            des: t('cloud.introduce.feature.same_as_community'),
          },
          speciality: {
            checked: '',
            des: '40%',
          },
          serverless: {
            checked: '',
            des: '60%'
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.qps_performance_improvement'),
          },
          free: {
            checked: '',
            des: t('cloud.introduce.feature.self_tuning'),
          },
          develop: {
            checked: '',
            des: t('cloud.introduce.feature.same_as_community'),
          },
          speciality: {
            checked: '',
            des: '55%',
          },
          serverless: {
            checked: '',
            des: '83%',
          },
        },
      ]
    },
  ])
}
export const getPrivateDataSource = (t) => {
  return ([
    {
      title: '基础信息',
      data: [
        {
          name: { title: '版本描述' },
          free: {
            checked: '',
            des: '完全可控，定制性好，但需要使用者需要有一定的 Nacos 开发运维经验'
          },
          exclusive: {
            checked: '',
            des: '兼容 Nacos3.0，稳定性 99.99%，提供云盘加密提升安全性，比开源自建高300%+推送性能，提供 MCP Router 和 Registry 能力。'
          },
        },
        {
          name: { title: '适用场景' },
          free: {
            checked: '',
            des: '可在公共云、专有云、以及其他私有化部署'
          },
          exclusive: {
            checked: '',
            des: '适用于所有环境（开发、测试、生产），以及 MCP 的开发和部署。'
          },
        },
        {
          name: { title: 'Nacos 3.0 托管' },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },

      ]
    },
    {
      title: t('cloud.introduce.feature.ai_capability'),
      data: [
        {
          name: { title: 'MCP Router' },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: { title: 'MCP Registry' },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
      ]
    },
    {
      title: t('cloud.introduce.feature.availability'),
      data: [
        {
          name: {
            title: 'SLA',
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: '',
            des: '99.99%'
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.risk_auto_scan_management'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.abnormal_node_self_healing'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.config_label_gray'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.multi_node_disaster_recovery'),
            des: ''
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.multi_availability_zone_disaster_recovery'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.empty_push_protection'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.traffic_protection'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.quota_management'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.lossless_change_capability'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: '自动扩缩容',
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: '',
            des: ''
          },
        }
      ]
    },
    {
      title: t('cloud.introduce.feature.security'),
      data: [
        {
          name: {
            title: t('cloud.introduce.feature.ram_authentication_system'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.access_mode_without_ak'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.acl_whitelist_access_control'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.tls_transmission_encryption'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.kms_config_storage_encryption'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.vulnerability_hot_fix'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
      ]
    },
    {
      title: t('cloud.introduce.feature.ease_of_use'),
      data: [
        {
          name: {
            title: t('cloud.introduce.feature.automated_operation'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.domain_auto_binding'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.fault_node_self_healing'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.default_integration'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.smooth_migration_tool'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.eureka_protocol_compatibility'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.event_center'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.default_grafana_integration'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.default_monitoring_alert'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.advanced_monitoring'),
          },
          free: {
            checked: '',
            des: ''
          },
          exclusive: {
            checked: true,
            des: ''
          },
        },
      ]
    },
    {
      title: t('cloud.introduce.feature.performance'),
      data: [
        {
          name: {
            title: t('cloud.introduce.feature.push_performance_improvement'),
          },
          free: {
            checked: '',
            des: t('cloud.introduce.feature.self_tuning'),
          },
          exclusive: {
            checked: '',
            des: '300%',
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.tps_performance_improvement'),
          },
          free: {
            checked: '',
            des: t('cloud.introduce.feature.self_tuning'),
          },
          exclusive: {
            checked: '',
            des: '60%',
          },
        },
        {
          name: {
            title: t('cloud.introduce.feature.qps_performance_improvement'),
          },
          free: {
            checked: '',
            des: t('cloud.introduce.feature.self_tuning'),
          },
          exclusive: {
            checked: '',
            des: '83%',
          },
        },
      ]
    },
  ])
}