(window["webpackJsonprapid-reader"]=window["webpackJsonprapid-reader"]||[]).push([[0],{26:function(e,t,a){e.exports=a(56)},31:function(e,t,a){},54:function(e,t,a){},55:function(e,t,a){},56:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(22),o=a.n(r),c=(a(31),a(5)),s=a(6),i=a(4),d=window.location.protocol+"//"+window.location.host,m={app:"/read",context:"",host:d,siteUrl:d+"",appUrl:d+"/read"},u=a(7),p=a.n(u);function f(e,t){console.log("useRequest");var a=Object(n.useState)(null),l=Object(i.a)(a,2),r=l[0],o=l[1],c=Object(n.useState)(null),s=Object(i.a)(c,2),d=s[0],m=s[1];return Object(n.useEffect)(function(){!function(){if(e.url){var t=p()(e);m(t),t.then(function(e){return o(e),console.log("useRequest:response"),console.log(e),e})}}()},t?[].concat(t):[]),[r,d]}function h(e){return e.req&&e.req.status&&!/^2/.test(e.req.status)?l.a.createElement("div",{className:"card text-white bg-danger mb-3",style:{maxWidth:"24rem"}},l.a.createElement("div",{className:"card-header"},"An Error Occured"),l.a.createElement("div",{className:"card-body"},l.a.createElement("h5",{className:"card-title"},"Status ",e.req.status),l.a.createElement("p",{className:"card-text"},e.req.statusText))):l.a.createElement("div",{className:"spinner-boarder ".concat(e.type?e.type:"text-light"),role:"status"},l.a.createElement("span",{className:"sr-only"},e.text||"Loading..."))}var g=function(e){console.log(e);var t,a=f({url:"".concat(m.siteUrl,"/data/search/saved?format=json&t=").concat(Date.now()),method:"GET"}),n=Object(i.a)(a,2),r=n[0],o=n[1];function c(e){return(/^(read|worklist)/i.test(e.brief_description)||/^(rapid reader|worklist)/i.test(e.description))&&/SessionData$/i.test(e.root_element_name)}return l.a.createElement("div",{className:"stored-searches",style:{width:600,margin:"20px auto"}},l.a.createElement("h1",null,"Worklists"),r&&r.data?l.a.createElement("div",{className:"list-group"},(t=r.data).ResultSet&&t.ResultSet.Result?t.ResultSet.Result.map(function(e){if(c(e)){var t=e.brief_description.split(/[:|]/),a=function(e){var t,a={isWorkList:c(e)};return(t=e.description,t.split(/worklist/i).slice(1).join("").split(/[,]/).map(function(e,t){return e.replace(/^[\W,]+|[\W,]+$/g,"").trim()}).filter(function(e){return!!e})).forEach(function(e,t){var n=e.split(/[:=]/)[0].trim().replace(/[\W\s]+/,"_").toLowerCase(),l=e.split(/[:=]/)[1].trim();a[n]=l.trim()}),a}(e);console.log(a);var n=e.id,r=(t[2]||"").trim()||"-",o=(t[1]||t[0]||"Read Data (".concat(e.root_element_name,")")).trim();return a.template_id?r=a.template_id:a.template_url&&(r=a.template_url.replace(/\/+/g,":")),l.a.createElement("a",{className:"list-group-item list-group-item-action text-white bg-dark",href:"#/worklists/".concat(n,"/").concat(r,"/")},o)}}):"",console.log(o)):l.a.createElement(h,null))};var E=function(e){var t=e.match.params,a=t.searchId,n=t.templateId,r=f({url:"".concat(m.siteUrl,"/data/search/saved/").concat(a,"/results?format=json&t=").concat(Date.now()),method:"GET"}),o=Object(i.a)(r,2),c=o[0];function d(e){return console.log("resultCount"),e&&e.ResultSet&&e.ResultSet.Result?e.ResultSet.Result.length:0}return o[1],l.a.createElement("div",{className:"stored-search"},c&&c.data?l.a.createElement(l.a.Fragment,null,d(c.data)?l.a.createElement(l.a.Fragment,null,l.a.createElement(s.a,{to:"/worklists/".concat(a,"/").concat(n,"/1/").concat(d(c.data))})):l.a.createElement("i",null,"No results.")):l.a.createElement("small",null,"Loading..."))},v=a(25),w=a.n(v);a(54);function x(e){var t=e.itemData,a=e.templateId,n=a&&/^[^-0]/i.test(a),r=/^[*~:/]/,o=r.test(a),c="".concat(m.appUrl,"/forms/").concat(a.replace(r,"").replace(/\.html$/,""),".html");console.log(c);var s="".concat(m.siteUrl,"/").concat(a.replace(r,"").replace(/[:]/g,"/").replace(/\/+/,"/"));console.log(s);var d=o?"*"===a.charAt(0)?c:s:"https://phpapi.rsna.org/radreport/v1/templates/".concat(a,"/details");console.log(d),/^[-0]$/i.test(a)&&(d="");var u,h=f({url:d,method:"GET"},a),g=Object(i.a)(h,2),E=g[0];g[1],t.expt_id;return l.a.createElement("form",{id:"form-template-wrapper",action:"#!",style:{paddingTop:"5px"}},n&&E&&E.data&&l.a.createElement(function(){var e=o?E.data:E.data.DATA.templateData,t=/<body>/.test(e)?e.split("<body>")[1].split("</body>")[0]:e;return l.a.createElement("div",{id:"read-form-template",style:{padding:"10px"},dangerouslySetInnerHTML:{__html:w.a.sanitize(t)}})},null),l.a.createElement("br",null),l.a.createElement("input",{name:"project",type:"hidden",defaultValue:t.project}),l.a.createElement("input",{name:"subject",type:"hidden",defaultValue:t.xnat_subjectdata_subjectid}),l.a.createElement("input",{name:"expt_id",type:"hidden",defaultValue:t.expt_id}),l.a.createElement("input",{name:"modality",type:"hidden",defaultValue:t.modality}),l.a.createElement("input",{name:"read_template",type:"hidden",defaultValue:a}),l.a.createElement("textarea",{name:"other",className:"hidden",style:{display:"none"},defaultValue:"{}"}),e.children,n&&(u=E&&E.data,void(n&&u&&p()({url:"".concat(m.siteUrl,"/data/experiments/").concat(t.expt_id,"/assessors?xsiType=rad:genRadiologyReadData&format=json"),method:"GET"}).then(function(e){return e&&e.data&&e.data.ResultSet&&e.data.ResultSet.Result?e.data.ResultSet.Result:[]}).then(function(e){if(e.length>0){var a=e[e.length-1].ID;p()({url:"".concat(m.siteUrl,"/data/experiments/").concat(t.expt_id,"/assessors/").concat(a,"?format=json"),method:"GET"}).then(function(e){if(e&&e.data&&e.data.items&&e.data.items[0]&&e.data.items[0].data_fields){var t=window.radreportFormData.populate("#form-template-wrapper",e.data.items[0].data_fields);console.log(t)}})}})))&&"")}var b=function(e){var t=e.dataFields,a="VIEWER";function n(e,t,a){var n,l=0,r=performance&&performance.now?performance.now():Date.now(),o=r+1e4,c=r;!function(e,t,a){var n=t;"function"!==typeof t&&(n=function(){return!!t});var l=setInterval(function(){if(n()){var e=a();return clearInterval(l),e}},e||1)}(10,function(){return(c+=10)>=o||(++l>500||(console.log("waiting for element: "+e),(n=t.querySelector(e))&&a&&a.call(n,n),!!n))},function(){c>=o||l>500?console.warn("can't find element"):console.log("element found: "+e)})}return l.a.createElement("div",{id:"viewer-container",style:{width:"75%",position:"fixed",top:0,right:0,bottom:0,left:0,minHeight:720}},l.a.createElement("iframe",{id:"viewer-iframe",onLoad:function(e){console.log(e),console.log("loaded?");var t=e.target;console.log(t),console.log(e.target===(t=document.getElementById("viewer-iframe"))),console.log(t);var a,l=t.contentDocument||t.contentWindow.document;a=l,window.readerConfig.viewer.hidePanels.forEach(function(e){n(e[0],a,function(t){t.classList.remove(e[1])})}),function(e){window.readerConfig.viewer.removeElements.forEach(function(t){n(t,e,function(e){e.remove()})})}(l),function(e){window.readerConfig.viewer.hideSelectors.forEach(function(t){n(t,e,function(e){e.style.display="none"})})}(l)},src:function(){console.log("iframeSrc");var e=["projectId=".concat(t.project),"experimentId=".concat(t.expt_id),"t=".concat(Date.now())];return"".concat(m.siteUrl,"/").concat(a,"/?").concat(e.join("&"))}(),title:t.expt_id,width:"100%",height:"100%",style:{border:"none"}}))};a(55);var y=[{path:"/",exact:!0,page:g,label:"Worklists"},{path:"/worklists",exact:!0,page:g,label:"Worklists"},{path:"/worklists/:searchId/:templateId",exact:!0,page:E,label:"Search Results"},{path:"/worklists/:searchId/:templateId/:searchItemIndex/:searchItemsLength",exact:!0,page:function(e){var t=e.match.params,a=t.searchId,n=t.searchItemIndex,r=t.searchItemsLength,o=e.match.params.templateId,s=o&&!/^[-0]$/.test(o);n=+n;var d=f({url:"".concat(m.siteUrl,"/data/search/saved/").concat(a,"/results?format=json&t=").concat(Date.now()),method:"GET",transformResponse:function(e){var t="string"===typeof e?JSON.parse(e):e;return t.ResultSet.Result=t.ResultSet.Result.map(function(e){return e.session_id=e.session_id||e.expt_id,e.expt_id=e.expt_id||e.session_id,e}),console.log(t),t}}),u=Object(i.a)(d,2),g=u[0],E=u[1],v=null;function w(e){return console.log("extractResults"),e&&e.ResultSet&&e.ResultSet.Result?e.ResultSet.Result:[]}function y(e){return console.log("extractItem"),(v=w(e)[n-1]||null).expt_id=v.expt_id||v.session_id,v.subject=v.subject||v.xnat_subjectdata_subjectid,v}function _(e){return console.log("resultCount"),w(e).length}function I(){var e=window.readerConfig.server.info[2].split(/[/_.:$?=&+\-*]+/);return[e[4]||0,e[1]||0,e[5]||0,e[2]||0,e[3]||0].join("-")}function S(e){var t=e.txt,n=e.newIndex,s=t,i=!1,d="/worklists/".concat(a,"/").concat(o,"/").concat(n,"/").concat(r),m={width:"45%",lineHeight:1.6};return/prev/i.test(t)?(i=n<=0,s=l.a.createElement(l.a.Fragment,null,"\xab Back"),m.float="left"):(s=l.a.createElement(l.a.Fragment,null,"Skip \xbb"),m.float="right",n>r&&(d="/worklists",s="Done")),i?l.a.createElement("button",{disabled:!0,style:m},s):l.a.createElement(c.b,{style:m,to:d},l.a.createElement("button",{style:{width:"100%"}},s))}return l.a.createElement("div",{className:"view-session",style:{margin:0}},g&&g.data?l.a.createElement(l.a.Fragment,null,_(g.data)?l.a.createElement(l.a.Fragment,null,n>_(g.data)||n<=0?l.a.createElement("i",null,"Invalid Session"):l.a.createElement(l.a.Fragment,null,void E.then(function(e){localStorage.setItem("worklist_".concat(a),JSON.stringify(v)),console.log(e)}),y(g.data)&&null,l.a.createElement("div",{className:"clearfix"},l.a.createElement(b,{dataFields:v}),l.a.createElement("div",{id:"session-data",style:{width:"25%",position:"absolute",top:"160px",right:0,bottom:0,overflowY:"scroll",padding:"0 10px"}},l.a.createElement("div",null,l.a.createElement(function(e){var t=e.data,a=(e.itemIndex,y(t));return console.log(a),l.a.createElement("header",{style:{width:"25%",height:160,margin:0,padding:"0 10px",position:"fixed",top:0,right:0,background:"#000",zIndex:1}},l.a.createElement("section",{className:"clearfix",style:{padding:"0 10px",height:40,lineHeight:"40px",verticalAlign:"middle"}},l.a.createElement("div",{className:"float-left"},l.a.createElement(c.b,{to:"/worklists"},l.a.createElement("b",null,l.a.createElement(l.a.Fragment,null,"\xab\xa0"),"Worklists"))),l.a.createElement("div",{className:"float-right"},l.a.createElement("small",null,"Viewing session #",n," of ",r)),l.a.createElement("div",{className:"clearfix"})),l.a.createElement("section",{style:{height:120,margin:"0 10px",padding:"10px",borderBottom:"5px solid #303030",background:"#000"}},l.a.createElement("table",{id:"session-info-table",style:{width:"100%",height:"100%",fontSize:"13px",fontWeight:"bold"}},l.a.createElement("tbody",{style:{border:"none"}},l.a.createElement("tr",null,l.a.createElement("th",null,"Session Label: ",l.a.createElement(l.a.Fragment,null,"\xa0")),l.a.createElement("td",null,a.label)),l.a.createElement("tr",null,l.a.createElement("th",null,"Session ID: ",l.a.createElement(l.a.Fragment,null,"\xa0")),l.a.createElement("td",null,a.expt_id)),l.a.createElement("tr",null,l.a.createElement("th",null,"Subject: ",l.a.createElement(l.a.Fragment,null,"\xa0")),l.a.createElement("td",null,a.subject)),l.a.createElement("tr",null,l.a.createElement("th",null,"Project: ",l.a.createElement(l.a.Fragment,null,"\xa0")),l.a.createElement("td",null,a.project))))))},{data:g.data,itemIndex:n}),l.a.createElement(x,{itemData:v,templateId:o},l.a.createElement("section",{className:"clearfix",style:{padding:"0 20px 30px"}},l.a.createElement(S,{txt:"prev",newIndex:n-1}),l.a.createElement(S,{txt:"next",newIndex:n+1}),l.a.createElement("div",{className:"clearfix"}),l.a.createElement("br",null),s&&l.a.createElement(function(e){var t=e.newIndex,n=t>r,s=n?"/worklists":"/worklists/".concat(a,"/").concat(o,"/").concat(t,"/").concat(r);return l.a.createElement(c.b,{style:{width:"100%",lineHeight:1.6},to:s,onClick:function(e){e.preventDefault(),console.log("link..."),console.log(s);var t=window.radreportFormData.collect("#session-data");console.log(t);var a=window.genRadReadSpawnXML(t.sectionMap);console.log(a.xml),p()({method:"POST",url:"".concat(m.siteUrl,"/data/projects/").concat(v.project,"/subjects/").concat(v.subject,"/experiments/").concat(v.expt_id,"/assessors"),params:{inbody:"true",XNAT_CSRF:I()},headers:{"Content-Type":"text/xml"},data:a.xml}).then(function(e){200===e.status?(console.log("SAVED!!!"),window.location.hash="#".concat(s)):console.warn("error")})}},l.a.createElement("button",{className:"btn btn-primary",style:{width:"100%"}},"Save and ",n?"Finish":"Continue"))},{itemIndex:n,newIndex:n+1}))),l.a.createElement("table",{style:{display:"none"}},l.a.createElement("tbody",null,Object.keys(v).sort().map(function(e,t){var a=v[e];return l.a.createElement("tr",{className:t%2?"even":"odd"},l.a.createElement("th",null,e),l.a.createElement("td",null,a))})))))))):l.a.createElement("i",null,"No results.")):l.a.createElement(h,{req:E}))},label:"Session Data"}];var _=function(e){return l.a.createElement("div",{className:"not-found text-center",style:{width:600,margin:"0 auto"}},console.log(e),l.a.createElement("h1",null,"Didn't find ur page."),l.a.createElement("div",{className:"alert alert-dark"},'"',window.location.href,'" does not exist'))};var I=function(e){return l.a.createElement("div",{id:"app-wrapper"},l.a.createElement(c.a,null,l.a.createElement(s.d,null,y.map(function(e,t){return e.exact?l.a.createElement(s.b,{exact:!0,path:e.path,component:e.page}):l.a.createElement(s.b,{path:e.path,component:e.page})}),l.a.createElement(s.b,{component:_}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(l.a.createElement(I,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[26,1,2]]]);
//# sourceMappingURL=main.1ebe8d2f.chunk.js.map