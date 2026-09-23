---
title: ARD Integration Guide
keywords: [Nacos, ARD, Agentic Resource Discovery, AI resource discovery, Ecology]
description: Enable Nacos 3.3 ARD to search resources, explore facets, discover catalogs, and download artifacts.
sidebar:
    order: 9.1
---

# ARD Integration Guide

[ARD (Agentic Resource Discovery)](https://agenticresourcediscovery.org/) is an open specification for describing, searching, and discovering AI resources. The [official specification](https://agenticresourcediscovery.org/spec/) credits Junjie Bu (Google), R. V. Guha (Microsoft), and Shaun Smith (Hugging Face) as authors. Its source is available in the [official GitHub repository](https://github.com/ards-project/ard-spec).

Nacos 3.3 provides ARD-compatible endpoints for searching Agents, Skills, Prompts, and MCP Servers and retrieving their artifacts.

This page covers server configuration and HTTP integration. For publishing requirements, result types, and how to use them, see [ARD Resource Discovery in AI Registry](../manual/user/ai/ard-discovery.md). Applications that need Agent runtime endpoints or change subscriptions should use the [RAD Integration Guide](../manual/user/ai/rad-discovery.md). RAD stands for Remote Agent Discovery and serves a different purpose.

## 1. Enable ARD

Configure the following in the Nacos Server `conf/application.properties` file:

```properties
nacos.ai.ard.enabled=true
nacos.ai.resource.search.enabled=true
nacos.ai.registry.port=9080
nacos.ai.ard.catalog.base-url=http://127.0.0.1:9080
```

Restart Nacos Server. ARD serves requests on a separate HTTP port. The base URL above is suitable for local verification; replace it with an address reachable by clients on other machines.

| Property | Default | Description |
| --- | --- | --- |
| `nacos.ai.ard.enabled` | `false` | Enables ARD endpoints. The MCP Registry and Skill Registry compatibility endpoints do not need to be enabled. |
| `nacos.ai.resource.search.enabled` | `true` | Enables AI resource search. Must remain enabled when ARD is enabled, or Nacos fails to start. |
| `nacos.ai.registry.port` | `9080` | Port shared by ARD and the other AI Registry compatibility endpoints. |
| `nacos.ai.ard.catalog.base-url` | Unset | Generates absolute URLs in catalogs and search results. Derived from the current request when unset; configure it explicitly when using a gateway. |
| `nacos.ai.ard.catalog.host.identifier` | `nacos` | Host identifier in the catalog, also used to generate resource identifiers. Use a domain you control when deploying for a team. |

For an existing cluster, follow the [Upgrade Guide](../manual/admin/upgrading.mdx) to complete the 3.3 upgrade and database initialization first. Basic keyword search does not require a vector model or pgvector.

### 1.1. Access through a gateway

Set `nacos.ai.ard.catalog.base-url` to the **complete public URL of the adaptor**, including any gateway path prefix. For example:

```properties
nacos.ai.ard.catalog.base-url=https://nacos.example.com/ard
```

Returned resource URLs then start with `https://nacos.example.com/ard/v3/ai/ard/`. The gateway must forward requests under `/ard/` to the adaptor port and remove that prefix. This property only affects returned URLs: it does not create gateway routes or append the main server's `/nacos` path.

If clients discover the Registry through the host-root path `/.well-known/ai-catalog.json`, also forward that path to the same path on the adaptor. With the default configuration, direct requests to port 9080 do not include `/nacos`.

## 2. Prepare resources and credentials

1. Publish at least one resource in Nacos for verification. For example, follow [Agent Management](../manual/user/ai/agent-registry.md) to create `route-planner` in the `public` namespace and publish version `1.0.0`.
2. Confirm that the resource is enabled and `latest` points to an `online` version. Grant the integration account the required read permissions.
3. Sign in as described in [Configure Access Credentials](../manual/user/auth.mdx) and save the returned `accessToken` in the same terminal.

The following commands use Bash. On Windows, use Git Bash or WSL:

```bash
export ARD_BASE_URL='http://127.0.0.1:9080'
export NACOS_ACCESS_TOKEN='<accessToken-from-login-response>'
```

The default authentication plugin's login endpoint is on the main server, for example `http://127.0.0.1:8848/nacos/v3/auth/user/login`. ARD requests use port 9080 and carry that token in the `accessToken` header. Sign in again when the token expires.

Nacos 3.3 enables client authentication by default, and ARD also requires valid credentials. With the default authentication plugin, anonymous reads are allowed only when `nacos.plugin.auth.nacos.anonymous.ai.enabled=true` is explicitly configured, and anonymous callers can discover only public resources. Requests carrying an invalid or expired token still return `401 UNAUTHENTICATED`; they do not fall back to anonymous access. See [ARD Resource Discovery](../manual/user/ai/ard-discovery.md) for visibility rules.

## 3. Search resources

```bash
curl -sS -X POST "${ARD_BASE_URL}/v3/ai/ard/search?namespaceId=public" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": {
      "text": "route",
      "filter": {
        "type": ["application/a2a-agent-card+json"]
      }
    },
    "federation": "none",
    "pageSize": 10
  }'
```

`query.text` is required. This example searches only resources that can export an A2A AgentCard. Remove `filter` to search all four resource types; see [ARD Resource Discovery](../manual/user/ai/ard-discovery.md) for other `type` values.

`query.filter` filters by fields such as `type`, `tags`, and `capabilities`. Values within one field's array are matched with OR; different fields are combined with AND. `namespaceId` is a Nacos extension and should be passed as a URL query parameter. It defaults to `public`.

The search response is an ARD JSON object with these main fields:

| Field | Purpose |
| --- | --- |
| `results` | Matching resources on this page. Each entry includes `identifier`, `displayName`, `type`, `url`, `version`, and other metadata. |
| `results[].score` | Integer relevance score from 0 to 100. |
| `results[].source` | Address of the Registry providing the result. |
| `pageToken` | Token for the next page. When present, include it in the next request body with the same query conditions. |
| `referrals` | Other Registries recommended for querying. Local search currently returns an empty array. |

Search `pageSize` defaults to 10 and has a maximum of 50. `federation` accepts `auto`, `referrals`, and `none`, with `auto` as the default. Without an upstream Registry configured, all three modes search only local resources.

## 4. Browse resources and explore facets

### 4.1. List resources with pagination

Use `/agents` to browse without keywords. Despite its name, this endpoint also returns Skills, Prompts, and MCP Servers.

```bash
curl -sS -G "${ARD_BASE_URL}/v3/ai/ard/agents" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode "filter=type = 'application/a2a-agent-card+json'" \
  --data-urlencode 'orderBy=displayName' \
  --data-urlencode 'pageSize=20'
```

The list response uses `items`. When `pageToken` is present, pass it as a query parameter to retrieve the next page. `pageSize` defaults to 20 and has a maximum of 100. Quote filter values with single quotes and join multiple conditions with `AND`. A time condition can be written as `createdAfter > '2026-01-01'`.

### 4.2. Explore resource categories

`explore` returns counts for matching resource categories, useful for type or tag filters in a tool selection page:

```bash
curl -sS -X POST "${ARD_BASE_URL}/v3/ai/ard/explore?namespaceId=public" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "resultType": {
      "facets": [
        {"field": "type", "limit": 10},
        {"field": "tags", "limit": 20}
      ]
    }
  }'
```

The response includes `value` and `count` in `facets.type.buckets` and `facets.tags.buckets`. Counts include only resources discoverable by the caller. Add `query.filter` as in a search request to narrow the scope.

## 5. Discover catalogs and retrieve artifacts

The host-level catalog provides the Registry entry:

```bash
curl -sS "${ARD_BASE_URL}/.well-known/ai-catalog.json" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}"
```

Its `entries` array contains an entry of type `application/ai-registry+json`. The `metadata.searchEndpoint`, `metadata.exploreEndpoint`, and `metadata.listEndpoint` fields provide the corresponding endpoint URLs. This catalog does not list every resource.

To retrieve a namespace's resource catalog:

```bash
curl -sS "${ARD_BASE_URL}/v3/ai/ard/ai-catalog.json?namespaceId=public" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}"
```

The catalog's `entries` contains the Registry entry and discoverable resources. Select a resource entry and use its `url` to download the artifact. Search `results` and list `items` also provide this URL.

```bash
export ARTIFACT_URL='<resource-url-from-response>'
curl -f -sS "${ARTIFACT_URL}" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -o artifact.bin
```

Resource URLs point to `/v3/ai/ard/artifacts` on the adaptor. Parse the file according to the entry's `type` and the response `Content-Type`: Skills return complete ZIP packages; other resources return JSON. Preserve the full URL, including its version and other parameters. Agent URLs also include the content digest and representation. If a version goes offline or the URL becomes invalid, search again for an available version.

## 6. Troubleshooting

| Symptom | What to check |
| --- | --- |
| Connection fails or the endpoint returns 404 | Confirm that ARD was enabled and the server restarted, and that the request uses the adaptor port. Check gateway forwarding and path prefixes. |
| `401 UNAUTHENTICATED` | Check that a valid token is supplied; sign in again if it has expired. Anonymous access must be explicitly enabled by an administrator. |
| Request succeeds with no results | Check the namespace, filters, read permissions, enabled status, and the online version selected by `latest`. After publishing or upgrading, allow search synchronization to complete and retry. |
| `400 INVALID_ARGUMENT` | Check the JSON, required fields, and filter syntax. Search and list requests use different formats. |
| Search succeeds but the resource URL is unreachable | Check that `catalog.base-url` points to a client-accessible adaptor address and that the gateway forwards artifact requests. |
| Artifact download returns `404 NOT_FOUND` | Search again to confirm the resource and version are still available. Do not rewrite the version, digest, or representation in an Agent URL. |

ARD errors use `{"errorCode":"...","message":"..."}`, without the Nacos v3 API `code` and `data` wrapper.

See the [ARD specification](https://agenticresourcediscovery.org/spec/) for protocol background. Nacos 3.3 uses upstream draft [5fa2f5a](https://github.com/ards-project/ard-spec/commit/5fa2f5aef790b478319f6a3b43adf4661b0ed0e0) as its compatibility baseline; use the supported scope described on this page when integrating.
