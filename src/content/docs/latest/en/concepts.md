---
title: Nacos Concepts
keywords: [Nacos, Concepts, Configuration Management, Service Discovery, Health Check]
description: Nacos, as a dynamic configuration and service discovery platform, introduces key concepts such as regions, availability zones, configurations, and namespaces, highlighting the importance of configuration management and the mechanisms for service registration and discovery to ensure system high availability and flexibility.
---
# Nacos Concepts

> NOTE: Nacos introduces fundamental concepts; understanding these systematically can help you better comprehend and effectively utilize the Nacos product.

## Region
A physical data center where resources, once created, cannot be changed.

## Availability Zone
A physically independent region within the same region with separate power and network. Instances within the same availability zone have lower network latency.

## Access Point
The entry domain name of a service in a region.

## Namespace
For tenant-level configuration isolation. Different namespaces can contain identical Group or Data ID configurations. A common scenario for namespaces is the separation of resources (like configurations, services) between development/test environments and production.

## Configuration
During system development, developers typically separate variables requiring changes from code into standalone managed configurations. This aims to adapt static system artifacts or deliverables (e.g., WAR, JAR files) to actual runtime environments more efficiently. Configuration management generally includes activities such as editing, storing, distributing, change management, historical versioning, and audit trails related to configurations.

## Configuration Management
All activities involving configurations, including editing, storage, distribution, change management, history, and auditing.

## Configuration Item
An individual configurable parameter and its value range, typically in the form of param-key=param-value. For example, setting a system's log output level (logLevel=INFO|WARN|ERROR) is a configuration item.

## Configuration Set
A collection of related or unrelated configuration items is a configuration set. In a system, a configuration file is often a configuration set containing various system configurations. A configuration set may include settings for databases, thread pools, log levels, etc.

## Configuration Set ID
The ID of a specific configuration set in Nacos. The Data ID is one of the dimensions for organizing configurations, typically following a naming rule akin to Java packages (e.g., com.taobao.tc.refund.log.level) for global uniqueness, though not mandatory.

## Configuration Group
A group of configuration sets in Nacos, another dimension for organization. Meaningful strings (e.g., Buy or Trade) distinguish configuration sets with identical Data IDs. If the configuration group name is not specified when creating a configuration in Nacos, it defaults to DEFAULT_GROUP. Common scenarios include different applications or components using the same configuration types, like database_url and MQ_topic.

## Configuration Snapshot
The Nacos client SDK generates local snapshots of configurations. These serve to enhance the system's overall disaster recovery capability when the client cannot connect to the Nacos Server. Configuration snapshots resemble local commits in Git or caches, updated at appropriate times but without expiration.

## Service
Software functionality provided over a network via predefined interfaces for clients.

## Service Name
The identifier for a service, allowing unique determination of the referred service.

## Service Registry
A database storing service instances and load balancing strategies.

## Service Discovery
In computer networks,探测服务实例的地址和元数据（usually by service name） and providing them to clients through predefined interfaces.

## Metadata
Descriptive information of Nacos data (configurations and services), such as service versions, weights, disaster recovery strategies, load balancing policies, authentication configurations, and various custom labels (labels). Ranging from service-level, cluster-level, to instance-level metadata.

## Application
An attribute of a service identifying the service provider.

## Service Group
Different services can be categorized under the same group.

## Virtual Cluster
All service instances under the same service form a default cluster, which can be further divided into virtual clusters as needed.

## Instance
A process with an accessible network address (IP:Port) providing one or more services.

## Weight
An instance-level configuration. Weights are floating-point numbers. Higher weights result in more traffic directed to that instance.

## Health Check
Inspects the health of instances attached to a service to determine if they can provide service. Based on the check results, instances are marked healthy or unhealthy. When requesting resolution for a service, unhealthy instances are not returned to clients.

## Health Protection Threshold
To prevent healthy instances from being overwhelmed by traffic due to too many unhealthy instances, this threshold, a float between 0 and 1, ensures that even unhealthy instances are returned to clients when the ratio of healthy instances to total service instances falls below this value. Although some traffic is lost, this safeguards the remaining healthy instances from collapsing under pressure and avoids a cascading failure.