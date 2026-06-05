---
title: Nacos E2E Tests
keywords: [Nacos,Tests,E2E]
description: The end-to-end testing project for Nacos is designed to verify the functional correctness of Nacos in various scenarios.
sidebar:
    order: 2
---

# Nacos E2E Tests

The [`nacos-group/nacos-e2e`](https://github.com/nacos-group/nacos-e2e) project is the end-to-end testing project for Nacos. It verifies the functional correctness of Nacos in different scenarios. To add test cases to this project, follow these steps:

## 1. Preparation

+ **Fork the repository**: First, fork the `nacos-group/nacos-e2e` repository to your own GitHub account.
+ **Clone the repository**: Clone the forked repository locally.

```shell
git clone https://github.com/your-username/nacos-e2e.git
cd nacos-e2e
```

+ **Set the upstream repository**: To pull the latest official updates, set the upstream repository.

```shell
git remote add upstream https://github.com/nacos-group/nacos-e2e.git
```

## 2. Understand the Existing Structure

View the project directory structure. It is mainly organized by client test language type and dependencies used by CI to deploy Nacos. The Java directory is further organized by client version range and authentication test cases.

+ `cicd`: The `build` directory contains Docker-related files, build scripts, and Nacos deployment configuration files. The `helm` directory contains the Kubernetes package manager content, which simplifies application deployment on Kubernetes clusters.
+ `cpp`: Test cases written in C++ to test the C++ client.
+ `csharp`: Test cases written in C# to test the C# client.
+ `golang`: Test cases written in Go to test the Go client.
+ `java`: Test cases written in Java to test the Java client. The four directories verify the following scenarios:
    - `auth`: Deploys Nacos in standalone mode and verifies scenarios after authentication is enabled.
    - `nacos-1X`: Test scenarios for 1.x clients with versions later than 1.3 and earlier than 2.0.
    - `nacos-1X-1.3down`: Test scenarios for 1.x clients with version 1.3 or earlier.
    - `nacos-2X`: Test scenarios for 2.x clients with version 2.0 or later.
+ `nodejs`: Test cases written in Node.js to test the Node.js client.
+ `python`: Test cases written in Python to test the Python client.

## 3. Add Test Cases

The following example shows how to add a config center-related test case under the `java/nacos-2X` directory:

+ **Choose a suitable package**: Based on the client language and client version you want to test, choose or create a suitable package, such as `/nacos-e2e/java/nacos-2X/src/test/java/com/alibaba/nacos/config`.
+ **Write a test class**: Create a new test class under the selected package, such as `YourFeatureTest.java`.
    - Each directory inherits from a test base class. For example, config tests inherit from the `ConfigBase` base class. This base class declares constants used by config tests and defines methods annotated with `@BeforeAll` and `@AfterAll` that run before or after all test methods.
    - The `ConfigBase` base class inherits from `BaseOperate`, which defines common operations, such as the `Properties` used to initialize config center and service center connections.
    - `BaseOperate` inherits from `ResourceInit`, which defines variables used during initialization, obtained from environment variables or local files, writes server-side data before all cases start, initializes necessary data such as namespaces, and obtains current server and client data such as server version and client version.
+ **Configure dependencies**: If new dependencies are required, modify `pom.xml` or other build files.
+ **Test class specifications**:
    - Methods annotated with `@BeforeEach` randomly initialize and configure data for each test case.
    - Methods annotated with `@AfterEach` delete or otherwise clean up data written by each test case.
    - Methods annotated with `@Test` contain the test case logic, and `@DisplayName` describes the scenario tested by the current case.

Example code:

```java
package com.alibaba.nacos.config;

import com.alibaba.nacos.util.RandomUtils;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class YourFeatureTest extends ConfigBase{
    private static final Logger log = LoggerFactory.getLogger(ConfigNormalTest.class);
    private String dataId;
    private String group;
    private String content;
    private Map<String ,String> cleanConfigMap = new HashMap<>();
    
    @BeforeEach
    public void setUp() throws Exception{
        dataId = "config.test." + RandomUtils.getStringWithCharacter(10);
        group = DEFAULT_GROUP;
    }

    @AfterEach
    public void tearDown() throws Exception {
        Iterator<Map.Entry<String, String>> iterator = cleanConfigMap.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, String> entry = iterator.next();
            Boolean result = config.removeConfig(entry.getKey(), entry.getValue());
            if (result) {
                iterator.remove();
            }
        }
    }

    @Test
    @DisplayName("Publish normal character and sleep 3000ms to get config, expect get correct config content.")
    public void testPublishAndGetConfig_normalCharacter() throws Exception{
        content = RandomUtils.getStringWithCharacter(20);
        boolean result = config.publishConfig(dataId, group, content);
        log.info("publishConfig dataId:{}, group:{}, result:{}", dataId, group, result);
        Assertions.assertTrue(result, "publishConfig check fail");
        cleanConfigMap.put(dataId, group);
        Thread.sleep(TIME_OUT);

        String value = config.getConfig(dataId, group, TIME_OUT);
        log.info("getConfig dataId:{}, group:{}, value:{}", dataId, group, value);
        Assertions.assertEquals(content, value, "getConfig value is not expect one");
    }

}

```

## 4. Run Tests

For cases under the `java` directory, modify the `serverList` variable in the `daily.conf` file of each module to the specified server `IP:Port`, pass it in the command, or run the tests in a local IDE.

+ **Test case execution command:**

```shell
mvn clean test -B -Dtest=YourFeatureTest -DserverList=127.0.0.1
```

For cases in other languages, refer to the `run.sh` file in the `bin` directory of each language module. After the language environment is ready, install the required packages and set environment variables before running the tests, or install the corresponding IDE and run them locally.

## 5. Submit Changes

+ **Commit code**: Commit your changes to the local repository.

```shell
git add .
git commit -m "Add new e2e test for your feature"
```

+ **Push to the remote repository**: Push the changes to your GitHub repository.

```shell
git push origin main
```

## 6. Create a Pull Request

+ **Create a PR**: Return to the GitHub page, click the "New pull request" button, select your branch and compare it with the main branch of `nacos-group/nacos-e2e`, and then create the pull request.
+ **Wait for review**: Project maintainers review your PR and may request changes. Adjust your changes based on the feedback.

## 7. Merge the PR

+ **Merge**: Once the PR is approved, it is merged into the main branch.

With these steps, you can successfully add test cases to the `nacos-group/nacos-e2e` project.

## 8. CI Capabilities in the Main Nacos Repository

1. After test cases are successfully added to the `nacos-group/nacos-e2e` project, they are eventually triggered and run in the actions of the `alibaba/nacos` repository.
2. CI uses Alibaba Cloud ASK capabilities to provide an independent Nacos environment for each push and PR for E2E testing. Deployment uses the Helm chart in the `nacos-group/nacos-e2e` repository (`nacos-e2e/cicd`), and the image is built from the code of the current commit.
3. For security reasons, CI for PR and push events is separated into two pipelines. After a PR triggers E2E testing, a comment is written back to the PR and can link to the corresponding test report.
4. Test reports are visualized. The report for each E2E test is displayed visually on the CI execution page, so you do not need to inspect logs, making troubleshooting easier.
5. Compatibility testing is supported, with tests for multiple OS and JDK versions executed concurrently.
