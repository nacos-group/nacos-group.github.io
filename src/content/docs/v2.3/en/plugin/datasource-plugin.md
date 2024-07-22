---
title: Multiple Data Sources
keywords: [Nacos, Multi-data Source Plugin, SPI Mechanism, MySQL, Derby, Data Source Plugin Development]
description: Starting from version 2.2.0, Nacos supports injecting multi-data source plugins through the SPI mechanism, enabling users to easily switch between data sources like MySQL or Derby via configuration. This document details how to implement a multi-data source plugin, its usage, and development guide, encompassing dependency introduction, Mapper interface implementation, and SPI configuration writing, thereby simplifying data source extension and management. Note that this feature is currently in Beta testing and may undergo significant changes in future versions.
sidebar:
    order: 4
---
# Multi-Data Source Plugin
Since version 2.2.0, Nacos has enabled the injection of multiple data source plugins through the SPI mechanism. Upon introducing the corresponding data source implementation, Nacos can select and load the appropriate multi-data source plugin at startup based on the `spring.datasource.platform` configuration item in the `application.properties` file. This document comprehensively explains how to realize such a plugin and make it effective.

> **Note:**
> The multi-data source plugin is currently in Beta testing. Its APIs and interface definitions may undergo substantial modifications in subsequent version upgrades. Please ensure compatibility with your plugin version.

# Plugin Implementation
In the original Config module, all SQL operations were executed by directly using JdbcTemplate with hardcoded SQL statements, leading to high coupling between SQL statements and business logic and supporting only Derby and MySQL data sources. The original architecture of the Config module is depicted as follows.

![](/img/config-old-datasource.png)

The new multi-data source plugin leverages the SPI mechanism to abstract SQL operations by database table into several Mapper interfaces. Implementations of these Mapper interfaces require writing SQL dialect-specific implementations for different data sources. By default, Derby and MySQL Mapper implementations are provided and can be used directly; other data sources necessitate users to load data source plugins. The modified architecture diagram is shown below.

![](/img/config-datasource-plugin.png)

# Usage
1. Users should check if their required data source is supported by the current Nacos. Nacos provides default implementations for Derby and MySQL. If not supported, refer to the plugin development steps below to develop a plugin for personal use or contribution.
2. Modify `spring.datasource.platform` in the `application.properties` to the corresponding data source name and configure related parameters.
3. Compile and run to support this data source.

# How Plugin Developers Can Develop
1. Include the `nacos-datasource-plugin` dependency.
2. Implement special SQL methods in the Mapper interfaces under `com.alibaba.nacos.plugin.datasource.mapper` that pertain to specific database tables, mainly focusing on pagination differences and other dialect peculiarities. Refer to the Derby and MySQL implementations in `com.alibaba.nacos.plugin.datasource.impl`. The mapping between database tables and Mappers is as follows:

|Database Table| Mapper|
|---|---|
|config_info_aggr| ConfigInfoAggrMapper|
|config_info_beta| ConfigInfoBetaMapper|
|config_info|ConfigInfoMapper|
|config_info_tag|ConfigInfoTagMapper|
|config_tags_relation|ConfigTagsRelationMapper|
|his_config_info|HistoryConfigInfoMapper|

3. Write an SPI configuration file named `com.alibaba.nacos.plugin.datasource.mapper.Mapper`, which specifies the classes implementing the Mapper interfaces. See the Derby and MySQL configurations in the config module for reference.
4. Plugin users can then leverage this plugin to achieve operations for the targeted data source by compiling and running it.

# Compilation
Before compiling the plugin, you need to first compile Nacos and install it in your local repository.
1. `git clone git@github.com:alibaba/nacos.git`
2. `cd nacos && mvn -B clean package install -Dmaven.test.skip=true`

> If the `revision` variable cannot be resolved, update Maven to the latest version.

3. `git clone #{Git address of the corresponding data source plugin implementation}`
4. `mvn install`

It's recommended to upload to your company's Maven repository.

# Future Plans
Upcoming version updates include:
- [ ] Further SQL segmentation to reduce SQL statements while enhancing dynamic SQL implementation friendliness.
- [ ] Extraction of differences among various data sources into a list, replaceable via configuration files or classes, facilitating plugin developers in writing plugins.

# Implementations for Other Data Sources
To be added.