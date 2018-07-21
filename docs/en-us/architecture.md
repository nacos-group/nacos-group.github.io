## Basic Architecture and Concepts 

![nacos_arch.jpg](/img/nacos-Arch.jpg) 

* **Service**

	A software function or a set of software functions (such as the retrieval of specified information or the execution of a set of operations) with the purpose that different clients can be reused for different purposes (for example, through a cross-process network call). Nacos supports almost all types of services:
[Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/)
[gRPC](https://grpc.io/docs/guides/concepts.html#service-definition)
[ | Dubbo RPC Service](https://dubbo.incubator.apache.org/#/?lang=en-us)
[Spring Cloud RESTful Service](https://spring.io/understanding/REST)

* **Service Registry** 

	The database of services, instances and metadata. Service instances are registered with the service registry on startup and deregistered on shutdown. Clients of the service and/or routers query the service registry to find the available instances of a service. A service registry might invoke a service instance¡¯s health check API to verify that it is able to handle requests.
	
* **Service Metadata** 
	
	Data describing services such as service endpoints, service labels, service version, service instance weights, routing rules, security policies.
	
* **Service Provider** 	
    
	A process or application which provides reusable and callable services.

* **Service Consumer**
	
	A process or application which initiates a call to a service.
	 
* **Configuration** 
	
	During system development, developers usually extract some parameters or variables that need to be changed from the code and manage them in a separate configuration file. This enables the static system artifacts or deliverables (such as WAR and JAR packages) to fit with the physical operating environment in a better way. Configuration management is generally a part of system deployment, which is executed by the administrator or operation and maintenance personnel. Configuration modification is an effective method to adjust the behavior of a running system.
	
* **Configuration Management**

	In the data center, all configuration-related activities such as editing, storage, distribution, change management, history version management, and change audit are collectively referred to as configuration management.

* **Naming Service** 

	Mapping the "names" of all the objects and entities in the distributed system to the associated metadata, for example, ```ServiceName``` -> ```Endpoints\Version etc...```, ```Distributed Lock Name``` -> ```Lock Owner/Status Info```, ```DNS Domain Name``` -> ```IP List```. Service discovery and DNS are the two major scenarios of naming service.

* **Configuration Service** 
	
	Providing dynamic configuration, service metadata and configuration management for other services or application.

* **[More concepts...](https://nacos.io/#/docs/concepts.md?lang=zh-cn)**

## Artifacts, Deployment, and Start Mode

![undefined](https://cdn.yuque.com/lark/0/2018/png/15914/1531730742844-e8325932-258b-49b2-9473-8d1199efe20d.png) 

* **Two Artifacts**
	
	Nacos supports both standard Docker images (v0.2.0) and nacos-.zip(tar.gz). You can choose the appropriate build to deploy the Nacos service according to your needs.
		
* **Two Start Modes**
	
	Nacos supports two start modes. you can merging the Service Registry and the Config Center in one process or deploying them in separately cluster.
	
* **Free Public Cloud Service on Alibaba Cloud**

	In addition to deploying and launching Nacos services by users themselves, Nacos also supports public cloud. Nacos public cloud service will be free in Alibaba Cloud's commercial service (such as [ACM TODO](xx), [EDAS TODO](xx)). We also welcome other public cloud providers to offer Nacos public cloud services.
 