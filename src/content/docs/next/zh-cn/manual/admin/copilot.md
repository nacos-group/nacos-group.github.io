---
title: Copilot 助手
keywords: [Nacos Copilot, 模型连接, 连接选择, apiKey 迁移, providerId]
description: 配置 Nacos Copilot 模型连接，选择控制台助手使用的连接，并从已废弃的 apiKey 配置迁移。
sidebar:
  order: 15
---

# Copilot 助手

Nacos Copilot 是控制台侧的 AI 助手，提供 Prompt 调试与优化、Skill 生成与优化等能力。每个请求都由一个**模型连接**提供服务，连接描述提供方、模型和凭据。

本文介绍连接配置、连接选择、凭据处理，以及从已废弃的 `apiKey`/`model` 配置迁移的方法。

## 1. 启用条件

Copilot 在控制台部署中默认启用，并且需要至少一个可路由的模型连接才能使用。`nacos.deployment.type=server` 时不会加载该模块。可显式设置 `nacos.copilot.enabled=false` 关闭。

没有可路由连接时，Copilot 保持不可用状态，而不是让单个请求失败。控制台设置页会显示当前连接状态。

## 2. 定义连接

连接在部署配置中通过 `nacos.copilot.connections.<name>` 前缀声明：

```properties
nacos.copilot.connections.prod-qwen.providerId=dashscope
nacos.copilot.connections.prod-qwen.model=qwen-max
nacos.copilot.connections.prod-qwen.apiKey=<api-key>
nacos.copilot.connections.prod-qwen.displayName=Production Qwen
nacos.copilot.selectedConnection=prod-qwen
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `providerId` | 是 | 由 Copilot 模型解析器识别的提供方标识，例如 `dashscope`。 |
| `model` | 是 | 提供方支持的模型标识。 |
| `apiKey` | 否 | 调用提供方使用的凭据。 |
| `baseUrl` | 否 | 自定义接入地址。必须使用 HTTPS 且解析到公网地址，除非其 host 命中 `nacos.copilot.base-url.allowlist`。 |
| `endpointPath` | 否 | 追加到解析后地址的路径。 |
| `displayName` | 否 | 控制台展示名，默认为连接名。 |
| `enabled` | 否 | 连接是否可被路由，默认 `true`。 |
| `stream` | 否 | 传给模型客户端的流式偏好。 |
| `enableThinking` | 否 | 传给模型客户端的 thinking 模式偏好。 |
| `options` | 否 | 提供方特有参数。 |

### 2.1 连接名

- 连接名大小写不敏感：合并、查找和选择前会去除首尾空白并用 `Locale.ROOT` 转小写，因此 `Prod-Qwen` 与 `prod-qwen` 是同一个连接。`nacos.copilot.selectedConnection` 遵循同一规则。
- 连接名是单个配置键元素，只能包含 ASCII 字母、数字和 `-`。配置键中不允许点和首尾空白；不符合该语法的声明会被跳过并输出告警。
- 同一连接以多种拼写声明时，存在小写拼写则小写胜出，否则按字典序取第一个拼写；其他拼写（包括其字段）会被忽略并上报。
- 部署侧连接会覆盖同名的 legacy 连接。

### 2.2 校验

每个连接都会在加载期校验：`providerId` 与 `model` 必填，提供方前缀必须可解析，显式 `baseUrl` 必须通过 HTTPS 与公网地址检查。校验失败的连接会被标记为不可用并附带诊断原因，其他连接继续提供服务。

## 3. 选择与回退

Copilot 按以下顺序路由请求：

1. `nacos.copilot.selectedConnection` 指定的连接；
2. 否则第一个可用的部署侧连接；
3. 否则第一个可用的 legacy 连接。

连接按优先级、再按名称排序，因此平局结果确定：部署侧连接优先于 legacy 连接。指定的连接不存在、被禁用或不可用时，会回退到默认顺序，并在刷新时输出告警。当 `nacos.copilot.enabled=false` 关闭 Copilot 时不路由任何连接：页面显示当前没有生效连接，API 返回 `null` 的 `activeConnection`，连接列表仍会展示。

## 4. 配置优先级与刷新

生效配置按字段合并：`nacos.copilot.*` 中显式设置的值覆盖 `copilot-config.json`，后者覆盖内置默认值。`nacos.copilot.selectedConnection` 为空白时视为未声明，既不清理也不覆盖已存选择；凭据字段只在被显式清空时才按清除处理。连接字段只从部署配置读取；通过通用配置接口把同名字段写入 `copilot-config.json` 不会覆盖部署侧连接。

merged 部署在配置文件变化时会重新绑定 `nacos.copilot.*`，连接表、`selectedConnection` 和 `enabled` 无需重启即可生效。纯控制台部署不监听配置文件，必须重启。运行中修改环境变量不会被感知，同样需要重启。

## 5. 控制台行为

控制台设置页会列出所有连接及其来源（`部署配置` 或 `旧版配置`）、模型、可用性，以及在密钥来自进程环境时显示 `密钥来自环境变量` 标记；同时显示当前实际使用的连接，并保存提交的选择。只有存在、已启用且可用的连接才能被选中，否则保存请求会被拒绝。校验依据上一次刷新得到的连接表，不会访问模型提供方，因此在废弃区填入的密钥需要先保存，legacy 连接才能被选中。选择 `自动` 会清除已存选择，回到默认选择顺序；已存选择无法继续服务时，表单一律回退到 `自动`。

部署配置优先于已存选择。设置了 `nacos.copilot.selectedConnection` 时，从控制台保存的连接（或 `自动`）会写入配置，但不会改变当前使用的连接。页面会显示提示并指出部署配置指定的连接；API 通过 `effectiveSelectedConnection` 和 `selectedConnectionSource` 返回生效选择及其来源：部署配置声明时为 `DEPLOYMENT`，已存值生效时为 `STORED`，没有配置任何选择时为 `NONE`。移除该部署项后，已存选择才会生效。

已保存的 apiKey 不会以明文返回：Console API 返回掩码，连接元数据只说明是否配置了凭据及其来源（`ENVIRONMENT`、`DEPLOYMENT` 或 `CONSOLE`），不包含凭据值。已保存但当前不存在的选择仍会以告警形式显示，便于修改。

## 6. 从已废弃的 apiKey 与 model 迁移

旧版本通过 `nacos.copilot.apiKey`、`nacos.copilot.model`、控制台保存字段或 `COPILOT_API_KEY` 环境变量配置一个隐式连接。该连接仍会以 `legacy` 连接加载，但已废弃：

1. 声明一个带稳定名称的部署侧连接，填写 `providerId`、`model` 和 `apiKey`。
2. 可选：把 `nacos.copilot.selectedConnection` 设置为该连接名。
3. 重启或触发配置刷新，然后在控制台设置页确认当前使用的连接。
4. 确认新连接可用后，删除旧的 `apiKey` 与 `model` 配置。

注意：

- legacy 连接优先使用 `COPILOT_API_KEY`，其次才是已保存或部署配置中的 `apiKey`。从控制台清空已存密钥会把凭据标记为已清除，legacy 连接不再回退到环境变量，而是变为不可用，避免静默复用进程凭据。
- 即使已存密钥被清空，部署配置中显式设置的 `nacos.copilot.apiKey` 仍按既有优先级生效。此时 legacy 连接的凭据来源为 `DEPLOYMENT`，控制台显示 `密钥来自部署配置` 标记，便于分辨表单里保存的密钥并不是正在使用的密钥。
- 只有 legacy 连接存在时，控制台才会显示标记为已废弃的密钥与模型区域。
- 每次配置刷新加载到 legacy 连接时都会输出带迁移提示的废弃告警；弃用窗口内该连接继续服务。
