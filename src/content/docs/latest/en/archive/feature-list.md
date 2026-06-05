---
title: Nacos Feature and Requirement List
keywords: [Nacos,features]
description: Nacos feature and requirement list.
---

# Nacos Feature and Requirement List

This document lists the main features currently supported by Nacos and the schedule for some requirements that are not yet supported. It helps readers understand the capabilities that Nacos already supports and plans to support. All planned capabilities are open for developers to claim, and detailed claiming instructions are provided at the end of this document.

In the following tables, each requirement has a status flag. The status values have the following meanings:

1. Status values:
  1. Not supported: The feature is not supported and is not currently scheduled.
  1. Scheduled: The feature is not supported yet, but it has been put on the schedule and may be supported in a later version.
  1. Designing: The feature is being designed. Draft and final design documents are open for discussion.
  1. Developing: The design has been finalized and corresponding developers are working on it. It will be officially released in a later version.
  1. Beta: The feature has been released but has not been validated by large-scale users, so stability is not yet guaranteed.
  1. Stable: The feature has gone through at least four iterations and no major defects have been reported.


<a name="rchXu"></a>
# Service Discovery
Code repository: [https://github.com/alibaba/nacos/tree/develop/naming](https://github.com/alibaba/nacos/tree/develop/naming)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Service registration and discovery | nkorange | Stable | 0.1.0 |
| Health check (server-side probing and client heartbeat) | xuanyin | Stable | 0.1.0 |
| Routing policy (weight, protection threshold, and proximity access) | wangjianwei | Stable | 0.1.0 |
|  |  |  |  |


<a name="VqAeY"></a>
# Configuration Management
Code repository: [https://github.com/alibaba/nacos/tree/develop/config](https://github.com/alibaba/nacos/tree/develop/config)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Configuration management (publish, modify, query, and listen to configurations) | yanlinly | Stable | 0.1.0 |
| Gray configuration | yanlinly | Stable | 1.1.0 |
| Encrypted configuration |  | Not supported |  |


<a name="H9PtL"></a>
# Metadata Management
Code repository: [https://github.com/alibaba/nacos/tree/develop/cmdb](https://github.com/alibaba/nacos/tree/develop/cmdb)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Integrate with third-party CMDB | nkorange | beta | 0.7.0 |


<a name="iIIII"></a>
# Address Server
Code repository: [https://github.com/alibaba/nacos/tree/develop/address](https://github.com/alibaba/nacos/tree/develop/address)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Support Nacos addressing | pbting | beta | 1.1.0 |


<a name="zaOdN"></a>
# Nacos Kernel
Code repository: [https://github.com/alibaba/nacos/tree/develop/core](https://github.com/alibaba/nacos/tree/develop/core)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Remove MySQL dependency | chuntaojun | Designing |  |
| Replace Raft protocol with JRaft | chuntaojun | Stable | 1.4.1 |
| Unify asynchronous notification mechanism | wfnuser | Designing |  |
| Unify thread modules |  | Scheduled |  |
| Unify transmission channels | nkorange | Designing |  |
| Unify push modules | satjd | Designing |  |
| Unify startup modules |  | Scheduled |  |


<a name="JiVAL"></a>
# Security and Stability
Code repository: [https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Move namespace module down to a common module |  | Scheduled |  |
| Permission control, including authentication and authorization | nkorange | Developing | 1.2.0 |
| Operation audit and records |  | Scheduled |  |
| Support encrypted transmission |  | Scheduled |  |
| OpenTracing integration |  | Scheduled |  |
| Metrics collection | TsingLiang | Stable | 0.8.0 |
| Unify cache disaster recovery mechanism |  | Scheduled |  |
| Support command-line operations |  | Scheduled |  |
| Automatic data backup |  | Scheduled |  |
| Rate limiting module |  | Scheduled |  |
| Capacity management |  | Scheduled |  |


<a name="YmLFu"></a>
# Code Quality
Code repository: [https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Unify utility modules |  | Scheduled |  |
| Unify constant definitions |  | Scheduled |  |
| Unify exception handling modules |  | Scheduled |  |
| Unify logging modules |  | Scheduled |  |
| Unify system parameter modules |  | Scheduled |  |
| Unify dependencies |  | Scheduled |  |
| Unify status code modules | KeRan213539 | Designing |  |


<a name="OUg7P"></a>
# Cloud Native
| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Integrate with Istio | nkorange | beta | 1.1.4 |
| Integrate with ConfigMap |  | Scheduled |  |
| [Integrate with CoreDNS](https://github.com/nacos-group/nacos-coredns-plugin) | JianweiWang | beta | 0.1.0 |
| Integrate with SPIFFE |  | Scheduled |  |


<a name="nJ4NC"></a>
# Clients
Client support includes currently known Nacos multi-language clients and Spring ecosystem clients. Except for the Java client and Go client, the others are developed by enthusiastic community contributors. If you have a client for a new language, or another implementation for a language that is already supported, you are welcome to leave a message on GitHub for registration.

| Description | Main Developer | Status |
| :---: | --- | --- |
| [Java client](https://github.com/alibaba/nacos/tree/develop/client) | Nacos | Stable |
| [Go client](https://github.com/nacos-group/nacos-sdk-go) | atlanssia, lzp0412 | Stable |
| [Node.js client](https://github.com/nacos-group/nacos-sdk-nodejs) | czy88840616, gxcsoccer | Stable |
| [Python client](https://github.com/nacos-group/nacos-sdk-python) | sanwei | beta |
| [C# client](https://github.com/catcherwong/nacos-sdk-csharp) | catcherwong | Recommended |
| C++ client |  |  |
| PHP client |  |  |
| [Spring client](https://github.com/nacos-group/nacos-spring-project) | chuntaojun | Stable |
| [SpringBoot client](https://github.com/nacos-group/nacos-spring-boot-project) | chuntaojun | Stable |


<a name="o6JMC"></a>
# Nacos-Docker
Code repository: [https://github.com/nacos-group/nacos-docker](https://github.com/nacos-group/nacos-docker)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Deploy Nacos Server with Docker | paderlol | Stable | 0.1.0 |


<a name="UofM8"></a>
# Nacos-K8s
Code repository: [https://github.com/nacos-group/nacos-k8s](https://github.com/nacos-group/nacos-k8s)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Deploy Nacos Server with K8s | paderlol | Stable | 0.1.0 |


<a name="FPPSf"></a>
# Nacos-Sync
Code repository: [https://github.com/nacos-group/nacos-sync](https://github.com/nacos-group/nacos-sync)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Bidirectional synchronization between Nacos and Nacos services | paderlol | Stable | 0.1.0 |
| Bidirectional synchronization between Nacos and Zookeeper services | paderlol | Stable | 0.3.0 |
| Bidirectional synchronization between Nacos and Eureka services | paderlol | Stable | 0.3.0 |
| Bidirectional synchronization between Nacos and Consul services | paderlol | Stable | 0.3.0 |


<a name="sM3KF"></a>
# Nacos Website
Code repository: [https://github.com/nacos-group/nacos-group.github.io](https://github.com/nacos-group/nacos-group.github.io)

| Description | Main Developer | Status | Schedule |
| :---: | --- | --- | --- |
| Support in-page anchor links |  | Not supported |  |



<a name="mIQnp"></a>
# Join the Community Build
<a name="zjUdC"></a>
### What can you get by joining the community build?
By joining the Nacos community build, you will have the opportunity to make your code read and used by users across China and even around the world. After becoming a Nacos Committer (see the [manual](https://github.com/alibaba/nacos/blob/develop/CONTRIBUTING.md) for how to become a Nacos Committer), you can also receive the following benefits:

- Have your name listed on the [team page](https://nacos.io/docs/latest/community/nacos-dev/) of the Nacos website.
- Receive small gifts with the Nacos logo, such as T-shirts, cups, hoodies, and more.
- Represent Nacos in various online and offline events and communicate with more community members.
- More benefits are still being planned.

<a name="9eqix"></a>
### How to contribute
In addition to the features and requirements listed above, issues labeled [contribution welcome](https://github.com/alibaba/nacos/issues?q=is%3Aopen+is%3Aissue+label%3A%22contribution+welcome%22) or [help wanted](https://github.com/alibaba/nacos/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) in the GitHub repository are also very welcome for code contributions. Join the Nacos community core contributor DingTalk group 23335652 and contact the group administrator to claim requirements.

Please note the following points when submitting PRs:

1. Major features require a design document: [https://github.com/alibaba/nacos/issues/858](https://github.com/alibaba/nacos/issues/858)
1. Read and follow the contribution guidelines: [https://github.com/alibaba/nacos/blob/master/CONTRIBUTING.md](https://github.com/alibaba/nacos/blob/master/CONTRIBUTING.md)
1. Submit code with your GitHub account so that your name appears in the contributor list.
1. Include the issue ID in commit messages so that PR progress can be seen in the issue.
1. Do not include Chinese comments in code. Format the code before submitting, and add necessary integration test cases and unit test cases.
1. Before submitting a PR, successfully run `mvn -Prelease-nacos clean install -U` and `mvn clean install -Pit-test`.

Task claiming rule: Each person can claim at most two tasks at a time. After the task PR is merged, you can start claiming the next task.
