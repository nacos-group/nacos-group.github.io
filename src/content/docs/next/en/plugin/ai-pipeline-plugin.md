---
title: AI Publish Pipeline
keywords: [AI Pipeline, AI Registry, Skill, Prompt, MCP, AgentSpec]
description: Learn how the Nacos AI publish pipeline plugin works, how to enable it, and how to develop custom release checks.
sidebar:
    order: 11
---

# AI Publish Pipeline Plugin

The AI publish pipeline plugin runs review, scanning, or blocking logic before an AI resource is published. It is useful for production release governance of Skills, Prompts, MCP Servers, AgentSpecs, and future AI resource types.

Pipeline belongs to AI resource governance. It can approve or reject a publish operation, but it does not change the namespace, resource name, version, or visibility model of the AI resource.

## When To Use It

Enable a pipeline when:

- Skill packages need security scanning before production use.
- Prompts, AgentSpecs, or MCP Servers need format, compliance, or custom checks.
- Production release should be separated from draft editing.
- Administrators need a visible result and reason for every publish review.

If no pipeline is enabled, submitting a resource may publish it directly or move it to a publishable state. The exact behavior depends on the resource type and console flow.

## Execution Model

Pipeline is an ordered chain of plugins. For each publish operation, Nacos selects nodes that support the target resource type and runs them by `getPreferOrder()` in ascending order.

```text
submit publish
  -> create pipeline execution record
  -> run selected nodes in order
  -> all passed: continue publish
  -> any rejected: stop publish and keep the version unpublished
```

Notes:

- Only configured nodes that support the target resource type are selected.
- When one node rejects the publish, later nodes do not run.
- If pipeline is disabled or no node matches, the publish flow is not blocked by pipeline.
- Force publish bypasses pipeline validation. Use it for emergencies, not as the normal release path.

Unified plugin management can list loaded `ai-pipeline` plugins. Until the execution chain is fully wired to unified plugin enablement, the pipeline feature is controlled by its own configuration.

## Enable the Built-in skill-scanner

The default Nacos plugin set provides a `skill-scanner` pipeline node. It can process scannable content in Skills, Prompts, and AgentSpecs. A common use case is calling an external Skill scanning tool.

Enable it in `${nacos.home}/conf/application.properties`:

```properties
nacos.plugin.ai-pipeline.enabled=true
nacos.plugin.ai-pipeline.type=skill-scanner
nacos.plugin.ai-pipeline.skill-scanner.enabled=true
nacos.plugin.ai-pipeline.skill-scanner.command=/path/to/skill-scanner
```

| Property | Description |
| --- | --- |
| `nacos.plugin.ai-pipeline.enabled` | Enables AI Pipeline. |
| `nacos.plugin.ai-pipeline.type` | Pipeline node type to run. |
| `nacos.plugin.ai-pipeline.skill-scanner.enabled` | Enables the `skill-scanner` node. |
| `nacos.plugin.ai-pipeline.skill-scanner.command` | Path of the external Skill scanner command. |

In production, keep the same plugin versions and configuration on all Nacos Server nodes. If the scanner depends on an external executable, make sure every node can access it.

## Develop a Custom Pipeline

Add the dependency:

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-ai-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

Implement `com.alibaba.nacos.plugin.ai.pipeline.spi.PublishPipelineServiceBuilder` and declare it with Java SPI:

```text
META-INF/services/com.alibaba.nacos.plugin.ai.pipeline.spi.PublishPipelineServiceBuilder
```

Builder methods:

| Method | Description |
| --- | --- |
| `pipelineId()` | Stable node ID used by configuration, logs, and execution records. |
| `build(properties)` | Builds a `PublishPipelineService` from configuration. |

Service methods:

| Method | Description |
| --- | --- |
| `pipelineId()` | Runtime node ID. |
| `execute(context)` | Runs the check and returns pass or reject. |
| `getPreferOrder()` | Execution order. Lower values run earlier. |
| `pipelineResourceTypes()` | Supported resource types, such as Skill, Prompt, MCP, or AgentSpec. |

## Development Advice

- Return deterministic results for the same resource version and input.
- Set timeouts when calling external systems.
- Return clear rejection reasons so resource authors can fix the problem.
- Do not modify resource content in pipeline. Use the draft editing flow for content changes.
- Do not write full Skill packages, Prompt content, keys, or credentials to logs.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Submit does not enter review | Check `nacos.plugin.ai-pipeline.enabled` and `nacos.plugin.ai-pipeline.type`. |
| `skill-scanner` does not run | Check `skill-scanner.enabled`, the scanner command path, and whether the plugin JAR is on the classpath. |
| Publish keeps failing | Check the pipeline execution record and the node rejection reason. |
| Unified plugin management shows disabled but the node still runs | Follow the pipeline configuration in the current version. Unified enablement is not fully wired into the execution chain yet. |

Related reading: [AI Resource Lifecycle](../manual/user/ai/ai-resource-lifecycle.md) and [AI Resource Import Plugin](./ai-resource-import-plugin.md).
