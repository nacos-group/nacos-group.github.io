"use strict";(self.webpackChunkNacos=self.webpackChunkNacos||[]).push([[3661],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>g});var n=a(67294);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,l=function(e,t){if(null==e)return{};var a,n,l={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var c=n.createContext({}),i=function(e){var t=n.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},p=function(e){var t=i(e.components);return n.createElement(c.Provider,{value:t},e.children)},u="mdxType",k={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,l=e.mdxType,r=e.originalType,c=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=i(a),m=l,g=u["".concat(c,".").concat(m)]||u[m]||k[m]||r;return a?n.createElement(g,s(s({ref:t},p),{},{components:a})):n.createElement(g,s({ref:t},p))}));function g(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=a.length,s=new Array(r);s[0]=m;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[u]="string"==typeof e?e:l,s[1]=o;for(var i=2;i<r;i++)s[i]=a[i];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},83428:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>k,frontMatter:()=>r,metadata:()=>o,toc:()=>i});var n=a(87462),l=(a(67294),a(3905));const r={title:"Nacos \u7684\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u4f1a\u7ecf\u5386\u4ec0\u4e48\uff1f",keywords:["Nacos","\u6ce8\u518c"],description:"\u8be6\u89e3 Nacos \u7684\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u4f1a\u7ecf\u5386\u4ec0\u4e48\uff1f"},s=void 0,o={permalink:"/zh-cn/blog/nacos-reigster-mechanism",source:"@site/i18n/zh-cn/docusaurus-plugin-content-blog/nacos-reigster-mechanism.md",title:"Nacos \u7684\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u4f1a\u7ecf\u5386\u4ec0\u4e48\uff1f",description:"\u8be6\u89e3 Nacos \u7684\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u4f1a\u7ecf\u5386\u4ec0\u4e48\uff1f",date:"2023-10-10T11:47:41.000Z",formattedDate:"2023\u5e7410\u670810\u65e5",tags:[],readingTime:14.245,hasTruncateMarker:!1,authors:[],frontMatter:{title:"Nacos \u7684\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u4f1a\u7ecf\u5386\u4ec0\u4e48\uff1f",keywords:["Nacos","\u6ce8\u518c"],description:"\u8be6\u89e3 Nacos \u7684\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u4f1a\u7ecf\u5386\u4ec0\u4e48\uff1f"},prevItem:{title:"\u652f\u6301Dubbo\u751f\u6001\u53d1\u5c55\uff0c\u963f\u91cc\u5df4\u5df4\u542f\u52a8\u65b0\u7684\u5f00\u6e90\u9879\u76ee Nacos",permalink:"/zh-cn/blog/nacos-is-coming"},nextItem:{title:"Nacos Roadmap\uff1aNacos GA\u540e\u4f1a\u6709\u54ea\u4e9b\u5927\u52a8\u4f5c\uff1f",permalink:"/zh-cn/blog/nacos-roadmap"}},c={authorsImageUrls:[]},i=[{value:"\u77e5\u8bc6\u70b9\u9884\u544a",id:"\u77e5\u8bc6\u70b9\u9884\u544a",level:3},{value:"\u4e00\u3001\u6e90\u5934\uff1a\u53d1\u8d77\u6ce8\u518c",id:"\u4e00\u6e90\u5934\u53d1\u8d77\u6ce8\u518c",level:2},{value:"1.1 \u9605\u8bfb\u6e90\u7801\u7684\u5c0f\u6280\u5de7",id:"11-\u9605\u8bfb\u6e90\u7801\u7684\u5c0f\u6280\u5de7",level:3},{value:"1.2 \u53d1\u8d77\u6ce8\u518c\u7684\u6d41\u7a0b\u56fe",id:"12-\u53d1\u8d77\u6ce8\u518c\u7684\u6d41\u7a0b\u56fe",level:3},{value:"1.3 \u7ec4\u88c5\u6ce8\u518c\u7684\u5b9e\u4f8b\u4fe1\u606f",id:"13-\u7ec4\u88c5\u6ce8\u518c\u7684\u5b9e\u4f8b\u4fe1\u606f",level:3},{value:"1.4 \u7ec4\u88c5\u6ce8\u518c\u8bf7\u6c42 request",id:"14-\u7ec4\u88c5\u6ce8\u518c\u8bf7\u6c42-request",level:3},{value:"1.5 \u53d1\u8d77\u8fdc\u7a0b\u8c03\u7528",id:"15-\u53d1\u8d77\u8fdc\u7a0b\u8c03\u7528",level:3},{value:"\u4e8c\u3001\u96c6\u7fa4\u73af\u5883\uff1a\u5206\u5e03\u5f0f\u7684\u524d\u63d0",id:"\u4e8c\u96c6\u7fa4\u73af\u5883\u5206\u5e03\u5f0f\u7684\u524d\u63d0",level:2},{value:"2.1 \u642d\u5efa\u597d\u4e00\u5957Nacos \u96c6\u7fa4\u73af\u5883",id:"21-\u642d\u5efa\u597d\u4e00\u5957nacos-\u96c6\u7fa4\u73af\u5883",level:3},{value:"\u4e09\u3001\u968f\u673a\u8282\u70b9\uff1a\u5e73\u7b49\u7684\u4e16\u754c",id:"\u4e09\u968f\u673a\u8282\u70b9\u5e73\u7b49\u7684\u4e16\u754c",level:2},{value:"\u56db\u3001\u8def\u7531\u8f6c\u53d1\uff1a\u4e0d\u662f\u6211\u7684\u83dc",id:"\u56db\u8def\u7531\u8f6c\u53d1\u4e0d\u662f\u6211\u7684\u83dc",level:2},{value:"4.1 \u53d1\u8d77\u548c\u8f6c\u53d1\u8bf7\u6c42\u7684\u6d41\u7a0b",id:"41-\u53d1\u8d77\u548c\u8f6c\u53d1\u8bf7\u6c42\u7684\u6d41\u7a0b",level:3},{value:"4.1 \u8def\u7531\u8f6c\u53d1\u7684\u903b\u8f91",id:"41-\u8def\u7531\u8f6c\u53d1\u7684\u903b\u8f91",level:3},{value:"4.2 \u8def\u7531\u8f6c\u53d1\u6e90\u7801\u5206\u6790",id:"42-\u8def\u7531\u8f6c\u53d1\u6e90\u7801\u5206\u6790",level:3},{value:"\u4e94\u3001\u5904\u7406\u8bf7\u6c42\uff1a\u5feb\u5230\u7897\u91cc\u6765",id:"\u4e94\u5904\u7406\u8bf7\u6c42\u5feb\u5230\u7897\u91cc\u6765",level:2},{value:"\u516d\u3001\u603b\u7ed3",id:"\u516d\u603b\u7ed3",level:2}],p={toc:i},u="wrapper";function k(e){let{components:t,...r}=e;return(0,l.kt)(u,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"\u8f6c\u8f7d\u4e14\u7f16\u8f91\u81ea",(0,l.kt)("a",{parentName:"p",href:"http://www.passjava.cn/#/13.SpringCloud%E6%9E%B6%E6%9E%84%E5%89%96%E6%9E%90/07.Nacos%E9%85%8D%E7%BD%AE%E6%B3%A8%E5%86%8C%E4%B8%AD%E5%BF%83/02.Nacos%E6%9E%B6%E6%9E%84%E5%8E%9F%E7%90%86%E2%91%A0%EF%BC%9A%E4%B8%80%E6%9D%A1%E6%B3%A8%E5%86%8C%E8%AF%B7%E6%B1%82%E4%BC%9A%E7%BB%8F%E5%8E%86%E4%BB%80%E4%B9%88%EF%BC%9F"},"Nacos \u7684\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u4f1a\u7ecf\u5386\u4ec0\u4e48?")),(0,l.kt)("h1",{id:"nacos-\u7684\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u4f1a\u7ecf\u5386\u4ec0\u4e48"},"Nacos \u7684\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u4f1a\u7ecf\u5386\u4ec0\u4e48\uff1f"),(0,l.kt)("h1",{id:"\u524d\u8a00"},"\u524d\u8a00"),(0,l.kt)("p",null,"Nacos \u4f5c\u4e3a\u6ce8\u518c\u4e2d\u5fc3\uff0c\u7528\u6765\u63a5\u6536\u5ba2\u6237\u7aef\uff08\u670d\u52a1\u5b9e\u4f8b\uff09\u53d1\u8d77\u7684\u6ce8\u518c\u8bf7\u6c42\uff0c\u5e76\u5c06\u6ce8\u518c\u4fe1\u606f\u5b58\u653e\u5230\u6ce8\u518c\u4e2d\u5fc3\u8fdb\u884c\u7ba1\u7406\u3002"),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"\u90a3\u4e48\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\u5230\u5e95\u4f1a\u7ecf\u5386\u54ea\u4e9b\u6b65\u9aa4\u5462\uff1f")),(0,l.kt)("h3",{id:"\u77e5\u8bc6\u70b9\u9884\u544a"},"\u77e5\u8bc6\u70b9\u9884\u544a"),(0,l.kt)("p",null,"\u5148\u4e0a\u4e00\u5f20\u6574\u4f53\u7684\u6d41\u7a0b\u56fe\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(8926).Z,width:"1964",height:"1636"})),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u96c6\u7fa4\u73af\u5883"),"\uff1a\u5982\u679c\u662f Nacos \u96c6\u7fa4\u73af\u5883\uff0c\u90a3\u4e48\u62d3\u6251\u7ed3\u6784\u662f\u4ec0\u4e48\u6837\u7684\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u7ec4\u88c5\u8bf7\u6c42"),"\uff1a\u5ba2\u6237\u7aef\u7ec4\u88c5\u6ce8\u518c\u8bf7\u6c42\uff0c\u4e0b\u4e00\u6b65\u5bf9 Nacos \u670d\u52a1\u53d1\u8d77\u8fdc\u7a0b\u8c03\u7528\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u968f\u673a\u8282\u70b9"),"\uff1a\u5ba2\u6237\u7aef\u968f\u673a\u9009\u62e9\u96c6\u7fa4\u4e2d\u7684\u4e00\u4e2a Nacos \u8282\u70b9\u53d1\u8d77\u6ce8\u518c\uff0c\u5b9e\u73b0\u8d1f\u8f7d\u5747\u8861\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u8def\u7531\u8f6c\u53d1"),"\uff1aNacos \u8282\u70b9\u6536\u5230\u6ce8\u518c\u8bf7\u6c42\u540e\uff0c\u770b\u4e0b\u662f\u4e0d\u662f\u5c5e\u4e8e\u81ea\u5df1\u7684\uff0c\u4e0d\u662f\u7684\u8bdd\uff0c\u5c31\u8fdb\u884c\u8def\u7531\u8f6c\u53d1\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u5904\u7406\u8bf7\u6c42"),"\uff1a\u8f6c\u53d1\u7ed9\u6307\u5b9a\u7684\u8282\u70b9\u540e\uff0c\u8be5\u8282\u70b9\u5c31\u4f1a\u5c06\u6ce8\u518c\u8bf7\u6c42\u4e2d\u7684\u5b9e\u4f8b\u4fe1\u606f\u89e3\u6790\u51fa\u6765\uff0c\u5b58\u5230\u81ea\u5b9a\u4e49\u7684\u5185\u5b58\u7ed3\u6784\u4e2d\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u6700\u7ec8\u4e00\u81f4\u6027"),"\uff1a\u901a\u8fc7 Nacos \u81ea\u7814\u7684 Distro \u534f\u8bae\u6267\u884c",(0,l.kt)("inlineCode",{parentName:"li"},"\u5ef6\u8fdf\u5f02\u6b65\u4efb\u52a1"),"\uff0c\u5c06\u6ce8\u518c\u4fe1\u606f\u540c\u6b65\u7ed9\u96c6\u7fa4\u4e2d\u7684\u5176\u4ed6\u8282\u70b9\uff0c\u4fdd\u8bc1\u4e86\u6570\u636e\u7684\u6700\u7ec8\u4e00\u81f4\u6027\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u5f02\u6b65\u91cd\u8bd5"),"\uff1a\u5982\u679c\u6ce8\u518c\u5931\u8d25\uff0c\u5ba2\u6237\u7aef\u5c06\u4f1a\u5207\u6362 Nacos \u8282\u70b9\uff0c\u518d\u6b21\u53d1\u8d77\u6ce8\u518c\u8bf7\u6c42\uff0c\u4fdd\u8bc1\u9ad8\u53ef\u7528\u6027\u3002")),(0,l.kt)("p",null,"\u8fd9\u4e9b\u77e5\u8bc6\u70b9\u91cc\u9762\u8fd8\u6709\u5f88\u591a\u7ec6\u8282\uff0c\u6211\u4f1a\u901a\u8fc7\u753b\u56fe + \u6e90\u7801\u5256\u6790\u7684\u65b9\u5f0f\u7ed9\u5927\u5bb6\u89e3\u7b54\u3002\u5982\u679c\u9047\u5230\u6e90\u7801\u770b\u4e0d\u592a\u61c2\u7684\u5730\u65b9\uff0c\u53ef\u4ee5\u591a\u770b\u4e0b\u6211\u753b\u7684\u56fe\uff0c\u7136\u540e\u7ffb\u4e0b\u6e90\u7801\uff0c\u5bf9\u7167\u7740\u4e00\u8d77\u770b\u3002"),(0,l.kt)("p",null,"\u5c0f Tip\uff1a\u672c\u6587\u4f7f\u7528\u7684 Nacos \u7248\u672c\uff1a 2.0.4\u3002"),(0,l.kt)("h2",{id:"\u4e00\u6e90\u5934\u53d1\u8d77\u6ce8\u518c"},"\u4e00\u3001\u6e90\u5934\uff1a\u53d1\u8d77\u6ce8\u518c"),(0,l.kt)("h3",{id:"11-\u9605\u8bfb\u6e90\u7801\u7684\u5c0f\u6280\u5de7"},"1.1 \u9605\u8bfb\u6e90\u7801\u7684\u5c0f\u6280\u5de7"),(0,l.kt)("p",null,"\u5728\u4f7f\u7528 Nacos \u7ec4\u4ef6\u7684\u7684\u65f6\u5019\uff0c\u6211\u4eec\u52a0\u4e0a\u4e00\u4e2a\u6ce8\u89e3 ",(0,l.kt)("inlineCode",{parentName:"p"},"@EnableDiscoveryClient")," \u5c31\u53ef\u4ee5\u4f7f\u670d\u52a1\u81ea\u52a8\u6ce8\u518c\u5230 Nacos\u3002"),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"\u90a3\u4e48\u8fd9\u4e2a\u53d1\u8d77\u6ce8\u518c\u7684\u5730\u65b9\u5230\u5e95\u5728\u54ea\u5462\uff1f\u6ce8\u518c\u4fe1\u606f\u53c8\u662f\u957f\u4ec0\u4e48\u6837\u7684\u5462\uff1f")),(0,l.kt)("p",null,"\u544a\u8bc9\u5927\u5bb6\u4e00\u4e2a\u770b\u6e90\u7801\u7684\u5c0f\u6280\u5de7\uff0c\u62ff\u5230\u6e90\u7801\u540e\uff0c\u4e0d\u662f\u76f4\u63a5\u5404\u4e2a\u6587\u4ef6\u90fd\u770b\u4e00\u7bc7\uff0c\u800c\u662f\u5148\u770b\u6e90\u7801\u4e2d\u5e26\u7684 example \u6587\u4ef6\u5939\u3002\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u627e\u5230 example \u7684 App \u7c7b\uff0c\u91cc\u9762\u5c31\u6709\u53d1\u8d77\u6ce8\u518c\u7684\u5b9e\u4f8b\u4ee3\u7801\u3002\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(89100).Z,width:"2564",height:"844"})),(0,l.kt)("p",null,"\u5f53\u7136\uff0c\u6211\u4eec\u4e5f\u53ef\u4ee5\u901a\u8fc7\u5b98\u7f51\u7ed9\u7684 curl \u547d\u4ee4\u53d1\u8d77 HTTP \u8bf7\u6c42\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-SH"},"curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.11&port=8080'\n")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u7559\u4e2a\u95ee\u9898"),"\uff1a\u6211\u4eec\u90fd\u662f\u52a0\u4e00\u4e2a Nacos \u6ce8\u89e3 ",(0,l.kt)("inlineCode",{parentName:"p"},"@EnableDiscoveryClient"),"\uff0c\u5c31\u4f1a\u81ea\u52a8\u628a\u670d\u52a1\u5b9e\u4f8b\u6ce8\u518c\u5230 Nacos\uff0c\u8fd9\u4e2a\u662f\u600e\u4e48\u505a\u5230\u7684\uff1f"),(0,l.kt)("h3",{id:"12-\u53d1\u8d77\u6ce8\u518c\u7684\u6d41\u7a0b\u56fe"},"1.2 \u53d1\u8d77\u6ce8\u518c\u7684\u6d41\u7a0b\u56fe"),(0,l.kt)("p",null,"\u5148\u6765\u770b\u4e00\u4e0b\u4ee3\u7801\u7684\u6d41\u7a0b\u56fe\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(11977).Z,width:"2062",height:"980"})),(0,l.kt)("p",null,"\u8ddf\u7740\u8fd9\u4e2a\u6d41\u7a0b\u56fe\uff0c\u6211\u4eec debug \u6765\u770b\u4e0b\u3002"),(0,l.kt)("h3",{id:"13-\u7ec4\u88c5\u6ce8\u518c\u7684\u5b9e\u4f8b\u4fe1\u606f"},"1.3 \u7ec4\u88c5\u6ce8\u518c\u7684\u5b9e\u4f8b\u4fe1\u606f"),(0,l.kt)("p",null,"\u5165\u53e3\u7684\u6838\u5fc3\u4ee3\u7801\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u5b83\u4f1a\u7ec4\u88c5\u6ce8\u518c\u7684",(0,l.kt)("inlineCode",{parentName:"p"},"\u5b9e\u4f8b\u4fe1\u606f"),"\uff0c\u653e\u5230\u4e00\u4e2a instance \u53d8\u91cf\u91cc\u9762\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(17179).Z,width:"1332",height:"548"})),(0,l.kt)("p",null,"\u901a\u8fc7\u4ee3\u7801\u8c03\u8bd5\uff0c\u6211\u4eec\u53ef\u4ee5\u770b\u5230\u91cc\u9762\u7684\u5b9e\u4f8b\u4fe1\u606f\u957f\u8fd9\u6837\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(39854).Z,width:"990",height:"554"})),(0,l.kt)("h3",{id:"14-\u7ec4\u88c5\u6ce8\u518c\u8bf7\u6c42-request"},"1.4 \u7ec4\u88c5\u6ce8\u518c\u8bf7\u6c42 request"),(0,l.kt)("p",null,"\u53d1\u8d77\u6ce8\u518c\u7684\u6838\u5fc3\u65b9\u6cd5\u662f doRegisterService()\uff0c\u7ec4\u88c5\u7684 request \u5982\u4e0b\u56fe\u6240\u793a\uff0c\u91cc\u9762\u6709\u4e4b\u524d\u7ec4\u88c5\u7684\u5b9e\u4f8b\u4fe1\u606f instance\uff0c\u8fd8\u6709\u6307\u5b9a\u7684  namespace\uff08Nacos \u7684\u547d\u540d\u7a7a\u95f4\uff09\u3001serviceName\uff08\u670d\u52a1\u540d\uff09\uff0cgroupName\uff08Nacos \u7684\u5206\u7ec4\uff09\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"image-20220411162322668",src:a(87688).Z,width:"1424",height:"876"})),(0,l.kt)("h3",{id:"15-\u53d1\u8d77\u8fdc\u7a0b\u8c03\u7528"},"1.5 \u53d1\u8d77\u8fdc\u7a0b\u8c03\u7528"),(0,l.kt)("p",null,"requestToServer() \u65b9\u6cd5\u91cc\u9762\u4f1a\u8c03\u7528 RpcClient \u7684 request() \u65b9\u6cd5\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"response = this.currentConnection.request(request, timeoutMills);\n")),(0,l.kt)("p",null,"\u5c31\u662f\u5411 Nacos \u53d1\u8d77\u8fdc\u7a0b\u8c03\u7528\uff0c\u5982\u679c\u662f Nacos \u96c6\u7fa4\uff0c\u5219\u662f\u5411\u96c6\u7fa4\u4e2d\u7684\u67d0\u4e2a Nacos \u8282\u70b9\u53d1\u8d77\u8fdc\u7a0b\u8c03\u7528\u3002"),(0,l.kt)("p",null,"\u63a5\u4e0b\u6765\u6211\u4eec\u770b\u4e0b\u5ba2\u6237\u7aef\u662f\u5982\u4f55\u9009\u62e9\u4e00\u4e2a Nacos \u8282\u70b9\u8fdb\u884c\u6ce8\u518c\u7684\u3002"),(0,l.kt)("h2",{id:"\u4e8c\u96c6\u7fa4\u73af\u5883\u5206\u5e03\u5f0f\u7684\u524d\u63d0"},"\u4e8c\u3001\u96c6\u7fa4\u73af\u5883\uff1a\u5206\u5e03\u5f0f\u7684\u524d\u63d0"),(0,l.kt)("p",null,"\u5982\u679c\u662f Nacos \u96c6\u7fa4\u73af\u5883\uff0c\u5ba2\u6237\u7aef\u4f1a\u968f\u673a\u9009\u62e9\u4e00\u4e2a Nacos \u8282\u70b9\u53d1\u8d77\u6ce8\u518c\u3002"),(0,l.kt)("h3",{id:"21-\u642d\u5efa\u597d\u4e00\u5957nacos-\u96c6\u7fa4\u73af\u5883"},"2.1 \u642d\u5efa\u597d\u4e00\u5957Nacos \u96c6\u7fa4\u73af\u5883"),(0,l.kt)("p",null,"\u4e3a\u4e86\u8bb2\u89e3\u5ba2\u6237\u7aef\u662f\u5982\u4f55\u6ce8\u518c\u5230 Nacos \u96c6\u7fa4\u73af\u5883\u7684\u5e95\u5c42\u539f\u7406\uff0c\u6211\u5728\u672c\u5730\u642d\u5efa\u4e86\u4e00\u4e2a Nacos \u96c6\u7fa4\u73af\u5883\uff0c\u6709 3 \u4e2a Nacos \u670d\u52a1\uff0c\u5b83\u4eec\u7684 IP \u76f8\u540c\uff0c\u7aef\u53e3\u53f7\u4e0d\u540c\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"192.168.10.197:8848\n192.168.10.197:8858\n192.168.10.197:8868\n")),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(25929).Z,width:"1422",height:"976"})),(0,l.kt)("p",null,"\u7136\u540e",(0,l.kt)("strong",{parentName:"p"},"\u670d\u52a1 A \u548c\u670d\u52a1 B \u90fd\u662f\u914d\u7f6e\u4e86 Nacos \u96c6\u7fa4"),"\u7684 IP \u548c \u7aef\u53e3\u53f7\u7684\uff0c\u914d\u7f6e\u5982\u4e0b\u6240\u793a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"spring.cloud.nacos.discovery.server-addr\n  =192.168.10.197:8848,192.168.10.197:8858,192.168.10.197:8868\n")),(0,l.kt)("p",null,"\u6574\u4f53\u7684\u7ed3\u6784\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u670d\u52a1 A \u548c \u670d\u52a1 B \u90fd\u5f80 Nacos \u96c6\u7fa4\u8fdb\u884c\u6ce8\u518c\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(82221).Z,width:"1596",height:"1436"})),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u4f46\u662f\u91cc\u9762\u6709\u4e00\u4e2a\u95ee\u9898"),"\uff1a\u670d\u52a1 A \u6ce8\u518c\u65f6\uff0c\u662f\u5411\u6240\u6709 Nacos \u8282\u70b9\u53d1\u8d77\u6ce8\u518c\u5462\uff1f\u8fd8\u662f\u53ea\u5411\u5176\u4e2d\u4e00\u4e2a\u8282\u70b9\u53d1\u8d77\u6ce8\u518c\uff1f\u5982\u679c\u53ea\u5411\u4e00\u4e2a\u8282\u70b9\u6ce8\u518c\uff0c\u8981\u5411\u54ea\u4e2a\u8282\u70b9\u6ce8\u518c\u5462\uff1f"),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"\u7b54\u6848\uff1a\u5728 Client \u53d1\u8d77\u6ce8\u518c\u4e4b\u524d\uff0c\u4f1a\u6709\u4e00\u4e2a\u540e\u53f0\u7ebf\u7a0b\u968f\u673a\u62ff\u5230 Nacos \u96c6\u7fa4\u670d\u52a1\u5217\u8868\u4e2d\u7684\u4e00\u4e2a\u5730\u5740\u3002")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Nacos \u4e3a\u4ec0\u4e48\u4f1a\u8fd9\u6837\u8bbe\u8ba1\uff1f")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u8fd9\u5176\u5b9e\u5c31\u662f\u4e00\u4e2a\u8d1f\u8f7d\u5747\u8861\u7684\u601d\u60f3\u5728\u91cc\u9762\uff0c\u6bcf\u4e2a\u8282\u70b9\u90fd\u5747\u5300\u7684\u5206\u644a\u8bf7\u6c42\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u4fdd\u8bc1\u9ad8\u53ef\u7528\uff0c\u5f53\u67d0\u4e2a\u8282\u70b9\u5b95\u673a\u540e\uff0c\u91cd\u65b0\u62ff\u5230\u5176\u4ed6\u7684 Nacos \u8282\u70b9\u6765\u5efa\u7acb\u8fde\u63a5\u3002")),(0,l.kt)("p",null,"\u63a5\u4e0b\u6765\u6211\u4eec\u770b\u4e0b\u670d\u52a1 A \u662f\u600e\u4e48\u968f\u673a\u62ff\u5230\u4e00\u4e2a Nacos \u8282\u70b9\u7684\u3002"),(0,l.kt)("h2",{id:"\u4e09\u968f\u673a\u8282\u70b9\u5e73\u7b49\u7684\u4e16\u754c"},"\u4e09\u3001\u968f\u673a\u8282\u70b9\uff1a\u5e73\u7b49\u7684\u4e16\u754c"),(0,l.kt)("p",null,"\u6211\u4eec\u6765\u770b\u4e0b\u5ba2\u6237\u7aef\u662f\u5982\u4f55\u968f\u673a\u9009\u62e9\u4e00\u4e2a\u8282\u70b9\u7684\uff0c\u6d41\u7a0b\u56fe\u5982\u4e0b\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(86421).Z,width:"1166",height:"1256"})),(0,l.kt)("p",null,"\u90a3\u4e48\u5982\u4f55\u627e\u5230\u8fd9\u4e9b\u4ee3\u7801\u903b\u8f91\u5462\uff1f\u601d\u8def\u662f\u600e\u4e48\u6837\u7684\uff1f"),(0,l.kt)("p",null,"\u6211\u4eec\u4e4b\u524d\u8bb2\u8fc7\uff0cRpcClient \u4f1a\u53d1\u8d77 request \u8bf7\u6c42\uff0c\u7528\u7684\u662f\u548c Nacos \u5efa\u7acb ",(0,l.kt)("inlineCode",{parentName:"p"},"currentConnection")," \u8fde\u63a5\u6765\u53d1\u8d77\u8c03\u7528\uff0c\u4ee3\u7801\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"// \u53d1\u8d77\u8c03\u7528\nresponse = this.currentConnection.request(request, timeoutMills);\n")),(0,l.kt)("p",null,"\u8fd9\u4e2a ",(0,l.kt)("inlineCode",{parentName:"p"},"currentConnection")," \u662f\u5ba2\u6237\u7aef\u548c Nacos \u96c6\u7fa4\u4e2d\u7684\u67d0\u4e2a\u8282\u70b9\u5efa\u7acb\u7684\u8fde\u63a5\uff0c\u6211\u4eec\u627e\u4e0b\u5b83\u5728\u54ea\u91cc\u8d4b\u503c\u7684\u3002\u4ee3\u7801\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"// \u62ff\u5230 Nacos \u8282\u70b9\u4fe1\u606f\nserverInfo = recommendServer.get() == null ? nextRpcServer() : recommendServer.get();\n// \u8fde\u63a5 Nacos \u8282\u70b9\nconnectToServer = connectToServer(serverInfo);\n// \u8d4b\u503c currentConnection\nthis.currentConnection = connectToServer;\n")),(0,l.kt)("p",null,"\u800c\u8fde\u63a5\u7684\u4fe1\u606f\u662f\u901a\u8fc7\u53c2\u6570 serverInfo \u4f20\u8fdb\u53bb\u7684\uff0c\u6240\u4ee5\u6211\u4eec\u518d\u770b\u4e0b serverInfo \u5728\u54ea\u91cc\u8d4b\u503c\u7684\u3002"),(0,l.kt)("p",null,"\u8fd9\u4e2a nextRpcServer() \u65b9\u6cd5\u91cc\u9762\u4f1a",(0,l.kt)("strong",{parentName:"p"},"\u62ff\u5230\u4e00\u4e2a\u968f\u673a\u7684 Nacos \u5730\u5740"),"\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"// \u4e00\u4e2a int \u968f\u673a\u6570\uff0c\u8303\u56f4 [0 ~ Nacos \u4e2a\u6570)\ncurrentIndex.set(new Random().nextInt(serverList.size()));\n// index \u81ea\u589e 1\nint index = currentIndex.incrementAndGet() % getServerList().size();\n// \u8fd4\u56de Nacos \u5730\u5740\nreturn getServerList().get(index);\n")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u5c0f\u7ed3"),"\uff1a\u5ba2\u6237\u7aef\u751f\u6210\u4e00\u4e2a\u968f\u673a\u6570\uff0c\u7136\u540e\u901a\u8fc7\u8fd9\u4e2a\u968f\u673a\u6570\u4ece Nacos \u670d\u52a1\u5217\u8868\u4e2d\u62ff\u5230\u4e00\u4e2a Nacos \u670d\u52a1\u5730\u5740\u8fd4\u56de\u7ed9\u5ba2\u6237\u7aef\uff0c\u7136\u540e\u5ba2\u6237\u7aef\u901a\u8fc7\u8fd9\u4e2a\u5730\u5740\u548c Nacos \u670d\u52a1\u5efa\u7acb\u8fde\u63a5\u3002Nacos \u670d\u52a1\u5217\u8868\u4e2d\u7684\u8282\u70b9\u90fd\u662f\u5e73\u7b49\u7684\uff0c\u968f\u673a\u62ff\u5230\u7684\u4efb\u4f55\u4e00\u4e2a\u8282\u70b9\u90fd\u662f\u53ef\u4ee5\u7528\u6765\u53d1\u8d77\u8c03\u7528\u7684\u3002"),(0,l.kt)("h2",{id:"\u56db\u8def\u7531\u8f6c\u53d1\u4e0d\u662f\u6211\u7684\u83dc"},"\u56db\u3001\u8def\u7531\u8f6c\u53d1\uff1a\u4e0d\u662f\u6211\u7684\u83dc"),(0,l.kt)("h3",{id:"41-\u53d1\u8d77\u548c\u8f6c\u53d1\u8bf7\u6c42\u7684\u6d41\u7a0b"},"4.1 \u53d1\u8d77\u548c\u8f6c\u53d1\u8bf7\u6c42\u7684\u6d41\u7a0b"),(0,l.kt)("p",null,"\u4e3a\u4e86\u6f14\u793a\u53d1\u8d77\u6ce8\u518c\u7684\u6d41\u7a0b\uff0c\u6211\u5728\u8fd9\u91cc\u6a21\u62df\u4e86\u4e00\u4e2a\u6ce8\u518c\u8bf7\u6c42\u3002"),(0,l.kt)("p",null,"\u7528\u7684\u662f curl \u547d\u4ee4\uff0c\u5bf9 Nacos \u8282\u70b9\uff08127.0.0.1:8848\uff09\u53d1\u8d77\u6ce8\u518c\u8bf7\u6c42\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-SH"},"curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.11&port=8080'\n")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u8bf7\u6c42 URL"),"\uff1a/nacos/v1/ns/instance"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u8bf7\u6c42\u53c2\u6570"),"\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"serviceName=nacos.naming.serviceName"),(0,l.kt)("li",{parentName:"ul"},"ip=20.18.7.11"),(0,l.kt)("li",{parentName:"ul"},"port=8080'")),(0,l.kt)("p",null,"\u4e4b\u524d\u6211\u4eec\u8bb2\u5230\uff0cNacos \u7684\u6709\u591a\u4e2a\u8282\u70b9\u53ef\u4ee5\u5206\u522b\u5904\u7406\u8bf7\u6c42\uff0c\u5f53\u8282\u70b9\u53d1\u73b0\u8fd9\u4e2a\u8bf7\u6c42\u4e0d\u662f\u5c5e\u4e8e\u81ea\u5df1\u7684\uff0c\u5c31\u4f1a\u8fdb\u884c\u8f6c\u53d1\u3002"),(0,l.kt)("p",null,"\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,l.kt)("p",null,"\u670d\u52a1 A \u968f\u673a\u9009\u62e9\u4e00\u4e2a Nacos \u8282\u70b9\uff08\u56fe\u4e2d\u4e3a Nacos1\uff09\u53d1\u8d77\u6ce8\u518c\u8bf7\u6c42\uff0c\u8bf7\u6c42\u53c2\u6570\u4e2d\u5305\u542b\u4e86\u5b9e\u4f8b\u4fe1\u606f\uff0cNacos 1 \u6839\u636e\u5b9e\u4f8b\u4fe1\u606f hash + \u53d6\u6a21\u62ff\u5230\u6b63\u786e\u7684\u8282\u70b9\uff0c\u5982\u679c\u4e0d\u5c5e\u4e8e\u81ea\u5df1\uff0c\u5219\u5c06\u8bf7\u6c42\u8f6c\u53d1\u7ed9\u5176\u4ed6\u8282\u70b9\uff08\u56fe\u4e2d\u4e3a Nacos2\uff09"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(47133).Z,width:"1450",height:"1336"})),(0,l.kt)("p",null,"\u90a3\u4e48\u8def\u7531\u8f6c\u53d1\u7684\u7ec6\u8282\u662f\u600e\u4e48\u6837\u7684\uff1f\u8fd9\u4e2a\u5c31\u6d89\u53ca\u5230 Distro \u534f\u8bae\u4e86\uff0c\u6211\u4eec\u63a5\u7740\u5f80\u4e0b\u770b\u3002"),(0,l.kt)("h3",{id:"41-\u8def\u7531\u8f6c\u53d1\u7684\u903b\u8f91"},"4.1 \u8def\u7531\u8f6c\u53d1\u7684\u903b\u8f91"),(0,l.kt)("p",null,"\u5176\u5b9e Nacos \u8282\u70b9\u7684\u8def\u7531\u8f6c\u53d1\u903b\u8f91\u6bd4\u8f83\u7b80\u5355\uff0c\u5148\u6765\u770b\u4e0b\u6d41\u7a0b\u56fe\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(34153).Z,width:"1226",height:"1374"})),(0,l.kt)("p",null,"\u6b65\u9aa4\u5982\u4e0b\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u2460  Nacos \u8282\u70b9\u4ece\u5ba2\u6237\u7aef\u53d1\u8d77\u7684 request \u4e2d\u62ff\u5230\u5ba2\u6237\u7aef\u7684\u5b9e\u4f8b\u4fe1\u606f\u751f\u6210 distroTag\uff0c\u5982 IP + port \u6216 service name\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u2461  Nacos \u6839\u636e distroTag \u751f\u6210 hash \u503c\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u2462  \u7528 hash \u503c\u5bf9 Nacos \u8282\u70b9\u6570\u8fdb\u884c",(0,l.kt)("inlineCode",{parentName:"li"},"\u53d6\u4f59"),"\uff0c\u62ff\u5230\u4f59\u6570\uff0c\u6bd4\u5982 0\u30011\u30012\u30013\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u2463 \u6839\u636e\u4f59\u6570\u4ece Nacos \u8282\u70b9\u5217\u8868\u4e2d\u62ff\u5230\u6307\u5b9a\u7684\u8282\u70b9\u5730\u5740\u3002")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u6211\u6ca1\u770b\u61c2\u7684\u70b9"),"\uff1a\u6211\u8fd9\u91cc\u542f\u52a8\u4e86\u4e09\u4e2a Nacos \u8282\u70b9\uff0c\u5982\u4e0b\u56fe\u6240\u793a\u7684 \u4e09\u4e2a Running \u8282\u70b9\u3002\u4f46\u662f\u4e3a\u4ec0\u4e48 Nacos \u7684 ServersList \u4f1a\u591a\u4e86\u4e00\u4e2a 192.168.10.197:8848\u7684\u8282\u70b9\uff1f"),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"\u5f00\u53d1\u8005\u56de\u7b54\uff1a\nnacos-server\u5b58\u5728\u4e00\u4e2a\u673a\u5236\uff0c\u5728\u542f\u52a8\u7684\u65f6\u5019\u4f1a\u68c0\u67e5cluster.conf\u4e2d\u914d\u7f6e\u7684member\u5185\u5bb9\uff0c\u5982\u679c\u53d1\u73b0\u81ea\u8eab\u4e0d\u5728member\u5217\u8868\u4e2d\uff0c\u5c31\u4f1a\u5c06\u81ea\u8eab\u5730\u5740\u52a0\u5165\u5230member\u5217\u8868\u4e2d\u3002\n\u56fe\u4e2dmember\u663e\u793a\u6709127.0.0.1\u76843\u4e2a\u8282\u70b9\u548c\u4e00\u4e2a192.168.10.197\u8282\u70b9\uff0c\u8bf4\u660enacos-server\u83b7\u53d6\u5230\u7684ip\u662f192.168.10.197\uff0c\u4f46\u662fcluster.conf\u4e2d\u914d\u7f6e\u7684ip\u662f127.0.0.1\u3002\n\u9700\u8981\u89e3\u51b3\u7684\u8bdd\u6709\u4e24\u79cd\u65b9\u6cd5\uff0c\u4e00\u79cd\u662f\u4e25\u683c\u6309\u7167\u4e0a\u6587\u4e2d\u7684\u914d\u7f6e\uff0c\u914d\u7f6eip\u4e3a192.168.10.197\uff0c\u53e6\u4e00\u79cd\u65b9\u5f0f\u662f\u5728\u542f\u52a8\u670d\u52a1\u662f\u8bbe\u7f6eJVM\u53c2\u6570-Dnacos.server.ip=127.0.0.1\n\u8fd9\u4e2a\u914d\u7f6e\u9519\u8bef\u540c\u6837\u5e38\u89c1\u4e8e\u4f7f\u7528K8S\u642d\u5efaNacos\u96c6\u7fa4\uff0c\u57df\u540d\u548chostname\u4e92\u76f8\u6df7\u7528\u65f6\u51fa\u73b0\u3002")),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"IDEA \u542f\u52a8\u4e86\u4e09\u4e2a nacos \u8282\u70b9",src:a(49934).Z,width:"792",height:"356"})),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"nacos \u63a7\u5236\u53f0\u6709\u56db\u4e2a\u8282\u70b9",src:a(63053).Z,width:"1828",height:"998"})),(0,l.kt)("h3",{id:"42-\u8def\u7531\u8f6c\u53d1\u6e90\u7801\u5206\u6790"},"4.2 \u8def\u7531\u8f6c\u53d1\u6e90\u7801\u5206\u6790"),(0,l.kt)("p",null,"\u5165\u53e3\u6587\u4ef6\u662f DistroFilter.java\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-SH"},"naming/src/main/java/com/alibaba/nacos/naming/web/DistroFilter.java\n")),(0,l.kt)("p",null,"\u8bf7\u6c42\u4f1a\u5148\u5230 DistroFilter \u7c7b\u7684 doFilter() \u65b9\u6cd5\uff0c\u62ff\u5230\u6b63\u786e\u7684\u8282\u70b9\u5730\u5740\u540e\uff0c\u5c06\u8bf7\u6c42\u8f6c\u53d1\u51fa\u53bb\u3002"),(0,l.kt)("p",null,"\u83b7\u53d6\u9700\u8981\u8f6c\u53d1\u8282\u70b9\u5730\u5740\u7684\u4ee3\u7801\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'// \u627e\u5230 Nacos \u96c6\u7fa4\u4e2d\u7684\u76ee\u6807\u8282\u70b9\nfinal String targetServer = distroMapper.mapSrv(distroTag);\n\n// mapSrv \u65b9\u6cd5\u4f1a\u5148 hash\uff0c\u7136\u540e\u518d\u53d6\u6a21\uff0cresponsibleTag\u7684\u503c\u7c7b\u4f3c\u8fd9\u6837\uff1a"20.18.7.11:8080"\nint index = distroHash(responsibleTag) % servers.size();\n\n// distroHash \u65b9\u6cd5\u91cc\u9762\u4f1a\u5bf9 \u5ba2\u6237\u7aef\u7684 ip+port \u5b57\u7b26\u4e32\u6216\u8005\u670d\u52a1\u540d\u5b57\u7b26\u4e32 \u8fdb\u884c hash\nMath.abs(responsibleTag.hashCode() % Integer.MAX_VALUE);\n')),(0,l.kt)("p",null,"\u4e0d\u8bba\u662f\u81ea\u5df1\u5904\u7406\u6ce8\u518c\u8bf7\u6c42\u8fd8\u662f\u8f6c\u53d1\u7ed9\u5176\u4ed6\u8282\u70b9\u6765\u5904\u7406\uff0c\u90fd\u4f1a\u628a\u5b9e\u4f8b\u4fe1\u606f\u5b58\u50a8\u8d77\u6765\uff0c\u90a3\u4e48\u662f\u5982\u4f55\u8fdb\u884c\u5b58\u50a8\u7684\uff1f"),(0,l.kt)("h2",{id:"\u4e94\u5904\u7406\u8bf7\u6c42\u5feb\u5230\u7897\u91cc\u6765"},"\u4e94\u3001\u5904\u7406\u8bf7\u6c42\uff1a\u5feb\u5230\u7897\u91cc\u6765"),(0,l.kt)("p",null,"Nacos \u76ee\u524d\u6709\u4e24\u4e2a\u7248\u672c\uff0cv1 \u548c v2\uff0c\u5982\u679c\u662f v1\uff0c\u5219\u662f instanceController \u6765\u5904\u7406\u6ce8\u518c\u8bf7\u6c42\uff0c\u5426\u5219\u7528 instanceControllerV2\u3002\u672c\u7bc7\u6211\u4eec\u53ea\u8bb2\u89e3 v1 \u7248\u672c\u662f\u600e\u4e48\u5904\u7406\u8bf7\u6c42\u7684\u3002"),(0,l.kt)("p",null,"\u5148\u4e0a\u6d41\u7a0b\u56fe\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"\u6dfb\u52a0\u5b9e\u4f8b\u4fe1\u606f\u7684\u6d41\u7a0b",src:a(72038).Z,width:"1366",height:"1360"})),(0,l.kt)("p",null,"\u6d4b\u8bd5\u7528\u7684\u53d1\u8d77\u6ce8\u518c\u7684\u547d\u4ee4\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-SH"},"curl -X POST 'http://127.0.0.1:8858/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.11&port=8080'\n")),(0,l.kt)("p",null,"\u6838\u5fc3\u4ee3\u7801\u5c31\u662f\u8fd9\u4e2a\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"\u670d\u52a1\u7aef\u6ce8\u518c\u5b9e\u4f8b\u7684\u65b9\u6cd5",src:a(22854).Z,width:"1624",height:"768"})),(0,l.kt)("p",null,"\u6709\u4e00\u4e2a synchronized \u9501\uff0c\u5c06\u4e34\u65f6\u7684\u5b9e\u4f8b\u4fe1\u606f\u5b58\u653e\u8d77\u6765\uff0c\u6240\u4ee5\u91cd\u70b9\u770b\u4e0b \u8fd9\u4e2a consistencyService.put() \u65b9\u6cd5\u505a\u4e86\u4ec0\u4e48\u4e8b\u60c5\u3002"),(0,l.kt)("p",null,"\u5148\u770b\u4e0b\u6e90\u7801\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"onPut(key, value);\n// \u5f00\u542f 1s \u7684\u5ef6\u8fdf\u4efb\u52a1\uff0c\u5c06\u6570\u636e\u540c\u6b65\u7ed9\u5176\u4ed6 Nacos \u8282\u70b9\ndistroProtocol.sync(new      DistroKey(key,KeyBuilder.INSTANCE_LIST_KEY_PREFIX),DataOperation.CHANGE,\n                DistroConfig.getInstance().getSyncDelayMillis());\n")),(0,l.kt)("p",null,"\u8fd9\u91cc\u9762\u505a\u4e86\u4e09\u4ef6\u4e8b\u60c5\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u2460 \u5c06\u5b9e\u4f8b\u4fe1\u606f\u5b58\u653e\u5230\u5185\u5b58\u7f13\u5b58 concurrentHashMap \u91cc\u9762\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u2461 \u6dfb\u52a0\u4e00\u4e2a\u4efb\u52a1\u5230 BlockingQueue \u91cc\u9762\uff0c\u8fd9\u4e2a\u4efb\u52a1\u5c31\u662f\u5c06\u6700\u65b0\u7684\u5b9e\u4f8b\u5217\u8868\u901a\u8fc7 UDP \u7684\u65b9\u5f0f\u63a8\u9001\u7ed9\u6240\u6709\u5ba2\u6237\u7aef\uff08\u670d\u52a1\u5b9e\u4f8b\uff09\uff0c\u8fd9\u6837\u5ba2\u6237\u7aef\u5c31\u62ff\u5230\u4e86\u6700\u65b0\u7684\u670d\u52a1\u5b9e\u4f8b\u5217\u8868\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u2462 \u5f00\u542f 1s \u7684\u5ef6\u8fdf\u4efb\u52a1\uff0c\u5c06\u6570\u636e\u901a\u8fc7\u7ed9\u5176\u4ed6 Nacos \u8282\u70b9\u3002")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u6ce8\u610f"),"\uff1a\u9488\u5bf9\u7b2c\u4e8c\u70b9\u548c\u7b2c\u4e09\u70b9\uff0c\u5c5e\u4e8e Distro \u4e00\u81f4\u6027\u534f\u8bae\u7684\u4e00\u90e8\u5206\uff0c\u91cc\u9762\u7684\u5185\u5bb9\u8fd8\u6bd4\u8f83\u591a\uff0c\u6211\u4eec\u653e\u5230\u4e0b\u4e00\u8bb2\u4e13\u95e8\u6765\u8bb2\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u77e5\u8bc6\u70b9\u9884\u544a"),"\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"\u8fd9\u91cc\u7684\u5b58\u50a8\u5b9e\u4f8b\u548c\u540c\u6b65\u7684\u65b9\u5f0f\u548c Eureka \u6709\u4ec0\u4e48\u533a\u522b\uff1fEureka \u7528\u7684\u4e09\u5c42\u7f13\u5b58\u67b6\u6784\uff0cNacos \u7528\u7684 CopyOnWrite \u6280\u672f\u3002")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"\u5982\u4f55\u63a8\u9001\u7ed9\u6240\u6709\u5ba2\u6237\u7aef\u7684\uff1fUDP \u65b9\u5f0f\u3002")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"\u5982\u4f55\u540c\u6b65\u7ed9 Nacos \u5176\u4ed6\u8282\u70b9\u7684\uff1fDistro \u4e00\u81f4\u6027\u534f\u8bae\u3002"))),(0,l.kt)("h2",{id:"\u516d\u603b\u7ed3"},"\u516d\u3001\u603b\u7ed3"),(0,l.kt)("p",null,"\u672c\u6587\u901a\u8fc7\u53d1\u8d77\u4e00\u6761\u6ce8\u518c\u8bf7\u6c42\uff0c\u8bb2\u89e3\u4e86 Nacos \u5ba2\u6237\u7aef\u5982\u4f55\u968f\u673a\u9009\u62e9\u8282\u70b9\u3001Nacos Server \u5982\u4f55\u8def\u7531\u3001Nacos Server \u5982\u4f55\u5b58\u50a8\u6ce8\u518c\u5b9e\u4f8b\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u6838\u5fc3\u6d41\u7a0b"),"\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(2371).Z,width:"1964",height:"1636"})))}k.isMDXComponent=!0},25929:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220408100844549MpxWbbx40la1-8ba0634d0f1ed91ae21e24204e4a5cad.png"},82221:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220408101723181kPWAUaDBK5jL-e96872194b8a82097957172cc89dd6c3.png"},39854:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220411160413112vLIk1i-5d4ff2f5c2841480d4251c57257a7abc.png"},17179:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-202204111612410590Vmd01-615e535bd8410d9277bd4ec8842914f2.png"},87688:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-202204111623226683NnG6U-e4eacabd0ad633c9a9a720a3a7cdb813.png"},89100:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220412071138017zxK9mw-afe9812f13ff074bc352b592aa61e87d.png"},11977:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220412071400192DVNL4d-9665cc994a215398c3c0349099baee79.png"},86421:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220412085821355AZgLcJ-676a1d38dfb9a298ef355d3b096c6733.png"},34153:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220412184102530MvbD7W-03d5f24c06c1d778ca0100fbc81b6497.png"},49934:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-202204122033417675s0J4F-d1e08a906f3afbf3285b330f56afe9a9.png"},47133:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220412215250738gU1BYV-6144fe920ac12a2264f5126c937d37ea.png"},63053:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220413153431838s2Wj4W-c33f05c6a2798639dbf30617d7c6afb3.png"},22854:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220413160148289ylcS1n-5f60cb502dbe3dd369cd47497e22476a.png"},72038:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220413164932907KHTvVM-1ea8de71447055276f1afbae22199828.png"},2371:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220413171451070bFSgRz-20220530201153679-cf97e1427caabd564d6fad0274a46ea5.png"},8926:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-20220413171451070bFSgRzW3Rx0S-cf97e1427caabd564d6fad0274a46ea5.png"}}]);