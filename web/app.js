(() => {
  'use strict';
  const config = window.PASSOLIVRE_CONFIG || {};
  const $ = id => document.getElementById(id);
  const state = {reports: [], search: '', category: '', order: 'recent', busy: false};
  const categories = ['Buraco','Degrau','Calçada obstruída','Rampa ausente','Piso irregular','Outro'];
  const escapeHTML = value => String(value == null ? '' : value).replace(/[&<>"']/g,ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const store = {
    get(key, fallback) {try{let v=localStorage.getItem(key);return v == null ? fallback : JSON.parse(v)}catch{return fallback}},
    set(key,value) {try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
  };
  let visitor = store.get('pl-web-visitor-2026', null);
  if (!visitor) {visitor='web-'+Date.now()+'-'+Math.random().toString(36).slice(2);store.set('pl-web-visitor-2026',visitor)}
  const ownSupports = new Set(store.get('pl-web-supported-2026',[]));
  function urlRoot() {return String(config.apiUrl||config.supabaseUrl||'').replace(/\/$/,'')}
  function headers(){const key=config.supabaseAnonKey||'';return {apikey:key,'Content-Type':'application/json',...(key&&!key.startsWith('sb_publishable_')?{Authorization:'Bearer '+key}:{})}}
  function showToast(message){const el=$('toast');el.textContent=message;el.hidden=false;setTimeout(()=>{el.hidden=true},4700)}
  function setConnection(online){const el=$('connection');el.textContent=online?'● Nuvem conectada':'! Sem conexão';el.classList.toggle('is-offline',!online)}
  async function fetchReports(){
    const url=config.apiUrl?urlRoot()+'/api/reports':urlRoot()+'/rest/v1/reports?select=id,title,category,description,address,neighborhood,status,supports_count,created_at&order=created_at.desc&limit=300';
    const response=await fetch(url,{headers:config.apiUrl?{}:headers(),cache:'no-store'});
    if(!response.ok)throw Error('Falha na consulta (HTTP '+response.status+').');
    const json=await response.json();return Array.isArray(json)?json:[];
  }
  async function load(){
    if(!urlRoot()){setConnection(false);showToast('Configure a URL do backend em web/config.js.');return}
    try{state.reports=await fetchReports();setConnection(true);render()}
    catch(e){setConnection(false);showToast('Não foi possível atualizar. '+e.message);render()}
  }
  function dataSorted(){
    const q=state.search.toLocaleLowerCase('pt-BR');
    const out=state.reports.filter(r=>(!state.category||r.category===state.category)&&[r.title,r.category,r.address,r.neighborhood,r.description].join(' ').toLocaleLowerCase('pt-BR').includes(q));
    out.sort((a,b)=>state.order==='supports'?(Number(b.supports_count)||0)-(Number(a.supports_count)||0):new Date(b.created_at||0)-new Date(a.created_at||0));
    return out;
  }
  function formatDate(text){const d=new Date(text);return Number.isFinite(d.getTime())?d.toLocaleDateString('pt-BR'):'Data indisponível'}
  function statusLabel(status){return {'recebido':'Recebido','em_acompanhamento':'Em acompanhamento','resolvido':'Resolvido'}[status]||'Recebido'}
  function renderStats(){
    $('stat-reports').textContent=state.reports.length;
    $('stat-supports').textContent=state.reports.reduce((n,r)=>n+(Number(r.supports_count)||0),0);
    $('stat-neighborhoods').textContent=new Set(state.reports.map(r=>String(r.neighborhood||'').toLocaleLowerCase('pt-BR')).filter(Boolean)).size;
  }
  function renderCharts(){
    const counts=new Map(categories.map(c=>[c,0]));
    for(const r of state.reports)counts.set(r.category,(counts.get(r.category)||0)+1);
    const max=Math.max(1,...counts.values());
    $('categories-chart').innerHTML=categories.map(c=>{
      const n=counts.get(c)||0;return '<div class="bar-row"><div class="bar-label"><span>'+escapeHTML(c)+'</span><strong>'+n+'</strong></div><div class="bar-track"><div class="bar-fill" role="img" aria-label="'+escapeHTML(c)+': '+n+' relatos" style="width:'+Math.round(n/max*100)+'%"></div></div></div>';
    }).join('');
  }
  function renderRecent(){
    const sorted=[...state.reports].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0));
    $('recent-list').innerHTML=sorted.slice(0,4).map(r=>'<div class="recent-item"><strong>'+escapeHTML(r.title)+'</strong><small>'+escapeHTML(r.neighborhood)+' · '+formatDate(r.created_at)+'</small></div>').join('')||'<p>Ainda não existem ocorrências cadastradas.</p>';
  }
  function renderReports(){
    const list=dataSorted();
    $('result-count').textContent=list.length+' '+(list.length===1?'relato encontrado':'relatos encontrados');
    $('report-list').innerHTML=list.map(r=>{
      const id=escapeHTML(r.id),supported=ownSupports.has(r.id);
      return '<article class="report-card"><div class="report-head"><span class="category-tag">'+escapeHTML(r.category)+'</span><time datetime="'+escapeHTML(r.created_at)+'">'+formatDate(r.created_at)+'</time></div><h3>'+escapeHTML(r.title)+'</h3><p>'+escapeHTML(r.description)+'</p><address>⌖ '+escapeHTML(r.neighborhood)+' · '+escapeHTML(r.address)+'</address><div class="report-actions"><span class="report-status">'+statusLabel(r.status)+'</span><button class="support-button" data-support="'+id+'" aria-label="Apoiar '+escapeHTML(r.title)+'" '+(supported?'disabled':'')+'>♡ '+(Number(r.supports_count)||0)+' '+(supported?'Apoiado':'Apoiar')+'</button></div></article>';
    }).join('')||'<p class="empty">Nenhum relato corresponde aos filtros selecionados.</p>';
  }
  function render(){renderStats();renderCharts();renderRecent();renderReports()}
  async function support(id){
    if(state.busy||ownSupports.has(id))return;state.busy=true;
    try{
      let response;
      if(config.apiUrl){response=await fetch(urlRoot()+'/api/supports',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({report_id:id,device_id:visitor})})}
      else{response=await fetch(urlRoot()+'/rest/v1/supports',{method:'POST',headers:{...headers(),Prefer:'return=minimal'},body:JSON.stringify({report_id:id,device_id:visitor})})}
      if(!response.ok){
        if(response.status===409){ownSupports.add(id);store.set('pl-web-supported-2026',[...ownSupports]);renderReports();showToast('Este dispositivo já apoiou a ocorrência.');return}
        throw Error('HTTP '+response.status);
      }
      ownSupports.add(id);store.set('pl-web-supported-2026',[...ownSupports]);showToast('Seu apoio foi registrado com sucesso.');await load();
    }catch(e){showToast('Não foi possível apoiar. '+e.message)}
    finally{state.busy=false}
  }
  function exportCSV(){
    const keys=[['id','ID'],['title','Título'],['category','Categoria'],['description','Descrição'],['address','Endereço'],['neighborhood','Bairro'],['status','Situação'],['supports_count','Apoios'],['created_at','Data']];
    const cell=value=>{let s=String(value==null?'':value);if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
    const csv=[keys.map(k=>cell(k[1])).join(';'),...dataSorted().map(r=>keys.map(k=>cell(r[k[0]])).join(';'))].join('\r\n');
    const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),href=window.URL.createObjectURL(blob),a=document.createElement('a');
    a.href=href;a.download='passolivre-relatos.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>window.URL.revokeObjectURL(href),1000);showToast('Arquivo CSV preparado.');
  }
  function route(){
    const p=location.hash.slice(1),page=['inicio','ocorrencias','sobre'].includes(p)?p:'inicio';
    document.querySelectorAll('[data-page]').forEach(el=>{el.hidden=el.dataset.page!==page});
    document.querySelectorAll('[data-nav]').forEach(el=>{const active=el.dataset.nav===page;el.classList.toggle('active',active);active?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current')});
    if(location.hash)window.scrollTo({top:0,behavior:'instant'});
  }
  $('filters').addEventListener('submit',e=>e.preventDefault());
  $('search').addEventListener('input',e=>{state.search=e.target.value;renderReports()});
  $('category').addEventListener('change',e=>{state.category=e.target.value;renderReports()});
  $('sorting').addEventListener('change',e=>{state.order=e.target.value;renderReports()});
  $('export').addEventListener('click',exportCSV);
  $('refresh').addEventListener('click',load);
  $('report-list').addEventListener('click',e=>{const button=e.target.closest('[data-support]');if(button)support(button.dataset.support)});
  window.addEventListener('hashchange',route);
  route();load();setInterval(()=>{if(!document.hidden)load()},25000);
})();
