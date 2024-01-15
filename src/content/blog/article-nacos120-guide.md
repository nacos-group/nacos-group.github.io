---
title: Nacos 1.2.0权限控制介绍和使用
keywords: [Nacos 1.2.0, nacos]
description: Nacos是阿里巴巴开源的服务发现与配置管理项目，本次发布的1.2.0版本，主要带来的是权限控制。
date: "2020-03-10"
category: article
---

# Nacos 1.2.0 权限控制介绍和使用

<a name="bc2d5709"></a>
# Nacos权限控制设计方案

<a name="If4qS"></a>
## 方案背景
Nacos自开源依赖，权限控制一直需求比较强烈，这也反应了用户需求将Nacos部署到生产环境的需求。最新发布的Nacos 1.2.0版本已经支持了服务发现和配置管理的权限控制，保障用户安全上生产。本文主要介绍Nacos权限控制的设计方案和使用指南。

<a name="YBdcs"></a>
### 什么是权限控制？
在分布式服务调用时，需要对未知的或者不受信任的请求来源的请求进行识别和拒绝。权限控制一般分为两个阶段：身份识别（Authentication）和权限识别（Authorization）。身份认证主要确定访问者的身份，权限识别则判断这个访问者是否有对应资源的权限。

在Nacos的场景中，配置管理的权限控制指的是设置某个配置能否被某个用户读写，这个比较好理解，没有权限的用户旧无法读取或者写入对应的配置。服务发现的权限控制指的是用户是否有权限进行某个服务的注册或者订阅，这里需要注意的是服务发现的权限控制只能够控制用户是否可以从Nacos获取到服务的地址或者在Nacos上修改服务的地址。但是如果已经获取到了服务的地址，Nacos无法在服务真正调用时进行权限控制，这个时候的权限控制需要由服务框架来完成。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576216016307-2da56934-917f-46ec-b3eb-a221bc91a9e0.png#align=left&display=inline&height=240&name=image.png&originHeight=480&originWidth=1904&size=271408&status=done&style=none&width=952#align=left&display=inline&height=480&originHeight=480&originWidth=1904&status=done&style=none&width=1904)


<a name="TvavD"></a>
### 常见实现方式
<a name="xDBnq"></a>
#### 认证（Authentication）

- 用户名+密码
- Cookie（只适用于浏览器）
- Session
- Token（JWT，Oauth，LDAP，SAML，OpenID）
- AK/SK
<a name="vqrqi"></a>
#### 鉴权（Authorization）

- ACL： 规定**资源**可以被哪些**主体**进行哪些操作；
- DAC： 规定**资源**可以被哪些**主体**进行哪些操作 同时，**主体**可以将**资源**的权限，授予其他**主体**；
- MAC：a. 规定**资源**可以被哪些类别的**主体**进行哪些**操作** b. 规定**主体**可以对哪些等级的**资源**进行哪些**操作** 当一个**操作**，同时满足a与b时，允许**操作**；
- RBAC： a. 规定**角色**可以对哪些**资源**进行哪些**操作** b. 规定**主体**拥有哪些**角色**当一个操作，同时满足a与b时，允许**操作**；
- ABAC： 规定哪些**属性**的**主体**可以对哪些**属性**的**资源**在哪些**属性**的情况下进行哪些**操作**。

<a name="liyG7"></a>
## 方案详情
Nacos的权限控制，目标是能够满足用户基本的鉴权需求，同时能够保持扩展性，可以支持去对接用户自带的用户管理系统或者鉴权系统，包括后面和K8S生态以及Service Mesh生态能够无缝的融合。基于这样的考虑，目前Nacos权限控制的设计是自带一个基本的实现，然后可以支持用户扩展。具体的设计如下。

<a name="H0kp9"></a>
### 模块设计
整体的模块设计是尽量将鉴权的逻辑抽象出来，不在服务发现模块或者配置管理模块添加相关的逻辑。通过配置文件可以选择当前使用的鉴权系统。Nacos自带的认证系统使用JWT Token，自带的鉴权系统使用的是RBAC。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576219027093-45345003-c583-46ec-a161-01b5f4b3ff47.png#align=left&display=inline&height=450&name=image.png&originHeight=900&originWidth=1744&size=699757&status=done&style=none&width=872#align=left&display=inline&height=900&originHeight=900&originWidth=1744&status=done&style=none&width=1744)


<a name="jeLdT"></a>
### 认证算法
对于用户来说，不管是在控制台还是在客户端，都是上传用户名和密码来获取一个token，然后后续的每一次到Nacos的请求都会带上这个token来表明身份。这个token会有一个失效时间，对于控制台来说，只需要直接提示用户重新登录即可，对于客户端则需要有一个定期到Nacos刷新token的逻辑。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576219050917-51013ce2-49f3-4a86-b5f9-bd07fc88f8e8.png#align=left&display=inline&height=368&name=image.png&originHeight=736&originWidth=1718&size=575605&status=done&style=none&width=859#align=left&display=inline&height=736&originHeight=736&originWidth=1718&status=done&style=none&width=1718)


<a name="vSB1T"></a>
### 鉴权算法
Nacos自带的鉴权系统使用的是RBAC模型，可以在网上查询相关的资料。

<a name="RZZGa"></a>
#### 数据模型
鉴权的数据模型也是基于标准的RBAC来设计的，分为用户、角色和权限三部分。用户就是由用户名和密码组成的用户信息，角色则是一个逻辑上的用户组，Nacos启动时会自带一个全局管理员的角色，只有这个全局管理员的角色可以进行添加用户、添加角色、添加授权等操作，保证安全性。而权限则是由资源+动作来组成。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576736418792-936a9d1a-5095-47fc-9f87-230abed38384.png#align=left&display=inline&height=451&name=image.png&originHeight=902&originWidth=1834&size=438246&status=done&style=none&width=917#align=left&display=inline&height=902&originHeight=902&originWidth=1834&status=done&style=none&width=1834)


<a name="0bd4753c"></a>
### 接口设计
以下接口涉及到登录和鉴权的所有逻辑，这些接口除了登录接口，其他接口都只能由全局管理员来调用。

<a name="7d94de1c"></a>
#### 用户管理

- 创建用户：POST<br />
/nacos/v1/auth/users?username=xx&password=yy
- 删除用户：DELETE /nacos/v1/auth/users?username=xx&password=yy
- 更新用户：PUT /nacos/v1/auth/users?username=xx&oldPassword=yy&newPassword=zz
- 登录：POST<br />
/nacos/v1/auth/users/login?username=xxx&password=yyy

<a name="3f856ec2"></a>
#### 角色管理

- 创建角色/绑定用户到角色：POST /nacos/v1/auth/roles?role=xx&username=yy
- 删除某个用户的角色：DELETE /nacos/v1/auth/roles?role=xx&username=yy
- 获取用户的所有角色：GET /nacos/v1/auth/roles?username=xxx

<a name="23bbdd59"></a>
#### 权限管理

- 给角色添加权限：POST /nacos/v1/auth/permissions?role=xxx&resource=yyy&action=zzz
- 从角色删除权限：DELETE /nacos/v1/auth/permissions?role=xxx&resource=yyy&action=zzz
- 获取某个角色的权限：GET /nacos/v1/auth/permissions?role=xxx


<a name="4Hil5"></a>
# Nacos权限控制实战
<a name="TWc9w"></a>
## 安装Nacos 1.2.0

1. 部署包准备。可以直接下载安装包：[https://github.com/alibaba/nacos/releases/tag/1.2.0](https://github.com/alibaba/nacos/releases/tag/1.2.0)，也可以将Nacos master分支clone下来进行源码编译：

```bash
mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U
```

2. 安装包解压，然后使用distribution/nacos-mysql.sql进行数据库初始化，主要是新增了users, roles, permissions三张表，standalone模式使用distribution/schema.sql进行初始化。
2. Server端打开权限控制开关。修改con/application.properties内容：

```json
nacos.core.auth.enabled=true
```

这个开关采用了热加载模式，无需重启Server即可生效。因此当权限控制功能使用有异常时，可以直接回滚到不鉴权的模式。

**注意：** Nacos 1.2.0里登录和鉴权是绑定关系，而由于这个开关的默认值为false，因此默认启动时，是没有登录界面的，这点请读者注意。

<a name="xBJZi"></a>
## 使用权限控制

1. 使用管理员账号登录Nacos控制台（如果页面提示错误，可以清空浏览器缓存刷新页面）：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674563-4d235fd9-983c-4b03-b45c-b1e164152ac7.png#align=left&display=inline&height=470&name=image.png&originHeight=940&originWidth=2870&size=274455&status=done&style=none&width=1435#align=left&display=inline&height=940&originHeight=940&originWidth=2870&status=done&style=none&width=2870)


可以看到，左侧边栏增加了一个父菜单和三个子菜单，分别用于权限控制里的用户创建、角色创建以及权限管         理。这个菜单栏只会在管理员登录的时候显示，也就意味着只有管理员才能进行权限的管理和分配。

2. 管理用户。点击“用户列表”，进入用户管理页面，可以进行用户的创建、修改和删除：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674569-a729854e-a72d-4b3b-bc4c-53f9df831f3e.png#align=left&display=inline&height=573&name=image.png&originHeight=1146&originWidth=2872&size=349203&status=done&style=none&width=1436#align=left&display=inline&height=1146&originHeight=1146&originWidth=2872&status=done&style=none&width=2872)

3. 管理角色。因为Nacos的自带的权限是基于角色来进行分配的，因此需要给创建好的用户绑定一些角色：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674603-f69520a1-f53e-4eb7-9186-f2963e7b3d65.png#align=left&display=inline&height=545&name=image.png&originHeight=1090&originWidth=2874&size=346611&status=done&style=none&width=1437#align=left&display=inline&height=1090&originHeight=1090&originWidth=2874&status=done&style=none&width=2874)

4. 管理权限。角色创建好以后，就可以给这个角色赋予特定的权限了：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674580-e22945e1-be3a-46bd-b8f3-11b38eee0786.png#align=left&display=inline&height=581&name=image.png&originHeight=1162&originWidth=2876&size=368264&status=done&style=none&width=1438#align=left&display=inline&height=1162&originHeight=1162&originWidth=2876&status=done&style=none&width=2876)

在“添加资源”对话框里，可以选择绑定的角色，命名空间资源以及对应的动作类型，例如在上图中，我们给角色role1绑定命名空间test的读写权限。然后又因为刚刚我们是将user1绑定到了role1上，那么user1这个用户就可以对test这个命名空间的资源进行读写操作了。

5. 使用user1登录控制台。点击控制台右上角，退出admin账号，然后用刚才创建的user1进行登录：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674574-ca6eee1f-b749-4275-897d-ab9fba0ebf80.png#align=left&display=inline&height=449&name=image.png&originHeight=898&originWidth=2874&size=340563&status=done&style=none&width=1437#align=left&display=inline&height=898&originHeight=898&originWidth=2874&status=done&style=none&width=2874)

如上图所示，首先是左侧的权限管理菜单消失了，因为当前用户不是管理员。其次是会弹出一个鉴权失败的提示框。不用担心，这个提示框意思是user1没有public命名空间的读权限，所以会弹出，但是不影响我们将命名空间切换到test：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674621-bc16b2ad-4a9e-4ebc-83e8-fa41f4a0cba4.png#align=left&display=inline&height=536&name=image.png&originHeight=1072&originWidth=2876&size=554716&status=done&style=none&width=1438#align=left&display=inline&height=1072&originHeight=1072&originWidth=2876&status=done&style=none&width=2876)

如上图所示，我们可以看到test命名空间的配置数据了，下面我们再来介绍客户端的使用。

6. 首先依赖最新的nacos 1.2.0客户端，然后在初始化时添加如下代码：

```java
Properties properties = new Properties();
properties.put(PropertyKeyConst.NAMESPACE, "99a791cf-41c4-4535-9e93-b0141652bad0");
properties.put(PropertyKeyConst.SERVER_ADDR, "127.0.0.1:8848");
// 配置用户名：
properties.put(PropertyKeyConst.USERNAME, "user1");
// 配置密码：
properties.put(PropertyKeyConst.PASSWORD, "pwd1");
ConfigService iconfig = NacosFactory.createConfigService(properties);
```

7. 使用客户端进行正常的读写配置操作。

<a name="8eF0X"></a>
# 我们在招人
阿里巴巴云原生基础技术中台是隶属于阿里云基础产品事业部的核心研发团队，致力于打造稳定、标准、先进的云原生应用基础平台，推动行业面向云原生技术升级与革命。在这里，你将与来自云计算、大数据领域的顶尖技术专家亲密合作，在全球独一无二的场景和规模中从事Kubernetes、Service Mesh、Serverless、Open Application Model（OAM）、Cloud Native Microservices、OpenMessaging、Event Streaming等云原生生态核心基础技术及Apache Dubbo、Apache RocketMQ、Nacos、Arthas等顶级开源项目的研发和落地工作。在标杆级的平台上，既服务阿里巴巴全球经济体，更服务全世界的开发者用户。目前在招聘技术专家岗位，详情可参考：[http://www.posterhr.com/html/CkgpBwD6f?from=timeline&isappinstalled=0](http://www.posterhr.com/html/CkgpBwD6f?from=timeline&isappinstalled=0)（可以直接投递，也可以将简历直接发送到dungu.zpf#alibaba-inc.com。#替换为@）
