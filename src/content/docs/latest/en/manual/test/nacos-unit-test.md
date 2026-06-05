---
title: Nacos Unit Tests
keywords: [Nacos,Tests,Unit Tests]
description: Describe the Nacos unit testing specifications and the steps to run unit tests, helping developers quickly understand and contribute test code.
sidebar:
    order: 1
---

# Nacos Unit Tests

Nacos unit tests mainly refer to the most basic unit tests in the Nacos core repository [`alibaba/nacos`](https://github.com/alibaba/nacos). They are used to verify the logic correctness of each smallest test unit, usually a class, and the correctness of changes.

This document describes the Nacos unit test specifications and the steps to run unit tests, helping developers quickly understand how to write and contribute corresponding unit test code after modifying feature code.

## 1. Prepare for Nacos Unit Tests

- Refer to the first three steps in [Nacos Contribution Process](../../contribution/contributing-flow.md) to clone the repository and configure local Git.
- Install JDK 1.8 or later.
- Install Maven 3.2.5 or later.

## 2. Add Nacos Unit Test Cases

Nacos unit tests are based on the `junit5` and `mockito` test frameworks. For detailed usage, see [JUnit5](https://junit.org/junit5/docs/current/user-guide/) and [Mockito](https://site.mockito.org/#features).

The newly created unit test class should be in the same module and package as the class being tested whenever possible. If a unit test class already exists, add test cases to the existing test class instead of creating a new one. In some cases, to avoid interference between test cases, you can create a new unit test class, but the new class name should clearly explain the scenario.

New unit test classes must follow these specifications:

### 2.1. Nacos Unit Test Specifications

1. The unit test class name must end with `Test`, and the preceding class name must match the class under test. For example, if the class name is `NacosNamingService`, the unit test class name should be `NacosNamingServiceTest`.
2. Unit test case names must start with `test`, followed by the method name to be tested, and use camel case, such as `testRegisterInstance`.
3. Assertions must exist in unit test cases.
4. Unit tests must not depend on external resources, such as databases. Use Mockito to mock them if needed.
5. If the method under test has multiple branches and test scenarios, create multiple test cases and use words such as `For`, `With`, and `Without` to describe the scenario, such as `testCheckParamInfoForNamespaceShowName` and `testCheckParamInfoForNamespaceId` in `DefaultParamCheckerTest`.
6. If a unit test case sets static variables, use `@AfterAll` or `@AfterEach` to roll them back after the case ends to avoid affecting other test cases.
7. Use the `@Mock` annotation to mock dependencies required by unit test cases whenever possible. Complete required setup and initialization in `@BeforeAll` and `@BeforeEach` whenever possible to avoid large amounts of repeated initialization code.
8. If a unit test needs to test asynchronous methods, use a mocked thread pool whenever possible. If a mocked thread pool cannot be used, try to control the thread pool startup time and interval to avoid long unit test execution time.
9. Unit test code must also follow the [Nacos Code Style](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md).

### 2.2. Nacos Unit Test Example

```java

public class YourClass {
    
    public boolean demo(String serviceName) {
        if (null == serviceName) {
            return false;
        }
        return doDemo(serviceName);
    }
    
    private boolean doDemo(String serviceName) {
        if (!ServiceManager.containService(serviceName)) {
            SecurityManager.newService(serviceName);
            return true;
        } else {
            throw new Exception();
        }
    }
}

public class YourClassTest {
    
    private YourClass yourClass;
    
    private String serviceName;
    
    @BeforeEach
    public void setUp() throws Exception{
        // do initial for each test cases;
        yourClass = new YourClass();
        serviceName = "test"; 
    }

    @AfterEach
    public void tearDown() throws Exception {
        // do clean data.
        ServiceManager.cleanService(serviceName);
    }

    @Test
    public void testDemoForNullService() {
        assertFalse(yourClass.demo(null));
    }
    
    @Test
    public void testDemoForExistService() {
        ServiceManager.newService(serviceName);
        assertThrows(Exception.class, () -> yourClass.demo(serviceName));
    }
    
    @Test
    public void testDemoForNotExistService() {
        assertFalse(ServiceManager.containService(serviceName));
        assertTrue(yourClass.demo(serviceName));
        assertTrue(ServiceManager.containService(serviceName));
        assertNotNull(ServiceManager.getService(serviceName));
    }
}
```

## 3. Run Nacos Unit Tests

Run the following command in the root directory of the Nacos repository to execute unit tests:

`mvn -Prelease-nacos clean test -DtrimStackTrace=false -e -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn`

After the tests complete, the terminal displays the test results. In each module, the `jacoco` plugin also generates the test coverage file for the current module, such as `api/target/site/jacoco/jacoco.xml`.

## 4. Submit Nacos Unit Tests

+ **Commit code**: Commit your changes to the local repository.

```shell
git add .
git commit -m "Add new unit test for class/packages/modules"
```

+ **Push to the remote repository**: Push the changes to your GitHub repository.

```shell
git push origin $your_branch_name
```

## 5. Create a Pull Request

+ **Create a PR**: Return to the GitHub page, click the "New pull request" button, select your branch and compare it with the main branch of `alibaba/nacos`, usually `develop`, and then create the pull request.
+ **Wait for review**: The PR uses `Github Action` to run a series of checks on the submitted unit tests and other changes. Project maintainers also review your PR and may request changes. Adjust your changes based on the results and feedback.
+ **Merge**: Once the PR is approved, it is merged into the main branch.

With these steps, you can successfully add test cases to the `alibaba/nacos` project.

## 6. Test Reports

In the PR and in `Github Action` after the PR is merged, the generated unit test reports are submitted to [CodeCov](https://app.codecov.io/gh/alibaba/nacos/) for statistics and analysis, where you can view test coverage.

At the same time, the PR contains a brief `Coverage` report as a comment. In principle, when test coverage decreases, community maintainers may choose not to merge the PR and remind you in the comment to add unit tests.

> The test coverage of some modules still needs improvement. Community contributions to test code are welcome.
