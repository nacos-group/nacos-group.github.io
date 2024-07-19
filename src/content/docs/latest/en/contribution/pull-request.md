---
title: Submitting Request Templates
keywords: [pull request, template, changelog, unit test]
description: This article outlines the guidelines for submitting request templates, emphasizing the need to create associated issues before submission. It clarifies the purpose of the change, provides a brief changelog, and details verification procedures. A comprehensive checklist is provided to guide contributors on effectively integrating their code, covering aspects such as using Github issues, formatting pull request titles, writing descriptive change summaries, conducting necessary unit tests, and executing essential Maven commands for checks. Contributors of substantial work are reminded to sign the Apache Individual Contributor License Agreement.
---

# Submitting Request Templates

Do not submit requests without creating corresponding issues.

## Purpose of the Change

XXXXX

## Brief Changelog

XX

## Verifying This Change

XXXX

Adhere to this checklist to facilitate the swift and effortless incorporation of your contribution:

* [ ] Ensure a Github issue exists for the change (typically before starting work), except for trivial changes like typos. Your pull request should address solely this issue, avoiding inclusion of additional changes – one PR resolves one issue.
* [ ] Format the pull request title as `[ISSUE #123] Fix UnknownException when host config not exist`. Each commit within the pull request should have a meaningful subject and body.
* [ ] Compose a pull request description that sufficiently elucidates the change, its methodology, and rationale.
* [ ] Develop necessary unit tests to validate your logic corrections, employing more mocks when dealing with cross-module dependencies. If introducing a new feature or significant modification, remember to include integration tests in the [test module](https://github.com/apache/rocketmq/tree/master/test).
* [ ] Execute `mvn -B clean apache-rat:check findbugs:findbugs` to confirm the passage of fundamental checks. Run `mvn clean install -DskipITs` to ensure unit tests pass. Execute `mvn clean test-compile failsafe:integration-test` to verify the success of integration tests.
* [ ] For substantial contributions, please submit an [Apache Individual Contributor License Agreement](http://www.apache.org/licenses/#clas).