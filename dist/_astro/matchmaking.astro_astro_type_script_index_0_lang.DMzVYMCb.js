import{l as A}from"./storage-service.BvdIb4t6.js";import{c as $}from"./mmr-engine.BXMWZFkJ.js";function D(e,t){return $(e,t)}function k(e,t){if(e.length<2)throw new Error("At least 2 players are required for matchmaking.");return e.length===2?C(e,t):e.length===3?O(e,t):e.length===4?w(e,t):S(e,t)}function d(e,t){return t[e]??1e3}function f(e,t,n,s){const c=t.reduce((l,m)=>l+d(m,s),0)/t.length,o=n.reduce((l,m)=>l+d(m,s),0)/n.length,i=Math.abs(c-o),a=D(c,o),r=1-a;return{type:e,teamA:t,teamB:n,mmrDifference:i,teamAWinProbability:a,teamBWinProbability:r}}function C(e,t){return{matches:[f("singles",[e[0]],[e[1]],t)],sittingOut:[]}}function O(e,t){const n=[[0,1],[0,2],[1,2]];let s=n[0],c=1/0;for(const[a,r]of n){const l=Math.abs(d(e[a],t)-d(e[r],t));l<c&&(c=l,s=[a,r])}const o=[0,1,2].find(a=>a!==s[0]&&a!==s[1]);return{matches:[f("singles",[e[s[0]]],[e[s[1]]],t)],sittingOut:[e[o]]}}function w(e,t){const[n,s,c,o]=e,i=[[[n,s],[c,o]],[[n,c],[s,o]],[[n,o],[s,c]]];let a=null;for(const[r,l]of i){const m=f("doubles",r,l,t);(!a||m.mmrDifference<a.mmrDifference)&&(a=m)}return{matches:[a],sittingOut:[]}}function S(e,t){const n=[...e].sort((i,a)=>d(a,t)-d(i,t)),s=[];let c=n;if(c.length%2!==0){const i=Math.floor(c.length/2);s.push(c[i]),c=c.filter((a,r)=>r!==i)}const o=[];for(;c.length>=4;){const i=c.splice(0,4),a=T(i,t);o.push(a)}return c.length===2&&o.push(f("singles",[c[0]],[c[1]],t)),{matches:o,sittingOut:s}}function T(e,t){const[n,s,c,o]=e,i=[[[n,s],[c,o]],[[n,c],[s,o]],[[n,o],[s,c]]];let a=null;for(const[r,l]of i){const m=f("doubles",r,l,t);(!a||m.mmrDifference<a.mmrDifference)&&(a=m)}return a}const b=document.getElementById("player-checkboxes"),v=document.getElementById("no-players"),L=document.getElementById("selected-count"),E=document.getElementById("generate-btn"),h=document.getElementById("validation-error"),y=document.getElementById("results-section"),g=document.getElementById("sit-out-banner"),B=document.getElementById("match-cards");let u=[];function F(){if(u=A().players,u.length===0){v.hidden=!1;return}v.hidden=!0;for(const t of u){const n=document.createElement("label");n.className="player-checkbox";const s=t.profilePicture?`<img src="${t.profilePicture}" alt="" class="cb-thumb" loading="lazy" />`:'<div class="cb-thumb cb-placeholder">🏸</div>';n.innerHTML=`
        <input type="checkbox" value="${t.id}" class="player-cb" />
        ${s}
        <div class="cb-info">
          <span class="cb-name">${t.name}</span>
          <span class="cb-mmr">MMR ${t.mmr}</span>
        </div>
      `,b.appendChild(n)}b.querySelectorAll(".player-cb").forEach(t=>{t.addEventListener("change",N)})}function P(){const e=b.querySelectorAll(".player-cb:checked");return Array.from(e).map(t=>t.value)}function N(){const t=P().length;L.textContent=`${t} selected`,E.disabled=t<2,h.textContent=""}function p(e){return u.find(t=>t.id===e)?.name??"Unknown"}E.addEventListener("click",()=>{h.textContent="";const e=P();if(e.length<2){h.textContent="Please select at least 2 players.";return}const t={};for(const n of u)t[n.id]=n.mmr;try{const n=k(e,t);if(y.hidden=!1,B.innerHTML="",n.sittingOut.length>0){const s=n.sittingOut.map(p).join(", ");g.innerHTML=`<span class="sit-out-icon">🪑</span> Sitting out: <strong>${s}</strong>`,g.hidden=!1}else g.hidden=!0;n.matches.forEach((s,c)=>{const o=document.createElement("div");o.className="matchup-card";const i=s.type==="singles"?"Singles":"Doubles",a=s.teamA.map(p).join(" & "),r=s.teamB.map(p).join(" & "),l=(s.teamAWinProbability*100).toFixed(1),m=(s.teamBWinProbability*100).toFixed(1),x=s.mmrDifference.toFixed(0);o.innerHTML=`
          <div class="matchup-header">
            <span class="matchup-number">Match ${c+1}</span>
            <span class="matchup-mode">${i}</span>
          </div>
          <div class="matchup-teams">
            <div class="matchup-team">
              <span class="team-heading">Team A</span>
              <span class="team-names">${a}</span>
              <span class="win-prob">${l}%</span>
            </div>
            <span class="matchup-vs">vs</span>
            <div class="matchup-team">
              <span class="team-heading">Team B</span>
              <span class="team-names">${r}</span>
              <span class="win-prob">${m}%</span>
            </div>
          </div>
          <div class="matchup-footer">
            <span class="mmr-diff">MMR Difference: <strong>${x}</strong></span>
          </div>
        `,B.appendChild(o)}),y.scrollIntoView({behavior:"smooth",block:"start"})}catch(n){h.textContent=n.message||"An error occurred during matchmaking."}});F();
