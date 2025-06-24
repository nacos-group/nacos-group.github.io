export const getDataSource = (t) => {
  return ([
    { 
        title: t('cloud.introduce.feature.ai_capability'), 
        data: [
            {
                name: { title: 'MCP Router' },
                free: {
                    checked: false,
                    des: ''
                },
                develop: {
                    checked: false,
                    des: ''
                },
                speciality: {
                    checked: false,
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
                    checked: false,
                    des: ''
                },
                develop: {
                    checked: false,
                    des: ''
                },
                speciality: {
                    checked: false,
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
            develop:  {
                checked: '',
                des: t('cloud.introduce.feature.same_as_community'),
            },
            speciality:{
                checked: '',
                des: '55%',
            },
            serverless: {
                checked: '',
                des: '83%',
            },
        },
    ] },
    { 
        title: t('cloud.introduce.feature.availability'), 
        data: [
        {
            name: {
                title: 'SLA',
            },
            free: {
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
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
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
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
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
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
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
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
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
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
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
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
        //         checked: false,
        //         des: ''
        //     },
        //     develop: {
        //         checked: false,
        //         des: ''
        //     },
        //     speciality: {
        //         checked: false,
        //         des: ''
        //     },
        //     serverless: {
        //         checked: false,
        //         des: ''
        //     },
        // },
    ] },
    { 
        title: t('cloud.introduce.feature.security'), 
        data: [
        {
            name: {
                title: t('cloud.introduce.feature.ram_authentication_system'),
            },
            free: {
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: ''
            },
            speciality: {
                checked: false,
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
                checked: false,
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
                checked: false,
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
    ] },
    { 
        title: t('cloud.introduce.feature.ease_of_use'), 
        data:[
        {
            name: {
                title: t('cloud.introduce.feature.automated_operation'),
            },
            free: {
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
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
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
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
    ] },
  ])
}