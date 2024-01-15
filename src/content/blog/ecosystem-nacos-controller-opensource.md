---
title: Nacos Controller 项目开源，支持与Kubernetes互通配置
keywords: [Nacos Controller, Kubernetes, Helm, Configuration]
description: Nacos Controller 项目开源，支持与Kubernetes互通配置
date: "2023-12-07"
category: ecosystem
---
# Nacos 2.3.0 正式版发布、 Nacos Controller 项目开源

## Nacos Controller 项目开源

在云原生下，应用代码与运行环境可以通过Helm或Kustomize等软件进行交付、维护、CICD，但应用的Nacos配置依然需要手工地迁移、或使用控制台修改发布配置。借助于[Nacos Controller](https://github.com/nacos-group/nacos-controller)项目，我们可以将Nacos配置管理下移到Kubernetes集群中，又或是可以将Kubernetes中ConfigMap配置上移到Nacos控制台中，从而实现统一管理能力。

### Nacos配置下移到Kubernetes集群中

#### 工作机制

Nacos Controller监听集群内的DC资源，当DC资源发生变化时，Nacos Controller将其中的配置内容同步到Nacos Server中。

![controller1.jpeg](https://cdn.nlark.com/yuque/0/2023/jpeg/1577777/1701660800522-5b1176a6-fec0-4846-a4a8-5b055f194dad.jpeg#averageHue=%23eaeaea&clientId=u4b259127-c8c7-4&from=drop&id=uc60a07bb&originHeight=564&originWidth=2075&originalType=binary&ratio=2&rotation=0&showTitle=false&size=98323&status=done&style=none&taskId=ua3121bf8-444e-41c7-846e-febf49f0b75&title=)

#### 简易Demo

在Nacos Controller中，我们定义了一份CRD：DynamicConfiguration（简称DC），我们将Nacos配置保存在ConfigMap中，对配置的任何修改都通过DC将其中的配置同步到对应的Nacos服务端中。在后续的配置维护中，直接修改对应的ConfigMap即可。以下是一份简易的Demo示例：
```yaml
apiVersion: nacos.io/v1
kind: DynamicConfiguration
metadata:
    name: dc-demo-cluster2server
spec:
  dataIds:
  - data-id1.properties
  - data-id2.yml
  nacosServer:
    endpoint: <your-nacos-server-endpoint>
    namespace: <your-nacos-namespace-id>
    group: <your-nacos-group>
    authRef:
      apiVersion: v1
      kind: Secret
      name: nacos-auth
  strategy:
    syncPolicy: Always
    syncDirection: cluster2server
    syncDeletion: true
  objectRef:
    apiVersion: v1
    kind: ConfigMap
    name: nacos-config-cm

---
apiVersion: v1
kind: ConfigMap
metadata:
    name: nacos-config-cm
    namespace: default
data:
    data-id1.properties: |
      key=value
      key2=value2
    data-id2.yml: |
      app:
        name: test

---
apiVersion: v1
kind: Secret
metadata:
    name: nacos-auth
data:
    ak: <base64 ak>
    sk: <base64 sk>
```

### Kubernetes配置上移到Nacos控制台

#### 工作机制

首先需要用户创建DC资源指定需要同步哪些DataId，Nacos Controller根据读取到的DC配置，选择性监听Nacos Server中的相关配置并将配置改动同步到Kubernetes集群中。

![controller2.jpeg](https://cdn.nlark.com/yuque/0/2023/jpeg/1577777/1701660805211-400086de-5d56-4363-a374-8fcee802fe86.jpeg#averageHue=%23eeeeee&clientId=u4b259127-c8c7-4&from=drop&id=uf848a9ca&originHeight=593&originWidth=2048&originalType=binary&ratio=2&rotation=0&showTitle=false&size=78755&status=done&style=none&taskId=udc0b426f-dbed-445f-9fbb-b17b13da1e4&title=)

#### 简易Demo

云原生下，应用除了需要加载Nacos配置外，还可能依赖一些环境变量，比如JVM参数通过环境变量注入。做得比较好的方式是通过ConfigMap等Kubernetes原生方式管理配置，通过引用的方式传递给应用Pod。在Nacos Controller中，我们可以定义一份DC，将Nacos服务端中的某些DataId同步到Kubernetes集群中的ConfigMap中，从而实现配置的统一管理。以下是一份示例Demo：
```yaml
apiVersion: nacos.io/v1
kind: DynamicConfiguration
metadata:
    name: dc-demo-server2cluster
spec:
  dataIds:
  - APP1_JVM_PARAMS
  - APP2_JVM_PARAMS
  nacosServer:
    endpoint: <your-nacos-server-endpoint>
    namespace: <your-nacos-namespace-id>
    group: <your-nacos-group>
    authRef:
      apiVersion: v1
      kind: Secret
      name: nacos-auth
  strategy:
    syncPolicy: Always
    syncDirection: server2cluster
    syncDeletion: true
---
apiVersion: v1
kind: Secret
metadata:
    name: nacos-auth
data:
    ak: <base64 ak>
    sk: <base64 sk>
```


### 云原生下的配置管理最佳实践

在使用Kubernetes的场景下，一个微服务应用的配置被分割成两部份，一部分存放管理在Kubernetes集群中的Secret或ConfigMap中，另一部份存放管理与Nacos配置中心。对于运维人员，我们需要知道哪些配置是存放在何处且同时需要对两个平台的配置管理操作均有所了解，一来是增加了运维人员的知识门槛，二来是增加了应用配置运维的操作成本。通过Nacos Controller项目，我们将应用的所有配置集中于一处管理，降低应用配置运维的门槛与复杂性。

![controller3.jpeg](https://cdn.nlark.com/yuque/0/2023/jpeg/1577777/1701660810265-31be8807-93b2-4d7f-873c-ec262d883edc.jpeg#averageHue=%23f9f3e5&clientId=u4b259127-c8c7-4&from=drop&id=ua1f78c33&originHeight=620&originWidth=2407&originalType=binary&ratio=2&rotation=0&showTitle=false&size=74161&status=done&style=none&taskId=u90c55cb3-e582-4562-92f3-537ac58daf2&title=)

#### 面向Kubernetes运维偏好的用户

通过Nacos Controller项目，我们将应用与应用配置的交付和维护集中在Kubernetes集群中。

![controller4.jpeg](https://cdn.nlark.com/yuque/0/2023/jpeg/1577777/1701660814268-ee644f29-a68f-4906-b3b9-2e23ef8ddfbd.jpeg#averageHue=%23ece7d9&clientId=u4b259127-c8c7-4&from=drop&id=u71a43cf6&originHeight=947&originWidth=2082&originalType=binary&ratio=2&rotation=0&showTitle=false&size=95807&status=done&style=none&taskId=ude3735a4-736f-4b0a-9bd5-1aa54203794&title=)

以下通过一份Helm应用Chart包说明如何集中管理。
```
.
├── Chart.yaml
├── charts
├── conf
│   ├── application-dev.properties
│   ├── application.properties
│   ├── consumer-app.properties
│   └── provider-app.yaml
├── templates
│   ├── consumer.yaml
│   ├── dc.yaml
│   └── provider.yaml
└── values.yaml
```
以上是一份Chart包目录结构，其中conf目录存放的是Nacos配置，文件名即DataId，文件内容即对应的Content。在templates/dc.yaml中，我们定义一份ConfigMap来组装这些配置。templates目录中的consumer.yaml与provider.yaml分别是应用定义。
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nacos-config
  namespace: {{ .Release.Namespace }}
data:
  {{- range $path, $_ := .Files.Glob "conf/**" }}
  {{ $path | base }}: |-
{{ $.Files.Get $path | indent 4}}
  {{- end }}
```

**使用上述方式定义好应用与配置后，可以借助git实现应用、配置的版本管理。当需要发布应用或配置时，修改对应文件后，执行helm upgrade命令即可。**

#### 面向Nacos运维偏好的用户
Nacos配置管理能力使得应用可以动态调整运行配置，但对于一些特殊的参数，如JVM参数、特殊环境变量、特殊目录文件等内容，Nacos配置管理依然无法涵盖。在Kubernetes集群中，我们一般将环境变量或一些特殊文件配置写入ConfigMap中，通过envFrom能力将内容引用到环境变量中或者volumeMount挂载到文件系统中。这样的配置管理能力与Nacos配置管理能力是散开的，不利于统一管理。借助于Nacos Controller，我们将这些配置上移到Nacos控制台中，进行统一管理。

![controller5.jpeg](https://cdn.nlark.com/yuque/0/2023/jpeg/1577777/1701660827720-fbfb2d66-3c83-40c6-834b-e5d4da2ebe52.jpeg#averageHue=%23ede9df&clientId=u4b259127-c8c7-4&from=drop&id=u2129038b&originHeight=1010&originWidth=2102&originalType=binary&ratio=2&rotation=0&showTitle=false&size=97337&status=done&style=none&taskId=udc37224f-2763-4022-bd6e-da94705b039&title=)

以下是一份Demo应用，通过Nacos控制台管理JVM启动参数
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo-app
  template:
    metadata:
      labels:
        app: demo-app
    spec:
      containers:
      - name: demo-app
        image: openjdk:8 #替换为你的应用镜像
        command: ["/bin/sh", "-c", "java -jar ${JVM_PARAMS} /app.jar"]
        env:
        - name: JVM_PARAMS # 从ConfigMap中载入JVM参数到环境变量中
          valueFrom:
            configMapKeyRef:
              name: nacos-config
              key: APP1_JVM_PARAMS

---
apiVersion: nacos.io/v1
kind: DynamicConfiguration
metadata:
    name: nacos-config
spec:
  dataIds:
  - APP1_JVM_PARAMS
  - APP2_JVM_PARAMS
  nacosServer:
    endpoint: <your-nacos-server-endpoint>
    namespace: <your-nacos-namespace-id>
    group: <your-nacos-group>
    authRef:
      apiVersion: v1
      kind: Secret
      name: nacos-auth
  strategy:
    syncPolicy: Always
    syncDirection: server2cluster
    syncDeletion: true
---
apiVersion: v1
kind: Secret
metadata:
    name: nacos-auth
data:
    ak: <base64 ak>
    sk: <base64 sk>
```
在Nacos控制台中，修改DataId：APP1_JVM_PARAMS后，配置将自动同步到集群的ConfigMap中。只需重启相关应用，则对应的JVM参数将自动变化。**成功实现将应用的所有配置集中管理在Nacos上。**

## About Nacos

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

最后欢迎大家扫码加入Nacos社区群

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1577777/1679276899363-83081d59-67c6-4501-9cf8-0d84ba7c6d7e.png#averageHue=%23c1c2c2&clientId=u9dfeac18-3281-4&from=paste&height=551&id=ubcf45e51&name=image.png&originHeight=1102&originWidth=854&originalType=binary&ratio=2&rotation=0&showTitle=false&size=155261&status=done&style=none&taskId=ud6bea1fe-b003-441b-a810-84435d2aeff&title=&width=427)

