const menuBtn=document.querySelector('.menu-btn');
const navLinks=document.querySelector('.nav-links');
menuBtn?.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open))});
navLinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));


// V3.1 · Modo día / noche
const themeToggle=document.querySelector('#theme-toggle');
const themeIcon=document.querySelector('#theme-icon');
const themeLabel=document.querySelector('#theme-label');
const themeMeta=document.querySelector('meta[name="theme-color"]');
const themeKey='roma-rayito-theme-v31';
const themeOrder=['auto','day','night'];

function autoTheme(){
  const hour=new Date().getHours();
  return (hour>=18||hour<7)?'night':'day';
}
function applyTheme(pref,save=false){
  const applied=pref==='auto'?autoTheme():pref;
  document.documentElement.dataset.theme=applied;
  document.documentElement.dataset.themePref=pref;
  if(save){try{localStorage.setItem(themeKey,pref)}catch(e){}}
  if(themeIcon)themeIcon.textContent=pref==='day'?'☀️':pref==='night'?'🌙':(applied==='night'?'🌙':'☀️');
  if(themeLabel)themeLabel.textContent=pref==='auto'?'Auto':pref==='day'?'Día':'Noche';
  if(themeToggle){
    const desc=pref==='auto'?`Automático · ahora ${applied==='night'?'noche':'día'}`:`Tema ${pref==='night'?'noche':'día'}`;
    themeToggle.title=`${desc}. Pulsa para cambiar`;
    themeToggle.setAttribute('aria-label',`${desc}. Pulsa para cambiar`);
  }
  if(themeMeta)themeMeta.setAttribute('content',applied==='night'?'#191a17':'#f4efe7');
}
let themePref='auto';
try{themePref=localStorage.getItem(themeKey)||'auto'}catch(e){}
applyTheme(themePref);
themeToggle?.addEventListener('click',()=>{
  const idx=themeOrder.indexOf(themePref);
  themePref=themeOrder[(idx+1)%themeOrder.length];
  applyTheme(themePref,true);
});
setInterval(()=>{if(themePref==='auto')applyTheme('auto')},60000);


// Filtro del itinerario por día
const dayTabs=document.querySelectorAll('.day-tab');
const dayBlocks=document.querySelectorAll('.day-block');
dayTabs.forEach(tab=>tab.addEventListener('click',()=>{dayTabs.forEach(t=>t.classList.remove('active'));tab.classList.add('active');const day=tab.dataset.day;dayBlocks.forEach(block=>block.hidden=day!=='all'&&block.dataset.day!==day)}));

// Buscador y filtros de monumentos
const searchInput=document.querySelector('#place-search');
const chips=document.querySelectorAll('.chip');
const cards=[...document.querySelectorAll('.place-card')];
const noResults=document.querySelector('#no-results');
let activeFilter='all';
function normalize(str){return str.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function filterCards(){const q=normalize(searchInput?.value||'');let visible=0;cards.forEach(card=>{const haystack=normalize(card.textContent+' '+(card.dataset.tags||''));const tagOK=activeFilter==='all'||haystack.includes(normalize(activeFilter));const queryOK=!q||haystack.includes(q);card.hidden=!(tagOK&&queryOK);if(!card.hidden)visible++});if(noResults)noResults.hidden=visible!==0}
searchInput?.addEventListener('input',filterCards);
chips.forEach(chip=>chip.addEventListener('click',()=>{chips.forEach(c=>c.classList.remove('active'));chip.classList.add('active');activeFilter=chip.dataset.filter;filterCards()}));


// Filtro de restaurantes por zona
const foodTabs=document.querySelectorAll('.food-tab');
const foodCards=document.querySelectorAll('[data-food-card]');
foodTabs.forEach(tab=>tab.addEventListener('click',()=>{
  foodTabs.forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  const zone=tab.dataset.foodZone;
  foodCards.forEach(card=>card.hidden=zone!=='all'&&card.dataset.foodCard!==zone);
}));


// Checklist sentimental: se guarda solo en este navegador
const memoryInputs=document.querySelectorAll('[data-memory]');
const savedNote=document.querySelector('#saved-note');
const storageKey='roma-rayito-memories-v1';
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');memoryInputs.forEach(input=>input.checked=Boolean(saved[input.dataset.memory]))}catch(e){}
memoryInputs.forEach(input=>input.addEventListener('change',()=>{const data={};memoryInputs.forEach(i=>data[i.dataset.memory]=i.checked);try{localStorage.setItem(storageKey,JSON.stringify(data))}catch(e){}savedNote?.classList.add('show');setTimeout(()=>savedNote?.classList.remove('show'),1500)}));


// Diario privado + “Momento Rayito”: un único dato por día, guardado solo en este navegador.
const journalAreas=document.querySelectorAll('[data-journal]');
const rayitoInputs=document.querySelectorAll('[data-rayito]');
const rayitoDetails=document.querySelectorAll('[data-rayito-details]');
const journalKey='roma-rayito-journal-v1';
const journalStatus=document.querySelector('#journal-status');
let journalData={};

try{journalData=JSON.parse(localStorage.getItem(journalKey)||'{}')}catch(e){journalData={}}

function syncJournalFields(day,value,origin=null){
  journalAreas.forEach(area=>{if(area.dataset.journal===day&&area!==origin)area.value=value});
  rayitoInputs.forEach(input=>{if(input.dataset.rayito===day&&input!==origin)input.value=value});
}
['d10','d11','d12'].forEach(day=>syncJournalFields(day,journalData[day]||''));

let journalTimer;
function saveJournal(day,value,origin){
  journalData[day]=value;
  syncJournalFields(day,value,origin);
  clearTimeout(journalTimer);
  journalTimer=setTimeout(()=>{
    try{
      localStorage.setItem(journalKey,JSON.stringify(journalData));
      if(journalStatus){
        journalStatus.textContent='Guardado local ✓';
        setTimeout(()=>journalStatus.textContent='Guardado local automáticamente',1200);
      }
      const status=document.querySelector(`[data-rayito-status="${day}"]`);
      if(status){
        status.textContent='Guardado ✓';
        status.classList.add('saved');
        setTimeout(()=>{
          status.textContent='Se guarda solo en este dispositivo';
          status.classList.remove('saved');
        },1400);
      }
    }catch(e){
      if(journalStatus)journalStatus.textContent='No se ha podido guardar en este navegador';
    }
  },250);
}

journalAreas.forEach(area=>area.addEventListener('input',()=>saveJournal(area.dataset.journal,area.value,area)));
rayitoInputs.forEach(input=>input.addEventListener('input',()=>saveJournal(input.dataset.rayito,input.value,input)));

function updateRayitoPrompts(){
  const now=new Date();
  rayitoDetails.forEach(details=>{
    const reveal=new Date(details.dataset.reveal);
    const day=details.dataset.rayitoDetails;
    const hasText=Boolean((journalData[day]||'').trim());
    const ready=now>=reveal;
    details.classList.toggle('is-ready',ready);
    if(ready&&!hasText&&!details.dataset.autoOpened){
      details.open=true;
      details.dataset.autoOpened='1';
    }
  });
}
updateRayitoPrompts();
setInterval(updateRayitoPrompts,60000);

document.querySelector('#copy-memories')?.addEventListener('click',async e=>{
  const checked=[...memoryInputs].filter(i=>i.checked).map(i=>'• '+i.parentElement.innerText.trim());
  const labels={d10:'Sábado 10',d11:'Domingo 11',d12:'Lunes 12'};
  const notes=['d10','d11','d12'].map(day=>`${labels[day]}: ${(journalData[day]||'').trim()||'—'}`);
  const text=`ROMA CONTIGO, RAYITO ♡\n\nMomentos marcados:\n${checked.length?checked.join('\n'):'—'}\n\nNuestro diario:\n${notes.join('\n\n')}`;
  const btn=e.currentTarget;
  try{
    await navigator.clipboard.writeText(text);
    const old=btn.textContent;
    btn.textContent='Recuerdos copiados ✓';
    setTimeout(()=>btn.textContent=old,1600);
  }catch(err){}
});


// Navegación activa
const sections=['ahora','ruta','transporte','tiempo','lugares','comer','util','italiano','curiosidades','momentos'].map(id=>document.getElementById(id)).filter(Boolean);
const links=[...document.querySelectorAll('.nav-links a')];
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;links.forEach(link=>{link.style.color=link.getAttribute('href')==='#'+entry.target.id?'var(--terracotta)':''})})},{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>observer.observe(s));

// Google Maps: enlaces automáticos en el itinerario y en las fichas
const placeMap={
  'Museos Vaticanos':'Via Candia 131, Roma, Italy',
  'Basílica de San Pedro':'Basilica di San Pietro, Vatican City',
  'Via della Conciliazione + Castel Sant’Angelo':'Castel Sant Angelo, Roma, Italy',
  'Pincio + Piazza del Popolo':'Terrazza del Pincio, Roma, Italy',
  'Free tour nocturno':'Basilica di Santa Maria del Popolo, Roma, Italy',
  'San Pietro in Vincoli':'San Pietro in Vincoli, Roma, Italy',
  'Coliseo + Foro + Palatino':'Via dei Fori Imperiali 1, Roma, Italy',
  'Piazza Venezia + Vittoriano':'Piazza Venezia, Roma, Italy',
  'Campidoglio':'Piazza del Campidoglio, Roma, Italy',
  'Chiesa del Gesù':'Chiesa del Gesù, Roma, Italy',
  'Panteón':'Via del Pozzo delle Cornacchie 56, Roma, Italy',
  'Piazza Navona':'Piazza Navona, Roma, Italy',
  'Pompi · Piazza Navona':'Pompi Piazza Navona, Via di Tor Millina 33, Roma, Italy',
  'Campo de’ Fiori':'Campo de Fiori, Roma, Italy',
  'Ponte Sisto → Trastevere':'Ponte Sisto, Roma, Italy',
  'Da Tony · Trastevere':'La Tavernetta 29 da Tony e Andrea, Via della Pelliccia 29A, Roma, Italy',
  'Piazza Trilussa':'Piazza Trilussa, Roma, Italy',
  'Santa Maria in Trastevere':'Basilica di Santa Maria in Trastevere, Roma, Italy',
  'Cúpula de San Pedro':'Basilica di San Pietro, Vatican City',
  'Checkout + maletas':'Via Filippo Turati 52, Roma, Italy',
  'Santa Maria Maggiore':'Basilica di Santa Maria Maggiore, Roma, Italy',
  'Santa Maria della Vittoria':'Santa Maria della Vittoria, Roma, Italy',
  'Piazza della Repubblica':'Piazza della Repubblica, Roma, Italy',
  'Fontana di Trevi':'Fontana di Trevi, Roma, Italy',
  'Piazza di Spagna':'Piazza di Spagna, Roma, Italy',
  'Terravision → Fiumicino':'Via Giovanni Giolitti 38, Roma, Italy'
};
const cardMap={
  'Museos Vaticanos':'Musei Vaticani, Vatican City','Basílica y cúpula de San Pedro':'Basilica di San Pietro, Vatican City','Castel Sant’Angelo y su puente':'Castel Sant Angelo, Roma, Italy','Pincio':'Terrazza del Pincio, Roma, Italy','Piazza del Popolo':'Piazza del Popolo, Roma, Italy','San Pietro in Vincoli':'San Pietro in Vincoli, Roma, Italy','Coliseo':'Colosseo, Roma, Italy','Foro Romano':'Foro Romano, Roma, Italy','Palatino':'Palatino, Roma, Italy','Vittoriano':'Vittoriano, Roma, Italy','Campidoglio':'Piazza del Campidoglio, Roma, Italy','Chiesa del Gesù':'Chiesa del Gesù, Roma, Italy','Panteón':'Pantheon, Roma, Italy','Piazza Navona':'Piazza Navona, Roma, Italy','Campo de’ Fiori':'Campo de Fiori, Roma, Italy','Ponte Sisto':'Ponte Sisto, Roma, Italy','Piazza Trilussa':'Piazza Trilussa, Roma, Italy','Santa Maria in Trastevere':'Basilica di Santa Maria in Trastevere, Roma, Italy','Santa Maria Maggiore':'Basilica di Santa Maria Maggiore, Roma, Italy','Santa Maria della Vittoria':'Santa Maria della Vittoria, Roma, Italy','Piazza della Repubblica':'Piazza della Repubblica, Roma, Italy','Fontana di Trevi':'Fontana di Trevi, Roma, Italy','Piazza di Spagna':'Piazza di Spagna, Roma, Italy'
};
function mapsDir(destination){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(destination)+'&travelmode=walking'}
document.querySelectorAll('.day-block li').forEach(li=>{const strong=li.querySelector('strong');const dest=placeMap[strong?.textContent.trim()];if(!dest)return;const a=document.createElement('a');a.className='stop-map';a.target='_blank';a.rel='noopener';a.href=mapsDir(dest);a.textContent='Cómo llegar';strong.parentElement.appendChild(a)});
cards.forEach(card=>{const title=card.querySelector('h3')?.textContent.trim();const dest=cardMap[title];if(!dest)return;const a=document.createElement('a');a.className='place-map';a.target='_blank';a.rel='noopener';a.href=mapsDir(dest);a.textContent='Abrir en Google Maps';card.appendChild(a)});

// Botones copiar
const copyButtons=document.querySelectorAll('[data-copy]');
copyButtons.forEach(btn=>btn.addEventListener('click',async()=>{
  try{
    await navigator.clipboard.writeText(btn.dataset.copy);
    const old=btn.textContent;
    btn.textContent='Copiado ✓';
    btn.classList.add('copied');
    setTimeout(()=>{btn.textContent=old;btn.classList.remove('copied')},1300);
  }catch(e){
    btn.textContent=btn.dataset.copy;
  }
}));

// “Ahora toca”: antes del viaje muestra cuenta atrás; durante el viaje, la siguiente parada.
const schedule=[
  {at:'2026-10-10T00:55:00+02:00',lead:0,title:'Llegada a Fiumicino',text:'Taxi oficial o Uber Black directo al alojamiento.',dest:'Fiumicino Airport, Italy'},
  {at:'2026-10-10T09:35:00+02:00',lead:25,title:'Punto de encuentro del Vaticano',text:'Via Candia, 131 · la visita empieza a las 10:00.',dest:'Via Candia 131, Roma, Italy'},
  {at:'2026-10-10T14:00:00+02:00',lead:15,title:'Basílica de San Pedro',text:'Después del Vaticano: Piedad, baldaquino y la gran nave.',dest:'Basilica di San Pietro, Vatican City'},
  {at:'2026-10-10T15:45:00+02:00',lead:10,title:'Castel Sant’Angelo',text:'Paseo exterior por Via della Conciliazione y el puente.',dest:'Castel Sant Angelo, Roma, Italy'},
  {at:'2026-10-10T16:50:00+02:00',lead:20,title:'Pincio y Piazza del Popolo',text:'Atardecer y bajada al punto de encuentro del free tour.',dest:'Terrazza del Pincio, Roma, Italy'},
  {at:'2026-10-10T17:40:00+02:00',lead:15,title:'Free tour nocturno',text:'Nos acercamos a Santa Maria del Popolo. Empieza a las 18:00.',dest:'Basilica di Santa Maria del Popolo, Roma, Italy'},
  {at:'2026-10-11T10:00:00+02:00',lead:30,title:'San Pietro in Vincoli',text:'Primera parada: el Moisés de Miguel Ángel.',dest:'San Pietro in Vincoli, Roma, Italy'},
  {at:'2026-10-11T11:30:00+02:00',lead:20,title:'Punto de encuentro del Coliseo',text:'Via dei Fori Imperiali, 1 · la visita empieza a las 12:00.',dest:'Via dei Fori Imperiali 1, Roma, Italy'},
  {at:'2026-10-11T15:45:00+02:00',lead:10,title:'Piazza Venezia y Campidoglio',text:'Empieza el paseo a pie por el centro histórico.',dest:'Piazza Venezia, Roma, Italy'},
  {at:'2026-10-11T17:40:00+02:00',lead:20,title:'Punto de encuentro del Panteón',text:'Via del Pozzo delle Cornacchie, 56 · entrada a las 18:00.',dest:'Via del Pozzo delle Cornacchie 56, Roma, Italy'},
  {at:'2026-10-11T18:45:00+02:00',lead:5,title:'Piazza Navona',text:'Primera parada después del Panteón.',dest:'Piazza Navona, Roma, Italy'},
  {at:'2026-10-11T19:05:00+02:00',lead:5,title:'Tiramisú en Pompi',text:'Via di Tor Millina, 33 · parada corta antes de seguir hacia Campo de’ Fiori.',dest:'Pompi Piazza Navona, Via di Tor Millina 33, Roma, Italy'},
  {at:'2026-10-11T19:20:00+02:00',lead:5,title:'Campo de’ Fiori → Ponte Sisto',text:'Seguimos andando hacia Trastevere.',dest:'Campo de Fiori, Roma, Italy'},
  {at:'2026-10-11T19:50:00+02:00',lead:10,title:'Cena en Da Tony',text:'Via della Pelliccia, 29A. Si la cola amenaza las 21:00, priorizamos Trilussa.',dest:'La Tavernetta 29 da Tony e Andrea, Via della Pelliccia 29A, Roma, Italy'},
  {at:'2026-10-11T21:00:00+02:00',lead:10,title:'Piazza Trilussa',text:'Hora objetivo para sentarnos un rato y disfrutar del ambiente y los artistas callejeros.',dest:'Piazza Trilussa, Roma, Italy'},
  {at:'2026-10-11T21:45:00+02:00',lead:5,title:'Santa Maria in Trastevere',text:'Paseo final opcional por el corazón del barrio.',dest:'Basilica di Santa Maria in Trastevere, Roma, Italy'},
  {at:'2026-10-12T07:00:00+02:00',lead:20,title:'Cúpula de San Pedro',text:'Roma despertando desde arriba.',dest:'Basilica di San Pietro, Vatican City'},
  {at:'2026-10-12T10:00:00+02:00',lead:0,title:'Checkout y bus 64',text:'Salimos con las maletas hacia Cavalleggeri/S. Pietro para ir a Termini.',dest:'Cavalleggeri/S. Pietro, Roma, Italy'},
  {at:'2026-10-12T10:45:00+02:00',lead:10,title:'Locker reservado',text:'Stow Your Bags · Via Filippo Turati, 52. Reserva 10:45–15:45.',dest:'Via Filippo Turati 52, Roma, Italy'},
  {at:'2026-10-12T11:00:00+02:00',lead:5,title:'Santa Maria Maggiore',text:'Comienza nuestro último paseo por Roma.',dest:'Basilica di Santa Maria Maggiore, Roma, Italy'},
  {at:'2026-10-12T11:40:00+02:00',lead:10,title:'Santa Maria della Vittoria',text:'Bernini y el Éxtasis de Santa Teresa.',dest:'Santa Maria della Vittoria, Roma, Italy'},
  {at:'2026-10-12T12:30:00+02:00',lead:15,title:'Trevi y Piazza di Spagna',text:'Últimas postales y la moneda para volver.',dest:'Fontana di Trevi, Roma, Italy'},
  {at:'2026-10-12T14:10:00+02:00',lead:15,title:'Recoger maletas',text:'El locker está reservado hasta las 15:45, pero volvemos antes para salir con margen.',dest:'Via Filippo Turati 52, Roma, Italy'},
  {at:'2026-10-12T14:30:00+02:00',lead:10,title:'Terravision → Fiumicino',text:'Salida desde Via Giolitti. Objetivo: estar en FCO antes de las 16:10.',dest:'Via Giovanni Giolitti 38, Roma, Italy'},
  {at:'2026-10-12T16:10:00+02:00',lead:0,title:'Fiumicino',text:'Ya deberíamos estar en el aeropuerto. Vuelo a las 17:40.',dest:'Fiumicino Airport, Italy'}
].map(x=>({...x,date:new Date(x.at)}));
function formatCountdown(ms){
  const mins=Math.max(0,Math.round(ms/60000));
  if(mins<60)return `${mins} min`;
  if(mins<180)return `${Math.floor(mins/60)} h ${mins%60} min`;
  return `${Math.floor(mins/60)} h`;
}
function updateNow(){
  const title=document.querySelector('#now-title'),text=document.querySelector('#now-text'),map=document.querySelector('#now-map');
  if(!title||!text||!map)return;
  const now=new Date();
  const start=schedule[0].date;
  const end=new Date('2026-10-12T19:30:00+02:00');
  if(now<start){
    const days=Math.ceil((start-now)/86400000);
    title.textContent=days>1?`Faltan ${days} días para Roma`:'Mañana empieza Roma';
    text.textContent='Hasta entonces, podemos usar esta web para repasar la ruta y guardar nuestros lugares.';
    map.href='#ruta';map.removeAttribute('target');map.removeAttribute('rel');map.textContent='Ver itinerario';return;
  }
  if(now>end){
    title.textContent='Roma ya forma parte de nosotros ♡';
    text.textContent='La guía se queda aquí para recordar el primer viaje juntos… y para preparar la próxima vuelta.';
    map.href='#momentos';map.removeAttribute('target');map.removeAttribute('rel');map.textContent='Nuestros momentos';return;
  }
  let next=schedule.find(item=>item.date>now);
  if(!next)next=schedule[schedule.length-1];
  const leaveTime=new Date(next.date.getTime()-(next.lead||0)*60000);
  let timing='';
  if(next.lead&&now<leaveTime) timing=`Salir en ${formatCountdown(leaveTime-now)}`;
  else if(next.lead&&now<next.date) timing=`Ya conviene salir · faltan ${formatCountdown(next.date-now)}`;
  else timing=`Toca en ${formatCountdown(next.date-now)}`;
  title.textContent='Hoy, Roma con mi Rayito ☀️';
  text.textContent=`Próxima parada: ${next.title} · ${timing}. ${next.text}`;
  map.href=mapsDir(next.dest);map.target='_blank';map.rel='noopener';map.textContent='Cómo llegar';
}
updateNow();setInterval(updateNow,60000);

// Offline básico en GitHub Pages


// =========================================================
// V3.3 · Tiempo de Roma + histórico + recomendaciones de ropa
// Fuente: Open-Meteo. No usa geolocalización del usuario.
// =========================================================
const ROME_LAT=41.9028;
const ROME_LON=12.4964;
const TRIP_DATES=['2026-10-10','2026-10-11','2026-10-12'];
const LIVE_WEATHER_CACHE='roma-rayito-weather-live-v33';
const HISTORY_WEATHER_CACHE='roma-rayito-weather-history-v33';
const PACKING_CACHE='roma-rayito-packing-v33';

const forecastUrl=`https://api.open-meteo.com/v1/forecast?latitude=${ROME_LAT}&longitude=${ROME_LON}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=Europe%2FRome&forecast_days=16`;
const historyUrl=`https://archive-api.open-meteo.com/v1/archive?latitude=${ROME_LAT}&longitude=${ROME_LON}&start_date=2016-10-10&end_date=2025-10-12&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe%2FRome`;

const weatherState={live:null,history:null};

function weatherInfo(code){
  const c=Number(code);
  if(c===0)return {icon:'☀',label:'Despejado'};
  if(c===1)return {icon:'🌤',label:'Mayormente despejado'};
  if(c===2)return {icon:'⛅',label:'Parcialmente nublado'};
  if(c===3)return {icon:'☁',label:'Nublado'};
  if(c===45||c===48)return {icon:'〰',label:'Niebla'};
  if([51,53,55,56,57].includes(c))return {icon:'🌦',label:'Llovizna'};
  if([61,63,65,66,67].includes(c))return {icon:'🌧',label:'Lluvia'};
  if([71,73,75,77].includes(c))return {icon:'❄',label:'Nieve'};
  if([80,81,82].includes(c))return {icon:'🌦',label:'Chubascos'};
  if([85,86].includes(c))return {icon:'🌨',label:'Chubascos de nieve'};
  if([95,96,99].includes(c))return {icon:'⛈',label:'Tormenta'};
  return {icon:'◌',label:'Tiempo variable'};
}
function safeNum(v){return Number.isFinite(Number(v))?Number(v):null}
function tempText(v){const n=safeNum(v);return n===null?'--°':`${Math.round(n)}°`}
function oneDecimal(v){const n=safeNum(v);return n===null?'--':n.toFixed(1)}
function avg(arr){const x=arr.filter(v=>Number.isFinite(v));return x.length?x.reduce((a,b)=>a+b,0)/x.length:null}
function formatRomeTime(iso){
  if(!iso)return 'Actualizado recientemente';
  try{
    const d=new Date(iso);
    return `Actualizado ${new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short',timeZone:'Europe/Rome'}).format(d)}`;
  }catch(e){return 'Actualizado recientemente'}
}

function renderLiveWeather(data,fromCache=false){
  if(!data||!data.current)return;
  weatherState.live=data;
  const c=data.current;
  const info=weatherInfo(c.weather_code);
  const symbol=document.querySelector('#weather-symbol');
  const cond=document.querySelector('#weather-condition');
  const temp=document.querySelector('#weather-temp');
  const feels=document.querySelector('#weather-feels');
  const hum=document.querySelector('#weather-humidity');
  const wind=document.querySelector('#weather-wind');
  const rain=document.querySelector('#weather-rain');
  const updated=document.querySelector('#weather-updated');
  const status=document.querySelector('#weather-status');

  if(symbol)symbol.textContent=info.icon;
  if(cond)cond.textContent=info.label;
  if(temp)temp.textContent=tempText(c.temperature_2m);
  if(feels)feels.textContent=`Sensación ${tempText(c.apparent_temperature)}`;
  if(hum)hum.textContent=`${Math.round(safeNum(c.relative_humidity_2m)??0)}%`;
  if(wind)wind.textContent=`${Math.round(safeNum(c.wind_speed_10m)??0)} km/h`;
  if(rain)rain.textContent=`${oneDecimal(c.precipitation)} mm`;
  if(updated)updated.textContent=formatRomeTime(c.time);
  if(status)status.textContent=fromCache?'Mostrando el último dato guardado mientras actualizamos…':'Datos actualizados · Roma';
  renderTripForecast(data);
  renderPackingAdvice();
}

function renderTripForecast(data){
  const grid=document.querySelector('#trip-forecast-grid');
  const badge=document.querySelector('#forecast-badge');
  const explain=document.querySelector('#forecast-explain');
  if(!grid||!data?.daily?.time)return;

  const labels={'2026-10-10':'Sáb 10','2026-10-11':'Dom 11','2026-10-12':'Lun 12'};
  const cards=[];
  let available=0;
  const tripForecast=[];

  TRIP_DATES.forEach(date=>{
    const idx=data.daily.time.indexOf(date);
    if(idx<0){
      cards.push(`<div class="trip-day is-loading"><span>${labels[date]}</span><strong>—</strong><small>Aún fuera del horizonte de previsión</small></div>`);
      return;
    }
    available++;
    const code=data.daily.weather_code?.[idx];
    const info=weatherInfo(code);
    const max=safeNum(data.daily.temperature_2m_max?.[idx]);
    const min=safeNum(data.daily.temperature_2m_min?.[idx]);
    const pop=safeNum(data.daily.precipitation_probability_max?.[idx]);
    const rain=safeNum(data.daily.precipitation_sum?.[idx]);
    tripForecast.push({date,max,min,pop,rain,code});
    cards.push(`<div class="trip-day is-available"><span>${labels[date]}</span><span class="trip-weather-icon" aria-hidden="true">${info.icon}</span><div><strong>${tempText(max)} / ${tempText(min)}</strong><small>${info.label}${pop!==null?` · lluvia ${Math.round(pop)}%`:''}</small></div></div>`);
  });

  grid.innerHTML=cards.join('');
  weatherState.trip=tripForecast;
  if(badge){
    badge.classList.toggle('ready',available>0);
    badge.textContent=available===3?'Previsión disponible':available>0?`${available}/3 días disponibles`:'Aún es pronto';
  }
  if(explain){
    explain.textContent=available===3
      ?'Ya están disponibles los tres días. Conviene volver a mirar esta sección la víspera: la previsión seguirá afinándose.'
      :available>0
        ?'La previsión empieza a alcanzar nuestro viaje, pero todavía faltan días. Las tarjetas restantes aparecerán automáticamente.'
        :'Todavía no hay previsión meteorológica para el 10–12 de octubre. Mientras tanto, el histórico de abajo es la referencia más útil.';
  }
}

async function loadLiveWeather(force=false){
  const status=document.querySelector('#weather-status');
  try{
    const cached=JSON.parse(localStorage.getItem(LIVE_WEATHER_CACHE)||'null');
    if(cached?.data)renderLiveWeather(cached.data,true);
  }catch(e){}

  if(status&&force)status.textContent='Actualizando…';
  try{
    const res=await fetch(forecastUrl,{cache:'no-store'});
    if(!res.ok)throw new Error('weather');
    const data=await res.json();
    renderLiveWeather(data,false);
    try{localStorage.setItem(LIVE_WEATHER_CACHE,JSON.stringify({savedAt:Date.now(),data}))}catch(e){}
  }catch(e){
    if(status)status.textContent='No se ha podido actualizar. Si había datos guardados, se mantienen.';
  }
}

function computeHistory(raw){
  const d=raw?.daily;
  if(!d?.time)return null;
  const rows=[];
  d.time.forEach((date,i)=>{
    const md=date.slice(5);
    if(!['10-10','10-11','10-12'].includes(md))return;
    const max=safeNum(d.temperature_2m_max?.[i]);
    const min=safeNum(d.temperature_2m_min?.[i]);
    const rain=safeNum(d.precipitation_sum?.[i]);
    if(max===null||min===null)return;
    rows.push({date,md,max,min,rain:rain??0});
  });
  if(!rows.length)return null;

  const byDay={};
  ['10-10','10-11','10-12'].forEach(md=>{
    const r=rows.filter(x=>x.md===md);
    byDay[md]={max:avg(r.map(x=>x.max)),min:avg(r.map(x=>x.min)),rainy:r.filter(x=>x.rain>=1).length,count:r.length};
  });

  const warm=rows.reduce((a,b)=>b.max>a.max?b:a,rows[0]);
  const cold=rows.reduce((a,b)=>b.min<a.min?b:a,rows[0]);

  return {
    rows:rows.length,
    avgMax:avg(rows.map(x=>x.max)),
    avgMin:avg(rows.map(x=>x.min)),
    rainy:rows.filter(x=>x.rain>=1).length,
    warmest:warm,
    coldest:cold,
    byDay
  };
}

function renderHistory(summary,fromCache=false){
  if(!summary)return;
  weatherState.history=summary;
  const max=document.querySelector('#history-max');
  const min=document.querySelector('#history-min');
  const rainy=document.querySelector('#history-rainy');
  const extremes=document.querySelector('#history-extremes');
  const extremesNote=document.querySelector('#history-extremes-note');
  const days=document.querySelector('#history-days');
  const status=document.querySelector('#history-status');

  if(max)max.textContent=`${oneDecimal(summary.avgMax)}°`;
  if(min)min.textContent=`${oneDecimal(summary.avgMin)}°`;
  if(rainy)rainy.textContent=`${summary.rainy}/${summary.rows}`;
  if(extremes)extremes.textContent=`${Math.round(summary.warmest.max)}° / ${Math.round(summary.coldest.min)}°`;
  if(extremesNote)extremesNote.textContent=`más cálida ${summary.warmest.date.slice(0,4)} / más fría ${summary.coldest.date.slice(0,4)}`;

  if(days){
    const labels={'10-10':'10 OCT','10-11':'11 OCT','10-12':'12 OCT'};
    days.innerHTML=['10-10','10-11','10-12'].map(md=>{
      const s=summary.byDay[md];
      return `<article><span>${labels[md]}</span><strong>${oneDecimal(s.max)}° / ${oneDecimal(s.min)}°</strong><small>máx. / mín. media · lluvia ≥1 mm: ${s.rainy}/${s.count}</small></article>`;
    }).join('');
  }
  if(status)status.textContent=fromCache
    ?'Histórico cargado desde este dispositivo. Se actualizará de nuevo cuando haya conexión.'
    :'Histórico 2016–2025 calculado y guardado en este dispositivo.';
  renderPackingAdvice();
}

async function loadHistory(){
  try{
    const cached=JSON.parse(localStorage.getItem(HISTORY_WEATHER_CACHE)||'null');
    if(cached?.summary)renderHistory(cached.summary,true);
  }catch(e){}

  try{
    const res=await fetch(historyUrl);
    if(!res.ok)throw new Error('history');
    const raw=await res.json();
    const summary=computeHistory(raw);
    if(!summary)throw new Error('history-empty');
    renderHistory(summary,false);
    try{localStorage.setItem(HISTORY_WEATHER_CACHE,JSON.stringify({savedAt:Date.now(),summary}))}catch(e){}
  }catch(e){
    const status=document.querySelector('#history-status');
    if(status&&!weatherState.history)status.textContent='No se ha podido descargar el histórico. Vuelve a abrir esta sección cuando tengas conexión.';
  }
}

function renderPackingAdvice(){
  const title=document.querySelector('#packing-title');
  const text=document.querySelector('#packing-advice-text');
  if(!title||!text)return;

  const trip=weatherState.trip||[];
  const hist=weatherState.history;
  let maxT=null,minT=null,rainRisk=null,source='histórico';

  if(trip.length){
    const maxes=trip.map(x=>x.max).filter(Number.isFinite);
    const mins=trip.map(x=>x.min).filter(Number.isFinite);
    const pops=trip.map(x=>x.pop).filter(Number.isFinite);
    if(maxes.length)maxT=Math.max(...maxes);
    if(mins.length)minT=Math.min(...mins);
    if(pops.length)rainRisk=Math.max(...pops);
    source=trip.length===3?'previsión de los tres días':'previsión parcial + histórico';
  }
  if(maxT===null&&hist)maxT=hist.avgMax;
  if(minT===null&&hist)minT=hist.avgMin;
  if(rainRisk===null&&hist)rainRisk=(hist.rainy/hist.rows)*100;

  if(maxT===null||minT===null){
    title.textContent='Capas y calzado cómodo';
    text.textContent='La recomendación se ajustará automáticamente en cuanto cargue el histórico o la previsión del viaje.';
    return;
  }

  const parts=[];
  if(maxT>=24)parts.push('Durante las horas centrales puede sobrar la chaqueta: lleva partes de arriba ligeras');
  else if(maxT>=20)parts.push('El mediodía debería ser suave, así que funcionan bien camisetas o camisas ligeras');
  else parts.push('El día puede sentirse fresco: mejor manga larga fina o una capa ligera');

  if(minT<=12)parts.push('para primera hora y noche conviene una chaqueta algo más abrigada');
  else if(minT<=16)parts.push('para mañana y noche llevaría cárdigan, sudadera fina o chaqueta ligera');
  else parts.push('por la noche bastará normalmente una capa ligera');

  if(rainRisk>=40)parts.push('y metería sí o sí paraguas compacto o impermeable plegable');
  else if(rainRisk>=20)parts.push('y mantendría un paraguas compacto en la mochila por si aparece algún chubasco');
  else parts.push('la lluvia no parece el factor principal, aunque un impermeable fino ocupa poco');

  title.textContent=`Prepararía capas para ${Math.round(minT)}–${Math.round(maxT)} °C`;
  text.textContent=`Basado en ${source}: ${parts.join('; ')}. Para tantos kilómetros a pie, prioriza calzado cómodo antes que estrenar zapatos.`;
}

// Checklist de maleta
const packInputs=document.querySelectorAll('[data-pack]');
try{
  const savedPack=JSON.parse(localStorage.getItem(PACKING_CACHE)||'{}');
  packInputs.forEach(i=>i.checked=Boolean(savedPack[i.dataset.pack]));
}catch(e){}
packInputs.forEach(i=>i.addEventListener('change',()=>{
  const data={};
  packInputs.forEach(x=>data[x.dataset.pack]=x.checked);
  try{localStorage.setItem(PACKING_CACHE,JSON.stringify(data))}catch(e){}
}));

document.querySelector('#weather-refresh')?.addEventListener('click',()=>loadLiveWeather(true));

// Carga inicial y refresco suave cada 15 minutos.
loadLiveWeather(false);
loadHistory();
setInterval(()=>loadLiveWeather(false),15*60*1000);

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
