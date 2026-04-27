import{l as i}from"./storage-service.BvdIb4t6.js";import{s as m}from"./ranking.CIrkyrE9.js";import{D as h}from"./utils.CN_I0eQZ.js";const p=document.getElementById("ranking-container"),c=document.getElementById("empty-state");function u(){const{players:r}=i(),n=m(r);if(n.length===0){c.hidden=!1;return}c.hidden=!0;const t=document.createElement("table");t.className="ranking-table",t.setAttribute("role","table"),t.innerHTML=`
      <thead>
        <tr>
          <th class="col-rank">#</th>
          <th class="col-player">Player</th>
          <th class="col-mmr">MMR</th>
          <th class="col-wins">W</th>
          <th class="col-losses">L</th>
        </tr>
      </thead>
    `;const l=document.createElement("tbody");n.forEach((s,o)=>{const e=o+1,a=document.createElement("tr");e===1?a.classList.add("rank-gold"):e===2?a.classList.add("rank-silver"):e===3&&a.classList.add("rank-bronze");const d=s.profilePicture??h;a.innerHTML=`
        <td class="col-rank">
          <span class="rank-number">${e}</span>
        </td>
        <td class="col-player">
          <div class="player-info">
            <img src="${d}" alt="${s.name}" class="player-thumb" loading="lazy" />
            <span class="player-name">${s.name}</span>
          </div>
        </td>
        <td class="col-mmr"><span class="mmr-value">${s.mmr}</span></td>
        <td class="col-wins">${s.wins}</td>
        <td class="col-losses">${s.losses}</td>
      `,l.appendChild(a)}),t.appendChild(l),p.appendChild(t)}u();
