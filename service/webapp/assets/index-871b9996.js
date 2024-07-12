import{n as ge,g as he,r as i,p as _e,q as ve,s as A,a as N,o as g,c as K,e as w,b as t,w as l,u as n,v as F,F as G,E as ye,x as be,d as r,y as B,z as xe,t as x,A as E,h as we,B as Ce,l as Se,m as Ve,j as ke,k as Ie,C as Ee,D as De,G as Re,H as $e,I as Ne,_ as Ke,J as Fe,K as Be,L as Le,M as Me}from"./index-157ac220.js";import{s as I}from"./request-fe3952cd.js";const Oe=()=>I({url:"/redis/listKey",method:"get"}),Ue=a=>I({url:"/redis/getByKey",method:"get",params:a}),ze=a=>I({url:"/redis/initRedis",method:"get",params:a}),Je=a=>I({url:"/redis/getRedisDbInfo",method:"get",params:a}),Te=a=>I({url:"/redis/changeRedisDb",method:"get",params:a});function He(a){let d=localStorage.getItem(a);try{return JSON.parse(d)}catch{return d}}function Y(a,d){(d||d===0)&&localStorage.setItem(a,JSON.stringify(d))}function je(a){let d=Math.floor(a/3600)+"",C=Math.floor(a%3600/60)+"",p=Math.floor(a%60)+"";return d.toString().padStart(2,"0"),C.toString().padStart(2,"0"),p.toString().padStart(2,"0"),`${d.padStart(2,"0")}:${C.padStart(2,"0")}:${p.padStart(2,"0")}`}function qe(a){return a&&Math.random().toString(32).slice(-8)+a.substr(a.length-1,1)+a+a.substr(a.length-1,1)+a.substr(0,1)+Math.random().toString(32).slice(-10)+"="}function Ae(a){return!a||a.length<15?a:a.substring(9,a.length-13)}const P=a=>(Be("data-v-e26243cc"),a=a(),Le(),a),Ge={class:"app-container"},Ye=P(()=>w("span",{style:{"vertical-align":"middle"}},"主机列表",-1)),Pe={style:{"vertical-align":"middle"}},Qe=P(()=>w("span",{style:{"vertical-align":"middle"}},"缓存内容",-1)),We={key:0,class:"json-box"},Xe={class:"dialog-footer"},L="REDIS_LIST_KEY",Ze={__name:"index",setup(a){const{proxy:d}=he(),C=i([]),p=i([]),D=i([]),u=i({}),Q=i(!1),R=i(!1),h=i(!1);i("");const S=i(""),V=i(null),_=i({}),M=i(window.innerHeight-200),{addForm:c,rules:W}=_e(ve({addForm:{host:"",post:6379,password:""},rules:{host:[{required:!0,message:"主机host不能为空",trigger:"blur"}],port:[{required:!0,message:"主机端口不能为空",trigger:"blur"}]}})),X=A(()=>D.value.filter(s=>!S.value||s.name.toLowerCase().includes(S.value.toLowerCase()))),O=A(()=>{if(!u.value.value)return"";try{return JSON.stringify(JSON.parse(u.value.value),null,2)}catch{return""}});function U(){const s=He(L);s&&s.length&&(p.value=s)}function Z(){U(),d.$modal.msgSuccess("刷新主机列表成功")}function ee(s){d.$modal.confirm('是否确认删除名称为"'+s.host+'"的数据项?').then(()=>{let e=p.value.findIndex(m=>m.id==s.id);console.log("del",e),e>=0&&p.value.splice(e,1),Y(L,p.value)}).catch(()=>{})}function te(){d.$refs.addFormRef.validate(s=>{s&&(p.value.push({...c.value,password:qe(c.value.password),id:Math.random().toString(32).slice(-5)}),Y(L,p.value),h.value=!1)})}function le(s){ze({...s,password:Ae(s.password)}).then(e=>{e.code==200?(e.data&&(V.value=e.data.currDb+"",_.value=e.data.redisInfo||{}),ae(),z()):(d.$modal.msgSuccess("连接redis失败"),_.value={})})}function ae(){Je().then(s=>{let e=s.data||{};C.value=Object.keys(e).map(m=>({label:`${m} (${e[m]})`,value:m}))})}function z(){R.value=!0,Oe().then(s=>{let e=s.data||[];e.sort(),D.value=e.map(m=>({name:m})),R.value=!1})}function oe(){Te({index:V.value}).then(s=>{s.data&&J()})}function J(){z(),d.$modal.msgSuccess("刷新键名列表成功")}function ne(s){Ue({key:s.name}).then(e=>{e.data&&e.data.value?(e.data.expire=e.data.expire==0?"永久":je(e.data.expire),u.value=e.data):u.value={}})}function se(){clearCacheAll().then(s=>{d.$modal.msgSuccess("清理全部缓存成功")})}return U(),(s,e)=>{const m=N("Collection"),f=Ce,k=Se,T=Ve,$=ke,v=Ie,de=N("Key"),y=Ee,ie=Me,re=De,ue=N("Document"),b=Re,H=ye,j=$e,pe=Ne,ce=be,me=Ke,q=Fe;return g(),K(G,null,[w("div",Ge,[t(H,{gutter:10},{default:l(()=>[t(v,{span:7},{default:l(()=>[t($,{style:{height:"calc(100vh - 125px)"}},{header:l(()=>[t(m,{style:{width:"1em",height:"1em","vertical-align":"middle"}}),r(),Ye,t(f,{style:{float:"right",padding:"3px 0","margin-left":"6px"},link:"",type:"primary",onClick:e[0]||(e[0]=o=>Z())},{default:l(()=>[r("刷新")]),_:1}),t(f,{style:{float:"right",padding:"3px 0","margin-left":"6px"},link:"",type:"primary",onClick:e[1]||(e[1]=o=>h.value=!0)},{default:l(()=>[r("添加")]),_:1}),B(w("span",{style:{float:"right","margin-right":"50px","font-size":"12px",padding:"5px 0"}}," 当前连接信息: 版本: "+x(n(_).version||"")+", 模式: "+x(n(_).mode||""),513),[[xe,n(_)&&n(_).version]])]),default:l(()=>[B((g(),E(T,{data:n(p),height:n(M),"highlight-current-row":"",style:{width:"100%"}},{default:l(()=>[t(k,{label:"序号",width:"60",type:"index"}),t(k,{label:"名称",align:"center",prop:"name","show-overflow-tooltip":!0},{default:l(({row:o})=>[r(x(o.host)+":"+x(o.port),1)]),_:1}),t(k,{label:"操作",width:"120",align:"center","class-name":"small-padding fixed-width"},{default:l(o=>[t(f,{link:"",type:"primary",onClick:fe=>le(o.row)},{default:l(()=>[r("连接")]),_:2},1032,["onClick"]),t(f,{link:"",type:"primary",onClick:fe=>ee(o.row)},{default:l(()=>[r("删除")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data","height"])),[[q,n(Q)]])]),_:1})]),_:1}),t(v,{span:7},{default:l(()=>[t($,{style:{height:"calc(100vh - 125px)"}},{header:l(()=>[t(de,{style:{width:"1em",height:"1em","vertical-align":"middle"}}),r(),w("span",Pe,"键名列表(共"+x(n(D).length)+"个)",1),t(f,{style:{float:"right",padding:"3px 0"},link:"",type:"primary",icon:"Refresh",onClick:e[2]||(e[2]=o=>J())},{default:l(()=>[r("刷新")]),_:1}),t(y,{style:{float:"right","margin-right":"10px",width:"170px"},size:"small",modelValue:n(S),"onUpdate:modelValue":e[3]||(e[3]=o=>F(S)?S.value=o:null),placeholder:"键名搜索, 回车确认"},null,8,["modelValue"]),t(re,{modelValue:n(V),"onUpdate:modelValue":e[4]||(e[4]=o=>F(V)?V.value=o:null),filterable:"",placeholder:"DB",size:"small",style:{float:"right","margin-right":"10px",width:"100px"},onChange:oe},{default:l(()=>[(g(!0),K(G,null,we(n(C),o=>(g(),E(ie,{key:o.value,label:"DB_"+o.label,value:o.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),default:l(()=>[B((g(),E(T,{data:n(X),height:n(M),"highlight-current-row":"",onRowClick:ne,style:{width:"100%"}},{default:l(()=>[t(k,{label:"序号",width:"60",type:"index"}),t(k,{label:"缓存键名",prop:"name",align:"center","show-overflow-tooltip":!0})]),_:1},8,["data","height"])),[[q,n(R)]])]),_:1})]),_:1}),t(v,{span:10},{default:l(()=>[t($,{bordered:!1,style:{height:"calc(100vh - 125px)"}},{header:l(()=>[t(ue,{style:{width:"1em",height:"1em","vertical-align":"middle"}}),r(),Qe,t(f,{style:{float:"right",padding:"3px 0",display:"none"},link:"",type:"primary",icon:"Refresh",onClick:e[5]||(e[5]=o=>se())},{default:l(()=>[r("清理全部")]),_:1})]),default:l(()=>[t(j,{model:n(u)},{default:l(()=>[t(H,{gutter:32},{default:l(()=>[t(v,{offset:1,span:22},{default:l(()=>[t(b,{label:"缓存键名:",prop:"key"},{default:l(()=>[t(y,{modelValue:n(u).key,"onUpdate:modelValue":e[6]||(e[6]=o=>n(u).key=o),readonly:""},null,8,["modelValue"])]),_:1})]),_:1}),t(v,{offset:1,span:22},{default:l(()=>[t(b,{label:"缓存时间:",prop:"expire"},{default:l(()=>[t(y,{modelValue:n(u).expire,"onUpdate:modelValue":e[7]||(e[7]=o=>n(u).expire=o),readonly:""},null,8,["modelValue"])]),_:1})]),_:1}),t(v,{offset:1,span:22},{default:l(()=>[t(b,{label:"缓存内容:",prop:"value"},{default:l(()=>[n(O)?(g(),K("div",We,x(n(O)),1)):(g(),E(y,{key:1,modelValue:n(u).value,"onUpdate:modelValue":e[8]||(e[8]=o=>n(u).value=o),type:"textarea",autosize:{minRows:8,maxRows:15},readonly:""},null,8,["modelValue"]))]),_:1})]),_:1})]),_:1})]),_:1},8,["model"])]),_:1})]),_:1})]),_:1})]),t(ce,{modelValue:n(h),"onUpdate:modelValue":e[13]||(e[13]=o=>F(h)?h.value=o:null),title:"添加主机",width:"500"},{footer:l(()=>[w("div",Xe,[t(f,{type:"primary",onClick:te},{default:l(()=>[r("保存")]),_:1}),t(f,{onClick:e[12]||(e[12]=o=>h.value=!1)},{default:l(()=>[r("取消")]),_:1})])]),default:l(()=>[t(j,{ref:"addFormRef",model:n(c),rules:n(W)},{default:l(()=>[t(b,{label:"主机Host",prop:"host"},{default:l(()=>[t(y,{modelValue:n(c).host,"onUpdate:modelValue":e[9]||(e[9]=o=>n(c).host=o),modelModifiers:{trim:!0},autocomplete:"off"},null,8,["modelValue"])]),_:1}),t(b,{label:"主机端口",prop:"port"},{default:l(()=>[t(pe,{modelValue:n(c).port,"onUpdate:modelValue":e[10]||(e[10]=o=>n(c).port=o),min:1,max:69999,"controls-position":"right"},null,8,["modelValue"])]),_:1}),t(b,{label:"主机密码",prop:"password"},{default:l(()=>[t(y,{modelValue:n(c).password,"onUpdate:modelValue":e[11]||(e[11]=o=>n(c).password=o),modelModifiers:{trim:!0},autocomplete:"off"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"]),t(me)],64)}}},lt=ge(Ze,[["__scopeId","data-v-e26243cc"]]);export{lt as default};