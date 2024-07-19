---
title: 控制台手册
keywords: [Nacos Console, Service Management, Configuration Management, Namespace Management, Login Management, Microservices Governance, Distributed Configuration]
description: The Nacos console is designed to enhance microservices management, encompassing service list monitoring, health status control, traffic weight adjustment, multi-format configuration editing with version control, namespace isolation, and secure login mechanisms, streamlining service governance and configuration management while reducing operational overhead.
---

# Control Panel Manual

The [Nacos Control Panel](http://console.nacos.io/nacos/index.html) primarily focuses on augmenting control capabilities in areas such as service listings, health status management, service governance, and distributed configuration management, further assisting users in lowering the costs associated with managing microservice architectures. It offers fundamental functions including:

- **Service Management**
  - Display of service lists and health statuses.
  - Storage and editing of service metadata.
  - Adjustment of service traffic weights.
  - Graceful online/offline service handling.
- **Configuration Management**
  - Editing of various configuration formats.
  - Edit DIFF review.
  - Sample code provision.
  - Push status query.
  - Version control and one-click rollback for configurations.
- **Namespace**
- **Login Administration**

## Detailed Features

### Service Management

Developers or operations personnel often require a user-friendly interface post-service registration to view service registration status, including all registered services and detailed information for each. With permission controls in place, Nacos's console service discovery section provides a basic operation page enabling users to view and edit registered services.

#### Service List Management

The service list facilitates unified management of all microservices and their health statuses through a layout featuring a search box and button in the upper left corner, with the service list displayed centrally. It showcases service names, cluster counts, instance counts, healthy instance numbers, and detail buttons.

#### Traffic Weight Support and Protection

Nacos equips users with traffic weighting controls and opens thresholds for service traffic protection, safeguarding service provider clusters from unexpected overload. As depicted, by clicking an instance's edit button, its weight can be adjusted; increasing the weight to boost traffic or setting it to zero to halt traffic reception.

#### Service Metadata Management

Nacos exposes service metadata across multiple dimensions for storing custom information in a K-V structure. On the control panel, this data is presented and edited following a similar format, e.g., editing service metadata involves clicking the 'Edit Service' button on the top right corner of the service details page and inputting: `version=1.0,env=prod`.

#### Graceful Service Online/Offline

Nacos also supports the online/offline operations of service instances, accessible via the 'Online' or 'Offline' buttons on the service details page. Offline instances are excluded from the healthy instance list.

### Configuration Management

Nacos supports configuration grouping management based on Namespaces and Groups, allowing users to manage numerous configurations flexibly per environment or application/module. Key management capabilities include configuration history, rollback, and subscriber querying.

#### Multi-Format Configuration Editor

Supporting formats like YAML, Properties, TEXT, JSON, XML, HTML, Nacos provides online editing, syntax highlighting, and format validation, enhancing editing efficiency while minimizing formatting errors.

#### Edit DIFF

Nacos's edit DIFF capability aids in verifying changes, mitigating risks from erroneous modifications.

#### Sample Code

Nacos furnishes sample code capabilities, enabling novices to swiftly consume configurations with client-side programming, significantly reducing the learning curve.

#### Subscriber Query

Nacos enables querying of configuration subscribers along with providing the MD5 checksum of the current client configuration, assisting in verifying whether configuration changes have been pushed to clients.

#### Configuration Versioning and One-Click Rollback

With version management and one-click rollback features, Nacos ensures rapid recovery from misconfigurations, reducing availability risks inherent in configuration management.

### Additional Features

 namespaces for logical isolation across environments, login management with default credentials, session timeouts, and community-driven frontend enhancements. Users can also disable the default console or customize login behavior with authentication plugins.

Nacos continues to evolve through community participation, welcoming contributions to its development and fostering a vibrant ecosystem around microservices and distributed systems management.

For more information on Nacos-related open-source projects, visit:

- [Nacos](https://github.com/alibaba/nacos)
- [Nacos Spring Project](https://github.com/nacos-group/nacos-spring-project)
- [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
- [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)
- [Dubbo](https://github.com/apache/dubbo)
- [Sentinel](https://github.com/alibaba/Sentinel)
- [Spring Cloud](https://projects.spring.io/spring-cloud/)
- [Nepxion Discovery](https://github.com/Nepxion/Discovery)