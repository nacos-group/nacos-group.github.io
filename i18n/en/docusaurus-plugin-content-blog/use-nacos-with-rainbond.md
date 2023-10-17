---
title: Install the HA Nacos cluster in Rainbond with one-click
keywords: [nacos,kubernetes,rainbond,cloudnative]
description: Current documentation describes how to install a high availability Nacos cluster with one click through Rainbond, a cloud native application management platform.
date: 2022-03-16
---

# Rainbond Nacos

Current documentation describes how to install a high availability [Nacos](https://nacos.io) cluster with one-click through [Rainbond](https://www.rainbond.com/?channel=nacos), a cloud native application management platform. This approach is suitable for users who are less familiar with Kubernetes, containerization and other complex technologies, and lowers the barrier to deploying Nacos in Kubernetes.

# Background

## Combination of Rainbond and Nacos

Rainbond is an easy to use open source cloud native application management platform. With the help of it, users can complete the deployment, operation and maintenance of microservices in a graphical interface. With the help of Kubernetes and containerization technology, automatic operation and maintenance capabilities such as fault self-healing and elastic expansion can be endowed to users' applications.

Rainbond has a built-in native Service Mesh microservice framework, and also has a good integration experience with other microservice frameworks such as Spring Cloud and Dubbo. Therefore, a large number of Rainbond users may also be users of the Nacos microservices registry. Instead of worrying about how to deploy a Nacos cluster, the Rainbond team made Nacos a one-click application template for free download and installation by open source users. This installation method greatly reduces the deployment burden of users using Nacos clusters. Currently, versions 1.4.2 and 2.0.4 are supported.

## About application template

Application template is package manager for Rainbond cloud native application management platform. Users can install applications into Rainbond with one-click. No matter how complex the application is, the application template abstracts it into an package, which is installed with docker images of all the components, configuration information, and relationships between all the components.

# Prerequisite

- Deployed Rainbond cloud native application management platform,[Quick Start](https://www.rainbond.com/docs/quick-start/quick-install/?channel=nacos) Can run in a PC within a container.

- Internet connection.

# Quick Start

* **Access the built-in open source app store**

> Select the **App Store** on the left, switch to the **Open Source App Store**, and search **nacos** to find the Nacos-cluster application.

![nacos-1](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-1.png)

* **One-click install**

> Click **Install** on the right of nacos-Cluster to enter the installation page. After filling in simple information, click **OK** to start the installation, and the page automatically jumps to the topology view.

![nacos-2](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-2.png)

Parameters：

| Options | Instructions                                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------- |
| 团队名称    | User-defined workspace isolated by namespace                                                         |
| 集群名称    | Select which K8s cluster Nacos will be deployed to                                                   |
| 选择应用    | Select the application to which Nacos will be deployed, which contains several associated components |
| 应用版本    | Select the version of Nacos, the useable versions are 1.4.2 and 2.0.4                                |

After a few minutes, the Nacos cluster is installed and up and running.

![nacos-3](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-3.png)

* **Testing**

Other microservice components that need to perform service registration can connect to the Nacos cluster using `${NACOS_HOST}:${NACOS_PORT}` after built [dependencies](https://www.rainbond.com/docs/use-manual/user-manual/component-connection/regist_and_discover) to Nacos.

* **Service registration**
  
  ```bash
  curl -X PUT "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080"
  ```

* **Service discovery**
  
  ```bash
  curl -X GET "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName"
  ```

* **Publish config**
  
  ```bash
  curl -X POST "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"
  ```

* **Get config**
  
  ```bash
  curl -X GET "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
  ```

# Advanced

- The one-click installation of the Nacos cluster contains three instances, and the self-organizing and electing of the cluster is done automatically by initContailer.

![nacos-4](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-4.png)

- Mysql is integrated as the data source by default. You can switch to other external data sources by configuring the following environment variables in the **Nacos-server-2.0.4** component's environment configuration.

| Name                     | Necessary | Description       |
| ------------------------ | --------- | ----------------- |
| `MYSQL_SERVICE_HOST`     | Y         | Database address  |
| `MYSQL_SERVICE_PORT`     | Y         | Database port     |
| `MYSQL_SERVICE_USER`     | Y         | Database username |
| `MYSQL_SERVICE_PASSWORD` | Y         | Database password |
| `MYSQL_SERVICE_DB_NAME`  | Y         | Database name     |

- **Nacos-server-2.0.4** data persistence directory is generated by default.

![nacos-5](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-5.png)

- By default, the health check mechanism of **Nacos-server-2.0.4** is configured to ensure that instances are automatically offline when faults occur and online after recovery.

![nacos-6](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-6.png)
