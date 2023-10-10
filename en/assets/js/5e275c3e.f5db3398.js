"use strict";(self.webpackChunkNacos=self.webpackChunkNacos||[]).push([[6039],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>k});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=c(n),g=r,k=u["".concat(s,".").concat(g)]||u[g]||m[g]||o;return n?a.createElement(k,l(l({ref:t},p),{},{components:n})):a.createElement(k,l({ref:t},p))}));function k(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=g;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[u]="string"==typeof e?e:r,l[1]=i;for(var c=2;c<o;c++)l[c]=n[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},7451:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var a=n(87462),r=(n(67294),n(3905));const o={},l="Nacos\u6743\u9650\u63a7\u5236\u8bbe\u8ba1\u65b9\u6848",i={permalink:"/en/blog/access control design",source:"@site/i18n/en/docusaurus-plugin-content-blog/access control design.md",title:"Nacos\u6743\u9650\u63a7\u5236\u8bbe\u8ba1\u65b9\u6848",description:"Nacos\u81ea\u5f00\u6e90\u4ee5\u6765\uff0c\u6743\u9650\u63a7\u5236\u4e00\u76f4\u9700\u6c42\u6bd4\u8f83\u5f3a\u70c8\uff0c\u8fd9\u4e5f\u53cd\u5e94\u4e86\u7528\u6237\u9700\u6c42\u5c06Nacos\u90e8\u7f72\u5230\u751f\u4ea7\u73af\u5883\u7684\u9700\u6c42\u3002Nacos 1.2.0\u7248\u672c\u5c06\u4f1a\u652f\u6301\u670d\u52a1\u53d1\u73b0\u548c\u914d\u7f6e\u7ba1\u7406\u7684\u6743\u9650\u63a7\u5236\uff0c\u4fdd\u969c\u7528\u6237\u5b89\u5168\u4e0a\u751f\u4ea7\u3002\u672c\u6587\u4e3b\u8981\u4ecb\u7ecdNacos\u6743\u9650\u63a7\u5236\u7684\u8bbe\u8ba1\u65b9\u6848\uff0c\u5f53\u7136\u8fd9\u4e2a\u65b9\u6848\u57281.2.0\u53d1\u5e03\u524d\u53ef\u80fd\u4f1a\u6709\u5c11\u8bb8\u8c03\u6574\uff0c\u540c\u65f6\u4e5f\u6b22\u8fce\u5e7f\u5927\u7528\u6237\u5bf9\u8be5\u65b9\u6848\u63d0\u51fa\u81ea\u5df1\u7684\u5efa\u8bae\u3002",date:"2023-10-10T11:47:41.000Z",formattedDate:"October 10, 2023",tags:[],readingTime:12.265,hasTruncateMarker:!1,authors:[],frontMatter:{},prevItem:{title:"Nacos \u6709\u54ea\u4e9b\u5178\u578b\u7684\u5e94\u7528\u573a\u666f\uff1f\u2014\u2014 \u914d\u7f6e\u7ba1\u7406\u7bc7",permalink:"/en/blog/5w1h-where"},nextItem:{title:"Nacos\u73af\u5883\u9694\u79bb",permalink:"/en/blog/address-server"}},s={authorsImageUrls:[]},c=[{value:"\u9274\u6743\uff08Authorization\uff09",id:"\u9274\u6743authorization",level:3}],p={toc:c},u="wrapper";function m(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("a",{name:"oBGKT"}),"# \u65b9\u6848\u80cc\u666f Nacos\u81ea\u5f00\u6e90\u4ee5\u6765\uff0c\u6743\u9650\u63a7\u5236\u4e00\u76f4\u9700\u6c42\u6bd4\u8f83\u5f3a\u70c8\uff0c\u8fd9\u4e5f\u53cd\u5e94\u4e86\u7528\u6237\u9700\u6c42\u5c06Nacos\u90e8\u7f72\u5230\u751f\u4ea7\u73af\u5883\u7684\u9700\u6c42\u3002Nacos 1.2.0\u7248\u672c\u5c06\u4f1a\u652f\u6301\u670d\u52a1\u53d1\u73b0\u548c\u914d\u7f6e\u7ba1\u7406\u7684\u6743\u9650\u63a7\u5236\uff0c\u4fdd\u969c\u7528\u6237\u5b89\u5168\u4e0a\u751f\u4ea7\u3002\u672c\u6587\u4e3b\u8981\u4ecb\u7ecdNacos\u6743\u9650\u63a7\u5236\u7684\u8bbe\u8ba1\u65b9\u6848\uff0c\u5f53\u7136\u8fd9\u4e2a\u65b9\u6848\u57281.2.0\u53d1\u5e03\u524d\u53ef\u80fd\u4f1a\u6709\u5c11\u8bb8\u8c03\u6574\uff0c\u540c\u65f6\u4e5f\u6b22\u8fce\u5e7f\u5927\u7528\u6237\u5bf9\u8be5\u65b9\u6848\u63d0\u51fa\u81ea\u5df1\u7684\u5efa\u8bae\u3002",(0,r.kt)("a",{name:"FKbJ4"}),"## \u4ec0\u4e48\u662f\u6743\u9650\u63a7\u5236\uff1f \u5728\u5206\u5e03\u5f0f\u670d\u52a1\u8c03\u7528\u65f6\uff0c\u9700\u8981\u5bf9\u672a\u77e5\u7684\u6216\u8005\u4e0d\u53d7\u4fe1\u4efb\u7684\u8bf7\u6c42\u6765\u6e90\u7684\u8bf7\u6c42\u8fdb\u884c\u8bc6\u522b\u548c\u62d2\u7edd\u3002\u6743\u9650\u63a7\u5236\u4e00\u822c\u5206\u4e3a\u4e24\u4e2a\u9636\u6bb5\uff1a\u8eab\u4efd\u8bc6\u522b\uff08Authentication\uff09\u548c\u6743\u9650\u8bc6\u522b\uff08Authorization\uff09\u3002\u8eab\u4efd\u8ba4\u8bc1\u4e3b\u8981\u786e\u5b9a\u8bbf\u95ee\u8005\u7684\u8eab\u4efd\uff0c\u6743\u9650\u8bc6\u522b\u5219\u5224\u65ad\u8fd9\u4e2a\u8bbf\u95ee\u8005\u662f\u5426\u6709\u5bf9\u5e94\u8d44\u6e90\u7684\u6743\u9650\u3002",(0,r.kt)("br",null),(0,r.kt)("br",null),"\u5728Nacos\u7684\u573a\u666f\u4e2d\uff0c\u914d\u7f6e\u7ba1\u7406\u7684\u6743\u9650\u63a7\u5236\u6307\u7684\u662f\u8bbe\u7f6e\u67d0\u4e2a\u914d\u7f6e\u80fd\u5426\u88ab\u67d0\u4e2a\u7528\u6237\u8bfb\u5199\uff0c\u8fd9\u4e2a\u6bd4\u8f83\u597d\u7406\u89e3\uff0c\u6ca1\u6709\u6743\u9650\u7684\u7528\u6237\u65e7\u65e0\u6cd5\u8bfb\u53d6\u6216\u8005\u5199\u5165\u5bf9\u5e94\u7684\u914d\u7f6e\u3002\u670d\u52a1\u53d1\u73b0\u7684\u6743\u9650\u63a7\u5236\u6307\u7684\u662f\u7528\u6237\u662f\u5426\u6709\u6743\u9650\u8fdb\u884c\u67d0\u4e2a\u670d\u52a1\u7684\u6ce8\u518c\u6216\u8005\u8ba2\u9605\uff0c\u8fd9\u91cc\u9700\u8981\u6ce8\u610f\u7684\u662f\u670d\u52a1\u53d1\u73b0\u7684\u6743\u9650\u63a7\u5236\u53ea\u80fd\u591f\u63a7\u5236\u7528\u6237\u662f\u5426\u53ef\u4ee5\u4eceNacos\u83b7\u53d6\u5230\u670d\u52a1\u7684\u5730\u5740\u6216\u8005\u5728Nacos\u4e0a\u4fee\u6539\u670d\u52a1\u7684\u5730\u5740\u3002\u4f46\u662f\u5982\u679c\u5df2\u7ecf\u83b7\u53d6\u5230\u4e86\u670d\u52a1\u7684\u5730\u5740\uff0cNacos\u65e0\u6cd5\u5728\u670d\u52a1\u771f\u6b63\u8c03\u7528\u65f6\u8fdb\u884c\u6743\u9650\u63a7\u5236\uff0c\u8fd9\u4e2a\u65f6\u5019\u7684\u6743\u9650\u63a7\u5236\u9700\u8981\u7531\u670d\u52a1\u6846\u67b6\u6765\u5b8c\u6210\u3002",(0,r.kt)("p",null,(0,r.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/yuque/0/2019/png/333810/1576216016307-2da56934-917f-46ec-b3eb-a221bc91a9e0.png#align=left&display=inline&height=240&name=image.png&originHeight=480&originWidth=1904&size=271408&status=done&style=none&width=952",alt:"image.png"})),(0,r.kt)("a",{name:"iiXvl"}),"## \u5e38\u89c1\u5b9e\u73b0\u65b9\u5f0f",(0,r.kt)("a",{name:"SzK17"}),"### \u8ba4\u8bc1\uff08Authentication\uff09",(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u7528\u6237\u540d+\u5bc6\u7801"),(0,r.kt)("li",{parentName:"ul"},"Cookie\uff08\u53ea\u9002\u7528\u4e8e\u6d4f\u89c8\u5668\uff09"),(0,r.kt)("li",{parentName:"ul"},"Session"),(0,r.kt)("li",{parentName:"ul"},"Token\uff08JWT\uff0cOauth\uff0cLDAP\uff0cSAML\uff0cOpenID\uff09"),(0,r.kt)("li",{parentName:"ul"},"AK/SK",(0,r.kt)("a",{name:"3szY3"}))),(0,r.kt)("h3",{id:"\u9274\u6743authorization"},"\u9274\u6743\uff08Authorization\uff09"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"ACL\uff1a \u89c4\u5b9a",(0,r.kt)("strong",{parentName:"li"},"\u8d44\u6e90"),"\u53ef\u4ee5\u88ab\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u4e3b\u4f53"),"\u8fdb\u884c\u54ea\u4e9b\u64cd\u4f5c\uff1b"),(0,r.kt)("li",{parentName:"ul"},"DAC\uff1a \u89c4\u5b9a",(0,r.kt)("strong",{parentName:"li"},"\u8d44\u6e90"),"\u53ef\u4ee5\u88ab\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u4e3b\u4f53"),"\u8fdb\u884c\u54ea\u4e9b\u64cd\u4f5c\xa0\u540c\u65f6\uff0c",(0,r.kt)("strong",{parentName:"li"},"\u4e3b\u4f53"),"\u53ef\u4ee5\u5c06",(0,r.kt)("strong",{parentName:"li"},"\u8d44\u6e90"),"\u7684\u6743\u9650\uff0c\u6388\u4e88\u5176\u4ed6",(0,r.kt)("strong",{parentName:"li"},"\u4e3b\u4f53"),"\uff1b"),(0,r.kt)("li",{parentName:"ul"},"MAC\uff1aa. \u89c4\u5b9a",(0,r.kt)("strong",{parentName:"li"},"\u8d44\u6e90"),"\u53ef\u4ee5\u88ab\u54ea\u4e9b\u7c7b\u522b\u7684",(0,r.kt)("strong",{parentName:"li"},"\u4e3b\u4f53"),"\u8fdb\u884c\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u64cd\u4f5c"),"\xa0b. \u89c4\u5b9a",(0,r.kt)("strong",{parentName:"li"},"\u4e3b\u4f53"),"\u53ef\u4ee5\u5bf9\u54ea\u4e9b\u7b49\u7ea7\u7684",(0,r.kt)("strong",{parentName:"li"},"\u8d44\u6e90"),"\u8fdb\u884c\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u64cd\u4f5c"),"\xa0\u5f53\u4e00\u4e2a",(0,r.kt)("strong",{parentName:"li"},"\u64cd\u4f5c"),"\uff0c\u540c\u65f6\u6ee1\u8db3a\u4e0eb\u65f6\uff0c\u5141\u8bb8",(0,r.kt)("strong",{parentName:"li"},"\u64cd\u4f5c"),"\uff1b"),(0,r.kt)("li",{parentName:"ul"},"RBAC\uff1a a. \u89c4\u5b9a",(0,r.kt)("strong",{parentName:"li"},"\u89d2\u8272"),"\u53ef\u4ee5\u5bf9\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u8d44\u6e90"),"\u8fdb\u884c\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u64cd\u4f5c"),"\xa0b. \u89c4\u5b9a",(0,r.kt)("strong",{parentName:"li"},"\u4e3b\u4f53"),"\u62e5\u6709\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u89d2\u8272"),"\u5f53\u4e00\u4e2a\u64cd\u4f5c\uff0c\u540c\u65f6\u6ee1\u8db3a\u4e0eb\u65f6\uff0c\u5141\u8bb8",(0,r.kt)("strong",{parentName:"li"},"\u64cd\u4f5c"),"\uff1b"),(0,r.kt)("li",{parentName:"ul"},"ABAC\uff1a \u89c4\u5b9a\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u5c5e\u6027"),"\u7684",(0,r.kt)("strong",{parentName:"li"},"\u4e3b\u4f53"),"\u53ef\u4ee5\u5bf9\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u5c5e\u6027"),"\u7684",(0,r.kt)("strong",{parentName:"li"},"\u8d44\u6e90"),"\u5728\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u5c5e\u6027"),"\u7684\u60c5\u51b5\u4e0b\u8fdb\u884c\u54ea\u4e9b",(0,r.kt)("strong",{parentName:"li"},"\u64cd\u4f5c"),"\u3002",(0,r.kt)("a",{name:"0FxEV"}))),(0,r.kt)("h2",{id:""}),(0,r.kt)("a",{name:"0YQ9P"}),"## \u5e38\u89c1\u6ce8\u518c\u4e2d\u5fc3\u548c\u914d\u7f6e\u4e2d\u5fc3\u7684\u5b9e\u73b0\u65b9\u5f0f",(0,r.kt)("a",{name:"5yePW"}),"### Zookeeper Zookeeper\u4e3b\u8981\u4f7f\u7528\u7684\u662fACL\u7684\u65b9\u5f0f\uff0c\u76f4\u63a5\u5c06\u8d44\u6e90\u6388\u6743\u7ed9\u5bf9\u5e94\u7684\u5b9e\u4f53\u3002\u4e00\u6761\u6388\u6743\u8bb0\u5f55\u4e3b\u8981\u7531\u4ee5\u4e0b\u90e8\u5206\u7ec4\u6210\uff1a",(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("path",null),": \u8bbe\u7f6e\u6743\u9650\u7684\u8def\u5f84"),(0,r.kt)("li",{parentName:"ul"},"<acl_type>: ACL\u9274\u6743\u7c7b\u578b\uff0c\u5206\u4e3aworld\uff0cip\uff0cauth\uff0cdigest"),(0,r.kt)("li",{parentName:"ul"},"<acl_content>: ACL\u9274\u6743\u5185\u5bb9\uff0c\u4e0e\u9274\u6743\u7c7b\u578b\u5173\u8054"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("action",null),": CREATE\uff0cDELETE\uff0cREAD\uff0cWRITE\uff0cADMIN")),(0,r.kt)("p",null,"\u64cd\u4f5c\u793a\u4f8b\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},"$ setAcl <path /> <acl_type>:<acl_content>:<action />\n$ setAcl /xxx/yyy world:anyone:cdrwa\n$ setAcl /xxx/yyy ip:1.1.1.1:cdrwa\n$ addauth digest root:pa55wd\vsetAcl /xxx/yyy auth:root:cdrwa\n")),(0,r.kt)("a",{name:"GI6TE"}),"### Consul Consul\u7684\u9274\u6743\u4e5f\u662f\u504f\u5411\u4e8eACL\u673a\u5236\uff0c\u4e3b\u8981\u5206\u4e3a\u4e09\u4e2a\u90e8\u5206\uff1a",(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Rule\uff1a\u5b9a\u4e49\u5bf9\u67d0\u4e2a\u8d44\u6e90\u7684\u6743\u9650"),(0,r.kt)("li",{parentName:"ul"},"Policy\uff1a\u5c06\u4e00\u7cfb\u5217Rule\u7ec4\u5408\u6210\u4e00\u4e2aPolicy"),(0,r.kt)("li",{parentName:"ul"},"Token\uff1a\u4e3a\u67d0\u4e2aToken\u5206\u914d\u4e00\u4e2a\u6216\u591a\u4e2aPolicy\uff0cAPI\u5e26\u4e0aToken\u8fdb\u884c\u9274\u6743")),(0,r.kt)("p",null,(0,r.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/yuque/0/2019/png/333810/1576218881317-bb025c9f-f6ad-4df1-9f7f-f116e8d95671.png#align=left&display=inline&height=240&name=image.png&originHeight=273&originWidth=848&size=49225&status=done&style=none&width=746",alt:"image.png"})),(0,r.kt)("a",{name:"oLlfm"}),"### Eureka Eureka\u4f7f\u7528\u7684\u9274\u6743\u662f\u57fa\u4e8eSpring Security\u5b9e\u73b0\u7684\uff0c\u652f\u6301\u7528\u6237\u540d\u548c\u5bc6\u7801\u7684\u8bbf\u95ee\u63a7\u5236\uff0c\u4e00\u4e2a\u7b80\u5355\u7684\u4f8b\u5b50\u5982\u4e0b\uff1a",(0,r.kt)("br",null),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"spring: \n  security: \n  # \u5f00\u542f\u8ba4\u8bc1\uff0cSpring Cloud2.0\u540e\u6dfb\u52a0jar\u4f1a\u81ea\u52a8\u96c6\u6210\u5e76\u5f00\u542f\n  #\nbasic.enabled: true \n  # \u7528\u6237\u540d\u5bc6\u7801\n  user: \n  name: test \n  password: test\n")),(0,r.kt)("a",{name:"qrC17"}),"### Apollo \u57fa\u4e8eRBAC\u7684\u6743\u9650\u63a7\u5236\uff0c\u53ef\u4ee5\u5728\u547d\u540d\u7a7a\u95f4\u7ea7\u522b\u8fdb\u884c\u8d44\u6e90\u7684\u6388\u6743\uff1a",(0,r.kt)("br",null),"![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576218970350-01402621-0a13-4102-a590-20c6cefe4918.png#align=left&display=inline&height=118&name=image.png&originHeight=101&originWidth=640&size=21453&status=done&style=none&width=746)",(0,r.kt)("a",{name:"zH1U3"}),"# \u65b9\u6848\u8be6\u60c5 Nacos\u7684\u6743\u9650\u63a7\u5236\uff0c\u76ee\u6807\u662f\u80fd\u591f\u6ee1\u8db3\u7528\u6237\u57fa\u672c\u7684\u9274\u6743\u9700\u6c42\uff0c\u540c\u65f6\u80fd\u591f\u4fdd\u6301\u6269\u5c55\u6027\uff0c\u53ef\u4ee5\u652f\u6301\u53bb\u5bf9\u63a5\u7528\u6237\u81ea\u5e26\u7684\u7528\u6237\u7ba1\u7406\u7cfb\u7edf\u6216\u8005\u9274\u6743\u7cfb\u7edf\uff0c\u5305\u62ec\u540e\u9762\u548cK8S\u751f\u6001\u4ee5\u53caService Mesh\u751f\u6001\u80fd\u591f\u65e0\u7f1d\u7684\u878d\u5408\u3002\u57fa\u4e8e\u8fd9\u6837\u7684\u8003\u8651\uff0c\u76ee\u524dNacos\u6743\u9650\u63a7\u5236\u7684\u8bbe\u8ba1\u662f\u81ea\u5e26\u4e00\u4e2a\u57fa\u672c\u7684\u5b9e\u73b0\uff0c\u7136\u540e\u53ef\u4ee5\u652f\u6301\u7528\u6237\u6269\u5c55\u3002\u5177\u4f53\u7684\u8bbe\u8ba1\u5982\u4e0b\u3002",(0,r.kt)("a",{name:"pd2aV"}),"## \u6a21\u5757\u8bbe\u8ba1 \u6574\u4f53\u7684\u6a21\u5757\u8bbe\u8ba1\u662f\u5c3d\u91cf\u5c06\u9274\u6743\u7684\u903b\u8f91\u62bd\u8c61\u51fa\u6765\uff0c\u4e0d\u5728\u670d\u52a1\u53d1\u73b0\u6a21\u5757\u6216\u8005\u914d\u7f6e\u7ba1\u7406\u6a21\u5757\u6dfb\u52a0\u76f8\u5173\u7684\u903b\u8f91\u3002\u901a\u8fc7\u914d\u7f6e\u6587\u4ef6\u53ef\u4ee5\u9009\u62e9\u5f53\u524d\u4f7f\u7528\u7684\u9274\u6743\u7cfb\u7edf\u3002Nacos\u81ea\u5e26\u7684\u8ba4\u8bc1\u7cfb\u7edf\u4f7f\u7528JWT Token\uff0c\u81ea\u5e26\u7684\u9274\u6743\u7cfb\u7edf\u4f7f\u7528\u7684\u662fRBAC\u3002",(0,r.kt)("p",null,(0,r.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/yuque/0/2019/png/333810/1576219027093-45345003-c583-46ec-a161-01b5f4b3ff47.png#align=left&display=inline&height=450&name=image.png&originHeight=900&originWidth=1744&size=699757&status=done&style=none&width=872",alt:"image.png"})),(0,r.kt)("a",{name:"vr4PO"}),"## \u8ba4\u8bc1\u7b97\u6cd5 \u5bf9\u4e8e\u7528\u6237\u6765\u8bf4\uff0c\u4e0d\u7ba1\u662f\u5728\u63a7\u5236\u53f0\u8fd8\u662f\u5728\u5ba2\u6237\u7aef\uff0c\u90fd\u662f\u4e0a\u4f20\u7528\u6237\u540d\u548c\u5bc6\u7801\u6765\u83b7\u53d6\u4e00\u4e2atoken\uff0c\u7136\u540e\u540e\u7eed\u7684\u6bcf\u4e00\u6b21\u5230Nacos\u7684\u8bf7\u6c42\u90fd\u4f1a\u5e26\u4e0a\u8fd9\u4e2atoken\u6765\u8868\u660e\u8eab\u4efd\u3002\u8fd9\u4e2atoken\u4f1a\u6709\u4e00\u4e2a\u5931\u6548\u65f6\u95f4\uff0c\u5bf9\u4e8e\u63a7\u5236\u53f0\u6765\u8bf4\uff0c\u53ea\u9700\u8981\u76f4\u63a5\u63d0\u793a\u7528\u6237\u91cd\u65b0\u767b\u5f55\u5373\u53ef\uff0c\u5bf9\u4e8e\u5ba2\u6237\u7aef\u5219\u9700\u8981\u6709\u4e00\u4e2a\u5b9a\u671f\u5230Nacos\u5237\u65b0token\u7684\u903b\u8f91\u3002",(0,r.kt)("p",null,(0,r.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/yuque/0/2019/png/333810/1576219050917-51013ce2-49f3-4a86-b5f9-bd07fc88f8e8.png#align=left&display=inline&height=368&name=image.png&originHeight=736&originWidth=1718&size=575605&status=done&style=none&width=859",alt:"image.png"})),(0,r.kt)("a",{name:"9ncb7"}),"## \u9274\u6743\u7b97\u6cd5 Nacos\u81ea\u5e26\u7684\u9274\u6743\u7cfb\u7edf\u4f7f\u7528\u7684\u662fRBAC\u6a21\u578b\uff0c\u53ef\u4ee5\u5728\u7f51\u4e0a\u67e5\u8be2\u76f8\u5173\u7684\u8d44\u6599\u3002",(0,r.kt)("a",{name:"DjMVc"}),"### \u6570\u636e\u6a21\u578b \u9274\u6743\u7684\u6570\u636e\u6a21\u578b\u4e5f\u662f\u57fa\u4e8e\u6807\u51c6\u7684RBAC\u6765\u8bbe\u8ba1\u7684\uff0c\u5206\u4e3a\u7528\u6237\u3001\u89d2\u8272\u548c\u6743\u9650\u4e09\u90e8\u5206\u3002\u7528\u6237\u5c31\u662f\u7531\u7528\u6237\u540d\u548c\u5bc6\u7801\u7ec4\u6210\u7684\u7528\u6237\u4fe1\u606f\uff0c\u89d2\u8272\u5219\u662f\u4e00\u4e2a\u903b\u8f91\u4e0a\u7684\u7528\u6237\u7ec4\uff0cNacos\u542f\u52a8\u65f6\u4f1a\u81ea\u5e26\u4e00\u4e2a\u5168\u5c40\u7ba1\u7406\u5458\u7684\u89d2\u8272\uff0c\u53ea\u6709\u8fd9\u4e2a\u5168\u5c40\u7ba1\u7406\u5458\u7684\u89d2\u8272\u53ef\u4ee5\u8fdb\u884c\u6dfb\u52a0\u7528\u6237\u3001\u6dfb\u52a0\u89d2\u8272\u3001\u6dfb\u52a0\u6388\u6743\u7b49\u64cd\u4f5c\uff0c\u4fdd\u8bc1\u5b89\u5168\u6027\u3002\u800c\u6743\u9650\u5219\u662f\u7531\u8d44\u6e90+\u52a8\u4f5c\u6765\u7ec4\u6210\u3002",(0,r.kt)("p",null,(0,r.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/yuque/0/2019/png/333810/1576736418792-936a9d1a-5095-47fc-9f87-230abed38384.png#align=left&display=inline&height=451&name=image.png&originHeight=902&originWidth=1834&size=438246&status=done&style=none&width=917",alt:"image.png"})),(0,r.kt)("a",{name:"gIPMW"}),"### \u63a5\u53e3\u8bbe\u8ba1 \u4ee5\u4e0b\u63a5\u53e3\u6d89\u53ca\u5230\u767b\u5f55\u548c\u9274\u6743\u7684\u6240\u6709\u903b\u8f91\uff0c\u8fd9\u4e9b\u63a5\u53e3\u9664\u4e86\u767b\u5f55\u63a5\u53e3\uff0c\u5176\u4ed6\u63a5\u53e3\u90fd\u53ea\u80fd\u7531\u5168\u5c40\u7ba1\u7406\u5458\u6765\u8c03\u7528\u3002",(0,r.kt)("a",{name:"yA6U0"}),"#### \u7528\u6237\u7ba1\u7406",(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u521b\u5efa\u7528\u6237\uff1aPOST\n/nacos/v1/auth/users?username=xx&password=yy"),(0,r.kt)("li",{parentName:"ul"},"\u5220\u9664\u7528\u6237\uff1aDELETE /nacos/v1/auth/users?username=xx&password=yy"),(0,r.kt)("li",{parentName:"ul"},"\u66f4\u65b0\u7528\u6237\uff1aPUT /nacos/v1/auth/users?username=xx&oldPassword=yy&newPassword=zz"),(0,r.kt)("li",{parentName:"ul"},"\u767b\u5f55\uff1aPOST\n/nacos/v1/auth/users/login?username=xxx&password=yyy")),(0,r.kt)("a",{name:"eHYVh"}),"#### \u89d2\u8272\u7ba1\u7406",(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u521b\u5efa\u89d2\u8272/\u7ed1\u5b9a\u7528\u6237\u5230\u89d2\u8272\uff1aPOST /nacos/v1/auth/roles?role=xx&username=yy"),(0,r.kt)("li",{parentName:"ul"},"\u5220\u9664\u67d0\u4e2a\u7528\u6237\u7684\u89d2\u8272\uff1aDELETE /nacos/v1/auth/roles?role=xx&username=yy"),(0,r.kt)("li",{parentName:"ul"},"\u83b7\u53d6\u7528\u6237\u7684\u6240\u6709\u89d2\u8272\uff1aGET /nacos/v1/auth/roles?username=xxx")),(0,r.kt)("a",{name:"SRZQx"}),"#### \u6743\u9650\u7ba1\u7406",(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u7ed9\u89d2\u8272\u6dfb\u52a0\u6743\u9650\uff1aPOST /nacos/v1/auth/permissions?role=xxx&resource=yyy&action=zzz"),(0,r.kt)("li",{parentName:"ul"},"\u4ece\u89d2\u8272\u5220\u9664\u6743\u9650\uff1aDELETE /nacos/v1/auth/permissions?role=xxx&resource=yyy&action=zzz"),(0,r.kt)("li",{parentName:"ul"},"\u83b7\u53d6\u67d0\u4e2a\u89d2\u8272\u7684\u6743\u9650\uff1aGET /nacos/v1/auth/permissions?role=xxx")),(0,r.kt)("a",{name:"Bb2oV"}),"## \u9875\u9762\u4ea4\u4e92 \u76ee\u524d\u7684\u8bbe\u8ba1\u65b9\u6848\u53ef\u4ee5\u652f\u6301\u6700\u5c0f\u5230dataId\u7ea7\u522b\u7684\u9274\u6743\uff0c\u4f46\u662f\u7c92\u5ea6\u8d8a\u7ec6\u5728\u9875\u9762\u7684\u5c55\u793a\u5c31\u4f1a\u8d8a\u590d\u6742\uff0c\u9700\u8981\u6bcf\u4e2a\u8d44\u6e90\u90fd\u53bb\u68c0\u67e5\u662f\u5426\u6709\u6743\u9650\u7136\u540e\u518d\u51b3\u5b9a\u662f\u5426\u5c55\u793a\uff0c\u5bf9\u4e8e\u6570\u636e\u91cf\u6bd4\u8f83\u5927\u7684\u60c5\u51b5\uff0c\u4f1a\u975e\u5e38\u5f71\u54cd\u670d\u52a1\u7aef\u7684\u6027\u80fd\u3002\u4e0d\u8fc7\u53ef\u4ee5\u80af\u5b9a\u7684\u662f\u4e00\u5b9a\u4f1a\u652f\u6301\u547d\u540d\u7a7a\u95f4\u7ea7\u522b\u7684\u8bfb\u5199\u6388\u6743\uff0c\u7528\u6237\u53ef\u4ee5\u5728\u9875\u9762\u914d\u7f6e\u5c06\u67d0\u4e2a\u547d\u540d\u7a7a\u95f4\u7684\u8bfb\u5199\u6743\u9650\u6388\u6743\u7ed9\u67d0\u4e00\u4e2a\u89d2\u8272\uff0c\u7136\u540e\u518d\u5c06\u8fd9\u4e2a\u89d2\u8272\u6388\u6743\u7ed9\u67d0\u4e2a\u7528\u6237\u3002\u81f3\u4e8e\u66f4\u7ec6\u7c92\u5ea6\u7684\u6388\u6743\uff0c\u53ef\u80fd\u8003\u8651\u4e0d\u652f\u6301\u6216\u8005\u57281.2.0\u4e4b\u540e\u7684\u7248\u672c\u652f\u6301\u3002",(0,r.kt)("a",{name:"PwF7l"}),"### \u7528\u6237\u7ba1\u7406 ![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1576225555266-ed32865d-95fb-4719-8d81-b25b55fbe711.png#align=left&display=inline&height=246&name=image.png&originHeight=370&originWidth=1120&size=137189&status=done&style=none&width=746)",(0,r.kt)("a",{name:"vEW9w"}),"### \u89d2\u8272\u7ba1\u7406",(0,r.kt)("p",null,(0,r.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/yuque/0/2019/png/333810/1576225984713-8134d131-a3b5-4000-8093-d8a793c8b461.png#align=left&display=inline&height=255&name=image.png&originHeight=378&originWidth=1106&size=134468&status=done&style=none&width=746",alt:"image.png"})),(0,r.kt)("a",{name:"TwHTX"}),"### \u6743\u9650\u7ba1\u7406",(0,r.kt)("p",null,(0,r.kt)("img",{parentName:"p",src:"https://cdn.nlark.com/yuque/0/2019/png/333810/1576226004009-ca20d92d-889d-4926-a0d7-f613013d0f59.png#align=left&display=inline&height=249&name=image.png&originHeight=412&originWidth=1232&size=164158&status=done&style=none&width=746",alt:"image.png"})),(0,r.kt)("a",{name:"t34hG"}),"## \u5173\u952e\u903b\u8f91",(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"\u6bcf\u4e2a\u6a21\u5757\u7ee7\u627fResourceParser\u6765\u5b9e\u73b0\u5404\u81ea\u6a21\u5757\u7684\u8d44\u6e90\u540d\u89e3\u6790\u5668\uff1a")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},"public interface ResourceParser {\n    // \u8f93\u5165\u4e3a\u8bf7\u6c42\u4fe1\u606f\uff0c\u8f93\u51fa\u4e3a\u4e00\u4e2a\u8d44\u6e90\u540d\uff1a\n    String parseResource(Object request);\n}\n")),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},"\u5728\u6bcf\u4e2a\u9700\u8981\u9274\u6743\u7684\u65b9\u6cd5\u4e0a\u6dfb\u52a0\u4e00\u4e2a\u6ce8\u89e3\uff0c\u6765\u6307\u5b9a\u8fd9\u4e2a\u65b9\u6cd5\u5bf9\u5e94\u7684\u8d44\u6e90\u540d\uff0c\u52a8\u4f5c\u53ca\u8d44\u6e90\u89e3\u6790\u5668\uff1a")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},"@Secured(resource=\u201cservice1\u201d,action=\u201cread\u201d, parser=NamingParser.class)\npublic void registerInstance() {\u2026}\n")),(0,r.kt)("p",null,"\u8fd9\u4e2a\u6ce8\u89e3\u7684\u4ecb\u7ecd\u5982\u4e0b\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},'@Retention(RetentionPolicy.RUNTIME)\npublic @interface Secured {\n    // \u52a8\u4f5c\u7c7b\u578b\uff0c\u9ed8\u8ba4\u4e3a\u8bfb\u7c7b\u578b\uff0c\u5168\u90e8\u7c7b\u578b\u6709CREAT|DELETE|READ|WRITE|ADMIN\n    ActionTypes action() default ActionTypes.READ;\n    // \u8d44\u6e90\u540d\uff0c\u53ef\u4ee5\u663e\u793a\u6307\u5b9a\u8d44\u6e90\u540d\uff0c\u5982\u4e0d\u6307\u5b9a\uff0c\u5c06\u7531\u8d44\u6e90\u89e3\u6790\u5668\u89e3\u6790\u51fa\u8d44\u6e90\u540d\n    String resource() default "";\n    // \u8d44\u6e90\u89e3\u6790\u5668\uff0c\u89e3\u6790\u8d44\u6e90\u540d\uff0c\u4f18\u5148\u7ea7\u6bd4name()\u4f4e\n    Class<? extends ResourceParser> parser() default DefaultResourceParser.class;\n}\n')),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"\u5728\u4e00\u4e2afilter\u91cc\u8fdb\u884c\u767b\u5f55\u548c\u9274\u6743\u7684\u903b\u8f91\uff0c\u901a\u8fc7\u83b7\u53d6\u6ce8\u89e3\u4e0a\u7684\u4fe1\u606f\u6765\u62ff\u5230\u8d44\u6e90\u548c\u52a8\u4f5c\uff0c\u4ecerequest\u91cc\u83b7\u53d6\u5230\u7528\u6237\u4fe1\u606f\uff0c\u7136\u540e\u8fdb\u884c\u9274\u6743\u3002")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},'// \u5224\u65ad\u662f\u5426\u9700\u8981\u9274\u6743\uff1a\nif (method.isAnnotationPresent(Secured.class) && authConfigs.isAuthEnabled()) {\n    Secured secured = method.getAnnotation(Secured.class);\n    // \u83b7\u53d6\u6ce8\u89e3\u91cc\u914d\u7f6e\u7684\u52a8\u4f5c\u7c7b\u578b\u548c\u8d44\u6e90\u540d\uff1a\n    String action = secured.action().toString();\n    String resource = secured.resource();\n    // \u82e5\u8d44\u6e90\u540d\u4e3a\u7a7a\uff0c\u8fdb\u884c\u8d44\u6e90\u89e3\u6790\uff1a\n    if (StringUtils.isBlank(resource)) {\n        ResourceParser parser = secured.parser().newInstance();\n        resource = parser.parseResource(req);\n    }\n    if (StringUtils.isBlank(resource)) {\n        // \u6ca1\u6709\u627e\u5230\u8d44\u6e90\uff0c\u5219\u76f4\u63a5\u8fd4\u56de:\n        throw new AccessException("resource name invalid!");\n    }\n    // \u5148\u8c03\u7528login\u8fdb\u884c\u8ba4\u8bc1\uff0c\u518d\u8c03\u7528auth\u8fdb\u884c\u9274\u6743\uff1a\n    authManager.auth(new Permission(resource, action), authManager.login(req));\n}\n')),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"\u9274\u6743\u63a5\u53e3\u62bd\u8c61\u5982\u4e0b\uff1a")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},"public interface AuthManager {\n\n    /**\n     * \u6839\u636e\u8bf7\u6c42\u8fdb\u884c\u7528\u6237\u8ba4\u8bc1\uff0c\u53ef\u4ee5\u7531\u7528\u6237\u8fdb\u884c\u6269\u5c55\n     */\n    User login(Object request) throws AccessException;\n\n    /**\n     * \u6839\u636e\u7528\u6237\u4fe1\u606f\u548c\u8bf7\u6c42\u7684\u6743\u9650\uff0c\u8fdb\u884c\u6388\u6743\uff0c\u4e5f\u53ef\u4ee5\u7531\u7528\u6237\u8fdb\u884c\u6269\u5c55\n     */\n    void auth(Permission permission, User user) throws AccessException;\n}\n")),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},"Nacos\u81ea\u5e26\u7684\u9274\u6743\u5b9e\u73b0\u903b\u8f91\u4ecb\u7ecd\u5982\u4e0b\uff1a")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},"public class NacosAuthManager implements AuthManager {\n\npublic User login(Object request) throws AccessException {\n        // \u4ece\u8bf7\u6c42\u4e2d\u83b7\u53d6\u7528\u6237\u4fe1\u606f\uff0c\u53ef\u4ee5\u4f20\u5165token\uff0c\u4e5f\u53ef\u4ee5\u4f20\u5165\u7528\u6237\u540d\u5bc6\u7801\u3002\n        // 1.\u4f20\u5165\u7528\u6237\u540d\u5bc6\u7801\u65f6\uff0c\u9a8c\u8bc1\u7528\u6237\u540d\u5bc6\u7801\uff0c\u751f\u6210\u65b0\u7684token\u653e\u5230User\u91cc\uff1b\n        // 2.\u4f20\u5165token\u65f6\uff0c\u9a8c\u8bc1token\u662f\u5426\u6709\u6548\uff1b\n}\n\npublic void auth(Permission permission, User user) throws AccessException {\n        // 1.\u4ece\u7528\u6237\u4fe1\u606f\u4e2d\u62ff\u5230\u89d2\u8272\u4fe1\u606f\n        // 2.\u4ece\u89d2\u8272\u4fe1\u606f\u4e2d\u83b7\u53d6\u6743\u9650\u5217\u8868\n        // 3.\u5339\u914d\u8bf7\u6c42\u7684\u6743\u9650\u662f\u5426\u5728\u6743\u9650\u5217\u8868\u91cc\n}\n")),(0,r.kt)("a",{name:"q40cy"}),"# \u53c2\u8003\u8d44\u6599 \u30101\u3011[https://zhuanlan.zhihu.com/p/70548562](https://zhuanlan.zhihu.com/p/70548562)",(0,r.kt)("br",null),"\u30102\u3011[https://learn.hashicorp.com/consul/security-networking/production-acls](https://learn.hashicorp.com/consul/security-networking/production-acls)",(0,r.kt)("br",null),"\u30103\u3011[https://zookeeper.apache.org/doc/r3.1.2/zookeeperProgrammers.html#sc_ZooKeeperAccessControl](https://zookeeper.apache.org/doc/r3.1.2/zookeeperProgrammers.html#sc_ZooKeeperAccessControl)")}m.isMDXComponent=!0}}]);