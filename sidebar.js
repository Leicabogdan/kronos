/**
 * KRONOS — Sidebar Component
 * Utilizare: <script src="sidebar.js" data-active="DASHBOARD"></script>
 *
 * Valori valide pentru data-active:
 *   DASHBOARD | ACTIVITATI_SILOZ | ORE_FUNCTIONARE |
 *   MENTENANTA_ECHIPAMENTE | AERE_CONDITIONATE | CUVE_RECEPTIE |
 *   MOTO_REDUCTOARE | ELEVATOARE | TRANS_LANT | TRANS_BANDA | FILTRE | SNECURI | CANTARE | CELULE_RECEPTIE |
 *   ISCIR | RAPOARTE |
 *   MANUAL_MENTENANTA | STOC_PIESE | ANALIZE_ULEI | MANUALE_DOC | FISA
 */

(function () {

  /* ── CSS ── */
  var style = document.createElement('style');
  style.textContent = `
:root{
  --bg:#04050a;--bg2:#0d0f17;--bg3:#111420;--bg4:#161924;
  --border:#1a1d28;--border2:#252836;
  --teal:#00dcb4;--amber:#f0a500;--red:#e05050;--green:#4aaf70;--blue:#5090e0;--purple:#9b6dff;
  --mono:'Share Tech Mono',monospace;--sans:'IBM Plex Sans',sans-serif;
  --title:'Orbitron',sans-serif;--raj:'Rajdhani',sans-serif;
  --sidebar:220px;
}
.kronos-sidebar{
  width:var(--sidebar);flex-shrink:0;
  background:var(--bg2);border-right:1px solid var(--border2);
  display:flex;flex-direction:column;
  height:100svh;overflow:hidden;
  position:relative;z-index:50;
  transition:width .25s ease;
}
.kronos-sidebar.collapsed{width:60px;}
.kronos-sidebar.collapsed .sb-nav-label,
.kronos-sidebar.collapsed .sb-logo-text,
.kronos-sidebar.collapsed .sb-footer-text,
.kronos-sidebar.collapsed .sb-section-label{display:none;}
.sb-logo{
  display:flex;align-items:center;gap:12px;
  padding:20px 16px 16px;border-bottom:1px solid var(--border);flex-shrink:0;
}
.sb-logo canvas{flex-shrink:0;width:44px!important;height:44px!important;}
.sb-logo-text{display:flex;flex-direction:column;gap:1px;overflow:hidden;}
.sb-logo-main{font-family:var(--title);font-size:18px;font-weight:900;letter-spacing:.14em;color:#fff;white-space:nowrap;}
.sb-logo-main span{color:var(--teal);}
.sb-logo-sub{font-family:var(--mono);font-size:8px;color:var(--teal);letter-spacing:.16em;font-weight:700;white-space:nowrap;}
.sb-nav{flex:1;overflow-y:auto;padding:10px 8px;scrollbar-width:none;}
.sb-nav::-webkit-scrollbar{display:none;}
.sb-section-label{font-family:var(--sans);font-size:13px;color:var(--teal);letter-spacing:.04em;text-transform:uppercase;font-weight:700;padding:12px 8px 6px;}
.sb-item{display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;transition:all .18s;margin-bottom:2px;text-decoration:none;color:#fff;border:1px solid transparent;}
.sb-item:hover{background:rgba(255,255,255,.05);}
.sb-item.active{background:rgba(0,220,180,.1);border-color:rgba(0,220,180,.2);}
.sb-item.active .sb-icon{color:var(--teal);}
.sb-item.active .sb-nav-label{color:var(--teal);}
.sb-icon{width:18px;height:18px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;}
.sb-nav-label{font-family:var(--sans);font-size:13px;font-weight:600;letter-spacing:.02em;white-space:nowrap;overflow:hidden;}
.sb-sub{padding-left:24px!important;}
.sb-group-toggle{cursor:pointer;}
.sb-group-toggle .sb-icon{color:var(--teal)!important;}
.sb-group-toggle .sb-nav-label{color:var(--teal)!important;}
.sb-group-toggle:hover{background:rgba(0,220,180,.06)!important;}
.sb-badge{margin-left:auto;min-width:18px;height:18px;border-radius:9px;background:var(--red);color:#fff;font-size:10px;font-weight:700;font-family:var(--mono);display:flex;align-items:center;justify-content:center;padding:0 5px;flex-shrink:0;}
.sb-footer{padding:12px 8px;border-top:1px solid var(--border);flex-shrink:0;}
.sb-user{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:rgba(0,220,180,.04);border:1px solid rgba(0,220,180,.12);}
.sb-user-av{width:30px;height:30px;border-radius:50%;flex-shrink:0;background:#0d2420;border:1.5px solid var(--teal);display:flex;align-items:center;justify-content:center;font-family:var(--title);font-size:10px;font-weight:900;color:var(--teal);}
.sb-footer-text{overflow:hidden;}
.sb-user-name{font-family:var(--raj);font-size:15px;font-weight:700;color:#fff;letter-spacing:.06em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sb-user-role{font-family:var(--sans);font-size:10px;color:var(--teal);font-weight:700;white-space:nowrap;}
.sb-collapse{position:absolute;top:50%;right:-12px;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:var(--bg3);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:51;transition:all .2s;}
.sb-collapse:hover{border-color:var(--teal);color:var(--teal);}
.sb-collapse svg{transition:transform .25s;}
.kronos-sidebar.collapsed .sb-collapse svg{transform:rotate(180deg);}
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:199;}
.sb-overlay.show{display:block;}
@media(max-width:700px){
  .kronos-sidebar{position:fixed;top:0;left:0;height:100%;z-index:200;transform:translateX(-100%);transition:transform .25s ease,width .25s ease;}
  .kronos-sidebar.mobile-open{transform:translateX(0);}
}
`;
  document.head.appendChild(style);

  /* ── HELPERS ── */
  var scriptEl = document.currentScript;
  var ACTIVE = (scriptEl && scriptEl.getAttribute('data-active')) || '';

  function isActive(key) { return ACTIVE === key; }

  function navItem(href, iconSvg, label, key, extra) {
    var cls = 'sb-item' + (isActive(key) ? ' active' : '') + (extra ? ' ' + extra : '');
    var tag = href ? 'a' : 'span';
    var hrefAttr = href ? ' href="' + href + '"' : '';
    return '<' + tag + ' class="' + cls + '"' + hrefAttr + '>'
      + '<div class="sb-icon">' + iconSvg + '</div>'
      + '<span class="sb-nav-label">' + label + '</span>'
      + '</' + tag + '>';
  }

  function groupToggle(label, iconSvg, toggleFn, arrowId, containsActive) {
    var tealStyle = containsActive ? ' style="color:var(--teal);"' : '';
    return '<div class="sb-item sb-group-toggle" onclick="' + toggleFn + '()">'
      + '<div class="sb-icon">' + iconSvg + '</div>'
      + '<span class="sb-nav-label"' + tealStyle + '>' + label + '</span>'
      + '<svg id="' + arrowId + '" width="12" height="12" viewBox="0 0 12 12" fill="none" style="margin-left:auto;transition:transform .25s;flex-shrink:0;"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + '</div>';
  }

  /* Determina daca un grup contine pagina activa */
  var MNT_KEYS   = ['MENTENANTA_ECHIPAMENTE','SCHIMB_ULEI','AERE_CONDITIONATE','CUVE_RECEPTIE'];
  var DT_KEYS    = ['MOTO_REDUCTOARE','ELEVATOARE','TRANS_LANT','TRANS_BANDA','FILTRE','SNECURI','CANTARE','CELULE_RECEPTIE'];
  var CONF_KEYS  = ['ISCIR','RAPOARTE'];
  var RES_KEYS   = ['MANUAL_MENTENANTA','STOC_PIESE','ANALIZE_ULEI','MANUALE_DOC','FISA'];

  /* ── HTML ── */
  var html = `
<div class="kronos-sidebar" id="kronos-sidebar">

  <div class="sb-logo">
    <canvas id="sb-gear" width="144" height="144" style="width:44px;height:44px;flex-shrink:0;"></canvas>
    <div class="sb-logo-text">
      <div class="sb-logo-main">KR<span>O</span>NOS</div>
      <div class="sb-logo-sub">Maintenance System</div>
    </div>
  </div>

  <div class="sb-nav">
    <div class="sb-section-label">PRINCIPAL</div>

    ${navItem('dashboard.html',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 7.5L8 2l6 5.5V14a.5.5 0 01-.5.5h-4V10h-3v4.5H2.5A.5.5 0 012 14V7.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
      'DASHBOARD', 'DASHBOARD')}

    ${navItem('activitati_siloz.html',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
      'ACTIVITATI SILOZ', 'ACTIVITATI_SILOZ')}

    ${navItem('ore_functionare.html',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 5v3l2 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
      'ORE DE FUNCTIONARE', 'ORE_FUNCTIONARE')}

    <!-- MENTENANTA -->
    ${groupToggle(
      'MENTENANTA SI<br>INTRETINERE',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
      'sbToggleMnt', 'sb-mnt-arrow', MNT_KEYS.indexOf(ACTIVE) > -1
    )}
    <div id="sb-mnt-items" style="max-height:0;overflow:hidden;transition:max-height .35s ease;">
      ${navItem('mentenanta_echipamente.html',
        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.9 2.9l1.4 1.4M9.7 9.7l1.4 1.4M2.9 11.1l1.4-1.4M9.7 4.3l1.4-1.4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
        'MENTENANTA<br>ECHIPAMENTE', 'MENTENANTA_ECHIPAMENTE', 'sb-sub')}
      ${navItem('schimb_ulei.html',
        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 1h4v3l1.5 2.5V11a2 2 0 01-2 2H5.5a2 2 0 01-2-2V6.5L5 4V1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M3.5 6.5h7" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
        'SCHIMB ULEI', 'SCHIMB_ULEI', 'sb-sub')}
      <span class="sb-item sb-sub" style="cursor:default;opacity:.55;">
        <div class="sb-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="7" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M4 9v3M7 9v3M10 9v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></div>
        <span class="sb-nav-label">AERE CONDITIONATE</span>
      </span>
      ${navItem('cuve_receptie.html',
        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 6L7 1l3 5" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M2 6h10v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" stroke="currentColor" stroke-width="1.2"/></svg>',
        'CUVE RECEPTIE', 'CUVE_RECEPTIE', 'sb-sub')}
    </div>

    <!-- DATE TEHNICE -->
    ${groupToggle(
      'DATE TEHNICE',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h5v10H2zM7 7h7v6H7zM9 3h5v4H9z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
      'sbToggleDt', 'sb-dt-arrow', DT_KEYS.indexOf(ACTIVE) > -1
    )}
    <div id="sb-dt-items" style="max-height:0;overflow:hidden;transition:max-height .35s ease;">
      ${navItem('moto_reductoare.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="4" width="8" height="7" rx="1.1" stroke="currentColor" stroke-width="1.2"/><path d="M9 6.5h3a.7.7 0 010 1.4H9" stroke="currentColor" stroke-width="1.2"/><circle cx="5" cy="7.5" r="1.8" stroke="currentColor" stroke-width="1.2"/><circle cx="5" cy="7.5" r=".7" fill="currentColor"/></svg>','MOTO-REDUCTOARE','MOTO_REDUCTOARE','sb-sub')}
      ${navItem('elevatoare.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="5" y1="1" x2="5" y2="13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="9" y1="1" x2="9" y2="13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="3" y1="1" x2="11" y2="1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3" y1="13" x2="11" y2="13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>','ELEVATOARE','ELEVATOARE','sb-sub')}
      ${navItem('transportoare_lant.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="5" width="12" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><circle cx="3.5" cy="7.5" r="1.2" stroke="currentColor" stroke-width="1.1"/><circle cx="10.5" cy="7.5" r="1.2" stroke="currentColor" stroke-width="1.1"/></svg>','TRANS. CU LANT','TRANS_LANT','sb-sub')}
      ${navItem('transportoare_banda.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 5h10v5a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" stroke="currentColor" stroke-width="1.2"/><path d="M1 5h12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>','TRANS. CU BANDA','TRANS_BANDA','sb-sub')}
      ${navItem('filtre.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h10l-4 5v4l-2-1V7L2 2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>','FILTRE','FILTRE','sb-sub')}
      ${navItem('snecuri.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7c1-2 7-2 8 0s-7 2-8 0z" stroke="currentColor" stroke-width="1.2"/><line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>','SNECURI','SNECURI','sb-sub')}
      ${navItem('cantare.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10h10M3 10L5 4h4l2 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="4" r="1.2" stroke="currentColor" stroke-width="1.1"/></svg>','CANTARE','CANTARE','sb-sub')}
      ${navItem('celule_receptie.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 7v5h6V7" stroke="currentColor" stroke-width="1.2"/><path d="M3 7h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M7 2L3 7h8L7 2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>','CELULE RECEPTIE','CELULE_RECEPTIE','sb-sub')}
    </div>

    <!-- CONFORMITATE -->
    ${groupToggle(
      'CONFORMITATE',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      'sbToggleConf', 'sb-conf-arrow', CONF_KEYS.indexOf(ACTIVE) > -1
    )}
    <div id="sb-conf-items" style="max-height:0;overflow:hidden;transition:max-height .35s ease;">
      ${navItem('#','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M4.5 7l2 2 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'ISCIR <span class="sb-badge">2</span>','ISCIR','sb-sub')}
      ${navItem('#','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M2 7h7M2 10.5h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>','RAPOARTE','RAPOARTE','sb-sub')}
    </div>

    <!-- RESURSE -->
    ${groupToggle(
      'RESURSE',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="6" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5 6V5a3 3 0 016 0v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
      'sbToggleRes', 'sb-res-arrow', RES_KEYS.indexOf(ACTIVE) > -1
    )}
    <div id="sb-res-items" style="max-height:0;overflow:hidden;transition:max-height .35s ease;">
      <a class="sb-item sb-sub ${isActive('MANUAL_MENTENANTA')?'active':''}" href="manual_mentenanta.html">
        <div class="sb-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h10v10H2V2z" stroke="var(--red)" stroke-width="1.2"/><path d="M4 5h6M4 7h6M4 9h4" stroke="var(--red)" stroke-width="1.1" stroke-linecap="round"/></svg></div>
        <span class="sb-nav-label" style="color:var(--red);white-space:normal;line-height:1.3;">MANUAL<br>MENTENANTA</span>
      </a>
      ${navItem('stoc_piese.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="5.5" width="10" height="7" rx="1.2" stroke="currentColor" stroke-width="1.2"/><path d="M4.5 5.5V5a2.5 2.5 0 015 0v.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>','STOC PIESE','STOC_PIESE','sb-sub')}
      ${navItem('analize_ulei.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2c0 0-3.5 3.5-3.5 6a3.5 3.5 0 007 0c0-2.5-3.5-6-3.5-6z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>','ANALIZE ULEI','ANALIZE_ULEI','sb-sub')}
      <a class="sb-item sb-sub ${isActive('MANUALE_DOC')?'active':''}" href="manuale_documentatie.html">
        <div class="sb-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 1.5h5.5l3 3v8a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5v-11A.5.5 0 013 1.5z" stroke="currentColor" stroke-width="1.2"/><path d="M8.5 1.5v3h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></div>
        <span class="sb-nav-label" style="white-space:normal;line-height:1.3;">MANUALE SI<br>DOCUMENTATIE</span>
      </a>
      ${navItem('kronos_register.html','<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 1.5h5.5l3 3v8a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5v-11A.5.5 0 013 1.5z" stroke="currentColor" stroke-width="1.2"/><path d="M5 7h4M5 9.5h3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>','FISA','FISA','sb-sub')}
    </div>

  </div><!-- /sb-nav -->

  <div class="sb-footer">
    <div class="sb-user">
      <div class="sb-user-av" id="sb-user-av">LB</div>
      <div class="sb-footer-text">
        <div class="sb-user-name" id="sb-user-name">Leica Bogdan</div>
        <div class="sb-user-role" id="sb-user-role">APP OWNER</div>
      </div>
    </div>
  </div>

  <div class="sb-collapse" onclick="sbToggleCollapse()">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8 2L4 6l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>

</div>
<div class="sb-overlay" id="sb-overlay" onclick="sbCloseMobile()"></div>
`;

  /* ── INJECT ── */
  var target = document.getElementById('kronos-sidebar-mount');
  if (target) {
    target.outerHTML = html;
  } else {
    // Injecteaza ca primul child al .app, sau afterbegin body ca fallback
    var appEl = document.querySelector('.app');
    if (appEl) {
      appEl.insertAdjacentHTML('afterbegin', html);
    } else {
      document.body.insertAdjacentHTML('afterbegin', html);
    }
  }

  /* ── GEAR ANIMATION ── */
  function drawGear(cv) {
    var c = cv.getContext('2d'), W = cv.width, H = cv.height, cx = W/2, cy = H/2, s = W/300;
    var RT=126*s,RR=98*s,RI=78*s,TC='#00dcb4',OC='#ff8c00';
    function pt(r,a){return[cx+r*Math.sin(a),cy-r*Math.cos(a)];}
    c.clearRect(0,0,W,H);
    var grd=c.createRadialGradient(cx,cy,RI*.3,cx,cy,RT);
    grd.addColorStop(0,'#0e2420');grd.addColorStop(1,'#04080a');
    c.beginPath();
    for(var i=0;i<12;i++){var b=(i/12)*Math.PI*2,ta=.18,ra=.26;var a1=b-ra/2,a2=b-ta/2,a3=b+ta/2,a4=b+ra/2,a5=((i+1)/12)*Math.PI*2-ra/2;var p0=pt(RR,a1),p2=pt(RT,a2),p3=pt(RT,a3),p4=pt(RR,a4);if(!i)c.moveTo(p0[0],p0[1]);else c.lineTo(p0[0],p0[1]);c.lineTo(p2[0],p2[1]);c.lineTo(p3[0],p3[1]);c.lineTo(p4[0],p4[1]);c.arc(cx,cy,RR,a4-Math.PI/2,a5-Math.PI/2,false);}
    c.closePath();c.fillStyle=grd;c.fill();c.strokeStyle=TC;c.lineWidth=2*s;c.lineJoin='round';c.shadowColor=TC;c.shadowBlur=10*s;c.stroke();c.shadowBlur=0;
    c.beginPath();c.arc(cx,cy,RI,0,Math.PI*2);var ig=c.createRadialGradient(cx,cy,0,cx,cy,RI);ig.addColorStop(0,'#0d201c');ig.addColorStop(1,'#050c0a');c.fillStyle=ig;c.fill();c.strokeStyle=TC;c.lineWidth=2.8*s;c.shadowColor=TC;c.shadowBlur=16*s;c.stroke();c.shadowBlur=0;
    for(var m=0;m<60;m++){var a=(m/60)*Math.PI*2,isH=m%5===0,isQ=m%15===0;var r1=RI-(isQ?5:isH?4:2)*s,r2=RI-(isQ?18:isH?14:8)*s;var q1=pt(r1,a),q2=pt(r2,a);c.beginPath();c.moveTo(q1[0],q1[1]);c.lineTo(q2[0],q2[1]);c.strokeStyle=isQ?TC:isH?'rgba(0,220,180,.75)':'rgba(0,220,180,.3)';c.lineWidth=(isQ?2.5:isH?1.8:.9)*s;c.lineCap='round';c.shadowColor=isQ||isH?TC:'transparent';c.shadowBlur=isQ?7*s:isH?3*s:0;c.stroke();c.shadowBlur=0;}
    var now=new Date(),ms=now.getMilliseconds(),secs=now.getSeconds()+ms/1000,mins=now.getMinutes()+secs/60,hrs=(now.getHours()%12)+mins/60;
    [[RI*.48,(hrs/12)*Math.PI*2,5*s,TC,10*s],[RI*.70,(mins/60)*Math.PI*2,3*s,TC,7*s]].forEach(function(x){var p=pt(x[0],x[1]);c.beginPath();c.moveTo(cx,cy);c.lineTo(p[0],p[1]);c.strokeStyle=x[3];c.lineWidth=x[2];c.lineCap='round';c.shadowColor=x[3];c.shadowBlur=x[4];c.stroke();c.shadowBlur=0;});
    var sA=(secs/60)*Math.PI*2,sp=pt(RI*.76,sA),sc2=pt(-RI*.22,sA);c.beginPath();c.moveTo(sc2[0],sc2[1]);c.lineTo(sp[0],sp[1]);c.strokeStyle=OC;c.lineWidth=1.5*s;c.lineCap='round';c.shadowColor=OC;c.shadowBlur=7*s;c.stroke();c.shadowBlur=0;
    c.beginPath();c.arc(cx,cy,6*s,0,Math.PI*2);c.fillStyle=TC;c.shadowColor=TC;c.shadowBlur=14*s;c.fill();c.shadowBlur=0;c.beginPath();c.arc(cx,cy,3*s,0,Math.PI*2);c.fillStyle='#04050a';c.fill();
  }
  var gearCv = document.getElementById('sb-gear');
  if (gearCv) { (function gl(){drawGear(gearCv);requestAnimationFrame(gl);})(); }

  /* ── USER ── */
  function sbInitUser() {
    try {
      var name = sessionStorage.getItem('k_name') || 'Leica Bogdan';
      var role = sessionStorage.getItem('k_role') || 'APP OWNER';
      var nameEl = document.getElementById('sb-user-name');
      var roleEl = document.getElementById('sb-user-role');
      var avEl   = document.getElementById('sb-user-av');
      if (nameEl) nameEl.textContent = name;
      if (roleEl) roleEl.textContent = role;
      var parts = name.trim().split(' ');
      var initials = (parts[0]?parts[0][0]:'') + (parts[1]?parts[1][0]:'');
      if (avEl) avEl.textContent = initials.toUpperCase();
    } catch(e){}
  }
  sbInitUser();

  /* ── TOGGLE GROUPS ── */
  function sbToggleGroup(itemsId, arrowId) {
    var el  = document.getElementById(itemsId);
    var arr = document.getElementById(arrowId);
    var open = el.style.maxHeight !== '0px' && el.style.maxHeight !== '';
    if (open) {
      el.style.maxHeight = '0';
      if (arr) arr.style.transform = '';
    } else {
      el.style.maxHeight = 'none';
      var h = el.scrollHeight;
      el.style.maxHeight = '0';
      el.offsetHeight;
      el.style.maxHeight = (h || 500) + 'px';
      if (arr) arr.style.transform = 'rotate(180deg)';
    }
  }
  window.sbToggleMnt  = function(){ sbToggleGroup('sb-mnt-items',  'sb-mnt-arrow');  };
  window.sbToggleDt   = function(){ sbToggleGroup('sb-dt-items',   'sb-dt-arrow');   };
  window.sbToggleConf = function(){ sbToggleGroup('sb-conf-items', 'sb-conf-arrow'); };
  window.sbToggleRes  = function(){ sbToggleGroup('sb-res-items',  'sb-res-arrow');  };

  /* Auto-expand grupul activ */
  var autoExpand = {
    'sb-mnt-items':  MNT_KEYS,
    'sb-dt-items':   DT_KEYS,
    'sb-conf-items': CONF_KEYS,
    'sb-res-items':  RES_KEYS,
  };
  Object.keys(autoExpand).forEach(function(id) {
    if (autoExpand[id].indexOf(ACTIVE) > -1) {
      var el = document.getElementById(id);
      if (el) {
        el.style.maxHeight = 'none';
        var h = el.scrollHeight;
        el.style.maxHeight = (h || 500) + 'px';
        var arrowId = id.replace('-items', '-arrow');
        var arr = document.getElementById(arrowId);
        if (arr) arr.style.transform = 'rotate(180deg)';
      }
    }
  });

  /* ── COLLAPSE ── */
  var sbCollapsed = false;
  window.sbToggleCollapse = function() {
    sbCollapsed = !sbCollapsed;
    document.getElementById('kronos-sidebar').classList.toggle('collapsed', sbCollapsed);
  };

  /* ── MOBILE ── */
  window.sbOpenMobile = function() {
    document.getElementById('kronos-sidebar').classList.add('mobile-open');
    document.getElementById('sb-overlay').classList.add('show');
  };
  window.sbCloseMobile = function() {
    document.getElementById('kronos-sidebar').classList.remove('mobile-open');
    document.getElementById('sb-overlay').classList.remove('show');
  };

})();
