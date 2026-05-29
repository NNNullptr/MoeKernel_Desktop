import{t as A,j as e,R as G,r as a,u as dt}from"./main-DX0oqfKq.js";import{u as Y}from"./useQuery-CgybRRql.js";import{M as Re,r as _e}from"./index-Cm2cyT_t.js";import{u as pt}from"./useMutation-DLl67bpg.js";const Ze=[{id:"myComputer",label:"My Computer",src:"/assets/icons/My Computer.png"},{id:"resume",label:"Resume",src:"/assets/icons/Resume.png"},{id:"aboutme",label:"About Me",src:"/assets/icons/About.png"},{id:"contact",label:"Contact Me",src:"/assets/icons/Contact.png"},{id:"webamp",label:"Winamp",src:"/assets/icons/Winamp.png"},{id:"paint",label:"Paint",src:"/assets/icons/Paint.png"},{id:"gamesFolder",label:"Games",src:"/assets/icons/Games.png"},{id:"video",label:"Media Player",src:"/assets/icons/Media.png"},{id:"portfolio",label:"My Portfolio",src:"/assets/icons/Portfolio.png"},{id:"blog",label:"My Blog",src:"/assets/icons/Blog.png"},{id:"chatbox",label:"ChatBox",src:"/assets/icons/MSN.png"},{id:"recycleBin",label:"Recycle Bin",src:"/assets/icons/Recycle.png"}],Fe="/assets/icons/file.png",ct=new Set(["png","jpg","jpeg","webp","gif","ico","bmp","svg"]),xt=new Set(["mp4","webm","mov","avi"]),gt=new Set(["mp3","ogg","wav","flac","aac"]);function Le(t){const n=t.split(".").pop()?.toLowerCase()??"";return ct.has(n)?"image":xt.has(n)?"video":gt.has(n)?"audio":"other"}function We(t){return"/assets/"+t.join("/")}let Pe=null;function Se(t){Pe=t}function Ae(){const t=Pe;return Pe=null,t}const et=[{name:"icons",type:"folder",children:[{name:"file.png",type:"file"},{name:"My Computer.png",type:"file"},{name:"Resume.png",type:"file"},{name:"About.png",type:"file"},{name:"Contact.png",type:"file"},{name:"Winamp.png",type:"file"},{name:"Paint.png",type:"file"},{name:"Games.png",type:"file"},{name:"MSN.png",type:"file"},{name:"Media.png",type:"file"},{name:"Portfolio.png",type:"file"},{name:"Blog.png",type:"file"},{name:"Recycle.png",type:"file"},{name:"github.png",type:"file"},{name:"twitter.png",type:"file"},{name:"blog2.png",type:"file"},{name:"tray",type:"folder",children:[{name:"icon1.png",type:"file"},{name:"icon2.png",type:"file"}]}]},{name:"wallpapers",type:"folder",children:[{name:"wallpaper.jpg",type:"file"},{name:"wallpaper1.jpg",type:"file"},{name:"wallpaper2.jpg",type:"file"},{name:"bg1.jpg",type:"file"},{name:"bg2.jpg",type:"file"},{name:"bg3.jpg",type:"file"},{name:"bg4.jpg",type:"file"},{name:"bg5.jpg",type:"file"},{name:"bg6.jpg",type:"file"},{name:"bg7.jpg",type:"file"},{name:"bg8.jpg",type:"file"}]},{name:"video",type:"folder",children:[{name:"1.mp4",type:"file"},{name:"1.webp",type:"file"}]},{name:"tracks",type:"folder",children:[{name:"Tatara.mp3",type:"file"}]},{name:"covers",type:"folder",children:[{name:"cover1.jpg",type:"file"},{name:"cover2.jpg",type:"file"}]},{name:"pets",type:"folder",children:[{name:"avatars",type:"folder",children:[]},{name:"sprites",type:"folder",children:[]}]},{name:"portfolio",type:"folder",children:[]}];let Me=[];function ft(t){Me=t}function ut(){const t=Me;return Me=[],t}const ht="/assets/wallpapers/wallpaper.jpg",bt="https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico",mt=["https://static.step1.dev/g9nbov/assets/f41de3abce9a.png","https://static.step1.dev/g9nbov/assets/cff960cc7c15.png","https://static.step1.dev/g9nbov/assets/a52bbbc23e20.png","/assets/icons/tray/icon1.png","/assets/icons/tray/icon2.png"],yt=[{id:"github",name:"GitHub",url:"https://github.com/NNNullptr",iconSrc:"/assets/icons/github.png",emoji:""},{id:"twitter",name:"Twitter",url:"https://x.com/NNNullptr",iconSrc:"/assets/icons/twitter.png",emoji:""}],vt={name:"NNNullptr",title:"简介一段",location:"null",avatarSrc:"/assets/avatarSrc.jpg",markdownContent:`## 标题

欢迎访问，随便写几句
`};function Oe(t,n){if(!t)return n;try{return JSON.parse(t)}catch{return n}}function Q(){const{data:t}=Y({...A.site.getSettings.queryOptions(),staleTime:0,refetchOnWindowFocus:!0}),n=t?.system_tray_icons,o=n?JSON.parse(n):mt,s=t?.chatbox_bg_opacity,r=t?.portfolio_bg_opacity,i=t?.winamp_bg_opacity,l=t?.about_bg_opacity,f=t?.contact_bg_opacity;return{isLoaded:!!t,wallpaperUrl:t?.wallpaper_url??ht,logoUrl:t?.windows_logo_url??bt,systemTrayIcons:o,chatboxBgUrl:t?.chatbox_bg_url??"",chatboxBgOpacity:s?parseFloat(s):.15,portfolioBgUrl:t?.portfolio_bg_url??"",portfolioBgOpacity:r?parseFloat(r):.2,winampBgUrl:t?.winamp_bg_url??"",winampBgOpacity:i?parseFloat(i):.3,aboutBgUrl:t?.about_bg_url??"/assets/wallpapers/bg2.jpg",aboutBgOpacity:l?parseFloat(l):.5,contactBgUrl:t?.contact_bg_url??"",contactBgOpacity:f?parseFloat(f):.15,contactLinks:Oe(t?.contact_content,yt),aboutConfig:Oe(t?.about_content,vt),siteTitle:t?.site_title??"NNNullptr",siteDescription:t?.site_description??"NNNullptr",siteAuthor:t?.site_author??"NNNullptr",siteUsername:t?.site_username??"NNNullptr",siteAvatarUrl:t?.site_avatar_url??"/assets/avatarSrc.jpg",siteRole:t?.site_role??"Software Developer",siteBrand:t?.site_brand??"MoeKernel",bootSubtitle:t?.boot_subtitle??"Welcome"}}const ue='"Trebuchet MS", Tahoma, Arial, sans-serif',St=Ze.filter(t=>t.id!=="recycleBin").map(t=>({id:t.id,icon:t.src,label:t.label,highlight:t.id==="resume"})),jt=et.filter(t=>t.type==="folder").slice(0,5);function wt({onItemClick:t,onLogOff:n,onTurnOff:o}){const s=Q(),r=i=>{ft([i]),window.dispatchEvent(new CustomEvent("xp-navigate-mycomputer",{detail:[i]})),t?.("myComputer")};return e.jsxs("div",{style:{position:"fixed",bottom:"30px",left:"0px",width:"460px",zIndex:1e4,boxShadow:"4px -4px 16px rgba(0,0,0,0.6)",borderRadius:"8px 8px 0 0",overflow:"hidden",fontFamily:ue,fontSize:"13px",userSelect:"none",border:"1px solid var(--xp-chrome-border-dark)",borderBottom:"none"},onClick:i=>i.stopPropagation(),"data-cid":"HD7_TIcV",children:[e.jsxs("div",{style:{background:"linear-gradient(180deg, #e0e0e0 0%, #c8c8c8 50%, #a8a8a8 100%)",padding:"8px 12px",display:"flex",alignItems:"center",gap:"10px",borderBottom:"2px solid #888"},children:[e.jsx("img",{src:s.siteAvatarUrl,alt:s.siteUsername,style:{width:"50px",height:"50px",border:"2px solid #b8b8b8",borderRadius:"2px",objectFit:"cover",background:"#fff"}}),e.jsx("span",{style:{color:"#000",fontWeight:"bold",fontSize:"15px",textShadow:"1px 1px 3px rgba(255,255,255,0.5)"},children:s.siteUsername})]}),e.jsxs("div",{style:{display:"flex",height:"400px"},children:[e.jsxs("div",{style:{flex:1,background:"#ffffff",display:"flex",flexDirection:"column",overflowY:"auto",paddingTop:"4px"},children:[St.map((i,l)=>e.jsxs(G.Fragment,{children:[l===1&&e.jsx(He,{color:"#d4d0c8"}),e.jsx(kt,{icon:i.icon,label:i.label,highlighted:i.highlight,onClick:()=>t?.(i.id)})]},i.id)),e.jsxs("div",{style:{marginTop:"auto"},children:[e.jsx(He,{color:"#d4d0c8"}),e.jsx(Tt,{})]})]}),e.jsx("div",{style:{width:"210px",background:"linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)",borderLeft:"1px solid #a0a0a0",display:"flex",flexDirection:"column",overflowY:"auto",paddingTop:"6px"},children:jt.map(i=>e.jsx(Ct,{icon:i.icon??Fe,label:i.name,onClick:()=>r(i.name)},i.name))})]}),e.jsxs("div",{style:{background:"linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%)",borderTop:"2px solid #888",display:"flex",justifyContent:"flex-end",gap:"8px",padding:"6px 12px"},children:[e.jsx(Ne,{label:"Log Off",emoji:"\\uD83D\\uDD13",onClick:n}),e.jsx(Ne,{label:"Turn Off Computer",emoji:"\\u23FB",onClick:o})]})]})}function He({color:t}){return e.jsx("hr",{style:{border:"none",borderTop:`1px solid ${t}`,margin:"4px 8px"},"data-cid":"eQm2TKyo"})}function kt({icon:t,label:n,highlighted:o,onClick:s}){const[r,i]=G.useState(!1),l=o||r;return e.jsxs("button",{onClick:s,onMouseEnter:()=>i(!0),onMouseLeave:()=>i(!1),style:{display:"flex",alignItems:"center",gap:"10px",padding:"6px 12px",background:l?"var(--xp-chrome-highlight)":"transparent",color:"#000",border:"none",textAlign:"left",cursor:"pointer",width:"100%",fontSize:"13px",fontFamily:ue,fontWeight:o?"bold":"normal"},"data-cid":"ed-q39Al",children:[e.jsx("img",{src:t,alt:n,style:{width:"32px",height:"32px",objectFit:"contain",flexShrink:0}}),e.jsx("span",{children:n})]})}function Ct({icon:t,label:n,onClick:o}){const[s,r]=G.useState(!1);return e.jsxs("button",{onClick:o,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),style:{display:"flex",alignItems:"center",gap:"8px",padding:"6px 10px",background:s?"var(--xp-chrome-highlight)":"transparent",color:"#000",border:"none",textAlign:"left",cursor:"pointer",width:"100%",fontSize:"13px",fontFamily:ue},"data-cid":"rcfXwp1Y",children:[e.jsx("img",{src:t,alt:n,style:{width:"28px",height:"28px",objectFit:"contain",flexShrink:0}}),e.jsx("span",{children:n})]})}function Tt(){const[t,n]=G.useState(!1);return e.jsxs("button",{onMouseEnter:()=>n(!0),onMouseLeave:()=>n(!1),style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 12px",background:t?"var(--xp-chrome-highlight)":"transparent",color:"#000",border:"none",cursor:"pointer",width:"100%",fontSize:"13px",fontFamily:ue,fontWeight:"bold"},"data-cid":"m2TE77Q2",children:[e.jsx("span",{children:"All Programs"}),e.jsx("span",{style:{fontSize:"10px"},children:"►"})]})}function Ne({label:t,emoji:n,onClick:o}){const[s,r]=G.useState(!1);return e.jsxs("button",{onClick:o,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),style:{display:"flex",alignItems:"center",gap:"6px",padding:"4px 10px",background:s?"linear-gradient(180deg,#ececec 0%,#bcbcbc 100%)":"linear-gradient(180deg,#d8d8d8 0%,#a8a8a8 100%)",border:"1px solid #888",borderRadius:"4px",color:"#000",fontSize:"12px",fontFamily:ue,cursor:"pointer",boxShadow:"0 1px 2px rgba(0,0,0,0.4)"},"data-cid":"2ThIc19E",children:[e.jsx("span",{children:n}),e.jsx("span",{children:t})]})}function zt({position:t,onPositionChange:n,onDragStart:o}){const s=a.useRef(null);return{handleTitlePointerDown:a.useCallback(i=>{if(i.button!==0||i.target.closest("[data-window-btn]"))return;i.preventDefault(),i.currentTarget.setPointerCapture(i.pointerId),s.current={dx:i.clientX-t.x,dy:i.clientY-t.y},o?.();const l=30,f=d=>{if(!s.current)return;const h=d.clientX-s.current.dx,m=d.clientY-s.current.dy,S=Math.max(-200,Math.min(window.innerWidth-40,h)),u=Math.max(0,Math.min(window.innerHeight-l-30,m));n({x:S,y:u})},x=()=>{s.current=null,document.removeEventListener("pointermove",f),document.removeEventListener("pointerup",x)};document.addEventListener("pointermove",f),document.addEventListener("pointerup",x)},[t,n,o])}}const tt='"Trebuchet MS", Tahoma, Arial, sans-serif',Ue=200,$e=120,Bt={n:"n-resize",s:"s-resize",e:"e-resize",w:"w-resize",nw:"nw-resize",ne:"ne-resize",sw:"sw-resize",se:"se-resize"},Pt=5;function Mt({dir:t,win:n,onSizeChange:o,onFocus:s}){const r=a.useRef(null),i=a.useCallback(h=>{h.preventDefault(),h.stopPropagation(),s(n.id),r.current={px:h.clientX,py:h.clientY,x:n.x,y:n.y,w:n.width,h:n.height},h.currentTarget.setPointerCapture(h.pointerId)},[n,s]),l=a.useCallback(h=>{const m=r.current;if(!m)return;const S=h.clientX-m.px,u=h.clientY-m.py;let{x:k,y:v,w:b,h:z}=m;if(t.includes("e")&&(b=Math.max(Ue,m.w+S)),t.includes("w")){const j=Math.max(Ue,m.w-S);k=m.x+(m.w-j),b=j}if(t.includes("s")&&(z=Math.max($e,m.h+u)),t.includes("n")){const j=Math.max($e,m.h-u);v=m.y+(m.h-j),z=j}o(n.id,k,v,b,z)},[t,n.id,o]),f=a.useCallback(()=>{r.current=null},[]),x={position:"absolute",zIndex:10,cursor:Bt[t]},d=Pt;return t==="n"&&Object.assign(x,{top:0,left:d,right:d,height:d}),t==="s"&&Object.assign(x,{bottom:0,left:d,right:d,height:d}),t==="e"&&Object.assign(x,{top:d,right:0,bottom:d,width:d}),t==="w"&&Object.assign(x,{top:d,left:0,bottom:d,width:d}),t==="nw"&&Object.assign(x,{top:0,left:0,width:d,height:d}),t==="ne"&&Object.assign(x,{top:0,right:0,width:d,height:d}),t==="sw"&&Object.assign(x,{bottom:0,left:0,width:d,height:d}),t==="se"&&Object.assign(x,{bottom:0,right:0,width:d,height:d}),e.jsx("div",{style:x,onPointerDown:i,onPointerMove:l,onPointerUp:f,"data-cid":"qh1HxhSN"})}function It({win:t,onFocus:n,onClose:o,onMinimize:s,onPositionChange:r,onSizeChange:i,children:l}){const[f,x]=a.useState(!1),[d,h]=a.useState({x:t.x,y:t.y,w:t.width,h:t.height}),m=a.useCallback(b=>r(t.id,b.x,b.y),[t.id,r]),{handleTitlePointerDown:S}=zt({position:{x:t.x,y:t.y},onPositionChange:m,onDragStart:()=>n(t.id)}),u=a.useCallback(()=>{f?i(t.id,d.x,d.y,d.w,d.h):(h({x:t.x,y:t.y,w:t.width,h:t.height}),r(t.id,0,0)),x(b=>!b)},[f,t,d,r,i]);if(t.minimized)return null;const v=f?{position:"fixed",left:0,top:0,width:"calc(100vw - 34px)",height:"calc(100vh - 30px)",zIndex:t.zIndex}:{position:"fixed",left:t.x,top:t.y,width:t.width,height:t.height,zIndex:t.zIndex};return e.jsxs("div",{style:{...v,display:"flex",flexDirection:"column",boxShadow:"2px 2px 8px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.3)",border:"2px solid var(--xp-chrome-border-dark)",borderRadius:"6px 6px 0 0",overflow:"hidden",fontFamily:tt,userSelect:"none"},onPointerDown:()=>n(t.id),"data-cid":"g4qfYvG1",children:[!f&&["n","s","e","w","nw","ne","sw","se"].map(b=>e.jsx(Mt,{dir:b,win:t,onSizeChange:i,onFocus:n},b)),e.jsxs("div",{onPointerDown:S,style:{background:"linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 45%, #b8b8b8 55%, #c0c0c0 100%)",padding:"3px 4px",display:"flex",alignItems:"center",gap:"4px",cursor:"move",flexShrink:0,minHeight:"28px",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.6)"},children:[e.jsx("img",{src:t.icon,alt:t.title,style:{width:"16px",height:"16px",objectFit:"contain",flexShrink:0}}),e.jsx("span",{style:{flex:1,color:"#000",fontSize:"12px",fontWeight:"bold",textShadow:"1px 1px 1px rgba(255,255,255,0.4)",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},children:t.title}),e.jsxs("div",{style:{display:"flex",gap:"2px",flexShrink:0},"data-window-btn":!0,children:[e.jsx(je,{label:"_",title:"Minimize",color:"#c8c8c8",textColor:"#000",onClick:()=>s(t.id)}),e.jsx(je,{label:f?"❐":"□",title:"Maximize",color:"#c8c8c8",textColor:"#000",onClick:u}),e.jsx(je,{label:"✕",title:"Close",color:"#d93b3b",hoverColor:"#f05050",onClick:()=>o(t.id)})]})]}),e.jsx("div",{style:{flex:1,background:"#fff",overflow:"auto",position:"relative"},children:l})]})}function je({label:t,title:n,color:o,hoverColor:s,textColor:r,onClick:i}){const[l,f]=G.useState(!1),x=r==="#000"?"#f4f4f4":"#ff9a9a";return e.jsx("button",{"data-window-btn":!0,title:n,onClick:d=>{d.stopPropagation(),i()},onMouseEnter:()=>f(!0),onMouseLeave:()=>f(!1),style:{width:"21px",height:"21px",background:l?`linear-gradient(180deg, ${s??o} 0%, ${o} 100%)`:`linear-gradient(180deg, ${x} 0%, ${o} 100%)`,border:"1px solid var(--xp-chrome-border)",borderRadius:"3px",color:r??"#fff",fontSize:"11px",fontWeight:"bold",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,fontFamily:tt,flexShrink:0,padding:0},"data-cid":"Y4YokjFj",children:t})}const oe=80,we=4,nt=30,ne=8;function ke(t,n,o){const r=(n??600)-nt-ne*2,i=Math.max(1,Math.floor(r/(oe+we)));let l=0;return t.map(f=>{const x=o?.find(m=>m.id===f.id);if(x?.isCustomPos)return{...x};const d=Math.floor(l/i),h=l%i;return l++,{...f,x:ne+d*(oe+we),y:ne+h*(oe+we),isCustomPos:!1}})}function Ve(t,n,o=window.innerWidth,s=window.innerHeight){const r=o-oe-ne,i=s-nt-oe-ne;return{x:Math.max(ne,Math.min(r,t)),y:Math.max(ne,Math.min(i,n))}}function Rt(t){const[n,o]=a.useState(()=>ke(t)),[s,r]=a.useState(null),i=a.useRef(null);a.useEffect(()=>{o(d=>ke(t,window.innerHeight,d))},[t]);const l=a.useCallback((d,h)=>{if(d.button!==0)return;d.stopPropagation(),d.preventDefault(),r(h);const m=n.find(k=>k.id===h);if(!m)return;i.current={id:h,ox:d.clientX-m.x,oy:d.clientY-m.y},d.currentTarget.setPointerCapture(d.pointerId);const S=k=>{if(!i.current)return;const v={x:k.clientX-i.current.ox,y:k.clientY-i.current.oy},b=Ve(v.x,v.y);o(z=>z.map(j=>j.id===i.current?.id?{...j,...b}:j))},u=()=>{if(i.current){const k=i.current.id;o(v=>v.map(b=>b.id===k?{...b,isCustomPos:!0}:b)),i.current=null}document.removeEventListener("pointermove",S),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",S),document.addEventListener("pointerup",u)},[n]),f=a.useCallback(()=>{r(null)},[]),x=a.useCallback(d=>{r(d)},[]);return a.useEffect(()=>{const d=()=>{const h=window.innerWidth,m=window.innerHeight;o(S=>ke(t,m,S).map(k=>{if(!k.isCustomPos)return k;const v=Ve(k.x,k.y,h,m);return v.x===k.x&&v.y===k.y?k:{...k,...v}}))};return window.addEventListener("resize",d),()=>window.removeEventListener("resize",d)},[t]),{icons:n,selectedId:s,startDrag:l,deselectAll:f,selectIcon:x}}function _t({pets:t,activePetIds:n,onToggle:o}){return e.jsx("div",{style:{position:"fixed",right:0,top:0,bottom:30,width:34,display:"flex",flexDirection:"column",alignItems:"center",gap:2,paddingTop:6,paddingBottom:6,background:"linear-gradient(90deg, var(--xp-gradient))",borderLeft:"1px solid rgb(136, 136, 136)",boxShadow:"#f0f0f0 1px 0 1px inset",zIndex:9e3,overflowY:"auto",overflowX:"hidden",scrollbarWidth:"none"},"data-cid":"m59STVzK",children:t.map(s=>e.jsx(Ft,{pet:s,active:n.has(s.id),onToggle:o},s.id))})}function Ft({pet:t,active:n,onToggle:o}){const[s,r]=a.useState(!1),i=t.iconSrc.startsWith("http")||t.iconSrc.startsWith("/"),l=()=>n?{background:"linear-gradient(135deg, #c0c0c0, #d4d4d4)",boxShadow:"inset 1px 1px 2px rgba(0,0,0,0.35), inset -1px -1px 1px rgba(255,255,255,0.6)",border:"1px solid #a0a0a0"}:s?{background:"linear-gradient(135deg, #f8f8f8, #e8e8e8)",boxShadow:"inset -1px -1px 1px rgba(0,0,0,0.2), inset 1px 1px 1px rgba(255,255,255,0.9)",border:"1px solid #b0b0b0"}:{background:"transparent",boxShadow:"none",border:"1px solid transparent"};return e.jsxs("div",{style:{position:"relative",flexShrink:0},"data-cid":"jsgkqy0R",children:[e.jsx("button",{title:t.label,onClick:f=>{f.stopPropagation(),o(t.id)},onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),style:{width:28,height:28,borderRadius:3,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,overflow:"hidden",transition:"background 0.1s ease, box-shadow 0.1s ease",...l()},children:i?e.jsx("img",{src:t.iconSrc,alt:t.label,draggable:!1,style:{width:20,height:20,objectFit:"contain",pointerEvents:"none",imageRendering:"pixelated",opacity:n?.88:1}}):e.jsx("span",{style:{fontSize:16,lineHeight:1,pointerEvents:"none"},children:t.iconSrc})}),s&&e.jsxs("div",{style:{position:"absolute",right:32,top:"50%",transform:"translateY(-50%)",background:"#ffffe1",border:"1px solid #767676",borderRadius:2,padding:"2px 7px",whiteSpace:"nowrap",color:"#000000",fontSize:11,fontFamily:'"Trebuchet MS", Tahoma, Arial, sans-serif',fontWeight:"normal",boxShadow:"1px 1px 3px rgba(0,0,0,0.25)",pointerEvents:"none",zIndex:9100},children:[t.label,e.jsx("span",{style:{position:"absolute",right:-5,top:"50%",transform:"translateY(-50%)",width:0,height:0,borderTop:"4px solid transparent",borderBottom:"4px solid transparent",borderLeft:"5px solid #767676"}}),e.jsx("span",{style:{position:"absolute",right:-3,top:"50%",transform:"translateY(-50%)",width:0,height:0,borderTop:"3px solid transparent",borderBottom:"3px solid transparent",borderLeft:"4px solid #ffffe1"}})]}),n&&e.jsx("div",{style:{position:"absolute",bottom:-2,right:-2,width:6,height:6,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%, #7ef, #18bbff)",border:"1px solid rgba(0,100,200,0.6)",boxShadow:"0 0 4px rgba(24,187,255,0.8)"}})]})}const At=30;function Dt(t){return t.startsWith("http")||t.startsWith("/")}function Et({pet:t,onDismiss:n}){const[o,s]=a.useState({x:window.innerWidth-160,y:80+Math.random()*200}),r=a.useRef(null),i=t.size??80,l=a.useCallback(h=>{h.button===0&&(h.preventDefault(),h.stopPropagation(),h.currentTarget.setPointerCapture(h.pointerId),r.current={ox:h.clientX-o.x,oy:h.clientY-o.y})},[o]),f=a.useCallback(h=>{if(!r.current)return;const m=h.clientX-r.current.ox,S=h.clientY-r.current.oy;s({x:Math.max(0,Math.min(window.innerWidth-i-8,m)),y:Math.max(0,Math.min(window.innerHeight-At-i-8,S))})},[i]),x=a.useCallback(()=>{r.current=null},[]),d=Dt(t.petSrc);return e.jsxs("div",{onPointerDown:l,onPointerMove:f,onPointerUp:x,style:{position:"fixed",left:o.x,top:o.y,zIndex:9999,cursor:r.current?"grabbing":"grab",userSelect:"none",WebkitUserSelect:"none",touchAction:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"},"data-cid":"0zlNpKKV",children:[e.jsx("button",{onClick:h=>{h.stopPropagation(),n(t.id)},onPointerDown:h=>h.stopPropagation(),style:{position:"absolute",top:-8,right:-8,width:16,height:16,borderRadius:"50%",background:"linear-gradient(180deg, #f87171 0%, #dc2626 100%)",border:"1px solid #991b1b",color:"#fff",fontSize:"9px",fontWeight:"bold",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,padding:0,zIndex:1,boxShadow:"0 1px 3px rgba(0,0,0,0.4)"},children:"×"}),d?e.jsx("img",{src:t.petSrc,alt:t.label,draggable:!1,style:{width:i,height:i,objectFit:"contain",pointerEvents:"none",imageRendering:"auto",filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.4))"}}):e.jsx("div",{style:{fontSize:i*.7,lineHeight:1,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.4))",pointerEvents:"none"},children:t.petSrc}),e.jsx("span",{style:{color:"#fff",fontSize:"10px",textShadow:"1px 1px 2px rgba(0,0,0,0.9)",fontFamily:'"Trebuchet MS", Tahoma, Arial, sans-serif',background:"rgba(0,0,60,0.55)",padding:"1px 4px",borderRadius:2,whiteSpace:"nowrap",pointerEvents:"none"},children:t.label})]})}const Lt=[{id:"pet_1",label:" ",iconSrc:"/assets/pets/avatars/1.png",petSrc:"/assets/pets/sprites/20.png",size:140},{id:"pet_2",label:" ",iconSrc:"/assets/pets/avatars/5.png",petSrc:"/assets/pets/sprites/21.png",size:120},{id:"pet_3",label:" ",iconSrc:"/assets/pets/avatars/3.png",petSrc:"/assets/pets/sprites/1.gif",size:150},{id:"pet_4",label:" ",iconSrc:"/assets/pets/avatars/4.png",petSrc:"/assets/pets/sprites/2.gif",size:200},{id:"pet_5",label:" ",iconSrc:"/assets/pets/avatars/6.png",petSrc:"/assets/pets/sprites/3.gif",size:220},{id:"pet_6",label:" ",iconSrc:"/assets/pets/avatars/7.png",petSrc:"/assets/pets/sprites/4.gif",size:260},{id:"pet_7",label:" ",iconSrc:"/assets/pets/avatars/8.png",petSrc:"/assets/pets/sprites/5.png",size:150},{id:"pet_8",label:" ",iconSrc:"/assets/pets/avatars/9.png",petSrc:"/assets/pets/sprites/6.gif",size:220},{id:"pet_9",label:" ",iconSrc:"/assets/pets/avatars/10.png",petSrc:"/assets/pets/sprites/7.gif",size:150},{id:"pet_10",label:" ",iconSrc:"/assets/pets/avatars/11.png",petSrc:"/assets/pets/sprites/8.gif",size:200},{id:"pet_11",label:" ",iconSrc:"/assets/pets/avatars/12.png",petSrc:"/assets/pets/sprites/9.gif",size:250},{id:"pet_12",label:" ",iconSrc:"/assets/pets/avatars/13.png",petSrc:"/assets/pets/sprites/10.png",size:120},{id:"pet_13",label:" ",iconSrc:"/assets/pets/avatars/14.png",petSrc:"/assets/pets/sprites/11.png",size:180},{id:"pet_14",label:" ",iconSrc:"/assets/pets/avatars/15.png",petSrc:"/assets/pets/sprites/12.gif",size:180},{id:"pet_15",label:" ",iconSrc:"/assets/pets/avatars/16.png",petSrc:"/assets/pets/sprites/13.gif",size:190},{id:"pet_16",label:" ",iconSrc:"/assets/pets/avatars/17.png",petSrc:"/assets/pets/sprites/14.gif",size:230},{id:"pet_17",label:" ",iconSrc:"/assets/pets/avatars/18.png",petSrc:"/assets/pets/sprites/15.png",size:200},{id:"pet_18",label:" ",iconSrc:"/assets/pets/avatars/19.png",petSrc:"/assets/pets/sprites/16.png",size:200},{id:"pet_19",label:" ",iconSrc:"/assets/pets/avatars/20.png",petSrc:"/assets/pets/sprites/17.gif",size:210},{id:"pet_20",label:" ",iconSrc:"/assets/pets/avatars/21.png",petSrc:"/assets/pets/sprites/18.png",size:220},{id:"pet_21",label:" ",iconSrc:"/assets/pets/avatars/22.png",petSrc:"/assets/pets/sprites/19.png",size:210},{id:"pet_22",label:" ",iconSrc:"/assets/pets/avatars/23.png",petSrc:"/assets/pets/sprites/22.png",size:165},{id:"pet_23",label:" ",iconSrc:"/assets/pets/avatars/24.png",petSrc:"/assets/pets/sprites/23.png",size:150},{id:"pet_24",label:" ",iconSrc:"/assets/pets/avatars/25.png",petSrc:"/assets/pets/sprites/24.png",size:120},{id:"pet_25",label:" ",iconSrc:"/assets/pets/avatars/26.png",petSrc:"/assets/pets/sprites/25.png",size:200},{id:"pet_26",label:" ",iconSrc:"/assets/pets/avatars/27.png",petSrc:"/assets/pets/sprites/26.png",size:180},{id:"pet_27",label:" ",iconSrc:"/assets/pets/avatars/28.png",petSrc:"/assets/pets/sprites/28.gif",size:250},{id:"pet_28",label:" ",iconSrc:"/assets/pets/avatars/2.png",petSrc:"/assets/pets/sprites/27.png",size:180}],ge='"Trebuchet MS", Tahoma, Arial, sans-serif';function ot(t,n){if(t.length===0)return n;const[o,...s]=t,r=n.find(i=>i.name===o&&i.type==="folder");return!r||!r.children?[]:ot(s,r.children)}function Wt({address:t,onBack:n,canGoBack:o}){return e.jsxs("div",{style:{background:"#ece9d8",borderBottom:"1px solid #aca899",fontFamily:ge,fontSize:"12px",flexShrink:0},"data-cid":"OpfItE8w",children:[e.jsx("div",{style:{display:"flex",gap:"2px",padding:"2px 4px",borderBottom:"1px solid #aca899"},children:["File","Edit","View","Favorites","Tools","Help"].map(s=>e.jsx("button",{style:{background:"none",border:"none",padding:"2px 6px",cursor:"pointer",fontFamily:ge,fontSize:"12px"},children:s},s))}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",padding:"3px 6px"},children:[e.jsx("button",{onClick:n,disabled:!o,style:{background:o?"#d4d0c8":"#e8e8e4",border:"1px solid #aca899",borderRadius:"2px",padding:"1px 8px",cursor:o?"pointer":"default",fontFamily:ge,fontSize:"11px",color:o?"#000":"#aaa"},children:"← Back"}),e.jsx("span",{style:{color:"#555",fontSize:"11px"},children:"Address"}),e.jsx("div",{style:{flex:1,background:"#fff",border:"1px solid #999",padding:"1px 6px",fontSize:"12px",borderRadius:"2px"},children:t})]})]})}function Ot({src:t}){return e.jsx("video",{src:t,muted:!0,preload:"metadata",style:{width:48,height:48,objectFit:"cover",borderRadius:2,display:"block"},onLoadedMetadata:n=>{n.currentTarget.currentTime=1},"data-cid":"746bluH9"})}function Xe({label:t,onClick:n,imageSrc:o,videoSrc:s,iconSrc:r}){const[i,l]=a.useState(!1);let f;return o?f=e.jsx("img",{src:o,alt:t,style:{width:48,height:48,objectFit:"cover",borderRadius:2,border:"1px solid #ccc"}}):s?f=e.jsx(Ot,{src:s}):f=e.jsx("img",{src:r??Fe,alt:t,style:{width:48,height:48,objectFit:"contain"}}),e.jsxs("div",{onMouseEnter:()=>l(!0),onMouseLeave:()=>l(!1),onClick:n,style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",width:"80px",cursor:n?"pointer":"default",background:i?"#5a5a5a":"transparent",borderRadius:"4px",padding:"8px 4px"},"data-cid":"7-4gwA2w",children:[f,e.jsx("span",{style:{fontSize:"11px",fontFamily:ge,color:i?"#fff":"#000",textAlign:"center",wordBreak:"break-word"},children:t})]})}function Ht(){const[t,n]=a.useState(()=>ut());a.useEffect(()=>{const i=l=>{n(l.detail)};return window.addEventListener("xp-navigate-mycomputer",i),()=>window.removeEventListener("xp-navigate-mycomputer",i)},[]);const o=ot(t,et),s=t.length===0?"My Computer":"My Computer > "+t.join(" > "),r=i=>{const l=Le(i.name),f=We([...t,i.name]);l==="image"?(Se({type:"image",url:f,title:i.name}),window.dispatchEvent(new CustomEvent("xp-open-window",{detail:"imageViewer"}))):l==="video"?(Se({type:"video",url:f,title:i.name}),window.dispatchEvent(new CustomEvent("xp-open-window",{detail:"video"}))):l==="audio"&&(Se({type:"audio",url:f,title:i.name}),window.dispatchEvent(new CustomEvent("xp-open-window",{detail:"webamp"})))};return e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",background:"#fff"},"data-cid":"9d2JXiif",children:[e.jsx(Wt,{address:s,onBack:()=>n(i=>i.slice(0,-1)),canGoBack:t.length>0}),e.jsxs("div",{style:{flex:1,padding:"16px",display:"flex",flexWrap:"wrap",alignContent:"flex-start",gap:"20px",background:"#fff",overflowY:"auto"},children:[o.map(i=>{if(i.type==="folder")return e.jsx(Xe,{label:i.name,iconSrc:i.icon??"/assets/icons/Games.png",onClick:()=>n(x=>[...x,i.name]),"data-cid":"nrR2dcVd"},i.name);const l=Le(i.name),f=We([...t,i.name]);return e.jsx(Xe,{label:i.name,imageSrc:l==="image"?f:void 0,videoSrc:l==="video"?f:void 0,iconSrc:l==="audio"?"/assets/icons/Media.png":i.icon??Fe,onClick:()=>r(i),"data-cid":"mhPwc35I"},i.name)}),o.length===0&&e.jsx("span",{style:{color:"#888",fontSize:"12px",fontFamily:ge},children:"This folder is empty."})]})]})}const Nt=[{id:"tetris",title:"Tetris",icon:"🟦",description:"开源俄罗斯方块",url:"https://chvin.github.io/react-tetris/"},{id:"pacman",title:"Pac-Man",icon:"👾",description:"经典吃豆人，用方向键操控",url:"https://freepacman.org/"},{id:"minecraft",title:"Minecraft",icon:"🟩",iconSrc:"/assets/icons/MC.png",description:"MC",url:"/games/minecraft/index.html"}],ae='"Trebuchet MS", Tahoma, Arial, sans-serif';function Ut({address:t,canGoBack:n,onBack:o}){return e.jsxs("div",{style:{background:"#ece9d8",borderBottom:"1px solid #aca899",fontFamily:ae,fontSize:"12px",flexShrink:0},"data-cid":"SHIWnEeR",children:[e.jsx("div",{style:{display:"flex",gap:"2px",padding:"2px 4px",borderBottom:"1px solid #aca899"},children:["File","Edit","View","Favorites","Tools","Help"].map(s=>e.jsx("button",{style:{background:"none",border:"none",padding:"2px 6px",cursor:"pointer",fontFamily:ae,fontSize:"12px"},children:s},s))}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",padding:"3px 6px"},children:[e.jsx("button",{onClick:o,disabled:!n,title:"Back",style:{background:n?"linear-gradient(to bottom, #f0f0f0, #d0d0d0)":"#e8e8e0",border:n?"1px solid #888":"1px solid #bbb",borderRadius:"3px",padding:"1px 8px",cursor:n?"pointer":"default",fontFamily:ae,fontSize:"12px",color:n?"#000":"#aaa",display:"flex",alignItems:"center",gap:"3px",flexShrink:0},children:"◀ Back"}),e.jsx("span",{style:{color:"#555",fontSize:"11px",flexShrink:0},children:"Address"}),e.jsx("div",{style:{flex:1,background:"#fff",border:"1px solid #999",padding:"1px 6px",fontSize:"12px",borderRadius:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:t})]})]})}function $t({game:t,onClick:n}){const[o,s]=a.useState(!1);return e.jsxs("div",{title:t.description,onMouseEnter:()=>s(!0),onMouseLeave:()=>s(!1),onDoubleClick:()=>n(t),onClick:()=>n(t),style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",width:"80px",cursor:"pointer",background:o?"#5a5a5a":"transparent",borderRadius:"4px",padding:"8px 4px",userSelect:"none"},"data-cid":"EUg83KNC",children:[t.iconSrc?e.jsx("img",{src:t.iconSrc,alt:t.title,style:{width:"36px",height:"36px",objectFit:"contain",filter:o?"brightness(1.2)":"none"}}):e.jsx("span",{style:{fontSize:"36px",lineHeight:1,filter:o?"brightness(1.2)":"none"},children:t.icon}),e.jsx("span",{style:{fontSize:"11px",fontFamily:ae,color:o?"#fff":"#000",textAlign:"center",wordBreak:"break-word",lineHeight:1.3},children:t.title})]})}function Vt(){const[t,n]=a.useState(null),o=i=>{n(i)},s=()=>{n(null)},r=t?`C:\\Games\\${t.title}.exe`:"C:\\Games";return e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",background:"#fff",overflow:"hidden"},"data-cid":"-awwr9V-",children:[e.jsx(Ut,{address:r,canGoBack:t!==null,onBack:s}),t===null?e.jsxs("div",{style:{flex:1,padding:"16px",display:"flex",flexWrap:"wrap",alignContent:"flex-start",gap:"12px",background:"#fff",overflowY:"auto"},children:[Nt.map(i=>e.jsx($t,{game:i,onClick:o},i.id)),e.jsx("div",{style:{width:"100%",marginTop:"8px",paddingTop:"8px",borderTop:"1px solid #e0e0e0",fontSize:"10px",color:"#999",fontFamily:ae}})]}):e.jsxs("div",{style:{flex:1,position:"relative",overflow:"hidden"},children:[e.jsxs("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#1a1a2e",color:"#888",fontFamily:ae,fontSize:"13px",zIndex:0},children:["⏳ Loading ",t.title,"..."]}),e.jsx("iframe",{src:t.url,title:t.title,allow:"fullscreen",sandbox:"allow-scripts allow-forms allow-pointer-lock",style:{position:"absolute",inset:0,width:"100%",height:"100%",border:"none",zIndex:1}},t.id)]})]})}const Xt=[{name:"React",bgColor:"#f46fa43f",textColor:"#ffffff"},{name:"TypeScript",bgColor:"#f46fa43f",textColor:"#ffffff"},{name:"Tailwind CSS",bgColor:"#f46fa43f",textColor:"#ffffff"},{name:"Node.js",bgColor:"#f46fa43f",textColor:"#ffffff"},{name:"tRPC",bgColor:"#f46fa43f",textColor:"#ffffff"},{name:"Figma",bgColor:"#f46fa43f",textColor:"#ffffff"},{name:"CSS Animations",bgColor:"#f46fa43f",textColor:"#ffffff"},{name:"WebGL",bgColor:"#f46fa43f",textColor:"#ffffff"}],Yt=`
  .about-md h2 { font-size: 13px; font-weight: bold; color: #767676; margin: 14px 0 6px; border-bottom: 1px solid #c5d8f8; padding-bottom: 3px; }
  .about-md p  { font-size: 12px; color: #333; line-height: 1.75; margin: 0 0 8px; }
  .about-md ul { padding-left: 18px; margin: 0 0 8px; }
  .about-md li { font-size: 12px; color: #333; line-height: 1.8; list-style-type: disc; }
  .about-md strong { color: #767676; }
  .about-md hr { border: none; border-top: 1px solid #f0f0f0; margin: 10px 0; }
  .about-md blockquote { border-left: 3px solid #5a5a5a; margin: 8px 0; padding: 4px 10px; background: #fafafa; border-radius: 0 4px 4px 0; }
  .about-md blockquote p { font-size: 11px; color: #555; font-style: italic; margin: 0; }
`,Kt='"Trebuchet MS", Tahoma, Arial, sans-serif';function qt(){const{aboutConfig:t,aboutBgUrl:n,aboutBgOpacity:o}=Q();return e.jsxs("div",{style:{position:"relative",height:"100%",display:"flex",flexDirection:"column",fontFamily:Kt,overflow:"hidden",background:"linear-gradient(160deg,#f0f0f0 0%,#fafafa 100%)"},"data-cid":"vqp3eVYF",children:[e.jsx("style",{children:Yt}),n&&e.jsx("div",{style:{position:"absolute",inset:0,zIndex:0,backgroundImage:`url(${n})`,backgroundSize:"cover",backgroundPosition:"center",opacity:o,pointerEvents:"none"}}),e.jsxs("div",{style:{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"},children:[e.jsx("div",{style:{flexShrink:0,padding:"16px 20px 12px",borderBottom:"1px solid #c5d8f8",background:"rgba(255,255,255,0.65)",backdropFilter:"blur(4px)"},children:e.jsxs("div",{style:{display:"flex",gap:"16px",alignItems:"center"},children:[t.avatarSrc?e.jsx("img",{src:t.avatarSrc,alt:"avatar",style:{width:"64px",height:"64px",borderRadius:"50%",objectFit:"cover",border:"2px solid #5a5a5a",flexShrink:0}}):e.jsx("div",{style:{width:"64px",height:"64px",borderRadius:"50%",background:"linear-gradient(135deg,#5a5a5a,#b8b8b8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",flexShrink:0,border:"2px solid #5a5a5a"},children:"👤"}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"17px",fontWeight:"bold",color:"#767676"},children:t.name}),e.jsx("div",{style:{fontSize:"12px",color:"#5a5a5a",marginTop:"2px"},children:t.title}),e.jsx("div",{style:{fontSize:"11px",color:"#666",marginTop:"5px"},children:t.location})]})]})}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"14px 20px 10px"},children:e.jsx("div",{className:"about-md",children:e.jsx(Re,{remarkPlugins:[_e],children:t.markdownContent})})}),e.jsxs("div",{style:{flexShrink:0,padding:"10px 20px 14px",borderTop:"1px solid #c5d8f8",background:"rgba(255,255,255,0.65)",backdropFilter:"blur(4px)"},children:[e.jsx("div",{style:{fontSize:"11px",fontWeight:"bold",color:"#767676",marginBottom:"7px",letterSpacing:"0.5px"},children:"🛠 SKILLS"}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"5px"},children:Xt.map(s=>e.jsx("span",{style:{background:s.bgColor,color:s.textColor,borderRadius:"4px",padding:"3px 9px",fontSize:"11px",fontWeight:"bold",letterSpacing:"0.3px"},children:s.name},s.name))})]})]})]})}const fe='"Trebuchet MS", Tahoma, Arial, sans-serif';function Gt({address:t}){return e.jsxs("div",{style:{background:"#ece9d8",borderBottom:"1px solid #aca899",fontFamily:fe,fontSize:"12px",flexShrink:0},"data-cid":"ox9rWVKe",children:[e.jsx("div",{style:{display:"flex",gap:"2px",padding:"2px 4px",borderBottom:"1px solid #aca899"},children:["File","Edit","View","Favorites","Tools","Help"].map(n=>e.jsx("button",{style:{background:"none",border:"none",padding:"2px 6px",cursor:"pointer",fontFamily:fe,fontSize:"12px"},children:n},n))}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",padding:"3px 6px"},children:[e.jsx("span",{style:{color:"#555",fontSize:"11px"},children:"Address"}),e.jsx("div",{style:{flex:1,background:"#fff",border:"1px solid #999",padding:"1px 6px",fontSize:"12px",borderRadius:"2px"},children:t})]})]})}function Qt({name:t,url:n,iconSrc:o,emoji:s}){const[r,i]=a.useState(!1);return e.jsxs("a",{href:n,target:"_blank",rel:"noopener noreferrer",onMouseEnter:()=>i(!0),onMouseLeave:()=>i(!1),style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",width:"80px",cursor:"pointer",background:r?"#5a5a5a":"transparent",borderRadius:"4px",padding:"8px 4px",textDecoration:"none"},"data-cid":"C9HWBsgX",children:[o?e.jsx("img",{src:o,alt:t,style:{width:"48px",height:"48px",objectFit:"contain"}}):e.jsx("div",{style:{width:"48px",height:"48px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px"},children:s||"🌐"}),e.jsx("span",{style:{fontSize:"11px",fontFamily:fe,color:r?"#fff":"#000",textAlign:"center",wordBreak:"break-word"},children:t})]})}function Jt(){const{contactLinks:t,contactBgUrl:n,contactBgOpacity:o,isLoaded:s}=Q();return e.jsxs("div",{style:{position:"relative",height:"100%",display:"flex",flexDirection:"column"},"data-cid":"Op4hQK2s",children:[n&&e.jsx("div",{style:{position:"absolute",inset:0,zIndex:0,backgroundImage:`url(${n})`,backgroundSize:"cover",backgroundPosition:"center",opacity:o,pointerEvents:"none"}}),e.jsxs("div",{style:{position:"relative",zIndex:1,height:"100%",display:"flex",flexDirection:"column"},children:[e.jsx(Gt,{address:"Contact Me"}),e.jsx("div",{style:{flex:1,padding:"16px",display:"flex",flexWrap:"wrap",alignContent:"flex-start",gap:"20px",background:n?"transparent":"#fff",overflowY:"auto"},children:s?t.length===0?e.jsx("span",{style:{fontSize:12,color:"#888",fontFamily:fe},children:"暂无联系方式"}):t.map(r=>e.jsx(Qt,{name:r.name,url:r.url,iconSrc:r.iconSrc,emoji:r.emoji},r.id)):e.jsx("span",{style:{fontSize:12,color:"#888",fontFamily:fe},children:"加载中…"})})]})]})}const T={bgColor:"#ffffffff",textColor:"#464646ff",subTextColor:"#7a7678ff",progressColor:"#ee9cc1ff",progressBg:"#f5ecf2ff",btnBg:"#fafafa",btnBorder:"#fafafa",btnText:"#ee9cc1ff",btnActiveBg:"#fafafa"};function Ye(t){if(!isFinite(t)||t<0)return"0:00";const n=Math.floor(t/60),o=Math.floor(t%60);return`${n}:${o.toString().padStart(2,"0")}`}const Zt={background:"linear-gradient(135deg, #2a2a5a 0%, #6644cc 50%, #aa44aa 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"36px"};function en(){const{data:t=[]}=Y({...A.media.list.queryOptions(),staleTime:3e4}),{winampBgUrl:n,winampBgOpacity:o,isLoaded:s}=Q(),[r,i]=a.useState(!1),[l,f]=a.useState(""),[x,d]=a.useState(.3);a.useEffect(()=>{s&&!r&&(f(n),d(o),i(!0))},[s,n,o,r]);const h=t.filter(c=>c.type==="audio").map(c=>({id:c.id,coverSrc:c.cover,title:c.title,artist:c.artist,audioSrc:c.src})),[m]=a.useState(()=>{const c=Ae();return c?.type==="audio"?[{id:"__pending__",coverSrc:"/assets/icons/Media.png",title:c.title,artist:"Unknown",audioSrc:c.url}]:[]}),S=[...m,...h],[u,k]=a.useState(0),[v,b]=a.useState(!1),[z,j]=a.useState(0),[_,K]=a.useState(0),[D,W]=a.useState(!1),[O,E]=a.useState(0),P=a.useRef(null),J=a.useRef(null),I=S[u]??{coverSrc:"",title:"No Track",artist:"---",audioSrc:""},H=_>0?z/_*100:0,N=a.useRef(!1);a.useEffect(()=>{const c=P.current;c&&(c.pause(),c.load(),j(0),K(0),N.current&&I.audioSrc?c.play().catch(()=>{b(!1)}):b(!1),N.current=!1)},[u]);const Z=()=>{const c=P.current;!c||!I.audioSrc||(v?(c.pause(),b(!1)):(c.play().catch(()=>b(!1)),b(!0)))},U=()=>{b(!1),j(0);const c=P.current;c&&(c.pause(),c.currentTime=0)},p=a.useCallback(()=>{S.length!==0&&(N.current=!0,k(c=>(c+1)%S.length))},[S.length]),B=()=>{S.length!==0&&(N.current=v,k(c=>(c-1+S.length)%S.length),j(0))},L=()=>{S.length!==0&&(N.current=v,k(c=>(c+1)%S.length),j(0))},$=c=>{const C=J.current;if(!C)return 0;const M=C.getBoundingClientRect();return Math.min(1,Math.max(0,(c.clientX-M.left)/M.width))},ee=c=>{c.currentTarget.setPointerCapture(c.pointerId),W(!0),E($(c)*100)},R=c=>{D&&E($(c)*100)},g=c=>{c.currentTarget.releasePointerCapture(c.pointerId),W(!1);const C=$(c);P.current&&isFinite(_)&&(P.current.currentTime=C*_)},y=D?O:H;return e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",background:T.bgColor,color:T.textColor,fontFamily:'"Trebuchet MS", Tahoma, Arial, sans-serif',userSelect:"none",position:"relative",overflow:"hidden"},"data-cid":"rE1W05i8",children:[e.jsx("audio",{ref:P,src:I.audioSrc||void 0,onTimeUpdate:()=>{!D&&P.current&&j(P.current.currentTime)},onLoadedMetadata:()=>{P.current&&K(P.current.duration)},onEnded:p}),l&&e.jsx("div",{style:{position:"absolute",inset:0,backgroundImage:`url(${l})`,backgroundSize:"cover",backgroundPosition:"center",opacity:x,pointerEvents:"none",zIndex:0}}),e.jsxs("div",{style:{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%"},children:[e.jsxs("div",{style:{display:"flex",gap:"14px",padding:"14px 16px 10px",alignItems:"center"},children:[e.jsx("div",{style:{width:"100px",height:"100px",flexShrink:0,border:`2px solid ${T.btnBorder}`,borderRadius:"4px",overflow:"hidden",...I.coverSrc?{}:Zt},children:I.coverSrc?e.jsx("img",{src:I.coverSrc,alt:I.title,style:{width:"100%",height:"100%",objectFit:"cover",display:"block"}}):e.jsx("span",{children:"🎵"})}),e.jsxs("div",{style:{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("div",{style:{fontSize:"15px",fontWeight:"bold",color:T.textColor,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",letterSpacing:"0.5px"},children:I.title}),e.jsx("div",{style:{fontSize:"13px",color:T.subTextColor,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},children:I.artist}),e.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"center",marginTop:"2px"},children:[e.jsx("span",{style:{fontSize:"12px",color:T.textColor,fontFamily:'"Courier New", monospace',letterSpacing:"1px"},children:Ye(z)}),e.jsxs("span",{style:{fontSize:"11px",color:T.subTextColor},children:["/ ",Ye(_)]}),e.jsx("span",{style:{marginLeft:"auto",fontSize:"10px",color:T.subTextColor,background:T.btnBg,border:`1px solid ${T.btnBorder}`,borderRadius:"3px",padding:"1px 6px"},children:S.length>0?`${u+1} / ${S.length}`:"—"})]})]})]}),e.jsx("div",{style:{padding:"0 16px 10px"},children:e.jsxs("div",{ref:J,onPointerDown:ee,onPointerMove:R,onPointerUp:g,style:{height:"10px",background:T.progressBg,borderRadius:"5px",cursor:"pointer",position:"relative",border:`1px solid ${T.btnBorder}`},children:[e.jsx("div",{style:{width:`${y}%`,height:"100%",background:T.progressColor,borderRadius:"5px",transition:D?"none":"width 0.1s linear"}}),e.jsx("div",{style:{position:"absolute",top:"50%",left:`${y}%`,transform:"translate(-50%, -50%)",width:"14px",height:"14px",borderRadius:"50%",background:T.progressColor,border:`2px solid ${T.textColor}`,boxShadow:"0 0 4px rgba(0,0,0,0.5)"}})]})}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"8px",padding:"10px 16px 14px",borderTop:`1px solid ${T.btnBorder}`},children:[e.jsx(be,{title:"上一首",onClick:B,children:"⏮"}),e.jsx(be,{title:v?"暂停":"播放",active:v,onClick:Z,children:v?"⏸":"▶"}),e.jsx(be,{title:"停止",onClick:U,children:"⏹"}),e.jsx(be,{title:"下一首",onClick:L,children:"⏭"})]})]})]})}function be({children:t,onClick:n,active:o=!1,title:s}){const[r,i]=a.useState(!1);return e.jsx("button",{title:s,onClick:n,onMouseEnter:()=>i(!0),onMouseLeave:()=>i(!1),style:{background:o||r?T.btnActiveBg:T.btnBg,color:T.btnText,border:`1px solid ${T.btnBorder}`,borderRadius:"5px",padding:"7px 14px",cursor:"pointer",fontSize:"16px",minWidth:"42px",transition:"background 0.15s",boxShadow:o?`0 0 8px ${T.btnActiveBg}88`:"none"},"data-cid":"NmeC_NrY",children:t})}const Ce='"Trebuchet MS", Tahoma, Arial, sans-serif',Ke=["lol, totally!","omg really?? 😮","brb, mom is calling","that is so cool!!","i was just thinking the same thing :)","lmao xD","k gtg, ttyl!! ✌️","did u see that new movie?","my asl is 16/f/usa lol","...busy?"];function qe(){const t=new Date,n=t.getHours()%12||12,o=t.getMinutes().toString().padStart(2,"0");return`${n}:${o} ${t.getHours()>=12?"PM":"AM"}`}function tn(){const[t,n]=a.useState([{from:"them",text:"heyyy, whats up! :)",time:"3:41 PM"}]),[o,s]=a.useState(""),r=a.useRef(null);a.useEffect(()=>{r.current&&(r.current.scrollTop=r.current.scrollHeight)},[t]);const i=a.useCallback(()=>{o.trim()&&(n(l=>[...l,{from:"me",text:o.trim(),time:qe()}]),s(""),setTimeout(()=>{const l=Ke[Math.floor(Math.random()*Ke.length)];n(f=>[...f,{from:"them",text:l,time:qe()}])},800+Math.random()*1200))},[o]);return e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",background:"#fff",fontFamily:Ce},"data-cid":"x4cxzH_T",children:[e.jsxs("div",{style:{background:"linear-gradient(180deg,#0078d7,#004fa3)",padding:"10px 14px",display:"flex",alignItems:"center",gap:"10px"},children:[e.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"50%",background:"#ffce00",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",flexShrink:0},children:"😊"}),e.jsxs("div",{children:[e.jsx("div",{style:{color:"#fff",fontSize:"13px",fontWeight:"bold"},children:"XP_Buddy (Online)"}),e.jsx("div",{style:{color:"#c8deff",fontSize:"11px"},children:"💬 Chatting on MSN Messenger"})]})]}),e.jsx("div",{ref:r,style:{flex:1,overflowY:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",gap:"6px",background:"#f5f9ff"},children:t.map((l,f)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:l.from==="me"?"flex-end":"flex-start"},children:[e.jsxs("span",{style:{fontSize:"10px",color:"#999",marginBottom:"2px"},children:[l.from==="me"?"Me":"XP_Buddy"," • ",l.time]}),e.jsx("div",{style:{background:l.from==="me"?"#5a5a5a":"#fff",color:l.from==="me"?"#fff":"#000",border:l.from==="me"?"none":"1px solid #d0d8e8",borderRadius:"8px",padding:"6px 10px",fontSize:"12px",maxWidth:"75%",wordBreak:"break-word"},children:l.text})]},f))}),e.jsx("div",{style:{background:"#ece9d8",borderTop:"1px solid #ccc",padding:"4px 8px",display:"flex",gap:"6px"},children:["😊","😂","😎","❤️","👋"].map(l=>e.jsx("button",{onClick:()=>s(f=>f+l),style:{background:"none",border:"none",cursor:"pointer",fontSize:"16px",padding:"2px"},children:l},l))}),e.jsxs("div",{style:{display:"flex",borderTop:"2px solid #5a5a5a",background:"#fff"},children:[e.jsx("input",{value:o,onChange:l=>s(l.target.value),onKeyDown:l=>l.key==="Enter"&&i(),placeholder:"Type a message...",style:{flex:1,border:"none",outline:"none",padding:"8px 12px",fontFamily:Ce,fontSize:"12px"}}),e.jsx("button",{onClick:i,style:{background:"#5a5a5a",color:"#fff",border:"none",padding:"0 16px",cursor:"pointer",fontFamily:Ce,fontSize:"12px",fontWeight:"bold"},children:"Send"})]})]})}function nn(){return e.jsx("iframe",{src:"/assets/jspaint-master/index.html",style:{width:"100%",height:"100%",border:"none",display:"block"},title:"Paint","data-cid":"tRNhKftX"})}const on=`# 🖥️ MoeKernel_Desktop — Windows XP 风格个人桌面系统

> 一个以 Windows XP / Y2K 梦幻核美学为主题的交互式个人桌面系统。  
> 访客将像操作一台复古 PC 一样浏览你的作品、文章与个人信息。  
> 所有内容均可通过 **管理后台** 在线编辑，无需触碰代码。

---

## 📸 项目简介

**MoeKernel_Desktop** 是一个运行在浏览器里的 Windows XP 风格个人主页系统，模拟了一套完整的 XP 桌面操作体验：

- 🖱️ 可拖拽的桌面图标（多列自动排布 + 自由拖拽 + 边界钳制）
- 🪟 多窗口管理（可拖拽、8 方向缩放、最小化/关闭/任务栏）
- 🟢 Luna 风格开始菜单（程序 + 地点两列布局）
- 🕐 系统托盘实时时钟
- 🐾 可拖拽桌宠，浮于所有窗口之上（右侧边栏一键召唤）
- ✨ Boot → Login 两阶段欢迎动画（每个会话仅播放一次）
- 🔧 **全栈 CMS 后台**：\`/admin\` 可视化管理所有内容，DB 驱动，静态配置兜底

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19、TanStack Start（SSR）、TanStack Router |
| 样式 | Tailwind CSS v4、CSS Variables（OKLCH）、Inline CSS（XP 主题） |
| 组件库 | shadcn/ui（Radix UI 底层） |
| Markdown | react-markdown + remark-gfm |
| 客户端数据 | TanStack React Query v5、tRPC v11 Options Proxy |
| 服务端 API | tRPC on H3（Nitro）、Node.js 20 |
| 数据库 | Turso（libSQL / SQLite 云端）、Drizzle ORM |
| 鉴权 | JWT（jose HS256）、httpOnly Cookie |
| 构建 | Vite 7、Nitro（node-server preset）、TypeScript 5.9 |
| 表单验证 | React Hook Form + Zod v4 |
| 进程管理 | PM2（Cluster 模式） |
| 部署 | Ubuntu 云服务器 + Nginx 反代 + Cloudflare CDN |

---

## 🪟 内置应用一览

| 应用 | 说明 |
|------|------|
| 📁 博客系统 | XP 资源管理器风格，支持分类过滤 Tab + Markdown 阅读器 |
| 🗂️ 作品集 | 卡片网格 + 动态分类 Tab + 灯箱图片预览 + 技术栈标签 |
| 🎵 Winamp | 复古 Winamp 2.x UI + HTML5 Audio 真实播放引擎 |
| 🎬 视频播放器 | B站 iframe 嵌入 + 本地/直链 mp4 双引擎 |
| 💬 ChatBox 留言板 | 访客公开留言 + 置顶 + IP 限流（60s/次）|
| 📄 文档窗口 | 通用 Markdown 查看器（Resume 是第一个实例），支持自定义背景图 |
| 👤 关于我 | 头像 + 个人介绍 + Markdown 正文，后台可配置 |
| 📬 联系方式 | XP 资源管理器风格，社交链接列表，后台可配置 |
| 🖥️ 我的电脑 | 静态文件树映射 \`public/assets/\`，支持图片/视频/音频预览 |
| 🎮 游戏文件夹 | iframe 沙盒游戏启动器，支持本地 H5 游戏 |
| 💅 MSN Messenger | Bot 自动回复 + 表情包 |
| 🎨 MS Paint | 铅笔/橡皮/填充 + 调色板画板 |

---

## ⚙️ 管理后台功能

访问 \`/admin\` 登录后，可通过可视化界面管理所有内容：

| 后台页面 | 可管理内容 |
|---------|-----------|
| 🎨 主题设置 | 壁纸 URL、顶栏 Logo、系统托盘图标列表 |
| 📝 博客管理 | 文章增删改、Markdown 编辑器（MDEditor）、背景图 |
| 🖼️ 图标管理 | 桌面图标显示/隐藏、名称/路径/排序内联编辑 |
| 🐾 桌宠管理 | 桌宠增删改、精灵图/图标预览、尺寸调节 |
| 💬 留言板 | 删除留言、置顶/取消置顶、背景外观设置 |
| 🗂️ 作品集 | 条目增删改（卡片弹窗）、背景外观设置 |
| 🎵 媒体库 | 音频/视频/Bilibili 曲目增删改排序 |
| 📬 联系设置 | 社交链接列表增删改（图标/名称/URL） |
| 👤 关于设置 | 基本信息 + Markdown 正文编辑 |
| 📄 文档管理 | 文档窗口增删改（标题/内容/背景图/排序/可见性） |

---

## 📁 项目目录结构

\`\`\`
MoeKernel/
├── public/                         # 静态资源（直接替换你的素材）
│   └── assets/
│       ├── wallpapers/             # 桌面壁纸 (.webp / .jpg)
│       ├── icons/                  # 应用图标 (.png / .ico)
│       │   └── tray/               # 系统托盘小图标 (16–20px)
│       └── pets/
│           ├── avatars/            # 桌宠侧栏按钮图标 (推荐 22px)
│           └── sprites/            # 桌宠本体图像 (推荐 .gif 动图)
│
├── src/
│   ├── client/                     # 前端代码
│   │   ├── apps/                   # 各桌面应用（每个应用独立文件夹）
│   │   │   ├── registry.ts         # 应用注册中心（APP_REGISTRY）
│   │   │   ├── blog/               # 博客系统（文件夹视图 + Markdown 阅读器）
│   │   │   ├── resume/             # 通用 Markdown 文档查看器
│   │   │   ├── portfolio/          # 作品集（卡片 + 灯箱）
│   │   │   ├── winamp/             # Winamp 音乐播放器
│   │   │   ├── video-player/       # 视频播放器（B站/mp4 双引擎）
│   │   │   ├── chatbox/            # ChatBox 留言板
│   │   │   ├── about-me/           # 关于我
│   │   │   ├── contact/            # 联系方式
│   │   │   ├── my-computer/        # 我的电脑（文件树导航）
│   │   │   ├── games-folder/       # 游戏文件夹
│   │   │   ├── msn/                # MSN Messenger
│   │   │   └── paint/              # MS Paint 画板
│   │   │
│   │   ├── config/                 # 静态兜底配置（DB 无数据时使用）
│   │   │   ├── theme.config.ts     # 壁纸、Logo、托盘图标
│   │   │   ├── icons.config.ts     # 桌面图标列表
│   │   │   ├── pets.config.ts      # 桌宠列表
│   │   │   └── blog.config.ts      # 博客文章列表（含 .md 静态导入）
│   │   │
│   │   ├── hooks/                  # 自定义 React Hooks
│   │   │   ├── use-desktop-icons.ts  # 图标拖拽、选中、自动排布
│   │   │   ├── use-site-config.ts    # DB 设置读取（含静态 Fallback）
│   │   │   └── use-window-drag.ts    # 窗口拖拽
│   │   │
│   │   └── views/                  # 页面级视图组件
│   │       ├── home.tsx            # 🖥️ XP 桌面主组件（内核）
│   │       ├── xp-window.tsx       # 可拖拽/可缩放 XP 窗口
│   │       ├── start-menu.tsx      # 开始菜单（Luna 风格）
│   │       ├── welcome-guard.tsx   # Boot → Login 欢迎动画
│   │       ├── right-sidebar.tsx   # 右侧桌宠启动栏
│   │       └── desktop-pet.tsx     # 可拖拽桌宠
│   │
│   ├── routes/                     # 文件路由（路径即 URL）
│   │   ├── __root.tsx              # 根布局（HTML Shell）
│   │   ├── index.tsx               # / → XP 桌面主页
│   │   ├── api/trpc.$.ts           # tRPC HTTP 端点（catch-all）
│   │   └── admin/                  # 管理后台路由
│   │       ├── login.tsx           # /admin/login 登录页
│   │       ├── _layout.tsx         # 后台布局（JWT 鉴权守卫）
│   │       └── _layout/            # 后台各功能页
│   │           ├── index.tsx       # /admin 仪表盘
│   │           ├── theme.tsx       # /admin/theme
│   │           ├── blog/           # /admin/blog（列表 + 新建 + 编辑）
│   │           ├── icons.tsx       # /admin/icons
│   │           ├── mascots.tsx     # /admin/mascots
│   │           ├── chatbox.tsx     # /admin/chatbox
│   │           ├── portfolio.tsx   # /admin/portfolio
│   │           ├── media.tsx       # /admin/media
│   │           ├── contact.tsx     # /admin/contact
│   │           ├── about.tsx       # /admin/about
│   │           └── documents.tsx   # /admin/documents
│   │
│   └── server/                     # 服务端代码
│       ├── env.ts                  # 环境变量校验（启动时 fail-fast）
│       ├── db/
│       │   ├── client.ts           # Drizzle + Turso HTTP 连接
│       │   ├── schema.ts           # 7 张数据表定义
│       │   └── seed.ts             # 初始数据填充脚本
│       └── trpc/
│           ├── router.ts           # 主路由（注册所有子路由）
│           ├── procedure.ts        # publicProcedure / adminProcedure
│           └── routes/             # 各功能路由
│               ├── site.ts         # 公开读取接口
│               ├── auth.ts         # 登录 / 登出 / 验证
│               ├── settings.ts     # 站点设置 CRUD
│               ├── blog.ts         # 博客文章 CRUD
│               ├── documents.ts    # 文档窗口 CRUD
│               ├── chatbox.ts      # 留言板 CRUD
│               ├── portfolio.ts    # 作品集 CRUD
│               └── media.ts        # 媒体库 CRUD
│
├── ecosystem.config.cjs            # PM2 进程管理配置
├── drizzle.config.ts               # Drizzle Kit 配置
└── package.json
\`\`\`

---

## 🏗️ 核心架构

### 微内核 + 插件层 + CMS 三层架构

\`\`\`
┌─────────────────────────────────────────────────────────┐
│              Turso 云端数据库（7 张表）                    │
│  site_settings / blog_posts / desktop_icons / mascots   │
│  chat_messages / portfolio_items / media_tracks         │
│  documents                                              │
└───────────────────────────┬─────────────────────────────┘
                            │ tRPC + Drizzle ORM
┌───────────────────────────▼─────────────────────────────┐
│                  tRPC 服务端路由层                        │
│  site（公开读）/ auth / settings / blog / documents      │
│  chatbox / portfolio / media                            │
└────────────────┬────────────────────────────────────────┘
                 │ TanStack Query + tRPC Client
     ┌───────────┴───────────┐
     │                       │
┌────▼────────────┐   ┌──────▼────────────────────────────┐
│  /admin 后台    │   │    / 前台（XP 桌面）               │
│  10 个管理页面  │   │  内核层 home.tsx                   │
│  可视化 CRUD    │   │  窗口管理·图标拖拽·任务栏·桌宠系统 │
└─────────────────┘   └──────────────┬─────────────────────┘
                                     │ APP_REGISTRY 查找
                          ┌──────────▼──────────────────────┐
                          │    注册中心 registry.ts          │
                          │  静态 App + 动态文档窗口          │
                          └──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┘
                            博客 简历 作品 音乐 视频 留言 ...
\`\`\`

### 数据库表结构

| 表名 | 用途 |
|------|------|
| \`site_settings\` | 壁纸/Logo/托盘/About/Contact 等所有 key-value 配置 |
| \`blog_posts\` | 博客文章（含 Markdown 正文） |
| \`desktop_icons\` | 桌面图标列表（可隐藏/排序） |
| \`mascots\` | 桌宠列表（图标/精灵图/尺寸） |
| \`chat_messages\` | ChatBox 留言（含 IP 哈希限流） |
| \`portfolio_items\` | 作品集条目 |
| \`media_tracks\` | 音频/视频/Bilibili 媒体库 |
| \`documents\` | 通用文档窗口（Markdown + 背景图） |

---

## 🚀 部署教程（新手向）

### 前置条件

在开始之前，确保你的机器上已安装：

- **Node.js 20+**：[https://nodejs.org](https://nodejs.org)（选 LTS 版本）
- **pnpm**：安装好 Node.js 后执行 \`npm install -g pnpm\`
- **Git**：[https://git-scm.com](https://git-scm.com)

验证安装：

\`\`\`bash
node -v    # 应输出 v20.x.x 或更高
pnpm -v    # 应输出 9.x.x 或更高
git --version
\`\`\`

---

### 第一步：获取代码

\`\`\`bash
git clone https://github.com/你的用户名/MoeKernel_Desktop.git
cd MoeKernel_Desktop
pnpm install
\`\`\`

---

### 第二步：创建 Turso 数据库

Turso 是本项目使用的云端 SQLite 数据库，有免费套餐，无需信用卡。

**1. 注册账号**

前往 [https://turso.tech](https://turso.tech) 注册（支持 GitHub 一键登录）。

**2. 安装 Turso CLI**

\`\`\`bash
# macOS / Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows（PowerShell）
irm https://get.tur.so/install.ps1 | iex
\`\`\`

**3. 登录并创建数据库**

\`\`\`bash
turso auth login          # 打开浏览器完成授权

turso db create moekernel # 创建数据库（名字可以自定义）
\`\`\`

**4. 获取数据库地址和 Token**

\`\`\`bash
turso db show moekernel   # 复制 URL 字段（格式：libsql://...turso.io）
turso db tokens create moekernel   # 复制输出的 Token 字符串
\`\`\`

> 💡 这两个值分别对应环境变量 \`TURSO_DATABASE_URL\` 和 \`TURSO_AUTH_TOKEN\`，妥善保存。

---

### 第三步：配置环境变量

在项目根目录创建 \`.env\` 文件：

\`\`\`bash
# macOS / Linux
cp .env.example .env   # 如果有示例文件

# 或直接新建
touch .env
\`\`\`

用文本编辑器打开 \`.env\`，填入以下内容：

\`\`\`env
# ── 数据库（必填）──────────────────────────────
TURSO_DATABASE_URL=libsql://你的数据库名.turso.io
TURSO_AUTH_TOKEN=你从上一步复制的Token

# ── 后台管理密码（必填）───────────────────────
# 这是登录 /admin 时使用的密码，自行设置一个强密码
ADMIN_PASSWORD=你的管理后台密码

# ── JWT 签名密钥（必填）───────────────────────
# 用于签发管理员登录 Cookie，必须 ≥ 32 个字符的随机字符串
# 生成示例（在终端运行）：node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=至少32位的随机字符串

# ── 可选配置 ──────────────────────────────────
# 生产环境设为 production（影响 Cookie Secure 属性）
NODE_ENV=development

# 跨子域名共享 Cookie 时填写，如 .yoursite.com；单域名留空
# COOKIE_DOMAIN=
\`\`\`

> ⚠️ **\`.env\` 文件绝对不要提交到 Git！** 确认 \`.gitignore\` 里包含 \`.env\`。

---

### 第四步：初始化数据库表结构

\`\`\`bash
pnpm db:push
\`\`\`

这条命令会把 \`src/server/db/schema.ts\` 中定义的 8 张表推送到 Turso 云端。  
成功后在终端看到各表名即完成。

**（可选）填充初始数据：**

\`\`\`bash
pnpm db:seed
\`\`\`

这会把 \`src/client/config/\` 里的静态配置数据（图标/桌宠/博客文章等）写入数据库作为初始内容。

---

### 第五步：本地开发验证

\`\`\`bash
pnpm dev
\`\`\`

打开浏览器访问：
- \`http://localhost:3000\` — XP 桌面前台
- \`http://localhost:3000/admin\` — 管理后台（用 \`.env\` 中的 \`ADMIN_PASSWORD\` 登录）

确认以下功能正常：
- [x] 桌面正常渲染，图标可双击打开窗口
- [x] \`/admin/login\` 输入密码后跳转后台
- [x] 后台保存内容后，前台刷新显示新内容

---

### 第六步：构建生产版本

\`\`\`bash
pnpm build
\`\`\`

构建产物在 \`.output/\` 目录下：
- \`.output/server/index.mjs\` — 服务端入口
- \`.output/public/\` — 静态资源文件

---

### 第七步：服务器部署（Ubuntu + PM2 + Nginx）

> 以下步骤需要一台运行 Ubuntu 20.04+ 的云服务器（阿里云/腾讯云/Vultr 等均可）。

#### 7.1 服务器安装 Node.js

\`\`\`bash
# 使用 NodeSource 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm 和 PM2
npm install -g pnpm pm2
\`\`\`

#### 7.2 上传代码到服务器

**方式 A：Git 拉取（推荐）**

\`\`\`bash
# 在服务器上
git clone https://github.com/你的用户名/MoeKernel_Desktop.git /www/moekernel
cd /www/moekernel
pnpm install
\`\`\`

**方式 B：通过宝塔面板上传**

在宝塔文件管理器上传项目压缩包，解压到 \`/www/moekernel/\`，然后在终端执行 \`pnpm install\`。

#### 7.3 在服务器上创建 .env 文件

\`\`\`bash
cd /www/moekernel
nano .env   # 或 vim .env
\`\`\`

填入与本地相同的环境变量，但修改以下值：

\`\`\`env
NODE_ENV=production
TURSO_DATABASE_URL=libsql://你的数据库名.turso.io
TURSO_AUTH_TOKEN=你的Token
ADMIN_PASSWORD=你的管理密码
JWT_SECRET=至少32位随机字符串
\`\`\`

#### 7.4 构建并启动服务

\`\`\`bash
cd /www/moekernel
pnpm build              # 构建生产版本
mkdir -p logs           # PM2 日志目录
pm2 start ecosystem.config.cjs   # 启动服务（监听 3000 端口）
pm2 save                # 保存进程列表
pm2 startup             # 生成开机自启命令（按提示执行输出的命令）
\`\`\`

验证是否启动成功：

\`\`\`bash
pm2 status              # 应看到 moekernel 状态为 online
curl http://localhost:3000   # 应返回 HTML 页面
\`\`\`

#### 7.5 配置 Nginx 反向代理

\`\`\`bash
sudo nano /etc/nginx/sites-available/moekernel
\`\`\`

粘贴以下配置（将 \`your-domain.com\` 替换为你的域名）：

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

启用配置：

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/moekernel /etc/nginx/sites-enabled/
sudo nginx -t              # 检查配置语法
sudo systemctl reload nginx
\`\`\`

> 🔔 **宝塔面板用户**：在「网站」→「添加站点」→「反向代理」中填入目标 URL \`http://127.0.0.1:3000\` 即可，无需手动编辑 nginx.conf。

---

### 第八步：配置 Cloudflare（可选但推荐）

使用 Cloudflare 可获得免费 CDN、DDoS 防护和自动 HTTPS。

#### 8.1 添加域名到 Cloudflare

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击「Add a Site」，输入你的域名
3. 按提示将域名的 NS 服务器改为 Cloudflare 提供的地址（在域名注册商处修改）

#### 8.2 关键设置（必须正确，否则登录 Cookie 会失效）

**SSL/TLS 加密模式：**  
进入「SSL/TLS」→「Overview」→ 选择 **Full (Strict)**  
⚠️ 不能选 Flexible，否则 HTTPS 请求到服务器时变成 HTTP，导致 \`Secure Cookie\` 无法写入，管理员无法登录。

**API 缓存绕过（必须设置）：**  
进入「Rules」→「Page Rules」→「Create Page Rule」：
- URL 匹配：\`your-domain.com/api/trpc/*\`
- 设置：Cache Level → **Bypass**

这样 tRPC API 请求不会被 Cloudflare 缓存，保证数据实时性。

#### 8.3 申请 SSL 证书（若不用 Cloudflare）

如果不使用 Cloudflare，可用 Certbot 申请免费 Let's Encrypt 证书：

\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
# 按提示操作，自动修改 Nginx 配置并续期
\`\`\`

---

### 第九步：首次登录后台配置内容

1. 浏览器访问 \`https://your-domain.com/admin\`
2. 输入 \`.env\` 中设置的 \`ADMIN_PASSWORD\` 登录
3. 按需配置各项内容：
   - **主题设置**：替换壁纸 URL、Logo 图片、托盘图标
   - **文档管理**：创建 ID 为 \`resume\` 的文档，填入你的简历 Markdown 内容
   - **博客管理**：添加你的第一篇博客文章
   - **关于设置**：填写个人信息和 Markdown 简介
   - **联系设置**：配置你的社交媒体链接

---

### 更新部署

当代码有更新时，在服务器上执行：

\`\`\`bash
cd /www/moekernel
git pull
pnpm install           # 如果依赖有变化
pnpm build             # 重新构建
pm2 reload moekernel   # 热重载（零停机）
\`\`\`

如果数据库 schema 有变更（新增表/字段）：

\`\`\`bash
pnpm db:push           # 在重启前执行
\`\`\`

---

## 🖥️ WelcomeGuard 欢迎动画

文件：\`src/client/views/welcome-guard.tsx\`

首次进入时自动播放 Boot → Login 两阶段动画，同一会话内刷新不重复播放。

| 需要修改的内容 | 搜索关键词 |
|--------------|-----------|
| Boot 用户名大字 | \`MoeKernel\`（BootStage 内） |
| Boot 副标题 | \`>Welcome<\` |
| Login 左侧用户名 | \`MoeKernel\`（LoginStage 左栏） |
| Login 右侧头像图片 | \`src="/assets/avatarSrc.jpg"\` |
| Login 右侧用户名 | \`NNNullptr\`（LoginStage 右栏） |

**调试命令（浏览器 Console）：**

\`\`\`js
// 重新播放欢迎流程
sessionStorage.removeItem('xp:welcomed'); location.reload();

// 跳过欢迎流程
sessionStorage.setItem('xp:welcomed', '1'); location.reload();
\`\`\`

---

## ✏️ 如何添加新桌面应用

只需 3 步，完全不触碰内核代码：

**第一步：** 创建应用组件

\`\`\`tsx
// src/client/apps/your-app/index.tsx
export function YourApp() {
  return <div>你的应用内容</div>;
}
\`\`\`

**第二步：** 注册到应用中心（\`src/client/apps/registry.ts\`）

\`\`\`typescript
import { YourApp } from './your-app';

export const APP_REGISTRY = {
  // ...现有应用
  yourApp: {
    id: 'yourApp',
    title: '你的应用',
    icon: '/assets/icons/your-icon.png',
    defaultWidth: 500,
    defaultHeight: 400,
    AppComponent: YourApp,
  },
};
\`\`\`

**第三步：** 在管理后台「图标管理」添加桌面图标，或直接编辑 \`src/client/config/icons.config.ts\`：

\`\`\`typescript
{ id: 'yourApp', label: '你的应用', src: '/assets/icons/your-icon.png' }
\`\`\`

完成！应用自动出现在桌面，双击图标即可打开。

---

## 🗂️ 路由映射

| URL 路径 | 说明 |
|----------|------|
| \`/\` | XP 桌面主页面 |
| \`/api/trpc/*\` | tRPC API 端点 |
| \`/admin/login\` | 管理后台登录页 |
| \`/admin\` | 管理后台仪表盘 |
| \`/admin/theme\` | 主题设置 |
| \`/admin/blog\` | 博客管理 |
| \`/admin/icons\` | 图标管理 |
| \`/admin/mascots\` | 桌宠管理 |
| \`/admin/chatbox\` | 留言板管理 |
| \`/admin/portfolio\` | 作品集管理 |
| \`/admin/media\` | 媒体库管理 |
| \`/admin/contact\` | 联系设置 |
| \`/admin/about\` | 关于设置 |
| \`/admin/documents\` | 文档窗口管理 |

---

## 🔧 常用开发命令

\`\`\`bash
pnpm dev          # 启动开发服务器（localhost:3000）
pnpm build        # 构建生产版本
pnpm lint         # TypeScript 类型检查

pnpm db:push      # 推送 schema 变更到 Turso（建表/加字段）
pnpm db:seed      # 填充初始数据到数据库
pnpm db:studio    # 打开 Drizzle Studio（本地 DB 可视化界面）
\`\`\`

---

## 📂 静态资源目录

| 目录 | 用途 | 推荐格式 |
|------|------|---------|
| \`public/assets/wallpapers/\` | 桌面壁纸 | \`.webp\`、\`.jpg\` |
| \`public/assets/icons/\` | 应用 & 快捷方式图标 | \`.png\`、\`.ico\` |
| \`public/assets/icons/tray/\` | 系统托盘小图标 | \`.png\`（16–20px）|
| \`public/assets/pets/avatars/\` | 桌宠侧栏按钮图标 | \`.png\`（22px）|
| \`public/assets/pets/sprites/\` | 桌宠本体图像 | \`.gif\`（动图）|

---

## 📝 版本历史

| 版本 | 主要内容 |
|------|---------|
| V1–V5 | 开始菜单、多窗口管理、桌面图标拖拽、桌宠系统基础框架 |
| V6–V9 | 8 方向窗口缩放、10 个内置应用、配置文件架构规范化 |
| V10 | **微内核+插件层**架构重构，统一应用注册中心 |
| V11–V17 | 右侧边栏 XP Classic 风格重构、各应用配置驱动重构 |
| V18–V21 | 视频播放器双引擎、Games Folder 配置化、My Computer 文件预览 |
| V22–V23 | **博客系统**：XP 资源管理器文件夹 + Markdown 阅读器 + 分类 Tab |
| V24–V25 | 最大化窗口修复、**WelcomeGuard** Boot→Login 欢迎动画 |
| V26–V30 | My Computer 文件树导航、Start 菜单双侧联动、正式命名 MoeKernel_Desktop |
| **Full-Stack** | **全栈化改造**：Turso 数据库 + tRPC 服务端 + Drizzle ORM + JWT 鉴权 |
| Phase 0–1 | 基础设施搭建：8 张表建表、tRPC 数据层（site/auth/settings/blog 路由） |
| Phase 2 | 前端组件数据源切换至 DB，静态配置退为 Fallback |
| Phase 3 | 管理后台 UI：10 个后台页面，完整 CRUD |
| Phase 4 | **ChatBox 留言板**：独立数据表 + 皮肤系统 + IP 限流 |
| Phase 5 | **Portfolio / Media / Contact / About** 全栈化 |
| Phase 6 | **通用文档窗口管理系统**：documents 表 + 动态桌面图标 + 后台编辑器 |
`,me={content:on,bgUrl:"",bgOpacity:.12,title:"README.md"},Ge='"Trebuchet MS", Tahoma, Arial, sans-serif',ye="#5a5a5a",Te="#767676",sn={h1:({children:t})=>e.jsx("h1",{style:{fontSize:"20px",fontWeight:"bold",color:Te,borderBottom:`2px solid ${ye}`,paddingBottom:"8px",marginBottom:"16px",marginTop:"24px"},children:t}),h2:({children:t})=>e.jsx("h2",{style:{fontSize:"15px",fontWeight:"bold",color:ye,borderBottom:"1px solid #d0d8f0",paddingBottom:"4px",marginBottom:"12px",marginTop:"20px",letterSpacing:"0.5px"},children:t}),h3:({children:t})=>e.jsx("h3",{style:{fontSize:"13px",fontWeight:"bold",color:"#1a4fa0",marginBottom:"8px",marginTop:"16px"},children:t}),h4:({children:t})=>e.jsx("h4",{style:{fontSize:"12px",fontWeight:"bold",color:"#333",marginBottom:"6px",marginTop:"12px"},children:t}),p:({children:t})=>e.jsx("p",{style:{fontSize:"12px",lineHeight:1.8,color:"#333",marginBottom:"10px",marginTop:0},children:t}),ul:({children:t})=>e.jsx("ul",{style:{fontSize:"12px",color:"#333",marginBottom:"10px",paddingLeft:"20px",lineHeight:1.8},children:t}),ol:({children:t})=>e.jsx("ol",{style:{fontSize:"12px",color:"#333",marginBottom:"10px",paddingLeft:"20px",lineHeight:1.8},children:t}),li:({children:t})=>e.jsx("li",{style:{marginBottom:"3px"},children:t}),code:({children:t,className:n})=>n?.startsWith("language-")?e.jsx("code",{style:{display:"block",background:"#e8edf8",border:"1px solid #c5d0e8",borderRadius:"3px",padding:"10px 14px",fontSize:"11px",fontFamily:'"Courier New", monospace',color:"#767676",whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.7,marginBottom:"10px"},children:t}):e.jsx("code",{style:{background:"#e8edf8",border:"1px solid #c5d0e8",borderRadius:"2px",padding:"1px 5px",fontSize:"11px",fontFamily:'"Courier New", monospace',color:"#767676"},children:t}),pre:({children:t})=>e.jsx("pre",{style:{margin:"0 0 10px 0",background:"none",padding:0},children:t}),blockquote:({children:t})=>e.jsx("blockquote",{style:{borderLeft:`3px solid ${ye}`,margin:"0 0 10px 0",paddingLeft:"12px",color:"#555",fontStyle:"italic",background:"#f0f4fb"},children:t}),hr:()=>e.jsx("hr",{style:{border:"none",borderTop:"1px solid #d0d8f0",margin:"16px 0"}}),strong:({children:t})=>e.jsx("strong",{style:{color:Te,fontWeight:"bold"},children:t}),em:({children:t})=>e.jsx("em",{style:{color:"#444",fontStyle:"italic"},children:t}),a:({href:t,children:n})=>e.jsx("a",{href:t,target:"_blank",rel:"noopener noreferrer",style:{color:ye,textDecoration:"underline",fontSize:"12px"},children:n}),img:({src:t,alt:n})=>e.jsx("img",{src:t,alt:n??"",style:{maxWidth:"100%",borderRadius:"4px",border:"1px solid #d0d8f0",margin:"8px 0",display:"block",boxShadow:"0 2px 6px rgba(0,0,0,0.12)"}}),table:({children:t})=>e.jsx("div",{style:{overflowX:"auto",marginBottom:"12px"},children:e.jsx("table",{style:{borderCollapse:"collapse",width:"100%",fontSize:"11px"},children:t})}),thead:({children:t})=>e.jsx("thead",{style:{background:"#dbe4f5"},children:t}),th:({children:t})=>e.jsx("th",{style:{border:"1px solid #c5d0e8",padding:"5px 10px",textAlign:"left",fontWeight:"bold",color:Te},children:t}),td:({children:t})=>e.jsx("td",{style:{border:"1px solid #d8dfe8",padding:"4px 10px",color:"#333"},children:t}),tr:({children:t})=>e.jsx("tr",{style:{background:"transparent"},children:t})};function it({documentId:t}){const{data:n=[]}=Y({...A.site.getDocuments.queryOptions(),staleTime:0,refetchOnMount:"always"}),o=n.find(d=>d.id===t),s=o!==void 0,r=s?o.content:me.content,i=s?o.bgUrl:me.bgUrl,l=s?o.bgOpacity:me.bgOpacity,f=s?o.title:me.title,x=!!i;return e.jsxs("div",{style:{height:"100%",position:"relative",overflow:"hidden",fontFamily:Ge},"data-cid":"dUwn2J1J",children:[x&&e.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,backgroundImage:`url(${i})`,backgroundSize:"cover",backgroundPosition:"center",opacity:l,zIndex:0}}),e.jsxs("div",{style:{position:"relative",zIndex:10,height:"100%",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{background:"#ece9d8",borderBottom:"1px solid #aca899",padding:"4px 10px",display:"flex",gap:"2px",flexShrink:0,alignItems:"center"},children:[["File","Edit","View","Format","Help"].map(d=>e.jsx("button",{style:{background:"none",border:"none",padding:"2px 8px",cursor:"pointer",fontFamily:Ge,fontSize:"12px"},children:d},d)),e.jsxs("span",{style:{marginLeft:"auto",fontSize:"11px",color:"#888"},children:[f," — 只读"]})]}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"12px",background:x?"transparent":"#f0ede4"},children:e.jsx("div",{style:{maxWidth:"680px",margin:"0 auto 12px auto",padding:"32px 40px",background:x?"rgba(255,255,255,0.88)":"#fff",minHeight:"600px",boxShadow:"0 0 12px rgba(0,0,0,0.15)",backdropFilter:x?"blur(2px)":"none"},children:e.jsx(Re,{remarkPlugins:[_e],components:sn,children:r})})})]})]})}const w={bgColor:"#1a1a1a",menuBarBg:"#ece9d8",menuBarBorder:"#aca899",nowPlayingGradientStart:"#2a2a2a",nowPlayingGradientMid:"#505050",nowPlayingAccentColor:"#cccccc",nowPlayingTitleColor:"#ffffff",transportBgTop:"#2a2a2a",transportBgBottom:"#1a1a1a",transportBorder:"#444444",buttonBgTop:"#555555",buttonBgBottom:"#333333",buttonBorder:"#666666",buttonColor:"#dddddd",buttonHoverBg:"#808080",buttonDisabledBg:"#2a2a2a",buttonDisabledColor:"#555555",buttonDisabledBorder:"#3a3a3a",progressTrackBg:"#333333",progressTrackBorder:"#555555",progressFillStart:"#a0a0a0",progressFillEnd:"#c0c0c0",progressThumbColor:"#c0c0c0",volumeFillColor:"#a0a0a0",statusBarBg:"#111111",statusBarText:"#666666",statusBarBorder:"#333333",stoppedBg:"#000000",stoppedTextColor:"#555555"},te='"Trebuchet MS", Tahoma, Arial, sans-serif';function rn(){const{data:t=[]}=Y({...A.media.list.queryOptions(),staleTime:3e4}),n=t.filter(p=>p.type==="video"||p.type==="bilibili").map(p=>p.type==="bilibili"?{type:"bilibili",title:p.title,bvid:p.bvid??"",cover:p.cover}:{type:"mp4",title:p.title,src:p.src,cover:p.cover}),[o]=a.useState(()=>{const p=Ae();return p?.type==="video"?{type:"mp4",title:p.title,src:p.url,cover:""}:null}),s=o?[o,...n]:n,[r,i]=a.useState(0),[l,f]=a.useState(!1),[x,d]=a.useState(!1),[h,m]=a.useState(0),[S,u]=a.useState(0),k=a.useRef(null),v=a.useRef(null),b=s[r],z=b?.type==="bilibili",j=b?.type==="mp4",_=z&&b?`https://player.bilibili.com/player.html?bvid=${b.bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`:"",K=j&&b?b.src:"";a.useEffect(()=>{const p=v.current;if(!p)return;const B=()=>{p.duration>0&&(m(p.currentTime/p.duration),u(p.duration))},L=()=>d(!0),$=()=>d(!1),ee=()=>{d(!1),m(0)};return p.addEventListener("timeupdate",B),p.addEventListener("play",L),p.addEventListener("pause",$),p.addEventListener("ended",ee),()=>{p.removeEventListener("timeupdate",B),p.removeEventListener("play",L),p.removeEventListener("pause",$),p.removeEventListener("ended",ee)}},[r,l,j]);const D=a.useCallback(p=>{i(p),f(!1),d(!1),m(0),u(0)},[]),W=()=>{if(l){f(!1),d(!0),j&&setTimeout(()=>v.current?.play(),100);return}j&&v.current?.play(),d(!0)},O=()=>{j&&v.current?.pause(),d(!1)},E=()=>{j&&v.current&&(v.current.pause(),v.current.currentTime=0),f(!0),d(!1),m(0)},P=()=>{const p=v.current;!j||!p||!isFinite(p.duration)||p.duration===0||(p.currentTime=Math.max(0,p.currentTime-10))},J=()=>{const p=v.current;!j||!p||!isFinite(p.duration)||p.duration===0||(p.currentTime=Math.min(p.duration,p.currentTime+10))},I=()=>D((r-1+s.length)%s.length),H=()=>D((r+1)%s.length),N=p=>{if(!j||!v.current)return;const B=p.currentTarget.getBoundingClientRect(),L=(p.clientX-B.left)/B.width;v.current.currentTime=L*(v.current.duration||0)},Z=[{id:"prev",icon:"⏮",label:"上一个",handler:I},{id:"seekback",icon:"⏪",label:"快退10秒",handler:P,disabledOnBilibili:!0},{id:"playpause",icon:()=>x?"⏸":"▶",label:x?"暂停":"播放",handler:x?O:W,disabledOnBilibili:!0},{id:"seekfwd",icon:"⏩",label:"快进10秒",handler:J,disabledOnBilibili:!0},{id:"next",icon:"⏭",label:"下一个",handler:H},{id:"stop",icon:"⏹",label:"停止",handler:E}],U=p=>{const B=Math.floor(p/60),L=Math.floor(p%60);return`${B}:${L.toString().padStart(2,"0")}`};return e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",background:w.bgColor,fontFamily:te,userSelect:"none"},"data-cid":"uDEgqfzM",children:[e.jsx("div",{style:{background:w.menuBarBg,borderBottom:`1px solid ${w.menuBarBorder}`,flexShrink:0},children:e.jsx("div",{style:{display:"flex",padding:"2px 4px"},children:["File","View","Play","Tools","Help"].map(p=>e.jsx("button",{style:{background:"none",border:"none",padding:"2px 8px",cursor:"default",fontFamily:te,fontSize:"12px"},children:p},p))})}),e.jsxs("div",{style:{background:`linear-gradient(90deg, ${w.nowPlayingGradientStart} 0%, ${w.nowPlayingGradientMid} 60%, ${w.nowPlayingGradientStart} 100%)`,padding:"4px 10px",display:"flex",alignItems:"center",gap:"8px",flexShrink:0,borderBottom:"1px solid #000"},children:[e.jsx("span",{style:{fontSize:"11px",color:w.nowPlayingAccentColor,fontWeight:"bold",letterSpacing:"0.5px",whiteSpace:"nowrap"},children:"▶ NOW PLAYING"}),e.jsxs("span",{style:{fontSize:"11px",color:w.nowPlayingTitleColor,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",flex:1},children:[b?.title??"— No Video —",e.jsxs("span",{style:{marginLeft:"8px",opacity:.5,fontSize:"10px"},children:["[",r+1,"/",s.length,"]"]})]}),e.jsx("span",{style:{fontSize:"9px",padding:"1px 5px",borderRadius:"2px",background:z?"#cc3333":"#336633",color:"#fff",flexShrink:0,letterSpacing:"0.5px"},children:z?"BILIBILI":"MP4"})]}),e.jsxs("div",{style:{flex:1,position:"relative",background:"#000",overflow:"hidden"},children:[l?e.jsxs("div",{style:{position:"absolute",inset:0,background:w.stoppedBg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px"},children:[b?.cover?e.jsx("img",{src:b.cover,alt:"cover",style:{maxWidth:"60%",maxHeight:"60%",opacity:.5,borderRadius:"4px"}}):e.jsx("span",{style:{fontSize:"48px",opacity:.3},children:"⏹"}),e.jsx("span",{style:{color:w.stoppedTextColor,fontSize:"12px",fontFamily:te},children:"已停止 — 点击 ▶ 播放"})]}):z?e.jsx("iframe",{ref:k,src:_,title:"Bilibili Video Player",scrolling:"no",frameBorder:"0",allowFullScreen:!0,allow:"autoplay; fullscreen",style:{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}},`bilibili-${b&&"bvid"in b?b.bvid:r}`):e.jsx("video",{ref:v,src:K,style:{position:"absolute",inset:0,width:"100%",height:"100%",background:"#000"},onPlay:()=>d(!0),onPause:()=>d(!1)},`mp4-${r}`),z&&!l&&e.jsx("div",{style:{position:"absolute",bottom:"6px",right:"8px",background:"rgba(0,0,0,0.6)",color:"#aaa",fontSize:"9px",padding:"2px 6px",borderRadius:"2px",pointerEvents:"none",fontFamily:te},children:"B站模式：直接点击画面控制"})]}),e.jsxs("div",{style:{background:w.transportBgBottom,padding:"4px 10px 2px",display:"flex",alignItems:"center",gap:"6px",flexShrink:0},children:[e.jsx("span",{style:{fontSize:"9px",color:"#777",minWidth:"30px",fontFamily:te},children:j&&!l?U(h*S):"0:00"}),e.jsxs("div",{onClick:N,style:{flex:1,height:"8px",background:w.progressTrackBg,borderRadius:"4px",border:`1px solid ${w.progressTrackBorder}`,position:"relative",cursor:j&&!l?"pointer":"default"},children:[e.jsx("div",{style:{width:`${(l?0:h)*100}%`,height:"100%",background:`linear-gradient(90deg, ${w.progressFillStart}, ${w.progressFillEnd})`,borderRadius:"4px",transition:j?"none":"width 0.3s"}}),j&&!l&&e.jsx("div",{style:{position:"absolute",top:"50%",left:`${h*100}%`,transform:"translate(-50%, -50%)",width:"10px",height:"10px",borderRadius:"50%",background:w.progressThumbColor,border:"1px solid #fff",boxShadow:"0 0 3px rgba(0,0,0,0.5)"}})]}),e.jsx("span",{style:{fontSize:"9px",color:"#777",minWidth:"30px",textAlign:"right",fontFamily:te},children:j&&S>0?U(S):"--:--"})]}),e.jsxs("div",{style:{background:`linear-gradient(180deg, ${w.transportBgTop} 0%, ${w.transportBgBottom} 100%)`,borderTop:`2px solid ${w.transportBorder}`,padding:"5px 10px",display:"flex",alignItems:"center",gap:"4px",flexShrink:0},children:[Z.map(({id:p,icon:B,handler:L,label:$,disabledOnBilibili:ee})=>{const R=z&&ee===!0,g=typeof B=="function"?B():B;return e.jsx("button",{title:R?`${$}（B站模式不可用）`:$,onClick:R?void 0:L,disabled:R,style:{background:R?w.buttonDisabledBg:`linear-gradient(180deg, ${w.buttonBgTop}, ${w.buttonBgBottom})`,border:`1px solid ${R?w.buttonDisabledBorder:w.buttonBorder}`,borderRadius:"3px",color:R?w.buttonDisabledColor:w.buttonColor,fontSize:"14px",padding:"2px 8px",cursor:R?"not-allowed":"pointer",fontFamily:"monospace",opacity:R?.45:1,transition:"background 0.1s"},onMouseEnter:y=>{R||(y.currentTarget.style.background=w.buttonHoverBg)},onMouseLeave:y=>{R||(y.currentTarget.style.background=`linear-gradient(180deg, ${w.buttonBgTop}, ${w.buttonBgBottom})`)},"data-cid":"tSEOgKba",children:g},p)}),e.jsx("span",{style:{fontSize:"10px",color:"#aaa",marginLeft:"4px"},children:"🔊"}),e.jsx("div",{style:{width:"50px",height:"5px",background:"#444",borderRadius:"3px",border:"1px solid #555"},children:e.jsx("div",{style:{width:"70%",height:"100%",background:w.volumeFillColor,borderRadius:"3px"}})})]}),e.jsxs("div",{style:{background:w.statusBarBg,padding:"2px 10px",borderTop:`1px solid ${w.statusBarBorder}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx("span",{style:{fontSize:"10px",color:w.statusBarText,fontFamily:te},children:l?"已停止":x?`▶ 正在播放 — ${b?.title??""}`:`⏸ 已暂停 — ${b?.title??""}`}),e.jsxs("span",{style:{fontSize:"10px",color:w.statusBarText,fontFamily:te},children:[z?"Bilibili Player":"HTML5 Player"," | HD"]})]})]})}const ie='"Trebuchet MS", Tahoma, Arial, sans-serif',V={background:"linear-gradient(180deg,#dce8fc 0%,#b8d0f8 100%)",borderColor:"#c8c8c8",titleColor:"#767676",linkColor:"#0033aa",tasksTitle:"File and Folder Tasks",taskItems:[{icon:"📁",text:"Make new folder"},{icon:"📤",text:"Publish to Web"},{icon:"📧",text:"E-mail items"}],detailsTitle:"Details",owner:"Portfolio Owner"};function an({item:t,onClose:n}){const o=t.techStack.split(",").map(s=>s.trim()).filter(Boolean);return e.jsxs("div",{style:{position:"absolute",inset:0,zIndex:100,background:"rgba(0,0,0,0.82)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:ie,padding:"24px"},onClick:n,"data-cid":"IeMVfTc2",children:[e.jsx("button",{onClick:n,style:{position:"absolute",top:"12px",right:"14px",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.35)",borderRadius:"3px",color:"#fff",fontSize:"14px",fontWeight:"bold",padding:"2px 8px",cursor:"pointer",fontFamily:ie,lineHeight:1.4},children:"✕ Close"}),t.imageUrl&&e.jsx("div",{style:{maxWidth:"80%",maxHeight:"60%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px"},onClick:s=>s.stopPropagation(),children:e.jsx("img",{src:t.imageUrl,alt:t.title,style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:"3px",boxShadow:"0 8px 32px rgba(0,0,0,0.6)",border:"2px solid rgba(255,255,255,0.15)"}})}),e.jsxs("div",{style:{textAlign:"center",maxWidth:"560px"},onClick:s=>s.stopPropagation(),children:[e.jsx("div",{style:{color:"#fff",fontSize:"15px",fontWeight:"bold",marginBottom:"6px"},children:t.title}),t.category&&e.jsx("div",{style:{display:"inline-block",background:"rgba(49,106,197,0.5)",border:"1px solid rgba(100,160,255,0.4)",borderRadius:"3px",padding:"1px 8px",fontSize:"11px",color:"#9ec8ff",marginBottom:"10px"},children:t.category}),t.description&&e.jsx("div",{style:{color:"#bcd0f0",fontSize:"12px",lineHeight:1.7,marginBottom:"10px"},children:t.description}),o.length>0&&e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginBottom:12},children:o.map(s=>e.jsx("span",{style:{fontSize:10,color:"#c8deff",background:"rgba(40,80,160,0.55)",border:"1px solid rgba(100,160,255,0.35)",borderRadius:3,padding:"1px 7px"},children:s},s))}),t.link&&e.jsx("a",{href:t.link,target:"_blank",rel:"noopener noreferrer",onClick:s=>s.stopPropagation(),style:{display:"inline-block",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:3,color:"#fff",fontSize:11,padding:"3px 14px",textDecoration:"none",fontFamily:ie},children:"🔗 查看项目"})]})]})}function ln(){return e.jsxs("div",{style:{background:"#ece9d8",borderBottom:"1px solid #aca899",fontFamily:ie,fontSize:"12px",flexShrink:0},"data-cid":"fn6D5Tk8",children:[e.jsx("div",{style:{display:"flex",gap:"2px",padding:"2px 4px",borderBottom:"1px solid #aca899",alignItems:"center"},children:["File","Edit","View","Favorites","Tools","Help"].map(t=>e.jsx("button",{style:{background:"none",border:"none",padding:"2px 6px",cursor:"pointer",fontFamily:ie,fontSize:"12px"},children:t},t))}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",padding:"3px 6px"},children:[e.jsx("span",{style:{color:"#555",fontSize:"11px"},children:"Address"}),e.jsx("div",{style:{flex:1,background:"#fff",border:"1px solid #999",padding:"1px 6px",fontSize:"12px",borderRadius:"2px"},children:"C:\\Users\\Portfolio\\My Works"})]})]})}function dn(){const[t,n]=a.useState("All"),[o,s]=a.useState(null),[r,i]=a.useState(null),{data:l=[],isLoading:f}=Y({...A.portfolio.list.queryOptions(),staleTime:3e4}),{portfolioBgUrl:x,portfolioBgOpacity:d}=Q(),h=x.length>0,m=a.useMemo(()=>["All",...Array.from(new Set(l.map(k=>k.category).filter(Boolean)))],[l]),S=t==="All"?l:l.filter(u=>u.category===t);return e.jsxs("div",{style:{position:"relative",height:"100%",display:"flex",flexDirection:"column",fontFamily:ie,overflow:"hidden"},"data-cid":"b70rvo1o",children:[h&&e.jsx("div",{style:{position:"absolute",inset:0,zIndex:0,pointerEvents:"none",backgroundImage:`url(${x})`,backgroundSize:"cover",backgroundPosition:"center",opacity:d}}),e.jsxs("div",{style:{position:"relative",zIndex:1,height:"100%",display:"flex",flexDirection:"column"},children:[e.jsx(ln,{}),e.jsx("div",{style:{background:"#ece9d8",padding:"6px 8px 0 8px",borderBottom:"1px solid #aca899",display:"flex",alignItems:"flex-end",flexShrink:0,flexWrap:"wrap",gap:"2px"},children:m.map(u=>e.jsx("button",{onClick:()=>n(u),style:{background:t===u?"linear-gradient(180deg,#fff 0%,#ece9d8 100%)":"linear-gradient(180deg,#d4d0c8 0%,#c0bdb5 100%)",border:"1px solid #aca899",borderBottom:t===u?"1px solid #ece9d8":"1px solid #aca899",borderRadius:"3px 3px 0 0",padding:"3px 12px",cursor:"pointer",fontFamily:ie,fontSize:"11px",fontWeight:t===u?"bold":"normal",color:t===u?"#767676":"#333",marginRight:"2px",position:"relative",bottom:t===u?"-1px":"0",zIndex:t===u?1:0},children:u},u))}),e.jsxs("div",{style:{flex:1,display:"flex",overflow:"hidden"},children:[e.jsxs("div",{style:{width:"150px",flexShrink:0,background:V.background,borderRight:`1px solid ${V.borderColor}`,padding:"12px 8px",overflowY:"auto"},children:[e.jsx("div",{style:{fontSize:"11px",fontWeight:"bold",color:V.titleColor,marginBottom:"8px",borderBottom:`1px solid ${V.borderColor}`,paddingBottom:"4px"},children:V.tasksTitle}),V.taskItems.map(u=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",padding:"3px 2px",cursor:"pointer",fontSize:"11px",color:V.linkColor,borderRadius:"2px"},children:[e.jsx("span",{children:u.icon}),e.jsx("span",{style:{textDecoration:"underline"},children:u.text})]},u.text)),e.jsx("div",{style:{fontSize:"11px",fontWeight:"bold",color:V.titleColor,margin:"14px 0 8px",borderBottom:`1px solid ${V.borderColor}`,paddingBottom:"4px"},children:V.detailsTitle}),e.jsxs("div",{style:{fontSize:"10px",color:"#333",lineHeight:1.7},children:[e.jsxs("div",{children:[e.jsx("strong",{children:"Items:"})," ",S.length]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Type:"})," Portfolio"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Owner:"})," ",V.owner]})]})]}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"16px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"14px",alignContent:"flex-start",background:h?"transparent":"#fff"},children:f?e.jsx("div",{style:{gridColumn:"1 / -1",textAlign:"center",color:"#888",fontSize:"12px",paddingTop:"40px"},children:"加载中…"}):S.length===0?e.jsx("div",{style:{gridColumn:"1 / -1",textAlign:"center",color:"#888",fontSize:"12px",paddingTop:"40px"},children:"此分类暂无作品。"}):S.map(u=>e.jsxs("div",{onMouseEnter:()=>s(u.id),onMouseLeave:()=>s(null),onClick:()=>i(u),style:{border:o===u.id?"2px solid #5a5a5a":"2px solid #d0d8e8",borderRadius:"4px",overflow:"hidden",cursor:"pointer",background:"#f5f8ff",boxShadow:o===u.id?"0 2px 8px rgba(49,106,197,0.25)":"0 1px 3px rgba(0,0,0,0.08)",transition:"border-color 0.15s,box-shadow 0.15s"},children:[e.jsxs("div",{style:{position:"relative",height:"90px",background:"#e8eef8",overflow:"hidden"},children:[u.imageUrl?e.jsx("img",{src:u.imageUrl,alt:u.title,style:{width:"100%",height:"100%",objectFit:"cover",display:"block"}}):e.jsx("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"#b0b8c8"},children:"🖼️"}),o===u.id&&e.jsxs("div",{style:{position:"absolute",inset:0,background:"rgba(49,106,197,0.75)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"4px"},children:[e.jsx("span",{style:{color:"#fff",fontSize:"11px",fontWeight:"bold",textAlign:"center",padding:"0 4px"},children:u.title}),e.jsx("span",{style:{color:"#fff",fontSize:"10px",background:"rgba(0,0,0,0.3)",borderRadius:"2px",padding:"1px 5px",marginTop:"2px"},children:"🔍 点击查看"})]})]}),e.jsxs("div",{style:{padding:"6px 8px",borderTop:"1px solid #d0d8e8",background:h?"rgba(245,248,255,0.9)":"#f5f8ff"},children:[e.jsx("div",{style:{fontSize:"11px",fontWeight:"bold",color:"#767676",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:u.title}),u.category&&e.jsx("div",{style:{fontSize:"10px",color:"#666",marginTop:"1px"},children:u.category})]})]},u.id))})]}),e.jsx("div",{style:{background:"#ece9d8",borderTop:"1px solid #aca899",padding:"2px 10px",flexShrink:0},children:e.jsxs("span",{style:{fontSize:"11px",color:"#333"},children:[S.length," object(s)"]})})]}),r!==null&&e.jsx(an,{item:r,onClose:()=>i(null)})]})}const pe='"Trebuchet MS", Tahoma, Arial, sans-serif';function pn(){const[t,n]=a.useState(null),[o,s]=a.useState("Image Viewer"),[r,i]=a.useState(100);return a.useEffect(()=>{const l=Ae();l?.type==="image"&&(n(l.url),s(l.title))},[]),e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",background:"#2b2b2b",fontFamily:pe},"data-cid":"xVokf3Dm",children:[e.jsxs("div",{style:{background:"#ece9d8",borderBottom:"1px solid #aca899",padding:"3px 6px",display:"flex",alignItems:"center",gap:"6px",flexShrink:0},children:[e.jsx("button",{onClick:()=>i(l=>Math.min(l+25,400)),style:{padding:"1px 8px",fontFamily:pe,fontSize:"12px",border:"1px solid #aca899",background:"#d4d0c8",borderRadius:2,cursor:"pointer"},children:"+ Zoom In"}),e.jsx("button",{onClick:()=>i(l=>Math.max(l-25,25)),style:{padding:"1px 8px",fontFamily:pe,fontSize:"12px",border:"1px solid #aca899",background:"#d4d0c8",borderRadius:2,cursor:"pointer"},children:"− Zoom Out"}),e.jsx("button",{onClick:()=>i(100),style:{padding:"1px 8px",fontFamily:pe,fontSize:"12px",border:"1px solid #aca899",background:"#d4d0c8",borderRadius:2,cursor:"pointer"},children:"1:1"}),e.jsxs("span",{style:{color:"#555",fontSize:"11px",marginLeft:4},children:[r,"%"]}),e.jsx("span",{style:{flex:1}}),e.jsx("span",{style:{color:"#555",fontSize:"11px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200},children:o})]}),e.jsx("div",{style:{flex:1,overflow:"auto",display:"flex",alignItems:r<=100?"center":"flex-start",justifyContent:r<=100?"center":"flex-start",padding:12,background:"#1e1e1e"},children:t?e.jsx("img",{src:t,alt:o,style:{maxWidth:r<=100?"100%":"none",maxHeight:r<=100?"100%":"none",width:r!==100?`${r}%`:void 0,objectFit:"contain",display:"block",imageRendering:r>200?"pixelated":"auto",boxShadow:"0 2px 16px rgba(0,0,0,0.6)"}}):e.jsxs("div",{style:{color:"#666",fontSize:"13px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:40,marginBottom:12},children:"🖼"}),"No image selected.",e.jsx("br",{}),e.jsx("span",{style:{fontSize:11,color:"#444"},children:"Open an image from My Computer."})]})}),e.jsx("div",{style:{background:"#ece9d8",borderTop:"1px solid #aca899",padding:"2px 8px",fontSize:"11px",color:"#555",flexShrink:0,fontFamily:pe},children:t?o:"Ready"})]})}const cn=`# Hello World

欢迎来到我的博客！这是第一篇文章，也是一个新的开始。

## 关于这个博客

这个博客嵌入在一个 **Windows XP 风格**的桌面系统中。你现在看到的这个窗口，就像是在 2003 年打开一个文本文档一样。

## 为什么选择 XP 风格？

Windows XP 是很多人童年的记忆。那个时代的互联网充满了**探索感**——你不知道下一个链接会通向哪里，每一个网页都是独一无二的手工作品。

> "The best time to plant a tree was 20 years ago. The second best time is now."

我希望用这种复古的形式，带来一点不一样的阅读体验。

## 技术栈

这个网站使用了：

\`\`\`
React 19 + TanStack Start
Tailwind CSS v4
tRPC v11
Markdown + remark-gfm
\`\`\`

感谢你的到来，后续会有更多内容更新！
`,xn=`文章直接写markdown格式就好
`,De=[{id:"blog-hello-world",title:"Hello World",icon:"/assets/icons/Blog.png",backgroundImage:"/assets/wallpapers/bg4.jpg",bgOpacity:1,content:cn,category:"技术"},{id:"blog-xp-memories",title:"1 Day",icon:"/assets/icons/blog2.png",backgroundImage:"/assets/wallpapers/bg5.jpg",bgOpacity:1,content:xn,category:"生活"}],X='"Trebuchet MS", Tahoma, Arial, sans-serif',q="全部";function gn({address:t}){return e.jsxs("div",{style:{background:"#ece9d8",borderBottom:"1px solid #aca899",fontFamily:X,fontSize:"12px",flexShrink:0},"data-cid":"LXaiI4B2",children:[e.jsx("div",{style:{display:"flex",gap:"2px",padding:"2px 4px",borderBottom:"1px solid #aca899"},children:["File","Edit","View","Favorites","Tools","Help"].map(n=>e.jsx("button",{style:{background:"none",border:"none",padding:"2px 6px",cursor:"pointer",fontFamily:X,fontSize:"12px"},children:n},n))}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",padding:"3px 6px"},children:[e.jsx("span",{style:{color:"#555",fontSize:"11px"},children:"Address"}),e.jsx("div",{style:{flex:1,background:"#fff",border:"1px solid #999",padding:"1px 6px",fontSize:"12px",borderRadius:"2px"},children:t})]})]})}function fn({categories:t,activeCategory:n,onSelect:o}){return e.jsx("div",{style:{display:"flex",alignItems:"flex-end",gap:"2px",padding:"4px 8px 0 8px",background:"#ece9d8",borderBottom:"1px solid #aca899",flexShrink:0,overflowX:"auto"},"data-cid":"nKb4v-wl",children:t.map(s=>{const r=s===n;return e.jsx("button",{onClick:()=>o(s),style:{fontFamily:X,fontSize:"11px",padding:"3px 12px 4px 12px",cursor:"pointer",border:"1px solid #aca899",borderBottom:r?"1px solid #fff":"1px solid #aca899",borderRadius:"4px 4px 0 0",background:r?"#fff":"linear-gradient(180deg, #f0ede4 0%, #dedad0 100%)",color:r?"#000":"#444",fontWeight:r?"bold":"normal",position:"relative",zIndex:r?1:0,marginBottom:r?"-1px":"0",whiteSpace:"nowrap",outline:"none",boxShadow:r?"none":"inset 0 -1px 0 #aca899",transition:"background 0.1s"},"data-cid":"Cpoj7xzq",children:s},s)})})}function un({icon:t,label:n,postId:o}){const[s,r]=a.useState(!1),i=()=>{window.dispatchEvent(new CustomEvent("xp-open-window",{detail:{id:o,title:n,icon:t}}))};return e.jsxs("div",{onClick:i,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",width:"88px",cursor:"pointer",background:s?"#5a5a5a":"transparent",borderRadius:"4px",padding:"8px 4px",userSelect:"none"},"data-cid":"0irJvFxJ",children:[e.jsx("img",{src:t,alt:n,style:{width:"48px",height:"48px",objectFit:"contain"}}),e.jsx("span",{style:{fontSize:"11px",fontFamily:X,color:s?"#fff":"#000",textAlign:"center",wordBreak:"break-word",lineHeight:"1.3"},children:n})]})}function hn(){const[t,n]=a.useState(q),{data:o,isLoading:s}=Y({...A.site.getBlogPosts.queryOptions(),staleTime:0,refetchOnWindowFocus:!0}),r=o??De,i=a.useMemo(()=>{const x=Array.from(new Set(r.map(d=>d.category).filter(Boolean)));return[q,...x]},[r]),l=a.useMemo(()=>t===q?r:r.filter(x=>x.category===t),[t,r]),f=t===q?"My Blog":`My Blog > ${t}`;return e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",background:"#fff"},"data-cid":"-fNCaVo2",children:[e.jsx(gn,{address:f}),e.jsx(fn,{categories:i,activeCategory:t,onSelect:n}),e.jsxs("div",{style:{flex:1,display:"flex",overflow:"hidden"},children:[e.jsxs("div",{style:{width:"160px",background:"linear-gradient(180deg, #edeff3 0%, #f0f0f0 100%)",borderRight:"1px solid #cecece",padding:"12px 8px",flexShrink:0,display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"11px",fontWeight:"bold",color:"#0a2a70",fontFamily:X,marginBottom:"6px",borderBottom:"1px solid #7a9bd4",paddingBottom:"4px"},children:"Blog Tasks"}),e.jsxs("div",{onClick:()=>n(q),style:{fontSize:"11px",color:"#1a3a90",fontFamily:X,lineHeight:"2",cursor:"pointer",textDecoration:t===q?"none":"underline",fontWeight:t===q?"bold":"normal"},children:["全部文章 (",r.length,")"]}),i.filter(x=>x!==q).map(x=>{const d=r.filter(m=>m.category===x).length,h=t===x;return e.jsxs("div",{onClick:()=>n(x),style:{fontSize:"11px",color:"#1a3a90",fontFamily:X,lineHeight:"2",cursor:"pointer",textDecoration:h?"none":"underline",fontWeight:h?"bold":"normal"},"data-cid":"ySRrtv3o",children:[x," (",d,")"]},x)})]}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"11px",fontWeight:"bold",color:"#0a2a70",fontFamily:X,marginBottom:"6px",borderBottom:"1px solid #7a9bd4",paddingBottom:"4px"},children:"Details"}),e.jsx("div",{style:{fontSize:"10px",color:"#333",fontFamily:X,lineHeight:"1.6"},children:s&&!o?"正在同步...":t===q?`共 ${r.length} 篇文章`:`${t} 分类下共 ${l.length} 篇文章`}),e.jsx("div",{style:{fontSize:"10px",color:"#555",fontFamily:X,lineHeight:"1.6",marginTop:"4px"},children:"点击文章图标即可在新窗口中打开阅读。"})]})]}),e.jsx("div",{style:{flex:1,padding:"16px",display:"flex",flexWrap:"wrap",alignContent:"flex-start",gap:"16px",background:"#fff",overflowY:"auto"},children:l.length>0?l.map(x=>e.jsx(un,{icon:x.icon,label:x.title,postId:x.id},x.id)):e.jsx("div",{style:{color:"#888",fontSize:"12px",fontFamily:X,width:"100%",textAlign:"center",paddingTop:"40px"},children:"该分类下暂无文章"})})]})]})}const xe="#5a5a5a",ce="#767676",ze='"Trebuchet MS", Tahoma, Arial, sans-serif',bn={h1:({children:t})=>e.jsx("h1",{style:{fontSize:"20px",fontWeight:"bold",color:ce,borderBottom:`2px solid ${xe}`,paddingBottom:"8px",marginBottom:"16px",marginTop:"24px"},children:t}),h2:({children:t})=>e.jsx("h2",{style:{fontSize:"15px",fontWeight:"bold",color:xe,borderBottom:"1px solid #d0d8f0",paddingBottom:"4px",marginBottom:"12px",marginTop:"20px",letterSpacing:"0.5px"},children:t}),h3:({children:t})=>e.jsx("h3",{style:{fontSize:"13px",fontWeight:"bold",color:"#1a4fa0",marginBottom:"8px",marginTop:"16px"},children:t}),p:({children:t})=>e.jsx("p",{style:{fontSize:"12px",lineHeight:1.8,color:"#333",marginBottom:"10px",marginTop:0},children:t}),ul:({children:t})=>e.jsx("ul",{style:{fontSize:"12px",color:"#333",marginBottom:"10px",paddingLeft:"20px",lineHeight:1.8},children:t}),ol:({children:t})=>e.jsx("ol",{style:{fontSize:"12px",color:"#333",marginBottom:"10px",paddingLeft:"20px",lineHeight:1.8},children:t}),li:({children:t})=>e.jsx("li",{style:{marginBottom:"3px"},children:t}),code:({children:t,className:n})=>n?.startsWith("language-")?e.jsx("code",{style:{display:"block",background:"#e8edf8",border:"1px solid #c5d0e8",borderRadius:"3px",padding:"10px 14px",fontSize:"11px",fontFamily:'"Courier New", monospace',color:ce,whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.7,marginBottom:"10px"},children:t}):e.jsx("code",{style:{background:"#e8edf8",border:"1px solid #c5d0e8",borderRadius:"2px",padding:"1px 5px",fontSize:"11px",fontFamily:'"Courier New", monospace',color:ce},children:t}),pre:({children:t})=>e.jsx("pre",{style:{margin:"0 0 10px 0",background:"none",padding:0},children:t}),blockquote:({children:t})=>e.jsx("blockquote",{style:{borderLeft:`3px solid ${xe}`,margin:"0 0 10px 0",paddingLeft:"12px",color:"#555",fontStyle:"italic",background:"#f0f4fb"},children:t}),hr:()=>e.jsx("hr",{style:{border:"none",borderTop:"1px solid #d0d8f0",margin:"16px 0"}}),strong:({children:t})=>e.jsx("strong",{style:{color:ce,fontWeight:"bold"},children:t}),em:({children:t})=>e.jsx("em",{style:{color:"#444",fontStyle:"italic"},children:t}),a:({href:t,children:n})=>e.jsx("a",{href:t,target:"_blank",rel:"noopener noreferrer",style:{color:xe,textDecoration:"underline",fontSize:"12px"},children:n}),img:({src:t,alt:n})=>e.jsx("img",{src:t,alt:n??"",style:{maxWidth:"100%",borderRadius:"4px",border:"1px solid #d0d8f0",margin:"8px 0",display:"block",boxShadow:"0 2px 6px rgba(0,0,0,0.12)"}}),table:({children:t})=>e.jsx("div",{style:{overflowX:"auto",marginBottom:"12px"},children:e.jsx("table",{style:{borderCollapse:"collapse",width:"100%",fontSize:"11px"},children:t})}),thead:({children:t})=>e.jsx("thead",{style:{background:"#dbe4f5"},children:t}),th:({children:t})=>e.jsx("th",{style:{border:"1px solid #c5d0e8",padding:"5px 10px",textAlign:"left",fontWeight:"bold",color:ce},children:t}),td:({children:t})=>e.jsx("td",{style:{border:"1px solid #d8dfe8",padding:"4px 10px",color:"#333"},children:t}),tr:({children:t})=>e.jsx("tr",{style:{background:"transparent"},children:t})};function mn({value:t,onChange:n}){return e.jsxs("div",{style:{position:"absolute",top:"38px",right:"10px",zIndex:20,background:"rgba(236,233,216,0.92)",border:"1px solid #aca899",borderRadius:"3px",padding:"4px 8px",display:"flex",alignItems:"center",gap:"6px",fontSize:"10px",color:"#555",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"},"data-cid":"VVQTXs_T",children:[e.jsx("span",{style:{whiteSpace:"nowrap"},children:"背景透明度"}),e.jsx("input",{type:"range",min:0,max:100,value:Math.round(t*100),onChange:o=>n(Number(o.target.value)/100),style:{width:"70px",cursor:"pointer",accentColor:xe}}),e.jsxs("span",{style:{minWidth:"28px"},children:[Math.round(t*100),"%"]})]})}function st({postId:t}){const{data:n}=Y({...A.site.getBlogPosts.queryOptions(),staleTime:6e4}),o=n?.find(l=>l.id===t)??De.find(l=>l.id===t),[s,r]=a.useState(o?.bgOpacity??1),i=!!o?.backgroundImage;return o?e.jsxs("div",{style:{height:"100%",position:"relative",overflow:"hidden",fontFamily:ze},"data-cid":"R_NCS8so",children:[i&&e.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,backgroundImage:`url(${o.backgroundImage})`,backgroundSize:"cover",backgroundPosition:"center",opacity:s,zIndex:0}}),e.jsxs("div",{style:{position:"relative",zIndex:10,height:"100%",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{background:"#ece9d8",borderBottom:"1px solid #aca899",padding:"4px 10px",display:"flex",gap:"2px",flexShrink:0,alignItems:"center"},children:[["File","Edit","View","Format","Help"].map(l=>e.jsx("button",{type:"button",style:{background:"none",border:"none",padding:"2px 8px",cursor:"pointer",fontFamily:ze,fontSize:"12px"},children:l},l)),e.jsxs("span",{style:{marginLeft:"auto",fontSize:"11px",color:"#888",paddingRight:i?"100px":"10px"},children:[o.title," — 只读"]})]}),i&&e.jsx(mn,{value:s,onChange:r}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"12px",background:i?"transparent":"#f0ede4"},children:e.jsx("div",{style:{maxWidth:"680px",margin:"0 auto 12px auto",padding:"32px 40px",background:i?"rgba(255,255,255,0)":"#fff",minHeight:"400px",boxShadow:"0 0 12px rgba(0,0,0,0.15)",backdropFilter:i?"blur(2px)":"none"},children:e.jsx(Re,{remarkPlugins:[_e],components:bn,children:o.content})})})]})]}):e.jsx("div",{style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",fontFamily:ze},"data-cid":"WfJmneHO",children:e.jsx("span",{style:{color:"#888",fontSize:"12px"},children:"正在加载文章内容..."})})}const F='"Trebuchet MS", Tahoma, Arial, sans-serif';function yn(t){return t?new Date(t).toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):""}function vn({msg:t}){return e.jsxs("div",{style:{position:"relative",background:t.isPinned?"#fffbe6":"#ffffff",border:`1px solid ${t.isPinned?"#f0c040":"#d4d0c8"}`,borderRadius:"3px",padding:"7px 10px 7px 10px",marginBottom:"5px"},"data-cid":"CdWDXj4c",children:[t.isPinned&&e.jsx("span",{style:{position:"absolute",top:"5px",right:"8px",fontSize:"10px",color:"#b8820a",fontFamily:F,display:"flex",alignItems:"center",gap:"2px",background:"#fef3b0",padding:"1px 5px",borderRadius:"2px",border:"1px solid #f0c040"},children:"📌 置顶"}),e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:"8px",marginBottom:"4px",paddingRight:t.isPinned?"52px":"0"},children:[e.jsx("span",{style:{fontWeight:"bold",fontSize:"12px",color:"#003c7e",fontFamily:F},children:t.name}),e.jsx("span",{style:{fontSize:"10px",color:"#999",fontFamily:F},children:yn(t.createdAt)})]}),e.jsx("div",{style:{fontSize:"12px",color:"#1a1a1a",fontFamily:F,lineHeight:"1.55",whiteSpace:"pre-wrap",wordBreak:"break-word"},children:t.content})]})}function Sn({bgUrlInput:t,setBgUrlInput:n,bgOpacity:o,setBgOpacity:s,hasBg:r,onApply:i,onClear:l,onClose:f}){return e.jsxs("div",{style:{position:"absolute",top:"58px",right:"6px",zIndex:20,background:"#ece9d8",border:"2px solid #aca899",padding:"10px 12px",width:"230px",boxShadow:"3px 3px 6px rgba(0,0,0,0.25)",fontFamily:F},"data-cid":"nHQcjPKp",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:"bold",color:"#000"},children:"背景图片设置"}),e.jsx("button",{onClick:f,style:{fontSize:"11px",background:"none",border:"none",cursor:"pointer",color:"#555",padding:"0 2px"},children:"✕"})]}),e.jsx("div",{style:{fontSize:"11px",marginBottom:"3px",color:"#000"},children:"图片 URL："}),e.jsx("input",{value:t,onChange:x=>n(x.target.value),onKeyDown:x=>x.key==="Enter"&&i(),placeholder:"粘贴图片链接后回车",style:{width:"100%",fontSize:"11px",padding:"2px 5px",border:"1px solid #7f9db9",fontFamily:F,boxSizing:"border-box",marginBottom:"6px"}}),e.jsxs("div",{style:{display:"flex",gap:"4px",marginBottom:"10px"},children:[e.jsx("button",{onClick:i,style:{flex:1,fontSize:"11px",padding:"2px 0",fontFamily:F,background:"linear-gradient(to bottom, #f4f4f0, #dbd9d0)",border:"1px solid #aca899",cursor:"pointer"},children:"应用"}),r&&e.jsx("button",{onClick:l,style:{flex:1,fontSize:"11px",padding:"2px 0",fontFamily:F,background:"linear-gradient(to bottom, #f4f4f0, #dbd9d0)",border:"1px solid #aca899",cursor:"pointer"},children:"清除"})]}),e.jsxs("div",{style:{fontSize:"11px",marginBottom:"3px",color:"#000"},children:["背景透明度：",Math.round(o*100),"%"]}),e.jsx("input",{type:"range",min:5,max:100,value:Math.round(o*100),onChange:x=>s(parseInt(x.target.value,10)/100),style:{width:"100%"}})]})}function jn(){const[t,n]=a.useState(""),[o,s]=a.useState(""),[r,i]=a.useState(0),[l,f]=a.useState(""),[x,d]=a.useState(""),[h,m]=a.useState(.15),[S,u]=a.useState(!1),[k,v]=a.useState(!1),b=a.useRef(null),z=dt(),{isLoaded:j,chatboxBgUrl:_,chatboxBgOpacity:K}=Q();a.useEffect(()=>{j&&!k&&(f(_),d(_),m(K),v(!0))},[j,_,K,k]);const D=A.chatbox.listMessages.queryOptions({limit:50}).queryKey,{data:W,isLoading:O}=Y({...A.chatbox.listMessages.queryOptions({limit:50}),refetchInterval:3e4,refetchOnWindowFocus:!0}),E=pt(A.chatbox.createMessage.mutationOptions({onSuccess:()=>{s(""),z.invalidateQueries({queryKey:D}),requestAnimationFrame(()=>{b.current&&(b.current.scrollTop=0)})},onError:p=>{const B=p.message.match(/(\d+)\s*秒/);i(B?.[1]!==void 0?parseInt(B[1],10):60)}}));a.useEffect(()=>{if(r<=0)return;const p=setTimeout(()=>i(B=>Math.max(0,B-1)),1e3);return()=>clearTimeout(p)},[r]);const P=p=>{p.preventDefault(),!(!t.trim()||!o.trim()||E.isPending||r>0)&&E.mutate({name:t.trim(),content:o.trim()})},J=()=>{f(x.trim()),u(!1)},I=()=>{f(""),d("")},H=W?.pinned??[],N=W?.items??[],Z=[...H,...N],U=E.isPending||!t.trim()||!o.trim()||r>0;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",position:"relative",fontFamily:F,overflow:"hidden",background:"#f0ede8"},"data-cid":"d5mQm1Ab",children:[l&&e.jsx("div",{style:{position:"absolute",inset:0,zIndex:0,backgroundImage:`url(${l})`,backgroundSize:"cover",backgroundPosition:"center",opacity:h,pointerEvents:"none"}}),e.jsxs("div",{style:{position:"relative",zIndex:2,flexShrink:0,background:"#ece9d8",borderBottom:"2px solid #aca899"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"2px",padding:"2px 4px",borderBottom:"1px solid #d4d0c8"},children:[["文件(F)","编辑(E)","查看(V)","帮助(H)"].map(p=>e.jsx("span",{style:{padding:"1px 6px",fontSize:"11px",cursor:"default",color:"#000",userSelect:"none"},children:p},p)),e.jsx("div",{style:{flex:1}}),e.jsx("button",{onClick:()=>u(p=>!p),style:{padding:"1px 8px",fontSize:"11px",fontFamily:F,background:S?"linear-gradient(to bottom, #dbd9d0, #c8c6bc)":"linear-gradient(to bottom, #f4f4f0, #dbd9d0)",border:"1px solid #aca899",cursor:"pointer",borderRadius:"2px",color:"#000"},children:"🎨 背景"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",padding:"2px 6px",gap:"6px"},children:[e.jsx("span",{style:{fontSize:"11px",color:"#444",whiteSpace:"nowrap"},children:"地址(D)"}),e.jsx("div",{style:{flex:1,background:"#fff",border:"1px solid #7f9db9",padding:"1px 6px",fontSize:"11px",color:"#5a5a5a"},children:"💬 留言板 / ChatBox"})]})]}),S&&e.jsx(Sn,{bgUrlInput:x,setBgUrlInput:d,bgOpacity:h,setBgOpacity:m,hasBg:!!l,onApply:J,onClear:I,onClose:()=>u(!1)}),e.jsxs("div",{ref:b,style:{flex:1,overflowY:"auto",padding:"8px 10px",position:"relative",zIndex:1},children:[O&&e.jsx("div",{style:{textAlign:"center",padding:"28px 0",fontSize:"12px",color:"#666"},children:"正在连接留言板..."}),!O&&Z.length===0&&e.jsxs("div",{style:{textAlign:"center",padding:"36px 20px",fontSize:"12px",color:"#888",lineHeight:"2"},children:[e.jsx("div",{style:{fontSize:"28px",marginBottom:"6px"},children:"💬"}),"还没有留言，来第一个吧！"]}),Z.map(p=>e.jsx(vn,{msg:p},p.id)),W?.nextCursor&&e.jsx("div",{style:{textAlign:"center",fontSize:"11px",color:"#888",padding:"6px 0"},children:"── 仅显示最新 50 条留言 ──"})]}),r>0&&e.jsxs("div",{style:{position:"relative",zIndex:2,flexShrink:0,background:"#fff3cd",border:"1px solid #ffc107",borderLeft:"4px solid #ffc107",margin:"0 8px 4px",padding:"5px 10px",borderRadius:"2px",fontSize:"11px",color:"#856404",display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{children:"⚠️"}),e.jsxs("span",{children:["请休息一会再留言（剩余"," ",e.jsx("strong",{children:r})," 秒）"]})]}),e.jsx("div",{style:{flexShrink:0,position:"relative",zIndex:2,background:"#ece9d8",borderTop:"2px solid #aca899",padding:"7px 10px 8px"},children:e.jsxs("form",{onSubmit:P,children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",marginBottom:"5px"},children:[e.jsx("label",{style:{fontSize:"11px",color:"#000",whiteSpace:"nowrap",minWidth:"36px"},children:"昵称："}),e.jsx("input",{value:t,onChange:p=>n(p.target.value),maxLength:20,placeholder:"你的昵称（最多 20 字）",style:{flex:1,fontSize:"11px",padding:"2px 5px",border:"1px solid #7f9db9",fontFamily:F,outline:"none"}})]}),e.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"flex-end"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("textarea",{value:o,onChange:p=>s(p.target.value),maxLength:500,placeholder:"留言内容（最多 500 字）",rows:2,style:{width:"100%",fontSize:"11px",padding:"3px 5px",border:"1px solid #7f9db9",fontFamily:F,resize:"none",lineHeight:"1.45",boxSizing:"border-box",outline:"none"}}),e.jsxs("div",{style:{textAlign:"right",fontSize:"10px",color:o.length>450?"#c0392b":"#999",marginTop:"1px"},children:[o.length," / 500"]})]}),e.jsx("button",{type:"submit",disabled:U,style:{padding:"0 14px",height:"42px",marginBottom:"18px",fontSize:"11px",fontFamily:F,background:U?"#d4d0c8":"linear-gradient(to bottom, #f4f4f0, #dbd9d0)",border:"2px outset #d4d0c8",cursor:U?"not-allowed":"pointer",color:U?"#888":"#000",fontWeight:"bold",whiteSpace:"nowrap",flexShrink:0},children:E.isPending?"发送中...":"发  送"})]})]})})]})}const re={myComputer:{id:"myComputer",title:"My Computer",icon:"https://static.step1.dev/g9nbov/assets/c27a5c3a1797.png",defaultWidth:640,defaultHeight:480,AppComponent:Ht},gamesFolder:{id:"gamesFolder",title:"Games",icon:"https://static.step1.dev/g9nbov/assets/37d3eab6367b.png",defaultWidth:620,defaultHeight:460,AppComponent:Vt},aboutme:{id:"aboutme",title:"About Me",icon:"https://static.step1.dev/g9nbov/assets/58721f37b0c0.png",defaultWidth:500,defaultHeight:400,AppComponent:qt},contact:{id:"contact",title:"Contact Me",icon:"https://static.step1.dev/g9nbov/assets/e225895b1c27.png",defaultWidth:400,defaultHeight:380,AppComponent:Jt},webamp:{id:"webamp",title:"Winamp",icon:"https://static.step1.dev/g9nbov/assets/da0d359368d3.png",defaultWidth:350,defaultHeight:230,AppComponent:en},msn:{id:"msn",title:"MSN Messenger",icon:"https://static.step1.dev/g9nbov/assets/ba1bb3f668bb.png",defaultWidth:340,defaultHeight:500,AppComponent:tn},paint:{id:"paint",title:"Paint",icon:"https://static.step1.dev/g9nbov/assets/035b30cba825.png",defaultWidth:700,defaultHeight:500,AppComponent:nn},resume:{id:"resume",title:"README.md",icon:"https://static.step1.dev/g9nbov/assets/bb426464f8be.ico",defaultWidth:700,defaultHeight:560,AppComponent:()=>G.createElement(it,{documentId:"resume"})},video:{id:"video",title:"Windows Media Player",icon:"https://static.step1.dev/g9nbov/assets/da0d359368d3.png",defaultWidth:680,defaultHeight:520,AppComponent:rn},portfolio:{id:"portfolio",title:"My Portfolio",icon:"https://static.step1.dev/g9nbov/assets/37d3eab6367b.png",defaultWidth:780,defaultHeight:560,AppComponent:dn},imageViewer:{id:"imageViewer",title:"Image Viewer",icon:"/assets/icons/file.png",defaultWidth:640,defaultHeight:500,AppComponent:pn},chatbox:{id:"chatbox",title:"ChatBox - 留言板",icon:"/assets/icons/MSN.png",defaultWidth:520,defaultHeight:540,AppComponent:jn},blog:{id:"blog",title:"My Blog",icon:"https://static.step1.dev/g9nbov/assets/37d3eab6367b.png",defaultWidth:640,defaultHeight:460,AppComponent:hn}};De.forEach(t=>{re[t.id]={id:t.id,title:t.title,icon:t.icon,defaultWidth:700,defaultHeight:560,AppComponent:()=>G.createElement(st,{postId:t.id})}});const Qe="/assets/icons/file.png";function Je(t){const n=t.getHours(),o=t.getMinutes().toString().padStart(2,"0"),s=n>=12?"PM":"AM";return`${n%12||12}:${o} ${s}`}function wn({id:t,documents:n}){const o=re[t];if(o){const{AppComponent:s}=o;return e.jsx(s,{"data-cid":"9rTT60vZ"})}return n.some(s=>s.id===t)?e.jsx(it,{documentId:t,"data-cid":"dWELQmOj"}):e.jsx("div",{style:{padding:"20px",fontFamily:'"Trebuchet MS", Tahoma, sans-serif',fontSize:"13px"},"data-cid":"YeCaPAUn",children:e.jsxs("p",{children:["Content for ",e.jsx("strong",{children:t})," coming soon!"]})})}function kn(){const[t,n]=a.useState(!1),[o,s]=a.useState(()=>Je(new Date)),[r,i]=a.useState([]),[l,f]=a.useState(new Set),x=a.useRef(100),d=Q(),{data:h}=Y({...A.site.getDesktopIcons.queryOptions(),staleTime:6e4}),m=h??Ze,{data:S}=Y({...A.site.getMascots.queryOptions(),staleTime:6e4}),u=S??Lt,{data:k}=Y({...A.site.getDocuments.queryOptions(),staleTime:0,refetchOnMount:"always"}),v=a.useMemo(()=>k??[],[k]),b=a.useMemo(()=>v.filter(g=>!re[g.id]),[v]),z=a.useMemo(()=>[...m,...b.map(g=>({id:g.id,label:g.title,src:g.iconSrc||Qe}))],[m,b]),{icons:j,selectedId:_,startDrag:K,deselectAll:D,selectIcon:W}=Rt(z),O=a.useRef(null),E=a.useRef(v);E.current=v,a.useEffect(()=>{const g=setInterval(()=>s(Je(new Date)),1e3);return()=>clearInterval(g)},[]);const P=a.useCallback(g=>{g.stopPropagation(),n(y=>!y)},[]),J=a.useCallback(()=>{t&&n(!1),D()},[t,D]),I=a.useCallback(g=>{n(!1),H(g)},[]),H=a.useCallback(g=>{const y=re[g],c=y?void 0:E.current.find(se=>se.id===g);if(!y&&!c)return;const C=y?.title??c.title,M=y?.icon??(c.iconSrc||Qe),le=y?.defaultWidth??700,de=y?.defaultHeight??560;i(se=>{if(se.find(he=>he.id===g)){const he=x.current+1;return x.current=he,se.map(ve=>ve.id===g?{...ve,minimized:!1,zIndex:he}:ve)}const Ee=se.length%8*22,at=++x.current,lt={id:g,title:C,icon:M,x:80+Ee,y:40+Ee,width:le,height:de,zIndex:at,minimized:!1};return[...se,lt]})},[]);a.useEffect(()=>{const g=y=>{const c=y.detail;if(!c)return;const C=typeof c=="string"?c:c.id;if(C){if(!re[C]&&typeof c=="object"){const{title:M,icon:le}=c;re[C]={id:C,title:M,icon:le,defaultWidth:700,defaultHeight:560,AppComponent:()=>G.createElement(st,{postId:C})}}H(C)}};return window.addEventListener("xp-open-window",g),()=>window.removeEventListener("xp-open-window",g)},[H]);const N=a.useCallback(g=>{W(g);const y=Date.now();O.current?.id===g&&y-O.current.time<350?(O.current=null,H(g)):O.current={id:g,time:y}},[H,W]),Z=a.useCallback(g=>{const y=++x.current;i(c=>c.map(C=>C.id===g?{...C,zIndex:y}:C))},[]),U=a.useCallback(g=>{i(y=>y.filter(c=>c.id!==g))},[]),p=a.useCallback(g=>{i(y=>y.map(c=>c.id===g?{...c,minimized:!0}:c))},[]),B=a.useCallback((g,y,c)=>{i(C=>C.map(M=>M.id===g?{...M,x:y,y:c}:M))},[]),L=a.useCallback((g,y,c,C,M)=>{i(le=>le.map(de=>de.id===g?{...de,x:y,y:c,width:C,height:M}:de))},[]),$=a.useCallback(g=>{f(y=>{const c=new Set(y);return c.has(g)?c.delete(g):c.add(g),c})},[]),ee=a.useCallback(g=>{f(y=>{const c=new Set(y);return c.delete(g),c})},[]),R=a.useCallback(g=>{i(y=>{const c=y.find(C=>C.id===g);if(!c)return y;if(c.minimized){const C=++x.current;return y.map(M=>M.id===g?{...M,minimized:!1,zIndex:C}:M)}return y.map(C=>C.id===g?{...C,minimized:!0}:C)})},[]);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{id:"root",onClick:J,"data-cid":"Y16tDRLr",children:[e.jsxs("div",{className:"_desktop_1d92e_1",style:{backgroundImage:`url("${d.wallpaperUrl}")`,position:"relative"},children:[e.jsx("div",{style:{position:"absolute",inset:"0 0 30px 0",overflow:"hidden"},children:j.map(g=>e.jsx(Cn,{id:g.id,label:g.label,src:g.src,x:g.x,y:g.y,selected:_===g.id,onPointerDown:y=>K(y,g.id),onClick:()=>N(g.id)},g.id))}),e.jsx("div",{id:"xp-webamp-host",style:{inset:"0px 0px 30px",pointerEvents:"none",position:"fixed"}})]}),e.jsxs("div",{className:"_taskbar_oqlpl_1","data-taskbar":"true",children:[e.jsxs("button",{"data-start-button":"true",onClick:P,style:{display:"flex",alignItems:"center",gap:"4px",height:"100%",padding:"0 10px 0 6px",background:t?"linear-gradient(180deg, #1a6a1a 0%, #228b22 50%, #2ea52e 100%)":"linear-gradient(180deg, #3cb84a 0%, #28a035 40%, #1e8c2a 100%)",border:"none",borderRight:"1px solid #1a6e1a",borderRadius:"0 12px 12px 0",cursor:"pointer",boxShadow:t?"inset 1px 1px 3px rgba(0,0,0,0.5)":"1px 0 3px rgba(0,0,0,0.3)",minWidth:"96px",fontFamily:'"Trebuchet MS", Tahoma, Arial, sans-serif',fontSize:"14px",fontWeight:"bold",fontStyle:"italic",color:"#ffffff",textShadow:"1px 1px 2px rgba(0,0,0,0.6)",letterSpacing:"0.5px",flexShrink:0},children:[e.jsx("img",{src:d.logoUrl,alt:"Windows",style:{width:"20px",height:"20px",objectFit:"contain"}}),e.jsx("span",{children:"start"})]}),e.jsx("div",{style:{flex:1,display:"flex",alignItems:"center",gap:"3px",padding:"2px 4px",overflow:"hidden"},children:r.map(g=>e.jsx(zn,{win:g,onClick:()=>R(g.id)},g.id))}),e.jsxs("div",{className:"_system-tray_oqlpl_86",children:[d.systemTrayIcons.map((g,y)=>e.jsx("div",{className:"_system-tray-item-wrapper_oqlpl_147",children:e.jsx("div",{className:"_system-tray-item_oqlpl_100",style:{backgroundImage:`url("${g}")`}})},y)),e.jsx("div",{className:"_time_oqlpl_108",children:o})]})]}),e.jsx("div",{style:{backgroundColor:"rgb(0,0,0)",inset:"0px",opacity:"0",pointerEvents:"none",position:"fixed",transition:"opacity 500ms ease-in-out",zIndex:"99998"}})]},"1"),r.map(g=>e.jsx(It,{win:g,onFocus:Z,onClose:U,onMinimize:p,onPositionChange:B,onSizeChange:L,children:e.jsx(wn,{id:g.id,documents:v})},g.id)),t&&e.jsx(wt,{onItemClick:I,onLogOff:()=>n(!1),onTurnOff:()=>n(!1)}),e.jsx(_t,{pets:u,activePetIds:l,onToggle:$}),u.filter(g=>l.has(g.id)).map(g=>e.jsx(Et,{pet:g,onDismiss:ee},g.id)),e.jsx("iframe",{height:"1",width:"1",style:{border:"none",left:"0px",position:"absolute",top:"0px",visibility:"hidden"}},"3"),e.jsx("div",{id:"_r_0_","data-base-ui-portal":"","data-slot":"toast-portal-anchored",children:e.jsx("div",{tabIndex:-1,role:"region","aria-live":"polite","aria-atomic":!1,"aria-relevant":"additions text","aria-label":"Notifications","data-slot":"toast-viewport-anchored",className:"outline-none"})},"5"),e.jsx("div",{id:"_r_1_","data-base-ui-portal":"","data-slot":"toast-portal",children:e.jsx("div",{tabIndex:-1,role:"region","aria-live":"polite","aria-atomic":!1,"aria-relevant":"additions text","aria-label":"Notifications","data-position":"bottom-right","data-slot":"toast-viewport",className:"fixed z-50 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)] data-[position*=top]:top-(--toast-inset) data-[position*=bottom]:bottom-(--toast-inset) data-[position*=left]:left-(--toast-inset) data-[position*=right]:right-(--toast-inset) data-[position*=center]:-translate-x-1/2 data-[position*=center]:left-1/2"})},"6")]})}function Cn({id:t,label:n,src:o,x:s,y:r,selected:i,onPointerDown:l,onClick:f}){return e.jsxs("div",{"data-icon-id":t,onPointerDown:l,onClick:x=>{x.stopPropagation(),f()},style:{position:"absolute",left:s,top:r,width:oe,height:oe,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",gap:"4px",padding:"4px",borderRadius:"2px",boxSizing:"border-box",cursor:"default",touchAction:"none",background:i?"var(--xp-selection-overlay)":"transparent",border:i?"1px dotted rgba(255,255,255,0.7)":"1px solid transparent",userSelect:"none",WebkitUserSelect:"none"},"data-cid":"Pj7PlhNi",children:[e.jsx("img",{alt:n,src:o,draggable:!1,style:{width:"45px",height:"45px",objectFit:"contain",pointerEvents:"none",filter:i?"brightness(0.85) saturate(1.2)":"none"}}),e.jsx("span",{style:{color:"#fff",textShadow:"1px 1px 2px rgba(0,0,0,0.9)",fontSize:"11px",textAlign:"center",wordBreak:"break-word",maxWidth:"76px",padding:"1px 3px",lineHeight:"1.2",fontFamily:'MSSS, Tahoma, "Trebuchet MS", Arial, sans-serif',background:i?"var(--xp-selection-label-bg)":"transparent",borderRadius:"1px"},children:n})]})}const Tn='"Trebuchet MS", Tahoma, Arial, sans-serif';function zn({win:t,onClick:n}){const[o,s]=a.useState(!1),r=!t.minimized;return e.jsxs("button",{onClick:i=>{i.stopPropagation(),n()},onMouseEnter:()=>s(!0),onMouseLeave:()=>s(!1),style:{display:"flex",alignItems:"center",gap:"5px",height:"22px",padding:"0 8px",minWidth:"120px",maxWidth:"160px",background:r?o?"linear-gradient(180deg, #ececec 0%, #c0c0c0 100%)":"linear-gradient(180deg, #e0e0e0 0%, #b8b8b8 100%)":o?"linear-gradient(180deg, #d8d8d8 0%, #a8a8a8 100%)":"linear-gradient(180deg, #c8c8c8 0%, #a0a0a0 100%)",border:r?"1px solid #888":"1px solid #767676",borderRadius:"3px",boxShadow:r?"inset 0 1px 0 rgba(255,255,255,0.6)":"none",cursor:"pointer",fontFamily:Tn,fontSize:"11px",fontWeight:r?"bold":"normal",color:"#000",textShadow:"1px 1px 1px rgba(255,255,255,0.4)",overflow:"hidden",flexShrink:0},"data-cid":"sQ2CgkG8",children:[e.jsx("img",{src:t.icon,alt:"",style:{width:"14px",height:"14px",objectFit:"contain",flexShrink:0}}),e.jsx("span",{style:{overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},children:t.title})]})}const Ie='"Trebuchet MS", Tahoma, Arial, sans-serif',rt="https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico",Be=700;function Bn({onDone:t,identity:n}){return a.useEffect(()=>{const o=setTimeout(t,3e3);return()=>clearTimeout(o)},[t]),e.jsxs("div",{style:{position:"fixed",inset:0,zIndex:99999,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:Ie},"data-cid":"S_5WR6bA",children:[e.jsx("style",{children:`
        @keyframes xpBoot {
          from { transform: translateX(-100px); }
          to   { transform: translateX(280px); }
        }
      `}),e.jsx("img",{src:rt,alt:"Windows",style:{width:64,height:64,marginBottom:24,imageRendering:"pixelated"}}),e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:4,marginBottom:6},children:[e.jsx("span",{style:{color:"#fff",fontSize:36,fontWeight:"bold"},children:n.brand}),e.jsx("span",{style:{color:"#c0392b",fontSize:28,fontStyle:"italic",fontWeight:"bold"},children:"xp"})]}),e.jsx("div",{style:{color:"#ccc",fontSize:14,marginBottom:80},children:n.subtitle}),e.jsx("div",{style:{position:"absolute",bottom:"22%",width:280,height:16,border:"2px solid #2a2a2a",borderRadius:999,background:"#000",overflow:"hidden"},children:e.jsx("div",{style:{display:"flex",gap:6,alignItems:"center",height:"100%",animation:"xpBoot 1.4s linear infinite"},children:[0,1,2].map(o=>e.jsx("div",{style:{width:24,height:"80%",borderRadius:999,flexShrink:0,background:"linear-gradient(180deg, #ffffff 0%, #d0d0d0 50%, #888 100%)"}},o))})})]})}function Pn({onEnter:t,identity:n}){const[o,s]=a.useState(!1),[r,i]=a.useState(!1),[,l]=a.useTransition(),f=()=>{new Audio("/startup.mp3").play().catch(()=>{}),i(!0),setTimeout(()=>{l(()=>t())},Be)};return e.jsxs("div",{style:{position:"fixed",inset:0,zIndex:99999,display:"flex",flexDirection:"column",fontFamily:Ie,willChange:"transform, opacity",transform:r?"scale(0.94)":"scale(1)",opacity:r?0:1,transition:r?`transform ${Be}ms ease-in, opacity ${Be}ms ease-in`:"none",pointerEvents:r?"none":"auto"},"data-cid":"x9tPs6QM",children:[e.jsx("div",{style:{height:80,background:"#3a3a3a",flexShrink:0}}),e.jsxs("div",{style:{flex:1,background:"linear-gradient(180deg, #c8c8c8 0%, #a8a8a8 50%, #888 100%)",display:"flex"},children:[e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,borderRight:"1px solid #999"},children:[e.jsx("img",{src:rt,alt:"Windows",style:{width:72,height:72,imageRendering:"pixelated",marginBottom:8}}),e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:4},children:[e.jsx("span",{style:{color:"#fff",fontSize:32,fontWeight:"bold",textShadow:"1px 1px 3px rgba(0,0,0,0.5)"},children:n.brand}),e.jsx("span",{style:{color:"#c0392b",fontSize:24,fontStyle:"italic",fontWeight:"bold"},children:"xp"})]}),e.jsx("div",{style:{color:"#eee",fontSize:13,textShadow:"1px 1px 2px rgba(0,0,0,0.4)"},children:n.role}),e.jsx("div",{style:{color:"#ddd",fontSize:12,marginTop:16,textShadow:"1px 1px 2px rgba(0,0,0,0.4)"},children:"To begin, click your user name"})]}),e.jsx("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("div",{onClick:f,onMouseEnter:()=>s(!0),onMouseLeave:()=>s(!1),style:{display:"flex",alignItems:"center",gap:16,padding:"14px 20px",borderRadius:6,cursor:"pointer",background:o?"rgba(255,255,255,0.15)":"transparent",transition:"background 0.15s"},children:[e.jsx("img",{src:n.avatarUrl,alt:n.username,style:{width:80,height:80,border:"2px solid #fff",borderRadius:4,objectFit:"cover"}}),e.jsxs("div",{children:[e.jsx("div",{style:{color:"#fff",fontSize:18,fontWeight:"bold",textShadow:"1px 1px 3px rgba(0,0,0,0.5)"},children:n.username}),e.jsx("div",{style:{color:"#ddd",fontSize:12,textShadow:"1px 1px 2px rgba(0,0,0,0.4)"},children:n.role})]})]})})]}),e.jsx("div",{style:{height:60,background:"#3a3a3a",flexShrink:0,display:"flex",alignItems:"center",padding:"0 20px"},children:e.jsxs("button",{onClick:()=>window.location.reload(),style:{display:"flex",alignItems:"center",gap:8,background:"linear-gradient(180deg, #d0d0d0 0%, #a0a0a0 100%)",border:"1px solid #888",borderRadius:4,padding:"4px 12px",cursor:"pointer",fontFamily:Ie,fontSize:12,color:"#000"},children:[e.jsx("span",{style:{fontSize:16},children:"⟳"}),e.jsx("span",{children:"Restart"})]})})]})}function Mn({children:t}){const[n,o]=a.useState("init"),s=Q(),r={brand:s.siteBrand,subtitle:s.bootSubtitle,username:s.siteUsername,avatarUrl:s.siteAvatarUrl,role:s.siteRole};a.useEffect(()=>{const l=sessionStorage.getItem("xp:welcomed")==="1";o(l?"desktop":"boot")},[]);const i=()=>{sessionStorage.setItem("xp:welcomed","1"),o("desktop")};return e.jsxs(e.Fragment,{children:[t,n==="boot"&&e.jsx(Bn,{onDone:()=>o("login"),identity:r}),n==="login"&&e.jsx(Pn,{onEnter:i,identity:r})]})}function In(){const t=Q();return a.useEffect(()=>{if(!t.isLoaded)return;document.title=t.siteTitle;const n=(o,s)=>{document.querySelector(o)?.setAttribute("content",s)};n('meta[name="description"]',t.siteDescription),n('meta[name="author"]',t.siteAuthor),n('meta[property="og:title"]',t.siteTitle),n('meta[property="og:description"]',t.siteDescription),n('meta[property="article:author"]',t.siteAuthor),n('meta[name="twitter:title"]',t.siteTitle),n('meta[name="twitter:description"]',t.siteDescription)},[t.isLoaded,t.siteTitle,t.siteDescription,t.siteAuthor]),null}function En(){return e.jsxs(e.Fragment,{children:[e.jsx(In,{}),e.jsx(Mn,{children:e.jsx(kn,{})})]})}export{En as component};
