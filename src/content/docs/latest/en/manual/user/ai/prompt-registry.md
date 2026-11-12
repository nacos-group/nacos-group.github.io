---
title: Prompt Registry
keywords: [Nacos Prompt Registry, AI Prompt]
description: Use Nacos to manage Prompt templates, variables, versions, labels, and publish flows.
sidebar:
  order: 9
---

# Prompt Registry

Prompt Registry centralizes the Prompt templates used by AI applications. It is useful when Prompts change often, need version control, or must be reviewed before production use.

By storing Prompts in Nacos, applications can fetch updated Prompts without being redeployed. Teams can also manage Prompt versions, labels, and publish flows in one place.

## What A Prompt Contains

In AI Registry, a Prompt is a versioned resource. It usually contains:

- Prompt template content.
- Template variable definitions.
- Version, author, and commit message.
- Labels such as `latest`.
- Description and business tags.

The Prompt identity is:

```text
namespaceId -> prompt -> promptKey
```

`promptKey` is the Prompt name. Use a stable and readable name that describes the business purpose, such as `order-summary` or `risk-check`.

## When To Use Prompt Registry

Use Prompt Registry when:

- Multiple applications reuse the same Prompt.
- A Prompt changes often, but the application should not be redeployed each time.
- Production Prompts need review before release.
- The team needs Prompt history for rollback or audit.
- Applications should read a version through a label.

If a Prompt is temporary, used by only one application, and does not need versioning, keeping it in application code or application configuration may be enough.

## Recommended Publish Flow

Prompts follow the shared [AI Resource Lifecycle](./ai-resource-lifecycle.md). Start changes from a draft; published templates and variables cannot be overwritten directly.

```text
create draft -> edit template and variables -> submit -> publish as online after approval -> application reads it
```

- If an enabled Pipeline node supports Prompt, submission enters `reviewing`. Completion moves the version to `reviewed`; publish after approval. After rejection, redraft before editing, or resubmit to rerun checks.
- If no applicable Pipeline node is available, submission publishes the version directly.
- Publishing or bringing a version online automatically updates `latest`; no manual update is needed.

Administrators can force publish a `draft`, `reviewing`, or `reviewed` version in emergencies to skip Pipeline validation. Offline versions use the online action instead.

## Runtime Query

Applications can query Prompts through the Client API. Common patterns are:

- Query by version when the application needs fixed behavior.
- Query by label when the application should follow `latest` or another agreed label.

If the application sends the md5 of its local cached Prompt, the server can tell whether the content has changed. If it has not changed, the application can keep using its local cache.

Client API reference: [Query Prompt](../open-api.md#31-query-prompt).

## Label Suggestions

The server manages `latest`. Publishing or bringing a version online makes it latest. Taking that version offline or deleting it selects another remaining online version; latest is removed if none remain. Custom label operations cannot override it.

For production:

- Use `latest` when applications should follow each publication.
- Pin an explicit version for fixed behavior. Use custom labels such as `stable` or `canary` for controlled rollouts.
- Publish and verify the target before moving custom labels. Moving a label does not change content or bring a version online.
- Before taking a version offline, check applications using that version or a custom label that points to it.

## Suggestions For Developers

- Keep variable names stable.
- Write a clear commit message for each Prompt change.
- Keep rollback versions for important Prompts.
- Use explicit versions in local development, and labels in production when appropriate.

## Suggestions For Platform Operators

- Enable publish Pipelines for production Prompts.
- Audit force publish operations.
- Review unused Prompts and drafts regularly.
- Use stricter visibility and permissions for high-risk Prompts.

## Related Documents

- [AI Registry Overview](./ai-registry-overview.md)
- [AI Resource Lifecycle](./ai-resource-lifecycle.md)
- [Client API](../open-api.md#3-ai)
- [Admin API](../../admin/admin-api.md#6-ai-prompt-management)
- [Console API](../../admin/console-api.md#6-prompt-management)
