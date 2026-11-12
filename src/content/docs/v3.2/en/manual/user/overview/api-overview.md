---
title: Nacos Open API Overview
keywords: [OPEN API]
description: Nacos Open API Overview
sidebar:
    order: 2
---

# Nacos Open API Overview

Nacos Open APIs are divided into Client Open API, Admin Open API, and Console Open API according to caller type and usage scenario. This page helps you choose the right API type and understand common conventions such as response formats and error codes.

If you already know which API type to use, read the "0. Notes" section in the corresponding API page. It explains the path prefix, port, authentication behavior, and Swagger entry for that API type.

## 1. Choose the API Type First

| API Type | Caller | Best For | Document |
| --- | --- | --- | --- |
| Client Open API | Regular applications, microservice applications, AI Agent applications, and custom clients. | Reading known configurations and registering, deregistering, querying, or discovering known services. It targets specific resources and may be called frequently at runtime. | [Client API](../open-api.md) |
| Admin Open API | Operations platforms, release platforms, audit tools, automation scripts, and administrators. | Publishing and managing configurations, services, namespaces, plugins, server state, and AI resources. It is a management-plane API and supports range queries and batch management. | [Admin API](../../admin/admin-api.md) |
| Console Open API | The Nacos console and custom console UI. | Supporting console page data and interactions. It overlaps with Admin API in some areas but follows console display and interaction flows. | [Console API](../../admin/console-api.md) |

Business applications should prefer Client SDKs. Use Client Open API directly only when a language runtime does not have a suitable SDK, or when you only need a small number of HTTP calls.

Do not use Console Open API as a general operations interface. Custom console UI can use Console Open API. Operations automation, release platforms, and audit tools should prefer Admin Open API or Maintainer SDK.

## 2. Nacos Open API Access Protocols

Nacos 3.0 mainly supports two access protocols: [gRPC](https://www.grpc.io) and [HTTP 1.1](https://datatracker.ietf.org/doc/html/rfc7230). Different API types use different protocols according to their runtime characteristics.

- **Client Open API** mainly uses [gRPC](https://www.grpc.io). gRPC is built on HTTP/2 and uses protobuf for multi-language communication, which better matches the high-throughput and low-latency requirements of runtime clients. Some Client Open APIs also provide HTTP 1.1 endpoints for languages or environments that do not have stable gRPC support.
- **Admin Open API** and **Console Open API** use [HTTP 1.1](https://datatracker.ietf.org/doc/html/rfc7230), which is easier to call from operations tools, automation scripts, and browser-based UI.

## 3. Nacos Open API Conventions

### 3.1. gRPC API Response Format

In Nacos 3.0 gRPC Open API, responses are carried by `Payload` in the [proto file](https://github.com/alibaba/nacos/blob/develop/api/src/main/proto/nacos_grpc_service.proto). The response contains the following fields:

|      Name      |   Type   | Description                                                           |
|:------------:|:------:|:-------------------------------------------------------------
| `resultCode` |  int   | API result code. `200` means success, and `500` means failure.                           |
| `errorCode`  |  int   | API error code. It is present when the status is `500`. For details, see [API Error Codes](#33-api-error-codes). |
|  `message`   | string | API message. When the status is `500`, it describes the error detail.                           |
| `requestId`  | string | API request ID.                                                   |

### 3.2. HTTP API Response Format

In Nacos 3.0 HTTP Open API, all responses use JSON and share the same response structure:

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

The response fields are described below:

|    Name     |    Type    | Description                             |
|:---------:|:--------:|--------------------------------|
|  `code `  |  `int`   | Error code. `0` means success, and non-zero values indicate failure. |
| `message` | `String` | Error message. It is `"success"` when the request succeeds. |
|  `data`   |   Any   | Response data. When the request fails, it contains detailed error information. |

> Because successful responses share the same `code` and `message` values, later API sections only describe the `data` field.

### 3.3. API Error Codes

The following table summarizes common error codes and messages:

| Error Code | Message                      | Meaning                                      |
|------------|------------------------------|----------------------------------------------|
| `0`        | `success`                    | The operation succeeded.                     |
| `10000`    | `parameter missing`          | A required parameter is missing.             |
| `10001`    | `access denied`              | Access is denied.                            |
| `10002`    | `data access error`          | A data access error occurred.                |
| `20001`    | `'tenant' parameter error`   | The `tenant` parameter is invalid.           |
| `20002`    | `parameter validate error`   | Parameter validation failed.                 |
| `20003`    | `MediaType Error`            | The request `MediaType` is invalid.          |
| `20004`    | `resource not found`         | The resource was not found.                  |
| `20005`    | `resource conflict`          | A resource conflict occurred.                |
| `20006`    | `config listener is null`    | The configuration listener is empty.         |
| `20007`    | `config listener error`      | A configuration listener error occurred.     |
| `20008`    | `invalid dataId`             | The `dataId` is invalid, often due to auth failure. |
| `20009`    | `parameter mismatch`         | Request parameters do not match.             |
| `21000`    | `service name error`         | The `serviceName` parameter is invalid.      |
| `21001`    | `weight error`               | The `weight` parameter is invalid.           |
| `21002`    | `instance metadata error`    | Instance `metadata` is invalid.              |
| `21003`    | `instance not found`         | The `instance` does not exist.               |
| `21004`    | `instance error`             | Instance information is invalid.             |
| `21005`    | `service metadata error`     | Service `metadata` is invalid.               |
| `21006`    | `selector error`             | The access policy `selector` is invalid.     |
| `21007`    | `service already exist`      | The service already exists.                  |
| `21008`    | `service not exist`          | The service does not exist.                  |
| `21009`    | `service delete failure`     | Service deletion failed because instances still exist. |
| `21010`    | `healthy param miss`         | The `healthy` parameter is missing.          |
| `21011`    | `health check still running` | The health check is still running.           |
| `22000`    | `illegal namespace`          | The `namespace` is invalid.                  |
| `22001`    | `namespace not exist`        | The namespace does not exist.                |
| `22002`    | `namespace already exist`    | The namespace already exists.                |
| `23000`    | `illegal state`              | The `state` is invalid.                      |
| `23001`    | `node info error`            | Node information is invalid.                 |
| `23002`    | `node down failure`          | The node offline operation failed.           |
| ...     | ...                          | ...                |
| `30000`    | `server error`               | Other internal server errors.                |
