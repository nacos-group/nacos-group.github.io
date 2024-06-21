---
title: 配置加密
keywords: [Nacos, 配置加密, AES, 数据安全, SPI, 加密算法, MySQL, 内嵌数据库]
description: Nacos新特性支持配置加密，确保用户敏感数据安全，适用于2.x版本以上，通过SPI机制实现AES加密等插件化加解密操作，无需单独加密配置。用户可自定义加解密方式，服务端与客户端均需引入特定依赖，如nacos-aes-encryption-plugin。加密配置通过控制台便捷创建，以cipher-前缀标识自动加密处理。
sidebar:
    order: 3
---

> 为保证用户敏感配置数据的安全，Nacos 提供了配置加密的新特性。降低了用户使用的风险，也不需要再对配置进行单独的加密处理。

# 前提条件

**版本:**

老版本暂时不兼容，目前只基于2.x版本进行了改造，推荐版本 > 2.0.4。

**内嵌数据库启动:**

数据库表 config_info、config_info_beta、his_config_info中需要新增字段 `encrypted_data_key` ，用来存储每一个配置项加密使用的秘钥。新版本的默认创建表的sql中已经添加该字段。

如果之前使用过内嵌数据库的单机模式启动，则需要删除 nacos/data 文件夹，在重新启动会重新创建表。

**MySQL启动:**

数据库表 config_info、config_info_beta、his_config_info中需要新增字段 `encrypted_data_key` ，用来存储每一个配置项加密使用的秘钥。新版本的默认创建表的sql中已经添加该字段。

> 对于目前已经搭建好的 Nacos 使用以下 sql 将字段添加到对应的表中：
>
> ``ALTER TABLE table_name ADD COLUMN `encrypted_data_key` text  NOT NULL COMMENT '秘钥'``

# 插件化实现

![](https://tva1.sinaimg.cn/large/008i3skNly1gvsu112vnnj314b0u0764.jpg)

通过 SPI 的机制抽象出加密和解密的操作，Nacos 默认提供 `AES` 的实现。用户也可以自定义加解密的实现方式。具体的实现在 [nacos-plugin](https://github.com/nacos-group/nacos-plugin) 仓库。

在 Nacos 服务端启动的时候就会加载所有依赖的加解密算法，然后通过发布配置的 `dataId` 的前缀来进行匹配是否需要加解密和使用的加解密算法。

客户端发布的配置会在客户端通过filter完成加解密，也就是配置在传输过程中都是密文的。而控制台发布的配置会在服务端进行处理。

# 如何使用

Nacos 加解密插件是可插拔的，有没有都不影响 Nacos 的核心功能的运行。如果想要使用 Naocs 的配置加解密功能需要单独引用加密算法的实现。客户端和服务端都通过添加以下依赖来使用 AES 加解密算法，服务端推荐添加到 config 模块下。

```
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-aes-encryption-plugin</artifactId>
            <version>${nacos-aes-encryption-plugin.version}</version>
        </dependency>
```
${nacos-aes-encryption-plugin.version} 可以获取插件的最新版本。

> 目前插件需要自己编译,并未上传至maven中央仓库

# 如何编译

编译插件之前需要先编译`nacos`并安装至本地仓库.
1. `git clone git@github.com:alibaba/nacos.git`
2. `cd nacos && mvn -B clean package install -Dmaven.test.skip=true`

> 若出现`revision`变量无法解析,请更新`maven`至最新版本

3. `git clone git@github.com:nacos-group/nacos-plugin.git`
4. `mvn install`

建议上传到公司的maven仓库

# 创建加密配置
- 打开 Nacos 控制台，点击新建配置。

  ![](https://tva1.sinaimg.cn/large/e6c9d24ely1h0cxaklw10j21g20u0ac8.jpg)
- 配置前缀使用cipher-[加密算法名称]-dataId来标识这个配置需要加密，系统会自动识别并加密。例如使用 AES 算法来解密配置：cipher-aes-application-dev.yml。

  ![](https://tva1.sinaimg.cn/large/e6c9d24ely1h0cxs40s2tj21b40u0whw.jpg)
- 点击保存,查看数据库

  ![](https://tva1.sinaimg.cn/large/e6c9d24ely1h0cxwhdc77j21xm0bumz2.jpg)