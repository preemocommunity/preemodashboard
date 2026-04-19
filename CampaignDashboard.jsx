import React, { useState, useCallback } from "react";

const B = {
  navy:"#0A1628",blue:"#1E3A5F",midBlue:"#2B5C8A",lightBlue:"#4A90D9",
  skyBlue:"#E8F4FD",ice:"#F0F6FC",white:"#FFFFFF",
  border:"rgba(74,144,217,0.15)",shadow:"0 2px 12px rgba(10,22,40,0.06)",
  text:"#0D1B2A",textMuted:"#5A7080",textLight:"#8899AA",
  green:"#1B7A3D",greenBg:"#E6F4EA",amber:"#B86E00",amberBg:"#FFF3E0",red:"#C0392B",
};
const TT_C="#E84060",IG_C="#9B59B6",YT_C="#E84040";

const INITIAL_VIDEOS=[
  {num:1,title:"Mystery announcement — going to Ayook for the first time",date:"Mar 19",status:"live",tt:{views:3759,likes:null,comments:null,shares:53,followers:6,note:true},ig:{reach:null,likes:22,comments:null,saves:7},yt:{views:133,blocked:false}},
  {num:2,title:"Electric scooter rental that matches your shoes",date:"Apr 1",status:"live",tt:{views:784,likes:66,comments:12,shares:null,followers:null},ig:{reach:2700,likes:24,comments:6,saves:52},yt:{views:521,blocked:false}},
  {num:3,title:"Reactions riding an electric scooter for the first time",date:"Mar 29",status:"live",tt:{views:2887,likes:325,comments:56,shares:13,followers:6},ig:{reach:2000,likes:44,comments:17,saves:41},yt:{views:1832,blocked:false}},
  {num:4,title:"Simple morning — lizard and scooter",date:"Apr 2",status:"live",tt:{views:1037,likes:11,comments:6,shares:null,followers:null},ig:{reach:2200,likes:26,comments:6,saves:32},yt:{views:360,blocked:false}},
  {num:5,title:"Rice field — Have you tried riding electric before?",date:"Apr 10",status:"live",tt:{views:958,likes:141,comments:11,shares:6,followers:1},ig:{reach:923,likes:19,comments:5,saves:41},yt:{views:464,blocked:false}},
  {num:6,title:"Rice field — POV: full body sitting on scooter",date:"Apr 13",status:"live",tt:{views:2941,likes:29,comments:42,shares:38,followers:null},ig:{reach:1600,likes:35,comments:8,saves:43},yt:{views:1631,blocked:false}},
  {num:7,title:"Rice field — The new flex",date:"Apr 17",status:"live",tt:{views:4763,likes:29,comments:45,shares:19,followers:7},ig:{reach:1000,likes:33,comments:7,saves:53},yt:{views:1783,blocked:false}},
  {num:8,title:"Rice field — You think electric aren't fast?",date:"Apr 14",status:"live",tt:{views:885,likes:4,comments:65,shares:null,followers:null},ig:{reach:744,likes:22,comments:4,saves:11},yt:{views:467,blocked:false}},
  {num:9,title:"I bet you haven't\u2026 eating a donut",date:null,status:"not_yet",tt:null,ig:null,yt:null},
  {num:10,title:"Doughnut Boss trying the scooter — owner",date:"Apr 17",status:"live",tt:{views:456,likes:42,comments:19,shares:5,followers:2},ig:{reach:525,likes:14,comments:1,saves:42},yt:{views:4,blocked:false}},
  {num:11,title:"Doughnut Boss coming back from trying scooter",date:null,status:"not_yet",tt:null,ig:null,yt:null},
  {num:12,title:"You drove 20 min — realize how far you've come — POV",date:null,status:"no_analytics",tt:null,ig:null,yt:null},
  {num:13,title:"You put your GPS but took a different turn",date:"Apr 15",status:"live",tt:{views:1230,likes:116,comments:14,shares:5,followers:null},ig:{reach:717,likes:25,comments:5,saves:42},yt:{views:null,blocked:true}},
  {num:14,title:"Ayook — hook montage with girl",date:"Mar 27",status:"live",tt:{views:2650,likes:148,comments:13,shares:10,followers:2},ig:{reach:1100,likes:27,comments:3,saves:23},yt:{views:1174,blocked:false}},
  {num:15,title:"Dimas tutorial — Ayook employee storytelling",date:null,status:"no_data",tt:null,ig:null,yt:null},
  {num:16,title:"Collab mention 1 — on the balcony",date:null,status:"no_data",tt:null,ig:null,yt:null},
  {num:17,title:"Collab mention 2 — outside the guest house",date:null,status:"live",tt:null,ig:{reach:1000,likes:36,comments:5,saves:32},yt:{views:null,blocked:true}},
  {num:18,title:"In production — Samada",date:null,status:"production",tt:null,ig:null,yt:null},
  {num:19,title:"In production — Samada",date:null,status:"production",tt:null,ig:null,yt:null},
  {num:20,title:"In production — Samada",date:null,status:"production",tt:null,ig:null,yt:null},
];

const STATUS_CFG={
  live:{label:null,bg:B.greenBg,color:B.green},
  not_yet:{label:"Not Yet",bg:B.ice,color:B.textLight},
  no_analytics:{label:"No Analytics",bg:B.ice,color:B.textLight},
  no_data:{label:"No Data",bg:B.ice,color:B.textLight},
  production:{label:"In Production",bg:B.amberBg,color:B.amber},
};

function fmt(v){
  if(v===null||v===undefined)return null;
  if(v>=10000)return(v/1000).toFixed(0)+"K";
  if(v>=1000)return(v/1000).toFixed(1)+"K";
  return v.toLocaleString();
}

function calcTotals(videos){
  const s=(fn)=>videos.reduce((a,v)=>a+(fn(v)||0),0);
  return{
    TTv:s(v=>v.tt?.views),IGr:s(v=>v.ig?.reach),
    YTv:videos.reduce((a,v)=>(!v.yt?.blocked?a+(v.yt?.views||0):a),0),
    TTl:s(v=>v.tt?.likes),IGl:s(v=>v.ig?.likes),TTc:s(v=>v.tt?.comments),
    TTs:s(v=>v.tt?.shares),IGc:s(v=>v.ig?.comments),IGs:s(v=>v.ig?.saves),TTf:s(v=>v.tt?.followers),
  };
}

function EditCell({value,onSave,accent,bold,dim}){
  const[editing,setEditing]=useState(false);
  const[draft,setDraft]=useState("");
  if(dim)return<span style={{color:B.border,fontSize:12}}>—</span>;
  if(editing)return(
    <input autoFocus type="number" value={draft}
      onChange={e=>setDraft(e.target.value)}
      onBlur={()=>{setEditing(false);const n=parseInt(draft);onSave(isNaN(n)?null:n);}}
      onKeyDown={e=>{if(e.key==="Enter"){setEditing(false);const n=parseInt(draft);onSave(isNaN(n)?null:n);}if(e.key==="Escape")setEditing(false);}}
      style={{width:60,border:`1px solid ${B.lightBlue}`,borderRadius:5,padding:"2px 5px",fontSize:12,fontFamily:"'Montserrat',sans-serif",fontWeight:bold?700:400,color:accent||B.text,textAlign:"right",background:B.skyBlue,outline:"none"}}
    />
  );
  const d=fmt(value);
  return(
    <span title="Click to edit" onClick={()=>{setDraft(value===null||value===undefined?"":String(value));setEditing(true);}}
      style={{cursor:"text",fontSize:bold?13:12,fontWeight:bold?700:400,color:d===null?B.textLight:(accent||B.text),borderBottom:d!==null?`1px dashed ${B.border}`:"none",paddingBottom:1}}>
      {d===null?"—":d}
    </span>
  );
}

function Badge({label,bg,color}){
  return<span style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",padding:"2px 7px",borderRadius:6,background:bg,color,whiteSpace:"nowrap"}}>{label}</span>;
}

function KpiCard({label,value,sub,accent,dot}){
  return(
    <div style={{background:B.white,border:`1px solid ${B.border}`,borderRadius:12,padding:"16px 18px",boxShadow:B.shadow,flex:1,minWidth:120}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
        {dot&&<div style={{width:8,height:8,borderRadius:"50%",background:dot,flexShrink:0}}/>}
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight}}>{label}</div>
      </div>
      <div style={{fontSize:24,fontWeight:800,color:accent||B.text,letterSpacing:"-0.5px"}}>{fmt(value)||value}</div>
      {sub&&<div style={{fontSize:10,color:B.textLight,marginTop:3}}>{sub}</div>}
    </div>
  );
}

function TH({children,color,align="right",width}){
  return<th style={{padding:"10px 10px 8px",textAlign:align,fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color,whiteSpace:"nowrap",minWidth:width,borderBottom:`2px solid ${B.border}`,background:B.ice}}>{children}</th>;
}

export default function CampaignDashboard(){
  const[videos,setVideos]=useState(INITIAL_VIDEOS);
  const[hover,setHover]=useState(null);
  const[filter,setFilter]=useState("all");
  const[editMode,setEditMode]=useState(false);

  const update=useCallback((num,path,value)=>{
    setVideos(prev=>prev.map(v=>{
      if(v.num!==num)return v;
      const copy=JSON.parse(JSON.stringify(v));
      const keys=path.split(".");
      let obj=copy;
      for(let i=0;i<keys.length-1;i++){if(!obj[keys[i]])obj[keys[i]]={};obj=obj[keys[i]];}
      obj[keys[keys.length-1]]=value;
      return copy;
    }));
  },[]);

  const T=calcTotals(videos);
  const maxTT=Math.max(...videos.map(v=>v.tt?.views||0));
  const liveCount=videos.filter(v=>v.status==="live").length;
  const prodCount=videos.filter(v=>v.status==="production").length;
  const filtered=filter==="all"?videos:videos.filter(v=>v.status===filter);

  return(
    <div style={{fontFamily:"'Montserrat',sans-serif",background:B.ice,minHeight:"100vh",color:B.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}body{background:#F0F6FC;}tr.vrow:hover td{background:rgba(74,144,217,0.025)!important;}.pill{cursor:pointer;transition:all .15s;}.pill:hover{border-color:#4A90D9!important;}input[type=number]::-webkit-inner-spin-button{opacity:0;}`}</style>

      {/* HEADER */}
      <header style={{background:B.white,borderBottom:`1px solid ${B.border}`,padding:"13px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:8,background:B.navy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:B.lightBlue,fontWeight:900,flexShrink:0}}>📊</div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:B.text,letterSpacing:".5px"}}>CAMPAIGN DASHBOARD</div>
            <div style={{fontSize:9,color:B.textLight,letterSpacing:"1.5px",textTransform:"uppercase"}}>Ayook × Martin Dionne · 20 Videos · Mar–Apr 2026</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"5px 12px",borderRadius:20,background:B.greenBg,color:B.green,border:`1px solid rgba(27,122,61,0.2)`}}>{liveCount} Live</span>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"5px 12px",borderRadius:20,background:B.amberBg,color:B.amber,border:`1px solid rgba(184,110,0,0.2)`}}>{prodCount} In Production</span>
          <button onClick={()=>setEditMode(m=>!m)} style={{padding:"7px 14px",borderRadius:8,fontSize:11,fontWeight:700,fontFamily:"'Montserrat',sans-serif",cursor:"pointer",background:editMode?B.navy:B.white,color:editMode?"#fff":B.textMuted,border:`1px solid ${editMode?B.navy:B.border}`}}>
            {editMode?"✓ Editing On":"✎ Edit Numbers"}
          </button>
        </div>
      </header>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 24px 80px"}}>
        {editMode&&<div style={{background:"rgba(74,144,217,0.08)",border:`1px solid ${B.lightBlue}`,borderRadius:10,padding:"10px 16px",marginBottom:20,fontSize:12,color:B.midBlue,fontWeight:600}}>✎ Edit mode on — click any underlined number to update it. Press Enter or click away to save. Totals update automatically.</div>}

        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:6}}>Campaign Overview</div>
        <h1 style={{fontSize:28,fontWeight:800,color:B.navy,letterSpacing:"-0.5px",lineHeight:1.05,marginBottom:4}}>Ayook Electric Scooters</h1>
        <p style={{fontSize:13,color:B.textMuted,marginBottom:24}}>TikTok @martinddionne · Instagram @martinennoid · YouTube @PreemoClub</p>

        {/* KPIs */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:14}}>
          <KpiCard label="TikTok Views" value={T.TTv} sub="All published videos" accent={TT_C} dot={TT_C}/>
          <KpiCard label="IG Total Reach" value={T.IGr} sub="All published videos" accent={IG_C} dot={IG_C}/>
          <KpiCard label="YouTube Views" value={T.YTv} sub="Excl. copyright blocks" accent={YT_C} dot={YT_C}/>
          <KpiCard label="TT New Followers" value={T.TTf} sub="Gained during campaign" accent={B.lightBlue}/>
          <KpiCard label="Videos Delivered" value={`${liveCount}/20`} sub={`${prodCount} still in production`}/>
        </div>

        {/* Engagement */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:24}}>
          {[["TT Likes",T.TTl,TT_C],["TT Comments",T.TTc,TT_C],["TT Shares",T.TTs,TT_C],["IG Likes",T.IGl,IG_C],["IG Comments",T.IGc,IG_C],["IG Saves",T.IGs,IG_C]].map(([l,v,c])=>(
            <div key={l} style={{background:B.white,border:`1px solid ${B.border}`,borderRadius:10,padding:"12px 14px",boxShadow:B.shadow}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:c}}/>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight}}>{l}</div>
              </div>
              <div style={{fontSize:20,fontWeight:800,color:B.text}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div style={{background:B.white,border:`1px solid ${B.border}`,borderRadius:10,padding:"14px 18px",marginBottom:24,boxShadow:B.shadow}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight}}>Delivery Progress</div>
            <div style={{fontSize:12,fontWeight:700,color:B.lightBlue}}>{liveCount}/20 published · {Math.round(liveCount/20*100)}%</div>
          </div>
          <div style={{height:5,background:B.skyBlue,borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${Math.round(liveCount/20*100)}%`,background:`linear-gradient(90deg,${B.lightBlue},#6BB5FF)`,borderRadius:3}}/>
          </div>
        </div>

        {/* Full Video List */}
        <div style={{background:B.white,border:`1px solid ${B.border}`,borderRadius:12,padding:"18px 20px",marginBottom:20,boxShadow:B.shadow}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight,marginBottom:14}}>Full Video List — All 20 Deliverables</div>
          {INITIAL_VIDEOS.map(v=>{
            const s=STATUS_CFG[v.status];
            return(
              <div key={v.num} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"7px 0",borderBottom:`1px solid ${B.border}`}}>
                <div style={{width:28,flexShrink:0,fontSize:11,fontWeight:700,color:B.textLight,paddingTop:1}}>{String(v.num).padStart(2,"0")}</div>
                <div style={{flex:1,fontSize:13,fontWeight:v.status==="live"?600:400,color:v.status==="live"?B.text:B.textMuted,lineHeight:1.4}}>{v.title}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  {v.date&&<span style={{fontSize:10,color:B.textLight}}>{v.date}</span>}
                  {s.label?<Badge label={s.label} bg={s.bg} color={s.color}/>:<Badge label="Live" bg={B.greenBg} color={B.green}/>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          {[["all","All","(20)"],["live","Live",`(${liveCount})`],["production","In Production",`(${prodCount})`],["not_yet","Not Yet","(2)"],["no_data","No Data","(2)"],["no_analytics","No Analytics","(1)"]].map(([val,label,cnt])=>(
            <button key={val} className="pill" onClick={()=>setFilter(val)} style={{padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:600,fontFamily:"'Montserrat',sans-serif",cursor:"pointer",background:filter===val?B.navy:B.white,color:filter===val?"#fff":B.textMuted,border:`1px solid ${filter===val?B.navy:B.border}`}}>
              {label}<span style={{opacity:.55,fontSize:10}}> {cnt}</span>
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div style={{background:B.white,border:`1px solid ${B.border}`,borderRadius:14,boxShadow:B.shadow,overflow:"hidden"}}>
          <div style={{background:B.ice,borderBottom:`1px solid ${B.border}`,padding:"8px 18px",display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
            {[[TT_C,"TikTok @martinddionne"],[IG_C,"Instagram @martinennoid"],[YT_C,"YouTube @PreemoClub"]].map(([c,l])=>(
              <span key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:B.textMuted,fontWeight:600}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>{l}
              </span>
            ))}
            <span style={{marginLeft:"auto",fontSize:10,color:B.textLight}}>* partial · ✕ copyright blocked</span>
            {editMode&&<span style={{fontSize:10,color:B.lightBlue,fontWeight:700}}>✎ Click any underlined number to edit</span>}
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
              <thead>
                <tr>
                  <TH color={B.textLight} align="center" width={44}>#</TH>
                  <TH color={B.textLight} align="left" width={280}>Video</TH>
                  <TH color={TT_C}>Views</TH><TH color={TT_C}>Likes</TH><TH color={TT_C}>Cmts</TH><TH color={TT_C}>Shrs</TH><TH color={TT_C}>+Fol</TH>
                  <TH color={IG_C}>Reach</TH><TH color={IG_C}>Likes</TH><TH color={IG_C}>Cmts</TH><TH color={IG_C}>Saves</TH>
                  <TH color={YT_C}>YT Views</TH>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v=>{
                  const s=STATUS_CFG[v.status];
                  const dim=v.status!=="live";
                  const isTop=v.tt?.views===maxTT&&!dim;
                  const E=editMode&&!dim;
                  return(
                    <tr key={v.num} className="vrow" onMouseEnter={()=>setHover(v.num)} onMouseLeave={()=>setHover(null)} style={{background:hover===v.num?"rgba(74,144,217,0.025)":B.white}}>
                      <td style={{padding:"10px 6px",textAlign:"center",borderBottom:`1px solid ${B.border}`,fontSize:11,fontWeight:700,color:B.textLight}}>{String(v.num).padStart(2,"0")}</td>
                      <td style={{padding:"10px 12px",borderBottom:`1px solid ${B.border}`,maxWidth:280}}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:6,flexWrap:"wrap"}}>
                          {s.label&&<Badge label={s.label} bg={s.bg} color={s.color}/>}
                          {isTop&&<Badge label="Top" bg={B.skyBlue} color={B.lightBlue}/>}
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,fontWeight:dim?400:600,color:dim?B.textLight:B.text,lineHeight:1.4}}>{v.title}</div>
                            {v.date&&<div style={{fontSize:9,color:B.textLight,marginTop:2}}>{v.date}</div>}
                          </div>
                        </div>
                        {v.tt?.views&&!dim&&<div style={{marginTop:5,height:3,background:B.ice,borderRadius:2}}><div style={{height:"100%",width:`${Math.round((v.tt.views/maxTT)*100)}%`,background:isTop?B.lightBlue:"#B5D4F4",borderRadius:2}}/></div>}
                      </td>
                      {/* TT */}
                      <td style={{padding:"10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {v.tt?(E?<EditCell value={v.tt.views} bold accent={isTop?B.lightBlue:undefined} onSave={val=>update(v.num,"tt.views",val)}/>:<span style={{fontSize:13,fontWeight:700,color:isTop?B.lightBlue:B.text}}>{fmt(v.tt.views)}{v.tt.note&&<span style={{color:B.textLight,fontSize:9}}>*</span>}</span>):<span style={{color:B.border,fontSize:12}}>—</span>}
                      </td>
                      <td style={{padding:"10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {E?<EditCell value={v.tt?.likes} dim={!v.tt} onSave={val=>update(v.num,"tt.likes",val)}/>:<span style={{fontSize:12,color:dim?B.border:B.textMuted}}>{v.tt?fmt(v.tt.likes)||"—":"—"}</span>}
                      </td>
                      <td style={{padding:"10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {E?<EditCell value={v.tt?.comments} dim={!v.tt} onSave={val=>update(v.num,"tt.comments",val)}/>:<span style={{fontSize:12,color:dim?B.border:B.textMuted}}>{v.tt?fmt(v.tt.comments)||"—":"—"}</span>}
                      </td>
                      <td style={{padding:"10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {E?<EditCell value={v.tt?.shares} dim={!v.tt} onSave={val=>update(v.num,"tt.shares",val)}/>:<span style={{fontSize:12,color:dim?B.border:B.textMuted}}>{v.tt?fmt(v.tt.shares)||"—":"—"}</span>}
                      </td>
                      <td style={{padding:"10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {E?<EditCell value={v.tt?.followers} dim={!v.tt} accent={B.green} onSave={val=>update(v.num,"tt.followers",val)}/>:<span style={{fontSize:11,fontWeight:600,color:v.tt?.followers?B.green:B.border}}>{v.tt?.followers?`+${v.tt.followers}`:"—"}</span>}
                      </td>
                      {/* IG */}
                      <td style={{padding:"10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {E?<EditCell value={v.ig?.reach} bold dim={!v.ig} onSave={val=>update(v.num,"ig.reach",val)}/>:<span style={{fontSize:13,fontWeight:700,color:dim?B.textLight:B.text}}>{v.ig?fmt(v.ig.reach)||"—":"—"}</span>}
                      </td>
                      <td style={{padding:"10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {E?<EditCell value={v.ig?.likes} dim={!v.ig} onSave={val=>update(v.num,"ig.likes",val)}/>:<span style={{fontSize:12,color:dim?B.border:B.textMuted}}>{v.ig?fmt(v.ig.likes)||"—":"—"}</span>}
                      </td>
                      <td style={{padding:"10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {E?<EditCell value={v.ig?.comments} dim={!v.ig} onSave={val=>update(v.num,"ig.comments",val)}/>:<span style={{fontSize:12,color:dim?B.border:B.textMuted}}>{v.ig?fmt(v.ig.comments)||"—":"—"}</span>}
                      </td>
                      <td style={{padding:"10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {E?<EditCell value={v.ig?.saves} dim={!v.ig} onSave={val=>update(v.num,"ig.saves",val)}/>:<span style={{fontSize:12,color:dim?B.border:B.textMuted}}>{v.ig?fmt(v.ig.saves)||"—":"—"}</span>}
                      </td>
                      {/* YT */}
                      <td style={{padding:"10px 16px 10px 10px",textAlign:"right",borderBottom:`1px solid ${B.border}`}}>
                        {v.yt?(v.yt.blocked?<span style={{fontSize:10,color:B.red,fontWeight:600}}>✕ blocked</span>:(E?<EditCell value={v.yt.views} bold onSave={val=>update(v.num,"yt.views",val)}/>:<span style={{fontSize:12,fontWeight:700,color:dim?B.textLight:B.text}}>{fmt(v.yt.views)||"—"}</span>)):<span style={{color:B.border,fontSize:12}}>—</span>}
                      </td>
                    </tr>
                  );
                })}
                {filter==="all"&&(
                  <tr style={{borderTop:`2px solid ${B.border}`,background:B.ice}}>
                    <td colSpan={2} style={{padding:"12px 12px 12px 18px",fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight}}>Totals — Published Videos</td>
                    <td style={{padding:"12px 10px",textAlign:"right",fontSize:14,fontWeight:800,color:B.lightBlue}}>{fmt(T.TTv)}</td>
                    <td style={{padding:"12px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:B.text}}>{T.TTl}</td>
                    <td style={{padding:"12px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:B.text}}>{T.TTc}</td>
                    <td style={{padding:"12px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:B.text}}>{T.TTs}</td>
                    <td style={{padding:"12px 10px",textAlign:"right",fontSize:11,fontWeight:700,color:B.green}}>+{T.TTf}</td>
                    <td style={{padding:"12px 10px",textAlign:"right",fontSize:14,fontWeight:800,color:B.lightBlue}}>{fmt(T.IGr)}</td>
                    <td style={{padding:"12px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:B.text}}>{T.IGl}</td>
                    <td style={{padding:"12px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:B.text}}>{T.IGc}</td>
                    <td style={{padding:"12px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:B.text}}>{T.IGs}</td>
                    <td style={{padding:"12px 16px 12px 10px",textAlign:"right",fontSize:14,fontWeight:800,color:B.lightBlue}}>{fmt(T.YTv)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{padding:"12px 18px 16px",fontSize:10,color:B.textLight,lineHeight:1.8,borderTop:`1px solid ${B.border}`,background:B.ice}}>
            <span style={{fontWeight:700,color:B.textMuted}}>Notes — </span>
            V1 TikTok partial data · V10 YouTube just posted · V13 + V17 YouTube copyright blocked · V1 Instagram reach not captured · V15 + V16 no screenshots found in folder · V9, V11, V12 not yet filmed · V18–20 in production (Samada)
          </div>
        </div>
      </div>
      <div style={{textAlign:"center",padding:"20px",fontSize:10,color:B.textLight,letterSpacing:"1.5px",borderTop:`1px solid ${B.border}`,background:B.white}}>
        CAMPAIGN DASHBOARD · PRËMO INC. · CANGGU, BALI · 2026
      </div>
    </div>
  );
}
