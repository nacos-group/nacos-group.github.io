---
title: Nacos Concepts
keywords: [Nacos,Concepts]
description: Nacos Concepts
---

# Nacos Concepts

> NOTE: Nacos introduces some basic concepts and systematic understanding of these concepts can help you better understand and correct use Nacos products.

## Region

Physical data centers, unalterable after resources are created.

## Available Zone

Physical areas with independent power grids and networks in one region. The network latency for instances in the same zone is lower.

## Endpoint

The entry domain name of a service in each region.

## Namespace

For configuration isolation by tenants. Different namespaces may have configurations with the same Group or Data ID. One of the common scenarios for namespace is to differentiate and isolate the configurations in different environments, as in development and test environment and production environment.

## Configuration

During system development, developers usually extract some parameters or variables that need to be changed from the code and manage them in a separate configuration file. This enables the static system artifacts or deliverables (such as WAR and JAR packages) to fit with the physical operating environment in a better way. Configuration management is usually a part of system deployment, which is executed by the administrator or operation and maintenance personnel. Configuration modification is an effective way to adjust the behavior of a running system.

## Configuration Management

Configuration-related activities including editing, storage, distribution, modification management, release version management, and modification audit.

## Configuration Item

A specific configurable parameter with its value range, generally in the form of param-key=param-value. For example, the log output level (logLevel=INFO|WARN|ERROR) of a system is regarded as a configuration item.

## Configuration Set

A collection of related or unrelated configuration items.In a system, a configuration file is generally a configuration set which contains all the configurations of the system. For example, a configuration set may contain configuration items such as data sources, thread pools, and log levels.

## Data ID

The ID of a configuration set in Nacos. It is one of the dimensions according to which configurations are organized. Data ID is generally used to organize the system configuration sets. A system or application can contain multiple configuration sets, each of which can be identified by a meaningful name. The Data ID usually uses the naming rule similar to Java packages (for example, com.taobao.tc.refund.log.level) to ensure global uniqueness. This naming rule is not mandatory.

## Group

The group of configuration sets in Nacos. It is one of the dimensions according to which configurations are organized. The configuration sets are always grouped by a meaningful string such as Buy or Trade to differentiate the configuration sets with the same Data ID. When you create a configuration on Nacos, the group name is replaced by DEFAULT\_GROUP by default if not specified. A typical scenario of Group is when the same configuration type is used for different applications or components, such as database\_url configuration and MQ\_topic configuration.

## Configuration Snapshot

The Nacos client SDK can generate snapshots of configurations on local machines. Snapshots can be used to indicate the overall disaster recovery capabilities of the system when the client cannot connect to the Nacos server. Configuration snapshot is similar to local commit in Git, or cache, which is updated at the appropriate time, but does not have the notion of expiration as in cache.

## Service

Software functions which are provided to the client via the network through a predefined interface.

## Service Name

Identifier provided by the service, by which the service it refers to can be uniquely determined.

## Service Registry

Database which stores the instances of services and the load balancing policies for services.

## Service Discovery

On a computer network, the address and metadata of an instance under the service are probed (usually using a service name) and provided to the client for querying with a predefined interface.

## Metadata

Custom configuration information, such as a disaster recovery policy, a load balancing policy, an authentication configuration, and various tags. From the scope of action, it is divided into meta-information of service level, meta-information of virtual cluster, and meta-information of instance.

## Application

Property of service which can be used to identify the service provider.

## Service Group

Different services can be categorized into the same service group.

## Virtual Cluster

Service instances under the same service can be further classified. One possible unit of this classification is Virtual Cluster.

## Instance

A process with an accessible network address (IP:Port) that provides one or more services.

## Weight

Instance-level configuration. Weight is a floating-point number. The greater the weight, the greater the traffic that the instance expects to be allocated.

## Health Check

Health check of the instances under a service in a specified manner to ensure that the instances can work properly. Instances are judged to be healthy or unhealthy according to the inspection results. Unhealthy instances are not returned to the client when initiating a resolution request to the service.

## Protect Threshold

To prevent traffic from flowing to healthy instances because of some unhealthy instances, which causes traffic pressure, healthy instance collapse, and finally an avalanche, the health protection threshold should be defined as a floating point number between 0 and 1. When the proportion of the domain name healthy instance to the total instance is smaller than this value, the instance is returned to the client regardless of the health of the instance. Although this can result in a loss of some of the traffic, we ensure that the remaining healthy instances can work normally.
