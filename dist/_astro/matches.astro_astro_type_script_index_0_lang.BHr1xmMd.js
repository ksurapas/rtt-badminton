import{l as y,a as C}from"./storage-service.BvdIb4t6.js";import{p as D}from"./mmr-engine.BXMWZFkJ.js";import{g as T,f as P}from"./utils.CN_I0eQZ.js";const p=document.getElementById("match-form"),f=document.getElementById("form-error"),$=document.getElementById("matches-list"),E=document.getElementById("empty-state"),I=document.querySelectorAll(".mode-btn"),L=document.querySelectorAll(".doubles-only"),h=document.getElementById("team-a-p1"),A=document.getElementById("team-a-p2"),g=document.getElementById("team-b-p1"),w=document.getElementById("team-b-p2");let i="singles";function q(){return y().players}function S(){const e=q(),n=[h,A,g,w];for(const t of n){const a=t.value;t.innerHTML='<option value="">— Select player —</option>';for(const o of e){const c=document.createElement("option");c.value=o.id,c.textContent=o.name,t.appendChild(c)}a&&e.some(o=>o.id===a)&&(t.value=a)}}function M(e){i=e,I.forEach(n=>{n.classList.toggle("active",n.dataset.mode===e)}),L.forEach(n=>{n.hidden=e==="singles"}),f.textContent=""}function x(){const e=p.querySelector('input[name="winner"]:checked');return e?e.value:null}function k(e,n,t){const a=i==="singles"?1:2;if(e.some(l=>!l)||e.length!==a)return`Please select ${a} player${a>1?"s":""} for Team A.`;if(n.some(l=>!l)||n.length!==a)return`Please select ${a} player${a>1?"s":""} for Team B.`;if(i==="doubles"){if(e[0]===e[1])return"Team A has duplicate players.";if(n[0]===n[1])return"Team B has duplicate players."}const o=[...e,...n];return new Set(o).size!==o.length?"A player cannot be on both sides.":t?null:"Please select a winner."}function B(e,n){return n.find(t=>t.id===e)?.name??"Unknown"}function b(){const e=y(),n=[...e.matches].sort((t,a)=>new Date(a.date).getTime()-new Date(t.date).getTime());if($.querySelectorAll(".match-card").forEach(t=>t.remove()),n.length===0){E.hidden=!1;return}E.hidden=!0;for(const t of n){const a=document.createElement("div");a.className="match-card";const o=t.teamA.map(s=>B(s,e.players)).join(" & "),c=t.teamB.map(s=>B(s,e.players)).join(" & "),l=t.mmrChanges.find(s=>t.teamA.includes(s.playerId))?.delta??0,m=t.mmrChanges.find(s=>t.teamB.includes(s.playerId))?.delta??0,r=t.winner==="teamA",u=t.mode==="singles"?"Singles":"Doubles";a.innerHTML=`
        <div class="match-meta">
          <span class="match-date">${P(t.date)}</span>
          <span class="match-mode">${u}</span>
        </div>
        <div class="match-teams">
          <div class="team ${r?"winner":"loser"}">
            <span class="team-label">Team A ${r?"🏆":""}</span>
            <span class="team-players">${o}</span>
            <span class="mmr-delta ${l>=0?"positive":"negative"}">${l>=0?"+":""}${Math.round(l)}</span>
          </div>
          <span class="vs">vs</span>
          <div class="team ${r?"loser":"winner"}">
            <span class="team-label">Team B ${r?"":"🏆"}</span>
            <span class="team-players">${c}</span>
            <span class="mmr-delta ${m>=0?"positive":"negative"}">${m>=0?"+":""}${Math.round(m)}</span>
          </div>
        </div>
      `,$.appendChild(a)}}I.forEach(e=>{e.addEventListener("click",()=>{M(e.dataset.mode)})});p.addEventListener("submit",e=>{e.preventDefault(),f.textContent="";const n=i==="singles"?[h.value]:[h.value,A.value],t=i==="singles"?[g.value]:[g.value,w.value],a=x(),o=k(n,t,a);if(o){f.textContent=o;return}const c={teamA:n,teamB:t,winner:a},l=y(),m={};for(const s of l.players)m[s.id]=s.mmr;const r=D(c,m);for(const s of r){const d=l.players.find(v=>v.id===s.playerId);d&&(d.mmr=s.newMMR,(a==="teamA"?c.teamA.includes(d.id):c.teamB.includes(d.id))?d.wins+=1:d.losses+=1)}const u={id:T(),date:new Date().toISOString(),mode:i,teamA:n,teamB:t,winner:a,mmrChanges:r};l.matches.push(u),C(l),p.reset(),M("singles"),S(),b()});S();b();
