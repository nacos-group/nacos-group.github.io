## 公共概念
### 区域（Region）

物理集群部署的最大单位，从地理上看，可以是一个城市或者多个城市，不同区域的集群之间不感知。

### 接入点（Endpoint）

### 命名空间
用于进行租户粒度的配置隔离。不同的命名空间下，可以存在相同的 Group，Data ID 的配置。Namespace 的常用场景之一是不同环境的配置的区分隔离，如开发测试环境和生产环境的配置隔离等。

### 可用区（Available Zone）

一个区域下面可以分出多个可用区，用户默认访问当前可用区，一个区域下不同可用区的数据需要实时同步。


## 配置管理
### 配置

在系统开发过程中通常会将一些需要变更的参数、变量等从代码中分离出来独立管理，以独立的配置文件的形式存在。目的是让静态的系统工件或者交付物（如 WAR，JAR 包等）更好地和实际的物理运行环境进行适配。配置管理一般包含在系统部署的过程中，由系统管理员或者运维人员完成这个步骤。配置变更是调整系统运行时的行为的有效手段之一。

### 配置管理
在数据中心中，系统中所有配置的编辑、存储、分发、变更管理、历史版本管理、变更审计等所有与配置相关的活动统称为配置管理。

### 配置项

是指一个具体的可配置的参数与其值域，通常是 param-key=param-value 的形式存在。例如我们常配置系统的日志输出级别（logLevel=INFO|WARN|ERROR） 就是一个配置项。

### 配置集

一组相关或者不相关的配置项的集合称为配置集。通常系统中的一个配置文件就是一个配置集，其内包含了系统各个方面配置。例如一个配置集可能包含了系统如数据源、线程池、日志级别等配置项。

### 配置集 ID（Data ID）

在 ACM 中代表配置集的 ID, 是配置组织的维度之一。一般通过 Data ID 来组织划分系统的配置集。一个系统或者应用可以包含多个配置集，每个配置集可以用有意义的名称来标识这个配置集。Data ID 通常采用类 Java 包命名方式（如com.taobao.tc.refund.log.level）的命名规则保证全局唯一性，此命名规则非强制。

### 配置分组（Group）

ACM 中配置集的分组，是配置组织的维度之一。通常使用一个有意义的字符串来分组配置集，例如 Buy，Trade 等，用以区分相同 Data ID 的配置集。ACM 创建配置时，如果用户未填 Group 名字，则默认用 DEFAULT\_GROUP 代替。Group 的常用场景是同一个配置类型用于不同应用或者组件，如 database\_url 配置，MQ\_topic 配置等。

### 配置快照

ACM 客户端 SDK 会在本地生成配置的快照。当客户端无法连接到 ACM Server 时，可以利用快照提示系统的整体容灾能力。配置快照类似于 Git 中的本地 commit 的概念，也类似缓存，会在适当的时机更新，但是没有缓存过期（expire）的概念。


## 服务发现
### 服务元信息（Service Metadata）
<strong><span data-type="background" style="background-color:rgb(255, 255, 255)"><span data-type="color" style="color:rgb(245, 34, 45)">服务</span></span></strong><span data-type="background" style="background-color:rgb(255, 255, 255)">级别的</span>自定义配置<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">信息，如容灾策略、负载均衡策略、鉴权配置、各种tag。</span></span>

### 应用（Application）
不同的__<span data-type="color" style="color:rgb(245, 34, 45)">服务</span>__可以根据服务的提供方进行分类，这种分类的其中一个单位是<span data-type="color" style="color:rgb(245, 34, 45)"><strong>应用</strong></span>。

### 分组（Service Group）
不同的服务可以归类到同一分组。

### 虚拟集群（Virtual Cluster）
同一个<span data-type="color" style="color:rgb(245, 34, 45)"><strong>服务</strong></span>下的服务实例可以再进行分类，这个分类的一个可能单位是<span data-type="color" style="color:rgb(245, 34, 45)"><strong>分组</strong></span>。

### 虚拟集群元信息（Virtual Cluster Metadata）
__<span data-type="color" style="color:rgb(245, 34, 45)">分组</span>__级别的自定义配置，这个配置对同一个分组下的实例生效。

### 默认端口（Default Port）
虚拟集群配置之一，表示注册到该虚拟集群下的实例，如果不指定端口，则使用该默认端口提供服务。

### 使用实例端口进行健康检查（Use Port of IP for Health Check）
虚拟集群配置之一，表示是否使用实例注册的端口进行健康检查。

### 默认检查端口（Default Check Port）
虚拟集群配置之一，表示对该虚拟集群下的实例进行健康检查的默认端口，当指定不使用实例注册的端口进行健康检查时，则使用该端口进行健康检查。

### 实例（Instance）
提供一个或多个__<span data-type="color" style="color:rgb(245, 34, 45)">服务</span>__的具有可访问网络地址（IP:Port）的进程。

### 实例元信息（Instance Metadata）
__<span data-type="color" style="color:rgb(245, 34, 45)">实例</span>__级别的自定义配置。

### 权重（Weight）
实例级别的配置，权重是一个浮点型数。权重越大，表示该实例期望被分配的流量越大。

### 健康检查（Health Check）
以指定方式检查服务下挂载IP的健康度，确认该IP能否提供服务。根据检查结果，IP会被判断为健康或不健康。对服务发起解析请求时，不健康的IP不会返回给客户端。

### 健康保护阈值（Protect Threshold）
为了防止因部分IP不健康导致流量全部流向健康IP，继而造成流量压力把健康IP压垮并形成雪崩效应，健康保护阈值应定义一个0到1之间的浮点数。当域名健康IP占总IP的比例小于该值时，无论IP是否健康，都会将这个IP返回给客户端。这样做虽然损失了一部分流量，但是保证了剩余健康IP能正常工作。


