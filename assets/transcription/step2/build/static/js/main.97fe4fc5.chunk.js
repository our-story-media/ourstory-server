(this["webpackJsonptranscribe-editor"]=this["webpackJsonptranscribe-editor"]||[]).push([[0],{119:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(7),c=n.n(o),i=n(17),u=n(13),s=n(44),l=n.n(s),f=n(50),m=n(154),p=n(158),d=n(120),h=n(155),v=n(45),b=Object(v.a)({root:{position:"relative",paddingTop:"56.25%",width:"100%",height:0},video:{position:"absolute",top:0,left:0,bottom:0,right:0,width:"100%",height:"100%",zIndex:1}});function E(e){var t=e.time,n=e.src,a=r.a.useRef(null),o=b();return r.a.useEffect((function(){var e=function(e){if(!isNaN(e))return e;var t=e.match(/^(?:(\d{2,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);if(!t)throw new Error('Invalid SRT or VTT time format: "'+e+'"');var n=t[1]?36e5*parseInt(t[1],10):0,a=6e4*parseInt(t[2],10),r=1e3*parseInt(t[3],10),o=parseInt(t[4],10);return n+a+r+o}(t)/1e3;e>0&&(a.current.currentTime=e)}),[t]),r.a.createElement(p.a,{className:o.root},r.a.createElement("video",{className:o.video,ref:a,src:n,controls:!0,autoPlay:!1}))}var g=n(150),w=n(161),j=n(152),k=n(157),O=n(160),x=Object(v.a)((function(e){return Object(O.a)({root:function(t){return{padding:e.spacing(1),margin:e.spacing(0,1),backgroundColor:t.focused?"#f0f0f0":"#FFF",minWidth:480,cursor:"pointer"}},textArea:{width:"100%"}})}));function y(e){var t=e.chunk,n=(e.contribution,e.onClick,e.onUpdate),a=e.onActive,o=r.a.useRef(null),c=r.a.useState(e.content),i=Object(u.a)(c,2),s=i[0],l=i[1],f=x(e),m=t.starttime,p=t.endtime,d="".concat(m," - ").concat(p),h=function(e){e.preventDefault(),n(s)};return r.a.createElement(g.a,{className:f.root,onClick:function(){return a()}},r.a.createElement(w.a,{title:d,titleTypographyProps:{variant:"h6"}}),r.a.createElement(j.a,null,r.a.createElement("form",{action:"#",onSubmit:h,onBlur:h},r.a.createElement(k.a,{inputRef:o,className:f.textArea,label:"Subtitle",multiline:!0,rows:"3",placeholder:"Please input your transcription",value:s,onKeyPress:function(e){"Enter"===e.key&&(e.preventDefault(),o.current.blur(),n(s))},onFocus:function(){return a()},onChange:function(e){return l(e.target.value)}}))))}var I=Object(v.a)((function(e){return Object(O.a)({root:{display:"flex",flexDirection:"row",overflow:"scroll",padding:e.spacing(2,1)}})}));function S(e){var t=e.user,n=e.chunks,a=e.activeIndex,o=(e.onSelect,I(e));return r.a.createElement("div",{className:o.root},n.map((function(n,o){var c=(n.contributions||[]).findIndex((function(e){return e.user===t})),i=c<0?null:n.contributions[c],u=i?i.text:"";return r.a.createElement(y,{key:o,chunk:n,focused:a===o,content:u,onUpdate:function(t){return e.onUpdate({chunkId:o,contribId:c,content:t})},onActive:function(){return e.onSelect(o)}})})))}n(30),n(153),n(159),Object(v.a)((function(e){return Object(O.a)({root:{margin:e.spacing(3,0)},editor:{width:"100%"}})}));var N=Object(v.a)((function(e){return Object(O.a)({box:{maxHeight:600,overflow:"auto"}})}));function T(e){var t=e.src,n=e.user,a=e.chunks,o=e.onUpdate,c=N(),s=r.a.useState(null),l=Object(u.a)(s,2),v=(l[0],l[1],r.a.useState(0)),b=Object(u.a)(v,2),g=b[0],w=b[1],j=r.a.useState(null),k=Object(u.a)(j,2),O=k[0],x=k[1];return r.a.createElement(m.a,{fixed:!0},r.a.createElement(p.a,{marginTop:3},r.a.createElement(d.a,null,r.a.createElement(h.a,{container:!0,spacing:4},r.a.createElement(h.a,{item:!0,xs:3}),r.a.createElement(h.a,{item:!0,xs:6},r.a.createElement(p.a,{className:c.box},r.a.createElement(E,{time:g,src:t}))),r.a.createElement(h.a,{item:!0,xs:3})))),r.a.createElement(p.a,{marginTop:3},r.a.createElement(S,{user:n,chunks:a,activeIndex:O,onUpdate:function(e){var t=e.chunkId,r=e.contribId,c=e.content,u=r<0?[].concat(Object(f.a)(a[t].contributions||[]),[{user:n,text:c}]):a[t].contributions.map((function(e,t){return t===r?Object(i.a)({},e,{text:c}):e})),s=a.map((function(e,n){return n===t?Object(i.a)({},e,{contributions:u}):e}));o(s)},onSelect:function(e){var t=a[e];x(e),w(t.starttime)}})))}var U=n(156),A=n(49),C=n.n(A);var F=function(){var e=window.location.href.split("/")[5].split("?")[0],t=C.a.parse(window.location.search),n=t.apikey,a=t.name,o="/api/watch/getvideo/".concat(e),c="/api/watch/edit/".concat(e),s="/api/watch/savedit/".concat(e,"?apikey=").concat(n),f=r.a.useState({}),m=Object(u.a)(f,2),p=m[0],d=m[1];r.a.useEffect((function(){fetch(c).then((function(e){return e.json()})).then((function(e){d(e)})).catch((function(e){console.error(e)}))}),[]);var h=l()(p,["transcription","chunks"],[]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(U.a,null),r.a.createElement(T,{chunks:h,onUpdate:function(e){var t=Object(i.a)({},p,{transcription:Object(i.a)({},p.transcription,{chunks:e})});d(t);var n=JSON.stringify(t);console.log(n),fetch(s,{method:"post",headers:{Accept:"application/json","Content-Type":"application/json"},body:n}).then((function(e){return e})).catch((function(e){console.error(e)}))},src:o,user:a}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(F,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},58:function(e,t,n){e.exports=n(119)}},[[58,1,2]]]);
//# sourceMappingURL=main.97fe4fc5.chunk.js.map