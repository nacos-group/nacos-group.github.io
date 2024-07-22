---
title: Anti-Fragility
keywords: [Anti-Fragility, Rate Limiting, Connection Limit, TPS]
description: Nacos supports anti-fragility plugins from version 2.3.0, avoiding cluster capacity issues under high pressure.
---
# Anti-Fragility Plugin

Starting with Nacos 2.3.0, it supports injecting anti-fragility related plugins via [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html) and selecting one of these plugin implementations in the `application.properties` configuration file for actual anti-fragility capabilities. This document comprehensively explains how to implement an anti-fragility plugin and make it effective.

## Concepts in Anti-Fragility Plugins

Anti-fragility refers to strategies that restrict access when the **frequency and number** of requests to a service endpoint reach a certain level, protecting the server from extensive unavailability due to resource exhaustion under high pressure. Nacos' anti-fragility plugins abstract information into 'Control Points' and 'Control Rules.'

### Control Points (ControlPoint)

A Control Point maps to the resources consumed by service requests, primarily focusing on 'Connections' and 'Transactions Per Second (TPS).'

- The Connection Control Point monitors the number of long connections from Nacos 2.x clients and the configuration long polling from Nacos 1.x clients independently.
- The Transactions Per Second (TPS) Control Point tracks the frequency of core interface accesses on the Nacos server, treating similar operation interfaces as the same Control Point. Specific TPS Control Points are detailed later in this document under [Control Point Names](#1.1).

### Control Rules (ControlRule)

Control Rules enforce different limiting strategies for each Control Point, specifically 'Connection Control Rule' and 'TPS Control Rule.'

The Connection Control Rule includes details such as count limits and monitored IP lists for detailed operation tracking.

The TPS Control Rule involves specifying the rule's corresponding Control Point name and detailed rule content (`RuleDetail`) including max transaction limits, period of rule effectivity, and monitoring mode (monitor or intercept).

## Plugin Development

To develop an Nacos server-side anti-fragility plugin, start by depending on the relevant API for anti-fragility plugins.

Subclass the abstract classes `com.alibaba.nacos.plugin.control.connection.ConnectionControlManager` and `com.alibaba.nacos.plugin.control.tps.TpsControlManager`, implementing the missing methods. Then, implement the `com.alibaba.nacos.plugin.control.spi.ControlManagerBuilder` interface to create instances of these abstract classes. Finally, add your implementation to SPI services.

For plugin loading, package the plugin as a jar/zip and place it in the Nacos server's classpath, or directly in `${nacos-server.path}/plugins`. Modify the `application.properties` to specify the plugin type and restart the Nacos cluster.

## Using Nacos' Built-in Anti-Fragility Plugin

Nacos 2.3.0 onwards includes a simple anti-fragility plugin for connection and specific interface TPS restrictions. Configuration adjustments and file-based rule settings are outlined.

## Advanced Plugin Development

Nacos anti-fragility plugins also support advanced extensions for external rule storage, dynamic rule loading, custom rule format parsing, and custom TPS time window definitions to cater to diverse operational requirements.

---

The document further elaborates on supported Control Point names, rule storage locations, rule formats, and provides guidance on enhancing TPS statistics through custom time window algorithms, enabling developers to tailor anti-fragility measures precisely to their system's needs.