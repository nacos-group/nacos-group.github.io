"use strict";(self.webpackChunkNacos=self.webpackChunkNacos||[]).push([[2946],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>k});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),s=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(i.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,i=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),u=s(n),d=a,k=u["".concat(i,".").concat(d)]||u[d]||m[d]||l;return n?r.createElement(k,o(o({ref:t},p),{},{components:n})):r.createElement(k,o({ref:t},p))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,o=new Array(l);o[0]=d;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c[u]="string"==typeof e?e:a,o[1]=c;for(var s=2;s<l;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},14982:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>m,frontMatter:()=>l,metadata:()=>c,toc:()=>s});var r=n(87462),a=(n(67294),n(3905));const l={},o="Nacos\u73af\u5883\u9694\u79bb",c={permalink:"/en/blog/address-server",source:"@site/i18n/en/docusaurus-plugin-content-blog/address-server.md",title:"Nacos\u73af\u5883\u9694\u79bb",description:"\u968f\u7740Nacos 0.8\u7248\u672c\u7684release\uff0cNacos\u79bb\u6b63\u5f0f\u751f\u4ea7\u7248\u672c\u53c8\u8fd1\u4e86\u4e00\u6b65\uff08\u5176\u5b9e\u5df2\u7ecf\u6709\u4e0d\u5c11\u4f01\u4e1a\u5df2\u7ecf\u4e0a\u4e86\u751f\u4ea7\uff0c\u5982\u864e\u7259\uff09\u3002\u4e00\u822c\u800c\u8a00\uff0c\u4f01\u4e1a\u7814\u53d1\u7684\u6d41\u7a0b\u4e00\u822c\u662f\u8fd9\u6837\u7684\uff1a\u5148\u5728\u6d4b\u8bd5\u73af\u5883\u5f00\u53d1\u548c\u6d4b\u8bd5\u529f\u80fd\uff0c\u7136\u540e\u518d\u7070\u5ea6\uff0c\u6700\u540e\u53d1\u5e03\u5230\u751f\u4ea7\u73af\u5883\u3002\u5e76\u4e14\uff0c\u4e3a\u4e86\u751f\u4ea7\u73af\u5883\u7684\u7a33\u5b9a\uff0c\u6d4b\u8bd5\u73af\u5883\u9700\u8981\u8ddf\u751f\u4ea7\u73af\u5883\u9694\u79bb\uff1b\u5fc5\u7136\u8981\u9047\u5230\u4e00\u4e2a\u95ee\u9898\uff1a\u591a\u73af\u5883\u95ee\u9898\uff0c\u5373\u591a\u4e2a\u73af\u5883\u7684\u6570\u636e\uff08\u5982\u6d4b\u8bd5\u73af\u5883\u548c\u751f\u4ea7\u73af\u5883\uff09\u5982\u4f55\u9694\u79bb\uff1f\u5982\u4f55\u4f18\u96c5\u7684\u9694\u79bb\uff08\u4e0d\u9700\u8981\u7528\u6237\u505a\u4efb\u4f55\u6539\u52a8\uff09\u3002\u4e0b\u6587\u5c06\u5c31Nacos\u73af\u5883\u9694\u79bb\u95ee\u9898\uff0c\u5411\u5927\u5bb6\u4ecb\u7ecd\u963f\u91cc\u5728\u8fd9\u65b9\u9762\u7684\u5b9e\u8df5\u7ecf\u9a8c\u3002",date:"2023-10-10T11:47:41.000Z",formattedDate:"October 10, 2023",tags:[],readingTime:9.775,hasTruncateMarker:!0,authors:[],frontMatter:{},prevItem:{title:"Nacos\u6743\u9650\u63a7\u5236\u8bbe\u8ba1\u65b9\u6848",permalink:"/en/blog/access control design"},nextItem:{title:"\u963f\u91cc\u5df4\u5df4\u670d\u52a1\u6ce8\u518c\u4e2d\u5fc3\u4ea7\u54c1ConfigServer 10\u5e74\u6280\u672f\u53d1\u5c55\u56de\u987e",permalink:"/en/blog/alibaba-configserver"}},i={authorsImageUrls:[]},s=[{value:"\u4ec0\u4e48\u662f\u73af\u5883\uff1f",id:"\u4ec0\u4e48\u662f\u73af\u5883",level:2},{value:"\u73af\u5883\u9694\u79bb\u6709\u4ec0\u4e48\u7528",id:"\u73af\u5883\u9694\u79bb\u6709\u4ec0\u4e48\u7528",level:2},{value:"\u6545\u969c\u9694\u79bb",id:"\u6545\u969c\u9694\u79bb",level:3},{value:"\u6545\u969c\u6062\u590d",id:"\u6545\u969c\u6062\u590d",level:3},{value:"\u7070\u5ea6\u6d4b\u8bd5",id:"\u7070\u5ea6\u6d4b\u8bd5",level:3},{value:"Nacos\u5982\u4f55\u505a\u73af\u5883\u9694\u79bb",id:"nacos\u5982\u4f55\u505a\u73af\u5883\u9694\u79bb",level:2},{value:"\u4e00\u4e2a\u73af\u5883\u9694\u79bbserver\u7684\u793a\u4f8b",id:"\u4e00\u4e2a\u73af\u5883\u9694\u79bbserver\u7684\u793a\u4f8b",level:2},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],p={toc:s},u="wrapper";function m(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u968f\u7740Nacos 0.8\u7248\u672c\u7684release\uff0cNacos\u79bb\u6b63\u5f0f\u751f\u4ea7\u7248\u672c\u53c8\u8fd1\u4e86\u4e00\u6b65\uff08\u5176\u5b9e\u5df2\u7ecf\u6709\u4e0d\u5c11\u4f01\u4e1a\u5df2\u7ecf\u4e0a\u4e86\u751f\u4ea7\uff0c\u5982\u864e\u7259\uff09\u3002\u4e00\u822c\u800c\u8a00\uff0c\u4f01\u4e1a\u7814\u53d1\u7684\u6d41\u7a0b\u4e00\u822c\u662f\u8fd9\u6837\u7684\uff1a\u5148\u5728\u6d4b\u8bd5\u73af\u5883\u5f00\u53d1\u548c\u6d4b\u8bd5\u529f\u80fd\uff0c\u7136\u540e\u518d\u7070\u5ea6\uff0c\u6700\u540e\u53d1\u5e03\u5230\u751f\u4ea7\u73af\u5883\u3002\u5e76\u4e14\uff0c\u4e3a\u4e86\u751f\u4ea7\u73af\u5883\u7684\u7a33\u5b9a\uff0c\u6d4b\u8bd5\u73af\u5883\u9700\u8981\u8ddf\u751f\u4ea7\u73af\u5883\u9694\u79bb\uff1b\u5fc5\u7136\u8981\u9047\u5230\u4e00\u4e2a\u95ee\u9898\uff1a\u591a\u73af\u5883\u95ee\u9898\uff0c\u5373\u591a\u4e2a\u73af\u5883\u7684\u6570\u636e\uff08\u5982\u6d4b\u8bd5\u73af\u5883\u548c\u751f\u4ea7\u73af\u5883\uff09\u5982\u4f55\u9694\u79bb\uff1f\u5982\u4f55\u4f18\u96c5\u7684\u9694\u79bb\uff08\u4e0d\u9700\u8981\u7528\u6237\u505a\u4efb\u4f55\u6539\u52a8\uff09\u3002\u4e0b\u6587\u5c06\u5c31Nacos\u73af\u5883\u9694\u79bb\u95ee\u9898\uff0c\u5411\u5927\u5bb6\u4ecb\u7ecd\u963f\u91cc\u5728\u8fd9\u65b9\u9762\u7684\u5b9e\u8df5\u7ecf\u9a8c\u3002"),(0,a.kt)("a",{name:"d0eabe32"}),(0,a.kt)("h2",{id:"\u4ec0\u4e48\u662f\u73af\u5883"},"\u4ec0\u4e48\u662f\u73af\u5883\uff1f"),(0,a.kt)("p",null,"\u8bf4\u5230\u73af\u5883\u9694\u79bb\uff0c\u9996\u5148\u5e94\u8be5\u641e\u6e05\u695a\u4ec0\u4e48\u73af\u5883\u3002 \u73af\u5883\u8fd9\u4e2a\u8bcd\u76ee\u524d\u8fd8\u6ca1\u6709\u4e00\u4e2a\u6bd4\u8f83\u7edf\u4e00\u7684\u5b9a\u4e49\uff0c\u6709\u4e9b\u516c\u53f8\u53eb\u73af\u5883\uff0c\u5728\u963f\u91cc\u4e91\u4e0a\u53ebregion\uff0c\u5728kubernetes\u67b6\u6784\u4e2d\u53ebnamespace\u7b49\u7b49\u3002\u672c\u6587\u8ba4\u4e3a\uff0c\u73af\u5883\u662f\u903b\u8f91\u4e0a\u6216\u7269\u7406\u4e0a\u72ec\u7acb\u7684\u4e00\u6574\u5957\u7cfb\u7edf\uff0c\u8fd9\u5957\u7cfb\u7edf\u4e2d\u5305\u542b\u4e86\u5904\u7406\u7528\u6237\u8bf7\u6c42\u7684\u5168\u90e8\u7ec4\u4ef6\uff08\u7f51\u5173\u3001\u670d\u52a1\u6846\u67b6\u3001\u5fae\u670d\u52a1\u6ce8\u518c\u4e2d\u5fc3\u3001\u914d\u7f6e\u4e2d\u5fc3\u3001\u6d88\u606f\u7cfb\u7edf\u3001\u7f13\u5b58\u3001\u6570\u636e\u5e93\u7b49\uff09\uff0c\u53ef\u4ee5\u5904\u7406\u6307\u5b9a\u7c7b\u522b\u7684\u8bf7\u6c42\u3002\u4e3e\u4e2a\u6817\u5b50\uff0c\u5f88\u591a\u7f51\u7ad9\u90fd\u4f1a\u6709\u7528\u6237id\u7684\u6982\u5ff5\uff0c\u53ef\u4ee5\u6309\u7167\u7528\u6237id\u5212\u5206\uff0c\u7528\u6237id\u4ee5\u5076\u6570\u7ed3\u5c3e\u7684\u8bf7\u6c42\u5168\u90e8\u7531\u4e00\u5957\u7cfb\u7edf\u5904\u7406\uff0c\u800c\u5947\u6570\u7ed3\u5c3e\u7684\u8bf7\u6c42\u7531\u53e6\u4e00\u5957\u7cfb\u7edf\u5904\u7406\u3002\u5982\u4e0b\u56fe\u6240\u793a\u3002 \u6211\u4eec\u8fd9\u91cc\u8bf4\u7684\u73af\u5883\u9694\u79bb\u662f\u6307\u7269\u7406\u9694\u79bb\uff0c\u5373\u4e0d\u540c\u73af\u5883\u662f\u6307\u4e0d\u540c\u7684\u673a\u5668\u96c6\u7fa4\u3002"),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/yuque/0/2019/png/333810/1559699207043-bff71a91-b187-489e-a3c4-79322913fd54.png#alt=undefined",alt:null})),(0,a.kt)("a",{name:"efec68f6"}),(0,a.kt)("h2",{id:"\u73af\u5883\u9694\u79bb\u6709\u4ec0\u4e48\u7528"},"\u73af\u5883\u9694\u79bb\u6709\u4ec0\u4e48\u7528"),(0,a.kt)("p",null,"\u4e0a\u4e00\u8282\u5b9a\u4e49\u4e86\u73af\u5883\u7684\u6982\u5ff5\uff0c\u5373\u4e00\u5957\u5305\u542b\u4e86\u5904\u7406\u7528\u6237\u8bf7\u6c42\u5168\u90e8\u5fc5\u8981\u7ec4\u4ef6\u7684\u7cfb\u7edf\uff0c\u7528\u6765\u5904\u7406\u6307\u5b9a\u7c7b\u522b\u7684\u8bf7\u6c42\u3002\u672c\u8282\u8ddf\u5927\u5bb6\u8ba8\u8bba\u4e00\u4e0b\u73af\u5883\u9694\u79bb\u6709\u54ea\u4e9b\u597d\u5904\u3002\u4ece\u6982\u5ff5\u7684\u5b9a\u4e49\u53ef\u4ee5\u770b\u51fa\uff0c\u73af\u5883\u9694\u79bb\u81f3\u5c11\u6709\u4e09\u4e2a\u65b9\u9762\u7684\u597d\u5904\uff1a\u6545\u969c\u9694\u79bb\u3001\u6545\u969c\u6062\u590d\u3001\u7070\u5ea6\u6d4b\u8bd5\uff1b"),(0,a.kt)("a",{name:"dbbde2aa"}),(0,a.kt)("h3",{id:"\u6545\u969c\u9694\u79bb"},"\u6545\u969c\u9694\u79bb"),(0,a.kt)("p",null,"\u9996\u5148\uff0c\u56e0\u4e3a\u73af\u5883\u662f\u80fd\u591f\u5904\u7406\u7528\u6237\u8bf7\u6c42\u7684\u72ec\u7acb\u7ec4\u4ef6\u5355\u5143\uff0c\u4e5f\u5c31\u662f\u8bf4\u7528\u6237\u8bf7\u6c42\u7684\u5904\u7406\u94fe\u8def\u6709\u591a\u957f\uff0c\u90fd\u4e0d\u4f1a\u8df3\u51fa\u6307\u5b9a\u7684\u673a\u5668\u96c6\u7fa4\u3002\u5373\u4f7f\u8fd9\u90e8\u5206\u673a\u5668\u6545\u969c\u4e86\uff0c\u4e5f\u53ea\u662f\u4f1a\u5f71\u54cd\u90e8\u5206\u7528\u6237\uff0c\u4ece\u800c\u628a\u6545\u969c\u9694\u79bb\u5728\u6307\u5b9a\u7684\u8303\u56f4\u5185\u3002\u5982\u679c\u6211\u4eec\u6309\u7167\u7528\u6237id\u628a\u5168\u90e8\u673a\u5668\u5206\u4e3a\u5341\u4e2a\u73af\u5883\uff0c\u90a3\u4e48\u4e00\u4e2a\u73af\u5883\u51fa\u95ee\u9898\uff0c\u5bf9\u7528\u6237\u7684\u5f71\u54cd\u4f1a\u964d\u4f4e\u4e3a\u5341\u5206\u4e4b\u4e00\uff0c\u5927\u5927\u63d0\u9ad8\u7cfb\u7edf\u53ef\u7528\u6027\u3002"),(0,a.kt)("a",{name:"e443c432"}),(0,a.kt)("h3",{id:"\u6545\u969c\u6062\u590d"},"\u6545\u969c\u6062\u590d"),(0,a.kt)("p",null,"\u73af\u5883\u9694\u79bb\u7684\u53e6\u4e00\u4e2a\u91cd\u8981\u4f18\u52bf\u662f\u53ef\u4ee5\u5feb\u901f\u6062\u590d\u6545\u969c\u3002\u5f53\u67d0\u4e2a\u73af\u5883\u7684\u670d\u52a1\u51fa\u73b0\u95ee\u9898\u4e4b\u540e\uff0c\u53ef\u4ee5\u5feb\u901f\u901a\u8fc7\u4e0b\u53d1\u914d\u7f6e\uff0c\u6539\u53d8\u7528\u6237\u8bf7\u6c42\u7684\u8def\u7531\u65b9\u5411\uff0c\u628a\u8bf7\u6c42\u8def\u7531\u5230\u53e6\u4e00\u5957\u73af\u5883\uff0c\u5b9e\u73b0\u79d2\u7ea7\u6545\u969c\u6062\u590d\u3002\u5f53\u7136\uff0c\u8fd9\u9700\u8981\u4e00\u4e2a\u5f3a\u5927\u7684\u5206\u5e03\u5f0f\u7cfb\u7edf\u652f\u6301\uff0c\u5c24\u5176\u662f\u4e00\u4e2a\u5f3a\u5927\u7684\u914d\u7f6e\u4e2d\u5fc3\uff08\u5982Nacos\uff09\uff0c\u9700\u8981\u5feb\u901f\u628a\u8def\u7531\u89c4\u5219\u914d\u7f6e\u6570\u636e\u63a8\u9001\u5230\u5168\u7f51\u7684\u5e94\u7528\u8fdb\u7a0b\u3002"),(0,a.kt)("a",{name:"385e0b0a"}),(0,a.kt)("h3",{id:"\u7070\u5ea6\u6d4b\u8bd5"},"\u7070\u5ea6\u6d4b\u8bd5"),(0,a.kt)("p",null,"\u7070\u5ea6\u6d4b\u8bd5\u662f\u7814\u53d1\u6d41\u7a0b\u4e2d\u4e0d\u53ef\u6216\u7f3a\u7684\u4e00\u4e2a\u73af\u8282\u3002\u4f20\u7edf\u7684\u7814\u53d1\u6d41\u7a0b\u4e2d\uff0c\u6d4b\u8bd5\u548c\u7070\u5ea6\u73af\u8282\uff0c\u9700\u8981\u6d4b\u8bd5\u540c\u5b66\u505a\u5404\u79cd\u5404\u6837\u7684\u914d\u7f6e\uff0c\u5982\u7ed1\u5b9ahost\u3001\u914d\u7f6ejvm\u53c2\u6570\u3001\u73af\u5883\u53d8\u91cf\u7b49\u7b49\uff0c\u6bd4\u8f83\u9ebb\u70e6\u3002\u7ecf\u8fc7\u591a\u5e74\u7684\u5b9e\u8df5\uff0c\u963f\u91cc\u5df4\u5df4\u5185\u90e8\u7684\u6d4b\u8bd5\u548c\u7070\u5ea6\u5bf9\u5f00\u53d1\u548c\u6d4b\u8bd5\u975e\u5e38\u53cb\u597d\uff0c\u901a\u8fc7\u73af\u5883\u9694\u79bb\u529f\u80fd\u6765\u4fdd\u8bc1\u8bf7\u6c42\u5728\u6307\u5b9a\u7684\u673a\u5668\u96c6\u7fa4\u5904\u7406\uff0c\u5f00\u53d1\u548c\u6d4b\u8bd5\u4e0d\u9700\u8981\u505a\u4efb\u4f55\u505a\u4efb\u4f55\u914d\u7f6e\uff0c\u5927\u5927\u63d0\u9ad8\u4e86\u7814\u53d1\u6548\u7387\u3002"),(0,a.kt)("a",{name:"37555cc2"}),(0,a.kt)("h2",{id:"nacos\u5982\u4f55\u505a\u73af\u5883\u9694\u79bb"},"Nacos\u5982\u4f55\u505a\u73af\u5883\u9694\u79bb"),(0,a.kt)("p",null,"\u524d\u9762\u4e24\u8282\u8bb2\u5230\u4e86\u73af\u5883\u7684\u6982\u5ff5\u3001\u73af\u5883\u9694\u79bb\u6709\u54ea\u4e9b\u4f5c\u7528\uff0c\u672c\u8282\u5c06\u5411\u5927\u5bb6\u4ecb\u7ecd\u5982\u4f55\u628aNacos\u6309\u7167\u524d\u9762\u7684\u601d\u8def\u9694\u79bb\u6210\u591a\u4e2a\u73af\u5883\u3002Nacos\u8131\u80ce\u4e8e\u963f\u91cc\u5df4\u5df4\u4e2d\u95f4\u4ef6\u90e8\u95e8\u7684\u8f6f\u8d1f\u8f7d\u5c0f\u7ec4\uff0c\u5728\u73af\u5883\u9694\u79bb\u65b9\u9762\u6211\u4eec\u6709\u591a\u5e74\u7684\u7ecf\u9a8c\u3002\u4e0b\u9762\u7b80\u5355\u4ecb\u7ecd\u4e0b\u628aNacos\u9694\u79bb\u4e3a\u591a\u4e2a\u7269\u7406\u96c6\u7fa4\uff0cnacos\u5ba2\u6237\u7aef\u4e0d\u9700\u8981\u505a\u4efb\u4f55\u4ee3\u7801\u6539\u52a8\u5373\u53ef\u5b9e\u73b0\u73af\u5883\u81ea\u52a8\u8def\u7531\u3002"),(0,a.kt)("a",{name:"b6724cff"}),"### \u539f\u7406",(0,a.kt)("p",null,"\u5728\u5f00\u59cb\u524d\uff0c\u6211\u4eec\u5148\u505a\u4e00\u4e9b\u7ea6\u675f\uff1a"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u4e00\u53f0\u673a\u5668\u4e0a\u90e8\u7f72\u7684\u5e94\u7528\u90fd\u5728\u4e00\u4e2a\u73af\u5883\u5185\uff1b"),(0,a.kt)("li",{parentName:"ul"},"\u4e00\u4e2a\u5e94\u7528\u8fdb\u7a0b\u5185\u9ed8\u8ba4\u60c5\u51b5\u4e0b\u53ea\u8fde\u4e00\u4e2a\u73af\u5883\u7684Nacos\uff1b"),(0,a.kt)("li",{parentName:"ul"},"\u901a\u8fc7\u67d0\u79cd\u624b\u6bb5\u53ef\u4ee5\u62ff\u5230\u5ba2\u6237\u7aef\u6240\u5728\u673a\u5668ip\uff1b"),(0,a.kt)("li",{parentName:"ul"},"\u7528\u6237\u5bf9\u673a\u5668\u7684\u7f51\u6bb5\u6709\u89c4\u5212\uff1b")),(0,a.kt)("p",null,"\u4e0b\u9762\u7b80\u5355\u4ecb\u7ecd\u4e00\u4e0b\u57fa\u672c\u539f\u7406\uff1a"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u6211\u4eec\u77e5\u9053\u7f51\u7edc\u4e2d32\u4f4d\u7684ipv4\u53ef\u4ee5\u5212\u5206\u4e3a\u5f88\u591a\u7f51\u6bb5\uff0c\u5982192.168.1.0/24\u8fd9\u79cd\uff0c\u5e76\u4e14\u4e00\u822c\u7a0d\u5927\u578b\u7684\u516c\u53f8\u90fd\u4f1a\u6709\u7f51\u6bb5\u89c4\u5212\uff0c\u6309\u7167\u4e00\u5b9a\u7684\u7528\u9014\u5212\u5206\u7f51\u6bb5\u3002\u6211\u4eec\u53ef\u4ee5\u5229\u7528\u8fd9\u4e2a\u539f\u7406\u505a\u73af\u5883\u9694\u79bb\uff0c\u5373\u4e0d\u540c\u7f51\u6bb5\u7684IP\u5c5e\u4e8e\u4e0d\u540c\u7684\u73af\u5883\uff0c\u5982192.168.1.0/24\u5c5e\u4e8e\u73af\u5883A\uff0c 192.168.2.0/24\u5c5e\u4e8e\u73af\u5883B\u7b49\u3002"),(0,a.kt)("li",{parentName:"ul"},"\u4f7f\u7528\u8fc7Nacos\u7684\u5e94\u8be5\u77e5\u9053\uff0c\u6709\u4e24\u79cd\u65b9\u5f0f\u521d\u59cb\u5316Nacos\u5ba2\u6237\u7aef\u5b9e\u4f8b\uff0c\u4e00\u79cd\u662f\u76f4\u63a5\u544a\u8bc9\u5ba2\u6237\u7aefnacos\u670d\u52a1\u7aef\u7684IP\uff1b\u53e6\u4e00\u79cd\u662f\u544a\u8bc9\u5ba2\u6237\u7aef\u4e00\u4e2aendpoint\uff0c\u5ba2\u6237\u7aef\u901a\u8fc7HTTP\u8bf7\u6c42\u5230endpoint\u67e5\u8be2nacos\u670d\u52a1\u7aefIP\u5217\u8868\u3002\u6211\u4eec\u5229\u7528Nacos\u7b2c\u4e8c\u79cd\u521d\u59cb\u5316\u65b9\u5f0f\u3002"),(0,a.kt)("li",{parentName:"ul"},"\u589e\u5f3aendpoint\u7684\u529f\u80fd\u3002\u5728endpoint\u7aef\u914d\u7f6e\u7f51\u6bb5\u548c\u73af\u5883\u7684\u6620\u5c04\u5173\u7cfb\uff0cendpoint\u5728\u63a5\u6536\u5230\u5ba2\u6237\u7aef\u7684\u8bf7\u6c42\u4e4b\u540e\uff0c\u6839\u636e\u5ba2\u6237\u7aef\u7684\u6765\u6e90IP\u6240\u5c5e\u7f51\u6bb5\uff0c\u8ba1\u7b97\u51fa\u8be5\u5ba2\u6237\u7aef\u6240\u5c5e\u73af\u5883\uff0c\u7136\u540e\u627e\u5230\u5bf9\u5e94\u73af\u5883\u7684IP\u5217\u8868\u8fd4\u56de\u7ed9\u5ba2\u6237\u7aef\u3002\u5982\u4e0b\u56fe",(0,a.kt)("img",{parentName:"li",src:"https://cdn.nlark.com/yuque/0/2019/png/333810/1559699221719-b127d968-2374-4fad-b433-733f47642bf0.png#alt=undefined",alt:null}))),(0,a.kt)("a",{name:"f172b185"}),(0,a.kt)("h2",{id:"\u4e00\u4e2a\u73af\u5883\u9694\u79bbserver\u7684\u793a\u4f8b"},"\u4e00\u4e2a\u73af\u5883\u9694\u79bbserver\u7684\u793a\u4f8b"),(0,a.kt)("p",null,"\u4e0a\u9762\u8bb2\u4e86\u57fa\u4e8eIP\u6bb5\u505a\u73af\u5883\u9694\u79bb\u7684\u7ea6\u675f\u548c\u57fa\u672c\u539f\u7406\uff0c\u90a3\u4e48\u5982\u4f55\u5b9e\u73b0\u4e00\u4e2a\u5730\u5740\u670d\u52a1\u5668\u5462\u3002\u6700\u7b80\u5355\u7684\u65b9\u6cd5\u662f\u57fa\u4e8enginx\u5b9e\u73b0\uff0c\u5229\u7528nginx\u7684geo\u6a21\u5757\uff0c\u505aIP\u7aef\u548c\u73af\u5883\u7684\u6620\u5c04\uff0c\u7136\u540e\u5229\u7528nginx\u8fd4\u56de\u9759\u6001\u6587\u4ef6\u5185\u5bb9\u3002"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u5b89\u88c5nginx ",(0,a.kt)("a",{parentName:"li",href:"http://nginx.org/en/docs/install.html"},"http://nginx.org/en/docs/install.html")),(0,a.kt)("li",{parentName:"ul"},"\u5728nginx-proxy.conf\u4e2d\u914d\u7f6egeo\u6620\u5c04\uff0c",(0,a.kt)("a",{parentName:"li",href:"http://nginx.org/en/docs/http/ngx_http_geo_module.html"},"\u53c2\u8003\u8fd9\u91cc"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'geo $env {\n  default        "";\n  192.168.1.0/24 -env-a;\n  192.168.2.0/24 -env-b;\n}\n')),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u914d\u7f6enginx\u6839\u8def\u5f84\u53ca\u8f6c\u53d1\u89c4\u5219\uff0c\u8fd9\u91cc\u53ea\u9700\u8981\u7b80\u5355\u7684\u8fd4\u56de\u9759\u6001\u6587\u4ef6\u7684\u5185\u5bb9\uff1b")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"# \u5728http\u6a21\u5757\u4e2d\u914d\u7f6e\u6839\u8def\u5f84\nroot                    /tmp/htdocs;\n\n# \u5728server\u6a21\u5757\u4e2d\u914d\u7f6e\nlocation / {\n  rewrite ^(.*)$  /$1$env break;\n}\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u914d\u7f6eNacos\u670d\u52a1\u7aefIP\u5217\u8868\u914d\u7f6e\u6587\u4ef6\uff0c\u5728/tmp/hotdocs/nacos\u76ee\u5f55\u4e0b\u914d\u7f6e\u4ee5\u73af\u5883\u540d\u7ed3\u5c3e\u7684\u6587\u4ef6\uff0c\u6587\u4ef6\u5185\u5bb9\u4e3aIP\uff0c\u4e00\u884c\u4e00\u4e2a")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"$ll /tmp/hotdocs/nacos/\ntotal 0\n-rw-r--r-- 1 user1 users 0 Mar  5 08:53 serverlist\n-rw-r--r-- 1 user1 users 0 Mar  5 08:53 serverlist-env-a\n-rw-r--r-- 1 user1 users 0 Mar  5 08:53 serverlist-env-b\n\n$cat /tmp/hotdocs/nacos/serverlist\n192.168.1.2\n192.168.1.3\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u9a8c\u8bc1")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"curl 'localhost:8080/nacos/serverlist'\n192.168.1.2\n192.168.1.3\n")),(0,a.kt)("p",null,"\u81f3\u6b64\uff0c \u4e00\u4e2a\u7b80\u5355\u7684\u6839\u636eIP\u7f51\u6bb5\u505a\u73af\u5883\u9694\u79bb\u7684\u793a\u4f8b\u5df2\u7ecf\u53ef\u4ee5\u5de5\u4f5c\u4e86\uff0c\u4e0d\u540c\u7f51\u6bb5\u7684nacos\u5ba2\u6237\u7aef\u4f1a\u81ea\u52a8\u83b7\u53d6\u5230\u4e0d\u540c\u7684Nacos\u670d\u52a1\u7aefIP\u5217\u8868\uff0c\u5b9e\u73b0\u73af\u5883\u9694\u79bb\u3002\u8fd9\u79cd\u65b9\u6cd5\u7684\u597d\u5904\u662f\u7528\u6237\u4e0d\u9700\u8981\u914d\u7f6e\u4efb\u4f55\u53c2\u6570\uff0c\u5404\u4e2a\u73af\u5883\u7684\u4ee3\u7801\u548c\u914d\u7f6e\u662f\u4e00\u6837\u7684\uff0c\u4f46\u9700\u8981\u63d0\u4f9b\u5e95\u5c42\u670d\u52a1\u7684\u540c\u5b66\u505a\u597d\u7f51\u7edc\u89c4\u5212\u548c\u76f8\u5173\u914d\u7f6e\u3002"),(0,a.kt)("a",{name:"25f9c7fa"}),(0,a.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,a.kt)("p",null,"\u672c\u6587\u7b80\u5355\u4ecb\u7ecd\u4e86\u73af\u5883\u9694\u79bb\u7684\u6982\u5ff5\uff0c\u73af\u5883\u9694\u79bb\u7684\u4e09\u4e2a\u597d\u5904\u4ee5\u53caNacos\u5982\u4f55\u57fa\u4e8e\u7f51\u6bb5\u505a\u73af\u5883\u9694\u79bb\u3002\u6700\u540e\uff0c\u7ed9\u51fa\u4e86\u4e00\u4e2a\u57fa\u4e8enginx\u505aendpoint\u670d\u52a1\u7aef\u7684\u73af\u5883\u9694\u79bb\u914d\u7f6e\u793a\u4f8b\u3002\u672c\u6587\u53ea\u662f\u5217\u51fa\u4e86\u4e00\u79cd\u53ef\u884c\u7684\u65b9\u6cd5\uff0c\u4e0d\u6392\u9664\u6709\u66f4\u4f18\u96c5\u7684\u5b9e\u73b0\u65b9\u6cd5\uff0c\u5982\u679c\u5927\u5bb6\u6709\u66f4\u597d\u7684\u65b9\u6cd5\u53ef\u4ee5\u770b\u5230nacos\u793e\u533a\u6216",(0,a.kt)("a",{parentName:"p",href:"https://nacos.io"},"\u5b98\u7f51"),"\u8d21\u732e\u65b9\u6848\u3002"))}m.isMDXComponent=!0}}]);