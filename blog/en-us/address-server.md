# Nacos Environment Isolation

With the release of Nacos version 0.8, Nacos is one step closer to a production release(In fact, many enterprises have been on the production, such as Huya Inc). Generally speaking, the process of enterprise research and development is generally like this: Features are developed and tested in a test environment, then grayscale, and finally released into production. In addition, in order to stabilize the production environment, the test environment needs to be isolated from the production environment. There is a problem that must be encountered: Multi-environment problem: How is data from multiple environments (such as test and production) isolated? How to gracefully isolate (without any changes by the user)? The following will introduce Alibaba's practical experience in this regard on the issue of Nacos environmental isolation.

[]()<a name="d0eabe32"></a>
## What is the environment?

When it comes to environment isolation, the first thing to know is what environment. At present, there is no unified definition of the word environment. Some companies call it environment, region in Alibaba Cloud, namespace in kubernetes architecture, and so on. In this paper, we define an environment as a logically or physically separate set of systems that contain all the components (gateways, service frameworks, microservice registries, config centers, messaging systems, caches, databases, etc.) that can handle a given class of requests. For example, many websites have a concept of user ids, which can be split into even ids and processed by one system for even ids and another for odd ids. This is shown in the figure below. By environment isolation we mean physical isolation, that is, different environments are different clusters of machines.



![](https://cdn.nlark.com/yuque/0/2019/png/333810/1559699207043-bff71a91-b187-489e-a3c4-79322913fd54.png#alt=undefined)

[]()<a name="efec68f6"></a>
## What's the use of environmental isolation?

In the previous section, we defined the concept of an environment, that is, a system that contains all the necessary components to handle a user's requests, for a given class of requests. In this section, we discuss some of the benefits of environmental isolation. From the definition of the concept, we can see that environmental isolation has at least three benefits: fault isolation, fault recovery, and grayscale testing.

[]()<a name="dbbde2aa"></a>
### Fault Isolation

First, because the environment is a separate unit of components that can handle user requests, this means that user requests can be processed for any length of time without leaving a particular cluster of machines. Even if this part of the machine fails, it will only affect a subset of users, thus isolating the failure within the specified scope. If we divide all the machines into ten environments according to the user id, the impact of an environment failure on the user will be reduced to one tenth, greatly improving the system availability.

[]()<a name="e443c432"></a>
### Failure Recovery

Another important advantage of environmental isolation is the ability to quickly recover from failures. When there is a service problem in one environment, it can quickly change the route direction of user's request through the distribution configuration, and route the request to another environment to achieve second-level failure recovery. Of course, this requires a powerful distributed system, especially a powerful configuration center (such as Nacos), which needs to quickly push routing rules configuration data to all application processes across the network.

[]()<a name="385e0b0a"></a>
### Grayscale Testing

Grayscale testing is an indispensable part of the research and development process. In the traditional development process, testing and grayscale links need to test students to do a variety of configurations, such as binding host, configuring jvm parameters, environment variables, and so on, which is more troublesome. After years of practice, Alibaba's internal testing and grayscale are very friendly to development and testing. Through the environment isolation function, it ensures that requests are processed in the designated machine cluster, and development and testing do not need to do any configuration, which greatly improves the efficiency of research and development.

[]()<a name="37555cc2"></a>
## How does Nacos do environmental isolation

The previous two sections talked about the concept of environment, what is the role of environment isolation, this section will introduce you how to isolate Nacos in accordance with the previous ideas into multiple environments. Nacos is born out of the soft load group of Alibaba middleware department, and we have many years of experience in environmental isolation. The following brief introduction to the Nacos isolation of multiple physical clusters, nacos clients do not need to do any code changes to achieve automatic routing environment.

[]()<a name="b6724cff"></a>
### Principle

Before we start, let's do some constraints:

- Applications deployed on one machine are all in one environment.
- By default, an application process is connected to only one Nacos environment.
- Through some means can get the client machine ip.
- The user has a plan for the network segments of the machine.

Here's a quick overview of the basics:

- We know that the network 32-bit ipv4 can be divided into a lot of network segments, such as 192.168.1.0/24 this, and generally slightly larger companies will have network segment planning, according to a certain purpose of dividing the network segment. We can use this principle to do environment isolation, that is, the IP of different network segments belongs to different environments, such as 192.168.1.0/24 belongs to environment A, 192.168.2.0/24 belongs to environment B and so on.
- Those who have used Nacos know that there are two ways to initialize a Nacos client instance. One is to tell the client the IP of the nacos server directly. The other is to tell the client an endpoint, and the client queries the nacos server IP list through HTTP request to the endpoint. We make use of the second Nacos initialization mode.
- Enhance endpoint functionality. The mapping relationship between network segment and environment is configured at the endpoint. After receiving the request from the client, the endpoint calculates the environment of the client according to the network segment that the client's source IP belongs to, and then returns the IP list of the corresponding environment to the client. This is shown in the figure below.

![](https://cdn.nlark.com/yuque/0/2019/png/333810/1559699221719-b127d968-2374-4fad-b433-733f47642bf0.png#alt=undefined)

[]()<a name="f172b185"></a>
## An example of an environment isolation server

Now that we've covered the constraints and fundamentals of environment isolation based on IP segments, how do we implement an address server? The simplest method is based on nginx implementation, using nginx geo module, do IP end and environment mapping, and then use nginx to return static file content.

- 
Install nginx [http://nginx.org/en/docs/install.html](http://nginx.org/en/docs/install.html)

- 
Configure the geo mapping in nginx-proxy.conf. [Refer to here](http://nginx.org/en/docs/http/ngx_http_geo_module.html)
```
geo $env {
  default        "";
  192.168.1.0/24 -env-a;
  192.168.2.0/24 -env-b;
}
```


- 
To configure the nginx root path and forwarding rules, we simply return the contents of the static file.
```
# Configure the root path in the http module
root                    /tmp/htdocs;

# Configure in the server module
location / {
  rewrite ^(.*)$  /$1$env break;
}
```


- 
Configure the Nacos server IP list configuration file, in the /tmp/hotdocs/nacos directory to configure the file ending with the environment name, the file content is IP, one per line.
```
$ll /tmp/hotdocs/nacos/
total 0
-rw-r--r-- 1 user1 users 0 Mar  5 08:53 serverlist
-rw-r--r-- 1 user1 users 0 Mar  5 08:53 serverlist-env-a
-rw-r--r-- 1 user1 users 0 Mar  5 08:53 serverlist-env-b

$cat /tmp/hotdocs/nacos/serverlist
192.168.1.2
192.168.1.3
```


- 
Verification


```
curl 'localhost:8080/nacos/serverlist'
192.168.1.2
192.168.1.3
```

At this point, a simple example of environmental isolation according to IP network segment has been able to work, different network segments nacos clients will automatically get different Nacos server IP list, to achieve environmental isolation. The advantage of this method is that the user does not need to configure any parameters, the code and configuration are the same for each environment, but the students who provide the underlying service need to do the network planning and related configuration.

[]()<a name="25f9c7fa"></a>
## Summary

This paper briefly introduces the concept of environment isolation, three benefits of environment isolation and how Nacos does environment isolation based on network segments. Finally, an example of environment isolation configuration based on nginx for endpoint server is given. This article is just a list of possible ways to do it. There are more elegant ways to implement it if you can see the nacos community or [nacos.io](nacos.io) contributing to it.
