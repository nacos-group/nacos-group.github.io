---
title: 多数据源
keywords: [Nacos,多数据源插件,SPI机制,MySQL,Derby,数据源插件开发]
description: Nacos从2.2.0版起支持SPI机制注入多数据源插件，允许用户通过配置轻松切换MySQL或Derby等数据源。本文介绍如何实现多数据源插件、使用方法及开发指南，包括引入依赖、实现Mapper接口和编写SPI配置，简化数据源扩展和管理。注意该功能目前为Beta阶段，可能随版本更新变动。
sidebar:
    order: 4
---

# 多数据源插件
Nacos从2.2.0版本开始,可通过SPI机制注入多数据源实现插件,并在引入对应数据源实现后,便可在Nacos启动时通过读取`application.properties`配置文件中`spring.datasource.platform`配置项选择加载对应多数据源插件.本文档详细介绍一个多数据源插件如何实现以及如何使其生效。

> 注意:
> 目前多数据源插件处于Beta测试阶段,其API及接口方法定义可能会在后续版本升级而有较大修改，请注意您的插件适用版本。

# 插件化实现
在原来的Config模块中，所有的SQL操作的执行是通过直接使用JdbcTemplate执行固定SQL语句的形式，使得SQL语句与业务逻辑高度耦合，并且只支持Derby与MySQL两种数据源，原有Config模块架构如下。

![](/img/config-old-datasource.png)

现在的多数据源插件通过SPI机制，将SQL操作按照数据表进行抽象出多个Mapper接口，Mapper接口的实现类需要按照不同的数据源编写对应的SQL方言实现;
现在插件默认提供Derby以及MySQL的Mapper实现，可直接使用；而其他的数据源则需要用户使用数据源插件进行加载，其改造后架构图如下。

![](/img/config-datasource-plugin.png)

# 如何使用
1. 用户查询当前Nacos是否支持所需数据源，Nacos默认提供Derby以及MySQL的实现，若暂未支持可参考下面插件编写者如何开发步骤开发插件自己使用或贡献；
2. 在`application.properties`配置文件中将`spring.datasource.platform`修改为对应的数据源名称，并配置数据源相关参数；
3. 然后编译运行则可支持此数据源；

# 插件编写者如何开发
1. 引入`nacos-datasource-plugin`依赖
2. 实现`com.alibaba.nacos.plugin.datasource.mapper`包下数据表对应Mapper接口中的特殊SQL方法，主要是涉及分页等方言差别，可参考`com.alibaba.nacos.plugin.datasource.impl`下Derby以及MySQL的实现，只需实现对应接口即可。接口与表对应关系如下：

| 数据库表     | Mapper|
| ----------- | ----------- |
|config_info_aggr| ConfigInfoAggrMapper      |
|config_info_beta| ConfigInfoBetaMapper        |
|config_info|ConfigInfoMapper|
|config_info_tag|ConfigInfoTagMapper|
|config_tags_relation|ConfigTagsRelationMapper|
|his_config_info|HistoryConfigInfoMapper|

3. 编写SPI配置文件，其名字为`com.alibaba.nacos.plugin.datasource.mapper.Mapper`，写入实现Mapper接口的类，可参考config模块中Derby与MySQL配置文件。
4. 插件使用者则可以通过依赖此插件，达到实现对应数据源操作的效果
5. 编译运行

# 如何编译
编译插件之前需要先编译`nacos`并安装至本地仓库.
1. `git clone git@github.com:alibaba/nacos.git`
2. `cd nacos && mvn -B clean package install -Dmaven.test.skip=true`

> 若出现`revision`变量无法解析,请更新`maven`至最新版本

3. `git clone #{对应数据源插件实现Git地址}`
4. `mvn install`

建议上传到公司的maven仓库

# 未来方案
未来的版本更新如下:
- [ ] 继续细分SQL，在现有的基础上，减少SQL语句的同时，对动态SQL的实现更加友好；
- [ ] 抽离不同数据源之间的差异列表，并通过配置文件或配置类的方式进行差异列表的替换，方便插件编写者编写插件；

# 其他数据源的实现
待补充
