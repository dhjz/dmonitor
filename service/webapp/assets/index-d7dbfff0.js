import{n as fe,g as ge,r as u,p as he,q as _e,s as j,a as D,o as g,c as N,e as S,b as t,w as l,u as n,v as K,F as q,E as ve,x as ye,d as i,y as A,z as k,t as I,h as be,A as we,l as xe,m as Ce,j as Se,k as Ve,B as ke,C as Ie,D as Ee,G as Re,H as $e,_ as De,I as Ne,J as Ke,K as Fe,L as Be}from"./index-862ebd4b.js";import{s as V}from"./request-b29e6e02.js";const Le=()=>V({url:"/redis/listKey",method:"get"}),Oe=a=>V({url:"/redis/getByKey",method:"get",params:a}),Me=a=>V({url:"/redis/initRedis",method:"get",params:a}),Ue=a=>V({url:"/redis/getRedisDbInfo",method:"get",params:a}),Je=a=>V({url:"/redis/changeRedisDb",method:"get",params:a});function Te(a){let d=localStorage.getItem(a);try{return JSON.parse(d)}catch{return d}}function G(a,d){(d||d===0)&&localStorage.setItem(a,JSON.stringify(d))}function ze(a){let d=Math.floor(a/3600)+"",b=Math.floor(a%3600/60)+"",p=Math.floor(a%60)+"";return d.toString().padStart(2,"0"),b.toString().padStart(2,"0"),p.toString().padStart(2,"0"),`${d.padStart(2,"0")}:${b.padStart(2,"0")}:${p.padStart(2,"0")}`}function He(a){return a&&Math.random().toString(32).slice(-8)+a.substr(a.length-1,1)+a+a.substr(a.length-1,1)+a.substr(0,1)+Math.random().toString(32).slice(-10)+"="}function je(a){return!a||a.length<15?a:a.substring(9,a.length-13)}const Y=a=>(Ke("data-v-e14ab83f"),a=a(),Fe(),a),qe={class:"app-container"},Ae=Y(()=>S("span",{style:{"vertical-align":"middle"}},"主机列表",-1)),Ge={style:{"vertical-align":"middle"}},Ye=Y(()=>S("span",{style:{"vertical-align":"middle"}},"缓存内容",-1)),Pe={key:0,class:"json-box"},Qe={class:"dialog-footer"},F="REDIS_LIST_KEY",We={__name:"index",setup(a){const{proxy:d}=ge(),b=u([]),p=u([]),E=u([]),r=u({}),P=u(!1),R=u(!1),h=u(!1);u("");const w=u(""),x=u(null),B=u(window.innerHeight-200),{addForm:c,rules:Q}=he(_e({addForm:{host:"",post:6379,password:""},rules:{host:[{required:!0,message:"主机host不能为空",trigger:"blur"}],port:[{required:!0,message:"主机端口不能为空",trigger:"blur"}]}})),W=j(()=>E.value.filter(s=>!w.value||s.name.toLowerCase().includes(w.value.toLowerCase()))),L=j(()=>{if(!r.value.value)return"";try{return JSON.stringify(JSON.parse(r.value.value),null,2)}catch{return""}});function O(){const s=Te(F);s&&s.length&&(p.value=s)}function X(){O(),d.$modal.msgSuccess("刷新缓存列表成功")}function Z(s){d.$modal.confirm('是否确认删除名称为"'+s.host+'"的数据项?').then(()=>{let e=p.value.findIndex(m=>m.id==s.id);console.log("del",e),e>=0&&p.value.splice(e,1),G(F,p.value)}).catch(()=>{})}function ee(){d.$refs.addFormRef.validate(s=>{s&&(p.value.push({...c.value,password:He(c.value.password),id:Math.random().toString(32).slice(-5)}),G(F,p.value),h.value=!1)})}function te(s){Me({...s,password:je(s.password)}).then(e=>{e.code==200?(e.data&&(x.value=e.data+""),le(),M()):d.$modal.msgSuccess("连接redis失败")})}function le(){Ue().then(s=>{let e=s.data||{};b.value=Object.keys(e).map(m=>({label:`${m} (${e[m]})`,value:m}))})}function M(){R.value=!0,Le().then(s=>{let e=s.data||[];e.sort(),E.value=e.map(m=>({name:m})),R.value=!1})}function ae(){Je({index:x.value}).then(s=>{s.data&&U()})}function U(){M(),d.$modal.msgSuccess("刷新键名列表成功")}function oe(s){Oe({key:s.name}).then(e=>{e.data&&e.data.value?(e.data.expire=e.data.expire==0?"永久":ze(e.data.expire),r.value=e.data):r.value={}})}function ne(){clearCacheAll().then(s=>{d.$modal.msgSuccess("清理全部缓存成功")})}return O(),(s,e)=>{const m=D("Collection"),f=we,C=xe,J=Ce,$=Se,_=Ve,se=D("Key"),v=ke,de=Be,ie=Ie,re=D("Document"),y=Ee,T=ve,z=Re,ue=$e,pe=ye,ce=De,H=Ne;return g(),N(q,null,[S("div",qe,[t(T,{gutter:10},{default:l(()=>[t(_,{span:7},{default:l(()=>[t($,{style:{height:"calc(100vh - 125px)"}},{header:l(()=>[t(m,{style:{width:"1em",height:"1em","vertical-align":"middle"}}),i(),Ae,t(f,{style:{float:"right",padding:"3px 0"},link:"",type:"primary",onClick:e[0]||(e[0]=o=>X())},{default:l(()=>[i("刷新")]),_:1}),t(f,{style:{float:"right",padding:"3px 0"},link:"",type:"primary",onClick:e[1]||(e[1]=o=>h.value=!0)},{default:l(()=>[i("添加")]),_:1})]),default:l(()=>[A((g(),k(J,{data:n(p),height:n(B),"highlight-current-row":"",style:{width:"100%"}},{default:l(()=>[t(C,{label:"序号",width:"60",type:"index"}),t(C,{label:"名称",align:"center",prop:"name","show-overflow-tooltip":!0},{default:l(({row:o})=>[i(I(o.host)+":"+I(o.port),1)]),_:1}),t(C,{label:"操作",width:"120",align:"center","class-name":"small-padding fixed-width"},{default:l(o=>[t(f,{link:"",type:"primary",onClick:me=>te(o.row)},{default:l(()=>[i("连接")]),_:2},1032,["onClick"]),t(f,{link:"",type:"primary",onClick:me=>Z(o.row)},{default:l(()=>[i("删除")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data","height"])),[[H,n(P)]])]),_:1})]),_:1}),t(_,{span:7},{default:l(()=>[t($,{style:{height:"calc(100vh - 125px)"}},{header:l(()=>[t(se,{style:{width:"1em",height:"1em","vertical-align":"middle"}}),i(),S("span",Ge,"键名列表(共"+I(n(E).length)+"个)",1),t(f,{style:{float:"right",padding:"3px 0"},link:"",type:"primary",icon:"Refresh",onClick:e[2]||(e[2]=o=>U())},{default:l(()=>[i("刷新")]),_:1}),t(v,{style:{float:"right","margin-right":"10px",width:"200px"},size:"small",modelValue:n(w),"onUpdate:modelValue":e[3]||(e[3]=o=>K(w)?w.value=o:null),placeholder:"键名搜索, 回车确认"},null,8,["modelValue"]),t(ie,{modelValue:n(x),"onUpdate:modelValue":e[4]||(e[4]=o=>K(x)?x.value=o:null),filterable:"",placeholder:"DB",size:"small",style:{float:"right","margin-right":"10px",width:"70px"},onChange:ae},{default:l(()=>[(g(!0),N(q,null,be(n(b),o=>(g(),k(de,{key:o.value,label:"DB_"+o.label,value:o.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),default:l(()=>[A((g(),k(J,{data:n(W),height:n(B),"highlight-current-row":"",onRowClick:oe,style:{width:"100%"}},{default:l(()=>[t(C,{label:"序号",width:"60",type:"index"}),t(C,{label:"缓存键名",prop:"name",align:"center","show-overflow-tooltip":!0})]),_:1},8,["data","height"])),[[H,n(R)]])]),_:1})]),_:1}),t(_,{span:10},{default:l(()=>[t($,{bordered:!1,style:{height:"calc(100vh - 125px)"}},{header:l(()=>[t(re,{style:{width:"1em",height:"1em","vertical-align":"middle"}}),i(),Ye,t(f,{style:{float:"right",padding:"3px 0",display:"none"},link:"",type:"primary",icon:"Refresh",onClick:e[5]||(e[5]=o=>ne())},{default:l(()=>[i("清理全部")]),_:1})]),default:l(()=>[t(z,{model:n(r)},{default:l(()=>[t(T,{gutter:32},{default:l(()=>[t(_,{offset:1,span:22},{default:l(()=>[t(y,{label:"缓存键名:",prop:"key"},{default:l(()=>[t(v,{modelValue:n(r).key,"onUpdate:modelValue":e[6]||(e[6]=o=>n(r).key=o),readonly:""},null,8,["modelValue"])]),_:1})]),_:1}),t(_,{offset:1,span:22},{default:l(()=>[t(y,{label:"缓存时间:",prop:"expire"},{default:l(()=>[t(v,{modelValue:n(r).expire,"onUpdate:modelValue":e[7]||(e[7]=o=>n(r).expire=o),readonly:""},null,8,["modelValue"])]),_:1})]),_:1}),t(_,{offset:1,span:22},{default:l(()=>[t(y,{label:"缓存内容:",prop:"value"},{default:l(()=>[n(L)?(g(),N("div",Pe,I(n(L)),1)):(g(),k(v,{key:1,modelValue:n(r).value,"onUpdate:modelValue":e[8]||(e[8]=o=>n(r).value=o),type:"textarea",autosize:{minRows:8,maxRows:15},readonly:""},null,8,["modelValue"]))]),_:1})]),_:1})]),_:1})]),_:1},8,["model"])]),_:1})]),_:1})]),_:1})]),t(pe,{modelValue:n(h),"onUpdate:modelValue":e[13]||(e[13]=o=>K(h)?h.value=o:null),title:"添加主机",width:"500"},{footer:l(()=>[S("div",Qe,[t(f,{type:"primary",onClick:ee},{default:l(()=>[i("保存")]),_:1}),t(f,{onClick:e[12]||(e[12]=o=>h.value=!1)},{default:l(()=>[i("取消")]),_:1})])]),default:l(()=>[t(z,{ref:"addFormRef",model:n(c),rules:n(Q)},{default:l(()=>[t(y,{label:"主机Host",prop:"host"},{default:l(()=>[t(v,{modelValue:n(c).host,"onUpdate:modelValue":e[9]||(e[9]=o=>n(c).host=o),modelModifiers:{trim:!0},autocomplete:"off"},null,8,["modelValue"])]),_:1}),t(y,{label:"主机端口",prop:"port"},{default:l(()=>[t(ue,{modelValue:n(c).port,"onUpdate:modelValue":e[10]||(e[10]=o=>n(c).port=o),min:1,max:69999,"controls-position":"right"},null,8,["modelValue"])]),_:1}),t(y,{label:"主机密码",prop:"password"},{default:l(()=>[t(v,{modelValue:n(c).password,"onUpdate:modelValue":e[11]||(e[11]=o=>n(c).password=o),modelModifiers:{trim:!0},autocomplete:"off"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"]),t(ce)],64)}}},et=fe(We,[["__scopeId","data-v-e14ab83f"]]);export{et as default};
