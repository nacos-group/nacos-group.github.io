---
title: Nacos E2E Tests
keywords: [Nacos,Tests,E2E]
description: The end-to-end testing project for Nacos is designed to verify the functional correctness of Nacos in various scenarios.
sidebar:
    order: 2
---

# Nacos E2E 测试

[`nacos-group/nacos-e2e`](https://github.com/nacos-group/nacos-e2e) 项目是 Nacos 的端到端测试项目，用于验证 Nacos 在不同场景下的功能正确性。如果你想要向这个项目中新增测试用例，可以按照以下步骤进行：

## 1. 准备工作

+ **Fork 仓库**：首先你需要在 GitHub 上 Fork `nacos-group/nacos-e2e` 仓库到你自己的账号下。
+ **克隆仓库**：将 Fork 后的仓库克隆到本地。

```shell
git clone https://github.com/your-username/nacos-e2e.git
cd nacos-e2e
```

+**设置上游仓库**：为了能够拉取官方最新的更新，建议设置上游仓库。

```shell
git remote add upstream https://github.com/nacos-group/nacos-e2e.git
```

## 2. 理解现有结构

查看项目的目录结构，目前主要按客户端测试语言类型和CI部署Nacos的依赖区分，其中java按客户端版本范围和鉴权用例区分

+ cicd，build目录包含docker相关文件、构建脚本和Nacos部署的配置文件；helm目录包含Kubernetes 的包管理器，它简化了在 Kubernetes 集群上部署应用程序的过程
+ cpp，用C++语言编写的用例，测试C++客户端
+ csharp，用csharp语言编写的用例，测试csharp客户端
+ golang，用golang语言编写的用例，测试go客户端
+ java，用java语言编写的用例，测试java客户端，其中4个目录分别验证：
    - auth，部署单例模式的Nacos，验证开启鉴权后的场景
    - nacos-1X，1.X客户端在1.3版本以上及2.0版本以下时的测试场景
    - nacos-1X-1.3down，1.X客户端在1.3及以下版本时的测试场景
    - nacos-2X，2.X客户在2.0及以上版本时的测试场景
+ nodejs，用nodejs语言编写的用例，测试nodejs客户端
+ python，用python语言编写的用例，测试python客户端

## 3. 新增测试用例

下面以在`java/nacos-2X`目录下新增一个配置中心相关用例举例：

+ **选择合适的包**：根据你要测试的客户端语言和客户端版本，选择或创建一个合适的包（例如 `/nacos-e2e/java/nacos-2X/src/test/java/com/alibaba/nacos/config`）。
+ **编写测试类**：在选定的包下创建一个新的测试类，例如 `YourFeatureTest.java`。
    - 每个目录下会继承一个测试基类，如此配置继承ConfigBase基类，此基类进行配置测试用到的常量声明以及在@BeforeAll  @AfterAll 中定义在所有测试方法执行之前或之后运行的方法
    - ConfigBase基类继承BaseOperate，定义一些通用的操作，比如配置中心和服务中心初始化连接时用到的Properties
    - BaseOperate继承ResourceInit，定义初始化时用到的变量（从环境变量或者本地文件中获取到的变量）、所有用例启动前服务端的数据写入，初始化一些必要数据（比如命名空间），获取当前服务端客户端的数据（服务端版本、客户端版本等）
+ **配置依赖**：如果需要引入新的依赖，请修改 `pom.xml` 或其他构建文件。
+ **测试类规范**：
    - @BeforeEach 注解的方法中对每个用例数据进行随机初始化和配置
    - @AfterEach 注解的方法中对每个用例写入数据进行删除等操作清理
    - @Test 注解的方法中进行用例逻辑编写，在@DisplayName 中描述当前用例测试的场景

示例代码：

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

## 4. 运行测试

java目录下的用例，修改每个module的daily.conf文件中serverList变量为指定服务端IP:Port，或者在执行命令中传入，亦或本地编译器中执行

+ **用例执行命令：**

```shell
mvn clean test -B -Dtest=YourFeatureTest -DserverList=127.0.0.1
```

其他语言下的用例执行，可以参考每种语言的module下bin目录的run.sh文件，在语言环境具备情况下，安装必要的包和设置环境变量后执行，亦或安装相应的编译器本地执行

## 5. 提交更改

+ **提交代码**：将你的更改提交到本地仓库。

```shell
git add .
git commit -m "Add new e2e test for your feature"
```

+ **推送到远程仓库**：将更改推送到你的 GitHub 仓库。

```shell
git push origin main
```

## 6. 创建 Pull Request

+ **创建 PR**：回到 GitHub 页面，点击 "New pull request" 按钮，选择你的分支与 `nacos-group/nacos-e2e` 的主分支进行比较，然后创建 Pull Request。
+ **等待审查**：项目维护者会对你的 PR 进行审查，可能会提出一些修改意见。根据反馈进行相应的调整。

## 7. 合并 PR

+ **合并**：一旦 PR 被批准，它会被合并到主分支中。

通过以上步骤，你就可以成功地向 `nacos-group/nacos-e2e` 项目中新增测试用例了。

## 8. Nacos主仓库CI能力

1. 成功地向 `nacos-group/nacos-e2e` 项目中新增测试用例后，用例最终在`alibaba/nacos` 仓库的actions中触发运行。
2. CI通过使用阿里云ASK能力为每次PUSH和PR提供一个独立的Nacos环境进行E2E测试，部署使用nacos-group/nacos-e2e仓库中的helm chart(nacos-e2e/cicd)，镜像为当次提交的代码。
3. 由于安全性考虑，将PR和PUSH动作的CI分离为两个流水线。PR触发E2E测试后回写评论至PR中，可以关联跳转到对应的测试报告。
4. 测试报告可视化，每次E2E测试的报告在CI当次执行页面上可视化展示，无需查看日志，方便排查。
5. 支持兼容性测试，并发执行多OS和JDK版本的测试。

