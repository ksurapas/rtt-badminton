import{g as D,b as T,l as w,w as k}from"./utils.B-49ZCoC.js";import{c as C,p as I}from"./mmr-engine.D9ojGlUi.js";function L(e,t){return C(e,t)}function O(e,t){if(e.length<2)throw new Error("At least 2 players are required for matchmaking.");return e.length===2?W(e,t):e.length===3?F(e,t):e.length===4?H(e,t):N(e,t)}function h(e,t){return t[e]??1e3}function p(e,t,c,s){const a=t.reduce((l,d)=>l+h(d,s),0)/t.length,r=c.reduce((l,d)=>l+h(d,s),0)/c.length,i=Math.abs(a-r),n=L(a,r),o=1-n;return{type:e,teamA:t,teamB:c,mmrDifference:i,teamAWinProbability:n,teamBWinProbability:o}}function W(e,t){return{matches:[p("singles",[e[0]],[e[1]],t)],sittingOut:[]}}function F(e,t){const c=[[0,1],[0,2],[1,2]];let s=c[0],a=1/0;for(const[n,o]of c){const l=Math.abs(h(e[n],t)-h(e[o],t));l<a&&(a=l,s=[n,o])}const r=[0,1,2].find(n=>n!==s[0]&&n!==s[1]);return{matches:[p("singles",[e[s[0]]],[e[s[1]]],t)],sittingOut:[e[r]]}}function H(e,t){const[c,s,a,r]=e,i=[[[c,s],[a,r]],[[c,a],[s,r]],[[c,r],[s,a]]];let n=null;for(const[o,l]of i){const d=p("doubles",o,l,t);(!n||d.mmrDifference<n.mmrDifference)&&(n=d)}return{matches:[n],sittingOut:[]}}function N(e,t){const c=[...e].sort((i,n)=>h(n,t)-h(i,t)),s=[];let a=c;if(a.length%2!==0){const i=Math.floor(a.length/2);s.push(a[i]),a=a.filter((n,o)=>o!==i)}const r=[];for(;a.length>=4;){const i=a.splice(0,4),n=j(i,t);r.push(n)}return a.length===2&&r.push(p("singles",[a[0]],[a[1]],t)),{matches:r,sittingOut:s}}function j(e,t){const[c,s,a,r]=e,i=[[[c,s],[a,r]],[[c,a],[s,r]],[[c,r],[s,a]]];let n=null;for(const[o,l]of i){const d=p("doubles",o,l,t);(!n||d.mmrDifference<n.mmrDifference)&&(n=d)}return n}const E=document.getElementById("player-checkboxes"),x=document.getElementById("no-players"),q=document.getElementById("selected-count"),M=document.getElementById("generate-btn"),b=document.getElementById("validation-error"),$=document.getElementById("results-section"),y=document.getElementById("sit-out-banner"),B=document.getElementById("match-cards");let f=[];function R(){if(f=w().players,f.length===0){x.hidden=!1;return}x.hidden=!0;for(const t of f){const c=document.createElement("label");c.className="player-checkbox";const s=t.profilePicture?`<img src="${t.profilePicture}" alt="" class="cb-thumb" loading="lazy" />`:'<div class="cb-thumb cb-placeholder">🏸</div>';c.innerHTML=`
        <input type="checkbox" value="${t.id}" class="player-cb" />
        ${s}
        <div class="cb-info">
          <span class="cb-name">${t.name}</span>
          <span class="cb-mmr">MMR ${t.mmr}</span>
        </div>
      `,E.appendChild(c)}E.querySelectorAll(".player-cb").forEach(t=>{t.addEventListener("change",z)})}function S(){const e=E.querySelectorAll(".player-cb:checked");return Array.from(e).map(t=>t.value)}function z(){const t=S().length;q.textContent=`${t} selected`,M.disabled=t<2,b.textContent=""}function A(e){return f.find(t=>t.id===e)?.name??"Unknown"}const G=document.getElementById("num-courts");M.addEventListener("click",()=>{b.textContent="";const e=S(),t=Math.max(1,parseInt(G.value)||2);if(e.length<2){b.textContent="Please select at least 2 players.";return}const c={};for(const s of f)c[s.id]=s.mmr;try{const a=O(e,c).matches.slice(0,t),r=new Set;a.forEach(n=>{n.teamA.forEach(o=>r.add(o)),n.teamB.forEach(o=>r.add(o))});const i=e.filter(n=>!r.has(n));if($.hidden=!1,B.innerHTML="",i.length>0){const n=i.map(A).join(", ");y.innerHTML=`<span class="sit-out-icon">🪑</span> Sitting out: <strong>${n}</strong>`,y.hidden=!1}else y.hidden=!0;a.forEach((n,o)=>{const l=document.createElement("div");l.className="matchup-card",l.dataset.matchIndex=String(o);const d=n.type==="singles"?"Singles":"Doubles",v=n.teamA.map(A).join(" & "),u=n.teamB.map(A).join(" & "),m=(n.teamAWinProbability*100).toFixed(1),g=(n.teamBWinProbability*100).toFixed(1),P=n.mmrDifference.toFixed(0);l.innerHTML=`
          <div class="matchup-header">
            <span class="matchup-number">Match ${o+1}</span>
            <span class="matchup-mode">${d}</span>
          </div>
          <div class="matchup-teams">
            <div class="matchup-team">
              <span class="team-heading">Team A</span>
              <span class="team-names">${v}</span>
              <span class="win-prob">${m}%</span>
            </div>
            <span class="matchup-vs">vs</span>
            <div class="matchup-team">
              <span class="team-heading">Team B</span>
              <span class="team-names">${u}</span>
              <span class="win-prob">${g}%</span>
            </div>
          </div>
          <div class="matchup-footer">
            <span class="mmr-diff">MMR Difference: <strong>${P}</strong></span>
          </div>
          <div class="record-section" id="record-${o}">
            <p class="record-label">Who won?</p>
            <div class="record-buttons">
              <button type="button" class="btn-win btn-win-a" data-idx="${o}" data-winner="teamA">🏆 Team A</button>
              <button type="button" class="btn-win btn-win-b" data-idx="${o}" data-winner="teamB">🏆 Team B</button>
            </div>
          </div>
        `,B.appendChild(l)}),B.querySelectorAll(".btn-win").forEach(n=>{n.addEventListener("click",()=>{const o=parseInt(n.dataset.idx),l=n.dataset.winner,d=a[o];U(d,l,o)})}),$.scrollIntoView({behavior:"smooth",block:"start"})}catch(s){b.textContent=s.message||"An error occurred during matchmaking."}});function U(e,t,c){const s=w(),a={};for(const u of s.players)a[u.id]=u.mmr;const r={mode:e.type,teamA:e.teamA,teamB:e.teamB,winner:t},i=I(r,a);for(const u of i){const m=s.players.find(g=>g.id===u.playerId);m&&(m.mmr=u.newMMR,(t==="teamA"?r.teamA.includes(m.id):r.teamB.includes(m.id))?m.wins+=1:m.losses+=1)}const n={id:D(),date:new Date().toISOString(),mode:e.type,teamA:e.teamA,teamB:e.teamB,winner:t,mmrChanges:i};s.matches.push(n),T(s);const o=document.getElementById(`record-${c}`),l=t==="teamA"?"Team A":"Team B",d=i[0]?.delta??0,v=d>=0?`+${Math.round(d)}`:String(Math.round(d));o.innerHTML=`<p class="recorded-result">✅ Recorded — <strong>${l} wins</strong> (${v} MMR)</p>`,o.classList.add("recorded"),f=w().players}await k();R();
