(this["webpackJsonpfertilizer-calculator"]=this["webpackJsonpfertilizer-calculator"]||[]).push([[7],{237:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var a=n(8),r=n(238),c=n(0),l=n.n(c),o=n(27),i=n(251),u=Object(c.forwardRef)((function(e,t){var n,u=e.component,m=e.size,d=void 0===m?"1.5em":m,s=e.children,f=Object(r.a)(e,["component","size","children"]),b=Object(c.useState)(d||0),p=Object(a.a)(b,2),E=p[0],v=p[1],j=Object(i.a)();return Object(c.useEffect)((function(){var e;!d&&t&&"current"in t&&v((null===(e=t.current)||void 0===e?void 0:e.offsetWidth)||0)}),[t,v,d]),l.a.createElement(o.b,Object.assign({type:"button"},f,{ref:t}),l.a.createElement(u,{color:null===(n=j.colors)||void 0===n?void 0:n.background,size:E}),s)}))},240:function(e,t,n){"use strict";n.d(t,"b",(function(){return d})),n.d(t,"a",(function(){return f}));var a=n(238),r=n(84),c=n(0),l=n.n(c),o=n(137),i=n(235),u=n(58);function m(){var e=Object(r.a)(["\n  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n  -moz-appearance: textfield;\n\n"]);return m=function(){return e},e}var d=Object(u.b)(i.b)(m()),s=function(e){var t=e.input,n=e.label,r=e.type,c=void 0===r?"text":r,o=Object(a.a)(e,["input","label","type"]);return l.a.createElement(d,Object.assign({},o,t,{type:c,lang:"en-US",placeholder:n}))},f=function(e){var t=e.name,n=Object(a.a)(e,["name"]);return l.a.createElement(o.a,Object.assign({component:s,name:t},n))}},241:function(e,t,n){"use strict";function a(e){return e&&parseInt(e)}function r(e){return e&&parseFloat(e)}n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return r}))},246:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"b",(function(){return u}));var a=n(0),r=n(83),c=n(112),l=n(101),o=n(41);function i(){return Object(a.useContext)(c.a).form}function u(e){var t=Object(r.c)();return[Object(r.d)((function(t){return Object(l.a)(e)(t)})),function(n,a){t(Object(o.a)(e,n,a))}]}},250:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return s}));var a=n(0),r=n.n(a),c=n(27),l=n(252),o=n(42),i=n(17),u=n(237),m=n(3),d=function(e){var t=e.name,n=e.value,a=e.delta;return r.a.createElement(c.a,{bg:t,flex:1,mx:"2px",px:1,color:"black",minWidth:"2.1em",maxWidth:"3em",fontSize:1},r.a.createElement(c.d,{flexDirection:"column",alignItems:"center"},r.a.createElement(c.a,null,t),r.a.createElement(c.a,null,Object(m.e)(n,1)),"undefined"!==typeof a?r.a.createElement(c.a,null,a):null))},s=function(e){var t=e.item,n=e.onRemove,a=e.weight,m=Object(o.b)(t,!1);return r.a.createElement(c.c,{width:"auto"},r.a.createElement(c.d,{justifyContent:"space-between",alignItems:"center"},r.a.createElement(c.a,{flex:1},r.a.createElement(c.f,{flex:1},t.id),r.a.createElement(c.d,null,i.b.map((function(e){var t=m.elements[e];return t?r.a.createElement(d,{name:e,key:e,value:t}):null})))),r.a.createElement(c.d,null,r.a.createElement(c.d,{alignItems:"center",justifyContent:"center",margin:1},a?r.a.createElement(c.f,{textAlign:"center",minWidth:"3em"},a.weight,"\u0433",a.volume?r.a.createElement(r.a.Fragment,null,r.a.createElement("br",null),r.a.createElement("span",{title:"\u041e\u0431\u044a\u0435\u043c \u0438\u043b\u0438 \u0432\u0435\u0441 \u0440\u0430\u0441\u0442\u0432\u043e\u0440\u0430"},a.volume&&"".concat(a.volume," \u043c\u043b, ").concat(a.liquid_weight,"\u0433"))):null):null),r.a.createElement(u.a,{padding:1,alignSelf:"center",component:l.a,onClick:function(){return n()}}))))}},256:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var a=n(238),r=n(0),c=n.n(r),l=n(235),o=n(137),i=function(e){var t=e.input,n=e.label,r=Object(a.a)(e,["input","label"]);return c.a.createElement(l.c,null,c.a.createElement(l.a,Object.assign({},r,t,{checked:t.value})),n)},u=function(e){var t=e.name,n=Object(a.a)(e,["name"]);return c.a.createElement(o.a,Object.assign({component:i,name:t},n))}},259:function(e,t,n){"use strict";n.d(t,"a",(function(){return g}));var a=n(8),r=n(0),c=n.n(r),l=n(84),o=n(60),i=n.n(o),u=n(27),m=n(51),d=n(298);function s(){var e=Object(l.a)(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: ",";\n  left: 0;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(255, 255, 255, 0.5);\n  z-index: 999;\n"]);return s=function(){return e},e}var f=Object(m.default)(u.d)(s(),(function(){return"".concat(window.pageYOffset,"px")}));function b(e){var t=e.children,n=function(){var e=document.querySelector("#modal-root");return e||((e=document.createElement("div")).setAttribute("id","modal-root"),document.body.appendChild(e)),e}();return i.a.createPortal(c.a.createElement(c.a.Fragment,null,c.a.createElement(d.a,null,c.a.createElement("style",{type:"text/css"},"\n          body {\n            overflow: hidden;\n          }\n        ")),c.a.createElement(f,null,c.a.createElement(u.c,{backgroundColor:"#fff"},t))),n)}var p=n(238),E=n(251),v=Object(r.forwardRef)((function(e,t){var n,l=e.component,o=e.size,i=void 0===o?"1.5em":o,m=(e.children,Object(p.a)(e,["component","size","children"])),d=Object(r.useState)(i||0),s=Object(a.a)(d,2),f=s[0],b=s[1],v=Object(E.a)();return Object(r.useEffect)((function(){var e;!i&&t&&"current"in t&&b((null===(e=t.current)||void 0===e?void 0:e.offsetWidth)||0)}),[t,b,i]),c.a.createElement(u.a,Object.assign({},m,{ref:t}),c.a.createElement(l,{color:null===(n=v.colors)||void 0===n?void 0:n.text,size:f}))})),j=n(252);function g(e){var t=e.opened,n=void 0!==t&&t,l=e.button,o=e.container,i=Object(r.useState)(!n),m=Object(a.a)(i,2),d=m[0],s=m[1];Object(r.useEffect)((function(){s(!n)}),[n]),Object(r.useEffect)((function(){d&&e.onClose&&e.onClose()}),[d,e]);var f={open:function(){return s(!1)},close:function(){return s(!0)}},p={modal:f};return c.a.createElement(c.a.Fragment,null,l&&l(p),d?null:c.a.createElement(b,null,c.a.createElement(u.d,{justifyContent:"space-between"},c.a.createElement(u.e,{fontSize:2},e.title),c.a.createElement(v,{component:j.a,onClick:f.close})),c.a.createElement(u.a,null,o(p))))}},482:function(e,t,n){"use strict";n.r(t),n.d(t,"FertilizerManager",(function(){return F}));var a=n(8),r=n(0),c=n.n(r),l=n(83),o=n(27),i=n(476),u=n(42),m=n(17),d=n(237),s=n(479),f=n(480),b=n(250),p=n(135),E=n(138),v=n(136),j=n(240),g=n(241),O=function(e){var t=e.name,n=e.disabled;return c.a.createElement(o.d,{flexDirection:"column",justifyContent:"center",alignItems:"center",width:"4rem"},c.a.createElement("label",{style:{textAlign:"center"}},t),c.a.createElement(j.a,{name:"npk."+t,type:"number",step:"0.1",min:"0",max:"100",autoComplete:"off",width:"3rem",style:{textAlign:"center"},normalize:g.a,disabled:n}))},y=n(53),x=n(256),h=function(e){var t=e.fields;return c.a.createElement(o.c,{width:"100%"},c.a.createElement(o.d,null,c.a.createElement("button",{type:"button",onClick:function(){return t.push({formula:"",percent:98})}},"+")),c.a.createElement(o.d,{flexDirection:"column"},t.map((function(e,n){return c.a.createElement(o.d,{key:n,width:"100%"},c.a.createElement(j.a,{name:"".concat(e,".formula"),flex:2}),c.a.createElement(j.a,{name:"".concat(e,".percent"),type:"number",step:"0.1",min:"0",max:"100",normalize:g.a,flex:1}),c.a.createElement("button",{type:"button",onClick:function(){return t.remove(n)}},"-"))}))))},k=n(246),_=n(235);function w(e){var t={id:e.id,npk:e.npk,composition:e.composition};return e.composition&&(t.npk=Object(u.b)(e,!1).elements,t.composition_enable=!0),e.solution_concentration&&(t.solution_concentration=e.solution_concentration,t.solution_density=e.solution_density||1e3,t.solution_density_enable=!0),t}var C=Object(v.a)({form:y.a,enableReinitialize:!0})((function(e){var t=Object(k.b)(Object(k.a)())[0];return c.a.createElement(p.a,null,c.a.createElement(o.d,{flexDirection:"column"},c.a.createElement(j.a,{name:"id",title:"Name",label:"Name"}),c.a.createElement(o.a,null,"\u041c\u0430\u043a\u0440\u043e\u044d\u043b\u0435\u043c\u0435\u043d\u0442\u044b"),c.a.createElement(o.d,null,m.d.map((function(e){return c.a.createElement(O,{name:e,disabled:t.composition_enable})}))),c.a.createElement(o.a,null,"\u041c\u0438\u043a\u0440\u043e\u044d\u043b\u0435\u043c\u0435\u043d\u0442\u044b"),c.a.createElement(o.d,null,m.e.map((function(e){return c.a.createElement(O,{name:e,disabled:t.composition_enable})}))),c.a.createElement(o.d,null,c.a.createElement(x.a,{name:"composition_enable",label:"\u0424\u043e\u0440\u043c\u0443\u043b\u0430"})),t.composition_enable?c.a.createElement(o.d,null,c.a.createElement(E.a,{name:"composition",component:h})):null,c.a.createElement(o.d,{alignItems:"center"},c.a.createElement(o.a,{width:"auto",marginRight:2},c.a.createElement(x.a,{name:"solution_density_enable",label:"\u0420\u0430\u0441\u0442\u0432\u043e\u0440"})),t.solution_density_enable?c.a.createElement(o.d,{flexDirection:"column"},c.a.createElement(o.d,{alignItems:"flex-end"},c.a.createElement(_.c,{flexDirection:"column"},"\u041a\u043e\u043d\u0446\u0435\u0442\u0440\u0430\u0446\u0438\u044f",c.a.createElement(j.a,{name:"solution_concentration",type:"number",step:"0.1",min:"0",max:"3000",normalize:g.a,width:"5em",marginRight:2}),c.a.createElement(o.f,{sx:{whiteSpace:"nowrap"}},"\u0433/\u043b"))),c.a.createElement(o.d,{alignItems:"flex-end"},c.a.createElement(_.c,{flexDirection:"column"},"\u041f\u043b\u043e\u0442\u043d\u043e\u0441\u0442\u044c",c.a.createElement(j.a,{name:"solution_density",type:"number",step:"1",min:"800",max:"3000",normalize:g.b,width:"5em",marginRight:2})),c.a.createElement(o.f,{sx:{whiteSpace:"nowrap"}},"\u0433/\u043b"))):null)))})),z=n(259),S=n(59);function I(e){var t=e.fertilizer,n=Object(u.b)(t,!1),r=Object(k.b)(y.a),i=Object(a.a)(r,1)[0],p=Object(l.c)();return c.a.createElement(c.a.Fragment,null,c.a.createElement(o.c,{width:"auto",marginBottom:2},c.a.createElement(o.d,{justifyContent:"space-between",alignItems:"center"},c.a.createElement(o.a,{flex:1},c.a.createElement(o.f,{flex:1},t.id," ",t.solution_concentration&&"[\u0436\u0438\u0434\u043a\u0438\u0439 ".concat(t.solution_concentration," \u0433/\u043b]")),c.a.createElement(o.d,null,m.b.map((function(e){var t=n.elements[e];return t?c.a.createElement(b.a,{name:e,key:e,value:t}):null})))),c.a.createElement(o.d,null,c.a.createElement(z.a,{button:function(e){var t=e.modal;return c.a.createElement(d.a,{padding:1,alignSelf:"center",component:s.a,backgroundColor:"primary",onClick:t.open})},container:function(e){var n=e.modal;return c.a.createElement(c.a.Fragment,null,c.a.createElement(C,{initialValues:w(t)}),c.a.createElement(o.d,{justifyContent:"flex-end"},c.a.createElement(o.b,{type:"button",onClick:function(){return function(e){var n={id:t.id,name:i.id};i.composition_enable?n.composition=i.composition:n.npk=i.npk,i.solution_density_enable&&(n.solution_density=i.solution_density,n.solution_concentration=i.solution_concentration),p(Object(S.d)(n)),e.close()}(n)}},"Save")))}}),c.a.createElement(d.a,{padding:1,alignSelf:"center",component:f.a,backgroundColor:"danger",onClick:function(){p(Object(S.e)(t))}})))))}var D=n(290);function F(e){var t=Object(l.d)((function(e){return e.calculator})).fertilizers,n=Object(k.b)(y.a),r=Object(a.a)(n,1)[0],u=Object(l.c)();return c.a.createElement(o.d,{flexDirection:"column"},c.a.createElement(o.d,null,c.a.createElement(z.a,{button:function(e){var t=e.modal;return c.a.createElement(d.a,{padding:1,alignSelf:"center",component:D.a,backgroundColor:"primary",onClick:t.open})},container:function(e){var t=e.modal;return c.a.createElement(c.a.Fragment,null,c.a.createElement(C,{initialValues:w({id:""})}),c.a.createElement(o.d,{justifyContent:"flex-end"},c.a.createElement(o.b,{type:"button",onClick:function(){return function(e){var t={id:r.id,name:r.id};r.composition_enable?t.composition=r.composition:t.npk=r.npk,r.solution_density_enable&&(t.solution_density=r.solution_density),u(Object(S.d)(t)),e.close()}(t)}},"Save")))}})),c.a.createElement(i.ReactSortable,{list:t,setList:function(e){return u(Object(S.g)(e))}},t.map((function(e){return c.a.createElement(I,{fertilizer:e,key:e.id})}))))}t.default=F}}]);
//# sourceMappingURL=7.a5087532.chunk.js.map