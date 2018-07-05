# Public content

Namespace in ACM is used for the isolation of configurations by tenants. Different namespaces may have configurations with the same Group or Data ID. One of the common scenarios of namespace is to differentiate and isolate configurations in different environments, such as development and test environment or production environment.



# Configuration Management

## Configuration

During system development, developers usually extract some parameters or variables that need to be changed from the code and manage them in a separate configuration file. This enables the static system artifacts or deliverables (such as WAR and JAR packages) to fit with the physical operating environment in a better way. Configuration management is generally a part of the system deployment process, which is completed by the system administrator or maintenance personnel. Configuration modification is one of the most effective methods to adjust the behavior of a running system.

## Configuration management
In the data center, all configuration-related activities such as editing, storage, distribution, change management, history version management, and change audit are collectively referred to as configuration management.

## Configuration item

It is a specific configurable parameter with its value range, usually in the form of param-key=param-value. For example, the log output level (logLevel=INFO|WARN|ERROR) of a system is regarded as a configuration item.

## Configuration se

A collection of related or unrelated configuration items is called a configuration set. Usually a configuration file in the system is a configuration set which contains configurations of all aspects of the system. For example, a configuration set may contain configuration items such as data sources, thread pools, and log levels.

## Data ID

The ID of a configuration set in ACM. It is one of the dimensions according to which configurations are organized. Data ID is generally used to organize the system configuration sets. A system or application can contain multiple configuration sets, each of which can be identified by a meaningful name. The Data ID usually uses the naming rule similar to Java packages (for example, com.taobao.tc.refund.log.level) to ensure global uniqueness. This naming rule is not mandatory.

## Group

The group of configuration sets in ACM. It is one of the dimensions according to which configurations are organized. The configuration sets are always grouped by a meaningful string such as Buy or Trade to differentiate the configuration sets with the same Data ID. When you create a configuration on ACM, the group name is replaced by DEFAULT\_GROUP by default if not specified. A typical scenario of Group is when the same configuration type is used for different applications or components, such as database\_url configuration and MQ\_topic configuration.

## Configuration snapshot

The ACM client SDK can generate snapshots of configurations on local machines. Snapshots can be used to indicate the overall disaster recovery capabilities of the system when the client cannot connect to the ACM server. Configuration snapshot is similar to local commit in Git, or cache, which is updated at the appropriate time, but does not have the notion of expiration as in cache.


## Service Discovery

### Service Metadata
Customized configuration of service, such as disaster recovery, authentication configuration and tags.

### Application
Application is a property of service which can be used to identify the identity of the service provider.

### Virtual Cluster
Service instances under the same service can be further classified. One possible unit of this classification is Virtual Cluster.

### Virtual Cluster Metadata
Custom configuration at the Virtual Cluster level. This configuration takes effect for the instance in the same Virtual Cluster.

### Default Port
One of the virtual cluster configurations, which indicates that the instance registered in the virtual cluster uses this default port to provide services if no port is specified.

### Use Port of IP for Health Check
One of the virtual cluster configurations indicates whether to use the registered port of the instance for health check.

### Default Check Port
One of the virtual cluster configurations indicates the default port for health check of the instances in the virtual cluster. When the registered port is specified disabled for health check, the default port is used for health check.

### Instance
A process with an accessible network address (IP:Port) that provides one or more services.

### Instance Metadata
Instance level custom configuration.

### Weight
Instance-level configuration, the weight is a floating-point number. The greater the weight, the greater the traffic that the instance expects to be allocated.

### Health Check
Check the health of the instance under service in a specified manner to confirm whether the instance can provide services. According to the inspection results, the instances are judged to be healthy or unhealthy. Unhealthy instances are not returned to the client when initiating a resolution request to the service.

### Protect Threshold
In order to prevent traffic from flowing to healthy instances due to unhealthy conditions in some instances, and then causing flow pressure to collapse healthy instances and create avalanche effects, the health protection threshold should be defined a floating point number between 0 and 1. When the proportion of the domain name healthy instance to the total instance is smaller than this value, the instance is returned to the client regardless of whether the instance is healthy. Although this will result in a loss of some of the traffic, it will ensure that the remaining health instances will work properly.
