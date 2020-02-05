# Nacos 1.2.0-beta.0

（注：目前发布的是1.2.0 beta版本，本文目的在于告诉大家如何使用最新功能，但是不推荐替换到生产环境）

Nacos是阿里巴巴开源的服务发现与配置管理项目，本次发布的1.2.0-beta.0版本，主要带来的是权限控制。本文将介绍包括这个功能在内的新版本发布的功能。

<a name="GdnN0"></a>
## 升级指南
<a name="SXacG"></a>
#### 服务端
0.8.0及以上版本：

1. 解压安装包后替换{nacos.home}/target/nacos-server.jar
1. 逐台重启Nacos Server即可

0.8.0以下版本，先升级到1.0.0版本。
<a name="CNPhB"></a>
#### 客户端
替换pom依赖即可。

<a name="qFsYS"></a>
## 权限控制
这个版本的最大更新，是支持了命名空间粒度的权限控制。管理员可以针对不同的用户角色，授权某个命名空间的读写权限，来达到数据隔离的目的，关于权限控制的设计方案可以参考[https://nacos.io/zh-cn/blog/access%20control%20design.html](https://nacos.io/zh-cn/blog/access%20control%20design.html)。这里介绍下权限控制功能的使用方式：

0. 使用distribution/nacos-mysql.sql进行数据库初始化，主要是新增了users, roles, permissions三张表。

1. Server端打开权限控制开关。修改con/application.properties内容：

```json
nacos.core.auth.enabled=true
```
这个开关采用了热加载模式，无需重启Server即可生效。因此当权限控制功能使用有异常时，可以直接回滚到不鉴权的模式。

2. 使用管理员账号登录Nacos控制台：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674563-4d235fd9-983c-4b03-b45c-b1e164152ac7.png#align=left&display=inline&height=470&name=image.png&originHeight=940&originWidth=2870&size=274455&status=done&style=none&width=1435)<br />
<br />可以看到，左侧边栏增加了一个父菜单和三个子菜单，分别用于权限控制里的用户创建、角色创建以及权限管         理。这个菜单栏只会在管理员登录的时候显示，也就意味着只有管理员才能进行权限的管理和分配。

3. 管理用户。点击“用户列表”，进入用户管理页面，可以进行用户的创建、修改和删除：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674569-a729854e-a72d-4b3b-bc4c-53f9df831f3e.png#align=left&display=inline&height=573&name=image.png&originHeight=1146&originWidth=2872&size=349203&status=done&style=none&width=1436)

4. 管理角色。因为Nacos的自带的权限是基于角色来进行分配的，因此需要给创建好的用户绑定一些角色：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674603-f69520a1-f53e-4eb7-9186-f2963e7b3d65.png#align=left&display=inline&height=545&name=image.png&originHeight=1090&originWidth=2874&size=346611&status=done&style=none&width=1437)

5. 管理权限。角色创建好以后，就可以给这个角色赋予特定的权限了：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674580-e22945e1-be3a-46bd-b8f3-11b38eee0786.png#align=left&display=inline&height=581&name=image.png&originHeight=1162&originWidth=2876&size=368264&status=done&style=none&width=1438)

在“添加资源”对话框里，可以选择绑定的角色，命名空间资源以及对应的动作类型，例如在上图中，我们给角色role1绑定命名空间test的读写权限。然后又因为刚刚我们是将user1绑定到了role1上，那么user1这个用户就可以对test这个命名空间的资源进行读写操作了。<br />

6. 使用user1登录控制台。点击控制台右上角，退出admin账号，然后用刚才创建的user1进行登录：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674574-ca6eee1f-b749-4275-897d-ab9fba0ebf80.png#align=left&display=inline&height=449&name=image.png&originHeight=898&originWidth=2874&size=340563&status=done&style=none&width=1437)

如上图所示，首先是左侧的权限管理菜单消失了，因为当前用户不是管理员。其次是会弹出一个鉴权失败的提示框。不用担心，这个提示框意思是user1没有public命名空间的读权限，所以会弹出，但是不影响我们将命名空间切换到test：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333810/1580890674621-bc16b2ad-4a9e-4ebc-83e8-fa41f4a0cba4.png#align=left&display=inline&height=536&name=image.png&originHeight=1072&originWidth=2876&size=554716&status=done&style=none&width=1438)

如上图所示，我们可以看到test命名空间的配置数据了，下面我们再来介绍客户端的使用。

7. 首先依赖最新的nacos 1.2.0客户端，然后在初始化时添加如下代码：

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

8. 使用客户端进行正常的读写配置操作。



