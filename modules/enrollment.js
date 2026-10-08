/* CSDA enrollment state, rendering, validation, documents, and events. */
/* ================= ENROLLMENT ================= */
var E = null, eStep = 1, enrollErrors = {};
function clearEnrollError(id){
  if (!id || !enrollErrors[id]) return;
  delete enrollErrors[id];
  var n = document.getElementById(id), msg = document.getElementById(id + '_err');
  if (n) { n.classList.remove('bad'); n.removeAttribute('aria-invalid'); n.removeAttribute('aria-describedby'); }
  if (msg) msg.remove();
}
function applyEnrollErrors(){
  Object.keys(enrollErrors).forEach(function(id){
    var n = document.getElementById(id); if (!n) return;
    n.classList.add('bad');
    n.setAttribute('aria-invalid', 'true');
    n.setAttribute('aria-describedby', id + '_err');
    if (!document.getElementById(id + '_err')) {
      var msg = document.createElement('div');
      msg.className = 'ferr'; msg.id = id + '_err'; msg.textContent = enrollErrors[id];
      n.insertAdjacentElement('afterend', msg);
    }
  });
}
function setStudentPhoto(data){if(!E||!data)return;E.student.photo={full:data,zoom:1,x:50,y:50};renderEnroll();toast('Student photo added to the private record');}
function blankEnroll(pre){
  return {
    ref:'', date: today(),
    student:{ name:'', educ:'', dob:'', provider:'', mode:'Face-to-Face', photo:null },
    guardian:{ name:'', rel:'Parent', mobile:'', email:'', address:'', verified:false },
    trainer:{id:'',name:'',email:''},trainerAssignments:[],
    consent: { gName:'', gRel:'Parent', gMobile:'', call:false, dpa:false, money:false,
               signed:false, signedAt:'' },
    /* click-wrap: both start unchecked, as the deployment rule requires */
    agree: { privacy:false, privacyAt:'', terms:false, termsAt:'' },
    payments: [],               // money actually received, in order
    baseline: null,             // the quote as first agreed, for honest before/after
    trainerAuto: true,          // false once a rep overrides the course's trainer
    trainerCustom: false,       // true when the trainer was typed in rather than picked
    trainerSave: false,         // ask to file a typed-in trainer in the pool
    courses: (pre && pre.courses) ? pre.courses.slice() : [],
    courseTrainers: {},
    promos: (pre && pre.promos) ? pre.promos : {},
    plan: (pre && pre.plan) ? pre.plan : (DB.plans[0]||{}).id,
    sched:{ start:'', end:'', count:8, tstart: DB.cfg.tstart || '13:00', dur: DB.cfg.dur || 3,
            hrs:0, autoCount:true, sat:false, askSat:false, skips:[], dates:[], times:[] },
    notes:''
  };
}
/* Total contact hours across the chosen courses — the quantity that stays fixed
   when the rep changes how long each session runs. */
/* "4 months · 17 weeks" for a booked date range */
function rangeLabel(a, b){
  if (!a || !b || b < a) return '';
  var d1 = dateOf(a), d2 = dateOf(b);
  var days = Math.round((d2 - d1) / 86400000) + 1;
  var months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  if (d2.getDate() < d1.getDate()) months--;
  var weeks = Math.round(days / 7);
  var out = [];
  if (months >= 1) out.push(months + ' month' + (months === 1 ? '' : 's'));
  out.push(weeks + ' week' + (weeks === 1 ? '' : 's'));
  return out.join(' \u00b7 ');
}

/* A long-form course (the 4-month MasterClass) is booked as a date range: there is no
   every-other-day session list to generate, only a start and an end. */
function isDateRange(ids){
  return (ids || []).some(function(id){ var i = itemById(id); return !!(i && i.daterange); });
}

/* sessions across a bundle: an explicit count when the course has one, otherwise
   derived from its hours and the house cap */
function totalSessions(ids){
  return (ids || []).reduce(function(sum, id){
    var i = itemById(id); if (!i) return sum;
    if (i.sess) return sum + i.sess;
    if (i.hrs)  return sum + sessionsForDuration(i.hrs, i.dur || DB.cfg.dur || 3);
    return sum;
  }, 0);
}
function totalHours(ids){
  return ids.map(itemById).filter(Boolean).reduce(function(s,i){
    if (i.hrs) return s + i.hrs;
    if (i.sess && i.dur) return s + i.sess * i.dur;   // hours implied by the course's own plan
    return s;
  }, 0);
}
/* session count + duration implied by the chosen courses */
function schedDefaults(ids){
  var its = ids.map(itemById).filter(Boolean);
  var dur = its.reduce(function(m,i){ return Math.max(m, i.dur || 0); }, 0) || (DB.cfg.dur || 3);
  var hrs = totalHours(ids);
  /* The run has to cover every course in the bundle, so it comes from the combined
     contact hours. Taking the largest single course's session count — as this used to —
     left three 8-session courses still showing 8. Courses with no published hours fall
     back to their own session counts. */
  var cnt = sessionsForDuration(hrs, dur) || totalSessions(ids) || 8;
  return { count: cnt, dur: dur, hrs: hrs };
}
/* Re-derive the number of sessions after the session length changes, so the
   programme still delivers the same total contact hours. */
function sessionsForDuration(hrs, dur){
  if (!hrs || !dur || dur <= 0) return null;
  return Math.max(1, Math.ceil((hrs / dur) - 0.0001));
}
function ensureDates(){
  if(!E.trainerAssignments)E.trainerAssignments=[];
  document.querySelectorAll('[data-taix]').forEach(function(row){var ix=+row.getAttribute('data-taix'),a=E.trainerAssignments[ix];if(!a)return;var q=function(sel){var n=row.querySelector(sel);return n?n.value:'';};a.trainerId=q('[data-ta="trainer"]');var tr=trainerById(a.trainerId);a.name=tr?tr.name:'';a.start=q('[data-ta="start"]');a.end=q('[data-ta="end"]');a.hours=Math.max(0,parseFloat(q('[data-ta="hours"]'))||0);});
  var s = E.sched;
  if (isDateRange(E.courses)) {
    /* a booked range, not a session list: two anchor dates drive the payment stages */
    if (!s.start) { s.dates = []; s.times = []; return; }
    s.dates = s.end && s.end >= s.start ? [s.start, s.end] : [s.start];
    s.count = s.dates.length;
    s.times = s.dates.map(function(){
      return { a: s.tstart, b: addMinutes(s.tstart, s.dur * 60) };
    });
    return;
  }
  if (!s.start) { s.dates = []; s.times = []; return; }
  if (!s.dates) s.dates = [];
  if (!s.times) s.times = [];
  if (!s.dates.length) {
    s.dates = genSessions(s.start, s.count, s.sat, s.skips);
  } else if (s.dates.length < s.count) {
    /* more sessions requested — carry on the every-other-day walk from the last one
       so the rep's manual overrides above are left untouched */
    var tail = genSessions(s.dates[s.dates.length-1], s.count - s.dates.length + 1, s.sat, s.skips).slice(1);
    s.dates = s.dates.concat(tail);
  } else if (s.dates.length > s.count) {
    s.dates = s.dates.slice(0, s.count);
  }
  s.dates = s.dates.map(function(dt, i){ return dt || genSessions(s.start, s.count, s.sat, s.skips)[i]; });
  for (var i = 0; i < s.count; i++) {
    if (!s.times[i]) s.times[i] = { a: s.tstart, b: addMinutes(s.tstart, s.dur * 60) };
  }
  s.times.length = s.count;
  autoAllocateTrainerSessions();
}
function trainerAllocationPool(){
  var rows=[];
  if(E.trainer&&E.trainer.id)rows.push({id:E.trainer.id,name:E.trainer.name||''});
  (E.trainerAssignments||[]).forEach(function(a){if(a.trainerId&&!rows.some(function(x){return x.id===a.trainerId;}))rows.push({id:a.trainerId,name:a.name||(trainerById(a.trainerId)||{}).name||''});});
  Object.keys(E.courseTrainers||{}).forEach(function(cid){var id=E.courseTrainers[cid],tr=trainerById(id);if(id&&!rows.some(function(x){return x.id===id;}))rows.push({id:id,name:(tr||{}).name||''});});
  return rows;
}
function autoAllocateTrainerSessions(){
  var s=E.sched||{},pool=trainerAllocationPool(),dates=s.dates||[];
  if(!dates.length||!pool.length)return;
  if(!s.trainerIds)s.trainerIds=[];
  var courseBlocks=[],courseTotal=0;(E.courses||[]).forEach(function(cid){var it=itemById(cid),n=Math.max(1,+((it||{}).sess)||1);courseTotal+=n;courseBlocks.push({id:cid,end:courseTotal});});
  dates.forEach(function(d,i){var unit=courseTotal?((i+.5)*courseTotal/dates.length):0,block=courseBlocks.filter(function(b){return unit<=b.end;})[0],courseTrainer=block&&E.courseTrainers&&E.courseTrainers[block.id];if(courseTrainer)s.trainerIds[i]=courseTrainer;else if(!s.trainerIds[i]||!pool.some(function(x){return x.id===s.trainerIds[i];}))s.trainerIds[i]=pool[Math.min(pool.length-1,Math.floor(i*pool.length/dates.length))].id;});
  s.trainerIds.length=dates.length;
  var share=(+s.hrs||(+s.dur||0)*dates.length)/pool.length;
  (E.trainerAssignments||[]).forEach(function(a){var idx=pool.findIndex(function(x){return x.id===a.trainerId;}),owned=[];s.trainerIds.forEach(function(id,i){if(id===a.trainerId)owned.push(i);});if(idx>=0&&owned.length){a.start=dates[owned[0]];a.end=dates[owned[owned.length-1]];a.hours=Math.round(share*100)/100;a.suggestedStart=idx?dates[Math.ceil(idx*dates.length/pool.length)]||'':'';}});
}
function courseEndingLabel(ix){var at=0,names=[];(E.courses||[]).forEach(function(id){var it=itemById(id);at+=Math.max(1,+((it||{}).sess)||1);if(ix+1===Math.min((E.sched.dates||[]).length,at))names.push((it||{}).n||id);});return names.join(' / ');}
/* Switching a class date off: it leaves the run, and only the sessions after it
   move up — anything the rep already adjusted by hand before that point stays put.
   A replacement date is added at the end so the course still delivers its hours. */
function dropSession(ix){
  var s = E.sched, dates = s.dates || [];
  if (ix < 0 || ix >= dates.length) return;
  var gone = dates[ix];
  if (!s.skips) s.skips = [];
  if (s.skips.indexOf(gone) === -1) s.skips.push(gone);

  /* The dates after it simply move up — that keeps the established Mon/Wed/Fri beat
     instead of restarting the every-other-day count from a new weekday — and one
     fresh date is added at the end so the course still delivers its hours. */
  var want = dates.length;
  var out = dates.filter(function(d){ return d !== gone; });
  if (!out.length) {
    out = genSessions(s.start, want, s.sat, s.skips);
    if (out.length) s.start = out[0];
  } else {
    var cursor = out[out.length - 1], guard = 0;
    while (out.length < want && guard++ < 200) {
      cursor = nextSessionAfter(cursor, s.sat, s.skips);
      out.push(cursor);
    }
    if (ix === 0) s.start = out[0];               // the run now begins later
  }
  s.dates = out;
  s.times = s.dates.map(function(_, i){
    return (s.times && s.times[i]) || { a: s.tstart, b: addMinutes(s.tstart, s.dur * 60) };
  });
  toast('Session removed — later dates moved up, ' + s.dates.length + ' sessions kept');
}
/* putting a switched-off date back */
function restoreSession(iso){
  var s = E.sched;
  s.skips = (s.skips || []).filter(function(d){ return d !== iso; });
  s.dates = [];                                   // rebuild cleanly from the start
  ensureDates();
  toast('Date restored — schedule rebuilt');
}

function regenDates(){
  E.sched.dates = genSessions(E.sched.start, E.sched.count, E.sched.sat, E.sched.skips);
  E.sched.times = [];
  ensureDates();
}
/* nudge one session by a day, hopping over any day the rule forbids */
function shiftSession(ix, dir){
  var s = E.sched, d = dateOf(s.dates[ix]);
  if (!d) return;
  do { d.setDate(d.getDate() + dir); } while (isBlockedDay(isoOf(d), s.sat, s.skips));
  s.dates[ix] = isoOf(d);
}
function nextRef(){
  var d = new Date();
  var seq = String(DB.cfg.seq || 1).padStart(4,'0');
  return 'CSDA-' + d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0') + '-' + seq;
}
function openEnroll(pre){
  trackEvent('enrollment_started');
  eTab = 'student'; enrollErrors = {};
  E = blankEnroll(pre); eStep = 1;
  if (E.courses.length) {
    var sdf = schedDefaults(E.courses);
    E.sched.count = sdf.count; E.sched.dur = sdf.dur; E.sched.hrs = sdf.hrs;
  }
  document.getElementById('eKick').textContent = 'Enrollment';
  document.getElementById('eTitle').textContent = 'Enroll a Student';
  renderEnroll();
  lockPage(); scrim.classList.add('on'); enrollM.classList.add('on'); openKind = 'enroll';
}
document.getElementById('enrollBtn').onclick = function(){ openEnroll(null); };
document.getElementById('rentBtn').onclick = openRent;
document.getElementById('rClose').onclick = function(){ closeWithDataCheck('rent'); };

document.getElementById('rBody').addEventListener('click', function(e){
  var kc = e.target.closest('[data-kit]');
  if (kc && rentForm) {
    var g0 = function(id){ var n = document.getElementById(id); return n ? n.value : ''; };
    rentForm.name = g0('rf_name'); rentForm.org = g0('rf_org');
    rentForm.purpose = g0('rf_purpose'); rentForm.note = g0('rf_note');
    rentForm.hrs = parseFloat(g0('rf_hrs')) || rentForm.hrs;
    var k = kc.getAttribute('data-kit');
    rentForm.kit[k] = !rentForm.kit[k];
    renderRent();
    return;
  }
  var t = e.target.closest('[data-ract]');
  if (!t) return;
  var a = t.getAttribute('data-ract');
  var ref = t.getAttribute('data-sess');
  if (a === 'start') {
    rentEdit = null; rentOpen = null;
    rentForm = { unitId: t.getAttribute('data-unit'), hrs: 1, name:'', org:'', purpose:'',
                 kit: { laptop:true, tablet:true, lcable:true, wcable:true, mouse:true, pen:true, bag:true },
                 note:'' };
    renderRent();
    var fn = document.getElementById('rf_name'); if (fn) fn.focus();
  }
  else if (a === 'open')      { rentForm = null; rentEdit = null; rentOpen = ref; renderRent(); }
  else if (a === 'collapse')  { rentOpen = null; renderRent(); }
  else if (a === 'start-go')     { startSession(); }
  else if (a === 'start-cancel') { rentForm = null; renderRent(); }
  else if (a === 'add')          { addTime(ref, parseInt(t.getAttribute('data-min'), 10) || 0); }
  else if (a === 'close')        { closeSession(ref); }
  else if (a === 'slip')         { printSlip(ref); }
  else if (a === 'csv')          { downloadRentalCSV(); }
  else if (a === 'edit')         { rentForm = null; rentEdit = ref; renderRent();
                                   var en = document.getElementById('re_name'); if (en) en.focus(); }
  else if (a === 'edit-cancel')  { rentEdit = null; renderRent(); }
  else if (a === 'edit-save') {
    var se = (DB.rentals||[]).filter(function(x){ return x.ref === rentEdit; })[0];
    if (se) {
      var g = function(id){ var n = document.getElementById(id); return n ? n.value : ''; };
      se.name = g('re_name').trim(); se.org = g('re_org').trim(); se.purpose = g('re_purpose').trim();
      var adj = parseInt(g('re_adj'), 10) || 0;
      if (adj) {
        se.endsMs += adj * 60000;
        se.added = (se.added || 0) + adj;
        if (se.endsMs > Date.now()) se.alarmed = false;
      }
      save();
      toast('Session updated' + (adj ? ' \u00b7 ' + (adj>0?'+':'') + adj + ' min' : ''));
    }
    rentEdit = null; renderRent();
  }
});

function syncEnroll(){
  if (!E) return;
  /* The form is tabbed, so most inputs are absent most of the time. Reading a missing
     field must leave the stored value alone — returning '' here would erase the
     student's details the moment the rep opened another tab. */
  var g = function(id, cur){
    var n = document.getElementById(id);
    return n ? n.value : (cur == null ? '' : cur);
  };
  E.student.name = g('e_sname', E.student.name).trim();
  E.student.educ = g('e_educ', E.student.educ).trim();
  E.student.dob = g('e_dob', E.student.dob);
  E.student.provider = g('e_prov', E.student.provider).trim();
  E.student.mode = g('e_mode', E.student.mode);
  if(E.student.photo){E.student.photo.zoom=parseFloat(g('studentPhotoZoom',E.student.photo.zoom||1))||1;E.student.photo.x=parseFloat(g('studentPhotoX',E.student.photo.x||50));E.student.photo.y=parseFloat(g('studentPhotoY',E.student.photo.y||50));}
  if(!E.courseTrainers)E.courseTrainers={};document.querySelectorAll('[data-course-trainer]').forEach(function(n){E.courseTrainers[n.getAttribute('data-course-trainer')]=n.value||'';});
  var firstCourseTrainer=E.courses.map(function(id){return E.courseTrainers[id];}).filter(Boolean)[0];if(firstCourseTrainer&&(!E.trainer||!E.trainer.id)){var fct=trainerById(firstCourseTrainer);if(fct)E.trainer={id:fct.id,name:fct.name,email:fct.email||''};}
  E.guardian.name = g('e_gname', E.guardian.name).trim();
  E.guardian.rel = g('e_grel', E.guardian.rel).trim();
  E.guardian.mobile = g('e_gmob', E.guardian.mobile).trim();
  E.guardian.email = g('e_gmail', E.guardian.email).trim();
  E.guardian.address = g('e_gaddr', E.guardian.address).trim();
  var vn = document.getElementById('e_verified');
  if (vn) E.guardian.verified = vn.classList.contains('on');
  E.notes = g('e_notes', E.notes).trim();
  E.date = g('e_date', E.date) || today();
  if (!E.consent) E.consent = blankEnroll().consent;
  E.consent.gName   = g('c_gname', E.consent.gName).trim();
  E.consent.gRel    = g('c_grel', E.consent.gRel);
  E.consent.gMobile=g('c_gmob',E.consent.gMobile).trim();if(isMinor()){E.consent.gName=E.guardian.name;E.consent.gRel=E.guardian.rel;E.consent.gMobile=E.guardian.mobile;}

  var tsel = document.getElementById('e_trainer');
  if (tsel) {
    var prevId = (E.trainer && E.trainer.id) || '';
    var wasCustom = !!E.trainerCustom;
    if (tsel.value === '__custom') {
      /* typed in by hand — no pool entry behind it */
      E.trainerCustom = true;
      E.trainerAuto = false;
      E.trainer = {
        id: '',
        name: g('e_trname', E.trainer && E.trainer.name).trim(),
        email: g('e_tremail', E.trainer && E.trainer.email).trim()
      };
      var sv = document.getElementById('e_trsave');
      if (sv) E.trainerSave = sv.classList.contains('on');
    } else {
      E.trainerCustom = false;
      var tr = trainerById(tsel.value);
      E.trainer = tr ? { id:tr.id, name:tr.name, email:tr.email } : { id:'', name:'', email:'' };
      if (tsel.value !== prevId || wasCustom) E.trainerAuto = false;
      var temail = document.getElementById('e_tremail');
      if (temail) temail.value = E.trainer.email;
    }
  }
  var s = E.sched;
  if (isDateRange(E.courses)) {
    if (document.getElementById('e_start')) {
      s.start  = g('e_start', s.start);
      s.end    = g('e_end', s.end);
      s.tstart = g('e_tstart', s.tstart) || s.tstart;
      ensureDates();
    }
    return;
  }
  if (document.getElementById('e_start')) {
    var wasStart = s.start, wasT = s.tstart, wasDur = s.dur, wasCount = s.count;
    s.start = g('e_start', s.start);
    s.tstart = g('e_tstart', s.tstart) || s.tstart;
    s.dur = parseFloat(g('e_dur', s.dur)) || s.dur;
    var typedCount = Math.max(1, parseInt(g('e_count', s.count), 10) || 1);

    if (s.dur !== wasDur) {
      /* Hours per session changed. The contact-hour budget is what the family bought,
         so re-derive how many sessions it now takes and re-flow the calendar. */
      var derived = sessionsForDuration(s.hrs, s.dur);
      if (derived) { s.count = derived; s.autoCount = true; }
      else { s.count = typedCount; }
    } else {
      s.count = typedCount;
      /* typing a count by hand detaches it from the hour budget */
      if (typedCount !== wasCount) s.autoCount = false;
    }

    /* a new first-session date re-flows the whole run; a new session length re-flows
       both the calendar and the clock. Stale per-row inputs must not be read back. */
    var reflowDates = s.start !== wasStart || s.dur !== wasDur;
    var reflowTimes = reflowDates || s.tstart !== wasT;
    if (reflowDates) { s.dates = []; }
    if (reflowTimes) { s.times = []; }
    ensureDates();
    for (var i = 0; !reflowDates && !reflowTimes && i < s.count; i++) {
      var dn = document.getElementById('sd_' + i),
          an = document.getElementById('sa_' + i),
          bn = document.getElementById('sb_' + i);
      /* No schedule on screen yet (no start date): nothing to read back. */
      if (!dn && !an && !bn) continue;
      if (!s.times[i]) s.times[i] = { a: s.tstart, b: addMinutes(s.tstart, s.dur * 60) };
      if (dn && dn.value) s.dates[i] = dn.value;

      /* Editing a start time should drag the finish along with it: 8:00–11:00 moved
         to 13:00 becomes 13:00–16:00. The row's own span is preserved, so a session
         someone deliberately shortened stays short. An explicit edit to the end time
         always wins. */
      var prevA = s.times[i].a, prevB = s.times[i].b;
      var newA = (an && an.value) ? an.value : prevA;
      var newB = (bn && bn.value) ? bn.value : prevB;
      if (newA !== prevA && newB === prevB) {
        var span = minutesBetween(prevA, prevB);
        if (!span || span <= 0) span = Math.round(s.dur * 60);
        newB = addMinutes(newA, span);
      }
      s.times[i].a = newA;
      s.times[i].b = newB;
      var tn=document.getElementById('st_'+i);if(tn&&tn.value){if(!s.trainerIds)s.trainerIds=[];s.trainerIds[i]=tn.value;}
    }
    autoAllocateTrainerSessions();
    /* the end-date picker only counts as an override when the grid on screen still
       matches the current session count — otherwise it holds a stale last date */
    var en = document.getElementById('e_end');
    var domInSync = !!document.getElementById('sd_' + (s.count - 1));
    if (!reflowDates && domInSync && en && en.value && s.dates.length) {
      s.dates[s.dates.length - 1] = en.value;
    }
  }
}

/* ---------- the enrollment form's tabs ----------
   Five short sections instead of one long scroll. Each tab reports whether it is
   complete, so a rep can see at a glance what is still outstanding. */
var ENROLL_TABS = [
  ['student',  'Student'],
  ['guardian', 'Emergency contact'],
  ['courses',  'Courses'],
  ['schedule', 'Schedule'],
  ['payment',  'Payment'],
  ['legal',    'Agreements']
];

/* '' = fine, 'todo' = something required is missing, 'warn' = worth a look */
function enrollTabState(tab){
  if (tab === 'student')  return E.student.name ? '' : 'todo';
  if (tab === 'guardian') {
    if(isMinor())return consentComplete()?'':'todo';
    return '';
  }
  if (tab === 'courses')  return E.courses.length ? '' : 'todo';
  if (tab === 'schedule') {
    if (!E.courses.length) return '';
    if ((E.courses||[]).some(function(id){return !(E.courseTrainers||{})[id];})) return 'todo';
    if (!E.trainer || !String(E.trainer.name||'').trim()) return 'todo';
    if (isDateRange(E.courses)) {
      if (!E.sched.start || !E.sched.end) return 'todo';
      return E.sched.end < E.sched.start ? 'warn' : '';
    }
    if (!E.sched.start) return 'todo';
    var bad = (E.sched.dates || []).filter(function(d){ return isBlockedDay(d, E.sched.sat, E.sched.skips); }).length;
    return bad ? 'warn' : '';
  }
  if (tab === 'payment')  return E.plan ? '' : 'todo';
  if (tab === 'legal')    return agreementsComplete() ? '' : 'todo';
  return '';
}

function enrollTabLabel(tab){
  return tab[0]==='guardian'?(isMinor()?'Primary Guardian & Guarantor':'Emergency Contact (optional)'):tab[1];
}
function enrollTabBar(){
  return '<div class="tabs etabs" role="tablist" aria-label="Enrollment sections">' + ENROLL_TABS.map(function(t){
    var st = enrollTabState(t[0]), on = eTab === t[0], label = enrollTabLabel(t);
    return '<button id="e-tab-' + t[0] + '" data-etab="' + t[0] + '" role="tab" ' +
      'aria-selected="' + (on ? 'true' : 'false') + '" aria-controls="e-tab-panel" ' +
      'tabindex="' + (on ? '0' : '-1') + '" class="' + (on ? 'on' : '') + '">' +
      esc(label) + (st ? '<span class="tdot ' + st + '" aria-hidden="true"></span>' +
        '<span class="sr-only"> — ' + (st === 'warn' ? 'needs attention' : 'incomplete') + '</span>' : '') + '</button>';
  }).join('') + '</div>';
}

/* Back / Next across the tabs, with Review offered on the last one — and on any tab
   once every section is filled in, so nobody has to walk to the end to submit. */
function enrollTabNav(){
  var ix = ENROLL_TABS.map(function(t){ return t[0]; }).indexOf(eTab);
  var prev = ix > 0 ? ENROLL_TABS[ix - 1] : null;
  var next = ix < ENROLL_TABS.length - 1 ? ENROLL_TABS[ix + 1] : null;
  var outstanding = ENROLL_TABS.filter(function(t){ return enrollTabState(t[0]) === 'todo'; });

  /* Next walks the rep through the form; Review only appears once they reach the end,
     and Finalize waits until the generated form itself. */
  var warnings=ENROLL_TABS.filter(function(t){return enrollTabState(t[0])==='warn';}),complete=ENROLL_TABS.length-outstanding.length;
  var h='<div class="note" style="margin:0 0 8px"><b>'+complete+' of '+ENROLL_TABS.length+' sections complete</b>'+(outstanding.length?' · Missing: '+outstanding.map(function(t){return '<button class="btn sm" data-etab="'+t[0]+'" style="margin:3px">'+esc(enrollTabLabel(t))+'</button>';}).join(''):' · Ready for review')+(warnings.length?' · '+warnings.length+' section'+(warnings.length===1?'':'s')+' need attention':'')+'</div><div class="enav">' +
    (prev ? '<button class="btn" data-etab="' + prev[0] + '">&lsaquo; ' + esc(enrollTabLabel(prev)) + '</button>'
          : '<span></span>');

  if (next) {
    h += '<button class="btn pri" data-etab="' + next[0] + '">Next: ' + esc(enrollTabLabel(next)) + ' &rsaquo;</button>';
  }
  h += '</div>';

  if (!next) {
    if (outstanding.length) {
      h += '<div class="enote">Still to fill in: <b>' +
        outstanding.map(function(t){ return esc(enrollTabLabel(t)); }).join('</b>, <b>') + '</b></div>';
    }
    h += '<button class="btn pri blk" data-eact="review" style="padding:13px;font-size:13.5px">' +
         'Review &amp; generate enrollment form &rsaquo;</button>';
  }
  return h;
}

function renderEnroll(){
  var b = document.getElementById('eBody');
  if (eStep === 2) { b.innerHTML = enrollPreview(); return; }
  ensureDates();
  var r = quote(E.courses, E.promos, E.plan);
  var sd = E.sched;                       // needed by both the Schedule and Payment tabs
  var tabIx = ENROLL_TABS.map(function(t){ return t[0]; }).indexOf(eTab);
  var h = '<div class="enrollmeter" role="progressbar" aria-label="Enrollment progress" aria-valuemin="1" ' +
    'aria-valuemax="6" aria-valuenow="'+(tabIx+1)+'"><i style="width:'+(((tabIx+1)/ENROLL_TABS.length)*100)+'%"></i></div>' +
    '<div class="enprogress" role="status" aria-label="Enrollment step">' +
      '<b>Step ' + (tabIx + 1) + ' of ' + ENROLL_TABS.length + ' — ' + esc(enrollTabLabel(ENROLL_TABS[tabIx])) + '</b>' +
      '<span>' + (ENROLL_TABS.length - tabIx - 1) + ' section' +
        ((ENROLL_TABS.length - tabIx - 1) === 1 ? '' : 's') + ' remaining</span></div>';

  h += enrollTabBar();
  h += '<div id="e-tab-panel" role="tabpanel" aria-labelledby="e-tab-' + eTab + '">';

  /* ---------- student ---------- */
  if (eTab === 'student') {
  h += '<div class="ms"><div class="msh">Student details</div><div class="studentCaptureGrid"><div>' +
    '<div class="frow"><div class="field"><label class="flab" for="e_sname">Full name <span class="req">*</span></label>' +
      '<input class="finp" id="e_sname" value="'+esc(E.student.name)+'" placeholder="Surname, First Name M.I."></div>' +
    '<div class="field"><label class="flab" for="e_educ">Highest educational attainment</label>' +
      '<select class="finp" id="e_educ"><option value="">— select —</option>' +
      EDUC_LEVELS.map(function(l){
        return '<option'+(E.student.educ===l?' selected':'')+'>'+esc(l)+'</option>';
      }).join('') +
      (E.student.educ && EDUC_LEVELS.indexOf(E.student.educ) === -1
        ? '<option selected>'+esc(E.student.educ)+'</option>' : '') +
      '</select></div></div>' +
    '<div class="frow f3"><div class="field"><label class="flab" for="e_dob">Date of birth</label>' +
      '<input class="finp" id="e_dob" type="date" value="'+esc(E.student.dob)+'"></div>' +
    '<div class="field"><label class="flab" for="e_prov">Provider / school</label>' +
      '<input class="finp" id="e_prov" value="'+esc(E.student.provider)+'"></div>' +
    '<div class="field"><label class="flab" for="e_mode">Delivery mode</label>' +
      '<select class="finp" id="e_mode">' + ['Face-to-Face','Online','Hybrid'].map(function(m){
        return '<option'+(E.student.mode===m?' selected':'')+'>'+m+'</option>'; }).join('') + '</select></div></div></div>' +
      '<aside class="studentPhotoPane"><div class="flab">Student profile photo <span class="sc">Record only</span></div>'+
      '<div class="studentPhotoFrame">'+(E.student.photo&&E.student.photo.full?'<img src="'+esc(E.student.photo.full)+'" alt="Student profile preview" style="transform:translate('+(E.student.photo.x-50)+'%,'+(E.student.photo.y-50)+'%) scale('+E.student.photo.zoom+');">':'<div class="picknone">No student photo</div>')+'</div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-eact="student-camera">Use camera</button><label class="btn sm" style="cursor:pointer">Upload photo<input type="file" id="studentPhotoFile" accept="image/jpeg,image/png,image/webp" style="display:none"></label></div>'+
      (E.student.photo&&E.student.photo.full?'<label class="flab">Zoom<input class="finp" id="studentPhotoZoom" type="range" min="1" max="3" step="0.05" value="'+E.student.photo.zoom+'"></label><label class="flab">Horizontal placement<input class="finp" id="studentPhotoX" type="range" min="0" max="100" value="'+E.student.photo.x+'"></label><label class="flab">Vertical placement<input class="finp" id="studentPhotoY" type="range" min="0" max="100" value="'+E.student.photo.y+'"></label><button class="btn dgr sm" data-eact="student-photo-remove">Remove photo</button>':'')+
      '<div class="note">Stored only in the student record and encrypted session backup. It is not printed on the enrollment form.</div></aside></div></div>';

  }

  /* ---------- mutually exclusive guardian / adult contact paths ---------- */
  if (eTab === 'guardian') {
    var age=E.student.dob?ageOn(E.student.dob,E.date):null,C=E.consent||{};
    if(isMinor()){
      h+='<section class="enrollment-path minor-path" aria-labelledby="minorGuardianTitle"><div class="ms"><div class="msh" id="minorGuardianTitle">Primary Guardian &amp; Guarantor Information</div><div class="note" style="margin-top:0">Required because the applicant is under 18. These details are used for guardian, billing guarantor, and emergency communication so they are entered only once.</div><div class="frow"><div class="field"><label class="flab" for="e_gname">Full name <span class="req">*</span></label><input class="finp" id="e_gname" value="'+esc(E.guardian.name||'')+'"></div><div class="field"><label class="flab" for="e_grel">Relationship <span class="req">*</span></label><input class="finp" id="e_grel" value="'+esc(E.guardian.rel||'Parent')+'"></div></div><div class="frow"><div class="field"><label class="flab" for="e_gmob">Mobile <span class="req">*</span></label><input class="finp" id="e_gmob" value="'+esc(E.guardian.mobile||'')+'"></div><div class="field"><label class="flab" for="e_gmail">Email <span class="req">*</span></label><input class="finp" id="e_gmail" type="email" value="'+esc(E.guardian.email||'')+'"></div></div><div class="field"><label class="flab" for="e_gaddr">Home address <span class="req">*</span></label><input class="finp" id="e_gaddr" value="'+esc(E.guardian.address||'')+'"></div><div class="ck'+(E.guardian.verified?' on':'')+'" id="e_verified"><div class="cbox">&#10003;</div><div class="ckt">Guardian number confirmed by ringing</div></div></div><div class="consentbox"><div class="conh">Guardian consent and guarantor declarations</div>'+CONSENT_ITEMS.map(function(it){return '<div class="ck conck'+(C[it[0]]?' on':'')+'" data-consent="'+it[0]+'"><div class="cbox">&#10003;</div><div class="ckt"><b>'+esc(it[1])+'</b><small>'+esc(it[2])+'</small></div></div>';}).join('')+'<div class="ck conck sig'+(C.signed?' on':'')+'" data-consent="signed"><div class="cbox">&#10003;</div><div class="ckt"><b>'+esc(CONSENT_CERT)+'</b></div></div>'+(consentComplete()?'<div class="okbox">Guardian path complete.</div>':'<div class="alert"><div class="ai">&#128274;</div><div class="at"><b>Still required:</b> '+esc(consentMissing().join(', '))+'</div></div>')+'</div></section>';
    }else{
      h+='<section class="enrollment-path adult-path" aria-labelledby="adultContactTitle"><div class="okbox" style="margin-bottom:16px">'+(age===null?'Enter the applicant date of birth to confirm the applicable enrollment path.':'Adult applicant · the student is the sole billing guarantor.')+'</div><div class="ms"><div class="msh" id="adultContactTitle">Emergency Contact <span class="sc">Optional</span></div><div class="note" style="margin-top:0">No guardian or guarantor information is required for an adult. Add an emergency contact only when the student chooses to provide one.</div><div class="frow"><div class="field"><label class="flab" for="e_gname">Contact name</label><input class="finp" id="e_gname" value="'+esc(E.guardian.name||'')+'"></div><div class="field"><label class="flab" for="e_grel">Relationship</label><input class="finp" id="e_grel" value="'+esc(E.guardian.rel||'')+'"></div></div><div class="frow"><div class="field"><label class="flab" for="e_gmob">Mobile</label><input class="finp" id="e_gmob" value="'+esc(E.guardian.mobile||'')+'"></div><div class="field"><label class="flab" for="e_gmail">Email</label><input class="finp" id="e_gmail" type="email" value="'+esc(E.guardian.email||'')+'"></div></div><div class="field"><label class="flab" for="e_gaddr">Address</label><input class="finp" id="e_gaddr" value="'+esc(E.guardian.address||'')+'"></div></div></section>';
    }
  }

  /* ---------- courses ---------- */
  if (eTab === 'courses') {
  h += '<div class="ms"><div class="msh">Courses '+(r.n?'&middot; '+r.n+' selected':'')+'</div>';

  /* A native <select> grouped by category: one tap on a phone, type-ahead on a
     keyboard, and read correctly by screen readers — which a 22-row checkbox
     list was not. Chosen courses become removable chips above it. */
  var picked = E.courses.map(itemById).filter(Boolean);
  h += '<div class="pickwrap">';
  if (picked.length) {
    h += '<div class="pickchips">' + picked.map(function(i){
      return '<span class="pickchip"><span class="pcn2">'+esc(i.n)+'</span>' +
        '<span class="pcp2 mono">'+money(i.price)+'</span>' +
        '<button data-ecourse="'+i.id+'" aria-label="Remove '+esc(i.n)+'" title="Remove">&#10005;</button></span>';
    }).join('') + '</div><div class="ms" style="margin-top:10px"><div class="msh">Assign a trainer to each selected course</div><div class="note" style="margin-top:0">Choose now; generated sessions inherit each course trainer and remain editable in the calendar.</div>'+picked.map(function(i){return '<div class="frow"><b>'+esc(i.n)+'</b>'+trainerSelect('course_trainer_'+i.id,(E.courseTrainers||{})[i.id]||'',' data-course-trainer="'+esc(i.id)+'"')+'</div>';}).join('')+'</div>';
  } else {
    h += '<div class="picknone">No courses chosen yet \u2014 pick one below.</div>';
  }

  var avail = 0;
  var opts = DB.cats.map(function(c){
    if (c.hidden) return '';
    var list = visItems().filter(function(i){
      return i.c === c.id && i.price != null && !i.facility && E.courses.indexOf(i.id) === -1;
    });
    if (!list.length) return '';
    avail += list.length;
    return '<optgroup label="'+esc(c.name)+'">' + list.map(function(i){
      return '<option value="'+esc(i.id)+'">'+esc(i.n)+' \u2014 '+money(i.price).replace(/\u00a0/g,' ')+'</option>';
    }).join('') + '</optgroup>';
  }).join('');

  h += '<label class="flab" for="e_addcourse">Add a course</label>' +
    '<select class="finp" id="e_addcourse"'+(avail?'':' disabled')+'>' +
    '<option value="">'+(avail ? '\u2014 choose a course to add \u2014' : 'every course is already selected')+'</option>' +
    opts + '</select>';
  h += '</div>';

  /* bundle mirror */
  if (r.n) {
    var bp = DB.promos.filter(function(p){ return p.kind==='bundle'; })[0];
    h += '<div style="margin-top:12px">';
    r.items.forEach(function(i){
      h += '<div class="bsum"><span class="sc">'+esc(i.n)+'</span><span class="mono">'+money(i.price)+'</span></div>';
    });
    h += '<div class="bsum" style="border-top:1px solid var(--line);padding-top:9px"><span>Subtotal &middot; '+r.n+
      (r.n===1?' course':' courses')+'</span><span class="mono">'+money(r.sub)+'</span></div>';
    if (bp) {
      var need = (bp.min||3) - r.n;
      h += r.restrictedShort
        ? '<div class="bsum"><span class="sc">Bundle discount unavailable for short courses/workshops</span><span class="sc">—</span></div>'
        : (need <= 0
          ? '<div class="bsum"><span class="em">'+esc(bp.label)+' auto-applied</span><span class="em mono">&minus;'+bp.pct+'%</span></div>'
          : '<div class="bsum"><span class="sc">Add '+need+' more course'+(need===1?'':'s')+' to unlock '+esc(bp.label)+'</span><span class="sc mono">&minus;'+bp.pct+'%</span></div>');
    }
    if (r.pct) h += '<div class="bsum"><span class="em">'+esc(r.best?r.best.label:'Discount')+' applied</span><span class="em mono">&minus;'+money(r.sub-r.net)+'</span></div>';
    h += '<div class="bsum tot"><span><b>Net payable</b></span><span class="em mono">'+money(r.net)+'</span></div></div>';
  }
  h += '</div>';

  /* ---------- discounts ---------- */
  h += '<div class="ms"><div class="msh">Discounts</div><div class="dcopts">';
  DB.promos.forEach(function(p){
    if (p.kind === 'bundle') {
      var ok = !r.restrictedShort && r.n >= (p.min||3);
      h += '<div class="ck'+(ok?' auto':'')+'"><div class="cbox">'+(ok?'&#10003;':'')+'</div><div class="ckt">'+
        esc(p.label)+'<small>'+(r.restrictedShort?'not available for short courses/workshops':
          (ok?'auto-applied &middot; '+p.pct+'%':'add '+((p.min||3)-r.n)+' more'))+'</small></div></div>';
      return;
    }
    var on = !!E.promos[p.id] && (!r.restrictedShort || shortPromoAllowed(p));
    var blocked = (p.kind==='fullpay' && r.allNoFull) || (r.restrictedShort && !shortPromoAllowed(p));
    h += '<div class="ck'+(on?' on':'')+'"'+(blocked?'':' data-epromo="'+p.id+'"')+
      (blocked?' aria-disabled="true" style="opacity:.52"':'')+'>' +
      '<div class="cbox">&#10003;</div><div class="ckt">'+esc(p.label)+
      '<small>'+p.pct+'% off'+(blocked?' &middot; not available for short courses/workshops':'')+'</small></div></div>';
  });
  h += '</div>';
  if (r.totalSel > 1 && !DB.cfg.combine) {
    h += '<div class="alert"><div class="ai">&#9888;</div><div class="at">Compliance Alert: Only one discount ' +
      'may be applied per student per enrollment <span class="cite">Doc Page 16</span>. Recording the best single ' +
      'rate — <b>'+esc(r.selLabels.join(' + '))+'</b> together is not permitted.</div></div>';
  }
  if (r.conflict) {
    h += '<div class="alert"><div class="ai">&#9888;</div><div class="at">The <b>Full Payment</b> discount is void ' +
      'under <b>'+esc(r.plan.name)+'</b> and has been excluded.</div></div>';
  }
  if (r.restrictedShort) {
    h += '<div class="note a" style="font-size:12px"><b>Short-course/workshop rule:</b> only ' +
      '<b>Group of 3+</b> or <b>Early Bird</b> may be applied. Full Payment and Bundle discounts are excluded.</div>';
  }
  h += '</div>';

  }

  /* ---------- schedule ---------- */
  if (eTab === 'schedule') {
  /* ---------- Delivery Team: trainer assignment belongs with schedule planning ---------- */
  h += '<div class="ms"><div class="msh">Delivery Team</div><div class="note" style="margin-top:0">Assign the people delivering this schedule. The primary trainer becomes the automatic Completion Audit signatory.</div></div>';
  var ct = courseTrainer(E.courses);
  var hint = '';
  if (ct && E.trainerAuto && E.trainer && E.trainer.id === ct.id) {
    var src = E.courses.map(itemById).filter(function(i){ return i && i.trainer === ct.id; })[0];
    hint = ' <small style="font-weight:500;color:var(--em2)">— from ' +
           esc(src ? src.n : 'the selected course') + ', change to override</small>';
  } else if (E.trainer && E.trainer.id && ct && E.trainer.id !== ct.id) {
    hint = ' <small style="font-weight:500;color:var(--am2)">— overriding the course trainer</small>';
  } else if (!(DB.trainers || []).length) {
    hint = ' <small style="font-weight:500;color:var(--ter)">— add trainers under Admin &rsaquo; Trainers</small>';
  }
  /* The pool is a convenience, not a gate: if the trainer who will actually take the
     class has not been set up yet, the rep types the name and email straight in. */
  var pool=(DB.trainers||[]).filter(function(t){return t.name&&!/\//.test(t.name);});
  var custom = !!E.trainerCustom;
  h += '<div class="frow"><div class="field"><label class="flab" for="e_trainer">Assigned trainer' + hint + '</label>' +
    '<select class="finp" id="e_trainer">' +
      '<option value=""' + (!custom && !(E.trainer && E.trainer.id) ? ' selected' : '') + '>\u2014 none \u2014</option>' +
      pool.map(function(t){
        return '<option value="'+esc(t.id)+'"'+(!custom && E.trainer && E.trainer.id===t.id?' selected':'')+'>' +
          esc(t.name) + (t.email ? ' \u00b7 ' + esc(t.email) : '') + '</option>';
      }).join('') +
      '<option value="__custom"'+(custom?' selected':'')+'>\u270E Someone else \u2014 type their details</option>' +
    '</select></div>' +
    '<div class="field"><label class="flab" for="e_tremail">Trainer email' +
      (custom ? ' <span class="req">*</span>' : ' <small style="font-weight:500;color:var(--ter)">— receives a reference copy</small>') +
      '</label>' +
      '<input class="finp" id="e_tremail" type="email" value="'+esc((E.trainer && E.trainer.email) || '')+'"' +
      (custom ? ' placeholder="trainer@example.com"' : ' readonly placeholder="filled in from the trainer record"') +
      '></div></div>';

  if (custom) {
    h += '<div class="frow"><div class="field"><label class="flab" for="e_trname">Trainer name <span class="req">*</span></label>' +
      '<input class="finp" id="e_trname" value="'+esc((E.trainer && E.trainer.name) || '')+'" ' +
      'placeholder="Full name of the trainer taking this class"></div>' +
      '<div class="field"><label class="flab">&nbsp;</label>' +
      '<div class="ck'+(E.trainerSave?' on':'')+'" id="e_trsave"><div class="cbox">&#10003;</div>' +
      '<div class="ckt">Add to the trainer pool<small>Saved on finalize, reusable next time</small></div></div>' +
      '</div></div>';
    if (!pool.length) {
      h += '<div class="note" style="font-size:12px;margin-top:0">No trainers are set up yet. Typing the ' +
        'details here is enough to finalise &mdash; tick <b>Add to the trainer pool</b> and they will be ' +
        'on the list next time.</div>';
    }
  }
  if(!E.trainerAssignments)E.trainerAssignments=[];
  h+='<div class="ms" style="margin-top:14px"><div class="msh">Additional trainer time</div><div class="note" style="margin-top:0;font-size:11.5px">Instruction time is divided equally across all assigned trainers (two trainers = 50/50). Generated dates receive a suggested sequential assignment; Admin can change the trainer on any calendar session.</div>';
  E.trainerAssignments.forEach(function(a,ix){h+='<div class="frow" data-taix="'+ix+'"><div class="field"><label class="flab">Trainer</label>'+trainerSelect('ta_tr_'+ix,a.trainerId||'',' data-ta="trainer"')+'</div><div class="field"><label class="flab">Start'+(a.suggestedStart?' · suggested '+esc(shortDate(a.suggestedStart)):'')+'</label><input class="finp" data-ta="start" type="date" value="'+esc(a.start||'')+'"></div><div class="field"><label class="flab">End</label><input class="finp" data-ta="end" type="date" value="'+esc(a.end||'')+'"></div><div class="field"><label class="flab">Equal credited hours</label><input class="finp" data-ta="hours" type="number" min="0" step="0.25" value="'+esc(String(a.hours||''))+'"></div><button class="btn dgr sm" data-eact="trainer-remove" data-ta-remove="'+ix+'">Remove</button></div>';});
  h+='<button class="btn sm" data-eact="trainer-add">+ Add trainer assignment</button></div></div>';

  /* ---- long-form course: a date range, not a session list ---- */
  if (isDateRange(E.courses)) {
    var rangeName = (E.courses.map(itemById).filter(function(i){ return i && i.daterange; })[0] || {}).n || 'This course';
    h += '<div class="ms"><div class="msh">Course dates</div>' +
      '<div class="note" style="margin-top:0;margin-bottom:13px"><b>' + esc(rangeName) + '</b> runs as a ' +
      'continuous programme, so it is booked as a <b>date range</b> rather than a list of sessions. ' +
      'Give the start and end dates; the payment schedule is worked out from them.</div>' +
      '<div class="frow f3"><div class="field"><label class="flab" for="e_start">Start date <span class="req">*</span></label>' +
        '<input class="finp" id="e_start" type="date" value="'+esc(sd.start)+'"></div>' +
      '<div class="field"><label class="flab" for="e_end">End date <span class="req">*</span></label>' +
        '<input class="finp" id="e_end" type="date" value="'+esc(sd.end || '')+'"></div>' +
      '<div class="field"><label class="flab" for="e_tstart">Class time</label>' +
        '<input class="finp" id="e_tstart" type="time" value="'+esc(sd.tstart)+'"></div></div>';
    if (sd.start && sd.end) {
      if (sd.end < sd.start) {
        h += '<div class="alert"><div class="ai">&#9888;</div><div class="at">The end date falls ' +
          '<b>before</b> the start date. Payment due dates cannot be worked out until that is fixed.</div></div>';
      } else {
        h += '<div class="okbox">' + esc(prettyDate(sd.start)) + ' &rarr; ' + esc(prettyDate(sd.end)) +
          ' &middot; <b>' + rangeLabel(sd.start, sd.end) + '</b></div>';
      }
    }
    h += '</div>';
  }
  else {

  h += '<div class="ms"><div class="msh">Class schedule</div>' +
    '<div class="note" style="margin-top:0;margin-bottom:7px">Sessions run <b>every other day</b>; Sundays are skipped' +
    (sd.sat ? ' and Saturdays are included.' : ' and Saturdays are excluded.') + '</div>' +
    '<details class="moreinfo"><summary>How can I adjust individual dates?</summary>' +
    'Type a date, use the calendar, or move it one day with the &lsaquo; and &rsaquo; buttons for holidays or trainer clashes.</details>' +
    '<div class="frow f3"><div class="field"><label class="flab" for="e_start">First session <span class="req">*</span></label>' +
      '<input class="finp" id="e_start" type="date" value="'+esc(sd.start)+'"></div>' +
    '<div class="field"><label class="flab" for="e_count">Number of sessions' +
      (sd.hrs ? ' <small style="font-weight:500;color:var(--ter)">— ' + nn(sd.hrs) + ' hrs \u00f7 ' +
        nn(sd.dur) + ' hrs' + (sd.autoCount ? '' : ' · set by hand') + '</small>' : '') + '</label>' +
      '<input class="finp" id="e_count" type="number" min="1" max="60" value="'+sd.count+'"></div>' +
    '<div class="field"><label class="flab" for="e_end">Last session</label>' +
      '<input class="finp" id="e_end" type="date" value="'+esc(sd.dates[sd.dates.length-1] || '')+'"></div></div>' +
    '<div class="frow f3"><div class="field"><label class="flab" for="e_tstart">Default start time</label>' +
      '<input class="finp" id="e_tstart" type="time" value="'+esc(sd.tstart)+'"></div>' +
    '<div class="field"><label class="flab" for="e_dur">Hours per session</label>' +
      '<input class="finp" id="e_dur" type="number" step="0.5" min="0.5" value="'+sd.dur+'"></div>' +
    '<div class="field"><label class="flab">&nbsp;</label>' +
      '<button class="btn blk" data-eact="regen">&#8635; Regenerate all dates</button></div></div>';

  /* the regenerate button asks about Saturdays before it rewrites anything */
  if (sd.askSat) {
    h += '<div class="askbox"><div class="askq">Include <b>Saturday</b> sessions in the new schedule?</div>' +
      '<div class="askb">' +
        '<button class="btn pri sm" data-eact="regen-sat">Yes — use Saturdays</button>' +
        '<button class="btn sm" data-eact="regen-nosat">No — weekdays only</button>' +
        '<button class="btn sm" data-eact="regen-cancel" style="margin-left:auto">Cancel</button>' +
      '</div></div>';
  }

  if (sd.start && sd.dates.length) {
    /* the whole run folds away behind a one-line summary */
    var first = sd.dates[0], last = sd.dates[sd.dates.length-1];
    h += '<details class="schedrop"'+(E.schedOpen?' open':'')+'><summary>' +
      '<span class="sdsum"><b>'+sd.dates.length+' session'+(sd.dates.length===1?'':'s')+'</b>' +
      ' &middot; '+esc(shortDate(first))+' &rarr; '+esc(shortDate(last))+
      ' &middot; '+nn(sd.dur)+' hr'+(sd.dur===1?'':'s')+' each</span>' +
      '<span class="sdhint">show / hide dates</span></summary>';

    h += '<table class="sesstbl"><thead><tr><th>#</th><th colspan="3">Date</th><th></th>' +
      '<th>Start</th><th>End</th><th>Trainer / course boundary</th><th></th></tr></thead><tbody>';
    sd.dates.forEach(function(dt, i){
      var t = sd.times[i] || { a: sd.tstart, b: addMinutes(sd.tstart, sd.dur*60) };
      var bad = isBlockedDay(dt, sd.sat, sd.skips);
      h += '<tr class="'+(bad?'sun':'')+'"><td>'+(i+1)+'</td>' +
        '<td class="nudge"><button class="daybtn" data-shift="'+i+'" data-dir="-1" ' +
          'title="Move one day earlier" aria-label="Move session '+(i+1)+' one day earlier">&lsaquo;</button></td>' +
        '<td><input class="finp" id="sd_'+i+'" type="date" value="'+esc(dt)+'"></td>' +
        '<td class="nudge"><button class="daybtn" data-shift="'+i+'" data-dir="1" ' +
          'title="Move one day later" aria-label="Move session '+(i+1)+' one day later">&rsaquo;</button></td>' +
        '<td class="dow">'+dowOf(dt)+'</td>' +
        '<td><input class="finp" id="sa_'+i+'" type="time" value="'+esc(t.a)+'"></td>' +
        '<td><input class="finp" id="sb_'+i+'" type="time" value="'+esc(t.b)+'"></td>' +
        '<td>'+trainerSelect('st_'+i,(sd.trainerIds||[])[i]||'','')+(courseEndingLabel(i)?'<small class="okbox" style="display:block;margin-top:4px;padding:4px">Ends: '+esc(courseEndingLabel(i))+'</small>':'')+'</td>' +
        '<td class="nudge"><button class="daybtn off" data-dropsess="'+i+'" ' +
          'title="Switch this class off — later dates move up" ' +
          'aria-label="Remove session '+(i+1)+'">&#10005;</button></td></tr>';
    });
    h += '</tbody></table>';

    if ((sd.skips || []).length) {
      h += '<div class="skiplist"><div class="skiph">Switched off &middot; ' + sd.skips.length + '</div>';
      sd.skips.slice().sort().forEach(function(d){
        var why = holidayName(d);
        h += '<span class="skipchip">'+esc(prettyDate(d))+
          (why ? ' <em>'+esc(why)+'</em>' : '') +
          '<button data-restoresess="'+esc(d)+'" title="Put this date back" ' +
          'aria-label="Restore '+esc(prettyDate(d))+'">&#8634;</button></span>';
      });
      h += '</div>';
    }
    h += '</details>';
    var hol = holidaysInRange(first, last, sd.sat);
    if (hol.length) {
      h += '<div class="note" style="font-size:12px">Skipped automatically: ' +
        hol.map(function(x){ return '<b>'+esc(shortDate(x.d))+'</b> '+esc(x.n); }).join(' &middot; ') +
        '. Record storm days and suspensions under <b>Admin &rsaquo; Holidays</b>.</div>';
    }
    var sundays = sd.dates.filter(isSunday).length;
    var sats = sd.sat ? 0 : sd.dates.filter(isSaturday).length;
    if (sundays || sats) {
      h += '<div class="alert"><div class="ai">&#9888;</div><div class="at">' +
        (sundays ? sundays+' session'+(sundays===1?'':'s')+' now fall'+(sundays===1?'s':'')+' on a <b>Sunday</b>. ' : '') +
        (sats ? sats+' session'+(sats===1?'':'s')+' now fall'+(sats===1?'s':'')+' on a <b>Saturday</b>, which this ' +
          'schedule excludes. ' : '') +
        'They are highlighted above — nudge them with &lsaquo; &rsaquo;, pick another date, or regenerate.</div></div>';
    }
  } else {
    h += '<div style="font-size:12.5px;color:var(--ter);padding:8px 2px">Set a first-session date to generate the schedule.</div>';
  }
  h += '</div>';

  }   /* end of the session-list branch */

  }

  /* ---------- payment plan ---------- */
  if (eTab === 'payment') {
  var RC = reconcile(r);

  /* what changed, and what that means for the family — only once money is involved */
  if (RC.paid > 0 || RC.changed) {
    h += '<div class="adjbox'+(RC.credit?' credit':'')+'">' +
      '<div class="adjh">' + (RC.changed ? 'Course change \u2014 schedule re-cut' : 'Payments on file') + '</div>' +
      '<div class="adjgrid">';
    if (RC.baseline !== null) {
      h += '<div><span class="adjk">Originally agreed</span><span class="adjv was">'+money(RC.baseline)+'</span></div>';
      h += '<div><span class="adjk">Revised total</span><span class="adjv">'+money(RC.net)+'</span></div>';
      if (RC.changed) {
        var up = RC.variance > 0;
        h += '<div><span class="adjk">'+(up?'Additional cost':'Reduction')+'</span>' +
          '<span class="adjv '+(up?'am':'em')+'">'+(up?'+':'\u2212')+money(Math.abs(RC.variance))+'</span></div>';
      }
    }
    h += '<div><span class="adjk">Paid to date</span><span class="adjv em">'+money(RC.paid)+'</span></div>';
    h += '</div>';
    if (RC.credit > 0) {
      h += '<div class="adjnote"><b>Credit balance of '+money(RC.credit)+'.</b> Payments received exceed the ' +
        'revised fees. Process a refund or apply it to a future enrollment \u2014 it is not carried to a later ' +
        'stage automatically.</div>';
    } else if (RC.changed && RC.variance > 0) {
      h += '<div class="adjnote">The extra is spread across the stages still outstanding; settled stages are ' +
        'left alone.</div>';
    } else if (RC.changed) {
      h += '<div class="adjnote">The saving comes off the stages still outstanding.</div>';
    }
    h += '</div>';
  }

  h += payBanner(E.payments);

  /* Flagged: coursework stays locked and a re-upload container is loaded immediately */
  var pstate = payState(E.payments);
  if (pstate === 'Flagged' || pstate === 'Suspended') {
    var flagged = (E.payments || []).filter(function(x){ return x.status === pstate; });
    var why = flagged.map(function(x){ return x.notes; }).filter(Boolean)[0] || '';
    h += '<div class="actionbox" style="--vc:' + PAY_STATES[pstate].hex + '">';
    if (pstate === 'Flagged') {
      h += '<div class="abh">Action required \u2014 coursework locked</div>' +
        '<div class="abm">Our accounting staff could not verify a manual GCash / bank upload, so this ' +
        'enrollment sits on <b>Provisional Hold</b>. Re-check the receipt details and upload a clear copy ' +
        'of the transaction slip.</div>' +
        (why ? '<div class="abr"><b>Reason for flag:</b> ' + esc(why) + '</div>' : '') +
        '<label class="btn pri blk" style="cursor:pointer;margin-top:11px">' +
          '&#8593; Re-upload Proof of Payment' +
          '<input type="file" id="e_reupload" accept="image/*" capture="environment" style="display:none">' +
        '</label><button class="btn blk" data-eact="receipt-camera" style="margin-top:8px">Open in-app camera</button>' +
        '<div class="abm" style="margin-top:8px;font-size:11.5px">For a minor enrollee the registrar may ' +
        'also contact the registered parent / guardian to assist with verification.</div>';
    } else {
      h += '<div class="abh">&#9940; Restricted \u2014 in validation audit</div>' +
        '<div class="abm">Transaction tracking on this profile is temporarily locked following an invalid ' +
        'or unresolvable financial submission. It has been routed for manual administrative review.</div>' +
        (why ? '<div class="abr"><b>Staff remarks:</b> ' + esc(why) + '</div>' : '') +
        '<div class="abr" style="margin-top:9px">Contact the accounting office' +
        (DB.cfg.tel ? ' on <b>' + esc(DB.cfg.tel) + '</b>' : '') +
        (DB.cfg.email ? ' or <b>' + esc(DB.cfg.email) + '</b>' : '') +
        ', or visit the campus administration hub.</div>';
    }
    h += '</div>';
  }

  /* the ledger itself */
  h += '<div class="ms"><div class="msh">Payments received' +
    ((E.payments||[]).length ? ' &middot; ' + E.payments.length : '') + '</div>';
  if ((E.payments||[]).length) {
    h += '<table class="dt paytbl"><thead><tr><th>Date</th><th>Method</th><th>Reference</th>' +
      '<th class="r">Amount</th><th>Verification</th><th></th></tr></thead><tbody>';
    E.payments.forEach(function(pm, ix){
      var ps = PAY_STATES[pm.status || 'Pending'] || PAY_STATES.Pending;
      h += '<tr><td>'+esc(pm.d ? prettyDate(pm.d) : '\u2014')+'</td>' +
        '<td>'+esc(pm.via||'\u2014')+'</td><td class="mono sc">'+esc(pm.ref||'\u2014')+'</td>' +
        '<td class="r mono em"><b>'+money(pm.amt)+'</b></td>' +
        '<td><span class="vchip" style="--vc:'+ps.hex+'">'+esc(ps.label)+'</span>' +
          (pm.by ? '<div class="vby">'+esc(pm.by)+' \u00b7 '+esc(String(pm.at||'').slice(0,10))+'</div>' : '') +
          (pm.notes ? '<div class="vby">'+esc(pm.notes)+'</div>' : '') + '</td>' +
        '<td class="r"><button class="daybtn off" data-paydel="'+ix+'" title="Remove this payment" ' +
          'aria-label="Remove payment">&#10005;</button></td></tr>';
    });
    h += '<tr class="dedtot"><td><b>Total received</b></td><td></td><td></td>' +
      '<td class="r mono grand"><b>'+money(RC.paid)+'</b></td><td></td><td></td></tr>';
    h += '</tbody></table>';
  } else {
    h += '<div style="font-size:12.5px;color:var(--ter);padding:2px 2px 12px">' +
      'Nothing recorded yet. Log each payment as it arrives and the schedule below keeps itself honest.</div>';
  }
  h += '<div class="frow f3" style="margin-top:4px">' +
    '<div class="field"><label class="flab" for="pm_d">Date received <span class="req">*</span></label>' +
      '<input class="finp" id="pm_d" type="date" value="'+esc(today())+'"></div>' +
    '<div class="field"><label class="flab" for="pm_amt">Amount <span class="req">*</span></label>' +
      '<input class="finp mono" id="pm_amt" type="number" step="0.01" min="0" placeholder="0.00"></div>' +
    '<div class="field"><label class="flab" for="pm_via">Method <span class="req">*</span></label><select class="finp" id="pm_via">' +
      ['Cash','GCash','Bank transfer','Cheque','Other'].map(function(m){ return '<option>'+m+'</option>'; }).join('') +
      '</select></div></div>' +
    '<div class="frow"><div class="field"><label class="flab" for="pm_ref">Reference / OR no. <span class="req">*</span></label>' +
      '<input class="finp mono" id="pm_ref" placeholder="OR-00123" required></div>' +
    '<div class="field"><label class="flab" for="pm_notes">Payment notes <span class="req">*</span></label><input class="finp" id="pm_notes" placeholder="Purpose or proof details" required></div>' +
    '<div class="field"><label class="flab">&nbsp;</label>' +
      '<button class="btn pri blk" data-eact="pay-add">&#43; Record payment</button></div></div></div>';

  h += payBlock(false);
  if (r.n) {
    h += '<div class="totalbar'+(RC.paid>0?' hasbal':'')+'"><div><div class="tbl">' +
      (RC.credit > 0 ? 'Credit balance' : RC.paid > 0 ? 'Balance still due' : 'Total amount due') + '</div>' +
      '<div class="tbs">' + r.n + (r.n===1?' course':' courses') +
      (r.pct ? ' &middot; after ' + r.pct + '% discount' : '') +
      (r.plan ? ' &middot; ' + esc(r.plan.name) : '') +
      (RC.paid > 0 ? ' &middot; ' + money(r.net) + ' less ' + money(RC.paid) + ' paid' : '') + '</div></div>' +
      '<div class="tbv">' + money(RC.credit > 0 ? RC.credit : RC.balance) + '</div></div>';
    if (RC.credit > 0) h += '<div class="adjnote" style="margin-top:-8px;margin-bottom:16px">' +
      'This figure is a <b>credit balance</b>, not an amount payable.</div>';
  }
  h += '<div class="ms"><div class="msh">Payment plan</div><div class="plans">';
  DB.plans.forEach(function(pl){
    var rr = quote(E.courses, E.promos, pl.id);
    var on = E.plan === pl.id;
    h += '<div class="pl'+(on?' on':'')+'" data-eplan="'+pl.id+'"><div class="plh"><div class="plr"></div>' +
      '<div class="pln">'+esc(pl.name)+'</div><div class="plt mono">'+money(rr.net)+'</div></div><div class="plsch">';
    rr.schedule.forEach(function(s, si){
      var pd = stageDue(s.w, sd.dates, E.date, si, rr.schedule.length);
      h += '<div class="plrow"><span>'+esc(s.l)+' &middot; '+s.p+'%' +
        (pd ? '<em class="pldue">due '+esc(shortDate(pd))+'</em>' : '') +
        '</span><span>'+money(s.amt)+'</span></div>';
    });
    h += '<div class="plnote">'+esc(pl.note||'')+'</div></div></div>';
  });
  h += '</div>';

  /* due-date table driven by the actual schedule */
  if (r.n) {
    h += '<div class="msh" style="margin-top:16px">Amounts due &middot; dated from the schedule above</div>';
    if (!sd.dates.length) {
      h += '<div class="alert"><div class="ai">&#9888;</div><div class="at">No class dates set yet, so every ' +
        'stage is falling back to the enrollment date. Set a <b>first session</b> above and the collection ' +
        'dates below will compute themselves.</div></div>';
    }
    /* what the family is actually being let off */
    if (r.pct) {
      h += '<table class="dt dedtbl"><tbody>' +
        '<tr><td>Gross fees &middot; '+r.n+(r.n===1?' course':' courses')+'</td>' +
        '<td class="mono">'+money(r.sub)+'</td></tr>';
      r.applied.forEach(function(a){
        h += '<tr class="dedrow"><td>Less &mdash; '+esc(a.label)+' ('+a.pct+'%)</td>' +
          '<td class="mono">&minus;'+money(a.amt)+'</td></tr>';
      });
      h += '<tr class="dedtot"><td><b>Net payable</b></td><td class="mono em grand"><b>'+money(r.net)+'</b></td></tr>' +
        '</tbody></table>';
    }
    h += '<table class="dt duetbl"><thead><tr><th>Stage</th><th>Due date</th><th>Share</th>' +
      (r.pct ? '<th>Gross</th><th>Discount</th>' : '') +
      '<th>Amount due</th><th class="lateh">If late &plus;'+DB.cfg.late+'%</th>' +
      (RC.paid > 0 ? '<th>Status</th>' : '') + '</tr></thead><tbody>';
    r.schedule.forEach(function(s, si){
      var due = stageDue(s.w, sd.dates, E.date, si, r.schedule.length);
      var gross = r.sub * s.p / 100;
      var st = RC.stages[si] || { left:s.amt, paid:0, status:'due' };
      var owing = RC.paid > 0 ? st.left : s.amt;
      h += '<tr class="st-'+st.status+'"><td>'+esc(s.l)+'</td><td>'+esc(due ? prettyDate(due) : '—') +
        (due && dowOf(due) ? ' <span class="pcv">('+dowOf(due)+')</span>' : '') + '</td>' +
        '<td>'+s.p+'%</td>' +
        (r.pct ? '<td class="mono sc">'+money(gross)+'</td>' +
                 '<td class="mono ded">&minus;'+money(gross - s.amt)+'</td>' : '') +
        '<td class="em mono amtdue">'+money(owing)+'</td>' +
        '<td class="mono lateamt">'+money(owing * (1 + (+DB.cfg.late||0)/100))+'</td>' +
        (RC.paid > 0 ? '<td>' + (
            st.status === 'settled' ? '<span class="pchip ok">Settled</span>'
          : st.status === 'part'    ? '<span class="pchip part">'+money(st.paid)+' paid</span>'
          :                           '<span class="pchip">Due</span>') + '</td>' : '') +
        '</tr>';
    });
    h += '<tr class="dedtot"><td><b>Total</b></td><td></td><td><b>100%</b></td>' +
      (r.pct ? '<td class="mono"><b>'+money(r.sub)+'</b></td>' +
               '<td class="mono ded"><b>&minus;'+money(r.disc)+'</b></td>' : '') +
      '<td class="em mono grand amtdue"><b>'+money(RC.paid > 0 ? RC.balance : r.net)+'</b></td>' +
      '<td class="mono lateamt"><b>'+money((RC.paid > 0 ? RC.balance : r.net) * (1 + (+DB.cfg.late||0)/100))+'</b></td>' +
      (RC.paid > 0 ? '<td><span class="pchip ok">'+money(RC.paid)+' received</span></td>' : '') + '</tr>';
    h += '</tbody></table>';
    h += '<div class="note a" style="font-size:12px">Interest applies per stage, to that stage only — the ' +
      'right-hand column is what the family pays if that instalment is settled after its due date. ' +
      'If every stage ran late the charge would total <b>'+money(r.lateAdd)+'</b>, taking the ' +
      money(r.net)+' balance to <b>'+money(r.lateNet)+'</b>.</div>';
  }
  h += '</div>';

  /* ---------- admin ---------- */
  h += '<div class="ms"><div class="msh">Administrative</div>' +
    '<div class="frow"><div class="field"><label class="flab" for="e_date">Enrollment date</label>' +
      '<input class="finp" id="e_date" type="date" value="'+esc(E.date)+'"></div>' +
    '<div class="field"><label class="flab" for="e_ref_view">Reference no.</label>' +
      '<input class="finp" id="e_ref_view" value="'+esc(E.ref || nextRef())+'" disabled style="opacity:.7"></div></div>' +
    '<div class="field"><label class="flab" for="e_notes">Notes / special arrangements</label>' +
      '<textarea class="finp" id="e_notes">'+esc(E.notes)+'</textarea></div></div>';

  }

  /* ---------- agreements ---------- */
  if (eTab === 'legal') {
  var A = E.agree || {};
  h += '<div class="ms"><div class="msh">Review and accept</div>' +
    '<div class="note" style="margin-top:0">Accept both agreements before finalizing' +
    (isMinor() ? '; a minor also needs completed parent/legal guardian consent' : '') + '.</div>';

  h += '<div class="tabs legtabs" role="tablist" aria-label="Legal documents">' +
    '<button id="l-tab-privacy" role="tab" aria-controls="l-tab-panel" aria-selected="'+(legalTab==='privacy')+'" tabindex="'+(legalTab==='privacy'?'0':'-1')+'" data-ltab="privacy" class="'+(legalTab==='privacy'?'on':'')+'">Privacy Policy</button>' +
    '<button id="l-tab-terms" role="tab" aria-controls="l-tab-panel" aria-selected="'+(legalTab==='terms')+'" tabindex="'+(legalTab==='terms'?'0':'-1')+'" data-ltab="terms" class="'+(legalTab==='terms'?'on':'')+'">Terms and Conditions</button>' +
    '</div>';

  h += '<div class="legdoc" id="l-tab-panel" role="tabpanel" aria-labelledby="l-tab-'+legalTab+'">' +
    (legalTab === 'privacy' ? legalHTML(PRIVACY_POLICY) : legalHTML(TERMS_CONDITIONS)) + '</div>';

  h += '<div class="ck agck'+(A.privacy?' on':'')+'" data-agree="privacy">' +
      '<div class="cbox">&#10003;</div><div class="ckt"><b>I have read and accept the Privacy Policy.</b>' +
      '<small>Covers what CSDA collects, how it is processed, and your rights under RA 10173.' +
      (A.privacy && A.privacyAt ? ' Accepted ' + esc(String(A.privacyAt).slice(0,10)) +
        ' at ' + esc(String(A.privacyAt).slice(11,16)) + '.' : '') + '</small></div></div>';
  h += '<div class="ck agck'+(A.terms?' on':'')+'" data-agree="terms">' +
      '<div class="cbox">&#10003;</div><div class="ckt"><b>I have read and accept the Terms and Conditions.</b>' +
      '<small>Includes the Provisional Hold rule on manual payments and the Baguio City legal venue.' +
      (A.terms && A.termsAt ? ' Accepted ' + esc(String(A.termsAt).slice(0,10)) +
        ' at ' + esc(String(A.termsAt).slice(11,16)) + '.' : '') + '</small></div></div>';

  if (isMinor()) {
    h += '<div class="ck agck'+(consentComplete()?' on':'')+'" data-agree="minorjump">' +
      '<div class="cbox">&#10003;</div><div class="ckt"><b>Parental consent (applicant is under 18).</b>' +
      '<small>' + (consentComplete()
        ? 'Completed and signed on the Parent / guardian tab.'
        : 'Not yet complete \u2014 tap to open the Parent / guardian tab.') + '</small></div></div>';
  }

  h += agreementsComplete()
    ? '<div class="okbox" style="margin-top:12px">All agreements accepted \u2014 registration may be submitted.</div>'
    : '<div class="alert" style="margin-top:12px"><div class="ai">&#128274;</div><div class="at">' +
      '<b>Submission locked.</b> Still to accept: ' + esc(agreementsMissing().join(', ')) + '.</div></div>';
  h += '<div class="dpcline">Data Protection Coordinator \u00b7 <b>' + esc(DPC_EMAIL) + '</b></div>';
  h += '</div>';
  }   /* end of the tab sections */

  h += '</div>'; /* e-tab-panel */
  /* Keep the current-step controls at the top, where they remain visible without
     covering fields or competing with actions farther down the form. */
  h = enrollTabNav() + h;

  keepScroll(b, function(){ b.innerHTML = h; applyEnrollErrors(); });
}

/* After finalising: the trainer copy has been saved, so offer the pre-written email. */
function finalizePanel(){
  if (!pendingMail) return '';
  return '<div class="okbox" style="margin-bottom:16px">' +
    '<div style="font-weight:700;margin-bottom:4px">Trainer copy ready &middot; ' + esc(pendingMail.to) + '</div>' +
    '<div style="font-size:12px;line-height:1.55">Save <b>' + esc(pendingMail.file) + '.pdf</b>, then open ' +
      'the prepared email and attach that file manually.</div>' +
    '<div class="askb" style="margin-top:11px">' +
      '<button class="btn pri sm" data-eact="maildraft">&#9993; Open email to trainer</button>' +
      '<button class="btn sm" data-eact="copysummary">Copy summary instead</button>' +
      '<button class="btn sm" data-eact="finalize-done" style="margin-left:auto">Done</button>' +
    '</div></div>';
}

function enrollPreview(){
  var r = quote(E.courses, E.promos, E.plan);
  return '<div class="enrollmeter" role="progressbar" aria-label="Enrollment complete" aria-valuemin="1" aria-valuemax="6" aria-valuenow="6"><i style="width:100%"></i></div>' +
    '<div class="enprogress"><b>Review complete — ready to finalize</b><span>Final step</span></div>' +
    '<div class="enav" style="flex-wrap:wrap">' +
      '<button class="btn" data-eact="back">&lsaquo; Back to form</button>' +
      '<button class="btn" data-eact="saverec">&#128190; Save</button>' +
      '<button class="btn pri" data-eact="finalize" style="margin-left:auto;padding:11px 20px">' +
        '&#10003; Finalize and create PDF</button>' +
    '</div>' +
    finalizePanel() +
    '<div class="note" style="margin-top:0;margin-bottom:16px"><b>Finalize and create PDF</b> saves the ' +
    'record, opens the print dialog, and prepares the trainer copy. Choose <b>Save as PDF</b>; the filename ' +
    'will be <b class="fname">' + esc(pdfNameFor(E.student.name, E.courses, E.ref)) + '.pdf</b>. ' +
    '<b>Save</b> stores the record in this app without creating a PDF.</div>' +
    buildDoc(r);
}

/* clipboard with a textarea fallback for browsers that block the async API */
function copyText(t){
  var done = function(){ toast('Summary copied to the clipboard'); };
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(done, function(){ legacyCopy(t, done); });
      return;
    }
  } catch(e){}
  legacyCopy(t, done);
}
function legacyCopy(t, done){
  try {
    var ta = document.createElement('textarea');
    ta.value = t; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var okc = document.execCommand && document.execCommand('copy');
    ta.remove();
    okc ? done() : toast('Could not copy — select the text manually', true);
  } catch(e){ toast('Could not copy — select the text manually', true); }
}

var docCopyFor = '';     // 'Trainer copy — <name>' while the trainer's copy is built
function buildRentSlip(se){
  var f = facilityItem();
  var row = function(k, v){ return '<dt>'+esc(k)+'</dt><dd>'+esc(v || '—')+'</dd>'; };
  var mins = se.status === 'closed' ? se.mins : minsUsed(se);
  var net  = se.status === 'closed' ? se.net  : netOf(se);
  var h = '<div class="prev">';
  h += '<div class="phead"><div class="pbrand"><img class="plogo" src="'+LOGO_FULL+'" alt="CSDA"></div>' +
    '<div class="pdoc"><span class="badge2">Facility Rental Slip</span><br>' +
    '<b>Ref '+esc(se.ref)+'</b><br>'+esc(prettyDate(se.date))+'<br>Client copy</div></div>';
  h += '<h3>Digital Entertainment Exchange</h3>' +
    '<div class="schedsum">' + esc((f && f.desc) || '') + '</div>';
  h += '<h3>Session</h3><dl class="kv">' +
    row('Unit no.', se.unit) + row('User', se.name) + row('Office / school', se.org) +
    row('Purpose', se.purpose) +
    row('Log in', pretty12(se.inT)) + row('Log out', se.outT ? pretty12(se.outT) : 'in progress') +
    row('Booked', fmtDuration(se.booked || 0) + (se.added ? '  (' + (se.added>0?'+':'') + se.added + ' min adjusted)' : '')) +
    row('Time used', fmtDuration(mins)) + '</dl>';
  if (se.kit) {
    var outKit = RENT_KIT.filter(function(k){ return se.kit[k[0]]; }).map(function(k){ return k[1]; });
    h += '<h3>Equipment released</h3><div class="schedsum">' +
      (outKit.length ? esc(outKit.join(' \u00b7 ')) : 'None recorded') +
      '</div>';
  }
  if (se.note) h += '<div class="revnote"><b>Notes:</b> ' + esc(se.note) + '</div>';
  h += '<h3>Charge</h3><table><tbody>' +
    '<tr><td>Rate</td><td class="r">'+money(se.rate)+' per hour</td></tr>' +
    '<tr><td>Time used \u00b7 pro-rated by the minute</td><td class="r">'+mins+' min</td></tr>' +
    '<tr class="totrow grandrow"><td>Net payable</td><td class="r amtdue">'+money(net)+'</td></tr>' +
    '</tbody></table>';
  h += payBlock(true);
  h += '<div class="sigs"><div class="sig">User signature over printed name<br><br></div>' +
    '<div class="sig">Facility attendant<br><br></div></div>';
  var contact = [DB.cfg.tel ? 'Tel ' + esc(DB.cfg.tel) : '', DB.cfg.mobile ? 'Mobile ' + esc(DB.cfg.mobile) : '',
                 DB.cfg.email ? esc(DB.cfg.email) : ''].filter(Boolean).join(' &middot; ');
  h += '<div class="pfoot"><span class="paddr">'+esc(DB.cfg.addr)+(contact ? '<br>'+contact : '')+'</span>' +
    '<span>Generated '+esc(prettyDate(today()))+'</span></div>';
  return h + '</div>';
}

function buildDoc(r){
  var S = E.student, G = E.guardian;
  var ref = E.ref || nextRef();
  var row = function(dt, dd){ return '<dt>'+esc(dt)+'</dt><dd>'+esc(dd || '—')+'</dd>'; };
  var h = '<div class="prev">';
  h += '<div class="phead"><div class="pbrand"><img class="plogo" src="'+LOGO_FULL+'" alt="CSDA"></div>' +
    '<div class="pdoc"><span class="badge2">Enrollment Form &amp; Quotation</span><br>' +
    '<b>Ref '+esc(ref)+'</b><br>Date issued: '+esc(prettyDate(E.date))+'<br>' +
    (docCopyFor || 'Client copy') + '</div></div>';

  h += '<h3>Student</h3><dl class="kv">' +
    row('Full name', S.name) + row('Highest educational attainment', S.educ) +
    row('Date of birth', S.dob ? prettyDate(S.dob) : '') +
    row('Provider / school', S.provider) + row('Delivery mode', S.mode) + '</dl>';

  if (E.trainer && E.trainer.name) {
    h += '<h3>Assigned trainer</h3><dl class="kv">' +
      row('Trainer', E.trainer.name) + row('Email', E.trainer.email) + '</dl>';
  }

  h += '<h3>'+(isMinor()?'Parent / legal guardian':'Emergency contact')+'</h3><dl class="kv">' +
    row('Full name', G.name) + row('Relationship', G.rel) +
    row('Mobile', G.mobile + (G.verified ? '  (confirmed by phone)' : '  (NOT YET CONFIRMED)')) +
    row('Email', G.email) + row('Address', G.address) + '</dl>';

  h += '<h3>Enrolled courses</h3><table><thead><tr><th>Course</th><th class="r">Hours</th><th class="r">Rate</th></tr></thead><tbody>';
  r.items.forEach(function(i){
    var c = catById(i.c) || {};
    h += '<tr><td><b>'+esc(i.n)+'</b><div style="color:#777;font-size:9.5px">'+esc(c.name||'')+
      ((i.modules||[]).length ? ' · ' + i.modules.length + ' modules' : '') + '</div></td>' +
      '<td class="r">'+(i.hrs||'—')+'</td><td class="r">'+money(i.price)+'</td></tr>';
  });
  h += '<tr><td>Gross subtotal</td><td class="r">'+(r.hrs||'—')+'</td><td class="r">'+money(r.sub)+'</td></tr>';
  r.applied.forEach(function(a){
    h += '<tr class="disrow"><td>Less — '+esc(a.label)+' ('+a.pct+'%)</td>' +
      '<td class="r"></td><td class="r">&minus;'+money(a.amt)+'</td></tr>';
  });
  h += '<tr class="totrow grandrow"><td>Total payable</td><td class="r"></td>' +
       '<td class="r">'+money(r.net)+'</td></tr>';
  h += '</tbody></table>';

  var sd = E.sched || { dates:[], times:[] };
  if (isDateRange(E.courses) && sd.start) {
    /* long-form course: print the booked range, not a session grid */
    h += '<h3>Course dates</h3><dl class="kv">' +
      row('Start date', prettyDate(sd.start)) +
      row('End date', sd.end ? prettyDate(sd.end) : '') +
      row('Duration', rangeLabel(sd.start, sd.end)) +
      row('Class time', pretty12(sd.tstart) + ' — ' + pretty12(addMinutes(sd.tstart, sd.dur * 60))) +
      '</dl>';
  } else if (sd.dates && sd.dates.length) {
    /* On paper the run is led by the same one-line summary the panel shows, then the
       dates themselves in a compact grid so a 12-session course does not eat a page. */
    var f = sd.dates[0], l = sd.dates[sd.dates.length-1];
    var allSame = (sd.times || []).every(function(t){
      return !t || (t.a === (sd.times[0]||{}).a && t.b === (sd.times[0]||{}).b); });
    h += '<h3>Class schedule</h3>' +
      '<div class="schedsum"><b>'+sd.dates.length+' session'+(sd.dates.length===1?'':'s')+'</b> &middot; ' +
      esc(prettyDate(f))+' &rarr; '+esc(prettyDate(l))+' &middot; '+sd.dur+' hr'+(sd.dur===1?'':'s')+' each' +
      (allSame && sd.times && sd.times[0]
        ? ' &middot; '+esc(pretty12(sd.times[0].a))+'\u2013'+esc(pretty12(sd.times[0].b)) : '') + '</div>';
    h += '<table class="sgrid"><tbody>';
    for (var gi = 0; gi < sd.dates.length; gi += 3) {
      h += '<tr>';
      for (var gj = 0; gj < 3; gj++) {
        var k = gi + gj;
        if (k < sd.dates.length) {
          var tt = (sd.times && sd.times[k]) || {};
          h += '<td><span class="sgn">'+(k+1)+'</span> '+esc(shortDate(sd.dates[k])) +
            ' <span class="sgd">'+esc(dowOf(sd.dates[k]))+'</span>' +
            (allSame ? '' : '<br><span class="sgd">'+esc(pretty12(tt.a))+'\u2013'+esc(pretty12(tt.b))+'</span>') +
            '</td>';
        } else { h += '<td></td>'; }
      }
      h += '</tr>';
    }
    h += '</tbody></table>';
    if ((sd.skips || []).length) {
      h += '<div class="skipnote">Dates not held: ' + sd.skips.slice().sort().map(function(d){
        var w = holidayName(d); return esc(shortDate(d)) + (w ? ' (' + esc(w) + ')' : '');
      }).join(' \u00b7 ') + '</div>';
    }
  }

  h += '<h3>Payment schedule — '+esc(r.plan.name)+'</h3>' +
    '<table><thead><tr><th>Stage</th><th>Due date</th><th class="r">Share</th>' +
    (r.pct ? '<th class="r">Gross</th><th class="r">Discount</th>' : '') +
    '<th class="r">Amount due</th><th class="r lateh">If late +'+DB.cfg.late+'%</th></tr></thead><tbody>';
  r.schedule.forEach(function(s, si){
    var due = stageDue(s.w, sd.dates || [], E.date, si, r.schedule.length);
    var gross = r.sub * s.p / 100;
    h += '<tr><td>'+esc(s.l)+'</td><td>'+esc(due ? prettyDate(due) : '—')+'</td>' +
      '<td class="r">'+s.p+'%</td>' +
      (r.pct ? '<td class="r">'+money(gross)+'</td><td class="r">&minus;'+money(gross - s.amt)+'</td>' : '') +
      '<td class="r amtdue">'+money(s.amt)+'</td>' +
      '<td class="r lateamt">'+money(s.amt * (1 + (+DB.cfg.late||0)/100))+'</td></tr>';
  });
  h += '<tr class="totrow"><td>Total</td><td></td><td class="r">100%</td>' +
    (r.pct ? '<td class="r">'+money(r.sub)+'</td><td class="r">&minus;'+money(r.disc)+'</td>' : '') +
    '<td class="r amtdue">'+money(r.net)+'</td>' +
    '<td class="r lateamt">'+money(r.lateNet)+'</td></tr></tbody></table>';

  /* A revised form must not contradict the receipts the family already holds. */
  var RCp = reconcile(r);
  if (RCp.paid > 0 || RCp.changed) {
    h += '<h3>Payments received</h3>';
    if (RCp.changed) {
      h += '<div class="revnote">Originally agreed <b>'+money(RCp.baseline)+'</b> &rarr; revised to ' +
        '<b>'+money(RCp.net)+'</b> after a change of courses (' +
        (RCp.variance > 0 ? '+' : '\u2212') + money(Math.abs(RCp.variance)) + ').</div>';
    }
    if ((E.payments||[]).length) {
      h += '<table><thead><tr><th>Date</th><th>Method</th><th>Reference</th>' +
        '<th class="r">Amount</th></tr></thead><tbody>';
      E.payments.forEach(function(pm){
        h += '<tr><td>'+esc(pm.d ? prettyDate(pm.d) : '—')+'</td><td>'+esc(pm.via||'—')+'</td>' +
          '<td>'+esc(pm.ref||'—')+'</td><td class="r">'+money(pm.amt)+'</td></tr>';
      });
      h += '<tr class="totrow"><td>Total received</td><td></td><td></td>' +
        '<td class="r">'+money(RCp.paid)+'</td></tr></tbody></table>';
    }
    h += '<table style="margin-top:6px"><tbody>' +
      '<tr class="totrow grandrow"><td>' + (RCp.credit > 0 ? 'Credit balance (refundable)' : 'Balance still due') +
      '</td><td class="r"></td><td class="r amtdue">' +
      money(RCp.credit > 0 ? RCp.credit : RCp.balance) + '</td></tr></tbody></table>';
    if (RCp.credit > 0) {
      h += '<div class="revnote">Payments received exceed the revised fees. This credit balance is refundable ' +
        'or may be applied to a future enrollment; it is not an amount payable.</div>';
    }
  }

  if (isMinor()) {
    var CC = E.consent || {};
    h += '<h3>Parental consent \u2014 applicant under 18</h3>' +
      '<dl class="kv">' + row('Parent / guardian', CC.gName) + row('Relationship', CC.gRel) +
      row('Primary mobile', CC.gMobile) + '</dl>' +
      '<div class="consentprint">' +
        CONSENT_ITEMS.map(function(it){
          return '<div>' + (CC[it[0]] ? '&#9745;' : '&#9744;') + ' <b>' + esc(it[1]) + '</b> \u2014 ' +
            esc(it[2]) + '</div>';
        }).join('') +
        '<div style="margin-top:6px">' + (CC.signed ? '&#9745;' : '&#9744;') + ' ' + esc(CONSENT_CERT) +
        (CC.signed && CC.signedAt ? ' <i>(signed ' + esc(prettyDate(String(CC.signedAt).slice(0,10))) +
          ' ' + esc(String(CC.signedAt).slice(11,16)) + ')</i>' : '') + '</div>' +
        '<div class="dpa">Collected and processed under Republic Act No. 10173, the Philippine Data ' +
        'Privacy Act of 2012.</div>' +
      '</div>';
  }

  var AG = E.agree || {};
  if (AG.privacy || AG.terms) {
    h += '<h3>Agreements accepted</h3><div class="consentprint">' +
      '<div>' + (AG.privacy ? '&#9745;' : '&#9744;') + ' <b>Privacy Policy</b>' +
        (AG.privacyAt ? ' \u2014 ' + esc(String(AG.privacyAt).slice(0,10)) + ' ' +
          esc(String(AG.privacyAt).slice(11,16)) : '') + '</div>' +
      '<div>' + (AG.terms ? '&#9745;' : '&#9744;') + ' <b>Terms and Conditions</b>' +
        (AG.termsAt ? ' \u2014 ' + esc(String(AG.termsAt).slice(0,10)) + ' ' +
          esc(String(AG.termsAt).slice(11,16)) : '') + '</div>' +
      '<div class="dpa">Data Protection Coordinator \u00b7 ' + esc(DPC_EMAIL) +
      ' \u00b7 Governed by the laws of the Republic of the Philippines; venue, Baguio City.</div></div>';
  }

  h += payBlock(true);
  if (E.notes) h += '<h3>Notes</h3><div style="font-size:11px">'+esc(E.notes)+'</div>';

  h += '<h3>Terms &amp; conditions</h3><ul class="terms">' +
    '<li>Homeschool TLE sessions are capped at <b>1.5 hours</b> per session. All other classes are capped at ' +
      '<b>3 hours</b> per session. Studio overtime beyond the cap is billed to the enrolling party at ' +
      P+'80.00 per hour at the standard individual rate.</li>' +
    '<li>Classes are scheduled <b>every other day and never on a Sunday</b>. Individual dates may be moved by ' +
      'CSDA administration to accommodate holidays or trainer availability; the schedule above is the governing copy.</li>' +
    '<li>Only one discount may be applied per student per enrollment. Discounts cannot be combined with other promos.</li>' +
    '<li>Late payments incur a '+DB.cfg.late+'% interest charge on the overdue stage, computed from the due ' +
      'date shown above. The <b>If late</b> column states that amount in pesos for each stage; settling every ' +
      'stage late would add '+money(r.lateAdd)+' to this enrollment.</li>' +
    '<li>The Full Payment discount requires settlement in a single payment and is forfeited under any installment ' +
      'plan. It does not apply to single-session workshops.</li>' +
    '<li>This quotation is valid for 30 days from the date issued and is subject to slot availability.</li>' +
    '</ul>';

  h += '<div class="sigs"><div class="sig">'+(isMinor()?'Parent / legal guardian':'Emergency contact')+' signature over printed name<br><br></div>' +
    '<div class="sig">CSDA authorised representative<br><br></div>' +
    '<div class="sig">Date signed<br><br></div></div>';
  var contact = [
    DB.cfg.tel    ? 'Tel ' + esc(DB.cfg.tel) : '',
    DB.cfg.mobile ? 'Mobile ' + esc(DB.cfg.mobile) : '',
    DB.cfg.email  ? esc(DB.cfg.email) : ''
  ].filter(Boolean).join(' &middot; ');
  h += '<div class="pfoot"><span class="paddr">'+esc(DB.cfg.addr)+
       (contact ? '<br>'+contact : '')+'</span>' +
    '<span>Generated '+esc(prettyDate(E.date))+' &middot; Client copy</span></div>';
  h += '</div>';
  return h;
}

/* Dates, times and dropdowns refresh the form as soon as they change, so the
   derived figures (session grid, course-date span, trainer email) are never stale.
   Free-text fields are deliberately excluded — re-rendering would steal the caret. */
document.getElementById('eBody').addEventListener('toggle', function(e){
  if (e.target && e.target.classList && e.target.classList.contains('schedrop')) {
    E.schedOpen = e.target.open;      // survives the next re-render
  }
}, true);
document.getElementById('eBody').addEventListener('input', function(e){
  if (e.target && e.target.id) clearEnrollError(e.target.id);
});
document.getElementById('eBody').addEventListener('change', function(e){
  if (e.target && e.target.id) clearEnrollError(e.target.id);
  if(e.target&&e.target.id==='studentPhotoFile'&&e.target.files&&e.target.files[0]){var sp=e.target.files[0];if(sp.size>6000000){toast('Student photo is over 6 MB',true);return;}var spr=new FileReader();spr.onload=function(){setStudentPhoto(String(spr.result||''));};spr.readAsDataURL(sp);return;}
  if (e.target && e.target.id === 'e_reupload' && e.target.files && e.target.files[0]) {
    var f = e.target.files[0];
    if (f.size > 900000) { toast('Image over 900 KB \u2014 use a smaller screenshot', true); return; }
    var fr = new FileReader();
    fr.onload = function(){
      var target = (E.payments || []).filter(function(x){ return x.status === 'Flagged'; })[0];
      if (!target) { toast('Nothing flagged to replace', true); return; }
      target.receipt = String(fr.result || '');
      target.status = 'Pending';
      target.by = ''; target.at = '';
      logAction('Proof of payment re-uploaded for ' + (target.txn || '') + ' \u2014 back to Pending', 'learner');
      renderEnroll();
      toast('Proof re-uploaded \u2014 back in the verification queue');
    };
    fr.readAsDataURL(f);
    return;
  }
  var id = e.target && e.target.id;
  if (!id) return;
  if (id === 'e_addcourse') {
    var addId = e.target.value;
    if (!addId) return;
    syncEnroll();
    if (E.courses.indexOf(addId) === -1) {
      E.courses.push(addId);
      applyCourseChange();
      var it = itemById(addId);
      toast((it ? it.n : 'Course') + ' added');
    }
    renderEnroll();
    var sl = document.getElementById('e_addcourse');
    if (sl) sl.focus();
    return;
  }
  if (!/^(e_start|e_end|e_tstart|e_dur|e_count|e_trainer|e_mode|e_educ|e_dob|e_date|studentPhotoZoom|studentPhotoX|studentPhotoY|course_trainer_.+|sd_\d+|sa_\d+|sb_\d+|st_\d+)$/.test(id)) return;
  syncEnroll();
  renderEnroll();
});

/* Arrow-key tab navigation follows the WAI-ARIA tabs pattern without changing the
   existing click/Next/Back workflow. */
document.getElementById('eBody').addEventListener('keydown', function(e){
  var tab = e.target.closest && e.target.closest('[role="tab"][data-etab]');
  if (!tab || ['ArrowLeft','ArrowRight','Home','End'].indexOf(e.key) === -1) return;
  e.preventDefault();
  var tabs = ENROLL_TABS.map(function(t){ return t[0]; });
  var ix = tabs.indexOf(tab.getAttribute('data-etab'));
  if (e.key === 'Home') ix = 0;
  else if (e.key === 'End') ix = tabs.length - 1;
  else ix = (ix + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  syncEnroll();
  eTab = tabs[ix];
  renderEnroll();
  var next = document.getElementById('e-tab-' + eTab);
  if (next) next.focus();
});

document.getElementById('eBody').addEventListener('click', function(e){
  var tb = e.target.closest && e.target.closest('[data-etab]');
  if (tb) {
    syncEnroll();                       // never lose what is on screen
    eTab = tb.getAttribute('data-etab');
    renderEnroll();
    var bd = document.getElementById('eBody');
    if (bd) bd.scrollTop = 0;
    return;
  }
  var t;
  if ((t = e.target.closest('[data-ecourse]'))) {
    syncEnroll();
    var id = t.getAttribute('data-ecourse');
    var ix = E.courses.indexOf(id);
    if (ix > -1){E.courses.splice(ix, 1);if(E.courseTrainers)delete E.courseTrainers[id];} else E.courses.push(id);
    applyCourseChange();
    renderEnroll(); return;
  }
  if ((t = e.target.closest('[data-epromo]'))) {
    syncEnroll();
    var pid = t.getAttribute('data-epromo');
    E.promos[pid] = !E.promos[pid];
    renderEnroll(); return;
  }
  if ((t = e.target.closest('[data-eplan]'))) {
    syncEnroll(); E.plan = t.getAttribute('data-eplan'); renderEnroll(); return;
  }
  if ((t = e.target.closest('[data-shift]'))) {
    syncEnroll();
    shiftSession(parseInt(t.getAttribute('data-shift'), 10), parseInt(t.getAttribute('data-dir'), 10));
    renderEnroll(); return;
  }
  if (e.target.closest('#e_verified')) {
    syncEnroll();
    E.guardian.verified = !E.guardian.verified;
    renderEnroll(); return;
  }
  var pdl = e.target.closest('[data-paydel]');
  if (pdl) {
    syncEnroll();
    var pix = parseInt(pdl.getAttribute('data-paydel'), 10);
    var gone = (E.payments || [])[pix];
    E.payments.splice(pix, 1);
    renderEnroll();
    toast('Payment of ' + money(gone ? gone.amt : 0) + ' removed');
    return;
  }
  var dsx = e.target.closest('[data-dropsess]');
  if (dsx) {
    syncEnroll();
    E.schedOpen = true;
    dropSession(parseInt(dsx.getAttribute('data-dropsess'), 10));
    renderEnroll(); return;
  }
  var rsx = e.target.closest('[data-restoresess]');
  if (rsx) {
    syncEnroll();
    E.schedOpen = true;
    restoreSession(rsx.getAttribute('data-restoresess'));
    renderEnroll(); return;
  }
  var lt = e.target.closest('[data-ltab]');
  if (lt) { legalTab = lt.getAttribute('data-ltab'); renderEnroll(); return; }
  var ag = e.target.closest('[data-agree]');
  if (ag) {
    syncEnroll();
    var ak = ag.getAttribute('data-agree');
    if (ak === 'minorjump') { eTab = 'guardian'; renderEnroll(); return; }
    E.agree[ak] = !E.agree[ak];
    E.agree[ak + 'At'] = E.agree[ak] ? new Date().toISOString() : '';
    renderEnroll();
    return;
  }
  var cc = e.target.closest('[data-consent]');
  if (cc) {
    syncEnroll();
    var key = cc.getAttribute('data-consent');
    E.consent[key] = !E.consent[key];
    if (key === 'signed') E.consent.signedAt = E.consent.signed ? new Date().toISOString() : '';
    renderEnroll();
    return;
  }
  if (e.target.closest('#e_trsave')) {
    syncEnroll();
    E.trainerSave = !E.trainerSave;
    renderEnroll(); return;
  }
  var el = e.target.closest('[data-eact]');
  if (!el) return;
  var act = el.getAttribute('data-eact');
  if (act === 'review') {
    syncEnroll();
    var miss = [];
    enrollErrors = {};
    if (!E.student.name) { miss.push('student name'); enrollErrors.e_sname = 'Enter the student’s full name.'; }
    if (!E.guardian.name) { miss.push('emergency contact name'); enrollErrors.e_gname = 'Enter the emergency contact’s full name.'; }
    if (!E.guardian.mobile) { miss.push('mobile number'); enrollErrors.e_gmob = 'Enter a mobile number for the emergency contact.'; }
    if (!E.courses.length) { miss.push('at least one course'); enrollErrors.e_addcourse = 'Choose at least one course.'; }
    if (isMinor() && !consentComplete()) {
      eTab = 'guardian'; renderEnroll();
      toast('Under-18 applicant \u2014 parental consent must be completed first', true);
      return;
    }
    if (!agreementsComplete()) {
      eTab = 'legal'; renderEnroll();
      toast('Accept the ' + agreementsMissing().join(' and ') + ' to continue', true);
      return;
    }
    if (miss.length) {
      /* open the tab that needs attention rather than leaving the rep hunting */
      var firstBad = ENROLL_TABS.filter(function(t){ return enrollTabState(t[0]) === 'todo'; })[0];
      if (firstBad && eTab !== firstBad[0]) { eTab = firstBad[0]; renderEnroll(); }
      else applyEnrollErrors();
      toast('Still needed: ' + miss.join(', '), true);
      return;
    }
    if (!E.ref) { E.ref = nextRef(); DB.cfg.seq = (DB.cfg.seq || 1) + 1; save(); }
    eStep = 2;
    trackEvent('enrollment_reviewed');
    document.getElementById('eTitle').textContent = 'Enrollment Form — ' + E.ref;
    renderEnroll();
  }
  else if (act === 'back') {
    eStep = 1;
    document.getElementById('eTitle').textContent = 'Enroll a Student';
    renderEnroll();
  }
  else if (act === 'regen') {
    syncEnroll();
    if (!E.sched.start) { toast('Set a first-session date first', true); return; }
    E.sched.askSat = true;               // ask about Saturdays before rewriting anything
    renderEnroll();
  }
  else if (act === 'regen-sat' || act === 'regen-nosat') {
    syncEnroll();
    E.sched.sat = (act === 'regen-sat');
    E.sched.askSat = false;
    regenDates(); renderEnroll();
    toast('Schedule regenerated from ' + prettyDate(E.sched.start) +
      (E.sched.sat ? ' — Saturdays included' : ' — weekdays only'));
  }
  else if (act === 'regen-cancel') {
    syncEnroll(); E.sched.askSat = false; renderEnroll();
  }
  else if (act === 'saverec') {
    if (!agreementsComplete()) {
      eTab = 'legal'; renderEnroll();
      toast('Accept the ' + agreementsMissing().join(' and ') + ' before filing', true);
      return;
    }
    if (isMinor() && !consentComplete()) {
      eTab = 'guardian'; renderEnroll();
      toast('A minor\u2019s record cannot be filed without parental consent', true);
      return;
    }
    saveRecord();
    trackEvent('enrollment_saved');
  }
  else if (act === 'print') {
    var r = quote(E.courses, E.promos, E.plan);
    document.getElementById('printarea').innerHTML = buildDoc(r);
    printDoc(pdfNameFor(E.student.name, E.courses, E.ref));
  }
  else if (act === 'finalize') {
    if (E.trainerCustom && !(E.trainer && (E.trainer.name || '').trim())) {
      eTab = 'student'; renderEnroll();
      toast('Give the trainer a name before finalising', true);
      return;
    }
    trackEvent('enrollment_finalized');
    /* No trainer yet? Still file it and still produce the PDF — only the trainer
       hand-off is skipped, and the toast says so. */
    if (!E.trainer || (E.trainer.email || '').indexOf('@') < 1) {
      if (!E.ref) E.ref = nextRef();
      saveRecord();
      var rq = quote(E.courses, E.promos, E.plan);
      document.getElementById('printarea').innerHTML = buildDoc(rq);
      printDoc(pdfNameFor(E.student.name, E.courses, E.ref));
      toast('Filed and printing — no trainer assigned, so no copy was prepared for one');
      return;
    }
    if (!E.ref) E.ref = nextRef();
    saveRecord();            // file it first, so finalising never loses the enrollment
    trainerHandoff();
  }
  else if(act==='student-camera'){openEmbeddedCamera('Capture student profile photo',setStudentPhoto);}
  else if(act==='student-photo-remove'){E.student.photo=null;renderEnroll();toast('Student photo removed');}
  else if(act==='receipt-camera'){openEmbeddedCamera('Capture payment receipt',function(data){var target=(E.payments||[]).filter(function(x){return x.status==='Flagged';})[0];if(!target)return;target.receipt=data;target.status='Pending';target.by='';target.at='';renderEnroll();toast('Receipt captured — back in the verification queue');});}
  else if(act==='trainer-add'){syncEnroll();if(!E.trainerAssignments)E.trainerAssignments=[];E.trainerAssignments.push({trainerId:'',name:'',start:E.sched.start||'',end:E.sched.end||'',hours:0});renderEnroll();}
  else if(act==='trainer-remove'){syncEnroll();var rm=e.target.closest('[data-ta-remove]');if(rm)E.trainerAssignments.splice(+rm.getAttribute('data-ta-remove'),1);renderEnroll();}
  else if (act === 'pay-add') {
    var g = function(id){ var n = document.getElementById(id); return n ? n.value : ''; };
    var amt=parseFloat(g('pm_amt')),pd=g('pm_d'),pv=g('pm_via').trim(),pr=g('pm_ref').trim(),pn=g('pm_notes').trim();
    if(!pd||!amt||amt<=0||!pv||!pr||!pn){toast('Complete date, amount, method, reference, and payment notes',true);return;}
    captureBaseline();                       // the agreed figure, frozen before any change
    if (!E.payments) E.payments = [];
    E.payments.push({ d: g('pm_d') || today(), amt: Math.round(amt * 100) / 100,
                      via: g('pm_via') || 'Cash', ref: (g('pm_ref') || '').trim(),
                      txn: 'TXN-' + Date.now().toString(36).toUpperCase(),
                      status:'Pending',by:'',at:'',notes:pn,receipt:'' });
    E.payments.sort(function(a, b){ return (a.d || '') < (b.d || '') ? -1 : 1; });
    renderEnroll();
    toast(money(amt) + ' recorded — schedule updated');
  }
  else if (act === 'maildraft')      { openMailDraft(); }
  else if (act === 'copysummary')    {
    if (!pendingMail) return;
    copyText(pendingMail.to + '\n\n' + pendingMail.subject + '\n\n' + pendingMail.body);
  }
  else if (act === 'finalize-done')  { pendingMail = null; renderEnroll(); }
});

/* ================= CHROME ================= */
var qEl = document.getElementById('q'), clr = document.getElementById('clr');
var searchRAF = 0, searchTracked = false;
function onSearch(){
  query = qEl.value;
  if (query && !searchTracked) { searchTracked = true; trackEvent('search_used'); }
  clr.classList.toggle('on', !!query);
  /* one render per animation frame, however fast the rep types */
  if (searchRAF) return;
  searchRAF = (window.requestAnimationFrame || window.setTimeout)(function(){
    searchRAF = 0; buildDir(); renderFeed();
  }, 16);
}
qEl.addEventListener('input', onSearch);
clr.onclick = function(){ qEl.value = ''; onSearch(); qEl.focus(); };

var themeBtn = document.getElementById('theme');
function paintChrome(mode){
  var tc = document.getElementById('tcolor');
  if (tc) tc.setAttribute('content', mode === 'dark' ? '#070B14' : '#EFF1F5');
}
function applyTheme(mode){
  document.documentElement.setAttribute('data-theme', mode);
  themeBtn.innerHTML = mode === 'dark' ? '&#9789;' : '&#9788;';
  paintChrome(mode);
}
themeBtn.onclick = function(){
  var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  store.set('csda_theme', next);
};
document.getElementById('hdrlogo').src = LOGO_MARK;

/* ---------- fullscreen ----------
   Browsers refuse requestFullscreen() unless it is answering a user gesture, so a
   page can never put *itself* fullscreen on load. What works is arming the very
   first click or keypress — which is what "auto" means here. The preference is
   remembered, and if someone leaves fullscreen we stop asking. */
var fsBtn = document.getElementById('fsBtn');
function fsElement(){
  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || null;
}
function fsSupported(){
  var d = document.documentElement;
  return !!(d.requestFullscreen || d.webkitRequestFullscreen || d.mozRequestFullScreen);
}
function enterFS(){
  var d = document.documentElement;
  var fn = d.requestFullscreen || d.webkitRequestFullscreen || d.mozRequestFullScreen;
  if (!fn) return Promise.reject();
  try { return Promise.resolve(fn.call(d)); } catch(e){ return Promise.reject(e); }
}
function exitFS(){
  var fn = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
  if (fn) { try { fn.call(document); } catch(e){} }
}
function paintFS(){
  if (!fsBtn) return;
  var on = !!fsElement();
  fsBtn.innerHTML = on ? '&#10066;' : '&#9974;';
  fsBtn.setAttribute('aria-label', on ? 'Leave fullscreen' : 'Enter fullscreen');
  fsBtn.title = on ? 'Leave fullscreen (Esc)' : 'Fullscreen (F11)';
}
if (fsBtn) {
  if (!fsSupported()) fsBtn.style.display = 'none';      // e.g. a locked-down iframe
  fsBtn.onclick = function(){
    if (fsElement()) { exitFS(); store.set('csda_fs', '0'); }
    else enterFS().then(function(){ store.set('csda_fs', '1'); })
                  .catch(function(){ toast('This browser blocked fullscreen — press F11 instead', true); });
  };
}
['fullscreenchange','webkitfullscreenchange','mozfullscreenchange'].forEach(function(ev){
  document.addEventListener(ev, function(){
    paintFS();
    /* left fullscreen by Esc or F11? take the hint and stop auto-entering */
    if (!fsElement() && store.get('csda_fs') === '1') store.set('csda_fs', '0');
  });
});
paintFS();

/* "auto on launch": fire on the first gesture, once per load */
function armAutoFullscreen(){
  if (!fsSupported() || fsElement()) return;
  if (store.get('csda_fs') === '0') return;              // the user said no last time
  if (isStandalone()) return;                            // installed app is already immersive
  var done = false;
  var go = function(){
    if (done) return;
    done = true;
    document.removeEventListener('pointerdown', go, true);
    document.removeEventListener('keydown', go, true);
    enterFS().then(function(){
      store.set('csda_fs', '1');
      toast('Fullscreen \u2014 press Esc or the \u233A button to leave');
    }).catch(function(){});
  };
  document.addEventListener('pointerdown', go, true);
  document.addEventListener('keydown', go, true);
  setTimeout(function(){
    done = true;
    document.removeEventListener('pointerdown', go, true);
    document.removeEventListener('keydown', go, true);
  }, 20000);                                             // stop lurking after 20s
}


