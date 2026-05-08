import{g as A,b as B,w as T,l as f,D,f as N}from"./utils.B-49ZCoC.js";import{s as w,g as H}from"./ranking.CIrkyrE9.js";const y=document.getElementById("ranking-container"),b=document.getElementById("empty-state");function I(n,l){const a=H(n,l);if(a.length===0)return null;const s=a[0],o=s.winner==="teamA"?s.teamA.includes(n):s.teamB.includes(n);let e=1;for(let t=1;t<a.length;t++){const c=a[t];if((c.winner==="teamA"?c.teamA.includes(n):c.teamB.includes(n))!==o)break;e++}return{type:o?"win":"loss",count:e}}function $(){y.querySelector(".ranking-table")?.remove();const{players:n,matches:l}=f(),a=w(n);if(a.length===0){b.hidden=!1;return}b.hidden=!0;const s=document.createElement("table");s.className="ranking-table",s.setAttribute("role","table"),s.innerHTML=`
      <thead>
        <tr>
          <th class="col-rank">#</th>
          <th class="col-player">Player</th>
          <th class="col-mmr">MMR</th>
          <th class="col-wins">W</th>
          <th class="col-losses">L</th>
        </tr>
      </thead>
    `;const o=document.createElement("tbody");a.forEach((e,t)=>{const c=t+1,r=document.createElement("tr");c===1?r.classList.add("rank-gold"):c===2?r.classList.add("rank-silver"):c===3&&r.classList.add("rank-bronze");const S=e.profilePicture??D,d=I(e.id,l);let g="";if(d&&d.count>=2){const M=d.type==="win"?"streak-win":"streak-loss",v=d.type==="win"?"🔥":"❄️",C=d.type==="win"?"W":"L";g=`<span class="streak-badge ${M}">${v} ${C}${d.count}</span>`}const p=document.createElement("td");p.className="col-player";const m=document.createElement("div");m.className="player-info";const i=document.createElement("img");i.src=S,i.alt=e.name,i.className="player-thumb",i.loading="lazy";const h=document.createElement("div");h.className="player-name-cell",h.innerHTML=`<span class="player-name">${e.name}</span>${g}`,m.appendChild(i),m.appendChild(h),p.appendChild(m),r.innerHTML=`
        <td class="col-rank"><span class="rank-number">${c}</span></td>
        <td class="col-mmr"><span class="mmr-value">${e.mmr}</span></td>
        <td class="col-wins">${e.wins}</td>
        <td class="col-losses">${e.losses}</td>
      `,r.insertBefore(p,r.children[1]),o.appendChild(r)}),s.appendChild(o),y.appendChild(s)}const R=document.getElementById("current-season-label"),u=document.getElementById("reset-season-btn"),E=document.getElementById("past-seasons-section"),k=document.getElementById("past-seasons-list");function L(){const{seasons:n}=f();if(R.textContent=`Season ${n.length+1} · In Progress`,k.innerHTML="",n.length===0){E.hidden=!0;return}E.hidden=!1,[...n].sort((a,s)=>new Date(s.endedAt).getTime()-new Date(a.endedAt).getTime()).forEach(a=>{const s=document.createElement("div");s.className="season-card";const o=document.createElement("button");o.type="button",o.className="season-card-header",o.innerHTML=`
        <span class="season-card-name">${a.name}</span>
        <span class="season-card-date">${N(a.endedAt)}</span>
        <span class="season-chevron">▾</span>
      `;const e=document.createElement("div");e.className="season-card-body",e.hidden=!0,a.leaderboard.forEach(t=>{const c=document.createElement("div");c.className="season-entry";const r=t.rank===1?"🥇":t.rank===2?"🥈":t.rank===3?"🥉":`#${t.rank}`;c.innerHTML=`
          <span class="season-entry-rank">${r}</span>
          <span class="season-entry-name">${t.name}</span>
          <span class="season-entry-mmr">${t.mmr} MMR</span>
          <span class="season-entry-record">${t.wins}W / ${t.losses}L</span>
        `,e.appendChild(c)}),o.addEventListener("click",()=>{e.hidden=!e.hidden,o.querySelector(".season-chevron").textContent=e.hidden?"▾":"▴"}),s.appendChild(o),s.appendChild(e),k.appendChild(s)})}u.addEventListener("click",async()=>{const n=f(),l=n.seasons.length+1,a=w(n.players);if(!confirm(`End Season ${l} and reset all MMR to 1000?

This will:
• Save the current leaderboard as "Season ${l}"
• Reset every player's MMR to 1000 and W/L to 0/0

This cannot be undone.`))return;u.disabled=!0;const o={id:A(),name:`Season ${l}`,endedAt:new Date().toISOString(),leaderboard:a.map((e,t)=>({rank:t+1,playerId:e.id,name:e.name,mmr:e.mmr,wins:e.wins,losses:e.losses}))};n.seasons=[...n.seasons,o],n.players=n.players.map(e=>({...e,mmr:1e3,wins:0,losses:0})),await B(n),u.disabled=!1,$(),L()});await T();$();L();
