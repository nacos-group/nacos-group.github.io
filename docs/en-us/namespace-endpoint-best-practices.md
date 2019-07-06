---
title: Namespace,endpoint best practices
keywords: namespace,endpoint,best practices
description: With using Nacos enterprises more and more,the two most frequently encountered problem is:how to use in my production environment right namespace and the endpoint.
---

# Namespace, endpoint best practices

With using Nacos enterprises more and more, the two most frequently encountered problem is: how to use in my production environment right namespace and the endpoint.

## namespce

Regarding the namespace, the following main from **namespace design background** and **namespace best practice** two aspects to discuss.

### namespace design background

Namespace design is made more nacos based on this environment and multi-tenant data (**configuration and service**) of isolation.That is:

* From the point of view of a tenant (user), if there are many different environment, so this time can be specified according to the environment to create different namespce, in order to realize the environment isolation.For example, you might be everyday, pretest and the production of three different environment, then use a nacos cluster can build the following three different namespace. As shown in the figure below:

![](http://edas.oss-cn-hangzhou.aliyuncs.com/deshao/pictures/nacos_ingle_tenant_namespace.jpg)

* from the point of view of multiple tenants (user), each tenant (user) may have its own namespace, each tenant configuration data (user) and registered service data belonging to its own namespace, so as to achieve the multi-tenant isolation between the data.For example the supervisor assigned three tenants, San Zhang, Si Li and Wu Wang respectively.Distribution of good, after all the tenants on their own account name and password after logging in, create your own namespace. As shown in the figure below:

![](http://edas.oss-cn-hangzhou.aliyuncs.com/deshao/pictures/nacos_multi_tenant_namespace.jpg)

  **Note:** This feature is still in planning.
  
### namespace best practices

Best practices on the namespace, this part mainly consists of two actions:

* How to obtain the value of the namespace
* The namespace parameters initialization method

### How to obtain the value of the namespace 

Whether you are based on Spring Cloud or Dubbo to use nacos, involve namespace parameter input, so when the value of the namespace from where can I get?

1. If you are using is not aware to this parameter in the process of input, then nacos unified will use a default namespace as input, nacos naming will use **public** as the default parameters to initialize, nacos config will use an **empty string** as the default parameters to initialize.

2. If you need to customize your own namespace, then the value how to produce?

   Can see on the console function of the left side of the nacos has the function of a **namespace**, click on the **new namespace** can see button, so this time you can create your own namespace.Create success, generates a **namespace ID**, is mainly used to avoid **namespace name** namesake, is likely to happen. So when you need to configure the specified namespace in the application, **fill in it is the namespace ID**.The important things three times:

	1. When you need to configure the specified namespace in the application, **fill in it isthe namespace ID**.
	2. When you need to configure the specified namespace in the application, **fill in it isthe namespace ID**.
	3. When you need to configure the specified namespace in the application, **fill in it isthe namespace ID**.

Namesace for **public** is nacos a retain control, if you need to create your own namespace, it is best not to **public** and name repetition, to an actual business scenarios have specific semantic named after, lest bring literally a namespace which is not easy to distinguish himself.

### namespace parameters initialization method

Nacos client for namespace initialization process as shown in the figure below:

![](http://edas.oss-cn-hangzhou.aliyuncs.com/deshao/pictures/nacos_init_namespace_plus.jpg)

Nacos client initialization of the namespace contains two main parts:

* User mode by nacos client through the properties in the instance structure parameters was introduced into the namespace.

* In a cloud environment (**Alibaba cloud of EDAS**) of the namespace argument parsing.

  By **-Duse.cloud.namespace.parsing=true/false** whether you need to control in a cloud environment automatic parsing namespace parameter, the default value is **true**, is automatically parsed, its purpose is convenient when the user on the cloud can be smooth on the cloud in the form of zero cost.If the user on the cloud under the need to use the self-built nacos namespace, that this time you only need to **-Duse.cloud.namespace.parsing=false**.

## endpoint

On the endpoint, and mainly from the **the design background of endpoint** and **the endpoint parameters initialization** two aspects to discuss.

### The design background of endpoint

When nacos server cluster needs to enlarge shrinks, let a client needs to have a kind of ability can timely change perception to the cluster. In a timely manner to perceive the change of the cluster is realized through the endpoint.That the client will be timed to the endpoint sends a request to update the client list in memory clusters.

### The endpoint of the initialization parameter

Nacos Client provides an endpoint of the incoming parameter rules make sense of it.When through the constructor to initialize the **properties** the endpoint, the specified endpoint value can be a specific value, also can be in the form of a placeholder, as shown below:

> **\${endpoint.options:defaultValue}**。

Description: 

1. **endpoint.options** is a specific variable.Support from the system property, reads the system environment variables.
2. **defaultValue** is given a default value.When is not properly initialized from the specific variables, the given default value is used to initialize.

The endpoint of the parsing rules is more complex, the overall flow chart of a parse is as follows:

![](http://edas.oss-cn-hangzhou.aliyuncs.com/deshao/pictures/nacos_init_endpoint.jpg)

**Description:** Blue special distinction is to support a cloud environment (Alibaba cloud EDAS) automatically from the system environment variables to read in the endpoint value, in order to achieve the user local development or moving applications to the cloud with zero cost on the way to achieve a smooth of cloud.

Description:

* Open the endpoint parameters parsing rules

  1. If the initialization Nacos Client, not through the properties to specify the endpoint, this time from the system environment variables in called **ALIBABA\_ALIWARE\_ENDPOINT\_URL** to initialize the specified value, if the system environment variable is not set, so this time will return an empty string.

  2. If set the endpoint,
  
	  1. Set the endpoint is a specific value specified.

	     At this time will be from the system environment variables in the variables called **ALIBABA\_ALIWARE\_ENDPOINT\_URL** to initialize the specified value, if the system environment variables not set, so this time use user mode was introduced into the specific value to initialize the endpoint.
	
	  2. Input in the form of a placeholder.
	  
	     Then parses the concrete placeholder value, then:
		
	 	 1. In order to value from the system properties and environment variables.
	 	 
	 	 	 For example,You input is **${nacos.endpoint:defaultValue}**, then parse out a placeholder is **nacos.endpoint**. Parsing comes out, can read first in the System properties (**System.getProperty("nacos.endpoint")**) is set up **nacos endpoint** variable values, if not, will be called from the System environment variables in the variables specified **nacos.endpoint** value to initialize.
	 	 
	 	 2. If by parsing out a placeholder is not properly initialized the endpoint, is from the system environment variables in called **ALIBABA\_ALIWARE\_ENDPOINT\_URL** to initialize the specified value.
	 	 
	 	 3. If after the above two steps have not been initialized, then if you set the default value, this time will use the default value to initialize the endpoint, otherwise returned to parse out a placeholder.
		
* Close the endpoint parameter parsing rules

  When closed the endpoint parameter parsing rules, this time is in user mode in constructing Nacos Client through the properties parameter input values of the endpoint.
  
By default, Nacos Client is the ability to open the endpoint parameter parsing rules. If you want to close the ability, can be in Nacos Client initialization when the incoming instances of the properties specified in the key to **isUseEndpointParsingRule**, **false** value is can be closed.
