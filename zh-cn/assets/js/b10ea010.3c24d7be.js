"use strict";(self.webpackChunkNacos=self.webpackChunkNacos||[]).push([[2001],{3905:(e,t,a)=>{a.d(t,{Zo:()=>i,kt:()=>m});var r=a(67294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=r.createContext({}),p=function(e){var t=r.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},i=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u="mdxType",k={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,i=c(e,["components","mdxType","originalType","parentName"]),u=p(a),h=n,m=u["".concat(l,".").concat(h)]||u[h]||k[h]||o;return a?r.createElement(m,s(s({ref:t},i),{},{components:a})):r.createElement(m,s({ref:t},i))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,s=new Array(o);s[0]=h;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c[u]="string"==typeof e?e:n,s[1]=c;for(var p=2;p<o;p++)s[p]=a[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,a)}h.displayName="MDXCreateElement"},15143:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>k,frontMatter:()=>o,metadata:()=>c,toc:()=>p});var r=a(87462),n=(a(67294),a(3905));const o={title:"Nacos-sdk-csharp 0.5.0\u6b63\u5f0f\u53d1\u5e03\uff0c\u529f\u80fd\u4e0eJava\u7248\u672c\u5bf9\u9f50\uff01",keywords:["csharp","sdk"],description:"Nacos-sdk-csharp 0.5.0\u6b63\u5f0f\u53d1\u5e03\uff0c\u529f\u80fd\u4e0eJava\u7248\u672c\u5bf9\u9f50\uff01"},s="nacos-sdk-csharp 0.5.0\u7248\u672c\u5df2\u7ecf\u53d1\u5e03\u4e86\uff01",c={permalink:"/zh-cn/blog/csharp-0.5.0",source:"@site/i18n/zh-cn/docusaurus-plugin-content-blog/csharp-0.5.0.md",title:"Nacos-sdk-csharp 0.5.0\u6b63\u5f0f\u53d1\u5e03\uff0c\u529f\u80fd\u4e0eJava\u7248\u672c\u5bf9\u9f50\uff01",description:"Nacos-sdk-csharp 0.5.0\u6b63\u5f0f\u53d1\u5e03\uff0c\u529f\u80fd\u4e0eJava\u7248\u672c\u5bf9\u9f50\uff01",date:"2023-10-10T11:47:41.000Z",formattedDate:"2023\u5e7410\u670810\u65e5",tags:[],readingTime:2.835,hasTruncateMarker:!1,authors:[],frontMatter:{title:"Nacos-sdk-csharp 0.5.0\u6b63\u5f0f\u53d1\u5e03\uff0c\u529f\u80fd\u4e0eJava\u7248\u672c\u5bf9\u9f50\uff01",keywords:["csharp","sdk"],description:"Nacos-sdk-csharp 0.5.0\u6b63\u5f0f\u53d1\u5e03\uff0c\u529f\u80fd\u4e0eJava\u7248\u672c\u5bf9\u9f50\uff01"},prevItem:{title:"Consul\u4e0ekubernetes\u6574\u5408\u516c\u544a[\u7ffb\u8bd1]",permalink:"/zh-cn/blog/consul-k8s"},nextItem:{title:"Nacos\u670d\u52a1\u53d1\u73b0\u63a7\u5236\u53f0\u9884\u89c8",permalink:"/zh-cn/blog/discovery-console"}},l={authorsImageUrls:[]},p=[{value:"nacos-sdk-csharp 0.5.0\u7248\u672c\u4e3b\u8981\u66f4\u65b0\u5185\u5bb9",id:"nacos-sdk-csharp-050\u7248\u672c\u4e3b\u8981\u66f4\u65b0\u5185\u5bb9",level:2},{value:"\u8fd1\u671f\u9884\u544a",id:"\u8fd1\u671f\u9884\u544a",level:2},{value:"\u5982\u4f55\u5171\u5efa",id:"\u5982\u4f55\u5171\u5efa",level:2},{value:"\u65b0\u4eba\u65f6\u523b - &quot;\u4ec0\u4e48\u662fNacos\uff1f&quot;",id:"\u65b0\u4eba\u65f6\u523b---\u4ec0\u4e48\u662fnacos",level:2}],i={toc:p},u="wrapper";function k(e){let{components:t,...a}=e;return(0,n.kt)(u,(0,r.Z)({},i,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"\u6765\u81ea\u793e\u533a\u7684 ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/nacos-group/nacos-sdk-csharp"},"nacos-sdk-csharp")," \uff0c\u5728\u963f\u91cc\u5df4\u5df4\u7f16\u7a0b\u4e4b\u590f\u7684\u63a8\u52a8\u4e0b\uff0c\u53d1\u5e03\u4e86\u65b0\u7248\u672c0.5.0\u3002 \u81f3\u6b64\uff0cnacos-sdk-csharp\u5c06\u4e0enacos\u7684Java-sdk\u62e5\u6709\u76f8\u540c\u7684\u80fd\u529b\u3002"),(0,n.kt)("p",null,"\u611f\u8c22Aman\uff0c\u9ec4\u6587\u6e05\u5728\u6b64\u671f\u95f4\u5bf9nacos\u793e\u533a\u7684\u8d21\u732e\uff01\uff01\uff01"),(0,n.kt)("h2",{id:"nacos-sdk-csharp-050\u7248\u672c\u4e3b\u8981\u66f4\u65b0\u5185\u5bb9"},"nacos-sdk-csharp 0.5.0\u7248\u672c\u4e3b\u8981\u66f4\u65b0\u5185\u5bb9"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"\u4fee\u590d\u5f00\u542f\u8ba4\u8bc1\u65f6\u8bf7\u6c42\u8fd4\u56de403"),(0,n.kt)("li",{parentName:"ol"},"\u914d\u7f6e\u7684failover\u65b9\u5f0f\u4ece\u5185\u5b58\u6539\u6210\u6587\u4ef6"),(0,n.kt)("li",{parentName:"ol"},"\u4fee\u590d\u8bbe\u7f6e\u8d1f\u8f7d\u5747\u8861\u65b9\u5f0f\u540e\u4e0d\u80fd\u6b63\u5e38\u8fd4\u56de\u53ef\u7528\u670d\u52a1\u5730\u5740"),(0,n.kt)("li",{parentName:"ol"},"\u4fee\u590d\u4e0d\u80fd\u5237\u65b0accesstoken"),(0,n.kt)("li",{parentName:"ol"},"\u652f\u6301Yaml\u548cIni\u7684\u914d\u7f6e\u89e3\u6790\u5668"),(0,n.kt)("li",{parentName:"ol"},"\u652f\u6301Naming\u7684\u8ba2\u9605\u548c\u53d6\u6d88\u8ba2\u9605"),(0,n.kt)("li",{parentName:"ol"},"\u652f\u6301PreferredNetworks\uff0c\u53ef\u4ee5\u8ba9\u7528\u6237\u81ea\u5df1\u9009\u62e9\u7f51\u7edc\u9002\u914d\u5668"),(0,n.kt)("li",{parentName:"ol"},"\u4f18\u5316ASP.NET Core\u96c6\u6210\u7684\u5c0f\u7ec6\u8282")),(0,n.kt)("h2",{id:"\u8fd1\u671f\u9884\u544a"},"\u8fd1\u671f\u9884\u544a"),(0,n.kt)("p",null,"Nacos\u793e\u533a\u548c\u963f\u91cc\u5df4\u5df4\u7f16\u7a0b\u4e4b\u590f\u7684\u6210\u679c\u8fdc\u4e0d\u6b62\u6b64\uff0c\u5f88\u5feb\u5c06\u4f1a\u6709cpp\u548cpython\u7684\u65b0\u7248\u672csdk\u53d1\u5e03\u54e6\u3002"),(0,n.kt)("h2",{id:"\u5982\u4f55\u5171\u5efa"},"\u5982\u4f55\u5171\u5efa"),(0,n.kt)("p",null,"\u6211\u4eec\u6b22\u8fce\u4efb\u4f55\u4eba\u79ef\u6781\u53c2\u4e0eNacos\u793e\u533a\u3002\u5982\u679c\u60a8\u5728\u6587\u6863\u4e2d\u53d1\u73b0\u62fc\u5199\u9519\u8bef\uff0c\u5728\u4ee3\u7801\u4e2d\u53d1\u73b0\u9519\u8bef\uff0c\u6216\u60f3\u8981\u65b0\u529f\u80fd\u6216\u60f3\u8981\u63d0\u4f9b\u5efa\u8bae\uff0c\u60a8\u53ef\u4ee5",(0,n.kt)("a",{parentName:"p",href:"https://github.com/alibaba/Nacos/issues/new"},"\u5728GitHub\u4e0a\u521b\u5efa\u4e00\u4e2aissues")," \u3002"),(0,n.kt)("p",null,"\u5982\u679c\u60a8\u60f3\u5f00\u59cb\u7740\u624b\uff0c\u53ef\u4ee5\u9009\u62e9github\u4ed3\u5e93\u4e2d\u6709\u4ee5\u4e0b\u6807\u7b7e\u7684issues\u3002"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/alibaba/nacos/labels/good%20first%20issue"},"good first issue")," \uff1a\u5bf9\u4e8e\u65b0\u624b\u6765\u8bf4\u662f\u975e\u5e38\u597d\u7684\u5165\u95e8issues\u3002"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/alibaba/nacos/labels/contribution%20%E6%AC%A2%E8%BF%8E"},"contribution welcome")," \uff1a\u975e\u5e38\u9700\u8981\u89e3\u51b3\u7684\u95ee\u9898\u548c\u975e\u5e38\u91cd\u8981\u7684\u6a21\u5757\uff0c\u4f46\u76ee\u524d\u7f3a\u5c11\u8d21\u732e\u8005\uff0c\u6b22\u8fce\u8d21\u732e\u8005\u6765\u8d21\u732e\u3002")),(0,n.kt)("p",null,"\u9664\u4e86\u4ee5\u4e0a\u7684\u901a\u7528\u6807\u7b7e\uff0c\u8fd8\u53ef\u4ee5\u5173\u6ce8Nacos\u7684\u591a\u8bed\u8a00\u5171\u5efa\uff0c\u76ee\u524d\u6211\u4eec\u5df2\u7ecf\u652f\u6301\u5404\u7c7b\u4e3b\u6d41\u8bed\u8a00\uff1a"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nacos-group/nacos-sdk-csharp"},"csharp")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nacos-group/nacos-sdk-go"},"go")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nacos-group/nacos-sdk-cpp"},"cpp")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nacos-group/nacos-sdk-python"},"python")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nacos-group/nacos-sdk-nodejs"},"nodejs"))),(0,n.kt)("p",null,"\u6b22\u8fce\u5927\u5bb6\u52a0\u5165Nacos\u793e\u533a\uff0c\u8d21\u732e\u793e\u533a\u3002\u7528Apache\u7684\u8bdd\u8bf4\uff0c",(0,n.kt)("strong",{parentName:"p"},"\u201c\u793e\u533a\u9ad8\u4e8e\u4ee3\u7801\u201d!"),"\u3002"),(0,n.kt)("h2",{id:"\u65b0\u4eba\u65f6\u523b---\u4ec0\u4e48\u662fnacos"},(0,n.kt)("a",{parentName:"h2",href:"https://github.com/alibaba/nacos"}),'\u65b0\u4eba\u65f6\u523b - "\u4ec0\u4e48\u662fNacos\uff1f"'),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"\u8fd8\u4e0d\u77e5\u9053\u4ec0\u4e48\u662fNacos? \u6ca1\u5173\u7cfb\uff0c\u5728github\u4e0astar\u4e00\u4e0b\u8ddf\u7a0b\u5e8f\u733f\u5144\u5f1f\u6253\u4e2a\u62db\u547c\u5427!!")),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://github.com/alibaba/nacos"},"Nacos")," \u662f\u963f\u91cc\u5df4\u5df4\u4e8e2018\u5e747\u6708\u4efd\u65b0\u5f00\u6e90\u7684\u9879\u76ee\uff0cNacos\u7684\u4e3b\u8981\u613f\u666f\u662f\u671f\u671b\u901a\u8fc7\u63d0\u4f9b\u6613\u7528\u7684 ",(0,n.kt)("inlineCode",{parentName:"p"},"\u52a8\u6001\u670d\u52a1\u53d1\u73b0"),"\u3001",(0,n.kt)("inlineCode",{parentName:"p"},"\u670d\u52a1\u914d\u7f6e\u7ba1\u7406"),"\u3001",(0,n.kt)("inlineCode",{parentName:"p"},"\u670d\u52a1\u5171\u4eab\u4e0e\u7ba1\u7406")," \u7684\u57fa\u7840\u8bbe\u65bd\uff0c\u5e2e\u52a9\u7528\u6237\u5728\u4e91\u539f\u751f\u65f6\u4ee3\u66f4\u597d\u7684\u6784\u5efa\u3001\u4ea4\u4ed8\u3001\u7ba1\u7406\u81ea\u5df1\u7684\u5fae\u670d\u52a1\u5e73\u53f0\u3002"),(0,n.kt)("p",null,"github\u9879\u76ee\u5730\u5740\u5728 ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/alibaba/nacos"},"\u8fd9\u91cc")))}k.isMDXComponent=!0}}]);