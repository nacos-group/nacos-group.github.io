# Nacos权限控制设计方案

<a name="oBGKT"></a>
# 方案背景
Nacos自开源以来，权限控制一直需求比较强烈，这也反应了用户需求将Nacos部署到生产环境的需求。Nacos 1.2.0版本将会支持服务发现和配置管理的权限控制，保障用户安全上生产。本文主要介绍Nacos权限控制的设计方案，当然这个方案在1.2.0发布前可能会有少许调整，同时也欢迎广大用户对该方案提出自己的建议。

<a name="FKbJ4"></a>
## 什么是权限控制？
在分布式服务调用时，需要对未知的或者不受信任的请求来源的请求进行识别和拒绝。权限控制一般分为两个阶段：身份识别（Authentication）和权限识别（Authorization）。身份认证主要确定访问者的身份，权限识别则判断这个访问者是否有对应资源的权限。<br />
<br />在Nacos的场景中，配置管理的权限控制指的是设置某个配置能否被某个用户读写，这个比较好理解，没有权限的用户旧无法读取或者写入对应的配置。服务发现的权限控制指的是用户是否有权限进行某个服务的注册或者订阅，这里需要注意的是服务发现的权限控制只能够控制用户是否可以从Nacos获取到服务的地址或者在Nacos上修改服务的地址。但是如果已经获取到了服务的地址，Nacos无法在服务真正调用时进行权限控制，这个时候的权限控制需要由服务框架来完成。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576216016307-2da56934-917f-46ec-b3eb-a221bc91a9e0.png#align=left&display=inline&height=240&name=image.png&originHeight=480&originWidth=1904&size=271408&status=done&style=none&width=952)




<a name="iiXvl"></a>
## 常见实现方式
<a name="SzK17"></a>
### 认证（Authentication）

- 用户名+密码
- Cookie（只适用于浏览器）
- Session
- Token（JWT，Oauth，LDAP，SAML，OpenID）
- AK/SK
<a name="3szY3"></a>
### 鉴权（Authorization）

- ACL： 规定**资源**可以被哪些**主体**进行哪些操作；
- DAC： 规定**资源**可以被哪些**主体**进行哪些操作 同时，**主体**可以将**资源**的权限，授予其他**主体**；
- MAC：a. 规定**资源**可以被哪些类别的**主体**进行哪些**操作** b. 规定**主体**可以对哪些等级的**资源**进行哪些**操作** 当一个**操作**，同时满足a与b时，允许**操作**；
- RBAC： a. 规定**角色**可以对哪些**资源**进行哪些**操作** b. 规定**主体**拥有哪些**角色**当一个操作，同时满足a与b时，允许**操作**；
- ABAC： 规定哪些**属性**的**主体**可以对哪些**属性**的**资源**在哪些**属性**的情况下进行哪些**操作**。
<a name="0FxEV"></a>
## 
<a name="0YQ9P"></a>
## 常见注册中心和配置中心的实现方式
<a name="5yePW"></a>
### Zookeeper
Zookeeper主要使用的是ACL的方式，直接将资源授权给对应的实体。一条授权记录主要由以下部分组成：

- <path>: 设置权限的路径
- <acl_type>: ACL鉴权类型，分为world，ip，auth，digest
- <acl_content>: ACL鉴权内容，与鉴权类型关联
- <action>: CREATE，DELETE，READ，WRITE，ADMIN

操作示例：
```xml
$ setAcl <path> <acl_type>:<acl_content>:<action>
$ setAcl /xxx/yyy world:anyone:cdrwa
$ setAcl /xxx/yyy ip:1.1.1.1:cdrwa
$ addauth digest root:pa55wdsetAcl /xxx/yyy auth:root:cdrwa
```

<a name="GI6TE"></a>
### Consul
Consul的鉴权也是偏向于ACL机制，主要分为三个部分：

- Rule：定义对某个资源的权限
- Policy：将一系列Rule组合成一个Policy
- Token：为某个Token分配一个或多个Policy，API带上Token进行鉴权

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576218881317-bb025c9f-f6ad-4df1-9f7f-f116e8d95671.png#align=left&display=inline&height=240&name=image.png&originHeight=273&originWidth=848&size=49225&status=done&style=none&width=746)

<a name="oLlfm"></a>
### Eureka
Eureka使用的鉴权是基于Spring Security实现的，支持用户名和密码的访问控制，一个简单的例子如下：<br />

```yaml
spring: 
  security: 
  # 开启认证，Spring Cloud2.0后添加jar会自动集成并开启
  #
basic.enabled: true 
  # 用户名密码
  user: 
  name: test 
  password: test
```

<a name="qrC17"></a>
### Apollo
基于RBAC的权限控制，可以在命名空间级别进行资源的授权：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576218970350-01402621-0a13-4102-a590-20c6cefe4918.png#align=left&display=inline&height=118&name=image.png&originHeight=101&originWidth=640&size=21453&status=done&style=none&width=746)

<a name="zH1U3"></a>
# 方案详情
Nacos的权限控制，目标是能够满足用户基本的鉴权需求，同时能够保持扩展性，可以支持去对接用户自带的用户管理系统或者鉴权系统，包括后面和K8S生态以及Service Mesh生态能够无缝的融合。基于这样的考虑，目前Nacos权限控制的设计是自带一个基本的实现，然后可以支持用户扩展。具体的设计如下。
<a name="pd2aV"></a>
## 模块设计
整体的模块设计是尽量将鉴权的逻辑抽象出来，不在服务发现模块或者配置管理模块添加相关的逻辑。通过配置文件可以选择当前使用的鉴权系统。Nacos自带的认证系统使用JWT Token，自带的鉴权系统使用的是RBAC。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576219027093-45345003-c583-46ec-a161-01b5f4b3ff47.png#align=left&display=inline&height=450&name=image.png&originHeight=900&originWidth=1744&size=699757&status=done&style=none&width=872)

<a name="vr4PO"></a>
## 认证算法
对于用户来说，不管是在控制台还是在客户端，都是上传用户名和密码来获取一个token，然后后续的每一次到Nacos的请求都会带上这个token来表明身份。这个token会有一个失效时间，对于控制台来说，只需要直接提示用户重新登录即可，对于客户端则需要有一个定期到Nacos刷新token的逻辑。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576219050917-51013ce2-49f3-4a86-b5f9-bd07fc88f8e8.png#align=left&display=inline&height=368&name=image.png&originHeight=736&originWidth=1718&size=575605&status=done&style=none&width=859)

<a name="9ncb7"></a>
## 鉴权算法
Nacos自带的鉴权系统使用的是RBAC模型，可以在网上查询相关的资料。
<a name="DjMVc"></a>
### 数据模型
鉴权的数据模型也是基于标准的RBAC来设计的，分为用户、角色和权限三部分。用户就是由用户名和密码组成的用户信息，角色则是一个逻辑上的用户组，Nacos启动时会自带一个全局管理员的角色，只有这个全局管理员的角色可以进行添加用户、添加角色、添加授权等操作，保证安全性。而权限则是由资源+动作来组成。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576736418792-936a9d1a-5095-47fc-9f87-230abed38384.png#align=left&display=inline&height=451&name=image.png&originHeight=902&originWidth=1834&size=438246&status=done&style=none&width=917)

<a name="gIPMW"></a>
### 接口设计
以下接口涉及到登录和鉴权的所有逻辑，这些接口除了登录接口，其他接口都只能由全局管理员来调用。
<a name="yA6U0"></a>
#### 用户管理

- 创建用户：POST
/nacos/v1/auth/users?username=xx&password=yy
- 删除用户：DELETE /nacos/v1/auth/users?username=xx&password=yy
- 更新用户：PUT /nacos/v1/auth/users?username=xx&oldPassword=yy&newPassword=zz
- 登录：POST
/nacos/v1/auth/users/login?username=xxx&password=yyy



<a name="eHYVh"></a>
#### 角色管理

- 创建角色/绑定用户到角色：POST /nacos/v1/auth/roles?role=xx&username=yy
- 删除某个用户的角色：DELETE /nacos/v1/auth/roles?role=xx&username=yy
- 获取用户的所有角色：GET /nacos/v1/auth/roles?username=xxx



<a name="SRZQx"></a>
#### 权限管理

- 给角色添加权限：POST /nacos/v1/auth/permissions?role=xxx&resource=yyy&action=zzz
- 从角色删除权限：DELETE /nacos/v1/auth/permissions?role=xxx&resource=yyy&action=zzz
- 获取某个角色的权限：GET /nacos/v1/auth/permissions?role=xxx

<a name="Bb2oV"></a>
## 页面交互
目前的设计方案可以支持最小到dataId级别的鉴权，但是粒度越细在页面的展示就会越复杂，需要每个资源都去检查是否有权限然后再决定是否展示，对于数据量比较大的情况，会非常影响服务端的性能。不过可以肯定的是一定会支持命名空间级别的读写授权，用户可以在页面配置将某个命名空间的读写权限授权给某一个角色，然后再将这个角色授权给某个用户。至于更细粒度的授权，可能考虑不支持或者在1.2.0之后的版本支持。
<a name="PwF7l"></a>
### 用户管理
![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576225555266-ed32865d-95fb-4719-8d81-b25b55fbe711.png#align=left&display=inline&height=246&name=image.png&originHeight=370&originWidth=1120&size=137189&status=done&style=none&width=746)
<a name="vEW9w"></a>
### 角色管理

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576225984713-8134d131-a3b5-4000-8093-d8a793c8b461.png#align=left&display=inline&height=255&name=image.png&originHeight=378&originWidth=1106&size=134468&status=done&style=none&width=746)

<a name="TwHTX"></a>
### 权限管理

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576226004009-ca20d92d-889d-4926-a0d7-f613013d0f59.png#align=left&display=inline&height=249&name=image.png&originHeight=412&originWidth=1232&size=164158&status=done&style=none&width=746)

<a name="t34hG"></a>
## 关键逻辑

1. 每个模块继承ResourceParser来实现各自模块的资源名解析器：

```java
public interface ResourceParser {
    // 输入为请求信息，输出为一个资源名：
    String parseResource(Object request);
}
```

2. 在每个需要鉴权的方法上添加一个注解，来指定这个方法对应的资源名，动作及资源解析器：
```java
@Secured(resource=“service1”,action=“read”, parser=NamingParser.class)
public void registerInstance() {…}
```

这个注解的介绍如下：
```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Secured {
    // 动作类型，默认为读类型，全部类型有CREAT|DELETE|READ|WRITE|ADMIN
    ActionTypes action() default ActionTypes.READ;
    // 资源名，可以显示指定资源名，如不指定，将由资源解析器解析出资源名
    String resource() default "";
    // 资源解析器，解析资源名，优先级比name()低
    Class<? extends ResourceParser> parser() default DefaultResourceParser.class;
}
```

3. 在一个filter里进行登录和鉴权的逻辑，通过获取注解上的信息来拿到资源和动作，从request里获取到用户信息，然后进行鉴权。
```java
// 判断是否需要鉴权：
if (method.isAnnotationPresent(Secured.class) && authConfigs.isAuthEnabled()) {
	Secured secured = method.getAnnotation(Secured.class);
	// 获取注解里配置的动作类型和资源名：
	String action = secured.action().toString();
	String resource = secured.resource();
	// 若资源名为空，进行资源解析：
	if (StringUtils.isBlank(resource)) {
		ResourceParser parser = secured.parser().newInstance();
		resource = parser.parseResource(req);
	}
    if (StringUtils.isBlank(resource)) {
    	// 没有找到资源，则直接返回:
        throw new AccessException("resource name invalid!");
    }
	// 先调用login进行认证，再调用auth进行鉴权：
    authManager.auth(new Permission(resource, action), authManager.login(req));
}
```

3. 鉴权接口抽象如下：
```java
public interface AuthManager {

    /**
     * 根据请求进行用户认证，可以由用户进行扩展
     */
    User login(Object request) throws AccessException;

    /**
     * 根据用户信息和请求的权限，进行授权，也可以由用户进行扩展
     */
    void auth(Permission permission, User user) throws AccessException;
}
```

4. Nacos自带的鉴权实现逻辑介绍如下：
```java
public class NacosAuthManager implements AuthManager {

public User login(Object request) throws AccessException {
        // 从请求中获取用户信息，可以传入token，也可以传入用户名密码。
        // 1.传入用户名密码时，验证用户名密码，生成新的token放到User里；
        // 2.传入token时，验证token是否有效；
}

public void auth(Permission permission, User user) throws AccessException {
        // 1.从用户信息中拿到角色信息
        // 2.从角色信息中获取权限列表
        // 3.匹配请求的权限是否在权限列表里
}
```

<a name="q40cy"></a>
# 参考资料
【1】[https://zhuanlan.zhihu.com/p/70548562](https://zhuanlan.zhihu.com/p/70548562)<br />【2】[https://learn.hashicorp.com/consul/security-networking/production-acls](https://learn.hashicorp.com/consul/security-networking/production-acls)<br />【3】[https://zookeeper.apache.org/doc/r3.1.2/zookeeperProgrammers.html#sc_ZooKeeperAccessControl](https://zookeeper.apache.org/doc/r3.1.2/zookeeperProgrammers.html#sc_ZooKeeperAccessControl)


