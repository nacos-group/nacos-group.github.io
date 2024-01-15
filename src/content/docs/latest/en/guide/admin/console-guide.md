---
title: Console Guide
keywords: [console,guide]
description: Nacos console aims to enhance the console for service list, health management, service management, a distributed configuration management control ability.
sidebar:
    order: 5
---

# Console Guide

[Nacos console](http://console.nacos.io/nacos/index.html) aims to enhance the console for service list, health management, service management, a distributed configuration management control ability, in order to help users reduce the cost of micro management service application architecture, will provide basic functions include the following:

* Service management
    * Service list and health status display
    * Service metadata storage and editing
    * Service flow weight adjustment
    * Service elegant line up and down
* Configuration management
    * More configuration format editing
    * Edit DIFF
    * Sample code
    * Push status query
    * Configure version and rolled back
* Namespace
* Login management

## Features

### Service management

Developer or operations staff often require after service registry, through friendly interface to view the service registration situation, the current system, including the registration of all of the details of the services and each service.And in a case, with access control service of some of the configuration editor.Nacos in this version of open service found that part of the console, main is to provide users a basic operations page, to view, edit, the current registration services.

#### Service list management

Service list to help users with a unified view management of all its service and health status.The overall layout is the upper left corner services and search box to search button, the page is the central service list.Service main display service name list, the cluster number, number of instances, health instance number and details button five columns.

![image.png | left | 747x281](https://cdn.nlark.com/lark/0/2018/png/15356/1540536911804-3660f0e9-855f-4439-ac23-e76f6f644360.png "")

In the service list page click details, you can see details of the service.Can look at the service, the basic information of the cluster and examples.

#### Service flow weighted support and protection

Nacos flow provides the user with the ability of weight control, open the threshold of service flow protection at the same time, in order to help users better protection service cluster service providers are not accidentally break.The diagram below so, click the edit button instance, modify instance weights.If you want to increase the flow of instance, to turn up the weight, if you don't want to flow method receives the instance, the weight can be set to 0.

![image.png | left | 747x266](https://cdn.nlark.com/lark/0/2018/png/15356/1540537029452-dffbb078-4ae5-4397-9f70-083e0ebbb5be.png "")

#### Service metadata management

Nacos provide multiple dimensions of service metadata exposed, help users to store the information of the custom.This information is based on data storage structure, K - V on the console, as to the k1 = v1, k2 = v2 show such format.Similarly, edit the metadata can be performed by the same format.Such as service metadata editing, first click on the service details in the top right corner of the page "edit service" button, and then in the metadata input: input box version = 1.0, env = prod.

![image.png | left | 747x271](https://cdn.nlark.com/lark/0/2018/png/15356/1540537359751-217d7500-c19c-4bad-8508-27f347f48a2f.png "")

Click on the confirmation, you can in the service details page, see the service metadata has been updated.

![image.png | left | 747x145](https://cdn.nlark.com/lark/0/2018/png/15356/1540537452673-01dc6c92-329a-4b6f-a616-36dc546c3355.png "")

#### Service elegant line up and down

Nacos also offers the service instance line operation, up and down in the service details page, you can click on the instance of "on-line" or "off" button, the offline instance, cases of health will not be included in the list.

![image.png | left | 747x142](https://cdn.nlark.com/lark/0/2018/png/15356/1540537640435-b28cb279-75af-4965-8a9a-54cee213f1a5.png "")

### Configuration management

Nacos support Group configuration based on the Namespace and Group management, so that users more flexible according to their own needs in accordance with the environment or application, module, such as grouping management services as well as the configuration of Spring, in the configuration management major provides configuration version history, rollback, subscriber query such as the core management abilities.

![image.png | left | 747x297](https://cdn.nlark.com/lark/0/2018/png/9687/1540458893745-219a46a8-ebd9-405b-9e8f-226f3f0c7e76.png "")

#### More configuration format editor

Nacos support YAML, Properties, TEXT, JSON, XML, HTML and other common configuration format online editing, syntax highlighting, format check, help users efficiently edit at the same time greatly reduced the risks of format error.

Nacos support configuration tag ability, help users better and more flexible to the configuration of the classification and management based on the tag.Description of configuration and its change is support users at the same time, people or cross team collaboration management configuration.

![image.png | left | 747x426](https://cdn.nlark.com/lark/0/2018/png/9687/1540458995051-b3e67fd4-c905-4552-9e52-f54b6ef59941.png "")

#### Edit DIFF

Nacos supports editing a DIFF ability, help the user to check the changes, and reduce the risks of correction.

![image.png | left | 747x338](https://cdn.nlark.com/lark/0/2018/png/9687/1540457990344-a60e1db3-ca1a-47ed-a03e-f92e37745247.png "")

#### Sample code

Nacos provide sample code ability, can let a novice quickly using client-side programming consumption this configuration, novice slash barriers.

![image.png | left | 747x223](https://cdn.nlark.com/lark/0/2018/png/9687/1540456991412-01acc11c-8b48-48d8-9032-589ebb9388d9.png "")

![image.png | left | 747x380](https://cdn.nlark.com/lark/0/2018/png/9687/1540532899571-ccea6b6f-a1e1-44d1-a130-f9afaba01c51.png "")

#### Listener query

Nacos provide configuration subscriber is the listener query ability, at the same time provide Client MD5 checksum value of the current configuration, in order to help users better check configuration changes pushed to the Client side.

![image.png | left | 747x185](https://cdn.nlark.com/lark/0/2018/png/9687/1540459212236-0abdc558-68b9-4585-b11e-c9a1924ce7ef.png "")

#### Configure version and rolled back

Nacos by providing a key roll back configuration version management and its ability, help users can configure to quick recovery, reduce the micro service system in configuration management will meet the availability of the risk.

![image.png | left | 747x242](https://cdn.nlark.com/lark/0/2018/png/9687/1540459226967-a258b9a7-f95f-41b0-874f-2a0a5da2fc5c.png "")

![image.png | left | 747x493](https://cdn.nlark.com/lark/0/2018/png/9687/1540459237821-d4c06d16-b356-4953-a6e7-da949b1f3aec.png "")

## Namespace management

Nacos based in Namespace helps users logic isolation based multiple namespaces, this can help users better management testing, service and configure the pretest, production environment, so that the same configuration environment (such as database data sources) can define different values.

![image.png | left | 747x298](https://cdn.nlark.com/lark/0/2018/png/9687/1540519411777-74908cc2-29bc-4270-be58-aed62605228f.png "")

![image.png | left | 747x206](https://cdn.nlark.com/lark/0/2018/png/9687/1540519427066-effd5153-02c9-4e21-ae9f-1a2e9ae7713e.png "")

## Login management

Nacos 0.8 version supports simple login function, the default username/password for: `nacos/nacos`.

![login](https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561262748106-4fc05174-bf70-4806-bcbd-90296c5bcbaa.jpeg)

### Change the default username/password method

1. Generate encrypted password in `com.alibaba.nacos.console.utils.PasswordEncoderUtil.main` function, change nacos to you want to change the password, running with encryption algorithm.Note that salt is random, so the generated password every time may be different, please don't worry about it.

```
public class PasswordEncoderUtil {

    public static void main(String[] args) {
        System.out.println(new BCryptPasswordEncoder().encode("nacos"));
    }
}
```

2. Create a user name or password, use specify a user name password.
```
INSERT INTO users (username, password, enabled) VALUES ('nacos', '$2a$10$EuWPZHzz32dJN7jexM34MOeYirDdFAZm2kuWj7VEOJhhZkDrxfvUu', TRUE);
INSERT INTO roles (username, role) VALUES ('nacos', 'ROLE_ADMIN');
```

### Close the login function

As part of its own development console, do not want to be nacos security filter interceptor.Therefore nacos support custom close the login functionFind the configuration file `${nacoshome}/conf/application.properties`. The properties, replace the following content.

```
## spring security config
### turn off security
spring.security.enabled=false
management.security=false
security.basic.enabled=false
nacos.security.ignore.urls=/**

#nacos.security.ignore.urls=/,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/v1/auth/login,/v1/console/health,/v1/cs/**,/v1/ns/**,/v1/cmdb/**,/actuator/**

```

### Session time

The default session to keep time for 30 minutes.After 30 minutes need to login authentication.Temporarily does not support to modify the default time.

## Community participation in the front end of the building

In Nacos front style, the layout of the discussion, the community vote, finally choose the style of the classic black and white and blue skin, and through our UED Yao Cheng design, layout, make interaction is very natural.

In the development of the console, we recruited through community many front students to participate in the development of the front-end code, in this especially thank Chen Li, Qing Wang, Yanmin Wang Nacos front-end development process in the strong support!

## Adhere to the community development, welcome to join and contribute to the community

> DISS is cheap, show me your hand!

To join Nacos WeChat community discussion Nacos the evolution of the product, you can sweep through **xuechaos** WeChat QRcode, let "xuechaos" help you pull in "Nacos community communication group".

![Screen Shot 2018-06-27 at 13.39.09.png | left](https://cdn.yuque.com/lark/0/2018/png/15914/1530077965587-8f4e3100-bdd4-469a-9ea0-7af7061bc9ef.png "")

More Nacos related open source project information:

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring Project](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)
* [Dubbo](https://github.com/apache/dubbo)
* [Sentinel](https://github.com/alibaba/Sentinel)
* [Spring Cloud](https://projects.spring.io/spring-cloud/)
* [Nepxion Discovery](https://github.com/Nepxion/Discovery)
