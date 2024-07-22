---
title: 如何提交问题报告
keywords: [提交问题报告, Nacos, GitHub, 错误报告, 安全问题, ASRC]
description: 本文指导用户如何向Nacos项目提交问题报告，包括详细步骤和建议，以及如何通过ASRC报告安全问题，确保问题得到有效处理。
sidebar:
    order: 4
---

# 如何提交问题报告

如果Nacos项目的任何部分存在问题或文档问题，请通过[opening an issue](https://github.com/alibaba/nacos/issues/new)告诉我们。我们非常认真地对待错误和错误，在产品面前没有不重要的问题。不过在创建错误报告之前，请检查是否存在报告相同问题的issues。

为了使错误报告准确且易于理解，请尝试创建以下错误报告：

- 具体到细节。包括尽可能多的细节：哪个版本，什么环境，什么配置等。如果错误与运行Nacos服务器有关，请附加Nacos日志（具有Nacos配置的起始日志尤为重要）。

- 可复现。包括重现问题的步骤。我们理解某些问题可能难以重现，请包括可能导致问题的步骤。如果可能，请将受影响的Nacos数据目录和堆栈strace附加到错误报告中。

- 不重复。不要复制现有的错误报告。

在创建错误报告之前，最好阅读下[Elika Etemad关于提交好错误报告的文章](http://fantasai.inkedblade.net/style/talks/filing-good-bugs/)，相信 会给你启发。

我们可能会要求您提供更多信息以查找错误。将关闭重复的错误报告。

[nacos-issue](https://github.com/alibaba/nacos/issues/new)
[filing-good-bugs](http://fantasai.inkedblade.net/style/talks/filing-good-bugs/)

# 如何提交安全问题

如果您发现Nacos项目中存在安全问题，请通过[ASRC（Alibaba Security Response Center阿里安全响应中心）]( https://security.alibaba.com) 告知我们。
