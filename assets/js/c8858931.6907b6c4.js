/*! For license information please see c8858931.6907b6c4.js.LICENSE.txt */
(self.webpackChunkNacos=self.webpackChunkNacos||[]).push([[5707],{1262:(e,t,n)=>{"use strict";n.d(t,{Z:()=>r});var a=n(7294),s=n(2389);function r(e){let{children:t,fallback:n}=e;return(0,s.Z)()?a.createElement(a.Fragment,null,t?.()):n??null}},5138:(e,t,n)=>{"use strict";n.d(t,{$Q:()=>m,N$:()=>c,zx:()=>l,$_:()=>b,iR:()=>h});var a=n(7294),s=n(4184),r=n.n(s),i=n(1876);const o={type:"primary",link:"",target:"_self",customStyle:{}},l=function(e){return void 0===e&&(e=o),a.createElement("a",{className:r()({button:!0,[`button-${e.type}`]:!0}),target:e.target||"_self",href:(0,i.Rg)(e.link,e.language),style:e.customStyle},e.children)},c=e=>a.createElement("div",{className:r()({bone:!0,[`bone-${e.type}`]:!0})}),m=e=>{const{text:t,img:n}=e,s=r()({bar:!0});return a.createElement("div",{className:s},a.createElement("div",{className:"bar-body"},a.createElement("img",{src:n,className:"front-img"}),a.createElement("div",{className:"bar-title"},a.createElement("span",null,t),a.createElement(c,{type:"light"})),a.createElement("img",{src:n,className:"back-img"})))};var d=n(3935);class u extends a.Component{constructor(e){super(e),this.container=null,this.state={screenIndex:0,visibleNum:1}}componentDidMount(){this.throttleAdjust=(0,i.P2)((()=>{this.setState({visibleNum:this.getVisibleNum()})}),200),window?.addEventListener?.("resize",this.throttleAdjust),this.setState({visibleNum:this.getVisibleNum()})}componentWillUnmount(){window?.removeEventListener?.("resize",this.throttleAdjust)}getVisibleNum=()=>{let e=3;const t=this.container?.getBoundingClientRect().width,n=this.sliderItemChild0?.getBoundingClientRect?this.sliderItemChild0?.getBoundingClientRect().width:d.findDOMNode(this.sliderItemChild0)?.getBoundingClientRect().width;return t&&n&&(e=Math.floor(t/n)),e||1};getListWidth=()=>{let e=0;const{children:t}=this.props,{visibleNum:n}=this.state,s=a.Children.count(t),r=Math.ceil(s/n);if(this.container){const t=this.container?.getBoundingClientRect().width;e=t*r}return e};changeScreen=e=>{const{screenIndex:t}=this.state;e!==t&&this.setState({screenIndex:e})};renderSliderList=()=>{const{children:e}=this.props,{screenIndex:t,visibleNum:n}=this.state,s=[],r=a.Children.count(e),i=Math.ceil(r/n);for(let a=0;a<i;a++)s.push(Array.from(e).slice(a*n,(a+1)*n));return a.createElement("div",{className:"slider-list",style:{transform:`translateX(-${t*(this.container&&this.container?.getBoundingClientRect().width||0)}px)`,transition:"transform 500ms ease",width:this.getListWidth()}},s.map(((e,t)=>a.createElement("div",{className:"slider-screen",style:{width:this.container&&this.container?.getBoundingClientRect().width||0},key:t,ref:e=>{this[`sliderScreen${t}`]=e}},e.map(((e,s)=>a.createElement("div",{className:"slider-item",key:s},a.cloneElement(e,{ref:e=>{this[`sliderItemChild${t*n+s}`]=e}}))))))))};renderControl=()=>{const{children:e}=this.props,{screenIndex:t,visibleNum:n}=this.state,s=a.Children.count(e),i=Math.ceil(s/n),o=[];for(let l=0;l<i;l++)o.push(a.createElement("span",{key:l,className:r()({"slider-control-item":!0,"slider-control-item-active":l===t}),onClick:this.changeScreen.bind(this,l)}));return a.createElement("div",{className:"slider-control"},o)};render(){return a.createElement("div",{className:"slider",ref:e=>{this.container=e}},this.renderSliderList(),this.renderControl())}}const h=u;a.Component;var g=n(5999),p=n(2263);const f={vision:{title:(0,g.I)({id:"homepage.footerVersionTitle",message:"\u613f\u666f"}),content:(0,g.I)({id:"homepage.footerVersionContent",message:"Nacos \u901a\u8fc7\u63d0\u4f9b\u7b80\u5355\u6613\u7528\u7684\u52a8\u6001\u670d\u52a1\u53d1\u73b0\u3001\u670d\u52a1\u914d\u7f6e\u3001\u670d\u52a1\u5171\u4eab\u4e0e\u7ba1\u7406\u7b49\u670d\u52a1\u57fa\u7840\u8bbe\u65bd\uff0c\u5e2e\u52a9\u7528\u6237\u5728\u4e91\u539f\u751f\u65f6\u4ee3\uff0c\u5728\u79c1\u6709\u4e91\u3001\u6df7\u5408\u4e91\u6216\u8005\u516c\u6709\u4e91\u7b49\u6240\u6709\u4e91\u73af\u5883\u4e2d\uff0c\u66f4\u597d\u7684\u6784\u5efa\u3001\u4ea4\u4ed8\u3001\u7ba1\u7406\u81ea\u5df1\u7684\u5fae\u670d\u52a1\u5e73\u53f0\uff0c\u66f4\u5feb\u7684\u590d\u7528\u548c\u7ec4\u5408\u4e1a\u52a1\u670d\u52a1\uff0c\u66f4\u5feb\u7684\u4ea4\u4ed8\u5546\u4e1a\u521b\u65b0\u7684\u4ef7\u503c\uff0c\u4ece\u800c\u4e3a\u7528\u6237\u8d62\u5f97\u5e02\u573a\u3002"})},documentation:{title:(0,g.I)({id:"homepage.footerDocTitle",message:"\u6587\u6863"}),list:[{text:(0,g.I)({id:"homepage.footerDocListText1",message:"\u6982\u89c8"}),link:"/docs/what-is-nacos",target:""},{text:(0,g.I)({id:"homepage.footerDocListText2",message:"\u5feb\u901f\u5f00\u59cb"}),link:"/docs/quick-start",target:""},{text:(0,g.I)({id:"homepage.footerDocListText3",message:"\u5f00\u53d1\u8005\u6307\u5357"}),link:"/docs/contributing",target:""}]},resources:{title:(0,g.I)({id:"homepage.footerResourcesTitle",message:"\u8d44\u6e90"}),list:[{text:(0,g.I)({id:"homepage.footerResourcesListText1",message:"\u793e\u533a"}),link:"/community",target:""},{text:(0,g.I)({id:"homepage.footerResourcesListText2",message:"\u4e91\u670d\u52a1 MSE"}),link:"//cn.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0",target:"_blank"},{text:(0,g.I)({id:"homepage.footerResourcesListText3",message:"\u4e91\u670d\u52a1 EDAS"}),link:"//www.aliyun.com/product/edas?source_type=nacos_pc_20181219",target:"_blank"}]},copyright:`Copyright \xa9 ${(new Date).getFullYear()} Nacos`},b=e=>{const{logo:t}=e,{i18n:n}=(0,p.Z)(),s=n.currentLocale;return a.createElement("footer",{className:"footer-container"},a.createElement("div",{className:"footer-body"},a.createElement("img",{src:e.logo}),a.createElement("div",{className:"cols-container"},a.createElement("div",{className:"col col-12"},a.createElement("h3",null,f.vision.title),a.createElement("p",null,f.vision.content)),a.createElement("div",{className:"col col-6"},a.createElement("dl",null,a.createElement("dt",null,f.documentation.title),f.documentation.list.map(((e,t)=>a.createElement("dd",{key:t},a.createElement("a",{href:`/${s}${e.link}`,target:e.target||"_self"},e.text)))))),a.createElement("div",{className:"col col-6"},a.createElement("dl",null,a.createElement("dt",null,f.resources.title),f.resources.list.map(((e,t)=>a.createElement("dd",{key:t},a.createElement("a",{href:`/${s}${e.link}`,target:e.target||"_self"},e.text))))))),a.createElement("div",{className:"copyright"},a.createElement("span",null,f.copyright))))}},8726:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>c});var a=n(7294),s=n(5999),r=n(5138),i=n(1876),o=n(1262);const l={brandName:"Nacos",briefIntroduction:(0,s.I)({id:"homepage.briefIntroduction",message:"\u4e00\u4e2a\u66f4\u6613\u4e8e\u6784\u5efa\u4e91\u539f\u751f\u5e94\u7528\u7684\u52a8\u6001\u670d\u52a1\u53d1\u73b0\u3001\u914d\u7f6e\u7ba1\u7406\u548c\u670d\u52a1\u7ba1\u7406\u5e73\u53f0\u3002"}),buttons:[{text:(0,s.I)({id:"homepage.togithubText",message:"\u524d\u5f80 Github"}),link:"https://github.com/alibaba/nacos",type:"primary",target:"_blank"},{text:(0,s.I)({id:"homepage.bookText",message:"\u624b\u518c"}),link:"/docs/v2/what-is-nacos.html",type:"normal"}],versionNote:{text:(0,s.I)({id:"homepage.latest-version",message:"V2.3.0-BETA \u7248\u672c\u8bf4\u660e"}),link:"https://github.com/alibaba/nacos/releases/tag/2.3.0"},versionNote2:{text:(0,s.I)({id:"homepage.1x-version",message:"V1.4.6"}),link:"https://github.com/alibaba/nacos/releases/tag/1.4.6"},releaseDate:{text:(0,s.I)({id:"homepage.pubTime",message:"2023\u5e7410\u670819\u65e5\u53d1\u5e03"})}},c=e=>{let{language:t}=e;const[n,s]=a.useState({starCount:"",forkCount:""}),{starCount:c,forkCount:m}=n;return a.useEffect((()=>{fetch("https://api.github.com/repos/alibaba/nacos").then((e=>e.json())).then((e=>{s({starCount:`${e.stargazers_count}`,forkCount:`${e.forks_count}`})}))}),[]),a.createElement(o.Z,null,(()=>a.createElement("section",{className:"top-section",style:{background:`url(${(0,i.Rg)("img/black_dot.png")}) repeat`,backgroundSize:"14px 14px"}},a.createElement("div",{className:"vertical-middle"},a.createElement("img",{className:"product-logo",src:(0,i.Rg)("img/nacos.png")}),a.createElement("p",{className:"product-desc"},l.briefIntroduction),a.createElement("div",{className:"button-area"},l.buttons.map((e=>a.createElement(r.zx,{type:e.type,key:e.type,link:e.link,target:e.target,language:t},e.text)))),a.createElement("div",{className:"github-buttons"},a.createElement("a",{href:"https://github.com/alibaba/nacos",target:"_blank",rel:"noopener noreferrer"},a.createElement("div",{className:"star"},a.createElement("img",{src:"https://img.alicdn.com/tfs/TB1FlB1JwHqK1RjSZFPXXcwapXa-32-32.png"}),a.createElement("span",{className:"count"},c))),a.createElement("a",{href:"https://github.com/alibaba/nacos/fork",target:"_blank",rel:"noopener noreferrer"},a.createElement("div",{className:"fork"},a.createElement("img",{src:"https://img.alicdn.com/tfs/TB1zbxSJwDqK1RjSZSyXXaxEVXa-32-32.png"}),a.createElement("span",{className:"count"},m)))),a.createElement("div",{className:"version-note"},a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:(0,i.Rg)(l.versionNote.link)},l.versionNote.text),a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:(0,i.Rg)(l.versionNote2.link)},l.versionNote2.text)),a.createElement("div",{className:"release-date"},l.releaseDate.text)),a.createElement("div",{className:"animation animation1"}),a.createElement("div",{className:"animation animation2"}),a.createElement("div",{className:"animation animation3"}),a.createElement("div",{className:"animation animation4"}),a.createElement("div",{className:"animation animation5"}))))}},1876:(e,t,n)=>{"use strict";n.d(t,{P2:()=>a,Rg:()=>s});const a=(e,t)=>{let n=null;return function(){for(var a=arguments.length,s=new Array(a),r=0;r<a;r++)s[r]=arguments[r];const i=this;clearTimeout(n),n=setTimeout((()=>{e.apply(i,s)}),t)}},s=(e,t)=>`${e}`.length>1&&/^\/[^/]/.test(`${e}`)?void 0===t?`${window.rootPath||""}${"default"===t?"/zh-cn":""}${e}`:`${window.rootPath||""}${"default"===t?"/zh-cn":`/${t}`}${e}`:e},4184:(e,t)=>{var n;!function(){"use strict";var a={}.hasOwnProperty;function s(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var r=typeof n;if("string"===r||"number"===r)e.push(n);else if(Array.isArray(n)){if(n.length){var i=s.apply(null,n);i&&e.push(i)}}else if("object"===r){if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]")){e.push(n.toString());continue}for(var o in n)a.call(n,o)&&n[o]&&e.push(o)}}}return e.join(" ")}e.exports?(s.default=s,e.exports=s):void 0===(n=function(){return s}.apply(t,[]))||(e.exports=n)}()}}]);