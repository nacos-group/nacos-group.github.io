---
title: CONFIGURE ENCRYPTION
keywords: [AES,ENCRYPTION,CONFIGURE ENCRYPTION]
description: CONFIGURE ENCRYPTION
sidebar:
    order: 3
---

> To ensure the security of users' sensitive configuration data, Nacos provides a new feature of configuration encryption. The risk of user usage is reduced, and the configuration is no longer required to be encrypted separately.

# Preconditions

**Version:**

The old version is temporarily incompatible. Currently, it is only based on the 2.x version. The recommended version is > 2.0.4.

**Embedded database startup:**

The database table config_info, config_info_beta, his_config_info needs to add a new field `encrypted_data_key` to store the key used for encryption of each configuration item. This field has been added to the sql of the new version of the default table creation.

If you have used the single-machine mode of the embedded database before, you need to delete the nacos/data folder, and the table will be recreated after restarting.

**MySQL start:**

The database table config_info, config_info_beta, his_config_info needs to add a new field `encrypted_data_key` to store the key used for encryption of each configuration item. This field has been added to the sql of the new version of the default table creation.

> For the currently built Nacos, use the following sql to add fields to the corresponding table:
>
> ``ALTER TABLE table_name ADD COLUMN `encrypted_data_key` text  NOT NULL COMMENT '秘钥'``

# Plug-in implementation

![](https://tva1.sinaimg.cn/large/008i3skNly1gvsu112vnnj314b0u0764.jpg)

The operations of encryption and decryption are abstracted through the SPI mechanism, and Nacos provides the implementation of `AES` by default. Users can also customize the implementation of encryption and decryption. The specific implementation is in the [nacos-plugin](https://github.com/nacos-group/nacos-plugin) repository.

When the Nacos server starts, all dependent encryption and decryption algorithms will be loaded, and then by publishing the prefix of the configured `dataId` to match whether encryption and decryption are required and the encryption and decryption algorithms used.

The configuration published by the client will be encrypted and decrypted by the filter on the client side, that is, the configuration is in cipher text during the transmission process. The configuration published by the console will be processed on the server side.

# How to use

The Nacos encryption and decryption plug-in is pluggable, and it does not affect the operation of the core functions of Nacos. If you want to use the configuration encryption and decryption functions of Naocs, you need to refer to the implementation of the encryption algorithm separately. Both the client and the server use the AES encryption and decryption algorithm by adding the following dependencies. The server is recommended to add it to the config module.

```
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-aes-encryption-plugin</artifactId>
            <version>${nacos-aes-encryption-plugin.version}</version>
        </dependency>
```
${nacos-aes-encryption-plugin.version} Get the latest version of the plugin。

> The plugin doesn't upload to Maven Central Repository, you need to compile it by yourslfe

# How to compile

You need to compile `nacos` and install to your local repository,before all the things.

1. `git clone git@github.com:alibaba/nacos.git`
2. `cd nacos && mvn -B clean package install -Dmaven.test.skip=true`

> if during this time occur an error that maven can't resolve `${revision}`, you may need to update maven version to latest.

3. `git clone git@github.com:nacos-group/nacos-plugin.git`
4. `mvn install`

Done, enjoy it!

Suggestion: upload to your company repository if you can

# Create encryption configuration

- Open the Nacos console and click New Configuration.

  ![](https://tva1.sinaimg.cn/large/e6c9d24ely1h0cxaklw10j21g20u0ac8.jpg)
- The configuration prefix uses cipher-[encryption algorithm name]-dataId to identify that the configuration needs to be encrypted, and the system will automatically identify and encrypt it. For example use the AES algorithm to decrypt the configuration: cipher-aes-application-dev.yml.

  ![](https://tva1.sinaimg.cn/large/e6c9d24ely1h0cxs40s2tj21b40u0whw.jpg)
- Click Save to view the database

  ![](https://tva1.sinaimg.cn/large/e6c9d24ely1h0cxwhdc77j21xm0bumz2.jpg)