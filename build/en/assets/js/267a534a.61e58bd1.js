"use strict";(self.webpackChunkNacos=self.webpackChunkNacos||[]).push([[6253],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>N});var n=a(67294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},c=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},k=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=p(a),k=r,N=u["".concat(s,".").concat(k)]||u[k]||m[k]||l;return a?n.createElement(N,o(o({ref:t},c),{},{components:a})):n.createElement(N,o({ref:t},c))}));function N(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=k;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[u]="string"==typeof e?e:r,o[1]=i;for(var p=2;p<l;p++)o[p]=a[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}k.displayName="MDXCreateElement"},86885:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>m,frontMatter:()=>l,metadata:()=>i,toc:()=>p});var n=a(87462),r=(a(67294),a(3905));const l={},o="Nacos Roadmap\uff1aNacos GA\u540e\u4f1a\u6709\u54ea\u4e9b\u5927\u52a8\u4f5c\uff1f",i={permalink:"/en/blog/nacos-roadmap",source:"@site/i18n/en/docusaurus-plugin-content-blog/nacos-roadmap.md",title:"Nacos Roadmap\uff1aNacos GA\u540e\u4f1a\u6709\u54ea\u4e9b\u5927\u52a8\u4f5c\uff1f",description:"Nacos\u662f\u963f\u91cc\u5df4\u5df42018\u5e74\u5f00\u6e90\u7684\u670d\u52a1\u53d1\u73b0\u548c\u914d\u7f6e\u7ba1\u7406\u9879\u76ee\uff0c\u5e76\u4e8e\u4eca\u5e74\u76844\u670810\u53f7GA\uff0c\u8ddd\u4eca\u5df2\u7ecf\u8fc7\u53bb\u4e86\u5feb\u4e24\u4e2a\u6708\u65f6\u95f4\u4e86\u3002Nacos GA\u4ee3\u8868\u7740\u7528\u6237\u53ef\u4ee5\u5728\u751f\u4ea7\u73af\u5883\u4e0a\u5927\u89c4\u6a21\u4f7f\u7528\uff0c\u76ee\u524d\u4e5f\u5df2\u7ecf\u6709\u4f17\u591a\u7528\u6237\u767b\u8bb0\u4f7f\u7528\u3002\u5728GA\u4e4b\u540e\uff0cNacos\u5e76\u672a\u505c\u4e0b\u524d\u8fdb\u7684\u811a\u6b65\uff0c\u4e0d\u65ad\u7684\u5f00\u53d1\u65b0\u7684\u529f\u80fd\u548c\u4f18\u5316\u7528\u6237\u4f53\u9a8c\u3002\u4e0e\u6b64\u540c\u65f6\uff0cNacos\u503e\u542c\u793e\u533a\u7684\u58f0\u97f3\uff0c\u6bcf\u4e00\u6b21\u8fed\u4ee3\u548c\u53d1\u5e03\u90fd\u4f1a\u5305\u542b\u7528\u6237\u5173\u5fc3\u7684\u529f\u80fd\u70b9\u3002\u6839\u636eNacos\u65e2\u5b9a\u7684\u6f14\u8fdb\u65b9\u5411\uff0c\u4ee5\u53ca\u5728\u4e0e\u793e\u533a\u8fdb\u884c\u5145\u5206\u7684\u8ba8\u8bba\u540e\uff0cNacos\u63a5\u4e0b\u6765\u7684\u7248\u672c\u8ba1\u5212\u4e5f\u6d6e\u51fa\u6c34\u9762\u3002Nacos\u5728\u4eca\u5e74\u8fd8\u5c06\u53d1\u5e036\u52307\u4e2a\u5927\u7248\u672c\uff0c\u6bcf\u4e2a\u7248\u672c\u5305\u542b\u7684\u91cd\u8981\u7279\u6027\u5982\u4e0b\uff1a",date:"2023-10-10T11:47:41.000Z",formattedDate:"October 10, 2023",tags:[],readingTime:6.885,hasTruncateMarker:!1,authors:[],frontMatter:{},prevItem:{title:"nacos-reigster-mechanism",permalink:"/en/blog/nacos-reigster-mechanism"},nextItem:{title:"Nacos 0.1.0 \u7248\u672cReview \u6d3b\u52a8\u8bbe\u8ba1",permalink:"/en/blog/nacos"}},s={authorsImageUrls:[]},p=[{value:"1.2.0",id:"120",level:4},{value:"1.3.0",id:"130",level:4},{value:"1.4.0",id:"140",level:4},{value:"1.5.0",id:"150",level:4},{value:"1.6.0",id:"160",level:4},{value:"1.7.0",id:"170",level:4}],c={toc:p},u="wrapper";function m(e){let{components:t,...a}=e;return(0,r.kt)(u,(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Nacos\u662f\u963f\u91cc\u5df4\u5df42018\u5e74\u5f00\u6e90\u7684\u670d\u52a1\u53d1\u73b0\u548c\u914d\u7f6e\u7ba1\u7406\u9879\u76ee\uff0c\u5e76\u4e8e\u4eca\u5e74\u76844\u670810\u53f7GA\uff0c\u8ddd\u4eca\u5df2\u7ecf\u8fc7\u53bb\u4e86\u5feb\u4e24\u4e2a\u6708\u65f6\u95f4\u4e86\u3002Nacos GA\u4ee3\u8868\u7740\u7528\u6237\u53ef\u4ee5\u5728\u751f\u4ea7\u73af\u5883\u4e0a\u5927\u89c4\u6a21\u4f7f\u7528\uff0c\u76ee\u524d\u4e5f\u5df2\u7ecf\u6709\u4f17\u591a\u7528\u6237",(0,r.kt)("a",{parentName:"p",href:"https://github.com/alibaba/nacos/issues/273"},"\u767b\u8bb0"),"\u4f7f\u7528\u3002\u5728GA\u4e4b\u540e\uff0cNacos\u5e76\u672a\u505c\u4e0b\u524d\u8fdb\u7684\u811a\u6b65\uff0c\u4e0d\u65ad\u7684\u5f00\u53d1\u65b0\u7684\u529f\u80fd\u548c\u4f18\u5316\u7528\u6237\u4f53\u9a8c\u3002\u4e0e\u6b64\u540c\u65f6\uff0cNacos\u503e\u542c\u793e\u533a\u7684\u58f0\u97f3\uff0c\u6bcf\u4e00\u6b21\u8fed\u4ee3\u548c\u53d1\u5e03\u90fd\u4f1a\u5305\u542b\u7528\u6237\u5173\u5fc3\u7684\u529f\u80fd\u70b9\u3002\u6839\u636eNacos\u65e2\u5b9a\u7684\u6f14\u8fdb\u65b9\u5411\uff0c\u4ee5\u53ca\u5728\u4e0e\u793e\u533a\u8fdb\u884c\u5145\u5206\u7684",(0,r.kt)("a",{parentName:"p",href:"https://github.com/alibaba/nacos/issues/1433"},"\u8ba8\u8bba"),"\u540e\uff0cNacos\u63a5\u4e0b\u6765\u7684\u7248\u672c\u8ba1\u5212\u4e5f\u6d6e\u51fa\u6c34\u9762\u3002Nacos\u5728\u4eca\u5e74\u8fd8\u5c06\u53d1\u5e036\u52307\u4e2a\u5927\u7248\u672c\uff0c\u6bcf\u4e2a\u7248\u672c\u5305\u542b\u7684\u91cd\u8981\u7279\u6027\u5982\u4e0b\uff1a"),(0,r.kt)("a",{name:"aq5sL"}),"#### 1.1.0",(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Go SDK\u53d1\u5e03\uff1a")," Go\u8bed\u8a00SDK"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u5730\u5740\u670d\u52a1\u5668\uff1a")," \u4f7f\u7528\u5730\u5740\u670d\u52a1\u5668\u6a21\u5f0f\u8fdb\u884cNacos\u670d\u52a1\u7aef\u96c6\u7fa4\u5bfb\u5740"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u7070\u5ea6\u914d\u7f6e\uff1a")," \u8bbe\u7f6e\u7070\u5ea6\u7684\u673a\u5668IP\u6765\u8fdb\u884c\u914d\u7f6e\u7684\u7070\u5ea6\u53d1\u5e03",(0,r.kt)("a",{name:"MxxeU"}))),(0,r.kt)("h4",{id:"120"},"1.2.0"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u914d\u7f6e\u6743\u9650\u63a7\u5236\uff1a")," \u5bf9\u914d\u7f6e\u7684\u8bfb\u5199\u8fdb\u884c\u6743\u9650\u7684\u63a7\u5236\uff0c\u652f\u6301\u5bf9\u63a5\u4e09\u65b9\u6743\u9650\u7cfb\u7edf"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"DNS\u534f\u8bae\uff0c\u652f\u6301K8S\u670d\u52a1\u57df\u540d\u89e3\u6790\uff1a")," \u901a\u8fc7\u652f\u6301DNS\u534f\u8bae\u8bbf\u95ee\uff0c\u65e0\u4fb5\u5165\u7684\u89e3\u51b3\u670d\u52a1\u53d1\u73b0\u95ee\u9898\uff0c\u5e76\u652f\u6301K8S\u57df\u540d\u89e3\u6790"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Service Mesh\u6253\u901a\uff1a")," \u5bf9\u63a5\u5f00\u6e90\u6d41\u884c\u7684Service Mesh\u7ec4\u4ef6\uff0c\u652f\u6301\u4f5c\u4e3a\u670d\u52a1\u53d1\u73b0\u540e\u7aef\u548c\u914d\u7f6e\u7ba1\u7406\u540e\u7aef",(0,r.kt)("a",{name:"eqoii"}))),(0,r.kt)("h4",{id:"130"},"1.3.0"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u670d\u52a1\u6743\u9650\u63a7\u5236\uff1a")," \u5bf9\u670d\u52a1\u7684\u6ce8\u518c\u6ce8\u9500\u53ca\u67e5\u8be2\u8fdb\u884c\u6743\u9650\u7684\u63a7\u5236\uff0c\u652f\u6301\u5bf9\u63a5\u4e09\u65b9\u6743\u9650\u7cfb\u7edf"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Mysql\u4f9d\u8d56\u53ef\u66ff\u6362\u4e3a\u5176\u4ed6\u5b58\u50a8\uff1a")," \u652f\u6301\u5c06MySQL\u4f9d\u8d56\u66ff\u6362\u4e3aOracle\u7b49\u5e38\u89c1\u6570\u636e\u5e93\u7cfb\u7edf\u4f9d\u8d56"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"gRPC\u670d\u52a1\u53d1\u73b0\u652f\u6301\uff1a")," \u901a\u8fc7Go SDK\u548cJava SDK\u652f\u6301gRPC\u548cgRPC-java\u7684\u670d\u52a1\u6ce8\u518c\u4e0e\u53d1\u73b0",(0,r.kt)("a",{name:"Czkv8"}))),(0,r.kt)("h4",{id:"140"},"1.4.0"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u914d\u7f6e\u52a0\u5bc6\uff1a")," \u654f\u611f\u914d\u7f6e\u52a0\u5bc6\u5b58\u50a8\u548c\u4f20\u8f93\uff0c\u4fdd\u8bc1\u6570\u636e\u5b89\u5168"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"confd\u6a21\u5f0f\u6a21\u677f\u6e32\u67d3\uff1a")," \u652f\u6301\u5c06\u914d\u7f6e\u6216\u8005\u670d\u52a1\u6570\u636e\u6e32\u67d3\u5230\u6587\u4ef6\u6a21\u677f\uff0c\u9002\u914d\u5f02\u6784\u7cfb\u7edf"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u5065\u5eb7\u68c0\u67e5SPI\u5316\uff0c\u53ef\u4ee5\u4f7f\u7528K8S\u5065\u5eb7\u68c0\u67e5\uff1a")," \u652f\u6301\u4f7f\u7528Kubernetes\u81ea\u5e26\u7684\u5065\u5eb7\u68c0\u67e5\u65b9\u5f0f\u6765\u68c0\u67e5\u670d\u52a1\u5b9e\u4f8b\u7684\u5065\u5eb7\u72b6\u6001",(0,r.kt)("a",{name:"RFUj5"}))),(0,r.kt)("h4",{id:"150"},"1.5.0"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u914d\u7f6e\u53d1\u5e03\u5ba1\u6279\uff1a")," \u914d\u7f6e\u53d1\u5e03\u7ba1\u63a7\u4f53\u7cfb\uff0c\u51cf\u5c11\u4eba\u4e3a\u5931\u8bef\u5f15\u8d77\u7684\u6545\u969c"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"IPv6\u652f\u6301\uff1a")," \u652f\u6301\u5728IPv6\u7f51\u7edc\u73af\u5883\u4e0b\u8fdb\u884c\u670d\u52a1\u7684\u6ce8\u518c\u4e0e\u53d1\u73b0\u548c\u914d\u7f6e\u7684\u7ba1\u7406"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u957f\u8fde\u63a5\u63a8\u9001\u901a\u9053\u91cd\u6784\uff1a")," \u91cd\u6784\u63a8\u9001\u901a\u9053\uff0c\u63d0\u5347SLA"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"configMap\u5bf9\u63a5\uff1a")," \u548cKubernetes\u7684\u914d\u7f6e\u8fdb\u884c\u6253\u901a",(0,r.kt)("a",{name:"lykZW"}))),(0,r.kt)("h4",{id:"160"},"1.6.0"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Thrift\u670d\u52a1\u53d1\u73b0\uff1a")," \u652fThrift\u670d\u52a1\u6846\u67b6\u670d\u52a1\u6ce8\u518c\u4e8e\u53d1\u73b0"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u652f\u6301Region\u3001AZ\u7b49\u7c7b\u4f3c\u4fe1\u606f\u5b58\u50a8\uff1a")," \u652f\u6301\u8fdb\u884c\u73af\u5883\u4fe1\u606f\u7684\u6ce8\u518c\uff0c\u6839\u636e\u73af\u5883\u8fdb\u884c\u81ea\u5b9a\u4e49\u8bbf\u95ee\u7b56\u7565"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u8fd0\u7ef4\u547d\u4ee4\u884c\uff1a")," \u4f7f\u7528\u66f4\u7b80\u6d01\u7684\u65b9\u5f0f\uff0c\u8fdb\u884c\u96c6\u7fa4\u7684\u8fd0\u7ef4"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u6253\u6807\u652f\u6301\uff0c\u5bf9\u63a5K8S label\uff1a")," \u80fd\u591f\u6253\u81ea\u5b9a\u4e49\u6807\u7b7e\uff0c\u80fd\u591f\u7406\u7531Kubernetes\u7684label\u8fdb\u884c\u8d1f\u8f7d\u5747\u8861\u53ca\u7070\u5ea6\u914d\u7f6e\u7b49",(0,r.kt)("a",{name:"qK0hH"}))),(0,r.kt)("h4",{id:"170"},"1.7.0"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u65e0\u72b6\u6001\u5316\uff1a")," \u5b58\u50a8\u548c\u8ba1\u7b97\u5206\u79bb\uff0c\u8ba9\u7cfb\u7edf\u672c\u8eab\u65e0\u72b6\u6001"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"\u4e00\u81f4\u6027\u534f\u8bae\u62bd\u8c61\u53caRaft\u534f\u8bae\u66ff\u6362\uff1a")," \u5168\u65b0\u7684Raft\u534f\u8bae\uff0c\u652f\u6301\u66ff\u6362")),(0,r.kt)("a",{name:"dbaJf"}),"### \u589e\u5f3a\u73b0\u6709\u529f\u80fd\uff0c\u63d0\u4f9b\u66f4\u591a\u751f\u4ea7\u73af\u5883\u9700\u6c42\u7279\u6027 \u76ee\u524d\u7528\u6237\u96c6\u4e2d\u53cd\u9988\u7684\u9700\u6c42\u6709\u7070\u5ea6\u914d\u7f6e\u3001\u6743\u9650\u63a7\u5236\u3001\u53d1\u5e03\u5ba1\u6279\u7b49\u529f\u80fd\uff0c\u8fd9\u4e9b\u7279\u6027\u6211\u4eec\u90fd\u4f1a\u5728\u63a5\u4e0b\u6765\u7684\u7248\u672c\u4ee5\u6700\u9ad8\u4f18\u5148\u7ea7\u5b9e\u73b0\u3002\u8fd9\u4e9b\u7279\u6027\u57fa\u672c\u4e0a\u7528\u6237\u5728\u4ee5\u5f80\u7684\u751f\u4ea7\u7ecf\u9a8c\u4e2d\u90fd\u6709\u6240\u63a5\u89e6\uff0c\u8fd9\u91cc\u4e0d\u518d\u505a\u8be6\u7ec6\u7684\u4ecb\u7ecd\u3002",(0,r.kt)("p",null,"\u540c\u65f6\uff0c\u4e3a\u4e86\u6700\u5927\u5316\u964d\u4f4e\u7528\u6237\u7684\u90e8\u7f72\u8fd0\u7ef4\u6210\u672c\uff0c\u6211\u4eec\u4f1a\u5148\u652f\u6301\u591a\u79cd\u6570\u636e\u5e93\u7684\u4f9d\u8d56\uff0c\u5305\u62ecOracle\u7b49\u6570\u636e\u5e93\uff0c\u8fd9\u6837\u53ef\u4ee5\u8ba9\u7528\u6237\u4e0d\u9700\u8981\u4e3a\u4e86\u4f7f\u7528Nacos\u518d\u5355\u72ec\u642d\u5efa\u4e00\u5957MySQL\u96c6\u7fa4\u3002\u540e\u9762\u6211\u4eec\u4f1a\u66f4\u8fdb\u4e00\u6b65\uff0c\u5c06\u5916\u90e8\u6570\u636e\u5e93\u4f9d\u8d56\u5f7b\u5e95\u53bb\u9664\uff0c\u652f\u6301Nacos\u5b8c\u5168\u4f7f\u7528\u672c\u5730\u5b58\u50a8\u3002\u5305\u62ec\u65e0\u72b6\u6001\u5316\uff0c\u4e5f\u4f1a\u5728\u672a\u6765\u7684\u7248\u672c\u652f\u6301\uff0c\u4e89\u53d6\u8ba9\u7528\u6237\u4ee5\u6700\u4f4e\u6210\u672c\u7684\u65b9\u5f0f\u8fd0\u884cNacos\u3002"),(0,r.kt)("a",{name:"DHiVd"}),"### \u4e0e\u66f4\u591a\u751f\u6001\u8fdb\u884c\u5bf9\u63a5\uff0c\u5f62\u6210\u8054\u52a8\u4f18\u52bf\uff0c\u63d0\u5347\u7528\u6237\u6548\u7387 \u4e00\u4e2a\u4ea7\u54c1\u7684\u6210\u529f\uff0c\u5f80\u5f80\u662f\u56e0\u4e3a\u4e00\u4e2a\u751f\u6001\u7684\u6210\u529f\u3002Nacos\u76ee\u524d\u67b6\u6784\u7684\u4f18\u52bf\u4e4b\u4e00\uff0c\u5c31\u662f\u53ef\u4ee5\u6bd4\u8f83\u5e73\u6ed1\u7684\u652f\u6301\u591a\u4e2a\u751f\u6001\u3002\u76ee\u524d\u5df2\u7ecf\u652f\u6301\u7684\u6709Dubbo\u751f\u6001\u3001Spring Cloud\u751f\u6001\uff0c\u800c\u6b63\u5728\u6253\u901a\u7684\u6709gRPC\u548cKubernetes\uff0c\u672a\u6765\u8fd8\u8ba1\u5212\u652f\u6301Thrift\u7b49\u670d\u52a1\u6846\u67b6\u3002\u6211\u4eec\u7684\u76ee\u6807\u662f\u7528\u6237\u65e0\u8bba\u5728\u54ea\u79cd\u751f\u6001\u4e0b\uff0c\u90fd\u4e0d\u9700\u8981\u4e3a\u6ce8\u518c\u4e2d\u5fc3\u6216\u8005\u914d\u7f6e\u4e2d\u5fc3\u7684\u9009\u578b\u70e6\u607c\u3002",(0,r.kt)("a",{name:"KyZiP"}),"### \u4e91\u539f\u751f\u9886\u57df\u5e03\u5c40\u548c\u7ec4\u4ef6\u6253\u901a \u4e91\u539f\u751f\u662f\u5f53\u524d\u975e\u5e38\u706b\u70ed\u7684\u4e00\u4e2a\u6982\u5ff5\u3002\u5728CNCF\u3001Pivotal\u7b49\u673a\u6784\u76f8\u7ee7\u5b9a\u4e49\u548c\u5927\u529b\u63a8\u52a8\u4e91\u539f\u751f\u7684\u80cc\u666f\u4e0b\uff0c\u7528\u6237\u5bf9\u6574\u4e2a\u8f6f\u4ef6\u7684\u751f\u547d\u5468\u671f\u7ba1\u7406\u90fd\u6709\u4e86\u5168\u65b0\u7684\u8ba4\u77e5\u3002\u4e91\u539f\u751f\u662f\u4e00\u4e2a\u6781\u5177\u6f5c\u529b\u7684\u7406\u5ff5\uff0cNacos\u4e5f\u4f1a\u5728\u63a5\u4e0b\u6765\u7684\u6f14\u8fdb\u4e2d\u5bf9\u4e91\u539f\u751f\u505a\u91cd\u70b9\u652f\u6301\u3002",(0,r.kt)("a",{name:"fPVms"}),"### \u5185\u6838\u5347\u7ea7\uff0c\u63d0\u5347\u6027\u80fd\u548c\u7a33\u5b9a\u6027 Nacos\u76ee\u524d\u7684\u5185\u6838\uff0c\u5305\u62ec\u81ea\u5efaRaft\u3001MySQL\u4f9d\u8d56\uff0c\u957f\u8f6e\u8be2\u53caUDP\u63a8\u9001\u7b49\uff0c\u90fd\u4f1a\u5728\u63a5\u4e0b\u6765\u8fdb\u884c\u91cd\u65b0\u8bbe\u8ba1\uff0c\u76ee\u6807\u662f\u4f18\u5316\u5230\u6700\u5408\u7406\u7684\u67b6\u6784\uff0c\u63d0\u5347\u6574\u4f53\u7684\u6027\u80fd\u548c\u7a33\u5b9a\u6027\u3002")}m.isMDXComponent=!0}}]);