---
title: 使用Nacos实现Spring Cloud Zuul的动态路由
keywords: [nacos]
description: 使用Nacos实现Spring Cloud Zuul的动态路由
date: "2018-11-29"
category: cooperate
---

# 使用Nacos实现Spring Cloud Zuul的动态路由
> authors: 叶志远

### 一.前言
Nacos是阿里巴巴开源的致力于服务发现与管理、动态配置管理，以及动态DNS服务的中间件，目前已发布至0.5.0版本，除了与Spring Cloud更加紧密结合以外，还丧心病狂地支持JDK11。如果您目前的项目碍于Eureka的性能，而又缺乏成本引进Consul，那么Nacos是您最好的选择。好了，回到正题，在上周许进搞了一个[使用Nacos实现Spring Cloud Gateway的动态路由](http://xujin.org/sc/gw/gw10/)，让我们直观地感受到了Nacos的无缝接入如丝般顺滑，作为Spring Cloud中网关的始祖Zuul，自然也需要这一贴心赋能。

### 二.Spring Cloud Zuul动态路由实现思路
在社区书籍《重新定义Spring Cloud实战》中第8章4小节，详细剖析了Zuul的路由配置表加载以及刷新原理，其大致思想就是重写SimpleRouteLocator类的locateRoutes()方法，同时实现RefreshableRouteLocator接口，方法体引用父类的doRefresh()方法。在书中使用DB作为配置存放的仓库，如今有更为强大的Nacos，只需要将之前读取DB的逻辑换成读取Nacos即可。美中不足的是，由于Nacos还需进一步完善，目前对Spring Cloud中的事件支持还不是很完美，动态刷新只能依靠Zuul的内部逻辑。

### 三.具体实现
##### 1.在zuul-server中添加Nacos的配置

		<dependency>
			<groupId>com.alibaba.nacos</groupId>
			<artifactId>nacos-client</artifactId>
			<version>0.4.0</version>
		</dependency>
##### 2.读取Nacos配置信息核心代码

    @Component
    public class PropertiesAssemble{
    
    	public Map<String, ZuulRoute> getProperties() {
    		Map<String, ZuulRoute> routes = new LinkedHashMap<>();
    		List<ZuulRouteEntity> results = listenerNacos("zuul-server","zuul_route");
    		for (ZuulRouteEntity result : results) {
    			if (StringUtils.isBlank(result.getPath())
    					/*|| org.apache.commons.lang3.StringUtils.isBlank(result.getUrl())*/) {
    				continue;
    			}
    			ZuulRoute zuulRoute = new ZuulRoute();
    			try {
    				BeanUtils.copyProperties(result, zuulRoute);
    			} catch (Exception e) {
    			}
    			routes.put(zuulRoute.getPath(), zuulRoute);
    		}
    		return routes;
    	}
    
    	private List<ZuulRouteEntity> listenerNacos (String dataId, String group) {
    		try {
    			Properties properties = new Properties();
    			properties.put(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
    			ConfigService configService = NacosFactory.createConfigService(properties);
    			String content = configService.getConfig(dataId, group, 5000);
    			System.out.println("从Nacos返回的配置：" + content);
    			//注册Nacos配置更新监听器，用于监听触发
    //            configService.addListener(dataId, group, new Listener()  {
    //                @Override
    //                public void receiveConfigInfo(String configInfo) {
    //                    System.out.println("Nacos更新了！");
    //
    //                }
    //                @Override
    //                public Executor getExecutor() {
    //                    return null;
    //                }
    //            });
    			return JSONObject.parseArray(content, ZuulRouteEntity.class);
    		} catch (NacosException e) {
    			e.printStackTrace();
    		}
    		return new ArrayList<>();
    	}
    }
目前的demo写得比较简单，直接将Nacos的默认地址与端口写了进来，Nacos对于配置的管理有两个坐标，一是dataId，二是group，本demo中笔者将其分别命名为"zuul-server","zuul_route"。
##### 3.Zuul动态刷新路由实现
这部分可以查看demo地址：[https://github.com/SpringCloud/spring-cloud-zuul-nacos](https://github.com/SpringCloud/spring-cloud-zuul-nacos)，具体就不赘述。

### 四.演示
##### 1.从Nacos github地址pull源码，配置环境
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181129002717633.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JpY2tpeWVhdA==,size_16,color_FFFFFF,t_70)
这里需要在IDEA中添加启动参数-Dnacos.standalone=true
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181129002856286.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JpY2tpeWVhdA==,size_16,color_FFFFFF,t_70)

##### 2.启动Nacos，配置Zuul路由信息
启动Nacos后，在浏览器输入[http://localhost:8848/nacos/index.html](http://localhost:8848/nacos/index.html)便会跳转到如下页面：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2018112900323177.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JpY2tpeWVhdA==,size_16,color_FFFFFF,t_70)
点击配置列表，单击右侧的+号图标，便可以新增一项配置，由于这里已经添加好了，就直接看信息：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181129003545464.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JpY2tpeWVhdA==,size_16,color_FFFFFF,t_70)
##### 3.启动zuul-server，从Nacos加载路由信息测试
启动Zuul后，console中出现如下信息：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181129003851880.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JpY2tpeWVhdA==,size_16,color_FFFFFF,t_70)
在浏览器输入[http://localhost:5555/baidu](http://localhost:5555/baidu),出现如下效果，直接跳转到目标地址：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2018112900414387.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JpY2tpeWVhdA==,size_16,color_FFFFFF,t_70)
我们现在将Nacos中的配置修改一下，将http://github.com/Lovnx换成http://www.baidu.com，修改后直接发布：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181129004408166.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JpY2tpeWVhdA==,size_16,color_FFFFFF,t_70)
我们会在console看到：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181129004524375.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JpY2tpeWVhdA==,size_16,color_FFFFFF,t_70)
在浏览器输入[http://localhost:5555/baidu](http://localhost:5555/baidu),出现如下效果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181129004810756.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JpY2tpeWVhdA==,size_16,color_FFFFFF,t_70)

## [------------------->>>DEMO源码](https://github.com/SpringCloud/spring-cloud-zuul-nacos)

