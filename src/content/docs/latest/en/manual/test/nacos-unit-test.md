---
title: Nacos Unit Tests
keywords: [Nacos,Tests,Unit Tests]
description: Describe the Nacos unit testing specifications and the steps to run unit tests, helping developers quickly understand and contribute test code.
sidebar:
    order: 1
---

# Nacos 单元测试

Nacos 单元测试主要指的是Nacos 核心仓库[`alibaba/nacos`](https://github.com/alibaba/nacos)中的最基本的单元测试，用于测试各个最小测试单元（一般是Class）的逻辑正确性及改动正确性。

该文档将介绍Nacos 单元测试的规范，以及运行单元测试的步骤，帮助开发者快速了解在修改功能代码后如何撰写并贡献对应的单元测试代码。

## 1. Nacos 单元测试准备工作

- 可参考[Nacos 贡献流程](../../contribution/contributing-flow.md)的前3个步骤，进行仓库克隆、和本地Git的设置。
- 安装JDK1.8+ 以上版本
- 安装Maven3.2.5 以上版本。

## 2. 新增Nacos 单元测试用例

Nacos 的单元测试基于`junit5`,`mockito`两个测试框架，详细使用方法请参考[JUnit5](https://junit.org/junit5/docs/current/user-guide/)和[Mockito](https://site.mockito.org/#features)。

新建的单元测试用例类需尽量与所测试类的模块、包名一致；若已经存在单元测试类，请尽量在原有测试类中添加测试用例，不要新建测试类，部分情况为避免用例互相干扰，可以新增单元测试类，但需要在新类名中进行说明和表达。

新增的单元测试类需要遵循如下规范：

### 2.1. Nacos 单元测试规范

1. 单元测试类必须以`Test`结尾，前面的类名必须与测试类名一致；如：类名为`NacosNamingService`，则单元测试类名为`NacosNamingServiceTest`。
2. 单元测试的用例必须以`test`开头，后接需要测试的方法名，以驼峰命名法命名测试用例，如：`testRegisterInstance`。
3. 单元测试用例中必须存在断言。
4. 单元测试中不允许依赖外部资源，如：数据库, 若有需要，请使用Mockito进行模拟。
5. 单元测试的用例若遇到所测试方法存在多个分支和测试用例的情况，请创建多个用例，且通过`For`,`With`,`Without`等描述测试用例场景，如：`DefaultParamCheckerTest`的`testCheckParamInfoForNamespaceShowName`、`testCheckParamInfoForNamespaceId`等。
6. 单元测试用例中如果存在设置 static 变量，请使用 `@AfterAll` 或 `@AfterEach` 注解在用例结束后进行回滚，避免影响其他测试用例。
7. 单元测试用例中所需要的依赖尽量使用`@Mock`注解进行模拟，需要用到的前置设置和初始化，尽量在`@BeforeAll` 和 `@BeforeEach`注解中完成，避免大量重复初始化代码。
8. 单元测试若需要测试异步方法，尽量使用mock的线程池进行，若无法使用mock线程池，可以尝试控制线程池的启动时间和间隔周期，避免单元测试运行时间过长。
9. 单元测试代码同样需要遵循[Nacos代码规范](https://github.com/alibaba/nacos/blob/develop/style/codeStyle.md)。

### 2.2. Nacos 单元测试示例

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

## 3. 运行Nacos 单元测试

在Nacos 仓库根目录下执行`mvn -Prelease-nacos clean test -DtrimStackTrace=false -e -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn`命令即可运行单元测试。

测试运行完成后，终端中会显示测试结果，同时在各自模块下，会通过`jacoco`插件生成当前模块的测试覆盖率文件，如`api/target/site/jacoco/jacoco.xml`。

## 4. 提交Nacos 单元测试

+ **提交代码**：将你的更改提交到本地仓库。

```shell
git add .
git commit -m "Add new unit test for class/packages/modules"
```

+ **推送到远程仓库**：将更改推送到你的 GitHub 仓库。

```shell
git push origin $your_branch_name
```

## 5. 创建 Pull Request

+ **创建 PR**：回到 GitHub 页面，点击 "New pull request" 按钮，选择你的分支与 `alibaba/nacos` 的主分支(一般为`develop`)进行比较，然后创建 Pull Request。
+ **等待审查**：PR中会通过`Github Action`对您提交的单元测试及其他修改进行一系列的检查工作，同时项目维护者会对你的 PR 进行审查，可能会提出一些修改意见。根据运行结果和反馈进行相应的调整。
+ **合并**：一旦 PR 被批准，它会被合并到主分支中。

通过以上步骤，你就可以成功地向 `alibaba/nacos` 项目中新增测试用例了。

## 6. 测试报告

在PR中以及PR被合并后的`Github Action`中，会对运行之后的单元测试报告，提交到[CodeCov](https://app.codecov.io/gh/alibaba/nacos/)上进行统计和分析，可以查看到测试覆盖率情况。

同时在PR中, 会有`Coverage`的简略报告，评论在PR中，原则上在测试覆盖率出现降低时，社区维护人员可能会选择不进行PR的合并，并在评论中提醒您补充单元测试。

> 当前部分模块的测试覆盖率还有待提高，欢迎社区同学贡献测试代码。
