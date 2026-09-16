const menuBtn=document.querySelector('.menu-btn');
const navLinks=document.querySelector('.nav-links');
menuBtn?.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open))});
navLinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));

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

// Checklist sentimental: se guarda solo en este navegador
const memoryInputs=document.querySelectorAll('[data-memory]');
const savedNote=document.querySelector('#saved-note');
const storageKey='roma-rayito-memories-v1';
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');memoryInputs.forEach(input=>input.checked=Boolean(saved[input.dataset.memory]))}catch(e){}
memoryInputs.forEach(input=>input.addEventListener('change',()=>{const data={};memoryInputs.forEach(i=>data[i.dataset.memory]=i.checked);try{localStorage.setItem(storageKey,JSON.stringify(data))}catch(e){}savedNote?.classList.add('show');setTimeout(()=>savedNote?.classList.remove('show'),1500)}));

// Navegación activa
const sections=['ahora','ruta','lugares','util','curiosidades','momentos'].map(id=>document.getElementById(id)).filter(Boolean);
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
  'Campo de’ Fiori':'Campo de Fiori, Roma, Italy',
  'Ponte Sisto → Trastevere':'Ponte Sisto, Roma, Italy',
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
  'Museos Vaticanos':'Musei Vaticani, Vatican City','Basílica y cúpula de San Pedro':'Basilica di San Pietro, Vatican City','Castel Sant’Angelo y su puente':'Castel Sant Angelo, Roma, Italy','Pincio':'Terrazza del Pincio, Roma, Italy','Piazza del Popolo':'Piazza del Popolo, Roma, Italy','San Pietro in Vincoli':'San Pietro in Vincoli, Roma, Italy','Coliseo':'Colosseo, Roma, Italy','Foro Romano':'Foro Romano, Roma, Italy','Palatino':'Palatino, Roma, Italy','Vittoriano':'Vittoriano, Roma, Italy','Campidoglio':'Piazza del Campidoglio, Roma, Italy','Chiesa del Gesù':'Chiesa del Gesù, Roma, Italy','Panteón':'Pantheon, Roma, Italy','Piazza Navona':'Piazza Navona, Roma, Italy','Campo de’ Fiori':'Campo de Fiori, Roma, Italy','Ponte Sisto':'Ponte Sisto, Roma, Italy','Santa Maria in Trastevere':'Basilica di Santa Maria in Trastevere, Roma, Italy','Santa Maria Maggiore':'Basilica di Santa Maria Maggiore, Roma, Italy','Santa Maria della Vittoria':'Santa Maria della Vittoria, Roma, Italy','Piazza della Repubblica':'Piazza della Repubblica, Roma, Italy','Fontana di Trevi':'Fontana di Trevi, Roma, Italy','Piazza di Spagna':'Piazza di Spagna, Roma, Italy'
};
function mapsDir(destination){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(destination)+'&travelmode=walking'}
document.querySelectorAll('.day-block li').forEach(li=>{const strong=li.querySelector('strong');const dest=placeMap[strong?.textContent.trim()];if(!dest)return;const a=document.createElement('a');a.className='stop-map';a.target='_blank';a.rel='noopener';a.href=mapsDir(dest);a.textContent='Cómo llegar';strong.parentElement.appendChild(a)});
cards.forEach(card=>{const title=card.querySelector('h3')?.textContent.trim();const dest=cardMap[title];if(!dest)return;const a=document.createElement('a');a.className='place-map';a.target='_blank';a.rel='noopener';a.href=mapsDir(dest);a.textContent='Abrir en Google Maps';card.appendChild(a)});

// Botones copiar
const copyButtons=document.querySelectorAll('[data-copy]');
copyButtons.forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);const old=btn.textContent;btn.textContent='Copiado ✓';btn.classList.add('copied');setTimeout(()=>{btn.textContent=old;btn.classList.remove('copied')},1300)}catch(e){btn.textContent=btn.dataset.copy}}));

// “Ahora toca”: antes del viaje muestra cuenta atrás; durante el viaje, la siguiente parada.
const schedule=[
  {at:'2026-10-10T00:55:00+02:00',title:'Llegada a Fiumicino',text:'Taxi oficial o Uber Black directo al alojamiento.',dest:'Fiumicino Airport, Italy'},
  {at:'2026-10-10T09:35:00+02:00',title:'Punto de encuentro del Vaticano',text:'Via Candia, 131 · la visita empieza a las 10:00.',dest:'Via Candia 131, Roma, Italy'},
  {at:'2026-10-10T14:00:00+02:00',title:'Basílica de San Pedro',text:'Después del Vaticano: Piedad, baldaquino y la gran nave.',dest:'Basilica di San Pietro, Vatican City'},
  {at:'2026-10-10T15:45:00+02:00',title:'Castel Sant’Angelo',text:'Paseo exterior por Via della Conciliazione y el puente.',dest:'Castel Sant Angelo, Roma, Italy'},
  {at:'2026-10-10T16:50:00+02:00',title:'Pincio y Piazza del Popolo',text:'Atardecer y bajada al punto de encuentro del free tour.',dest:'Terrazza del Pincio, Roma, Italy'},
  {at:'2026-10-10T17:40:00+02:00',title:'Free tour nocturno',text:'Nos acercamos a Santa Maria del Popolo. Empieza a las 18:00.',dest:'Basilica di Santa Maria del Popolo, Roma, Italy'},
  {at:'2026-10-11T10:00:00+02:00',title:'San Pietro in Vincoli',text:'Primera parada: el Moisés de Miguel Ángel.',dest:'San Pietro in Vincoli, Roma, Italy'},
  {at:'2026-10-11T11:30:00+02:00',title:'Punto de encuentro del Coliseo',text:'Via dei Fori Imperiali, 1 · la visita empieza a las 12:00.',dest:'Via dei Fori Imperiali 1, Roma, Italy'},
  {at:'2026-10-11T15:45:00+02:00',title:'Piazza Venezia y Campidoglio',text:'Empieza el paseo a pie por el centro histórico.',dest:'Piazza Venezia, Roma, Italy'},
  {at:'2026-10-11T17:40:00+02:00',title:'Punto de encuentro del Panteón',text:'Via del Pozzo delle Cornacchie, 56 · entrada a las 18:00.',dest:'Via del Pozzo delle Cornacchie 56, Roma, Italy'},
  {at:'2026-10-11T18:45:00+02:00',title:'Navona → Trastevere',text:'Piazza Navona, Campo de’ Fiori, Ponte Sisto y cena.',dest:'Piazza Navona, Roma, Italy'},
  {at:'2026-10-12T07:00:00+02:00',title:'Cúpula de San Pedro',text:'Roma despertando desde arriba.',dest:'Basilica di San Pietro, Vatican City'},
  {at:'2026-10-12T10:00:00+02:00',title:'Checkout y locker',text:'Maletas hacia Via Filippo Turati, 52, junto a Termini.',dest:'Via Filippo Turati 52, Roma, Italy'},
  {at:'2026-10-12T10:40:00+02:00',title:'Santa Maria Maggiore',text:'Comienza nuestro último paseo por Roma.',dest:'Basilica di Santa Maria Maggiore, Roma, Italy'},
  {at:'2026-10-12T11:35:00+02:00',title:'Santa Maria della Vittoria',text:'Bernini y el Éxtasis de Santa Teresa.',dest:'Santa Maria della Vittoria, Roma, Italy'},
  {at:'2026-10-12T12:30:00+02:00',title:'Trevi y Piazza di Spagna',text:'Últimas postales y la moneda para volver.',dest:'Fontana di Trevi, Roma, Italy'},
  {at:'2026-10-12T14:15:00+02:00',title:'Recoger maletas y Terravision',text:'Volvemos a Via Giolitti. Objetivo: bus sobre las 14:30.',dest:'Via Giovanni Giolitti 38, Roma, Italy'},
  {at:'2026-10-12T16:10:00+02:00',title:'Fiumicino',text:'Ya deberíamos estar en el aeropuerto. Vuelo a las 17:40.',dest:'Fiumicino Airport, Italy'}
].map(x=>({...x,date:new Date(x.at)}));
function updateNow(){const title=document.querySelector('#now-title'),text=document.querySelector('#now-text'),map=document.querySelector('#now-map');if(!title||!text||!map)return;const now=new Date();const start=schedule[0].date;const end=new Date('2026-10-12T19:30:00+02:00');if(now<start){const diff=start-now;const days=Math.ceil(diff/86400000);title.textContent=days>1?`Faltan ${days} días para Roma`:'Mañana empieza Roma';text.textContent='Hasta entonces, podemos usar esta web para repasar la ruta y guardar nuestros lugares.';map.href='#ruta';map.textContent='Ver itinerario';return}if(now>end){title.textContent='Roma ya forma parte de nosotros ♡';text.textContent='La guía se queda aquí para recordar el primer viaje juntos… y para preparar la próxima vuelta.';map.href='#momentos';map.textContent='Nuestros momentos';return}let next=schedule.find(item=>item.date>now);if(!next)next=schedule[schedule.length-1];const mins=Math.max(0,Math.round((next.date-now)/60000));const when=mins<60?`en ${mins} min`:mins<180?`en ${Math.floor(mins/60)} h ${mins%60} min`:'después';title.textContent=`Ahora toca: ${next.title}`;text.textContent=`${next.text} · ${when}`;map.href=mapsDir(next.dest);map.target='_blank';map.rel='noopener';map.textContent='Cómo llegar'}
updateNow();setInterval(updateNow,60000);

// Offline básico en GitHub Pages
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
