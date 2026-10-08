/* CSDA pricing, calendar, schedule, and domain calculation rules. */
/* ================= PRICING ENGINE ================= */
function isShortCourseOrWorkshop(it){
  if (!it) return false;
  return !!it.nofull || /\b(short course|workshop)\b/i.test((it.n||'') + ' ' + (it.kw||''));
}
function shortPromoAllowed(p){
  return !!p && (p.id === 'p_group' || p.id === 'p_early' ||
    /early bird|group of 3/i.test(p.label||''));
}
function quote(ids, promoState, planId){
  var items = ids.map(itemById).filter(function(i){ return i && i.price != null; });
  var sub = items.reduce(function(s,i){ return s + i.price; }, 0);
  var n = items.length;
  var fullPlanId = (DB.plans[0]||{}).id;
  var restrictedShort = items.some(isShortCourseOrWorkshop);
  var allNoFull = n > 0 && items.every(function(i){ return i.nofull; });
  var elig = DB.promos.filter(function(p){
    /* Short courses/workshops may use only Group of 3 and Early Bird. Because the
       current engine prices a bundle as one subtotal, a mixed bundle follows the
       stricter rule so a restricted item never receives Full Payment/Bundle discount. */
    if (restrictedShort && !shortPromoAllowed(p)) return false;
    if (p.kind === 'bundle')  return n >= (p.min || 3);
    if (p.kind === 'fullpay') return !!promoState[p.id] && planId === fullPlanId && !allNoFull;
    return !!promoState[p.id];
  });
  var best = elig.reduce(function(a,b){ return (!a || b.pct > a.pct) ? b : a; }, null);
  var pct = DB.cfg.combine ? elig.reduce(function(s,p){ return s + p.pct; }, 0) : (best ? best.pct : 0);
  if (pct > 100) pct = 100;
  var net = sub * (1 - pct/100);
  var plan = planById(planId);
  var schedule = (plan.stages||[]).map(function(s){ return { l:s.l, p:s.p, w:s.w || '', amt: net * s.p / 100 }; });
  var manualSel = DB.promos.filter(function(p){
    return p.kind !== 'bundle' && promoState[p.id] && (!restrictedShort || shortPromoAllowed(p));
  });
  var autoB = DB.promos.filter(function(p){
    return p.kind === 'bundle' && !restrictedShort && n >= (p.min||3);
  });
  return {
    items:items, sub:sub, n:n, elig:elig, best:best, pct:pct, net:net,
    allNoFull:allNoFull, restrictedShort:restrictedShort,
    plan:plan, schedule:schedule, hrs: items.reduce(function(s,i){ return s + (i.hrs||0); }, 0),
    applied: best ? [{ label: best.label, pct: pct, amt: sub - net }] : [],
    disc: sub - net,
    lateNet: net * (1 + (+DB.cfg.late || 0) / 100),
    lateAdd: net * ((+DB.cfg.late || 0) / 100),
    totalSel: manualSel.length + autoB.length,
    selLabels: manualSel.concat(autoB).map(function(s){ return s.label; }),
    conflict: manualSel.some(function(p){ return p.kind === 'fullpay'; }) && planId !== fullPlanId
  };
}

/* ================= SCHEDULING ================= */
var DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var EDUC_LEVELS = ['Elementary — undergraduate','Elementary graduate',
  'Junior High School — undergraduate','Junior High School graduate',
  'Senior High School — undergraduate','Senior High School graduate',
  'Technical / Vocational','College — undergraduate','College graduate',
  'Post-graduate'];
function isoOf(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function dateOf(iso){
  if (!iso) return null;
  var p = String(iso).split('-');
  if (p.length !== 3) return null;
  var d = new Date(+p[0], +p[1]-1, +p[2]);
  return isNaN(d.getTime()) ? null : d;
}
function shortDate(iso){
  var d = dateOf(iso); if (!d) return '';
  var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return M[d.getMonth()] + ' ' + d.getDate();
}
function dowOf(iso){ var d = dateOf(iso); return d ? DOW[d.getDay()] : ''; }
function isSunday(iso){ var d = dateOf(iso); return !!d && d.getDay() === 0; }

function isSaturday(iso){ var d = dateOf(iso); return !!d && d.getDay() === 6; }
/* ---------- non-teaching days ----------
   Three things take a date out of the calendar: the weekend rule, a public holiday,
   and a one-off closure the admin has recorded (a storm day, a suspension). The
   movable Philippine holidays are computed from Easter rather than hard-coded, so
   they stay right in every future year. Islamic holidays move by proclamation and
   cannot be computed — those are added by hand under Admin › Holidays. */
function easterSunday(y){                       // Meeus/Jones/Butcher
  var a=y%19, b=Math.floor(y/100), c=y%100, d=Math.floor(b/4), e=b%4,
      f=Math.floor((b+8)/25), g=Math.floor((b-f+1)/3), h=(19*a+b-d-g+15)%30,
      i=Math.floor(c/4), k=c%4, l=(32+2*e+2*i-h-k)%7,
      m=Math.floor((a+11*h+22*l)/451),
      mo=Math.floor((h+l-7*m+114)/31), da=((h+l-7*m+114)%31)+1;
  return new Date(y, mo-1, da);
}
function shiftDays(dt, n){ var x = new Date(dt.getTime()); x.setDate(x.getDate()+n); return x; }
function lastMondayOfAugust(y){
  var d = new Date(y, 7, 31);
  while (d.getDay() !== 1) d.setDate(d.getDate() - 1);
  return d;
}
var _phCache = {};
function phHolidays(year){
  if (_phCache[year]) return _phCache[year];
  var E = easterSunday(year), list = [
    [year+'-01-01', 'New Year\u2019s Day'],
    [year+'-04-09', 'Araw ng Kagitingan'],
    [year+'-05-01', 'Labor Day'],
    [year+'-06-12', 'Independence Day'],
    [year+'-08-21', 'Ninoy Aquino Day'],
    [year+'-11-01', 'All Saints\u2019 Day'],
    [year+'-11-30', 'Bonifacio Day'],
    [year+'-12-08', 'Immaculate Conception'],
    [year+'-12-25', 'Christmas Day'],
    [year+'-12-30', 'Rizal Day'],
    [year+'-12-31', 'Last Day of the Year'],
    [isoOf(shiftDays(E,-3)), 'Maundy Thursday'],
    [isoOf(shiftDays(E,-2)), 'Good Friday'],
    [isoOf(shiftDays(E,-1)), 'Black Saturday'],
    [isoOf(lastMondayOfAugust(year)), 'National Heroes Day']
  ];
  var map = {};
  list.forEach(function(p){ map[p[0]] = p[1]; });
  _phCache[year] = map;
  return map;
}
/* name of whatever closes this date, or '' if classes can run */
function holidayName(iso){
  if (!iso) return '';
  var manual = (DB.holidays || []).filter(function(h){ return h.d === iso; })[0];
  if (manual) return manual.n || 'Closure';
  if (DB.cfg && DB.cfg.skipHolidays === false) return '';
  var y = parseInt(String(iso).slice(0,4), 10);
  if (!y) return '';
  return phHolidays(y)[iso] || '';
}
/* A date is off-limits if it is a Sunday, a Saturday when Saturdays are excluded,
   a holiday or recorded closure, or a session the admin switched off by hand. */
function isBlockedDay(iso, sat, skips){
  var d = dateOf(iso); if (!d) return false;
  if (d.getDay() === 0) return true;
  if (!sat && d.getDay() === 6) return true;
  if (skips && skips.indexOf(iso) > -1) return true;
  return !!holidayName(iso);
}
/* why a date cannot be used — drives the wording in the schedule table */
function blockReason(iso, sat, skips){
  var d = dateOf(iso); if (!d) return '';
  if (d.getDay() === 0) return 'Sunday';
  if (!sat && d.getDay() === 6) return 'Saturday';
  if (skips && skips.indexOf(iso) > -1) return 'Switched off';
  return holidayName(iso);
}
/* every other day, stepping over every non-teaching day */
function genSessions(startISO, count, sat, skips){
  var out = [], d = dateOf(startISO), guard = 0;
  if (!d || !count) return out;
  for (var i = 0; i < count; i++) {
    while (isBlockedDay(isoOf(d), sat, skips) && guard++ < 3000) d.setDate(d.getDate() + 1);
    out.push(isoOf(d));
    d.setDate(d.getDate() + 2);
  }
  return out;
}
/* every holiday/closure between two dates, so the form can explain the gaps */
function holidaysInRange(a, b){
  var out = [], d = dateOf(a), end = dateOf(b), guard = 0;
  if (!d || !end) return out;
  while (d <= end && guard++ < 1000) {
    var iso = isoOf(d), n = holidayName(iso);
    if (n) out.push({ d: iso, n: n });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/* the next teaching day strictly after a given date, keeping the every-other-day beat */
function nextSessionAfter(iso, sat, skips){
  var d = dateOf(iso); if (!d) return '';
  d.setDate(d.getDate() + 2);
  var guard = 0;
  while (isBlockedDay(isoOf(d), sat, skips) && guard++ < 3000) d.setDate(d.getDate() + 1);
  return isoOf(d);
}
/* ---------- QR encoder (byte mode, ECC level M, versions 1–14) ----------
   Written out in full because the toolkit ships as one offline file and cannot
   pull in a library. Produces the module matrix; the caller draws it. */
function qrEncode(text){
  var data = qrUtf8(text);
  var CAP = [0,14,26,42,62,84,106,122,152,180,213,251,287,331,362];   // byte capacity, ECC M
  var ver = 0, i;
  for (i = 1; i < CAP.length; i++) if (data.length <= CAP[i]) { ver = i; break; }
  if (!ver) return null;                                   // too much data for v14
  var ECB = {                                              // [ecCodewordsPerBlock, g1, dc1, g2, dc2]
    1:[10,1,16,0,0], 2:[16,1,28,0,0], 3:[26,1,44,0,0], 4:[18,2,32,0,0], 5:[24,2,43,0,0],
    6:[16,4,27,0,0], 7:[18,4,31,0,0], 8:[22,2,38,2,39], 9:[22,3,36,2,37], 10:[26,4,43,1,44],
    11:[30,1,50,4,51], 12:[22,6,36,2,37], 13:[22,8,37,1,38], 14:[24,4,40,5,41]
  }[ver];
  var size = ver * 4 + 17;
  var ecLen = ECB[0], g1 = ECB[1], dc1 = ECB[2], g2 = ECB[3], dc2 = ECB[4];
  var totalData = g1 * dc1 + g2 * dc2;

  /* --- bit stream: mode 0100, length, payload, terminator, pad --- */
  var bits = [];
  var put = function(v, n){ for (var k = n - 1; k >= 0; k--) bits.push((v >> k) & 1); };
  put(4, 4);
  put(data.length, ver < 10 ? 8 : 16);
  for (i = 0; i < data.length; i++) put(data[i], 8);
  for (i = 0; i < 4 && bits.length < totalData * 8; i++) bits.push(0);
  while (bits.length % 8) bits.push(0);
  var bytes = [];
  for (i = 0; i < bits.length; i += 8) {
    var v = 0; for (var k = 0; k < 8; k++) v = (v << 1) | bits[i + k];
    bytes.push(v);
  }
  var pads = [0xEC, 0x11], pi = 0;
  while (bytes.length < totalData) bytes.push(pads[pi++ % 2]);

  /* --- Reed–Solomon over GF(256) --- */
  var EXP = new Array(512), LOG = new Array(256), x = 1;
  for (i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11D; }
  for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  var mul = function(a, b){ return (a && b) ? EXP[LOG[a] + LOG[b]] : 0; };
  var polyMul = function(a, b){
    var r = new Array(a.length + b.length - 1).fill(0);
    for (var ia = 0; ia < a.length; ia++)
      for (var ib = 0; ib < b.length; ib++) r[ia + ib] ^= mul(a[ia], b[ib]);
    return r;
  };
  var genPoly = function(n){
    var g = [1];                                   // highest power first
    for (var d = 0; d < n; d++) g = polyMul(g, [1, EXP[d]]);
    return g;
  };
  var gp = genPoly(ecLen);
  var rsBlock = function(block){
    var rem = new Array(ecLen).fill(0);
    for (var j = 0; j < block.length; j++) {
      var factor = block[j] ^ rem[0];
      rem.shift(); rem.push(0);
      for (var t = 0; t < ecLen; t++) rem[t] ^= mul(gp[t + 1], factor);
    }
    return rem;
  };

  var blocks = [], ecs = [], at = 0;
  for (i = 0; i < g1; i++) { var bl = bytes.slice(at, at + dc1); at += dc1; blocks.push(bl); ecs.push(rsBlock(bl)); }
  for (i = 0; i < g2; i++) { var bl2 = bytes.slice(at, at + dc2); at += dc2; blocks.push(bl2); ecs.push(rsBlock(bl2)); }

  var out = [], maxD = Math.max(dc1, dc2);
  for (i = 0; i < maxD; i++) for (var bI = 0; bI < blocks.length; bI++) if (i < blocks[bI].length) out.push(blocks[bI][i]);
  for (i = 0; i < ecLen; i++) for (var bE = 0; bE < ecs.length; bE++) out.push(ecs[bE][i]);

  /* --- matrix --- */
  var m = [], res = [];
  for (i = 0; i < size; i++) { m.push(new Array(size).fill(null)); res.push(new Array(size).fill(false)); }
  var setF = function(r, c, v){ if (r >= 0 && r < size && c >= 0 && c < size) { m[r][c] = v; res[r][c] = true; } };
  var finder = function(r, c){
    for (var dr = -1; dr <= 7; dr++) for (var dc = -1; dc <= 7; dc++) {
      var rr = r + dr, cc = c + dc;
      if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
      var on = (dr >= 0 && dr <= 6 && (dc === 0 || dc === 6)) ||
               (dc >= 0 && dc <= 6 && (dr === 0 || dr === 6)) ||
               (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
      setF(rr, cc, on);
    }
  };
  finder(0, 0); finder(0, size - 7); finder(size - 7, 0);
  for (i = 8; i < size - 8; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }

  var ALIGN = [[],[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],
               [6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66]][ver] || [];
  for (var a1 = 0; a1 < ALIGN.length; a1++) for (var a2 = 0; a2 < ALIGN.length; a2++) {
    var ar = ALIGN[a1], ac = ALIGN[a2];
    if ((ar <= 7 && ac <= 7) || (ar <= 7 && ac >= size - 8) || (ar >= size - 8 && ac <= 7)) continue;
    for (var dr2 = -2; dr2 <= 2; dr2++) for (var dc2b = -2; dc2b <= 2; dc2b++)
      setF(ar + dr2, ac + dc2b, Math.max(Math.abs(dr2), Math.abs(dc2b)) !== 1);
  }
  setF(size - 8, 8, true);                                   // dark module
  for (i = 0; i <= 8; i++) { if (!res[8][i] && i !== 6) setF(8, i, false); if (!res[i][8] && i !== 6) setF(i, 8, false); }
  for (i = 0; i < 8; i++) { if (!res[8][size - 1 - i]) setF(8, size - 1 - i, false); if (!res[size - 1 - i][8]) setF(size - 1 - i, 8, false); }
  if (ver >= 7) for (i = 0; i < 18; i++) { setF(Math.floor(i / 3), size - 11 + (i % 3), false); setF(size - 11 + (i % 3), Math.floor(i / 3), false); }

  /* --- place data, mask 0, then format bits --- */
  var vbits = [], bp = 0;
  for (i = 0; i < out.length; i++) for (var q = 7; q >= 0; q--) vbits.push((out[i] >> q) & 1);
  var dir = -1, row = size - 1;
  for (var col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    while (true) {
      for (var s2 = 0; s2 < 2; s2++) {
        var cc2 = col - s2;
        if (!res[row][cc2]) {
          var bit = bp < vbits.length ? vbits[bp++] : 0;
          if ((row + cc2) % 2 === 0) bit ^= 1;               // mask pattern 0
          m[row][cc2] = !!bit;
        }
      }
      row += dir;
      if (row < 0 || row >= size) { row -= dir; dir = -dir; break; }
    }
  }
  var fmt = (0 << 3) | 0;                                     // ECC M (00) + mask 0
  fmt = (0x00 << 3) | 0;
  var fbits = qrFormatBits(0, 0);
  for (i = 0; i <= 5; i++) m[8][i] = fbits[i];
  m[8][7] = fbits[6]; m[8][8] = fbits[7]; m[7][8] = fbits[8];
  for (i = 9; i < 15; i++) m[14 - i][8] = fbits[i];
  for (i = 0; i < 8; i++) m[size - 1 - i][8] = fbits[i];
  for (i = 8; i < 15; i++) m[8][size - 15 + i] = fbits[i];
  m[size - 8][8] = true;
  if (ver >= 7) {
    var vb = qrVersionBits(ver);
    for (i = 0; i < 18; i++) {
      var b2 = !!((vb >> i) & 1);
      m[Math.floor(i / 3)][size - 11 + (i % 3)] = b2;
      m[size - 11 + (i % 3)][Math.floor(i / 3)] = b2;
    }
  }
  return { size: size, modules: m, version: ver };
}
function qrFormatBits(eccBits, mask){
  var data = (eccBits << 3) | mask, rem = data;
  for (var i = 0; i < 10; i++) rem = (rem << 1) ^ (((rem >> 9) & 1) * 0x537);
  var v = (((data << 10) | rem) ^ 0x5412);
  /* placed most-significant bit first, which is the order the spec's
     format-information positions expect */
  var out = [];
  for (var j = 14; j >= 0; j--) out.push(!!((v >> j) & 1));
  return out;
}
function qrVersionBits(ver){
  var rem = ver;
  for (var i = 0; i < 12; i++) rem = (rem << 1) ^ (((rem >> 11) & 1) * 0x1F25);
  return (ver << 12) | rem;
}
function qrUtf8(str){
  var out = [], s = String(str);
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c < 0x80) out.push(c);
    else if (c < 0x800) { out.push(0xC0 | (c >> 6), 0x80 | (c & 63)); }
    else { out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
  }
  return out;
}

/* the matrix as a crisp SVG data URI — scales for screen and prints sharply */
function qrSVG(text, px){
  var r = qrEncode(text);
  if (!r) return '';
  var q = 4, dim = r.size + q * 2, rects = '';
  for (var y = 0; y < r.size; y++) {
    var run = 0;
    for (var x = 0; x <= r.size; x++) {
      var on = x < r.size && r.modules[y][x];
      if (on) run++;
      else if (run) {
        rects += '<rect x="' + (x - run + q) + '" y="' + (y + q) + '" width="' + run + '" height="1"/>';
        run = 0;
      }
    }
  }
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (px || 160) + '" height="' + (px || 160) +
    '" viewBox="0 0 ' + dim + ' ' + dim + '" shape-rendering="crispEdges">' +
    '<rect width="' + dim + '" height="' + dim + '" fill="#fff"/>' +
    '<g fill="#000">' + rects + '</g></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function addMinutes(hhmm, mins){
  var p = String(hhmm || '').split(':');
  if (p.length < 2) return '';
  var t = (+p[0]) * 60 + (+p[1]) + Math.round(mins);
  t = ((t % 1440) + 1440) % 1440;
  return String(Math.floor(t/60)).padStart(2,'0') + ':' + String(t%60).padStart(2,'0');
}
/* minutes from one HH:MM to another, wrapping past midnight */
function minutesBetween(a, b){
  var pa = String(a || '').split(':'), pb = String(b || '').split(':');
  if (pa.length < 2 || pb.length < 2) return 0;
  var ma = (+pa[0]) * 60 + (+pa[1]), mb = (+pb[0]) * 60 + (+pb[1]);
  var d = mb - ma;
  return d < 0 ? d + 1440 : d;
}
function pretty12(hhmm){
  var p = String(hhmm || '').split(':');
  if (p.length < 2) return '—';
  var h = +p[0], m = p[1], ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (!h) h = 12;
  return h + ':' + m + ' ' + ap;
}
/* Resolve a payment stage to a real calendar date.
   `ix`/`total` let a stage with no explicit rule still land on a sensible session:
   the first instalment on enrolment, the last on the final class, the rest spread evenly. */
function stageDue(w, sessions, enrolISO, ix, total){
  sessions = sessions || [];
  var n = sessions.length, last = sessions[n-1];
  if (w === 'enrol') return enrolISO;
  if (w === 'last')  return last || enrolISO;
  if (w === 'secondlast') return sessions[n-2] || last || enrolISO;
  var m = /^session(\d+)$/.exec(w || '');
  if (m) { var i = (+m[1]) - 1; return sessions[i] || last || enrolISO; }
  /* no rule on this stage */
  if (!n || total == null || total <= 1 || ix == null) return enrolISO;
  if (ix === 0) return enrolISO;
  var k = Math.round(ix * (n - 1) / (total - 1));
  return sessions[Math.min(Math.max(k, 0), n - 1)] || enrolISO;
}
/* keep scroll position across an innerHTML re-render */
function keepScroll(container, fn){
  var top = container.scrollTop;
  var pk = container.querySelector('.picker');
  var ptop = pk ? pk.scrollTop : 0;
  fn();
  container.scrollTop = top;
  var pk2 = container.querySelector('.picker');
  if (pk2) pk2.scrollTop = ptop;
}

/* ================= CSV ================= */
var CSV_COLS = ['course_id','course_name','category_id','price','hours','sessions','hours_per_session',
  'unit','description','no_fullpay','keywords','titles','bundleable','hidden','note','module','lesson'];

function csvCell(v){
  var s = (v == null ? '' : String(v));
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
}
function buildCSV(){
  var rows = [CSV_COLS.join(',')];
  DB.items.forEach(function(it){
    var base = [it.id, it.n, it.c, (it.price==null?'':it.price), (it.hrs||''), (it.sess||''),
      (it.dur||''), (it.unit||''), (it.desc||''), (it.nofull?'yes':'no'),
      (it.kw||''), (it.titles||[]).join(' | '),
      (it.bundleable===false?'no':'yes'), (it.hidden?'yes':'no'), (it.note||'')];
    var mods = it.modules || [];
    if (!mods.length) { rows.push(base.concat(['','']).map(csvCell).join(',')); return; }
    mods.forEach(function(m){
      var ls = (m.lessons||[]).filter(Boolean);
      if (!ls.length) { rows.push(base.concat([m.name,'']).map(csvCell).join(',')); return; }
      ls.forEach(function(l){ rows.push(base.concat([m.name, l]).map(csvCell).join(',')); });
    });
  });
  return rows.join('\r\n');
}
function parseCSV(text){
  var rows = [], row = [], cur = '', q = false, i = 0;
  text = text.replace(/^\uFEFF/, '');
  while (i < text.length) {
    var ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i+1] === '"') { cur += '"'; i += 2; continue; } q = false; i++; continue; }
      cur += ch; i++; continue;
    }
    if (ch === '"') { q = true; i++; continue; }
    if (ch === ',') { row.push(cur); cur = ''; i++; continue; }
    if (ch === '\r') { i++; continue; }
    if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; i++; continue; }
    cur += ch; i++;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(function(r){ return r.some(function(c){ return String(c).trim() !== ''; }); });
}
function importCSV(text, mode){
  var rows = parseCSV(text);
  if (rows.length < 2) throw new Error('empty');
  var head = rows[0].map(function(h){ return String(h).trim().toLowerCase(); });
  var need = ['course_name','price'];
  need.forEach(function(k){ if (head.indexOf(k) === -1) throw new Error('missing column: ' + k); });
  var col = function(r, k){ var ix = head.indexOf(k); return ix === -1 ? '' : String(r[ix] == null ? '' : r[ix]).trim(); };

  var groups = {}, order = [];
  rows.slice(1).forEach(function(r){
    var key = col(r,'course_id') || ('name:' + col(r,'course_name').toLowerCase());
    if (!groups[key]) { groups[key] = { rows:[], id: col(r,'course_id') }; order.push(key); }
    groups[key].rows.push(r);
  });

  var created = 0, updated = 0;
  var fresh = [];
  order.forEach(function(key){
    var g = groups[key], r0 = g.rows[0];
    var name = col(r0,'course_name');
    if (!name) return;
    var priceRaw = col(r0,'price').replace(/[^0-9.\-]/g,'');
    var price = priceRaw === '' ? null : parseFloat(priceRaw);
    var catId = col(r0,'category_id');
    if (!catById(catId)) catId = (DB.cats[0]||{}).id;

    var mods = [], seen = {};
    g.rows.forEach(function(r){
      var mn = col(r,'module'), ln = col(r,'lesson');
      if (!mn && !ln) return;
      if (!mn) mn = 'General';
      if (!seen[mn]) { seen[mn] = { id: uid('m'), name: mn, lessons: [] }; mods.push(seen[mn]); }
      if (ln) seen[mn].lessons.push(ln);
    });

    var numOrNull = function(k){ var v = col(r0,k).replace(/[^0-9.\-]/g,''); return v === '' ? null : parseFloat(v); };
    var rec = {
      c: catId, n: name, price: price,
      hrs: numOrNull('hours'), sess: numOrNull('sessions'),
      dur: numOrNull('hours_per_session') || (DB.cfg.dur || 3),
      desc: col(r0,'description') || '',
      nofull: /^(yes|true|1)$/i.test(col(r0,'no_fullpay')),
      unit: col(r0,'unit') || null, kw: col(r0,'keywords') || '',
      titles: col(r0,'titles') ? col(r0,'titles').split('|').map(function(s){ return s.trim(); }).filter(Boolean) : [],
      bundleable: /^(no|false|0)$/i.test(col(r0,'bundleable')) ? false : true,
      hidden: /^(yes|true|1)$/i.test(col(r0,'hidden')),
      note: col(r0,'note') || null,
      modules: mods
    };

    var existing = g.id ? itemById(g.id) : null;
    if (mode === 'new') {
      rec.id = uid('i'); fresh.push(rec); created++;
    } else if (existing) {
      rec.id = existing.id; rec.tlab = existing.tlab;
      DB.items = DB.items.map(function(x){ return x.id === existing.id ? rec : x; });
      updated++;
    } else {
      rec.id = g.id || uid('i'); fresh.push(rec); created++;
    }
  });
  DB.items = DB.items.concat(fresh);
  return { created: created, updated: updated };
}
function download(filename, text, mime){
  try {
    var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    return true;
  } catch(e){ return false; }
}


