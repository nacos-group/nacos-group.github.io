import{i as U}from"./index.PDhEm6KS.js";window.dataLayer=window.dataLayer||[];function O(){dataLayer.push(arguments)}O("js",new Date);O("config","G-0YDFJ7LX7F");(function(){var t=document.createElement("script");t.src="https://hm.baidu.com/hm.js?e3a5cec56ef8619cf9d7c2abebd509e3";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)})();(function(t,e,n,o,s){t[o]=t[o]||[];var c=e.getElementsByTagName(n)[0],a=e.createElement(n);a.async=!0,a.id="beacon-aplus",a.setAttribute("exparams","userid=&aplus&sidx=aplusSidex&ckx=aplusCkx"),a.src="//g.alicdn.com/alilog/mlog/aplus_v2.js",a.crossorigin="anonymous",c.parentNode.insertBefore(a,c)})(window,document,"script","aplus_queue");(function(t){var e=t.createElement("script");e.type="text/javascript",e.async=!0,e.src="//g.alicdn.com/aes/??tracker/3.3.4/index.js,tracker-plugin-pv/3.0.5/index.js,tracker-plugin-event/3.0.0/index.js,tracker-plugin-autolog/3.0.3/index.js,tracker-plugin-survey/3.0.3/index.js,tracker-plugin-jserror/3.0.3/index.js,tracker-plugin-resourceError/3.0.3/index.js",e.onload=function(){window.location.hostname==="nacos.io"&&(window.AES_CONFIG=window.AES_CONFIG||{env:"prod"},window.aes=new AES({pid:"e7WQkK",user_type:6}),window.AESPluginAutologConfig={exposure:"auto"},window.AEMPluginInstances=[aes.use(AESPluginPV,window.AESPluginPVConfig||{enableHistory:!0}),aes.use(AESPluginEvent,window.AESPluginEventConfig||{}),aes.use(AESPluginSurvey,window.AESPluginEventConfig||{}),aes.use(AESPluginAutolog,window.AESPluginAutologConfig||{}),aes.use(AESPluginJSError,window.AESPluginJSError||{}),aes.use(AESPluginResourceError,window.AESPluginResourceError||{})])},setTimeout(function(){t.getElementsByTagName("body")[0].appendChild(e)},800)})(document);class X extends HTMLElement{ifscroll;constructor(){super(),this.ifscroll=!1,window.addEventListener("scroll",this.handleScroll)}handleScroll=()=>{window.innerWidth<=800||(window.scrollY>=100&&!this.ifscroll&&(this.ifscroll=!0,this.classList.add("bg-gray-14/[0.84]")),window.scrollY<=100&&this.ifscroll&&(this.ifscroll=!1,this.classList.remove("bg-gray-14/[0.84]")))}}customElements.define("header-layout",X);const W="astro:before-preparation",V="astro:after-preparation",K="astro:before-swap",G="astro:after-swap",J=t=>document.dispatchEvent(new Event(t));class I extends Event{from;to;direction;navigationType;sourceElement;info;newDocument;constructor(e,n,o,s,c,a,d,r,f){super(e,n),this.from=o,this.to=s,this.direction=c,this.navigationType=a,this.sourceElement=d,this.info=r,this.newDocument=f,Object.defineProperties(this,{from:{enumerable:!0},to:{enumerable:!0,writable:!0},direction:{enumerable:!0,writable:!0},navigationType:{enumerable:!0},sourceElement:{enumerable:!0},info:{enumerable:!0},newDocument:{enumerable:!0,writable:!0}})}}class Q extends I{formData;loader;constructor(e,n,o,s,c,a,d,r,f){super(W,{cancelable:!0},e,n,o,s,c,a,d),this.formData=r,this.loader=f.bind(this,this),Object.defineProperties(this,{formData:{enumerable:!0},loader:{enumerable:!0,writable:!0}})}}class z extends I{direction;viewTransition;swap;constructor(e,n,o){super(K,void 0,e.from,e.to,e.direction,e.navigationType,e.sourceElement,e.info,e.newDocument),this.direction=e.direction,this.viewTransition=n,this.swap=o.bind(this,this),Object.defineProperties(this,{direction:{enumerable:!0},viewTransition:{enumerable:!0},swap:{enumerable:!0,writable:!0}})}}async function Z(t,e,n,o,s,c,a,d){const r=new Q(t,e,n,o,s,c,window.document,a,d);return document.dispatchEvent(r)&&(await r.loader(),r.defaultPrevented||(J(V),r.navigationType!=="traverse"&&S({scrollX,scrollY}))),r}async function ee(t,e,n){const o=new z(t,e,n);return document.dispatchEvent(o),o.swap(),o}const te=history.pushState.bind(history),T=history.replaceState.bind(history),S=t=>{history.state&&(history.scrollRestoration="manual",T({...history.state,...t},""))},x=!!document.startViewTransition,P=()=>!!document.querySelector('[name="astro-view-transitions-enabled"]'),N=(t,e)=>t.pathname===e.pathname&&t.search===e.search;let v,p,A=!1,q;const F=t=>document.dispatchEvent(new Event(t)),C=()=>F("astro:page-load"),ne=()=>{let t=document.createElement("div");t.setAttribute("aria-live","assertive"),t.setAttribute("aria-atomic","true"),t.className="astro-route-announcer",document.body.append(t),setTimeout(()=>{let e=document.title||document.querySelector("h1")?.textContent||location.pathname;t.textContent=e},60)},g="data-astro-transition-persist",_="data-astro-transition",j="data-astro-transition-fallback";let D,b=0;history.state?(b=history.state.index,scrollTo({left:history.state.scrollX,top:history.state.scrollY})):P()&&(T({index:b,scrollX,scrollY},""),history.scrollRestoration="manual");const oe=(t,e)=>{let n=!1,o=!1;return(...s)=>{if(n){o=!0;return}t(...s),n=!0,setTimeout(()=>{o&&(o=!1,t(...s)),n=!1},e)}};async function se(t,e){try{const n=await fetch(t,e),s=(n.headers.get("content-type")??"").split(";",1)[0].trim();return s!=="text/html"&&s!=="application/xhtml+xml"?null:{html:await n.text(),redirected:n.redirected?n.url:void 0,mediaType:s}}catch{return null}}function B(){const t=document.querySelector('[name="astro-view-transitions-fallback"]');return t?t.getAttribute("content"):"animate"}function re(){let t=Promise.resolve();for(const e of Array.from(document.scripts)){if(e.dataset.astroExec==="")continue;const n=e.getAttribute("type");if(n&&n!=="module"&&n!=="text/javascript")continue;const o=document.createElement("script");o.innerHTML=e.innerHTML;for(const s of e.attributes){if(s.name==="src"){const c=new Promise(a=>{o.onload=o.onerror=a});t=t.then(()=>c)}o.setAttribute(s.name,s.value)}o.dataset.astroExec="",e.replaceWith(o)}return t}const $=(t,e,n,o,s)=>{const c=N(e,t),a=document.title;document.title=o;let d=!1;if(t.href!==location.href&&!s)if(n.history==="replace"){const r=history.state;T({...n.state,index:r.index,scrollX:r.scrollX,scrollY:r.scrollY},"",t.href)}else te({...n.state,index:++b,scrollX:0,scrollY:0},"",t.href);if(v=t,c||(scrollTo({left:0,top:0,behavior:"instant"}),d=!0),s)scrollTo(s.scrollX,s.scrollY);else{if(t.hash){history.scrollRestoration="auto";const r=history.state;location.href=t.href,history.state||T(r,"")}else d||scrollTo({left:0,top:0,behavior:"instant"});history.scrollRestoration="manual"}document.title=a};function ie(t){const e=[];for(const n of t.querySelectorAll("head link[rel=stylesheet]"))if(!document.querySelector(`[${g}="${n.getAttribute(g)}"], link[rel=stylesheet][href="${n.getAttribute("href")}"]`)){const o=document.createElement("link");o.setAttribute("rel","preload"),o.setAttribute("as","style"),o.setAttribute("href",n.getAttribute("href")),e.push(new Promise(s=>{["load","error"].forEach(c=>o.addEventListener(c,s)),document.head.append(o)}))}return e}async function k(t,e,n,o){const s=(i,m)=>{const h=i.getAttribute(g),E=h&&m.head.querySelector(`[${g}="${h}"]`);if(E)return E;if(i.matches("link[rel=stylesheet]")){const y=i.getAttribute("href");return m.head.querySelector(`link[rel=stylesheet][href="${y}"]`)}return null},c=()=>{const i=document.activeElement;if(i?.closest(`[${g}]`)){if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement){const m=i.selectionStart,h=i.selectionEnd;return{activeElement:i,start:m,end:h}}return{activeElement:i}}else return{activeElement:null}},a=({activeElement:i,start:m,end:h})=>{i&&(i.focus(),(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement)&&(i.selectionStart=m,i.selectionEnd=h))},d=i=>{const m=document.documentElement,h=[...m.attributes].filter(({name:l})=>(m.removeAttribute(l),l.startsWith("data-astro-")));[...i.newDocument.documentElement.attributes,...h].forEach(({name:l,value:u})=>m.setAttribute(l,u));for(const l of document.scripts)for(const u of i.newDocument.scripts)if(!l.src&&l.textContent===u.textContent||l.src&&l.type===u.type&&l.src===u.src){u.dataset.astroExec="";break}for(const l of Array.from(document.head.children)){const u=s(l,i.newDocument);u?u.remove():l.remove()}document.head.append(...i.newDocument.head.children);const E=document.body,y=c();document.body.replaceWith(i.newDocument.body);for(const l of E.querySelectorAll(`[${g}]`)){const u=l.getAttribute(g),L=document.querySelector(`[${g}="${u}"]`);L&&L.replaceWith(l)}a(y)};async function r(i){function m(l){const u=l.effect;return!u||!(u instanceof KeyframeEffect)||!u.target?!1:window.getComputedStyle(u.target,u.pseudoElement).animationIterationCount==="infinite"}const h=document.getAnimations();document.documentElement.setAttribute(j,i);const y=document.getAnimations().filter(l=>!h.includes(l)&&!m(l));return Promise.all(y.map(l=>l.finished))}if(!A)document.documentElement.setAttribute(_,t.direction),o==="animate"&&await r("old");else throw new DOMException("Transition was skipped");const f=document.title,w=await ee(t,p,d);$(w.to,w.from,e,f,n),F(G),o==="animate"&&!A&&r("new").then(()=>q())}async function Y(t,e,n,o,s){if(!P()||location.origin!==n.origin){location.href=n.href;return}const c=s?"traverse":o.history==="replace"?"replace":"push";if(c!=="traverse"&&S({scrollX,scrollY}),N(e,n)&&n.hash){$(n,e,o,document.title,s);return}const a=await Z(e,n,t,c,o.sourceElement,o.info,o.formData,d);if(a.defaultPrevented){location.href=n.href;return}async function d(r){const f=r.to.href,w={};if(r.formData){w.method="POST";const h=r.sourceElement instanceof HTMLFormElement?r.sourceElement:r.sourceElement instanceof HTMLElement&&"form"in r.sourceElement?r.sourceElement.form:r.sourceElement?.closest("form");w.body=h?.attributes.getNamedItem("enctype")?.value==="application/x-www-form-urlencoded"?new URLSearchParams(r.formData):r.formData}const i=await se(f,w);if(i===null){r.preventDefault();return}if(i.redirected&&(r.to=new URL(i.redirected)),D??=new DOMParser,r.newDocument=D.parseFromString(i.html,i.mediaType),r.newDocument.querySelectorAll("noscript").forEach(h=>h.remove()),!r.newDocument.querySelector('[name="astro-view-transitions-enabled"]')&&!r.formData){r.preventDefault();return}const m=ie(r.newDocument);m.length&&await Promise.all(m)}if(A=!1,x)p=document.startViewTransition(async()=>await k(a,o,s));else{const r=(async()=>{await new Promise(f=>setTimeout(f)),await k(a,o,s,B())})();p={updateCallbackDone:r,ready:r,finished:new Promise(f=>q=f),skipTransition:()=>{A=!0}}}p.ready.then(async()=>{await re(),C(),ne()}),p.finished.then(()=>{document.documentElement.removeAttribute(_),document.documentElement.removeAttribute(j)}),await p.ready}async function R(t,e){await Y("forward",v,new URL(t,location.href),e??{})}function ae(t){if(!P()&&t.state){location.reload();return}if(t.state===null)return;const e=history.state,n=e.index,o=n>b?"forward":"back";b=n,Y(o,v,new URL(location.href),{},e)}const M=()=>{S({scrollX,scrollY})};{(x||B()!=="none")&&(v=new URL(location.href),addEventListener("popstate",ae),addEventListener("load",C),"onscrollend"in window?addEventListener("scrollend",M):addEventListener("scroll",oe(M,350),{passive:!0}));for(const t of document.scripts)t.dataset.astroExec=""}function ce(){const t=document.querySelector('[name="astro-view-transitions-fallback"]');return t?t.getAttribute("content"):"animate"}function H(t){return t.dataset.astroReload!==void 0}(x||ce()!=="none")&&(document.addEventListener("click",t=>{let e=t.target;if(e instanceof Element&&(e=e.closest("a, area")),!(e instanceof HTMLAnchorElement)&&!(e instanceof SVGAElement)&&!(e instanceof HTMLAreaElement))return;const n=e instanceof HTMLElement?e.target:e.target.baseVal,o=e instanceof HTMLElement?e.href:e.href.baseVal,s=new URL(o,location.href).origin;H(e)||e.hasAttribute("download")||!e.href||n&&n!=="_self"||s!==location.origin||t.button!==0||t.metaKey||t.ctrlKey||t.altKey||t.shiftKey||t.defaultPrevented||(t.preventDefault(),R(o,{history:e.dataset.astroHistory==="replace"?"replace":"auto",sourceElement:e}))}),document.addEventListener("submit",t=>{let e=t.target;if(e.tagName!=="FORM"||t.defaultPrevented||H(e))return;const n=e,o=t.submitter,s=new FormData(n,o);let c=o?.getAttribute("formaction")??n.action??location.pathname;const a=o?.getAttribute("formmethod")??n.method;if(a==="dialog")return;const d={sourceElement:o??n};if(a==="get"){const r=new URLSearchParams(s),f=new URL(c);f.search=r.toString(),c=f.toString()}else d.formData=s;t.preventDefault(),R(c,d)}),U({prefetchAll:!0}));class le extends HTMLElement{constructor(){super();const e=this.querySelector('[role="tablist"]');this.tabs=[...e.querySelectorAll('[role="tab"]')],this.panels=[...this.querySelectorAll(':scope > [role="tabpanel"]')],this.tabs.forEach((n,o)=>{n.addEventListener("click",s=>{s.preventDefault();const c=e.querySelector("[aria-selected]");s.currentTarget!==c&&this.switchTab(s.currentTarget,o)}),n.addEventListener("keydown",s=>{const c=this.tabs.indexOf(s.currentTarget),a=s.key==="ArrowLeft"?c-1:s.key==="ArrowRight"?c+1:s.key==="Home"?0:s.key==="End"?this.tabs.length-1:null;a!==null&&this.tabs[a]&&(s.preventDefault(),this.switchTab(this.tabs[a],a))})})}switchTab(e,n){if(!e)return;this.tabs.forEach(s=>{s.removeAttribute("aria-selected"),s.setAttribute("tabindex","-1")}),this.panels.forEach(s=>{s.hidden=!0});const o=this.panels[n];o&&(o.hidden=!1),e.removeAttribute("tabindex"),e.setAttribute("aria-selected","true"),e.focus()}}customElements.define("starlight-tabs",le);class ue extends HTMLElement{constructor(){super()}}customElements.define("navbar-component",ue);let de=class extends HTMLElement{switchElement;constructor(){super(),this.switchElement=this.querySelector("input[data-switch]"),this.switchElement.addEventListener("click",()=>{this.toggleLanguage()})}toggleLanguage=()=>{/^(\/en).+/.test(window?.location?.pathname)?window.location.pathname=window.location.pathname.replace("/en/","/"):window.location.pathname=window.location.pathname.replace("/","/en/")}};customElements.define("toggle-content",de);class me extends HTMLElement{menuButton=this.querySelector("button");constructor(){super(),this.menuButton.addEventListener("click",()=>this.toggleExpanded());const e=this.closest("nav");e&&e.addEventListener("keyup",n=>this.closeOnEscape(n))}setExpanded(e){this.setAttribute("aria-expanded",String(e)),document.body.toggleAttribute("data-mobile-menu-expanded",e)}toggleExpanded(){this.setExpanded(this.getAttribute("aria-expanded")!=="true")}closeOnEscape(e){e.code==="Escape"&&(this.setExpanded(!1),this.menuButton.focus())}}customElements.define("mobile-menu-button",me);class fe extends HTMLElement{constructor(){super();const e=this.getAttribute("data-trigger"),n=this.querySelector(".toggle-dropdown"),o=this.querySelector("svg[data-updown]");e==="click"?this.addEventListener("click",()=>{n&&n.classList.toggle("toggle-dropdown-active"),document.body.classList.toggle("overflow-hidden"),Array.from(o?.classList||[]).includes("toggle-trigger-up")?this.toggleDown(o):this.toggleUp(o)}):e==="hover"&&(this.addEventListener("mouseenter",()=>{n&&n.classList.add("toggle-dropdown-active"),this.toggleUp(o)}),this.addEventListener("mouseleave",()=>{n&&n.classList.remove("toggle-dropdown-active"),this.toggleDown(o)}))}toggleUp=e=>{e?.classList.remove("toggle-trigger-down"),e?.classList.add("toggle-trigger-up")};toggleDown=e=>{e?.classList.remove("toggle-trigger-up"),e?.classList.add("toggle-trigger-down")}}customElements.define("toggle-component",fe);class he extends HTMLElement{constructor(){super()}}customElements.define("docs-menu",he);class ge extends HTMLElement{constructor(){super();const e=this.parentElement;this.querySelector(".dropdown-overlay").addEventListener("mouseenter",()=>{e.classList.remove("toggle-dropdown-active"),e.classList.add("toggle-dropdown-notactive")})}}customElements.define("community-menu",ge);
