## I. 基本架构及概念

![nacos_arch.jpg](https://cdn.yuque.com/lark/0/2018/jpeg/15914/1530514514515-405eb206-4115-4773-9902-d549fe2c38c5.jpeg) 

* **服务 (Service)**

	服务是指一个或一组软件功能（例如特定信息的检索或一组操作的执行），其目的是不同的客户端可以为不同的目的重用（例如通过跨进程的网络调用）。Nacos 支持主流的服务生态，如 Kubernetes Service、gRPC|Dubbo RPC Service 或者 Spring Cloud RESTful Service.

* **服务注册中心 (Service Registry)**

	服务注册中心，它是服务，其实例及元数据的数据库。服务实例在启动时注册到服务注册表，并在关闭时注销。服务和路由器的客户端查询服务注册表以查找服务的可用实例。服务注册中心可能会调用服务实例的健康检查 API 来验证它是否能够处理请求。

* **服务元数据 (Service Metadata)**

	服务元数据是指包括服务端点(endpoints)、服务标签、服务版本号、服务实例权重、路由规则、安全策略等描述服务的数据

* **服务提供方 (Service Provider)**

	是指提供可复用和可调用服务的应用方

* **服务消费方 (Service Consumer)**

	是指会发起对某个服务调用的应用方

* **配置 (Configuration)**

	在系统开发过程中通常会将一些需要变更的参数、变量等从代码中分离出来独立管理，以独立的配置文件的形式存在。目的是让静态的系统工件或者交付物（如 WAR，JAR 包等）更好地和实际的物理运行环境进行适配。配置管理一般包含在系统部署的过程中，由系统管理员或者运维人员完成这个步骤。配置变更是调整系统运行时的行为的有效手段之一。

* **配置管理 (Configuration Management)**

	在数据中心中，系统中所有配置的编辑、存储、分发、变更管理、历史版本管理、变更审计等所有与配置相关的活动统称为配置管理。

* **名字服务 (Naming Service)**

	提供分布式系统中所有对象(Object)、实体(Entity)的“名字”到关联的元数据之间的映射管理服务，例如 ServiceName -> Endpoints Info, Distributed Lock Name -> Lock Owner/Status Info, DNS Domain Name -> IP List, 服务发现和 DNS 就是名字服务的2大场景。

* **配置服务 (Configuration Service)**

	在服务或者应用运行过程中，提供动态配置或者元数据以及配置管理的服务提供者。

* **[更多概念 TODO...]()**



## II. 构建物、部署及启动模式

![undefined](https://cdn.yuque.com/lark/0/2018/png/15914/1531730742844-e8325932-258b-49b2-9473-8d1199efe20d.png) 

* **2种交付工件**
	
	Nacos 支持标准 Docker 镜像(TODO: 0.2版本开始支持）及 zip(tar.gz)压缩包的构建物。
		
* **启动模式**
	
	Nacos 支持将注册中心(Service Registry）与配置中心(Config Center) 在一个进程合并部署或者将2者分离部署的两种模式。
	
* **免费的公有云服务模式**

	除了您自己部署和启动 Nacos 服务之外，在云计算时代，Nacos 也支持公有云模式，在阿里云公有云的商业产品（如[ACM TODO](xx)， [EDAS TODO](xx)) 中会提供 Nacos 的免费的公有云服务。我们也欢迎和支持其他的公有云提供商提供 Nacos 的公有云服务。
	
	