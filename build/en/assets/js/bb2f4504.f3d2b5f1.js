"use strict";(self.webpackChunkNacos=self.webpackChunkNacos||[]).push([[4128],{3905:(n,e,t)=>{t.d(e,{Zo:()=>d,kt:()=>m});var o=t(67294);function c(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function r(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,o)}return t}function l(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?r(Object(t),!0).forEach((function(e){c(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function a(n,e){if(null==n)return{};var t,o,c=function(n,e){if(null==n)return{};var t,o,c={},r=Object.keys(n);for(o=0;o<r.length;o++)t=r[o],e.indexOf(t)>=0||(c[t]=n[t]);return c}(n,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);for(o=0;o<r.length;o++)t=r[o],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(c[t]=n[t])}return c}var p=o.createContext({}),i=function(n){var e=o.useContext(p),t=e;return n&&(t="function"==typeof n?n(e):l(l({},e),n)),t},d=function(n){var e=i(n.components);return o.createElement(p.Provider,{value:e},n.children)},u="mdxType",s={inlineCode:"code",wrapper:function(n){var e=n.children;return o.createElement(o.Fragment,{},e)}},f=o.forwardRef((function(n,e){var t=n.components,c=n.mdxType,r=n.originalType,p=n.parentName,d=a(n,["components","mdxType","originalType","parentName"]),u=i(t),f=c,m=u["".concat(p,".").concat(f)]||u[f]||s[f]||r;return t?o.createElement(m,l(l({ref:e},d),{},{components:t})):o.createElement(m,l({ref:e},d))}));function m(n,e){var t=arguments,c=e&&e.mdxType;if("string"==typeof n||c){var r=t.length,l=new Array(r);l[0]=f;var a={};for(var p in e)hasOwnProperty.call(e,p)&&(a[p]=e[p]);a.originalType=n,a[u]="string"==typeof n?n:c,l[1]=a;for(var i=2;i<r;i++)l[i]=t[i];return o.createElement.apply(null,l)}return o.createElement.apply(null,t)}f.displayName="MDXCreateElement"},77896:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>p,contentTitle:()=>l,default:()=>s,frontMatter:()=>r,metadata:()=>a,toc:()=>i});var o=t(87462),c=(t(67294),t(3905));const r={},l=void 0,a={permalink:"/en/blog/nacos-confd",source:"@site/i18n/en/docusaurus-plugin-content-blog/nacos-confd.md",title:"nacos-confd",description:"\u4e3a\u4ec0\u4e48\u8981\u652f\u6301confd\uff0c\u8001\u7684\u5e94\u7528\u914d\u7f6e\u7ba1\u7406\u6a21\u5f0f\u662f\u542f\u52a8\u65f6\u8bfb\u53d6\u914d\u7f6e\u6587\u4ef6\uff0c\u7136\u540e\u91cd\u65b0\u8bfb\u53d6\u914d\u7f6e\u6587\u4ef6\u9700\u8981\u5e94\u7528\u91cd\u542f\u3002\u4e00\u822c\u7684\u914d\u7f6e\u7ba1\u7406\u7cfb\u7edf\u90fd\u662f\u4ee3\u7801\u4fb5\u5165\u6027\u7684\uff0c\u5e94\u7528\u63a5\u5165\u914d\u7f6e\u7ba1\u7406\u7cfb\u7edf\u90fd\u9700\u8981\u4f7f\u7528\u5bf9\u5e94\u7684SDK\u6765\u67e5\u8be2\u548c\u76d1\u542c\u6570\u636e\u7684\u53d8\u66f4\u3002\u5bf9\u4e8e\u4e00\u4e9b\u5df2\u7ecf\u6210\u719f\u7684\u7cfb\u7edf\u6765\u8bf4\uff0c\u63a5\u5165SDK\u6765\u5b9e\u73b0\u52a8\u6001\u914d\u7f6e\u7ba1\u7406\u662f\u5f88\u96be\u5b9e\u73b0\u7684\uff0cNacos\u901a\u8fc7\u5f15\u5165\u914d\u7f6e\u7ba1\u7406\u5de5\u5177confd\u53ef\u4ee5\u5b9e\u73b0\u7cfb\u7edf\u7684\u914d\u7f6e\u53d8\u66f4\u505a\u5230\u65e0\u4ee3\u7801\u4fb5\u5165\u6027\u3002",date:"2023-10-10T11:47:41.000Z",formattedDate:"October 10, 2023",tags:[],readingTime:5.57,hasTruncateMarker:!1,authors:[],frontMatter:{},prevItem:{title:"Nacos \u4e24\u5468\u5e74\u732e\u793c\uff0cNacos 1.3.2 + Go SDK 1.0.0\u53d1\u5e03",permalink:"/en/blog/nacos-2nd-anniversary"},nextItem:{title:"nacos-distro-mechanism",permalink:"/en/blog/nacos-distro-mechanism"}},p={authorsImageUrls:[]},i=[{value:"\u5b89\u88c5confd\u63d2\u4ef6",id:"\u5b89\u88c5confd\u63d2\u4ef6",level:2},{value:"confd\u7ed3\u5408Nacos\u5b9e\u73b0nginx\u914d\u7f6e\u7ba1\u7406\u793a\u4f8b",id:"confd\u7ed3\u5408nacos\u5b9e\u73b0nginx\u914d\u7f6e\u7ba1\u7406\u793a\u4f8b",level:2},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],d={toc:i},u="wrapper";function s(n){let{components:e,...t}=n;return(0,c.kt)(u,(0,o.Z)({},d,t,{components:e,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"\u4e3a\u4ec0\u4e48\u8981\u652f\u6301confd\uff0c\u8001\u7684\u5e94\u7528\u914d\u7f6e\u7ba1\u7406\u6a21\u5f0f\u662f\u542f\u52a8\u65f6\u8bfb\u53d6\u914d\u7f6e\u6587\u4ef6\uff0c\u7136\u540e\u91cd\u65b0\u8bfb\u53d6\u914d\u7f6e\u6587\u4ef6\u9700\u8981\u5e94\u7528\u91cd\u542f\u3002\u4e00\u822c\u7684\u914d\u7f6e\u7ba1\u7406\u7cfb\u7edf\u90fd\u662f\u4ee3\u7801\u4fb5\u5165\u6027\u7684\uff0c\u5e94\u7528\u63a5\u5165\u914d\u7f6e\u7ba1\u7406\u7cfb\u7edf\u90fd\u9700\u8981\u4f7f\u7528\u5bf9\u5e94\u7684SDK\u6765\u67e5\u8be2\u548c\u76d1\u542c\u6570\u636e\u7684\u53d8\u66f4\u3002\u5bf9\u4e8e\u4e00\u4e9b\u5df2\u7ecf\u6210\u719f\u7684\u7cfb\u7edf\u6765\u8bf4\uff0c\u63a5\u5165SDK\u6765\u5b9e\u73b0\u52a8\u6001\u914d\u7f6e\u7ba1\u7406\u662f\u5f88\u96be\u5b9e\u73b0\u7684\uff0cNacos\u901a\u8fc7\u5f15\u5165\u914d\u7f6e\u7ba1\u7406\u5de5\u5177confd\u53ef\u4ee5\u5b9e\u73b0\u7cfb\u7edf\u7684\u914d\u7f6e\u53d8\u66f4\u505a\u5230\u65e0\u4ee3\u7801\u4fb5\u5165\u6027\u3002"),(0,c.kt)("p",null,"confd\u662f\u4e00\u4e2a\u8f7b\u91cf\u7ea7\u7684\u914d\u7f6e\u7ba1\u7406\u5de5\u5177\uff0c\u53ef\u4ee5\u901a\u8fc7\u67e5\u8be2\u540e\u7aef\u5b58\u50a8\u7cfb\u7edf\u6765\u5b9e\u73b0\u7b2c\u4e09\u65b9\u7cfb\u7edf\u7684\u52a8\u6001\u914d\u7f6e\u7ba1\u7406\uff0c\u5982Nginx\u3001Tomcat\u3001HAproxy\u3001Docker\u914d\u7f6e\u7b49\u3002confd\u76ee\u524d\u652f\u6301\u7684\u540e\u7aef\u6709etcd\u3001ZooKeeper\u7b49\uff0cNacos\n1.1\u7248\u672c\u901a\u8fc7\u5bf9confd\u5b9a\u5236\u652f\u6301Nacos\u4f5c\u4e3a\u540e\u7aef\u5b58\u50a8\u3002"),(0,c.kt)("p",null,"confd\u80fd\u591f\u67e5\u8be2\u548c\u76d1\u542c\u540e\u7aef\u7cfb\u7edf\u7684\u6570\u636e\u53d8\u66f4\uff0c\u7ed3\u5408\u914d\u7f6e\u6a21\u7248\u5f15\u64ce\u52a8\u6001\u66f4\u65b0\u672c\u5730\u914d\u7f6e\u6587\u4ef6\uff0c\u4fdd\u6301\u548c\u540e\u7aef\u7cfb\u7edf\u7684\u6570\u636e\u4e00\u81f4\uff0c\u5e76\u4e14\u80fd\u591f\u6267\u884c\u547d\u4ee4\u6216\u8005\u811a\u672c\u5b9e\u73b0\u7cfb\u7edf\u7684reload\u6216\u8005\u91cd\u542f\u3002"),(0,c.kt)("h2",{id:"\u5b89\u88c5confd\u63d2\u4ef6"},"\u5b89\u88c5confd\u63d2\u4ef6"),(0,c.kt)("p",null,"confd\u7684\u5b89\u88c5\u53ef\u4ee5\u901a\u8fc7\u6e90\u7801\u5b89\u88c5\u65b9\u5f0f\uff0cconfd\u57fa\u4e8eGo\u8bed\u8a00\u7f16\u5199\uff0c\u5176\u7f16\u8bd1\u5b89\u88c5\u4f9d\u8d56Go\uff0c\u9996\u5148\u9700\u8981\u786e\u4fdd\u672c\u5730\u5b89\u88c5\u4e86Go\uff0c\u7248\u672c\u4e0d\u4f4e\u4e8ev1.10\n\u521b\u5efaconfd\u76ee\u5f55\uff0c\u4e0b\u8f7dconfd\u6e90\u7801\uff0c\u7f16\u8bd1\u751f\u6210\u53ef\u6267\u884c\u6587\u4ef6"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"mkdir -p $GOPATH/src/github.com/kelseyhightower\ncd $GOPATH/src/github.com/kelseyhightower\nwget https://github.com/nacos-group/nacos-confd/archive/v0.19.1.tar.gz\ntar -xvf v0.19.1.tar.gz\nmv nacos-confd-0.19.1 confd\ncd confd\nmake\n")),(0,c.kt)("p",null,"\u590d\u5236confd\u6587\u4ef6\u5230bin\u76ee\u5f55\u4e0b\uff0c\u542f\u52a8confd"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"sudo cp bin/confd /usr/local/bin\nconfd\n")),(0,c.kt)("h2",{id:"confd\u7ed3\u5408nacos\u5b9e\u73b0nginx\u914d\u7f6e\u7ba1\u7406\u793a\u4f8b"},"confd\u7ed3\u5408Nacos\u5b9e\u73b0nginx\u914d\u7f6e\u7ba1\u7406\u793a\u4f8b"),(0,c.kt)("p",null,"\u672c\u6587\u4ecb\u7ecd\u4f7f\u7528Nacos\u7ed3\u5408confd\u5b9e\u73b0Nginx\u914d\u7f6e\u7ba1\u7406\uff0c\u4e3a\u7b80\u5355\u8d77\u89c1\u4ee5Nginx\u7684\u9ed1\u540d\u5355\u529f\u80fd\u4e3a\u6f14\u793a\u793a\u4f8b\uff0cNacos\u4f7f\u7528\u5b98\u7f51\u90e8\u7f72\u7684\u670d\u52a1\uff0c\u57df\u540d\u4e3aconsole.nacos.io\u3002Nginx\u7684\u5b89\u88c5\u53ef\u4ee5\u53c2\u8003\u7f51\u4e0a\u6587\u7ae0"),(0,c.kt)("p",null,(0,c.kt)("img",{parentName:"p",src:"https://img.alicdn.com/tfs/TB1X_KhdUz1gK0jSZLeXXb9kVXa-720-405.jpg",alt:"image"})),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"1.\u521b\u5efaconfd\u6240\u9700\u76ee\u5f55")),(0,c.kt)("p",null,"confd\u914d\u7f6e\u6587\u4ef6\u9ed8\u8ba4\u5728/etc/confd\u4e2d\uff0c\u53ef\u4ee5\u901a\u8fc7\u53c2\u6570-confdir\u6307\u5b9a\u3002\u76ee\u5f55\u4e2d\u5305\u542b\u4e24\u4e2a\u5b50\u76ee\u5f55\uff0c\u5206\u522b\u662f\uff1aconf.d templates"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"mkdir -p /etc/confd/{conf.d,templates}\n")),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"2.\u521b\u5efaconfd\u914d\u7f6e\u6587\u4ef6")),(0,c.kt)("p",null,"confd\u4f1a\u5148\u8bfb\u53d6conf.d\u76ee\u5f55\u4e2d\u7684\u914d\u7f6e\u6587\u4ef6(toml\u683c\u5f0f)\uff0c\u7136\u540e\u6839\u636e\u6587\u4ef6\u6307\u5b9a\u7684\u6a21\u677f\u8def\u5f84\u53bb\u6e32\u67d3\u6a21\u677f\u3002"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"vim /etc/confd/conf.d/nginx.toml\n")),(0,c.kt)("p",null,"\u5185\u5bb9\u4e3a\u5982\u4e0b\uff0c\u5176\u4e2dnginx.conf.tmpl\u6587\u4ef6\u4e3aconfd\u7684\u6a21\u7248\u6587\u4ef6\uff0ckeys\u4e3a\u6a21\u7248\u6e32\u67d3\u6210\u914d\u7f6e\u6587\u4ef6\u6240\u9700\u7684\u914d\u7f6e\u5185\u5bb9\uff0c/usr/local/nginx/conf/nginx.conf\u4e3a\u751f\u6210\u7684\u914d\u7f6e\u6587\u4ef6"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},'[template]\nsrc = " nginx.conf.tmpl"\ndest =\n"/usr/local/nginx/conf/nginx.conf"\nkeys = [\n"/nginx/conf",\n]\ncheck_cmd = "/usr/local/nginx/sbin/nginx -t\n-c {{.src}}"\nreload_cmd = "/usr/local/nginx/sbin/nginx\n-s reload"\n')),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"3.\u521b\u5efa\u6a21\u7248\u6587\u4ef6")),(0,c.kt)("p",null,"\u62f7\u8d1dNginx\u539f\u59cb\u7684\u914d\u7f6e\uff0c\u589e\u52a0\u5bf9\u5e94\u7684\u6e32\u67d3\u5185\u5bb9"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"cp /usr/local/nginx/conf/nginx.conf\n/etc/confd/templates/nginx.conf.tmpl\nvim /etc/confd/templates/nginx.conf.tmpl\n")),(0,c.kt)("p",null,"\u589e\u52a0\u5185\u5bb9\u4e3a:"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},'\xb7\xb7\xb7\n{{$data := json (getv "/nginx/conf")}}\n{{range $data.blackList}}\ndeny {{.}};\n{{end}}\n\xb7\xb7\xb7\n')),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"4.\u5728Nacos\u4e0a\u521b\u5efa\u6240\u9700\u7684\u914d\u7f6e\u6587\u4ef6")),(0,c.kt)("p",null,"\u5728public\u547d\u540d\u7a7a\u95f4\u521b\u5efadataId\u4e3anginx.conf\u7684\u914d\u7f6e\u6587\u4ef6\uff0cgroup\u4f7f\u7528\u9ed8\u8ba4\u7684DEFAULT_GROUP\u5373\u53ef\uff0c\u914d\u7f6e\u5185\u5bb9\u4e3ajson\u683c\u5f0f"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},'{\n"blackList":["10.0.1.104","10.0.1.103"]\n}\n')),(0,c.kt)("p",null,(0,c.kt)("img",{parentName:"p",src:"https://img.alicdn.com/tfs/TB1PSKwdKP2gK0jSZFoXXauIVXa-1986-1024.png",alt:"image"})),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"5.\u542f\u52a8confd")),(0,c.kt)("p",null,"\u542f\u52a8confd\uff0c\u4eceNacos\u83b7\u53d6\u914d\u7f6e\u6587\u4ef6\uff0c\u6e32\u67d3Nginx\u914d\u7f6e\u6587\u4ef6\u3002backend\u8bbe\u7f6e\u6210nacos\uff0cnode\u6307\u5b9a\u8bbf\u95ee\u7684Nacos\u670d\u52a1\u5730\u5740\uff0cwatch\u8ba9confd\u652f\u6301\u52a8\u6001\u76d1\u542c"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"confd -backend nacos -node http://console.nacos.io:80 -watch\n")),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"6.\u67e5\u770bNginx\u914d\u7f6e\u6587\u4ef6\uff0c\u9a8c\u8bc1Nginx\u542f\u52a8")),(0,c.kt)("p",null,"\u67e5\u770b\u751f\u6210\u7684/usr/local/nginx/conf/nginx.conf\u914d\u7f6e\u6587\u4ef6\u662f\u5426\u5b58\u5728\u5982\u4e0b\u5185\u5bb9"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"...\ndeny 10.0.1.104;\n\ndeny 10.0.1.103;\n...\n")),(0,c.kt)("p",null,"curl\u547d\u4ee4\u8bbf\u95eeNginx\uff0c\u9a8c\u8bc1\u662f\u5426\u8fd4\u56de\u6b63\u5e38\u3002http\u54cd\u5e94\u72b6\u6001\u7801\u4e3a200\u8bf4\u660e\u8bbf\u95eeNginx\u6b63\u5e38"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"curl http://$IP:8080/ -i\nHTTP/1.1 200 OK\n...\n")),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"7.\u67e5\u770b\u672c\u673aIp\uff0c\u52a0\u5230Nacos\u914d\u7f6e\u6587\u4ef6\u9ed1\u540d\u5355\u4e2d")),(0,c.kt)("p",null,"\u5047\u8bbe\u672c\u673a\u7684Ip\u4e3a30.5.125.107\uff0c\u5c06\u672c\u673a\u7684Ip\u52a0\u5165\u5230Nginx\u9ed1\u540d\u5355"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},'{\n"blackList":["10.0.1.104","10.0.1.103","30.5.125.107"]\n}\n')),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"8.\u67e5\u770bNginx\u914d\u7f6e\u6587\u4ef6\uff0c\u9a8c\u8bc1\u9ed1\u540d\u5355\u662f\u5426\u751f\u6548")),(0,c.kt)("p",null,"\u67e5\u770b\u751f\u6210\u7684/usr/local/nginx/conf/nginx.conf\u914d\u7f6e\u6587\u4ef6\u662f\u5426\u5b58\u5728\u5982\u4e0b\u5185\u5bb9"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"...\ndeny 10.0.1.104;\n\ndeny 10.0.1.103;\n\ndeny 30.5.125.107;\n...\n")),(0,c.kt)("p",null,"curl\u547d\u4ee4\u8bbf\u95eeNginx\uff0c\u8bbf\u95ee\u5e94\u8be5\u88ab\u62d2\u7edd\uff0c\u8fd4\u56de403"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"curl http://$IP:8080/ -i\nHTTP/1.1 403 Forbidden\n...\n")),(0,c.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,c.kt)("p",null,"\u672c\u6587\u4ecb\u7ecd\u4e86\u4f7f\u7528Nacos\u7ed3\u5408confd\u6765\u505a\u81ea\u52a8\u5316\u7ba1\u7406\uff0cconfd\u4f5c\u4e3a\u8f7b\u91cf\u7ea7\u7684\u914d\u7f6e\u7ba1\u7406\u5de5\u5177\u53ef\u4ee5\u505a\u5230\u5bf9\u7b2c\u4e09\u65b9\u7cfb\u7edf\u65e0\u4ee3\u7801\u4fb5\u5165\u6027\u3002\u672c\u6587\u53ea\u662f\u7b80\u5355\u4f7f\u7528Nginx\u7684\u9ed1\u540d\u5355\u529f\u80fd\u6765\u6f14\u793aNacos+confd\u7684\u4f7f\u7528\u65b9\u5f0f\uff0c\u5f53\u7136Nginx\u8fd8\u5177\u6709\u9650\u6d41\u3001\u53cd\u5411\u4ee3\u7406\u7b49\u529f\u80fd\u4ee5\u53ca\u5176\u4ed6\u7684\u7cfb\u7edf\u6bd4\u5982Naproxy\u3001Tomcat\u3001Docker\u7b49\u4e5f\u540c\u6837\u53ef\u4ee5\u4f7f\u7528Nacos+confd\u505a\u7ba1\u7406\uff0c\u5927\u5bb6\u53ef\u4ee5\u5230Nacos",(0,c.kt)("a",{parentName:"p",href:"https://nacos.io"},"\u5b98\u7f51"),"\u8d21\u732e\u76f8\u5e94\u7684demo\u6216\u8005\u65b9\u6848\u3002"))}s.isMDXComponent=!0}}]);