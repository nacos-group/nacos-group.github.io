---
id: "question-history-13391"
title: "nacos docker derby下使用grafana 查看nacos monitor 提示 Failed to upgrade legacy queries Datasource prometheus was not found USER : http: prometheus:9090 提示DNS_PROBE_FINISHED_NXDOMAIN nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "根据提供的知识内容，您遇到的问题可能是由于以下原因导致的：1. **DNS解析问题**：DNS_PROBE_FINISHED_NXDOMAIN提示表明客户端无法解析`http://prometheus:9090`这个地址。这可能是因为您的环境中没有正确设置Prometheus服务的DNS记录，或者P"
tags: ["nacos","docker","derby","grafana","nacos monitor","Failed to upgrade legacy queries","Datasource prometheus was not found","http: prometheus:9090","DNS_PROBE_FINISHED_NXDOMAIN"]
keywords: ["nacos","docker","derby","grafana","nacos monitor","Failed to upgrade legacy queries","Datasource prometheus was not found","http: prometheus:9090","DNS_PROBE_FINISHED_NXDOMAIN"]
---

根据提供的知识内容，您遇到的问题可能是由于以下原因导致的：

1. **DNS解析问题**："DNS_PROBE_FINISHED_NXDOMAIN"提示表明客户端无法解析`http://prometheus:9090`这个地址。这可能是因为您的环境中没有正确设置Prometheus服务的DNS记录，或者Prometheus服务未正确运行。

2. **Grafana数据源配置错误**：错误信息"Datasource prometheus was not found"意味着Grafana未能找到名为Prometheus的数据源。确保您已在Grafana中正确配置了指向Prometheus的数据源，并且数据源的URL与Prometheus的实际地址匹配。

为了解决这些问题，请按照以下步骤操作：

### 步骤1：检查Prometheus服务状态
- **对于Docker环境**，请确保Prometheus容器正在运行，并且网络配置正确，以便可以从Grafana容器中访问。可以使用`docker ps`命令查看容器状态，或使用`docker logs <prometheus_container_id>`查看Prometheus容器的日志以确认其运行状态及监听地址。

### 步骤2：验证网络连接
- 在运行Grafana的容器或主机上尝试直接访问Prometheus的地址（例如，使用`curl http://prometheus:9090`），以确认网络可达性。如果无法访问，需要检查网络配置，如Docker网络桥接或DNS设置。

### 步骤3：配置Grafana数据源
- 登录到Grafana界面，导航至数据源设置页面，添加一个新的数据源。
    - **类型**选择Prometheus。
    - **URL**填写`http://prometheus:9090`或根据实际情况调整（特别是如果您使用的是特定端口映射或不同主机名）。
    - 确认配置后保存数据源。

### 步骤4：测试数据源连接
- 在Grafana数据源设置页面，对于刚添加的Prometheus数据源，利用“测试数据源连接”功能确保配置无误。

### 步骤5：使用正确的监控面板
- 确保您在Grafana中使用的监控面板模板与Nacos兼容，并且正确导入了Nacos监控模版（如果尚未导入，请参照提供的链接[[Nacos-Sync监控模版](https://github.com/nacos-group/nacos-template/blob/master/nacos-sync-grafana)]进行操作）。

完成以上步骤后，应当能够解决您遇到的监控数据显示问题。如果问题依旧，请检查Grafana和Prometheus的日志文件，寻找更具体的错误信息来进一步诊断问题。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13886)给我们反馈。
