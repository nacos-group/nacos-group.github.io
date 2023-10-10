"use strict";(self.webpackChunkNacos=self.webpackChunkNacos||[]).push([[2276],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>h});var o=a(67294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,o,n=function(e,t){if(null==e)return{};var a,o,n={},r=Object.keys(e);for(o=0;o<r.length;o++)a=r[o],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)a=r[o],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var c=o.createContext({}),l=function(e){var t=o.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=l(e.components);return o.createElement(c.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=l(a),d=n,h=u["".concat(c,".").concat(d)]||u[d]||m[d]||r;return a?o.createElement(h,i(i({ref:t},p),{},{components:a})):o.createElement(h,i({ref:t},p))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,i=new Array(r);i[0]=d;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[u]="string"==typeof e?e:n,i[1]=s;for(var l=2;l<r;l++)i[l]=a[l];return o.createElement.apply(null,i)}return o.createElement.apply(null,a)}d.displayName="MDXCreateElement"},79177:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>r,metadata:()=>s,toc:()=>l});var o=a(87462),n=(a(67294),a(3905));const r={title:"Nacos 0.6\u7248\u672c\u53d1\u5e03\uff0c\u652f\u6301Dubbo\u751f\u6001\u5e76\u4e14\u652f\u6301Docker\u90e8\u7f72",keywords:["nacos0.6","dubbo","docker"],description:"Nacos 0.6\u7248\u672c\u53d1\u5e03\uff0c\u652f\u6301Dubbo\u751f\u6001\u5e76\u4e14\u652f\u6301Docker\u90e8\u7f72"},i="Nacos Released version 0.6, supports Dubbo and Docker",s={permalink:"/en/blog/nacos0.6",source:"@site/i18n/en/docusaurus-plugin-content-blog/nacos0.6.md",title:"Nacos 0.6\u7248\u672c\u53d1\u5e03\uff0c\u652f\u6301Dubbo\u751f\u6001\u5e76\u4e14\u652f\u6301Docker\u90e8\u7f72",description:"Nacos 0.6\u7248\u672c\u53d1\u5e03\uff0c\u652f\u6301Dubbo\u751f\u6001\u5e76\u4e14\u652f\u6301Docker\u90e8\u7f72",date:"2023-10-10T11:47:41.000Z",formattedDate:"October 10, 2023",tags:[],readingTime:6.62,hasTruncateMarker:!1,authors:[],frontMatter:{title:"Nacos 0.6\u7248\u672c\u53d1\u5e03\uff0c\u652f\u6301Dubbo\u751f\u6001\u5e76\u4e14\u652f\u6301Docker\u90e8\u7f72",keywords:["nacos0.6","dubbo","docker"],description:"Nacos 0.6\u7248\u672c\u53d1\u5e03\uff0c\u652f\u6301Dubbo\u751f\u6001\u5e76\u4e14\u652f\u6301Docker\u90e8\u7f72"},prevItem:{title:"Nacos0.5\u53d1\u5e03\uff0c\u652f\u6301DNS-based Service Discovery\uff0cJAVA 11",permalink:"/en/blog/nacos0.5"},nextItem:{title:"Nacos 0.8.0\u7248\u672c\u8fdb\u884c\u53d1\u5e03",permalink:"/en/blog/nacos0.8"}},c={authorsImageUrls:[]},l=[{value:"Thousands of calls come out, Dubbo&#39;s registration center and configuration center",id:"thousands-of-calls-come-out-dubbos-registration-center-and-configuration-center",level:2},{value:"Dubbo Service Framework",id:"dubbo-service-framework",level:3},{value:"Nacos and Dubbo are the same genes",id:"nacos-and-dubbo-are-the-same-genes",level:3},{value:"Dubbo Fusion Nacos",id:"dubbo-fusion-nacos",level:3},{value:"Containers are popular, Nacos supports Docker containerization",id:"containers-are-popular-nacos-supports-docker-containerization",level:2},{value:"How to deploy via Docker",id:"how-to-deploy-via-docker",level:3},{value:"Configuration Management Function Experience",id:"configuration-management-function-experience",level:4},{value:"Service Discovery Feature Experience",id:"service-discovery-feature-experience",level:4},{value:"The booming Nacos community",id:"the-booming-nacos-community",level:2},{value:"Newcomer Moments - &quot;What is Nacos?&quot;",id:"newcomer-moments---what-is-nacos",level:2},{value:"More open source project information related to Nacos",id:"more-open-source-project-information-related-to-nacos",level:2}],p={toc:l},u="wrapper";function m(e){let{components:t,...a}=e;return(0,n.kt)(u,(0,o.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"Authors: \u9a6c\u6615\u66e6\u3001\u5f20\u9f99\u3001\u90a2\u5b66\u8d85")),(0,n.kt)("p",null," Alibaba Microservices Open Source Project",(0,n.kt)("a",{parentName:"p",href:"https://github.com/alibaba/nacos"},"Dubbo Nacos"),"released this week ",(0,n.kt)("strong",{parentName:"p"},"v0.6")," version, which mainly supports Dubbo's service registration and discovery and configuration management, supports docker deployment, provides an official docker image, optimizes the international framework of Nacos console, and optimizes Nacos's integration testing efficiency."),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/png/11189/1544689744102-fd00fec6-ca80-4c0c-9b0d-538f17279963.png",alt:"image.png | left | 747x290"})),(0,n.kt)("h2",{id:"thousands-of-calls-come-out-dubbos-registration-center-and-configuration-center"},"Thousands of calls come out, Dubbo's registration center and configuration center"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Nacos")," Starting with the ",(0,n.kt)("strong",{parentName:"p"},"v0.6")," version, the ",(0,n.kt)("strong",{parentName:"p"},"Dubbo")," registration center and configuration center are supported. Also, as Alibaba's open source weight-level product, the two products are inextricably linked within the internal Alibaba Group."),(0,n.kt)("h3",{id:"dubbo-service-framework"},"Dubbo Service Framework"),(0,n.kt)("p",null,"As the rpc service framework, on the one hand, it pays attention to the extremely short delay rt, which ensures that the overall call is efficient, and on the other hand, guarantees a good user experience, ensuring user comfort and good scalability. Dubbo is very good in both aspects, and is widely used in the industry because of its good expansion. The popularity and popularity of Dubbo is evident through the 2w+ github warehouse star attention."),(0,n.kt)("h3",{id:"nacos-and-dubbo-are-the-same-genes"},"Nacos and Dubbo are the same genes"),(0,n.kt)("p",null,"But there is such an efficient rpc service framework under Alibaba's technology system, but what is supporting Alibaba's huge service cluster? It is well known that Alibaba Group has a terrible cluster size. Every year, Alibaba Group's Tmall Double 11 Global Shopping Carnival will have a rid of the chin trading scale. In 2018, the Double 11 will carry 213.5 billion in sales. But as a technician, the biggest concern is the peak. If careful practitioners should see an indicator, in 2018 Tmall carried a peak of transaction creation of 491,000 pens per second. For example, Beijing Bird's Nest Stadium has a maximum carrying capacity of 91,000 people, and 49.1w transactions per second, which means that the full audience of the five Bird's Nest stadiums pushes the shopping cart and simultaneously clears the settlement of Tmall Taobao in one second. Taiwan, this pressure can be imagined. But behind the hosting of such a large-scale service cluster, and Alibaba Dubbo's internal use framework HSF, corresponding to ConfigServer, and this is one of Nacos' predecessors. The 0.6 version released by Nacos is the perfect integration with Dubbo. It also announces that Alibaba's experience in large-scale clusters will be shared with Nacos, Dubbo, Sentinel and other contributions to the open source community."),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/png/11189/1544696219150-b786e8fe-af7d-4e29-9c32-03b051c6db3d.png",alt:"image.png | left | 747x413"})),(0,n.kt)("h3",{id:"dubbo-fusion-nacos"},"Dubbo Fusion Nacos"),(0,n.kt)("p",null,"Nacos is an important registry infrastructure in the Dubbo ecosystem, with ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/dubbo/dubbo-registry-nacos"},"dubbo-registry-nacos")," being the bridge for Dubbo's Fusion Nacos registry, based on Dubbo Powerful ",(0,n.kt)("a",{parentName:"p",href:"http://dubbo.apache.org/en-us/docs/dev/impls/registry.html"},"Registry SPI")," and Nacos Naming services provide real-time service registration and discovery. Currently ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/dubbo/dubbo-registry-nacos"},"dubbo-registry-nacos")," is in the preview stage, the latest release is ",(0,n.kt)("inlineCode",{parentName:"p"},"0.0.2"),", the latest Dubbo and Dubbo OPS have been tested, recommended Developers use the latest Dubbo ",(0,n.kt)("inlineCode",{parentName:"p"},"2.6.5")," and Nacos ",(0,n.kt)("inlineCode",{parentName:"p"},"0.6.1")," to ensure the best experience. If you are currently using ZooKeeper or Redis as your registry, the migration to Nacos is also very simple, with Zookeeper as an example:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Scene 1: Externalization configuration")),(0,n.kt)("p",null,"Pre-adjustment configuration:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-properties"},"## Zookeeper registry address\nDubbo.registry.address = zookeeper://127.0.0.1:2181\n")),(0,n.kt)("p",null,"Adjusted configuration:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-properties"},"## Nacos registry address\nDubbo.registry.address = nacos://127.0.0.1:8848\n")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Scenario 2: XML configuration driver")),(0,n.kt)("p",null,"Pre-adjustment configuration:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-xml"},'\x3c!-- Use Zookeeper Registration Center --\x3e\n<dubbo:registry address="zookeeper://127.0.0.1:2181" />\n')),(0,n.kt)("p",null,"Adjusted configuration:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-xml"},'\x3c!-- Use Nacos Registration Center --\x3e\n<dubbo:registry address="nacos://127.0.0.1:8848" />\n')),(0,n.kt)("p",null,"Once the adjustment is complete, make sure the Nacos Server is up and restart your Dubbo app, then you will see the registration information in the Nacos console Service List:"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://cdn.nlark.com/lark/0/2018/png/11189/1544694815618-d316c463-701a-4095-a7d4-30bb0ec941b6.png"},"image-20181213174408269-4694248.png | left | 747x132")),(0,n.kt)("p",null,"If you are interested in integrating Dubbo and Nacos, you may wish to visit the project homepage for more details at:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Dubbo Nacos Registry: ",(0,n.kt)("a",{parentName:"li",href:"https://github.com/dubbo/dubbo-registry-nacos"},"https://github.com/dubbo/dubbo-registry-nacos")),(0,n.kt)("li",{parentName:"ul"},"Apache Dubbo: ",(0,n.kt)("a",{parentName:"li",href:"https://github.com/apache/incubator-dubbo"},"https://github.com/apache/incubator-dubbo"))),(0,n.kt)("p",null,"If you encounter any problems and have any suggestions during the process, please visit ","[https://github.com/dubbo/dubbo-registry-nacos/issues]","(",(0,n.kt)("a",{parentName:"p",href:"https://github.com/dubbo/dubbo"},"https://github.com/dubbo/dubbo")," -registry-nacos/issues) for discussion."),(0,n.kt)("h2",{id:"containers-are-popular-nacos-supports-docker-containerization"},"Containers are popular, Nacos supports Docker containerization"),(0,n.kt)("p",null,"Today, when containers are popular, support for containerization has become a necessity, and Docker has chosen as the container for most people. Nacos announced in v0.6.\nSupport for Docker deployments, and provide an official image, and will support k8s deployment in the next few releases."),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/png/11189/1544696801216-88a41d17-d101-4546-acfd-0aba38c6fa81.png",alt:"image.png | left | 747x285"})),(0,n.kt)("h3",{id:"how-to-deploy-via-docker"},"How to deploy via Docker"),(0,n.kt)("p",null,"Local needs to make sure that Docker has been followed. If it is not installed, please refer to ",(0,n.kt)("a",{parentName:"p",href:"https://docs.docker.com/install/"},"https://docs.docker.com/install/"),". After installation, you can quickly pull the image from the remote and pick up a stand-alone version of Nacos to experience it.\nSimple and rude, run the following command:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-plain"},"Docker run --name nacos-standalone -e MODE=standalone -p 8848:8848 nacos/nacos-server:latest\n")),(0,n.kt)("p",null,"The operation test is as follows:"),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/gif/11189/1544701054438-de9785c4-b9ab-46dc-a162-d22e1419a172.gif",alt:"Peek 2018-12-13 11-43.gif | left | 747x407"})),(0,n.kt)("p",null,"Another application, ",(0,n.kt)("a",{parentName:"p",href:"https://docs.docker.com/compose/"},"docker-compose")," orchestration, you can refer to the following command:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"git clone the project and go to the project root directory")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-powershell"},"Git clone https://github.com/nacos-group/nacos-docker.git\nCd nacos-docker\n")),(0,n.kt)("ol",{start:2},(0,n.kt)("li",{parentName:"ol"},"Start")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Stand-alone start")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-powershell"},"Docker-compose -f example/standalone.yaml up\n")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Cluster boot")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-powershell"},"Docker-compose -f example/cluster-hostname.yaml up\n")),(0,n.kt)("p",null,"At this point your Nacos is up and you can experience the Nacos feature by visiting ",(0,n.kt)("a",{parentName:"p",href:"http://localhost:8848/nacos/index.html"},"http://localhost:8848/nacos/index.html"),"."),(0,n.kt)("h4",{id:"configuration-management-function-experience"},"Configuration Management Function Experience"),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/gif/11189/1544496461571-69f38431-6452-4ddd-8211-c2da28f2ebcf.gif",alt:"Peek 2018-12-11 10-11.gif | left | 747x351"})),(0,n.kt)("h4",{id:"service-discovery-feature-experience"},"Service Discovery Feature Experience"),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/gif/11189/1544521437636-674de542-1873-426b-a2dd-da8265bc267f.gif",alt:"Peek 2018-12-11 11-11.gif | left | 747x351"})),(0,n.kt)("h2",{id:"the-booming-nacos-community"},"The booming Nacos community"),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"DISS is cheap, show me your hand\nMore important than the spit is to take the handle and participate in the community to develop Nacos")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Follow the user as a user and join the Nacos community")),(0,n.kt)("p",null,'The Nacos community is booming. As of the date of publication, Nacos has five WeChat groups in just a few months, four of which are full, one QQ group, one nail group, and nearly 3,000 people who care about Nacos. In the Nacos group, we will learn from the "Tao (base) friends", exchange experiences, recruit friends, grab red envelopes... and enjoy it.'),(0,n.kt)("p",null,"To join the Nacos WeChat community, you can use the WeChat QR code of ",(0,n.kt)("strong",{parentName:"p"},"\u201c\u8d85\u54e5\u201d")," below to let ",(0,n.kt)("strong",{parentName:"p"},"\u201c\u8d85\u54e5\u201d")," help you pull in \u201cNacos Community WeChat Exchange Group\u201d"),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://cdn.yuque.com/lark/0/2018/png/15914/1530077965587-8f4e3100-bdd4-469a-9ea0-7af7061bc9ef.png",alt:"Screen Shot 2018-06-27 at 13.39.09.png | left"})),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Join the Nacos community as a code contributor")),(0,n.kt)("p",null,"From the development of Nacos users to contributors, and the Nacos development team is indeed growing, from the beginning of only four code contributions to the current 24, with ",(0,n.kt)("strong",{parentName:"p"},"Alibaba")," other team members such as ",(0,n.kt)("strong",{parentName:"p"},"@\u5c0f\u9a6c\u54e5"),", ",(0,n.kt)("strong",{parentName:"p"},"\u864e\u7259\u76f4\u64ad__"),"@\u5f20\u6ce2__ ",(0,n.kt)("strong",{parentName:"p"},"@\u5468\u5065")," Team et al, ","[nacos-docker-k8s]","(",(0,n.kt)("a",{parentName:"p",href:"https://github.com/nacos-group"},"https://github.com/nacos-group")," /nacos-docker) Contributors ",(0,n.kt)("strong",{parentName:"p"},"@\u5f20\u9f99"),", the main contributors to the front end are hungry ",(0,n.kt)("strong",{parentName:"p"},"@\u738b\u5f66\u6c11"),", the founder of Spring Cloud Chinese community ",(0,n.kt)("strong",{parentName:"p"},"@\u8bb8\u8fdb")," etc. The power of the Nacos community will grow stronger in the future."),(0,n.kt)("p",null,"The community is also planning to add a team introduction page to Nacos's official website ",(0,n.kt)("a",{parentName:"p",href:"http://nacos.io"},"nacos.io")," at the right time, and everyone will be officially announced. Welcome everyone to join the Nacos community and contribute to the community. . In the words of Apache, ",(0,n.kt)("strong",{parentName:"p"},'"Community is higher than the code"!')),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/png/15914/1542704700864-a9d54856-9bf6-4176-b449-c13fa02c5800.png",alt:"\u5c4f\u5e55\u5feb\u7167 2018-11-20 17.04.45.png | left"})),(0,n.kt)("h2",{id:"newcomer-moments---what-is-nacos"},'Newcomer Moments - "What is Nacos?"'),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"I don't know what Nacos is? It doesn't matter, star on the github and say hello to the program brothers!!")),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://github.com/alibaba/nacos"},"Nacos")," is Alibaba's new open source project in July. Nacos's main vision is to provide easy-to-use ",(0,n.kt)("inlineCode",{parentName:"p"},"Dynamic Service Discovery"),", ",(0,n.kt)("inlineCode",{parentName:"p"},"Service Configuration Management"),', The infrastructure of "Service Sharing and Management" helps users better build, deliver and manage their own microservices platforms in the cloud\'s native era.'),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/png/15914/1532436633419-08a42307-7fb7-4d51-9062-fecc3868613b.png",alt:"Screen Shot 2018-07-24 at 19.27.28.png | left"})),(0,n.kt)("p",null,"Github project address is ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/alibaba/nacos"},"here")),(0,n.kt)("h2",{id:"more-open-source-project-information-related-to-nacos"},"More open source project information related to Nacos"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/alibaba/nacos"},"Nacos")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/dubbo/dubbo-registry-nacos"},"Dubbo Registry Nacos")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nacos-group/nacos-coredns-plugin"},"Nacos DNS-F")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nacos-group/nacos-docker"},"Nacos Docker")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nacos-group/nacos-spring-project"},"Nacos Spring Project")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nacos-group/nacos-spring-boot-project"},"Nacos Spring Boot")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/spring-cloud-incubator/spring-cloud-alibaba"},"Spring Cloud Alibaba")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"http://dubbo.io"},"Dubbo")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/alibaba/Sentinel"},"Sentinel")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://projects.spring.io/spring-cloud/"},"Spring Cloud")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/Nepxion/Discovery"},"Nepxion Discovery")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/SpringCloud/spring-cloud-gateway-nacos"},"Spring Cloud Gateway Nacos"))))}m.isMDXComponent=!0}}]);