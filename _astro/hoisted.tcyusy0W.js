import"./hoisted.DjgOaZkp.js";import"./hoisted.faDvzcc6.js";import"./index.PDhEm6KS.js";const n=window?.location?.pathname,i=t=>{const{type:s}=t;setTimeout(function(){if(window.aes&&window.AESPluginEvent){const e=window?.aes.use(window.AESPluginEvent),o={TRACK_404:"TRACK_404"};console.log("-------"),e(o.TRACK_404,{c1:window?.location?.pathname,c2:s})}},1e3)};n==="/en"&&(window.location.pathname="/en/");n.slice(-1)!=="/"&&(window.location.pathname+="/");if(n.includes("docs"))if(/\/docs\/(latest|ebook|next|v[0-9]\.[0-9]\.[0-9]|v[0-9]\.[0-9]|v[0-9]|[0-9]\.[0-9]\.[0-9]|[0-9]\.[0-9]|[0-9])\/.+/.exec(n))i({type:"docs"});else{const[e,o]=n.split("/docs");e==="/en"?window.location.pathname="/en/docs/latest"+o:window.location.pathname="/docs/latest"+o}else i({type:"others"});
