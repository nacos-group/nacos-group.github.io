---
title: Nacos 3.0 Source Code Packaging and Startup
keywords: [Source code packaging, Source code startup]
description: This article mainly records the process of packaging and starting the Nacos 3.0 source code.
sidebar:
    order: 5
---

## Nacos Source Code Packaging and Startup

According to the provisions of the Nacos open-source license (Apache License 2.0), you have the right to modify and repackage the Nacos source code. However, when performing these operations, you must ensure compliance with its license requirements, such as retaining the original copyright and license statements.
Before packaging the Nacos source code, it should be noted that Nacos 3.0 normalizes the original server and console components into a single module, `bootstrap`, for unified management. Therefore, you can control the startup mode by selecting the `nacos.deployment.type` parameter with the following three values:

| Parameter Value | Description                           |
|-----------------|---------------------------------------|
| merged          | Start both the server and the console |
| server          | Start only the server                 |
| console         | Start only the console                |

The following is a formal description of the general steps for packaging based on the Nacos 3.0 source code structure. To facilitate data exchange with the local Nacos 3.0 program, this article uses MySQL as the database. The steps are as follows:

### Step 1: Pull the Nacos 3.0 Source Code

Clone the source code from the [Nacos GitHub repository](https://github.com/alibaba/nacos) to your local machine. You can use the following Git command to complete this operation:

```bash
git clone https://github.com/alibaba/nacos.git
cd nacos
```

### Step 2: Build the Necessary Environment

The necessary environment for building Nacos 3.0 includes:
1. 64-bit OS, supporting Linux/Unix/Mac/Windows. It is recommended to use Linux/Unix/Mac for executing test code.
2. 64-bit JDK 17+; [Download](https://www.oracle.com/java/technologies/downloads/#java17) & [Install](https://docs.oracle.com/en/java/javase/17/install/overview-jdk-installation.html)
3. Maven; It is recommended to use version 3.3.9 or higher.
4. Since this article uses a MySQL database, make sure that the MySQL database is installed and running.

To verify whether the above environment is installed successfully, execute the following commands:

```bash
java -version
mvn -v
mysql -V
```

### Step 3: Package Nacos 3.0

Navigate to the `bootstrap` directory of the Nacos project and execute the Maven command to compile and package the code for the console and server of Nacos. This will generate an executable JAR file (`nacos-server.jar`) in the `bootstrap/target` directory.

The specific command is as follows:

```bash
cd nacos/bootstrap
mvn clean package -Prelease-nacos
```

### Step 4: Verify the JAR File

If you can see the `BOOT-INF` directory after unpacking the `nacos-server.jar`, it means that the JAR file is an executable JAR file.

```bash
# Unpack the JAR file to a specified directory
mkdir myjar && cd myjar
jar xvf ../nacos-server.jar
# Navigate to the unpacked directory
cd myjar
# View the directory structure (`-l` to display detailed information, `-d` to display only directories)
ls -ld BOOT-INF
```

### Step 5: Start Nacos-Bootstrap in Merged Mode

Add the following configuration to the `Nacos/bootstrap/src/main/resources/application.properties` file:

```properties
spring.sql.init.platform=mysql
db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user=${MYSQL_USERNAME}
db.password=${MYSQL_PASSWORD}
```

Start `Nacos-bootstrap` and specify the `nacos.deployment.type` parameter as `merged`. The startup command is as follows:

```bash
java -jar target/nacos-server.jar --nacos.mode=standalone --nacos.core.auth.server.identity.key=${key} --nacos.core.auth.server.identity.value=${value} --nacos.core.auth.plugin.nacos.token.secret.key=${secret_key}
```

Here, `${key}` and `${value}` are parameters for server identity authentication, and `${secret_key}` is a custom token. The token is the secret key for generating a JWT Token from the username and password (the original string should be more than 32 characters long and then formatted in Base64).

### Step 6: Verify Whether Nacos-Bootstrap Has Started Successfully

Access `http://127.0.0.1:8080` in your browser. If a login page appears, it means that Nacos-Bootstrap has started successfully.

### Explanation

The above steps start from pulling the Nacos source code, packaging `Nacos-bootstrap`, and starting the `nacos-server.jar`. Throughout the process, we have complied with the requirements of the open-source license and made no modifications or deletions to the original copyright information. By directly running the packaged JAR file, you can easily start the `Nacos Server` and `Nacos console` for testing or deployment.

It is worth mentioning that in actual operations, you may need to modify the commands and the content in the configuration file according to your own needs (such as the external MySQL database address, username, and password in this article).

<font color="#949494">---------------</font>

## Reference Links

[How to Package the Nacos Source Code](https://nacos.io/blog/faq/nacos-user-question-history15234/)

<font color="#949494">---------------</font>

## Related Projects

[Nacos](https://github.com/alibaba/nacos)
