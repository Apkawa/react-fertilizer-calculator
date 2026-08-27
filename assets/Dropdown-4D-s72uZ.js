import{s as e,t}from"./react-B31X8Y7i.js";import{a as n,h as r,m as i,n as a}from"./index.esm-CiZavOIG.js";import{At as o,Ft as s,kt as c}from"./index-Cz0Rsiov.js";import{n as l}from"./index.esm-BIVt-eC5.js";i();var u=e(t()),d=u.createContext({}),f=({children:e})=>u.createElement(n.Flex,{padding:2,sx:{position:`relative`,zIndex:1,"&::before":{backgroundColor:`highlight`,content:`""`,position:`absolute`,left:0,top:0,opacity:0,width:`100%`,height:`100%`,zIndex:-1},"&:hover::before":{opacity:.1}}},e),p=c(n.Box)`
  ${e=>e.disabled&&o`
      pointer-events: none;
      opacity: 0.4;
  `}

`;function m(e){let{value:t,index:n}=e,r=(0,u.useContext)(d);return u.createElement(p,{onClick:()=>{r.onItemClick&&r.onItemClick(t)},disabled:r.checkDisabledItem&&r.checkDisabledItem(t)},u.createElement(f,null,r.renderItem?u.createElement(r.renderItem,{item:t,index:n}):t+``))}function h(e){let t=e.items,r=(0,u.useRef)(),[i,o]=(0,u.useState)(0);return(0,u.useEffect)(()=>{o(r?.current?.offsetHeight||0)},[]),u.createElement(a,{backgroundColor:`background`,padding:0,maxHeight:i*5,overflowY:`auto`,sx:{zIndex:3}},u.createElement(n.Flex,{flexDirection:`column`},Array.from(t).map((e,i)=>u.createElement(n.Box,{ref:i===0?r:null,key:String(e)},u.createElement(m,{value:e,index:i,key:String(e)}),i<t.length-1?u.createElement(`hr`,{style:{margin:0}}):null))))}var g=r(s)`
  color: ${e=>e.theme.colors.text};
  height: 3rem;
  opacity: 0.5;

  &:hover {
    opacity: 0.7;
  }
`;function _(e){let{width:t}=e,r=t=>e.renderValue?e.renderValue(t):(t||``)+``,[i,a]=(0,u.useState)(!1),[o,s]=(0,u.useState)(e.value||null),[c,f]=(0,u.useState)(r(e.value||null)),[p,m]=(0,u.useState)(!1),_=(0,u.useRef)();(0,u.useEffect)(()=>{function e(e){_.current&&!_.current.contains(e.target)&&a(!1)}return document.addEventListener(`mousedown`,e),()=>{document.removeEventListener(`mousedown`,e)}},[]);let v=t=>{s(t),f(r(t)),e.onChange&&e.onChange(t),m(!1),a(!1)},y=e=>{let t=e.target.value;f(t),m(!0),a(!1)},b=t=>{t.stopPropagation(),t.key===`Enter`&&e.onEdit&&e.onEdit(c),t.key===`Escape`&&v(o)},x=()=>{p&&c&&e.onEdit&&e.onEdit(c)},S={onItemClick:v,renderItem:e.renderItem,checkDisabledItem:e.checkDisabledItem};return u.createElement(d.Provider,{value:S},u.createElement(n.Flex,{flexDirection:`column`,width:t,ref:_},u.createElement(n.Flex,{sx:{position:`relative`}},u.createElement(l,{value:c,onChange:y,onKeyDown:b,onBlur:x}),u.createElement(n.Box,{sx:{position:`absolute`,right:0}},u.createElement(g,{name:`chevron-down`,onClick:()=>a(!i)}))),u.createElement(n.Flex,{sx:{position:`relative`}},u.createElement(n.Flex,{sx:{position:`absolute`},flexDirection:`column`,width:`100%`},i&&u.createElement(h,{items:e.items})))))}export{_ as t};