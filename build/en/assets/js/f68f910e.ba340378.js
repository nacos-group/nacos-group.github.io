"use strict";(self.webpackChunkNacos=self.webpackChunkNacos||[]).push([[2851],{3905:(e,t,a)=>{a.d(t,{Zo:()=>s,kt:()=>d});var n=a(67294);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,n,l=function(e,t){if(null==e)return{};var a,n,l={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var o=n.createContext({}),p=function(e){var t=n.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},s=function(e){var t=p(e.components);return n.createElement(o.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},k=n.forwardRef((function(e,t){var a=e.components,l=e.mdxType,r=e.originalType,o=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=p(a),k=l,d=u["".concat(o,".").concat(k)]||u[k]||m[k]||r;return a?n.createElement(d,i(i({ref:t},s),{},{components:a})):n.createElement(d,i({ref:t},s))}));function d(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=a.length,i=new Array(r);i[0]=k;var c={};for(var o in t)hasOwnProperty.call(t,o)&&(c[o]=t[o]);c.originalType=e,c[u]="string"==typeof e?e:l,i[1]=c;for(var p=2;p<r;p++)i[p]=a[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}k.displayName="MDXCreateElement"},28693:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>m,frontMatter:()=>r,metadata:()=>c,toc:()=>p});var n=a(87462),l=(a(67294),a(3905));const r={},i="Nacos\u6253\u901aCMDB\u5b9e\u73b0\u5c31\u8fd1\u8bbf\u95ee",c={permalink:"/en/blog/cmdb",source:"@site/i18n/en/docusaurus-plugin-content-blog/cmdb.md",title:"Nacos\u6253\u901aCMDB\u5b9e\u73b0\u5c31\u8fd1\u8bbf\u95ee",description:"CMDB\u5728\u4f01\u4e1a\u4e2d\uff0c\u4e00\u822c\u7528\u4e8e\u5b58\u653e\u4e0e\u673a\u5668\u8bbe\u5907\u3001\u5e94\u7528\u3001\u670d\u52a1\u7b49\u76f8\u5173\u7684\u5143\u6570\u636e\u3002\u4e00\u822c\u5f53\u4f01\u4e1a\u7684\u673a\u5668\u53ca\u5e94\u7528\u8fbe\u5230\u4e00\u5b9a\u89c4\u6a21\u540e\u5c31\u9700\u8981\u8fd9\u6837\u4e00\u4e2a\u7cfb\u7edf\u6765\u5b58\u50a8\u548c\u7ba1\u7406\u5b83\u4eec\u7684\u5143\u6570\u636e\u3002\u6709\u4e00\u4e9b\u5e7f\u6cdb\u4f7f\u7528\u7684\u5c5e\u6027\u4f8b\u5982\u673a\u5668\u7684IP\u3001\u4e3b\u673a\u540d\u3001\u673a\u623f\u3001\u5e94\u7528\u3001region\u7b49\uff0c\u8fd9\u4e9b\u6570\u636e\u4e00\u822c\u4f1a\u5728\u673a\u5668\u90e8\u7f72\u65f6\u5f55\u5165\u5230CMDB\uff0c\u8fd0\u7ef4\u6216\u8005\u76d1\u63a7\u5e73\u53f0\u4f1a\u4f7f\u7528\u8fd9\u4e9b\u6570\u636e\u8fdb\u884c\u5c55\u793a\u6216\u8005\u76f8\u5173\u7684\u8fd0\u7ef4\u64cd\u4f5c\u3002",date:"2023-10-10T11:47:41.000Z",formattedDate:"October 10, 2023",tags:[],readingTime:13.75,hasTruncateMarker:!1,authors:[],frontMatter:{},prevItem:{title:"Nacos \u8ba1\u5212\u53d1\u5e03v0.2\u7248\u672c\uff0c\u8fdb\u4e00\u6b65\u878d\u5408Dubbo\u548cSpringCloud\u751f\u6001",permalink:"/en/blog/chengdu-dubbo"},nextItem:{title:"Nacos \u8fdb\u5165CNCF landscape",permalink:"/en/blog/cncf"}},o={authorsImageUrls:[]},p=[{value:"CMDB\u63d2\u4ef6\u673a\u5236",id:"cmdb\u63d2\u4ef6\u673a\u5236",level:2},{value:"CMDB\u62bd\u8c61\u6982\u5ff5",id:"cmdb\u62bd\u8c61\u6982\u5ff5",level:2},{value:"\u5b9e\u4f53\uff08Entity\uff09",id:"\u5b9e\u4f53entity",level:3},{value:"\u5b9e\u4f53\u7c7b\u578b\uff08Entity Type\uff09",id:"\u5b9e\u4f53\u7c7b\u578bentity-type",level:3},{value:"\u6807\u7b7e\uff08Label\uff09",id:"\u6807\u7b7elabel",level:3},{value:"\u5b9e\u4f53\u4e8b\u4ef6\uff08Entity Event\uff09",id:"\u5b9e\u4f53\u4e8b\u4ef6entity-event",level:3},{value:"CMDB\u7ea6\u5b9a\u63a5\u53e3",id:"cmdb\u7ea6\u5b9a\u63a5\u53e3",level:2},{value:"\u83b7\u53d6\u6807\u7b7e\u5217\u8868",id:"\u83b7\u53d6\u6807\u7b7e\u5217\u8868",level:3},{value:"\u83b7\u53d6\u5b9e\u4f53\u7c7b\u578b",id:"\u83b7\u53d6\u5b9e\u4f53\u7c7b\u578b",level:3},{value:"\u83b7\u53d6\u6807\u7b7e\u8be6\u60c5",id:"\u83b7\u53d6\u6807\u7b7e\u8be6\u60c5",level:3},{value:"\u67e5\u8be2\u5b9e\u4f53\u7684\u6807\u7b7e\u503c",id:"\u67e5\u8be2\u5b9e\u4f53\u7684\u6807\u7b7e\u503c",level:3},{value:"\u67e5\u8be2\u5b9e\u4f53",id:"\u67e5\u8be2\u5b9e\u4f53",level:3},{value:"\u67e5\u8be2\u5b9e\u4f53\u4e8b\u4ef6",id:"\u67e5\u8be2\u5b9e\u4f53\u4e8b\u4ef6",level:3},{value:"CMDB\u63d2\u4ef6\u5f00\u53d1\u6d41\u7a0b",id:"cmdb\u63d2\u4ef6\u5f00\u53d1\u6d41\u7a0b",level:2},{value:"\u4f7f\u7528Selector\u5b9e\u73b0\u540c\u673a\u623f\u4f18\u5148\u8bbf\u95ee",id:"\u4f7f\u7528selector\u5b9e\u73b0\u540c\u673a\u623f\u4f18\u5148\u8bbf\u95ee",level:2}],s={toc:p},u="wrapper";function m(e){let{components:t,...a}=e;return(0,l.kt)(u,(0,n.Z)({},s,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"CMDB\u5728\u4f01\u4e1a\u4e2d\uff0c\u4e00\u822c\u7528\u4e8e\u5b58\u653e\u4e0e\u673a\u5668\u8bbe\u5907\u3001\u5e94\u7528\u3001\u670d\u52a1\u7b49\u76f8\u5173\u7684\u5143\u6570\u636e\u3002\u4e00\u822c\u5f53\u4f01\u4e1a\u7684\u673a\u5668\u53ca\u5e94\u7528\u8fbe\u5230\u4e00\u5b9a\u89c4\u6a21\u540e\u5c31\u9700\u8981\u8fd9\u6837\u4e00\u4e2a\u7cfb\u7edf\u6765\u5b58\u50a8\u548c\u7ba1\u7406\u5b83\u4eec\u7684\u5143\u6570\u636e\u3002\u6709\u4e00\u4e9b\u5e7f\u6cdb\u4f7f\u7528\u7684\u5c5e\u6027\u4f8b\u5982\u673a\u5668\u7684IP\u3001\u4e3b\u673a\u540d\u3001\u673a\u623f\u3001\u5e94\u7528\u3001region\u7b49\uff0c\u8fd9\u4e9b\u6570\u636e\u4e00\u822c\u4f1a\u5728\u673a\u5668\u90e8\u7f72\u65f6\u5f55\u5165\u5230CMDB\uff0c\u8fd0\u7ef4\u6216\u8005\u76d1\u63a7\u5e73\u53f0\u4f1a\u4f7f\u7528\u8fd9\u4e9b\u6570\u636e\u8fdb\u884c\u5c55\u793a\u6216\u8005\u76f8\u5173\u7684\u8fd0\u7ef4\u64cd\u4f5c\u3002"),(0,l.kt)("p",null,"\u5728\u670d\u52a1\u8fdb\u884c\u591a\u673a\u623f\u6216\u8005\u591a\u5730\u57df\u90e8\u7f72\u65f6\uff0c\u8de8\u5730\u57df\u7684\u670d\u52a1\u8bbf\u95ee\u5f80\u5f80\u5ef6\u8fdf\u8f83\u9ad8\uff0c\u4e00\u4e2a\u57ce\u5e02\u5185\u7684\u673a\u623f\u95f4\u7684\u5178\u578b\u7f51\u7edc\u5ef6\u8fdf\u57281ms\u5de6\u53f3\uff0c\u800c\u8de8\u57ce\u5e02\u7684\u7f51\u7edc\u5ef6\u8fdf\uff0c\u4f8b\u5982\u4e0a\u6d77\u5230\u5317\u4eac\u5927\u6982\u4e3a30ms\u3002\u6b64\u65f6\u81ea\u7136\u800c\u7136\u7684\u4e00\u4e2a\u60f3\u6cd5\u5c31\u662f\u80fd\u4e0d\u80fd\u8ba9\u670d\u52a1\u6d88\u8d39\u8005\u548c\u670d\u52a1\u63d0\u4f9b\u8005\u8fdb\u884c\u540c\u5730\u57df\u8bbf\u95ee\u3002\u963f\u91cc\u5df4\u5df4\u96c6\u56e2\u5185\u90e8\u5f88\u65e9\u5c31\u610f\u8bc6\u5230\u4e86\u8fd9\u6837\u7684\u9700\u6c42\uff0c\u5728\u5185\u90e8\u7684\u5b9e\u8df5\u4e2d\uff0c\u8fd9\u6837\u7684\u9700\u6c42\u662f\u901a\u8fc7\u548cCMDB\u6253\u901a\u6765\u5b9e\u73b0\u7684\u3002\u5728\u670d\u52a1\u53d1\u73b0\u7ec4\u4ef6\u4e2d\uff0c\u5bf9\u63a5CMDB\uff0c\u7136\u540e\u901a\u8fc7\u914d\u7f6e\u7684\u8bbf\u95ee\u89c4\u5219\uff0c\u6765\u5b9e\u73b0\u670d\u52a1\u6d88\u8d39\u8005\u5230\u670d\u52a1\u63d0\u4f9b\u8005\u7684\u540c\u5730\u57df\u4f18\u5148\uff0c\u8fd9\u6837\u7684\u8c03\u7528\u6bcf\u5929\u90fd\u5728\u963f\u91cc\u5df4\u5df4\u96c6\u56e2\u5185\u90e8\u5927\u91cf\u6267\u884c\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/png/15356/1544702277705-0bbfca60-6629-477c-92bb-1a690e68f9cd.png#align=left&display=inline&height=330&originHeight=330&originWidth=448&status=done&width=448",alt:null}),(0,l.kt)("br",null),"\u56fe1 \u670d\u52a1\u7684\u540c\u5730\u57df\u4f18\u5148\u8bbf\u95ee"),(0,l.kt)("p",null,"\u8fd9\u5b9e\u9645\u4e0a\u5c31\u662f\u4e00\u79cd\u8d1f\u8f7d\u5747\u8861\u7b56\u7565\uff0c\u5728Nacos\u7684\u89c4\u5212\u4e2d\uff0c\u4e30\u5bcc\u7684\u670d\u52a1\u7aef\u7684\u53ef\u914d\u7f6e\u8d1f\u8f7d\u5747\u8861\u7b56\u7565\u662f\u6211\u4eec\u7684\u91cd\u8981\u53d1\u5c55\u65b9\u5411\uff0c\u8fd9\u4e0e\u5f53\u524d\u5df2\u6709\u7684\u6ce8\u518c\u4e2d\u5fc3\u4ea7\u54c1\u4e0d\u592a\u4e00\u6837\u3002\u5728\u8bbe\u8ba1\u5982\u4f55\u5728\u5f00\u6e90\u7684\u573a\u666f\u4e2d\uff0c\u652f\u6301\u5c31\u8fd1\u8bbf\u95ee\u7684\u65f6\u5019\uff0c\u4e0e\u4f01\u4e1a\u81ea\u5e26\u7684CMDB\u96c6\u6210\u662f\u6211\u4eec\u8003\u8651\u7684\u4e00\u4e2a\u6838\u5fc3\u95ee\u9898\u3002\u9664\u6b64\u4e4b\u5916\uff0c\u6211\u4eec\u4e5f\u5728\u8003\u8651\u5c06Nacos\u81ea\u8eab\u6269\u5c55\u4e3a\u4e00\u4e2a\u5b9e\u73b0\u57fa\u7840\u529f\u80fd\u7684CMDB\u3002\u65e0\u8bba\u5982\u4f55\uff0c\u6211\u4eec\u90fd\u9700\u8981\u80fd\u591f\u4ece\u67d0\u4e2a\u5730\u65b9\u83b7\u53d6IP\u7684\u73af\u5883\u4fe1\u606f\uff0c\u8fd9\u4e9b\u4fe1\u606f\u8981\u4e48\u662f\u4ece\u4f01\u4e1a\u7684CMDB\u4e2d\u67e5\u8be2\u800c\u6765\uff0c\u8981\u4e48\u662f\u4ece\u81ea\u5df1\u5185\u7f6e\u7684\u5b58\u50a8\u4e2d\u67e5\u8be2\u800c\u6765\u3002"),(0,l.kt)("a",{name:"pwyxgn"}),(0,l.kt)("h2",{id:"cmdb\u63d2\u4ef6\u673a\u5236"},(0,l.kt)("a",{parentName:"h2",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#pwyxgn"}),"CMDB\u63d2\u4ef6\u673a\u5236"),(0,l.kt)("p",null,"\u5148\u4e0d\u8003\u8651\u5982\u4f55\u5c06CMDB\u7684\u6570\u636e\u5e94\u7528\u4e8e\u8d1f\u8f7d\u5747\u8861\uff0c\u6211\u4eec\u9700\u8981\u9996\u5148\u5728Nacos\u91cc\u5c06CMDB\u7684\u6570\u636e\u901a\u8fc7\u67d0\u79cd\u65b9\u6cd5\u83b7\u53d6\u3002\u5728\u5b9e\u9645\u4f7f\u7528\u4e2d\uff0c\u57fa\u672c\u4e0a\u6bcf\u4e2a\u516c\u53f8\u90fd\u4f1a\u901a\u8fc7\u8d2d\u4e70\u6216\u8005\u81ea\u7814\u642d\u5efa\u81ea\u5df1\u7684CMDB\uff0c\u90a3\u4e48\u4e3a\u4e86\u80fd\u591f\u89e3\u8026\u5404\u4e2a\u4f01\u4e1a\u7684CMDB\u5177\u4f53\u5b9e\u73b0\uff0c\u4e00\u4e2a\u6bd4\u8f83\u597d\u7684\u7b56\u7565\u662f\u4f7f\u7528SPI\u673a\u5236\uff0c\u7ea6\u5b9aCMDB\u7684\u62bd\u8c61\u8c03\u7528\u63a5\u53e3\uff0c\u7531\u5404\u4e2a\u4f01\u4e1a\u6dfb\u52a0\u81ea\u5df1\u7684CMDB\u63d2\u4ef6\uff0c\u65e0\u9700\u4efb\u4f55\u4ee3\u7801\u4e0a\u7684\u91cd\u65b0\u6784\u5efa\uff0c\u5373\u53ef\u5728\u8fd0\u884c\u72b6\u6001\u4e0b\u5bf9\u63a5\u4e0a\u4f01\u4e1a\u7684CMDB\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/png/15356/1544842539697-cca20e3d-0f78-45b8-92b9-3b7559e838b2.png#align=left&display=inline&height=394&originHeight=394&originWidth=295&status=done&width=295",alt:null}),(0,l.kt)("br",null),"\u56fe2 Nacos CMDB SPI\u673a\u5236\u539f\u7406"),(0,l.kt)("p",null,"\u5982\u56fe2\u6240\u793a\uff0cNacos\u5b9a\u4e49\u4e86\u4e00\u4e2aSPI\u63a5\u53e3\uff0c\u91cc\u9762\u5305\u542b\u4e86\u4e0e\u7b2c\u4e09\u65b9CMDB\u7ea6\u5b9a\u7684\u4e00\u4e9b\u65b9\u6cd5\u3002\u7528\u6237\u4f9d\u7167\u7ea6\u5b9a\u5b9e\u73b0\u4e86\u76f8\u5e94\u7684SPI\u63a5\u53e3\u540e\uff0c\u5c06\u5b9e\u73b0\u6253\u6210jar\u5305\u653e\u7f6e\u5230Nacos\u5b89\u88c5\u76ee\u5f55\u4e0b\uff0c\u91cd\u542fNacos\u5373\u53ef\u8ba9Nacos\u4e0eCMDB\u7684\u6570\u636e\u6253\u901a\u3002\u6574\u4e2a\u6d41\u7a0b\u5e76\u4e0d\u590d\u6742\uff0c\u4f46\u662f\u7406\u89e3CMDB SPI\u63a5\u53e3\u91cc\u65b9\u6cd5\u548c\u76f8\u5e94\u6982\u5ff5\u7684\u542b\u4e49\u4e0d\u592a\u7b80\u5355\u3002\u5728\u8fd9\u91cc\u5bf9CMDB\u673a\u5236\u7684\u76f8\u5173\u6982\u5ff5\u548c\u63a5\u53e3\u542b\u4e49\u505a\u4e00\u4e2a\u8be6\u7ec6\u8bf4\u660e\u3002"),(0,l.kt)("a",{name:"ga38al"}),(0,l.kt)("h2",{id:"cmdb\u62bd\u8c61\u6982\u5ff5"},(0,l.kt)("a",{parentName:"h2",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#ga38al"}),"CMDB\u62bd\u8c61\u6982\u5ff5"),(0,l.kt)("a",{name:"d1gdtg"}),(0,l.kt)("h3",{id:"\u5b9e\u4f53entity"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#d1gdtg"}),"\u5b9e\u4f53\uff08Entity\uff09"),(0,l.kt)("p",null,"\u5b9e\u4f53\u662f\u4f5c\u4e3aCMDB\u91cc\u6570\u636e\u7684\u627f\u8f7d\u65b9\uff0c\u5728\u4e00\u822c\u7684CMDB\u4e2d\uff0c\u4e00\u4e2a\u5b9e\u4f53\u53ef\u4ee5\u6307\u4e00\u4e2aIP\u3001\u5e94\u7528\u6216\u8005\u670d\u52a1\u3002\u800c\u8fd9\u4e2a\u5b9e\u4f53\u4f1a\u6709\u5f88\u591a\u5c5e\u6027\uff0c\u4f8b\u5982IP\u7684\u673a\u623f\u4fe1\u606f\uff0c\u670d\u52a1\u7684\u7248\u672c\u4fe1\u606f\u7b49\u3002"),(0,l.kt)("a",{name:"hig8ag"}),(0,l.kt)("h3",{id:"\u5b9e\u4f53\u7c7b\u578bentity-type"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#hig8ag"}),"\u5b9e\u4f53\u7c7b\u578b\uff08Entity Type\uff09"),(0,l.kt)("p",null,"\u6211\u4eec\u5e76\u4e0d\u9650\u5b9a\u5b9e\u4f53\u4e00\u5b9a\u662fIP\u3001\u5e94\u7528\u6216\u8005\u670d\u52a1\uff0c\u8fd9\u53d6\u51b3\u4e8e\u5b9e\u9645\u7684\u4e1a\u52a1\u573a\u666f\u3002Nacos\u6709\u8ba1\u5212\u5728\u672a\u6765\u652f\u6301\u4e0d\u540c\u7684\u5b9e\u4f53\u7c7b\u578b\uff0c\u4e0d\u8fc7\u5c31\u76ee\u524d\u6765\u8bf4\uff0c\u670d\u52a1\u53d1\u73b0\u9700\u8981\u7684\u5b9e\u4f53\u7c7b\u578b\u662fIP\u3002"),(0,l.kt)("a",{name:"bm37ew"}),(0,l.kt)("h3",{id:"\u6807\u7b7elabel"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#bm37ew"}),"\u6807\u7b7e\uff08Label\uff09"),(0,l.kt)("p",null,"Label\u662f\u6211\u4eec\u62bd\u8c61\u51fa\u7684Entity\u5c5e\u6027\uff0cLabel\u5b9a\u4e49\u4e3a\u4e00\u4e2a\u63cf\u8ff0Entity\u5c5e\u6027\u7684K-V\u952e\u503c\u5bf9\u3002Label\u7684key\u548cvalue\u7684\u53d6\u503c\u8303\u56f4\u4e00\u822c\u90fd\u662f\u9884\u5148\u5b9a\u4e49\u597d\u7684\uff0c\u5f53\u9700\u8981\u5bf9Label\u8fdb\u884c\u53d8\u66f4\uff0c\u5982\u589e\u52a0\u65b0\u7684key\u6216\u8005value\u65f6\uff0c\u9700\u8981\u8c03\u7528\u5355\u72ec\u7684\u63a5\u53e3\u5e76\u89e6\u53d1\u76f8\u5e94\u7684\u4e8b\u4ef6\u3002\u4e00\u4e2a\u5e38\u89c1\u7684Label\u7684\u4f8b\u5b50\u662fIP\u7684\u673a\u623f\u4fe1\u606f\uff0c\u6211\u4eec\u8ba4\u4e3a\u673a\u623f\uff08site\uff09\u662fLabel\u7684key\uff0c\u800c\u673a\u623f\u7684\u96c6\u5408\uff08site1, site2, site3\uff09\u662fLabel\u7684value\uff0c\u8fd9\u4e2aLabel\u7684\u5b9a\u4e49\u5c31\u662f\uff1asite: {site1, site2, site3}\u3002"),(0,l.kt)("a",{name:"1osqbb"}),(0,l.kt)("h3",{id:"\u5b9e\u4f53\u4e8b\u4ef6entity-event"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#1osqbb"}),"\u5b9e\u4f53\u4e8b\u4ef6\uff08Entity Event\uff09"),(0,l.kt)("p",null,"\u5b9e\u4f53\u7684\u6807\u7b7e\u7684\u53d8\u66f4\u4e8b\u4ef6\u3002\u5f53CMDB\u7684\u5b9e\u4f53\u5c5e\u6027\u53d1\u751f\u53d8\u5316\uff0c\u9700\u8981\u6709\u4e00\u4e2a\u4e8b\u4ef6\u673a\u5236\u6765\u901a\u77e5\u6240\u6709\u8ba2\u9605\u65b9\u3002\u4e3a\u4e86\u4fdd\u8bc1\u5b9e\u4f53\u4e8b\u4ef6\u643a\u5e26\u7684\u53d8\u66f4\u4fe1\u606f\u662f\u6700\u65b0\u51c6\u786e\u7684\uff0c\u8fd9\u4e2a\u4e8b\u4ef6\u91cc\u53ea\u4f1a\u5305\u542b\u53d8\u66f4\u7684\u5b9e\u4f53\u7684\u6807\u8bc6\u4ee5\u53ca\u53d8\u66f4\u4e8b\u4ef6\u7684\u7c7b\u578b\uff0c\u4e0d\u4f1a\u5305\u542b\u53d8\u66f4\u7684\u6807\u7b7e\u7684\u503c\u3002"),(0,l.kt)("a",{name:"3vu8pv"}),(0,l.kt)("h2",{id:"cmdb\u7ea6\u5b9a\u63a5\u53e3"},(0,l.kt)("a",{parentName:"h2",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#3vu8pv"}),"CMDB\u7ea6\u5b9a\u63a5\u53e3"),(0,l.kt)("p",null,"\u5728\u8bbe\u8ba1\u4e0eCMDB\u4ea4\u4e92\u63a5\u53e3\u7684\u65f6\u5019\uff0c\u6211\u4eec\u53c2\u8003\u4e86\u5185\u90e8\u5bf9CMDB\u7684\u8bbf\u95ee\u63a5\u53e3\uff0c\u5e76\u4e0e\u82e5\u5e72\u4e2a\u5916\u90e8\u5ba2\u6237\u8fdb\u884c\u4e86\u8ba8\u8bba\u3002\u6211\u4eec\u6700\u7ec8\u786e\u5b9a\u4e86\u4ee5\u4e0b\u8981\u6c42\u7b2c\u4e09\u65b9CMDB\u63d2\u4ef6\u5fc5\u987b\u5b9e\u73b0\u7684\u63a5\u53e3\uff1a"),(0,l.kt)("a",{name:"hc8tsu"}),(0,l.kt)("h3",{id:"\u83b7\u53d6\u6807\u7b7e\u5217\u8868"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#hc8tsu"}),"\u83b7\u53d6\u6807\u7b7e\u5217\u8868"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"Set<String> getLabelNames();\n")),(0,l.kt)("p",null,"\u8fd9\u4e2a\u65b9\u6cd5\u5c06\u8fd4\u56deCMDB\u4e2d\u9700\u8981\u88abNacos\u8bc6\u522b\u7684\u6807\u7b7e\u540d\u96c6\u5408\uff0cCMDB\u63d2\u4ef6\u53ef\u4ee5\u6309\u9700\u51b3\u5b9a\u8fd4\u56de\u4ec0\u4e48\u6807\u7b7e\u4e2aNacos\u3002\u4e0d\u5728\u8fd9\u4e2a\u96c6\u5408\u7684\u6807\u7b7e\u5c06\u4f1a\u88abNacos\u5ffd\u7565\uff0c\u5373\u4f7f\u8fd9\u4e2a\u6807\u7b7e\u51fa\u73b0\u5728\u5b9e\u4f53\u7684\u5c5e\u6027\u91cc\u3002\u6211\u4eec\u5141\u8bb8\u8fd9\u4e2a\u96c6\u5408\u4f1a\u5728\u8fd0\u884c\u65f6\u52a8\u6001\u53d8\u5316\uff0cNacos\u4f1a\u5b9a\u65f6\u53bb\u8c03\u7528\u8fd9\u4e2a\u63a5\u53e3\u5237\u65b0\u6807\u7b7e\u96c6\u5408\u3002"),(0,l.kt)("a",{name:"2v2vks"}),(0,l.kt)("h3",{id:"\u83b7\u53d6\u5b9e\u4f53\u7c7b\u578b"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#2v2vks"}),"\u83b7\u53d6\u5b9e\u4f53\u7c7b\u578b"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"Set<String> getEntityTypes();\n")),(0,l.kt)("p",null,"\u83b7\u53d6CMDB\u91cc\u7684\u5b9e\u4f53\u7684\u7c7b\u578b\u96c6\u5408\uff0c\u4e0d\u5728\u8fd9\u4e2a\u96c6\u5408\u7684\u5b9e\u4f53\u7c7b\u578b\u4f1a\u88abNacos\u5ffd\u7565\u3002\u670d\u52a1\u53d1\u73b0\u6a21\u5757\u76ee\u524d\u9700\u8981\u7684\u5b9e\u4f53\u7c7b\u4f3c\u662fip\uff0c\u5982\u679c\u60f3\u8981\u901a\u8fc7\u6253\u901aCMDB\u6570\u636e\u6765\u5b9e\u73b0\u670d\u52a1\u7684\u9ad8\u7ea7\u8d1f\u8f7d\u5747\u8861\uff0c\u8bf7\u52a1\u5fc5\u5728\u8fd4\u56de\u96c6\u5408\u91cc\u5305\u542b\u201cip\u201d\u3002"),(0,l.kt)("a",{name:"sw9ryi"}),(0,l.kt)("h3",{id:"\u83b7\u53d6\u6807\u7b7e\u8be6\u60c5"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#sw9ryi"}),"\u83b7\u53d6\u6807\u7b7e\u8be6\u60c5"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"Label getLabel(String labelName);\n")),(0,l.kt)("p",null,"\u83b7\u53d6\u6807\u7b7e\u7684\u8be6\u7ec6\u4fe1\u606f\u3002\u8fd4\u56de\u7684Label\u7c7b\u91cc\u5305\u542b\u6807\u7b7e\u7684\u540d\u5b57\u548c\u6807\u7b7e\u503c\u7684\u96c6\u5408\u3002\u5982\u679c\u67d0\u4e2a\u5b9e\u4f53\u7684\u8fd9\u4e2a\u6807\u7b7e\u7684\u503c\u4e0d\u5728\u6807\u7b7e\u503c\u96c6\u5408\u91cc\uff0c\u5c06\u4f1a\u88ab\u89c6\u4e3a\u65e0\u6548\u3002"),(0,l.kt)("a",{name:"va70wg"}),(0,l.kt)("h3",{id:"\u67e5\u8be2\u5b9e\u4f53\u7684\u6807\u7b7e\u503c"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#va70wg"}),"\u67e5\u8be2\u5b9e\u4f53\u7684\u6807\u7b7e\u503c"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"String getLabelValue(String entityName, String entityType, String labelName);\nString getLabelValues(String entityName, String entityType);\n")),(0,l.kt)("p",null,"\u8fd9\u91cc\u5305\u542b\u4e24\u4e2a\u65b9\u6cd5\uff0c\u4e00\u4e2a\u662f\u83b7\u53d6\u5b9e\u4f53\u67d0\u4e00\u4e2a\u6807\u7b7e\u540d\u5bf9\u5e94\u7684\u503c\uff0c\u4e00\u4e2a\u662f\u83b7\u53d6\u5b9e\u4f53\u6240\u6709\u6807\u7b7e\u7684\u952e\u503c\u5bf9\u3002\u53c2\u6570\u91cc\u5305\u542b\u5b9e\u4f53\u7684\u503c\u548c\u5b9e\u4f53\u7684\u7c7b\u578b\u3002\u6ce8\u610f\uff0c\u8fd9\u4e2a\u65b9\u6cd5\u5e76\u4e0d\u4f1a\u5728\u6bcf\u6b21\u5728Nacos\u5185\u90e8\u89e6\u53d1\u67e5\u8be2\u65f6\u53bb\u8c03\u7528\uff0cNacos\u5185\u90e8\u6709\u4e00\u4e2aCMDB\u6570\u636e\u7684\u7f13\u5b58\uff0c\u53ea\u6709\u5f53\u8fd9\u4e2a\u7f13\u5b58\u5931\u6548\u6216\u8005\u4e0d\u5b58\u5728\u65f6\uff0c\u624d\u4f1a\u53bb\u8bbf\u95eeCMDB\u63d2\u4ef6\u67e5\u8be2\u6570\u636e\u3002\u4e3a\u4e86\u8ba9CMDB\u63d2\u4ef6\u7684\u5b9e\u73b0\u5c3d\u91cf\u7b80\u5355\uff0c\u6211\u4eec\u5728Nacos\u5185\u90e8\u5b9e\u73b0\u4e86\u76f8\u5e94\u7684\u7f13\u5b58\u548c\u5237\u65b0\u903b\u8f91\u3002"),(0,l.kt)("a",{name:"byohax"}),(0,l.kt)("h3",{id:"\u67e5\u8be2\u5b9e\u4f53"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#byohax"}),"\u67e5\u8be2\u5b9e\u4f53"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"String getAllEntities();\nEntity getEntity(String entityName, String entityType);\n")),(0,l.kt)("p",null,"\u67e5\u8be2\u5b9e\u4f53\u5305\u542b\u4e24\u4e2a\u65b9\u6cd5\uff1a\u67e5\u8be2\u6240\u6709\u5b9e\u4f53\u548c\u67e5\u8be2\u5355\u4e2a\u5b9e\u4f53\u3002\u67e5\u8be2\u5355\u4e2a\u5b9e\u4f53\u76ee\u524d\u5176\u5b9e\u5c31\u662f\u67e5\u8be2\u8fd9\u4e2a\u5b9e\u4f53\u7684\u6240\u6709\u6807\u7b7e\uff0c\u4e0d\u8fc7\u6211\u4eec\u5c06\u8fd9\u4e2a\u65b9\u6cd5\u4e0e\u83b7\u53d6\u6240\u6709\u6807\u7b7e\u7684\u65b9\u6cd5\u533a\u5206\u5f00\u6765\uff0c\u56e0\u4e3a\u67e5\u8be2\u5355\u4e2a\u5b9e\u4f53\u65b9\u6cd5\u540e\u9762\u53ef\u80fd\u4f1a\u8fdb\u884c\u6269\u5c55\uff0c\u6bd4\u67e5\u8be2\u6240\u6709\u6807\u7b7e\u83b7\u53d6\u7684\u4fe1\u606f\u8981\u66f4\u591a\u3002"),(0,l.kt)("p",null,"\u67e5\u8be2\u6240\u6709\u5b9e\u4f53\u5219\u662f\u4e00\u6b21\u6027\u5c06CMDB\u7684\u6240\u6709\u6570\u636e\u62c9\u53d6\u8fc7\u6765\uff0c\u8be5\u65b9\u6cd5\u53ef\u80fd\u4f1a\u6bd4\u8f83\u6d88\u8017\u6027\u80fd\uff0c\u65e0\u8bba\u662f\u5bf9\u4e8eNacos\u8fd8\u662fCMDB\u3002Nacos\u5185\u90e8\u8c03\u7528\u8be5\u65b9\u6cd5\u7684\u7b56\u7565\u662f\u901a\u8fc7\u53ef\u914d\u7f6e\u7684\u5b9a\u65f6\u4efb\u52a1\u5468\u671f\u6765\u5b9a\u65f6\u62c9\u53d6\u6240\u6709\u6570\u636e\uff0c\u5728\u5b9e\u73b0\u8be5CMDB\u63d2\u4ef6\u65f6\uff0c\u4e5f\u8bf7\u5173\u6ce8CMDB\u670d\u52a1\u672c\u8eab\u7684\u6027\u80fd\uff0c\u91c7\u53d6\u5408\u9002\u7684\u7b56\u7565\u3002"),(0,l.kt)("a",{name:"tgn5ut"}),(0,l.kt)("h3",{id:"\u67e5\u8be2\u5b9e\u4f53\u4e8b\u4ef6"},(0,l.kt)("a",{parentName:"h3",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#tgn5ut"}),"\u67e5\u8be2\u5b9e\u4f53\u4e8b\u4ef6"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"List<EntityEvent> getEntityEvents(long timestamp);\n")),(0,l.kt)("p",null,"\u8fd9\u4e2a\u65b9\u6cd5\u610f\u5728\u83b7\u53d6\u6700\u8fd1\u4e00\u6bb5\u65f6\u95f4\u5185\u5b9e\u4f53\u7684\u53d8\u66f4\u6d88\u606f\uff0c\u589e\u91cf\u7684\u53bb\u62c9\u53d6\u53d8\u66f4\u7684\u5b9e\u4f53\u3002\u56e0\u4e3aNacos\u4e0d\u4f1a\u5b9e\u65f6\u53bb\u8bbf\u95eeCMDB\u63d2\u4ef6\u67e5\u8be2\u5b9e\u4f53\uff0c\u9700\u8981\u8fd9\u4e2a\u62c9\u53d6\u4e8b\u4ef6\u7684\u65b9\u6cd5\u6765\u83b7\u53d6\u5b9e\u4f53\u7684\u66f4\u65b0\u3002\u53c2\u6570\u91cc\u7684timestamp\u4e3a\u4e0a\u4e00\u6b21\u62c9\u53d6\u4e8b\u4ef6\u7684\u65f6\u95f4\uff0cCMDB\u63d2\u4ef6\u53ef\u4ee5\u9009\u62e9\u4f7f\u7528\u6216\u8005\u5ffd\u7565\u8fd9\u4e2a\u53c2\u6570\u3002"),(0,l.kt)("a",{name:"p7g6dw"}),(0,l.kt)("h2",{id:"cmdb\u63d2\u4ef6\u5f00\u53d1\u6d41\u7a0b"},(0,l.kt)("a",{parentName:"h2",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#p7g6dw"}),"CMDB\u63d2\u4ef6\u5f00\u53d1\u6d41\u7a0b"),(0,l.kt)("p",null,"\u53c2\u8003\xa0",(0,l.kt)("a",{parentName:"p",href:"https://github.com/nacos-group/nacos-examples"},"https://github.com/nacos-group/nacos-examples"),"\uff0c\u8fd9\u91cc\u5df2\u7ecf\u7ed9\u51fa\u4e86\u4e00\u4e2a\u793a\u4f8bplugin\u5b9e\u73b0\u3002",(0,l.kt)("br",null),"\u5177\u4f53\u6b65\u9aa4\u5982\u4e0b\uff1a"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u65b0\u5efa\u4e00\u4e2amaven\u5de5\u7a0b\uff0c\u5f15\u5165\u4f9d\u8d56nacos-api:")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"<dependency>\n            <groupId>com.alibaba.nacos</groupId>\n            <artifactId>nacos-api</artifactId>\n            <version>0.7.0</version>\n        </dependency>\n")),(0,l.kt)("ol",{start:2},(0,l.kt)("li",{parentName:"ol"},"\u5f15\u5165\u6253\u5305\u63d2\u4ef6\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"<plugin>\n                <groupId>org.apache.maven.plugins</groupId>\n                <artifactId>maven-assembly-plugin</artifactId>\n                <configuration>\n                    <descriptorRefs>\n                        <descriptorRef>jar-with-dependencies</descriptorRef>\n                    </descriptorRefs>\n                </configuration>\n            </plugin>\n")),(0,l.kt)("ol",{start:3},(0,l.kt)("li",{parentName:"ol"},"\u5b9a\u4e49\u5b9e\u73b0\u7c7b\uff0c\u7ee7\u627fcom.alibaba.nacos.api.cmdb.CmdbService\uff0c\u5e76\u5b9e\u73b0\u76f8\u5173\u65b9\u6cd5\u3002",(0,l.kt)("br",null),(0,l.kt)("img",{parentName:"li",src:"https://cdn.nlark.com/lark/0/2018/png/15356/1543916500193-213df77a-096d-4fd9-a283-85241a856fbf.png#align=left&display=inline&height=116&originHeight=116&originWidth=585&status=done&width=585",alt:null}),(0,l.kt)("br",null)),(0,l.kt)("li",{parentName:"ol"},"\u5728src/main/resource/\u76ee\u5f55\u4e0b\u65b0\u5efa\u76ee\u5f55\uff1aMETA-INF/services",(0,l.kt)("br",null),(0,l.kt)("img",{parentName:"li",src:"https://cdn.nlark.com/lark/0/2018/png/15356/1543916595978-fd322205-16c1-4a95-9cdc-4a6292ee3b66.png#align=left&display=inline&height=96&originHeight=96&originWidth=379&status=done&width=379",alt:null}),(0,l.kt)("br",null)),(0,l.kt)("li",{parentName:"ol"},"\u5728src/main/resources/META-INF/services\u76ee\u5f55\u4e0b\u65b0\u5efa\u6587\u4ef6com.alibaba.nacos.api.cmdb.CmdbService\uff0c\u5e76\u5728\u6587\u4ef6\u91cc\u5c06\u7b2c\u4e09\u6b65\u4e2d\u521b\u5efa\u7684\u5b9e\u73b0\u7c7b\u5168\u540d\u5199\u5165\u8be5\u6587\u4ef6:",(0,l.kt)("br",null),(0,l.kt)("img",{parentName:"li",src:"https://cdn.nlark.com/lark/0/2018/png/15356/1545036650034-75d11aee-8738-485f-9426-52e560b059cd.png#align=left&display=inline&height=136&originHeight=178&originWidth=944&status=done&width=719",alt:null}),(0,l.kt)("br",null)),(0,l.kt)("li",{parentName:"ol"},"\u4ee3\u7801\u81ea\u6d4b\u5b8c\u6210\u540e\uff0c\u6267\u884c\u547d\u4ee4\u8fdb\u884c\u6253\u5305\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"mvn package assembly:single -Dmaven.test.skip=true\n")),(0,l.kt)("ol",{start:7},(0,l.kt)("li",{parentName:"ol"},"\u5c06target\u76ee\u5f55\u4e0b\u7684\u5305\u542b\u4f9d\u8d56\u7684jar\u5305\u4e0a\u4f20\u5230nacos CMDB\u63d2\u4ef6\u76ee\u5f55\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"{nacos.home}/plugins/cmdb\n")),(0,l.kt)("ol",{start:8},(0,l.kt)("li",{parentName:"ol"},"\u5728nacos\u7684application.properties\u91cc\u6253\u5f00\u52a0\u8f7d\u63d2\u4ef6\u5f00\u5173\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"nacos.cmdb.loadDataAtStart=true\n")),(0,l.kt)("ol",{start:9},(0,l.kt)("li",{parentName:"ol"},"\u91cd\u542fnacos Server\uff0c\u5373\u53ef\u52a0\u8f7d\u5230\u60a8\u5b9e\u73b0\u7684nacos-cmdb\u63d2\u4ef6\u83b7\u53d6\u60a8\u7684CMDB\u6570\u636e\u3002",(0,l.kt)("br",null))),(0,l.kt)("a",{name:"5mpctx"}),(0,l.kt)("h2",{id:"\u4f7f\u7528selector\u5b9e\u73b0\u540c\u673a\u623f\u4f18\u5148\u8bbf\u95ee"},(0,l.kt)("a",{parentName:"h2",href:"https://yuque.alibaba-inc.com/nacos/opensource/uk8inc/edit#5mpctx"}),"\u4f7f\u7528Selector\u5b9e\u73b0\u540c\u673a\u623f\u4f18\u5148\u8bbf\u95ee"),(0,l.kt)("p",null,"\u5728\u62ff\u5230CMDB\u7684\u6570\u636e\u4e4b\u540e\uff0c\u5c31\u53ef\u4ee5\u8fd0\u7528CMDB\u6570\u636e\u7684\u5f3a\u5927\u5a01\u529b\u6765\u5b9e\u73b0\u591a\u79cd\u7075\u6d3b\u7684\u8d1f\u8f7d\u5747\u8861\u7b56\u7565\u4e86\uff0c\u4e0b\u9762\u4e3e\u4f8b\u6765\u8bf4\u660e\u5982\u4f55\u4f7f\u7528CMDB\u6570\u636e\u548cSelector\u6765\u5b9e\u73b0\u5c31\u8fd1\u8bbf\u95ee\u3002"),(0,l.kt)("p",null,"\u5047\u8bbe\u76ee\u524dNacos\u5df2\u7ecf\u901a\u8fc7CMDB\u62ff\u5230\u4e86\u4e00\u4e9bIP\u7684\u673a\u623f\u4fe1\u606f\uff0c\u4e14\u5b83\u4eec\u5bf9\u5e94\u7684\u6807\u7b7e\u4fe1\u606f\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"11.11.11.11\n    site: x11\n\n22.22.22.22\n    site: x12\n\n33.33.33.33\n    site: x11\n\n44.44.44.44\n    site: x12\n\n55.55.55.55\n    site: x13\n")),(0,l.kt)("p",null,"11.11.11.11\u300122.22.22.22\u300133.33.33.33\u300144.44.44.44\u548c55.55.55.55.55\u90fd\u5305\u542b\u4e86\u6807\u7b7esite\uff0c\u4e14\u5b83\u4eec\u5bf9\u5e94\u7684\u503c\u5206\u522b\u4e3ax11\u3001x12\u3001x11\u3001x12\u3001x13\u3002\u6211\u4eec\u5148\u6ce8\u518c\u4e00\u4e2a\u670d\u52a1\uff0c\u4e0b\u9762\u6302\u8f7dIP11.11.11.11\u548c22.22.22.22\u3002",(0,l.kt)("br",null),(0,l.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/png/15356/1545035855381-5d9dcfad-75ab-43ad-a084-8ae4a65f914c.png#align=left&display=inline&height=307&originHeight=516&originWidth=1254&status=done&width=747",alt:null}),(0,l.kt)("br",null),"\u56fe3 \u670d\u52a1\u8be6\u60c5"),(0,l.kt)("p",null,"\u7136\u540e\u6211\u4eec\u4fee\u6539\u670d\u52a1\u7684\u201c\u670d\u52a1\u8def\u7531\u7c7b\u578b\u201d\uff0c\u5e76\u914d\u7f6e\u4e3a\u57fa\u4e8e\u540csite\u4f18\u5148\u7684\u670d\u52a1\u8def\u7531\uff1a",(0,l.kt)("br",null),(0,l.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/lark/0/2018/png/15356/1545035973200-497c0649-b652-4c36-bf6c-7cddfc5b75c6.png#align=left&display=inline&height=499&originHeight=499&originWidth=610&status=done&width=610",alt:null}),(0,l.kt)("br",null),"\u56fe4 \u7f16\u8f91\u670d\u52a1\u8def\u7531\u7c7b\u578b"),(0,l.kt)("p",null,"\u8fd9\u91cc\u6211\u4eec\u5c06\u670d\u52a1\u8def\u7531\u7c7b\u578b\u9009\u62e9\u4e3a\u6807\u7b7e\uff0c\u7136\u540e\u8f93\u5165\u6807\u7b7e\u7684\u8868\u8fbe\u5f0f\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"CONSUMER.label.site = PROVIDER.label.site\n")),(0,l.kt)("p",null,"\u8fd9\u4e2a\u8868\u8fbe\u5f0f\u7684\u683c\u5f0f\u548c\u6211\u4eec\u62bd\u8c61\u7684Selector\u673a\u5236\u6709\u5173\uff0c\u5177\u4f53\u5c06\u4f1a\u5728\u53e6\u5916\u4e00\u7bc7\u6587\u7ae0\u4e2d\u4ecb\u7ecd\u3002\u5728\u8fd9\u91cc\u60a8\u9700\u8981\u8bb0\u4f4f\u7684\u5c31\u662f\uff0c\u4efb\u4f55\u4e00\u4e2a\u5982\u4e0b\u683c\u5f0f\u7684\u8868\u8fbe\u5f0f\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"CONSUMER.label.labelName = PROVIDER.label.labelName\n")),(0,l.kt)("p",null,"\u5c06\u80fd\u591f\u5b9e\u73b0\u57fa\u4e8e\u540clabelName\u4f18\u5148\u7684\u8d1f\u8f7d\u5747\u8861\u7b56\u7565\u3002"),(0,l.kt)("p",null,"\u7136\u540e\u5047\u8bbe\u670d\u52a1\u6d88\u8d39\u8005\u7684IP\u5206\u522b\u4e3a33.33.33.33\u300144.44.44.44\u548c55.55.55.55\uff0c\u5b83\u4eec\u5728\u4f7f\u7528\u5982\u4e0b\u63a5\u53e3\u67e5\u8be2\u670d\u52a1\u5b9e\u4f8b\u5217\u8868\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'naming.selectInstances("nacos.test.1", true)\n')),(0,l.kt)("p",null,"\u90a3\u4e48\u4e0d\u540c\u7684\u6d88\u8d39\u8005\uff0c\u5c06\u83b7\u53d6\u5230\u4e0d\u540c\u7684\u5b9e\u4f8b\u5217\u8868\u300233.33.33.33\u83b7\u53d6\u523011.11.11.11\uff0c44.44.44.44\u5c06\u83b7\u53d6\u523022.22.22.22\uff0c\u800c55.55.55.55\u5c06\u540c\u65f6\u83b7\u53d6\u523011.11.11.11\u548c22.22.22.22\u3002"))}m.isMDXComponent=!0}}]);