/* CSDA Admin navigation, catalogue, work queue, policies, and configuration views. */
function renderAdmin(){
  stashAdminIO();
  if (pendingDel !== null && aTab !== 'recs') pendingDel = null;
  var b = document.getElementById('aBody');
  document.getElementById('aTitle').textContent = authed ? 'Manage Catalogue' : 'Administrator Access';
  if(recoveryReveal){
    b.innerHTML='<div class="pwwrap" style="max-width:620px"><div class="lockicon">&#128273;</div><div style="font-size:17px;font-weight:750;margin-bottom:8px">Store the offline recovery key now</div><div class="alert"><div class="ai">&#9888;</div><div class="at"><b>This key is shown once.</b><br>Anyone holding it can reset the local Administrator password. Store it in CSDA’s approved offline credential record, separate from app backups.</div></div><div class="okbox" id="recoveryKeyValue" style="font:700 16px/1.5 monospace;word-break:break-all;text-align:center">'+esc(recoveryReveal)+'</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0"><button class="btn" id="copyRecovery">Copy key</button><button class="btn" id="printRecovery">Print key</button></div><label class="ck" id="recoveryStored"><input type="checkbox" id="recoveryStoredInput"><div class="cbox">&#10003;</div><div class="ckt">I confirm CSDA stored this key securely offline.</div></label><div id="pwerr" style="color:var(--rd);font-size:12px;font-weight:650;min-height:18px;margin-top:8px"></div><button class="btn pri blk" id="finishRecovery">Continue to Admin</button></div>';
    document.getElementById('copyRecovery').onclick=function(){navigator.clipboard&&navigator.clipboard.writeText(recoveryReveal).then(function(){toast('Recovery key copied');});};
    document.getElementById('printRecovery').onclick=function(){var w=window.open('','_blank');if(w){w.document.write('<title>CSDA Recovery Key</title><body style="font-family:Arial;padding:50px"><h1>CSDA Administrator Recovery Key</h1><p>Store securely offline. Anyone holding this key can reset the local Administrator password.</p><pre style="font-size:20px;border:2px solid #222;padding:20px">'+esc(recoveryReveal)+'</pre><p>Generated '+new Date().toLocaleString()+'</p></body>');w.document.close();w.print();}};
    document.getElementById('finishRecovery').onclick=function(){if(!document.getElementById('recoveryStoredInput').checked){document.getElementById('pwerr').textContent='Confirm that the recovery key was stored securely before continuing.';return;}recoveryReveal='';authed=true;renderAdmin();};return;
  }
  if (!authed) {
    if(!credentialConfigured()&&!recoveryMode){var customLegacy=DB.cfg&&DB.cfg.pwd&&DB.cfg.pwd!=='csda2026';b.innerHTML='<div class="pwwrap" style="max-width:520px"><div class="lockicon">&#128274;</div><div style="font-size:17px;font-weight:750;margin-bottom:6px">Credential upgrade required</div><div class="note" style="text-align:left">Create a private Administrator passphrase. The known legacy default can no longer be used. A one-time offline recovery key will be generated.</div><label class="flab">Name of person configuring access</label><input class="finp pwi" id="setupWho" autocomplete="name">'+(customLegacy?'<label class="flab">Current legacy password</label><input class="finp pwi" id="setupOld" type="password">':'')+'<label class="flab">New Administrator password</label><input class="finp pwi" id="setupNew" type="password" autocomplete="new-password"><small class="sc">At least 12 characters, including a letter and a number.</small><label class="flab" style="margin-top:9px">Confirm new password</label><input class="finp pwi" id="setupConfirm" type="password" autocomplete="new-password"><div id="pwerr" style="color:var(--rd);font-size:12px;font-weight:650;min-height:18px;margin-top:8px"></div><button class="btn pri blk" id="setupGo">Configure secure access</button></div>';
      document.getElementById('setupGo').onclick=async function(){var who=(document.getElementById('setupWho').value||'').trim(),np=document.getElementById('setupNew').value,cf=document.getElementById('setupConfirm').value,er=document.getElementById('pwerr');if(!who){er.textContent='Enter the name of the person configuring access.';return;}if(customLegacy&&document.getElementById('setupOld').value!==DB.cfg.pwd){er.textContent='Current legacy password is incorrect.';return;}var pe=passwordPolicy(np);if(pe){er.textContent=pe;return;}if(np!==cf){er.textContent='The new passwords do not match.';return;}try{var key=newRecoveryKey();await configureAdministratorCredential(np,key,true);staffName=who;logAction('Legacy Administrator credential upgraded',who);save();recoveryReveal=key;renderAdmin();}catch(x){er.textContent=x.message||'Credential setup failed.';}};return;}
    if(recoveryMode){b.innerHTML='<div class="pwwrap" style="max-width:520px"><div class="lockicon">&#128273;</div><div style="font-size:17px;font-weight:750;margin-bottom:6px">Recover Administrator access</div><div class="note" style="text-align:left">Use CSDA’s securely stored offline recovery key. Successful recovery invalidates that key and generates a replacement.</div><label class="flab">Name of person recovering access</label><input class="finp pwi" id="recoverWho"><label class="flab">Offline recovery key</label><input class="finp pwi" id="recoverKey" autocomplete="off"><label class="flab">New Administrator password</label><input class="finp pwi" id="recoverNew" type="password"><label class="flab">Confirm new password</label><input class="finp pwi" id="recoverConfirm" type="password"><div id="pwerr" style="color:var(--rd);font-size:12px;font-weight:650;min-height:18px;margin-top:8px"></div><button class="btn pri blk" id="recoverGo">Reset password</button><button class="btn blk" id="recoverCancel" style="margin-top:8px">Back to sign-in</button></div>';
      document.getElementById('recoverCancel').onclick=function(){recoveryMode=false;renderAdmin();};document.getElementById('recoverGo').onclick=async function(){var who=(document.getElementById('recoverWho').value||'').trim(),key=(document.getElementById('recoverKey').value||'').trim().toUpperCase(),np=document.getElementById('recoverNew').value,cf=document.getElementById('recoverConfirm').value,er=document.getElementById('pwerr');if(!who){er.textContent='Enter the name of the person recovering access.';return;}if(!(await verifyCredential(key,'recovery'))){er.textContent='Recovery key is incorrect.';return;}var pe=passwordPolicy(np);if(pe){er.textContent=pe;return;}if(np!==cf){er.textContent='The new passwords do not match.';return;}var replacement=newRecoveryKey(),oldAuth=DB.cfg.auth;await configureAdministratorCredential(np,replacement,false);DB.cfg.auth.createdAt=oldAuth.createdAt;staffName=who;logAction('Administrator password recovered using offline key; recovery key rotated',who);save();recoveryMode=false;recoveryReveal=replacement;renderAdmin();};return;}
    b.innerHTML = '<div class="pwwrap"><div class="lockicon">&#128274;</div><div style="font-size:14px;font-weight:650;margin-bottom:6px">Administrator sign-in</div><div style="font-size:12px;color:var(--ter);margin-bottom:10px">Enter your name and administrator password. Every successful access is recorded.</div><label class="flab" for="adminWho">Name of person accessing</label><input class="finp pwi" id="adminWho" value="'+esc(staffName)+'" autocomplete="name"><label class="flab" for="pw">Administrator password</label><input class="finp pwi" id="pw" type="password" autocomplete="current-password"><div id="pwerr" style="color:var(--rd);font-size:12px;font-weight:650;min-height:18px;margin-top:8px"></div><button class="btn pri blk" id="pwgo">Unlock</button><button class="btn blk" id="forgotPw" style="margin-top:8px">Forgot password / Use recovery key</button></div>';
    var go=async function(){var who=(document.getElementById('adminWho').value||'').trim(),pw=document.getElementById('pw').value,er=document.getElementById('pwerr');if(!who){er.textContent='Enter the name of the person accessing Admin.';return;}if(await verifyAdministratorPassword(pw)){staffName=who;authed=true;trackEvent('admin_unlocked');logAction('Administrator access opened',staffName);save();renderAdmin();toast('Administrator unlocked for '+staffName);}else{er.textContent='Incorrect password.';document.getElementById('pw').value='';}};
    document.getElementById('pwgo').onclick=go;document.getElementById('forgotPw').onclick=function(){recoveryMode=true;renderAdmin();};document.getElementById('pw').onkeydown=function(e){if(e.key==='Enter')go();};return;
  }
  if (!aupAccepted()) {
    b.innerHTML = aupPanel(true);
    return;
  }
  var nrec=(DB.records||[]).length;
  var groups=[['Daily Work',[['dashboard','Today / Work Queue'],['verify','Verify Payments'],['audits','Completion Audit'],['recs','Enrollments'],['monitor','Class Monitor']]],['Catalogue',[['courses','Courses'],['cats','Categories'],['trainers','Trainers'],['promos','Promotions'],['plans','Payment Plans']]],['Operations',[['fac','Facility'],['hols','Holidays']]],['Governance',[['guide','General Guidelines'],['policy','Policies'],['data','Backup & Restore']]]];
  var side='<aside class="adminside" aria-label="Administrator navigation">'+groups.map(function(g){return '<div class="admingroup"><div class="admingroupt">'+g[0]+'</div>'+g[1].map(function(t){var label=t[1];if(t[0]==='verify'&&pendingPayCount())label+=' ('+pendingPayCount()+')';if(t[0]==='recs'&&nrec)label+=' ('+nrec+')';return '<button data-tab="'+t[0]+'" class="'+(aTab===t[0]?'on':'')+'" aria-current="'+(aTab===t[0]?'page':'false')+'">'+label+'</button>';}).join('')+'</div>';}).join('')+'</aside>';
  var h='<div class="adminshell">'+side+'<section class="admincontent"><div id="a-tab-panel">';
  if(aTab==='dashboard')h+=adminWorkQueue();
  if(aTab==='courses')h+=adminCourses();
  if(aTab==='cats')h+=adminCats();
  if(aTab==='trainers')h+=adminTrainers();
  if(aTab==='hols')h+=adminHolidays();
  if(aTab==='fac')h+=adminFacility();
  if(aTab==='verify')h+=adminVerify();
  if(aTab==='audits')h+=adminCompletionAudits();
  if(aTab==='guide')h+=adminGeneralGuidelines();
  if(aTab==='policy')h+=adminPolicies();
  if(aTab==='promos')h+=adminPromos();
  if(aTab==='plans')h+=adminPlans();
  if(aTab==='recs')h+=adminRecs();
  if(aTab==='data')h+=adminData();
  h+='</div></section></div>';
  b.innerHTML = h;
  enhanceCustomControls(b);
  if(aTab==='dashboard'){[['workStatus',workFilters.status],['workPayment',workFilters.payment],['workClearance',workFilters.clearance],['workRefund',workFilters.refund]].forEach(function(x){var n=document.getElementById(x[0]);if(n)n.value=x[1];});}
  if (aTab === 'courses' && editId !== null) {
    initCourseArtEditor();
    var ceb=b.querySelector('.courseeditorbody');if(ceb)ceb.scrollTop=courseEditorScroll;
  }
}

function courseArtEditorHTML(it){
  return '<div class="course-dynamic"><div><div class="ms"><div class="msh">Course artwork &middot; 16:9</div>' +
    '<div class="note" style="margin-top:0;font-size:12px">Upload an image, then drag to frame the 16:9 card crop. The focused detail preserves the complete optimized artwork; zoom and movement affect only the compact card.</div>' +
    '<div class="arteditor"><div class="artstage" id="artStage">' +
      '<canvas id="artCanvas" width="960" height="540" aria-label="Course artwork editor"></canvas>' +
      '<div class="artempty" id="artEmpty">Choose an image to begin<br>JPG, PNG, or WebP</div></div>' +
    '<div class="arttools"><label class="btn" style="cursor:pointer">Choose artwork' +
      '<input type="file" id="artFile" accept="image/jpeg,image/png,image/webp" style="display:none"></label>' +
      '<div class="field"><label class="flab" for="artZoom">Zoom</label>' +
        '<input id="artZoom" type="range" min="1" max="3" step="0.01" value="1" style="width:100%"></div>' +
      '<div class="artmove"><span></span><button class="btn" data-art="up" aria-label="Move artwork up">&#8593;</button><span></span>' +
        '<button class="btn" data-art="left" aria-label="Move artwork left">&#8592;</button>' +
        '<button class="btn" data-art="down" aria-label="Move artwork down">&#8595;</button>' +
        '<button class="btn" data-art="right" aria-label="Move artwork right">&#8594;</button></div>' +
      '<button class="btn" data-art="rotate-left">Rotate left 90°</button>' +
      '<button class="btn" data-art="rotate-right">Rotate right 90°</button>' +
      '<button class="btn" data-art="reset">Reset framing</button>' +
      '<button class="btn pri" data-art="apply">Apply artwork</button>' +
      (it.art ? '<button class="btn dgr" data-art="remove">Remove artwork</button>' : '') +
    '</div></div></div></div></div>';
}

function adminWorkQueue(){
  var recs=DB.records||[],now=Date.now(),cfg=DB.cfg.reminders||(DB.cfg.reminders={paymentDays:3,auditDays:2,refundDays:2,backupDays:7}),pending=pendingPayCount(),audits=recs.filter(function(r){return lifecycleOf(r).state===TIMELINE_DONE&&!(r.certification&&r.certification.finalized)&&!r.archivedAt;}),refunds=recs.filter(function(r){var credit=Math.max(0,approvedPaymentsTotal(r)-(+(r.totals||{}).net||0)),f=(r.certification||{}).financial||{};return credit>.005&&!f.refundConfirmed&&!r.archivedAt;}),invalid=recs.filter(function(r){return (r.completionAuditChanges||[]).some(function(x){return /invalidated/i.test(x.note||'');})&&!(r.certification&&r.certification.finalized)&&!r.archivedAt;}),soon=recs.filter(function(r){var d=new Date(((r.sched||{}).start||'')+'T00:00:00').getTime();return isFinite(d)&&d>=now&&d<=now+7*86400000&&!r.archivedAt;}),backup=backupStatus();
  var reminders=[];recs.forEach(function(r){if(r.archivedAt)return;(r.payments||[]).forEach(function(p){var d=new Date((p.date||p.at||'')+'T00:00:00').getTime();if((p.status||'Pending')==='Pending'&&isFinite(d)&&(now-d)/86400000>=cfg.paymentDays)reminders.push({ref:r.ref,type:'Payment verification overdue'});});var end=new Date(((r.sched||{}).end||(r.sched||{}).start||'')+'T23:59:00').getTime();if(lifecycleOf(r).state===TIMELINE_DONE&&!(r.certification&&r.certification.finalized)&&isFinite(end)&&(now-end)/86400000>=cfg.auditDays)reminders.push({ref:r.ref,type:'Completion Audit overdue'});var credit=Math.max(0,approvedPaymentsTotal(r)-(+(r.totals||{}).net||0)),f=(r.certification||{}).financial||{};if(credit>.005&&!f.refundConfirmed&&isFinite(end)&&(now-end)/86400000>=cfg.refundDays)reminders.push({ref:r.ref,type:'Refund evidence overdue'});if((r.completionAuditChanges||[]).some(function(x){return /invalidated/i.test(x.note||'');})&&!(r.certification&&r.certification.finalized))reminders.push({ref:r.ref,type:'Clearance invalidated after edit'});});if(backup.ageDays==null||backup.ageDays>=cfg.backupDays||backup.changes>=10)reminders.push({ref:'Application',type:'Protected backup due'});
  function card(n,title,desc,action,label){return '<article class="workcard"><div class="worknum">'+n+'</div><b>'+title+'</b><div class="sc" style="margin-top:4px">'+desc+'</div><button class="btn sm '+(n?'pri':'')+'" data-work="'+action+'">'+label+'</button></article>';}
  var filtered=recs.filter(function(r){if(!workFilters.showArchived&&r.archivedAt)return false;var txt=[r.ref,(r.student||{}).name,(r.trainer||{}).name,(r.courses||[]).map(function(id){var x=itemById(id);return x?x.n:id;}).join(' ')].join(' ').toLowerCase();if(workFilters.q&&txt.indexOf(workFilters.q.toLowerCase())<0)return false;if(workFilters.status&&(r.enrollmentStatus||'active')!==workFilters.status)return false;var ps=payState(r.payments)||'none';if(workFilters.payment&&ps!==workFilters.payment)return false;var clear=(r.certification&&r.certification.finalized)?'cleared':'pending';if(workFilters.clearance&&clear!==workFilters.clearance)return false;var credit=Math.max(0,approvedPaymentsTotal(r)-(+(r.totals||{}).net||0)),rf=((r.certification||{}).financial||{});var rs=credit>.005?(rf.refundConfirmed?'confirmed':'required'):'none';if(workFilters.refund&&rs!==workFilters.refund)return false;var day=(r.sched||{}).start||r.date||'';if(workFilters.from&&day<workFilters.from)return false;if(workFilters.to&&day>workFilters.to)return false;return true;});
  var filter='<div class="ms"><div class="msh">Local record search and filters</div><div class="frow f3"><div class="field"><label class="flab">Learner, reference, course, or trainer</label><input class="finp" id="workQ" value="'+esc(workFilters.q)+'"></div><div class="field"><label class="flab">Enrollment status</label><select class="finp" id="workStatus"><option value="">All</option><option value="active">Active</option><option value="dropped">Dropped</option><option value="cancelled">Cancelled</option></select></div><div class="field"><label class="flab">Payment status</label><select class="finp" id="workPayment"><option value="">All</option><option>Pending</option><option>Approved</option><option>Flagged</option><option>Suspended</option><option value="none">No payments</option></select></div></div><div class="frow"><div class="field"><label class="flab">Clearance</label><select class="finp" id="workClearance"><option value="">All</option><option value="pending">Pending</option><option value="cleared">Cleared</option></select></div><div class="field"><label class="flab">Refund</label><select class="finp" id="workRefund"><option value="">All</option><option value="required">Required</option><option value="confirmed">Confirmed</option><option value="none">None</option></select></div><div class="field"><label class="flab">From</label><input class="finp" id="workFrom" type="date" value="'+esc(workFilters.from)+'"></div><div class="field"><label class="flab">To</label><input class="finp" id="workTo" type="date" value="'+esc(workFilters.to)+'"></div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" data-workfilter="apply">Apply filters</button><button class="btn" data-workfilter="clear">Clear all</button><button class="btn" data-workfilter="archived">'+(workFilters.showArchived?'Hide archived':'Include archived')+'</button></div><div class="note">'+filtered.length+' matching local record'+(filtered.length===1?'':'s')+'. Search terms stay on this device.</div>'+filtered.slice(0,50).map(function(r){var hold=retentionHeld(r);return '<div class="gate-row"><div style="flex:1"><b>'+esc((r.student||{}).name||'Unnamed')+'</b> · '+esc(r.ref)+'<br><span class="sc">'+esc((r.enrollmentStatus||'active'))+(r.archivedAt?' · Archived '+esc(String(r.archivedAt).slice(0,10)):'')+(hold?' · Retention hold: '+esc(hold.kind||'protected'):'')+'</span></div><button class="btn sm" data-workrecord="'+esc(r.ref)+'">Open</button>'+(r.archivedAt?'<button class="btn sm" data-workunarchive="'+esc(r.ref)+'">Restore</button>':'<button class="btn sm" data-workarchive="'+esc(r.ref)+'" '+(hold?'disabled':'')+'>Archive</button>')+'</div>';}).join('')+'</div>';
  var settings='<div class="ms"><div class="msh">Reminder thresholds</div><div class="note">Reminders identify work only. They never approve, move, confirm, clear, or issue anything.</div><div class="frow f3"><div class="field"><label class="flab">Payment pending days</label><input class="finp" id="remPayment" type="number" min="1" value="'+cfg.paymentDays+'"></div><div class="field"><label class="flab">Done without audit days</label><input class="finp" id="remAudit" type="number" min="1" value="'+cfg.auditDays+'"></div><div class="field"><label class="flab">Refund evidence days</label><input class="finp" id="remRefund" type="number" min="1" value="'+cfg.refundDays+'"></div><div class="field"><label class="flab">Backup age days</label><input class="finp" id="remBackup" type="number" min="1" value="'+cfg.backupDays+'"></div></div><button class="btn" data-workreminders="save">Save reminder thresholds</button><div class="msh" style="margin-top:15px">Current reminders · '+reminders.length+'</div>'+reminders.slice(0,30).map(function(x){return '<div class="gate-row"><b>'+esc(x.ref)+'</b><span>'+esc(x.type)+'</span></div>';}).join('')+(reminders.length?'':'<div class="note">No reminder threshold is currently exceeded.</div>')+'</div>';
  return '<div class="monitorbar"><div><b>Today / Work Queue</b><div class="monitorlegend">Start with the oldest unresolved operational work. Counts update from the saved local session.</div></div><button class="btn" data-work="refresh">Refresh</button></div><div class="workgrid">'+card(pending,'Payments waiting','Receipts requiring independent verification.','verify','Open payment queue')+card(audits.length,'Completion Audits','Done enrollments not finally cleared.','audits','Open audit queue')+card(refunds.length,'Refund actions','Overpayments without completed refund confirmation.','audits','Review refunds')+card(invalid.length,'Invalidated clearances','Material enrollment changes requiring reapproval.','audits','Review reapprovals')+card(soon.length,'Starting within 7 days','Active schedules approaching their start date.','monitor','Open Class Monitor')+card(backup&&backup.ageDays!=null?backup.ageDays:'—','Days since backup','Create a protected checkpoint according to CSDA policy.','data','Open Backup & Restore')+'</div>'+settings+filter+'<div class="note" style="margin-top:14px"><b>Retention policy:</b> No automatic deletion. Archive is a guarded manual action; financial and TESDA-held records remain protected.</div>';
}
function adminCourses(){
  if (editId !== null) {
    var it=draft,mods=it.modules||[];
    var intro=courseEditorAnimate?' intro':'',h='<div class="lifedetailback courseeditorback'+intro+'"><section class="lifedetail'+intro+'" role="dialog" aria-modal="true" aria-labelledby="courseEditorTitle" data-courseeditor="1"><div class="lifedetailh"><div><div class="liferef">Administrator · Courses</div><h3 id="courseEditorTitle" style="margin:4px 0">'+(editId==='new'?'New course':'Edit '+esc(it.n||'course'))+'</h3></div><button class="mx" data-act="cancel-course" aria-label="Close course editor">&#10005;</button></div><div class="coursevalidation" id="courseEditorStatus" aria-live="polite"></div><div class="courseeditorbody">'+courseArtEditorHTML(it) + '<div class="ms"><div class="msh">'+(editId==='new'?'New course':'Edit course')+'</div>' +
      '<div class="field"><label class="flab">Course name <span class="req">*</span></label>' +
        '<input class="finp" id="f_n" value="'+esc(it.n)+'" placeholder="e.g. Core 3 — Perspective"></div>' +
      '<div class="frow"><div class="field"><label class="flab">Category</label><select class="finp" id="f_c">' +
        DB.cats.map(function(c){ return '<option value="'+c.id+'"'+(c.id===it.c?' selected':'')+'>'+esc(c.name)+'</option>'; }).join('') +
        '</select></div>' +
      '<div class="field"><label class="flab">Price ('+P+') <span class="req">*</span></label>' +
        '<input class="finp" id="f_price" type="number" step="0.01" value="'+(it.price==null?'':it.price)+'"></div></div>' +
      '<div class="field"><label class="flab">Description <small style="font-weight:500;color:var(--ter)">— shown to reps and parents when the course is opened</small></label>' +
        '<textarea class="finp" id="f_desc" style="min-height:82px" placeholder="What the student learns, who it is for, what they walk away with.">'+esc(it.desc||'')+'</textarea></div>' +
      '<div class="frow f3"><div class="field"><label class="flab">Contact hours</label>' +
        '<input class="finp" id="f_hrs" type="number" value="'+(it.hrs==null?'':it.hrs)+'"></div>' +
      '<div class="field"><label class="flab">Sessions</label>' +
        '<input class="finp" id="f_sess" type="number" value="'+(it.sess==null?'':it.sess)+'"></div>' +
      '<div class="field"><label class="flab">Hours per session</label>' +
        '<input class="finp" id="f_dur" type="number" step="0.5" min="0.5" value="'+(it.dur==null?'':it.dur)+'"></div></div>' +
      '<div class="frow"><div class="field"><label class="flab">Unit label</label>' +
        '<input class="finp" id="f_unit" value="'+esc(it.unit||'')+'" placeholder="'+P+'650 / session"></div>' +
      '<div class="field"><label class="flab">Trainer ' +
        '<small style="font-weight:500;color:var(--ter)">— fills in on enrollment, still overridable</small></label>' +
        trainerSelect('f_trainer',it.trainer||'')+'<div class="note" style="font-size:11px">Primary default. Additional trainers may be assigned during enrollment.</div></div></div>' +
      '<div class="frow"><div class="field"><label class="flab">Course titles (comma separated)</label>' +
        '<input class="finp" id="f_titles" value="'+esc((it.titles||[]).join(', '))+'"></div>' +
      '<div class="field"><label class="flab">Titles heading</label>' +
        '<input class="finp" id="f_tlab" value="'+esc(it.tlab||'')+'" placeholder="e.g. 5 modules"></div></div>' +
      '<div class="field"><label class="flab">Internal note</label><textarea class="finp" id="f_note">'+esc(it.note||'')+'</textarea></div>' +
      '<div class="field"><label class="flab">Search keywords</label><textarea class="finp" id="f_kw">'+esc(it.kw||'')+'</textarea></div>' +
      '<div class="frow"><div class="ck'+(it.bundleable!==false?' on':'')+'" id="f_bundle"><div class="cbox">&#10003;</div>' +
        '<div class="ckt">Bundleable<small>Can join multi-course quotes</small></div></div>' +
      '<div class="ck'+(it.hidden?' on':'')+'" id="f_hidden"><div class="cbox">&#10003;</div>' +
        '<div class="ckt">Hidden<small>Hide from reps and enrollment</small></div></div>' +
      '<div class="ck'+(it.nofull?' on':'')+'" id="f_nofull"><div class="cbox">&#10003;</div>' +
        '<div class="ckt">Single-session workshop<small>No full-payment discount</small></div></div></div></div>';

    h += '<div class="ms"><div class="msh">Modules &amp; lessons</div>';
    if (!mods.length) h += '<div style="font-size:12.5px;color:var(--ter);margin-bottom:11px">No modules yet. Add one to outline the curriculum for trainers.</div>';
    mods.forEach(function(m, ix){
      h += '<div class="modblk"><div class="modh">' +
        '<span class="mini">'+(ix+1)+'</span>' +
        '<input class="finp" id="mod_n_'+ix+'" value="'+esc(m.name||'')+'" placeholder="Module name">' +
        '<button class="btn dgr sm" data-delmod="'+ix+'">Remove</button></div>' +
        '<div class="lessl">Lessons — one per line</div>' +
        '<textarea class="finp" id="mod_l_'+ix+'" style="min-height:76px" placeholder="Lesson 1&#10;Lesson 2">'+
        esc((m.lessons||[]).join('\n'))+'</textarea></div>';
    });
    h += '<button class="btn sm" data-act="addmod">&#43; Add module</button></div>';
    h += '</div><footer class="courseeditorfooter">' +
      '<button class="btn pri" data-act="save-course">Save course</button>' +
      '<button class="btn" data-act="cancel-course">Cancel</button>' +
      (editId!=='new' ? '<button class="btn dgr" data-act="del-course" style="margin-left:auto">Delete course</button>' : '') +
      '</footer></section></div>';
    courseEditorAnimate=false;
    return h;
  }

  var hidCount = DB.items.filter(function(i){ return i.hidden; }).length;
  var h2 = '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap">' +
    '<div style="font-size:12.5px;color:var(--sec)"><b>'+DB.items.length+'</b> courses · <b>'+DB.cats.length+'</b> categories' +
    (hidCount ? ' · <b class="rd">'+hidCount+' hidden</b>' : '') + '</div>' +
    '<button class="btn pri" data-act="new-course">&#43; New course</button></div>';
  DB.cats.forEach(function(c){
    var list = DB.items.filter(function(i){ return i.c === c.id; });
    if (!list.length) return;
    h2 += '<div class="msh" style="margin-top:18px"><span class="swatch" style="background:'+c.color+'"></span>' +
      esc(c.name) + (c.hidden ? ' <span class="tag h">category hidden</span>' : '') + '</div><div class="ablocks">';
    list.forEach(function(i){
      var nMod = (i.modules||[]).length;
      var nLes = (i.modules||[]).reduce(function(s,m){ return s + (m.lessons||[]).length; }, 0);
      h2 += '<div class="ab'+(i.hidden?' hid':'')+'" tabindex="0" role="button" data-courseinspect="'+i.id+'">' +
        (i.art ? '<div class="abart"><img src="'+esc(i.art)+'" alt="">' +
          (i.hidden?'<span class="abartflag">Inactive</span>':'')+'</div>' : '') +
        '<div class="abn">'+esc(i.n)+'</div><div class="abm">' +
        (i.hidden ? '<span class="tag h">Hidden</span>' : '') +
        (i.hrs ? '<span class="mini">'+i.hrs+' hrs</span>' : '') +
        (i.sess ? '<span class="mini">'+i.sess+' sess</span>' : '') +
        (nMod ? '<span class="mini">'+nMod+' mod</span>' : '') +
        (nLes ? '<span class="mini">'+nLes+' lessons</span>' : '') +
        (i.bundleable===false ? '<span class="mini">no bundle</span>' : '') +
        '</div><div class="abp mono">'+(i.price!=null?money(i.price):'—')+'</div></div>';
    });
    h2 += '</div>';
  });
  return h2;
}

function adminCats(){
  var h = '<div style="font-size:12.5px;color:var(--sec);margin-bottom:14px">Hiding a category hides every course inside it.</div>';
  DB.cats.forEach(function(c){
    h += '<div class="arow" style="display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--line);border-radius:11px;padding:11px 13px;margin-bottom:7px;flex-wrap:wrap">' +
      '<span class="swatch" style="background:'+c.color+'"></span>' +
      '<input class="finp" data-cf="name" data-cid="'+c.id+'" value="'+esc(c.name)+'" style="flex:1 1 150px;font-weight:650">' +
      '<input class="finp" data-cf="page" data-cid="'+c.id+'" value="'+esc(c.page)+'" style="width:86px" placeholder="Page">' +
      '<input class="finp" data-cf="baseline" data-cid="'+c.id+'" type="number" value="'+(c.baseline||'')+'" style="width:92px" placeholder="'+P+'/hr">' +
      '<button class="btn sm" data-togcat="'+c.id+'">'+(c.hidden?'Show':'Hide')+'</button></div>';
  });
  h += '<div style="display:flex;gap:9px;margin-top:16px;flex-wrap:wrap">' +
    '<button class="btn pri" data-act="save-cats">Save categories</button>' +
    '<button class="btn" data-act="new-cat">&#43; New category</button></div>';
  return h;
}

function adminPromos(){
  var h = '<div style="font-size:12.5px;color:var(--sec);margin-bottom:14px"><b>Kind</b> sets behaviour: ' +
    '<b>manual</b> = rep ticks it · <b>fullpay</b> = only valid on the Full Payment plan · ' +
    '<b>bundle</b> = auto-applies at the minimum course count.</div>';
  DB.promos.forEach(function(p){
    h += '<div style="display:grid;gap:8px;grid-template-columns:1fr auto auto auto auto;align-items:center;background:var(--bg2);border:1px solid var(--line);border-radius:11px;padding:10px 12px;margin-bottom:7px">' +
      '<input class="finp" data-pf="label" data-pid="'+p.id+'" value="'+esc(p.label)+'" style="font-weight:650">' +
      '<input class="finp" data-pf="pct" data-pid="'+p.id+'" type="number" step="0.5" value="'+p.pct+'" style="width:72px">' +
      '<select class="finp" data-pf="kind" data-pid="'+p.id+'" style="width:100px">' +
        ['manual','fullpay','bundle'].map(function(k){ return '<option'+(p.kind===k?' selected':'')+'>'+k+'</option>'; }).join('') +
      '</select>' +
      '<input class="finp" data-pf="min" data-pid="'+p.id+'" type="number" value="'+(p.min||'')+'" style="width:62px" placeholder="min">' +
      '<button class="btn dgr sm" data-delpromo="'+p.id+'">Delete</button>' +
      '<input class="finp" data-pf="sub" data-pid="'+p.id+'" value="'+esc(p.sub||'')+'" style="grid-column:1/-1" placeholder="Description shown to the rep"></div>';
  });
  h += '<div style="display:flex;gap:9px;margin-top:14px;flex-wrap:wrap">' +
    '<button class="btn pri" data-act="save-promos">Save promos</button>' +
    '<button class="btn" data-act="new-promo">&#43; New promo</button></div>';
  h += '<div class="ms" style="margin-top:24px"><div class="msh">Global rules &amp; branding</div>' +
    '<div class="frow"><div class="field"><label class="flab">Late payment interest (%)</label>' +
      '<input class="finp" id="cfg_late" type="number" step="0.5" value="'+DB.cfg.late+'"></div>' +
    '<div class="field"><label class="flab">Administrator credential</label><div class="okbox">Verifier-based access configured · password is not displayed or stored for reuse.</div></div></div>' +
    '<div class="ms"><div class="msh">Change Administrator password</div><div class="frow f3"><div class="field"><label class="flab">Current password</label><input class="finp" id="cfg_pw_current" type="password"></div><div class="field"><label class="flab">New password</label><input class="finp" id="cfg_pw_new" type="password"></div><div class="field"><label class="flab">Confirm new password</label><input class="finp" id="cfg_pw_confirm" type="password"></div></div><button class="btn" data-act="change-admin-pw">Change password</button></div>' +
    '<div class="frow"><div class="field"><label class="flab">Organisation name <small style="font-weight:500;color:var(--ter)">— internal reference only</small></label>' +
      '<input class="finp" id="cfg_org" value="'+esc(DB.cfg.org)+'"></div>' +
    '<div class="field"><label class="flab">Locality</label>' +
      '<input class="finp" id="cfg_orgsub" value="'+esc(DB.cfg.orgsub)+'"></div></div>' +
    '<div class="frow"><div class="field"><label class="flab">Telephone</label>' +
      '<input class="finp" id="cfg_tel" value="'+esc(DB.cfg.tel||'')+'" placeholder="(074) 000 0000"></div>' +
    '<div class="field"><label class="flab">Mobile</label>' +
      '<input class="finp" id="cfg_mobile" value="'+esc(DB.cfg.mobile||'')+'" placeholder="0917 000 0000"></div>' +
    '<div class="field"><label class="flab">Email address</label>' +
      '<input class="finp" id="cfg_email" type="email" value="'+esc(DB.cfg.email||'')+'" placeholder="hello@csda.ph"></div></div>' +
    '<div class="field"><label class="flab">Footer address <small style="font-weight:500;color:var(--ter)">— printed at the foot of every enrollment form</small></label>' +
      '<input class="finp" id="cfg_addr" value="'+esc(DB.cfg.addr||'')+'"></div>' +
    '<div class="ck'+(DB.cfg.combine?' on':'')+'" id="cfg_combine" style="max-width:340px"><div class="cbox">&#10003;</div>' +
      '<div class="ckt">Allow discounts to stack<small>Overrides the Page 16 single-discount rule</small></div></div>' +
    '<button class="btn pri" data-act="save-cfg" style="margin-top:14px">Save rules</button></div>';
  return h;
}

/* Trainer dropdowns appear in the course editor and on the enrollment form.
   Values are trainer ids, so the email travels with the choice. */
function trainerSelect(id, selectedId, extraAttr){
  var list=(DB.trainers||[]).filter(function(t){return t.name&&!/\//.test(t.name);});
  if(!list.length) {
    return '<select class="finp" id="' + id + '" disabled>' +
      '<option value="">No trainers yet \u2014 add them under Trainers</option></select>';
  }
  return '<select class="finp" id="' + id + '"' + (extraAttr || '') + '>' +
    '<option value="">\u2014 none \u2014</option>' +
    list.map(function(t){
      return '<option value="' + esc(t.id) + '"' + (t.id === selectedId ? ' selected' : '') + '>' +
        esc(t.name) + (t.email ? ' \u00b7 ' + esc(t.email) : '') + '</option>';
    }).join('') + '</select>';
}
function trainerById(id){
  return (DB.trainers || []).filter(function(t){ return t.id === id; })[0] || null;
}
/* the trainer a bundle implies: the first selected course that names one */
function courseTrainer(ids){
  for (var i = 0; i < (ids || []).length; i++) {
    var it = itemById(ids[i]);
    if (it && it.trainer) { var tr = trainerById(it.trainer); if (tr) return tr; }
  }
  return null;
}

function trainerTimeSummary(id){var rows=[],total=0;(DB.records||[]).forEach(function(r){var course=(r.courses||[]).map(function(x){var i=itemById(x);return i?i.n:x;}).join(' / '),seen=false;(r.trainerAssignments||[]).forEach(function(a){if(a.trainerId===id){seen=true;var h=+a.hours||0;total+=h;rows.push({ref:r.ref,course:course,start:a.start,end:a.end,hours:h});}});if(!seen&&r.trainer&&r.trainer.id===id){var people=1+(r.trainerAssignments||[]).filter(function(a){return a.trainerId;}).length,h=(+(r.sched||{}).hrs||0)/people;h=Math.round(h*100)/100;total+=h;var tids=(r.sched||{}).trainerIds||[],owned=[];tids.forEach(function(ti,ix){if(ti===id)owned.push(ix);});var ds=(r.sched||{}).dates||[];rows.push({ref:r.ref,course:course,start:owned.length?ds[owned[0]]:(r.sched||{}).start,end:owned.length?ds[owned[owned.length-1]]:(r.sched||{}).end,hours:h});}});return {rows:rows,total:total};}
function adminTrainers(){
  migrateIndividualTrainers();
  var list=(DB.trainers||[]).filter(function(t){return t.name&&!/\//.test(t.name);}),h='<div class="note" style="margin-top:0">One person per trainer entry. Course enrollments may add multiple trainers with independent date ranges and credited hours.</div><div class="ablocks">';
  list.forEach(function(t,ix){var ts=trainerTimeSummary(t.id);h+='<div class="ab'+(t.active===false?' hid':'')+'" tabindex="0" role="button" data-tredit="'+ix+'">'+(t.photo?'<div class="abart"><img src="'+esc(t.photo)+'" alt=""></div>':'')+'<div class="abn">'+esc(t.name||'Unnamed trainer')+'</div><div class="abm">'+esc(t.title||'Trainer')+' · '+ts.total+' credited hrs'+(t.active===false?' · Inactive':'')+'</div></div>';});
  h+='</div><button class="btn pri" data-act="tr-new">+ Add trainer</button>';
  if(trEdit!==null){var d=trDraft||{},sum=trainerTimeSummary(d.id);h+='<div class="lifedetailback"><section class="lifedetail" role="dialog" aria-modal="true" aria-labelledby="trainerPopupTitle" data-trainerpopup="1"><div class="lifedetailh"><div><div class="liferef">Trainer profile</div><h3 id="trainerPopupTitle" style="margin:4px 0">'+esc(d.name||'New trainer')+'</h3></div><button class="mx" data-act="tr-cancel" aria-label="Close trainer profile">&#10005;</button></div><label class="btn" style="cursor:pointer;margin:10px 0">Upload photo<input type="file" id="trainerPhotoFile" accept="image/jpeg,image/png,image/webp" style="display:none"></label>'+(d.photo?'<img src="'+esc(d.photo)+'" alt="Trainer photo" style="width:100px;height:100px;object-fit:cover;border-radius:50%;display:block;margin-bottom:12px">':'')+'<div class="frow"><div class="field"><label class="flab">Full name *</label><input class="finp" id="tr_name" value="'+esc(d.name||'')+'"></div><div class="field"><label class="flab">Professional title</label><input class="finp" id="tr_title" value="'+esc(d.title||'')+'"></div></div><div class="frow"><div class="field"><label class="flab">Email *</label><input class="finp" id="tr_email" type="email" value="'+esc(d.email||'')+'"></div><div class="field"><label class="flab">Mobile</label><input class="finp" id="tr_mobile" value="'+esc(d.mobile||'')+'"></div></div><div class="field"><label class="flab">Specialties</label><input class="finp" id="tr_specialties" value="'+esc(d.specialties||'')+'" placeholder="Comma separated"></div><div class="field"><label class="flab">Biography</label><textarea class="finp" id="tr_bio">'+esc(d.bio||'')+'</textarea></div><div class="field"><label class="flab">Portfolio links</label><textarea class="finp" id="tr_portfolios" placeholder="One URL per line">'+esc((d.portfolios||[]).join('\n'))+'</textarea></div><div class="field"><label class="flab">Status</label><select class="finp" id="tr_active"><option value="yes"'+(d.active!==false?' selected':'')+'>Active</option><option value="no"'+(d.active===false?' selected':'')+'>Inactive</option></select></div><div class="okbox"><b>Total quantified time with CSDA: '+sum.total+' hours</b>'+sum.rows.map(function(r){return '<div class="gate-row"><span style="flex:1">'+esc(r.course)+' · '+esc(r.start||'—')+' → '+esc(r.end||'—')+'</span><b>'+r.hours+' hrs</b></div>';}).join('')+'</div><button class="btn pri" data-act="tr-save">Save trainer</button></section></div>';}
  return h;
}

/* ---------- where the money goes ----------
   Finance fills this in once; when it is switched on the details ride along on the
   enrollment form's Payment tab and on the printed copy. */
/* the client-facing block, used on the Payment tab and on the printed form */
function payBlock(forPrint){
  var P = DB.pay || {};
  if (!P.on) return '';
  var B = P.bank || {}, G = P.gcash || {};
  var hasBank = B.name || B.acctNo, hasG = G.number || G.qrText || G.qrImg;
  if (!hasBank && !hasG) return '';
  var qr = G.qrImg || (G.qrText ? qrSVG(G.qrText, forPrint ? 120 : 132) : '');

  if (forPrint) {
    var h = '<h3>Where to pay</h3><div class="payprint"><div class="ppcols">';
    if (hasBank) {
      h += '<div><b>Bank transfer</b><br>' + esc(B.name||'') +
        (B.branch ? ' \u00b7 ' + esc(B.branch) : '') + '<br>' +
        esc(B.acctName||'') + '<br><span class="mono">' + esc(B.acctNo||'') + '</span>' +
        (B.swift ? '<br>SWIFT ' + esc(B.swift) : '') + '</div>';
    }
    if (hasG) {
      h += '<div><b>GCash</b><br>' + esc(G.name||'') + '<br><span class="mono">' + esc(G.number||'') + '</span></div>';
    }
    h += '</div>' + (qr ? '<img class="ppqr" src="'+qr+'" alt="Payment QR">' : '') + '</div>';
    if (P.note) h += '<div class="paynote">' + esc(P.note) + '</div>';
    return h;
  }

  var o = '<div class="paybox"><div class="payh">Where to send payment</div><div class="payrow">';
  if (hasBank) {
    o += '<div class="paycol"><div class="payk">Bank transfer</div>' +
      '<div class="payv">' + esc(B.name||'') + (B.branch ? ' · ' + esc(B.branch) : '') + '</div>' +
      '<div class="payk">Account name</div><div class="payv">' + esc(B.acctName||'') + '</div>' +
      '<div class="payk">Account number</div><div class="payv mono">' + esc(B.acctNo||'') + '</div>' +
      (B.swift ? '<div class="payk">SWIFT</div><div class="payv mono">' + esc(B.swift) + '</div>' : '') +
      '</div>';
  }
  if (hasG) {
    o += '<div class="paycol"><div class="payk">GCash</div>' +
      '<div class="payv">' + esc(G.name||'') + '</div>' +
      '<div class="payk">Number</div><div class="payv mono">' + esc(G.number||'') + '</div></div>';
  }
  if (qr) o += '<img class="payqr" src="'+qr+'" alt="Payment QR code">';
  o += '</div>';
  if (P.note) o += '<div style="font-size:12px;color:var(--sec);margin-top:10px;line-height:1.55">' + esc(P.note) + '</div>';
  return o + '</div>';
}

function payDetailsPanel(){
  var P = DB.pay || {}, B = P.bank || {}, G = P.gcash || {};
  var h = '<div class="ms" style="margin-top:26px"><div class="msh">Collection details &middot; bank &amp; e-wallet</div>' +
    '<div class="note" style="margin-top:0">Entered once by Finance. Switch it on and these appear under ' +
    '<b>Payment</b> on every enrollment form and on the printed copy, so a parent knows exactly where to send ' +
    'the money.</div>';

  h += '<div class="ck'+(P.on?' on':'')+'" id="pay_on" style="max-width:380px;margin:14px 0">' +
    '<div class="cbox">&#10003;</div><div class="ckt">Show collection details to clients' +
    '<small>Off until Finance has checked every digit</small></div></div>';

  h += '<div class="msh" style="margin-top:18px">Bank transfer</div>' +
    '<div class="frow"><div class="field"><label class="flab">Bank</label>' +
      '<input class="finp" id="pay_bank" value="'+esc(B.name||'')+'" placeholder="BPI, BDO, Landbank\u2026"></div>' +
    '<div class="field"><label class="flab">Account name</label>' +
      '<input class="finp" id="pay_acctname" value="'+esc(B.acctName||'')+'"></div></div>' +
    '<div class="frow f3"><div class="field"><label class="flab">Account number</label>' +
      '<input class="finp mono" id="pay_acctno" value="'+esc(B.acctNo||'')+'"></div>' +
    '<div class="field"><label class="flab">Branch</label>' +
      '<input class="finp" id="pay_branch" value="'+esc(B.branch||'')+'"></div>' +
    '<div class="field"><label class="flab">SWIFT / BIC <small style="font-weight:500;color:var(--ter)">— optional</small></label>' +
      '<input class="finp mono" id="pay_swift" value="'+esc(B.swift||'')+'"></div></div>';

  h += '<div class="msh" style="margin-top:18px">GCash</div>' +
    '<div class="frow"><div class="field"><label class="flab">Registered name</label>' +
      '<input class="finp" id="pay_gname" value="'+esc(G.name||'')+'"></div>' +
    '<div class="field"><label class="flab">GCash number</label>' +
      '<input class="finp mono" id="pay_gnum" value="'+esc(G.number||'')+'" placeholder="09XX XXX XXXX"></div></div>';

  h += '<div class="alert" style="margin-bottom:12px"><div class="ai">&#9888;</div><div class="at">' +
    'A scannable GCash QR <b>cannot be built from a phone number</b> — a real one carries a signed EMV payload ' +
    'issued by GCash. Use <b>Show QR code</b> in your GCash app, then either paste the payload it encodes or ' +
    'upload a screenshot of the QR itself.</div></div>';

  h += '<div class="frow"><div class="field"><label class="flab">QR payload to encode ' +
      '<small style="font-weight:500;color:var(--ter)">— pasted from your GCash QR</small></label>' +
      '<textarea class="finp mono" id="pay_qrtext" style="min-height:68px;font-size:11px" ' +
      'placeholder="00020101021228\u2026">'+esc(G.qrText||'')+'</textarea></div>' +
    '<div class="field"><label class="flab">\u2026or upload the QR image</label>' +
      '<label class="btn blk" style="cursor:pointer">&#8593; Choose image' +
      '<input type="file" id="pay_qrfile" accept="image/*" style="display:none"></label>' +
      (G.qrImg ? '<button class="btn dgr blk" data-act="pay-qrclear" style="margin-top:8px">Remove image</button>' : '') +
      '</div></div>';

  var prev = G.qrImg || (G.qrText ? qrSVG(G.qrText, 150) : '');
  if (prev) {
    h += '<div class="qrprev"><img src="'+prev+'" alt="Payment QR preview">' +
      '<div><b>Preview</b><div class="sc" style="font-size:11.5px;margin-top:3px">' +
      (G.qrImg ? 'Uploaded image \u2014 shown as supplied.'
               : 'Generated from the payload above. Scan it with GCash to confirm it resolves before switching this on.') +
      '</div></div></div>';
  }

  h += '<div class="field" style="margin-top:12px"><label class="flab">Note to parents <small style="font-weight:500;color:var(--ter)">— printed under the details</small></label>' +
    '<input class="finp" id="pay_note" value="'+esc(P.note||'')+'" ' +
    'placeholder="Send the deposit slip to accounts@csda.ph with the reference number."></div>' +
    '<button class="btn pri" data-act="save-pay">Save collection details</button></div>';
  return h;
}

/* ---------- Admin › Facility ----------
   What is running right now, what ran today, and the day's CSV. */
/* every payment awaiting a decision, newest first */
function pendingPayCount(){
  var n = 0;
  (DB.records || []).forEach(function(r){
    (r.payments || []).forEach(function(p){ if ((p.status||'Pending') === 'Pending') n++; });
  });
  return n;
}
function allPayments(){
  var out = [];
  (DB.records || []).forEach(function(r, ri){
    (r.payments || []).forEach(function(p, pi){
      out.push({ rec:r, ri:ri, pi:pi, p:p });
    });
  });
  return out.sort(function(a, b){ return (a.p.d < b.p.d) ? 1 : -1; });
}

function adminGeneralGuidelines(){
  var flow='<svg viewBox="0 0 900 190" role="img" aria-label="Administrative workflow from enrollment to documents" style="width:100%;height:auto"><defs><marker id="ga" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#71809a"/></marker></defs><g font-family="Arial" text-anchor="middle"><g fill="#fff" stroke="#bdc7d6" stroke-width="2"><rect x="12" y="45" width="140" height="78" rx="14"/><rect x="190" y="45" width="140" height="78" rx="14"/><rect x="368" y="45" width="140" height="78" rx="14"/><rect x="546" y="45" width="140" height="78" rx="14"/><rect x="724" y="45" width="164" height="78" rx="14"/></g><g fill="#14213d" font-size="15" font-weight="700"><text x="82" y="77">ENROLL</text><text x="260" y="77">VERIFY</text><text x="438" y="77">MONITOR</text><text x="616" y="77">AUDIT</text><text x="806" y="77">ISSUE</text></g><g fill="#526078" font-size="11"><text x="82" y="98">Identity · course · fees</text><text x="260" y="98">Payments · receipts</text><text x="438" y="98">Schedule · status</text><text x="616" y="98">All clearance gates</text><text x="806" y="98">Review · print · save</text></g><g stroke="#71809a" stroke-width="2" marker-end="url(#ga)"><path d="M154 84H184"/><path d="M332 84H362"/><path d="M510 84H540"/><path d="M688 84H718"/></g><text x="450" y="159" fill="#8a4e00" font-size="12">Material edits after approval return the record to AUDIT.</text></g></svg>';
  var gates='<svg viewBox="0 0 900 250" role="img" aria-label="Four independent clearance gates lead to final Admin approval" style="width:100%;height:auto"><g font-family="Arial"><g fill="#eef3f8" stroke="#bdc7d6" stroke-width="2"><rect x="20" y="18" width="185" height="70" rx="13"/><rect x="245" y="18" width="185" height="70" rx="13"/><rect x="470" y="18" width="185" height="70" rx="13"/><rect x="695" y="18" width="185" height="70" rx="13"/></g><g fill="#14213d" font-size="14" font-weight="700" text-anchor="middle"><text x="112" y="48">FINANCIAL</text><text x="337" y="48">ACADEMIC</text><text x="562" y="48">TRAINER</text><text x="787" y="48">STATUS</text></g><g fill="#526078" font-size="10" text-anchor="middle"><text x="112" y="68">paid · receipts · refund</text><text x="337" y="68">portfolio · confirmation</text><text x="562" y="68">report · result · attendance</text><text x="787" y="68">Active enrollment</text></g><g stroke="#71809a" stroke-width="2"><path d="M112 88V135H450"/><path d="M337 88V135H450"/><path d="M562 88V135H450"/><path d="M787 88V135H450"/><path d="M450 135V165"/></g><rect x="325" y="165" width="250" height="62" rx="14" fill="#fff4d7" stroke="#f7a600" stroke-width="2"/><text x="450" y="192" fill="#14213d" font-size="15" font-weight="700" text-anchor="middle">FINAL ADMIN APPROVAL</text><text x="450" y="211" fill="#526078" font-size="10" text-anchor="middle">Password confirms the review; it does not replace a gate.</text></g></svg>';
  return '<div class="note" style="margin-top:0"><b>CSDA General Administrative Guidelines</b><br>The packaged PDF opens below by default inside this Admin window. It remains available offline.</div>'+
  '<object data="guides/csda-general-administrative-guidelines.pdf" type="application/pdf" aria-label="General Administrative Guidelines PDF" style="display:block;width:100%;height:min(72vh,820px);border:1px solid var(--line);border-radius:14px;background:#fff"><div class="note">This browser cannot display an embedded PDF. <a href="guides/csda-general-administrative-guidelines.pdf" download>Download the General Administrative Guidelines PDF</a>.</div></object>'+guideSearchHTML()+
  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0"><a class="btn pri" href="guides/csda-general-administrative-guidelines.pdf" download>Download PDF</a><button class="btn" data-act="launch-monitor">Open Class Monitor</button></div>'+
  '<div class="ms"><div class="msh">Workflow map</div>'+flow+'<div class="note">Move forward only when the current stage is supported by saved records. Never use notes or verbal assurances as substitutes for required evidence.</div></div>'+
  '<div class="ms"><div class="msh">1 · Access, password, and recovery key</div><ol><li>Use an approved CSDA device and browser profile.</li><li>Enter your own full name at Admin sign-in; review the person shown before making changes.</li><li>On credential setup, create a private passphrase of at least 12 characters containing a letter and number. The legacy default is prohibited.</li><li>Print or copy the one-time recovery key and store it in CSDA’s approved offline credential record, separate from backups. It is shown only once.</li><li>If the password is forgotten, use the recovery key. Recovery creates a replacement key and invalidates the old one without erasing records.</li><li>Start in Today / Work Queue, then use the sidebar groups: Daily Work, Catalogue, Operations, and Governance. Class Monitor opens as its own operational window.</li><li>Check pending payment verifications, oldest unresolved Completion Audits, and records recently changed after clearance.</li><li>Confirm that a current encrypted full-session backup exists before high-volume work or imports.</li></ol></div>'+
  '<div class="ms"><div class="msh">2 · Enrollment quality control</div><ol><li>Verify legal name, birth date, email, mobile number, address, and age-dependent contact path.</li><li>For minors, complete parent/legal guardian and guarantor details. For adults, Emergency Contact is the applicable description.</li><li>Confirm course selection, eligibility, schedule, instructional hours, trainer, base fees, and allowed discounts.</li><li>Review all six steps. Resolve validation messages before <b>Finalize and create PDF</b>.</li><li>Compare the generated enrollment PDF with the saved record before release.</li></ol></div>'+
  '<div class="ms"><div class="msh">3 · Payment verification</div><ol><li>Require date, amount, method, transaction/reference, notes, and receipt.</li><li>Match GCash/bank claims against the merchant portal. A screenshot is supporting evidence, not independent confirmation.</li><li>Reject duplicate, unreadable, altered, mismatched, or unverifiable claims and record the reason.</li><li>Approve only after reconciliation. Protect receipts as confidential financial data.</li></ol></div>'+
  '<div class="ms"><div class="msh">4 · Monitoring and changes</div><ol><li>Use Class Monitor for Scheduled, Ongoing, Almost Done, and Done. Almost Done means one or two sessions remain.</li><li>Timeline movement changes schedule state only; it never clears another gate.</li><li>Use <b>Open and edit full enrollment</b> for corrections and verify the official timestamped entry after saving.</li><li>Material changes revoke stale clearance. Recheck totals, payment balance, refund need, schedules, hours, and documents.</li></ol></div>'+
  '<div class="ms"><div class="msh">5 · Completion Audit gate model</div>'+gates+'<ol><li><b>Financial:</b> enough approved payments, receipt on every approved payment, and completed documented refund when overpaid.</li><li><b>Academic:</b> working portfolio/archive link and explicit portfolio confirmation.</li><li><b>Trainer:</b> official report, attendance resolution, and either competency result recorded. NOT YET COMPETENT is a professional assessment and does not itself block clearance.</li><li><b>Status:</b> Active. Dropped and Cancelled records remain ineligible.</li><li><b>Final Admin:</b> independently review every gate, enter the current password, then approve.</li></ol></div>'+
  '<div class="ms"><div class="msh">6 · Refund control</div><ol><li>The app calculates overpayment from approved payments minus current net total.</li><li>Issue the refund outside the app through the authorized channel.</li><li>Enter the exact refund amount and reference, upload the refund receipt, independently verify it, and press <b>Confirm refund completed</b>.</li><li>Do not confirm planned, partial, or untraceable refunds.</li></ol></div>'+
  '<div class="ms"><div class="msh">7 · Document release</div><ol><li>Resolve every item in Certification Clearance Pending; the list is record-specific.</li><li>After approval, compare both previews with the source record: learner, course, hours, trainer, Administrator, and date.</li><li>Use separate Print / Save actions for the Clearance Form and Certificate.</li><li>Release only to authorized recipients and record corrections through the enrollment/audit workflow—not by editing a saved PDF.</li></ol></div>'+
  '<div class="ms"><div class="msh">8 · Backup, restore, privacy, and exceptions</div><ol><li>Create regular password-protected CSV ZIP backups. The package contains encrypted related CSV tables, a hashed manifest, and referenced encrypted receipt, refund, artwork, and trainer media; store passwords separately.</li><li>Inspect imports before choosing Replace or Merge. Replace substitutes the local session; Merge retains local data and combines recognized records.</li><li>Use Today / Work Queue local search and filters to narrow records by learner, reference, course, trainer, date, status, payment, clearance, and refund. Search terms stay on the device.</li><li>Review reminder thresholds regularly. Reminders identify work only and never change a gate automatically.</li><li>Retention uses guarded manual archive only—no automatic deletion. Financial and TESDA-held records remain protected; every archive and restore action records the Administrator and reason.</li><li>Do not export or disclose learner, guardian, receipt, or payment data without authorization.</li><li>Never invent evidence or bypass gates. Correct the source record; escalate true policy exceptions to authorized management and preserve the decision in official notes.</li></ol></div>'+
  '<div class="okbox"><b>End-of-shift check</b><br>Save active work · review unresolved payments and audits · create a protected backup when required · close Admin access on shared devices.</div>';
}
function adminCompletionAudits(){var rows=(DB.records||[]).filter(function(r){return lifecycleOf(r).state===TIMELINE_DONE;}).sort(function(a,b){var ad=((a.sched||{}).end||(a.sched||{}).start||''),bd=((b.sched||{}).end||(b.sched||{}).start||'');return ad.localeCompare(bd);});var h='<div class="note" style="margin-top:0">Completed enrollments appear here for payment, portfolio, competency, attendance, trainer, and final Admin clearance.</div>';if(!rows.length)return h+'<div class="lifeempty">No completed enrollments awaiting audit.</div>';rows.forEach(function(r){var c=r.certification||{},done=!!c.finalized;h+='<div class="reccard"><div class="rch"><div><div class="rcref">'+esc(r.ref)+'</div><div class="rcname">'+esc((r.student||{}).name||'Unnamed student')+'</div></div><span class="lifepill '+(done?'almost':'pending')+'">'+(done?'Cleared':'Pending Audit')+'</span></div><div class="rccourses">'+esc((r.courses||[]).map(function(id){var i=itemById(id);return i?i.n:id;}).join(' · '))+'</div><button class="btn '+(done?'':'pri')+' sm" data-auditopen="'+esc(r.ref)+'">'+(done?'Open clearance':'Continue audit')+'</button></div>';});return h;}

function adminVerify(){
  var rows = allPayments();
  var pend = rows.filter(function(x){ return (x.p.status||'Pending') === 'Pending'; });

  var h = '<div class="alert" style="margin-top:0"><div class="ai">&#9888;</div><div class="at">' +
    '<b>Hard ledger rule.</b> Confirm the funds have actually cleared on the school\u2019s bank or GCash ' +
    'merchant portal <i>before</i> marking a payment Approved. A receipt screenshot is a claim, not proof.' +
    '</div></div>';

  h += '<div class="rstat"><div><span class="rsk">Awaiting review</span><span class="rsv am">'+pend.length+'</span></div>' +
    '<div><span class="rsk">Payments on file</span><span class="rsv">'+rows.length+'</span></div>' +
    '<div><span class="rsk">Approved</span><span class="rsv em">' +
      rows.filter(function(x){return x.p.status==='Approved';}).length+'</span></div>' +
    '<div><span class="rsk">Flagged / restricted</span><span class="rsv rd">' +
      rows.filter(function(x){return x.p.status==='Flagged'||x.p.status==='Suspended';}).length+'</span></div></div>';

  if (!rows.length) {
    return h + '<div style="font-size:12.5px;color:var(--ter);padding:10px 2px">No payments recorded yet.</div>';
  }

  rows.forEach(function(x){
    var p = x.p, st = PAY_STATES[p.status||'Pending'] || PAY_STATES.Pending;
    var open = verifyOpen === (x.ri + ':' + x.pi);
    h += '<div class="vrow'+(open?' open':'')+'">' +
      '<div class="vrh" data-vopen="'+x.ri+':'+x.pi+'">' +
        '<span class="vchip" style="--vc:'+st.hex+'">'+esc(st.label)+'</span>' +
        '<b>'+esc((x.rec.student&&x.rec.student.name)||'—')+'</b>' +
        '<span class="sc">'+esc(x.rec.ref)+'</span>' +
        '<span class="sc">'+esc(p.via||'')+(p.ref?' · '+esc(p.ref):'')+'</span>' +
        '<span class="vamt mono">'+money(p.amt)+'</span>' +
        '<span class="sc">'+esc(p.d?shortDate(p.d):'')+'</span>' +
      '</div>';
    if (open) {
      /* Protocol step 1 — receipt on the left, decision on the right */
      h += '<div class="vbody">' +
        '<div class="vleft">' +
          (p.receipt
            ? '<img src="'+p.receipt+'" alt="Proof of payment">'
            : '<div class="vnoimg">No receipt image attached.<br><span class="sc">Upload the ' +
              'screenshot the family sent.</span></div>') +
          '<label class="btn blk sm" style="cursor:pointer;margin-top:9px">&#8593; Attach receipt image' +
            '<input type="file" class="vfile" data-vfile="'+x.ri+':'+x.pi+'" accept="image/*" capture="environment" style="display:none">' +
          '</label>' +
          (p.receipt ? '<button class="btn dgr blk sm" data-vdelimg="'+x.ri+':'+x.pi+'" ' +
            'style="margin-top:6px">Remove image</button>' : '') +
        '</div>' +
        '<div class="vright">' +
          '<div class="kv2"><span>Transaction</span><b class="mono">'+esc(p.txn||'—')+'</b></div>' +
          '<div class="kv2"><span>Student</span><b>'+esc((x.rec.student&&x.rec.student.name)||'—')+'</b></div>' +
          '<div class="kv2"><span>Method</span><b>'+esc(p.via||'—')+'</b></div>' +
          '<div class="kv2"><span>User-submitted ref.</span><b class="mono">'+esc(p.ref||'—')+'</b></div>' +
          '<div class="kv2"><span>Amount claimed</span><b class="mono">'+money(p.amt)+'</b></div>' +
          '<div class="field" style="margin-top:11px"><label class="flab">Verified by <span class="req">*</span></label>' +
            '<input class="finp" id="v_by" value="'+esc(p.by||staffName||'')+'" placeholder="Your name"></div>' +
          '<div class="field"><label class="flab">Decision reason</label><select class="finp" id="v_reason"><option>Portal matched</option><option>Unreadable receipt</option><option>Reference mismatch</option><option>Amount mismatch</option><option>Duplicate transaction</option><option>Suspected alteration</option><option>Pending external confirmation</option><option>Data correction</option></select></div><div class="field"><label class="flab">Staff notes</label>' +
            '<textarea class="finp" id="v_notes" style="min-height:58px">'+esc(p.notes||'')+'</textarea></div>' +
          '<div class="vacts">' +
            '<button class="btn pri sm" data-vset="'+x.ri+':'+x.pi+'" data-st="Approved">&#10003; Approve</button>' +
            '<button class="btn sm" data-vset="'+x.ri+':'+x.pi+'" data-st="Flagged">&#9888; Flag</button>' +
            '<button class="btn dgr sm" data-vset="'+x.ri+':'+x.pi+'" data-st="Suspended">&#9940; Restrict</button>' +
            '<button class="btn sm" data-vset="'+x.ri+':'+x.pi+'" data-st="Pending">Reset</button>' +
          '</div>' +
          (p.by ? '<div class="vby">Last decision: '+esc(p.status)+' by '+esc(p.by)+
                  ' on '+esc(String(p.at||'').slice(0,16).replace('T',' '))+'</div>' : '') +
          '<div class="vacts" style="margin-top:10px">' +
            '<button class="btn sm" data-vmail="'+x.ri+':'+x.pi+'" data-kind="A">Draft: confirmed</button>' +
            '<button class="btn sm" data-vmail="'+x.ri+':'+x.pi+'" data-kind="B">Draft: action required</button>' +
            '<button class="btn sm" data-vmail="'+x.ri+':'+x.pi+'" data-kind="C">Draft: security hold</button>' +
          '</div>' +
        '</div></div>';
    }
    h += '</div>';
  });
  return h;
}

function adminFacility(){
  var live = activeSessions();
  var d = facDate || today();
  var day = sessionsOn(d);
  var closed = day.filter(function(x){ return x.status === 'closed'; });
  var takings = day.reduce(function(a,x){ return a + (x.status==='closed' ? x.net : netOf(x)); }, 0);

  var h = '<div class="note" style="margin-top:0">Live floor status, the day\u2019s log, and the ' +
    'workstations on deployment. Sessions keep running even with this window closed \u2014 the alarm ' +
    'still sounds.</div>';

  h += '<div class="rstat"><div><span class="rsk">In use now</span><span class="rsv em">'+live.length+'</span></div>' +
    '<div><span class="rsk">Units deployed</span><span class="rsv">'+(DB.units||[]).length+'</span></div>' +
    '<div><span class="rsk">Sessions on '+esc(shortDate(d))+'</span><span class="rsv">'+day.length+'</span></div>' +
    '<div><span class="rsk">Takings</span><span class="rsv">'+money(takings)+'</span></div></div>';

  h += '<div class="ms"><div class="msh">Active usage &middot; ' + live.length + '</div>';
  if (!live.length) {
    h += '<div style="font-size:12.5px;color:var(--ter);padding:2px 2px 10px">Every workstation is free.</div>';
  } else {
    h += '<table class="dt duetbl"><thead><tr><th>Unit</th><th>User</th><th>Office / school</th>' +
      '<th>In</th><th class="r">Used</th><th class="r">Running</th><th>Time left</th></tr></thead><tbody>';
    live.forEach(function(x){
      var leftS = (x.endsMs - Date.now())/1000;
      h += '<tr><td><b>'+esc(x.unit)+'</b></td><td>'+esc(x.name||'—')+'</td><td>'+esc(x.org||'—')+'</td>' +
        '<td>'+esc(pretty12(x.inT))+'</td><td class="r">'+minsUsed(x)+' min</td>' +
        '<td class="r mono amtdue">'+money(netOf(x))+'</td>' +
        '<td><span class="pchip '+(leftS<=0?'over':(leftS<=300?'part':'ok'))+'" data-clock="'+esc(x.ref)+'">' +
          clockOf(leftS)+'</span></td></tr>';
    });
    h += '</tbody></table>';
  }
  h += '</div>';

  h += '<div class="ms"><div class="msh">Day log</div>' +
    '<div class="frow"><div class="field"><label class="flab">Date</label>' +
      '<input class="finp" id="fac_date" type="date" value="'+esc(d)+'"></div>' +
    '<div class="field"><label class="flab">&nbsp;</label>' +
      '<button class="btn pri blk" data-act="fac-csv">&#8595; Download ' +
        esc(rentalCSVName()) + '.csv</button>' +
      '<div style="font-size:11px;color:var(--ter);margin-top:6px;line-height:1.5">' +
        'Every day ever recorded, each in its own block with a subtotal \u2014 nothing is dropped.' +
      '</div></div></div>';
  if (!closed.length) {
    h += '<div style="font-size:12.5px;color:var(--ter);padding:2px 2px 10px">Nothing billed on this date.</div>';
  } else {
    h += '<table class="dt duetbl"><thead><tr><th>Ref</th><th>Unit</th><th>User</th><th>In</th><th>Out</th>' +
      '<th class="r">Used</th><th class="r">Net</th></tr></thead><tbody>';
    closed.slice().reverse().forEach(function(x){
      h += '<tr><td class="mono sc">'+esc(x.ref)+'</td><td><b>'+esc(x.unit)+'</b></td><td>'+esc(x.name||'—')+'</td>' +
        '<td>'+esc(pretty12(x.inT))+'</td><td>'+esc(pretty12(x.outT))+'</td>' +
        '<td class="r">'+x.mins+' min</td><td class="r mono amtdue">'+money(x.net)+'</td></tr>';
    });
    h += '<tr class="dedtot"><td><b>Total</b></td><td></td><td></td><td></td><td></td>' +
      '<td class="r"><b>'+closed.reduce(function(a,x){return a+x.mins;},0)+' min</b></td>' +
      '<td class="r mono grand"><b>'+money(closed.reduce(function(a,x){return a+x.net;},0))+'</b></td></tr>' +
      '</tbody></table>';
  }
  h += '</div>';

  h += '<div class="ms"><div class="msh">Workstations deployed &middot; ' + (DB.units||[]).length + '</div>' +
    '<div class="skiplist" style="padding:0 0 12px">' +
    (DB.units||[]).map(function(u, ix){
      var busy = !!sessionOnUnit(u.id);
      return '<span class="skipchip" style="' + (busy ? 'background:var(--emb);border-color:var(--emr);color:var(--em2)' : '') + '">' +
        '<b>'+esc(u.name)+'</b>' + (busy ? ' <em>in use</em>' : '') +
        (busy ? '' : '<button data-unitdel="'+ix+'" title="Remove" aria-label="Remove '+esc(u.name)+'">&#10005;</button>') +
        '</span>';
    }).join('') + '</div>' +
    '<div class="frow"><div class="field"><label class="flab">Add a workstation</label>' +
      '<input class="finp" id="fac_unit" placeholder="PC-05"></div>' +
    '<div class="field"><label class="flab">&nbsp;</label>' +
      '<button class="btn pri blk" data-act="fac-addunit">&#43; Deploy unit</button></div></div></div>';
  return h;
}

function adminHolidays(){
  var yr = new Date().getFullYear();
  var auto = phHolidays(yr), autoNext = phHolidays(yr + 1);
  var man = (DB.holidays || []).slice().sort(function(a,b){ return a.d < b.d ? -1 : 1; });

  var h = '<div class="note" style="margin-top:0">Class dates skip these automatically. The national ' +
    'holidays below are worked out for every year, including the movable Holy Week dates and National ' +
    'Heroes Day. <b>Islamic holidays and presidential proclamations cannot be calculated</b> — add those ' +
    'here, along with storm days, suspensions and any other closure.</div>';

  h += '<div class="ck'+(DB.cfg.skipHolidays!==false?' on':'')+'" id="cfg_skiphol" style="max-width:360px;margin:14px 0">' +
    '<div class="cbox">&#10003;</div><div class="ckt">Skip national holidays automatically' +
    '<small>Untick to schedule straight through them</small></div></div>';

  h += '<div class="ms"><div class="msh">Closures &amp; emergencies &middot; ' + man.length + '</div>';
  if (!man.length) {
    h += '<div style="font-size:12.5px;color:var(--ter);padding:4px 2px 12px">Nothing recorded yet.</div>';
  } else {
    h += '<div class="skiplist" style="padding:0 0 12px">';
    man.forEach(function(x, ix){
      h += '<span class="skipchip"><b>'+esc(prettyDate(x.d))+'</b> <em>'+esc(x.n||'Closure')+'</em>' +
        '<button data-holdel="'+ix+'" title="Remove" aria-label="Remove '+esc(x.n||'closure')+'">&#10005;</button></span>';
    });
    h += '</div>';
  }
  h += '<div class="frow"><div class="field"><label class="flab">Date <span class="req">*</span></label>' +
      '<input class="finp" id="hol_d" type="date"></div>' +
    '<div class="field"><label class="flab">Reason <span class="req">*</span></label>' +
      '<input class="finp" id="hol_n" placeholder="Typhoon suspension, in-service day\u2026"></div>' +
    '<div class="field"><label class="flab">&nbsp;</label>' +
      '<button class="btn pri blk" data-act="hol-add">&#43; Add closure</button></div></div></div>';

  var rows = function(map, label){
    var keys = Object.keys(map).sort();
    return '<div class="ms"><div class="msh">' + label + ' &middot; ' + keys.length + ' dates</div>' +
      '<div class="skiplist" style="padding:0">' + keys.map(function(k){
        return '<span class="skipchip" style="background:var(--emb);border-color:var(--emr);color:var(--em2)">' +
          '<b>'+esc(shortDate(k))+'</b> <em>'+esc(map[k])+'</em></span>';
      }).join('') + '</div></div>';
  };
  h += rows(auto, 'National holidays ' + yr);
  h += rows(autoNext, 'National holidays ' + (yr + 1));
  return h;
}

function adminPlans(){
  var h = '<div style="font-size:12.5px;color:var(--sec);margin-bottom:14px">Stages use ' +
    '<b>Label:percent:when</b>, comma separated, totalling 100%. The first plan is treated as the full-payment plan.<br>' +
    '<b>when</b> sets the due date against the student\'s real class schedule — ' +
    '<code>enrol</code> (enrollment date), <code>session3</code> (3rd class, any number works), ' +
    '<code>secondlast</code>, <code>last</code>. Omit it and the stage falls due on the enrollment date.</div>';
  DB.plans.forEach(function(pl){
    var st = (pl.stages||[]).map(function(s){ return s.l + ':' + s.p + (s.w ? ':' + s.w : ''); }).join(', ');
    var tot = (pl.stages||[]).reduce(function(s,x){ return s + (+x.p||0); }, 0);
    h += '<div class="modblk">' +
      '<div class="field"><label class="flab">Plan name</label>' +
        '<input class="finp" data-lf="name" data-lid="'+pl.id+'" value="'+esc(pl.name)+'"></div>' +
      '<div class="field"><label class="flab">Stages <span style="color:'+(Math.abs(tot-100)<.01?'var(--em2)':'var(--rd)')+'">· totals '+tot+'%</span></label>' +
        '<input class="finp" data-lf="stages" data-lid="'+pl.id+'" value="'+esc(st)+'"></div>' +
      '<div class="field" style="margin-bottom:9px"><label class="flab">Note</label>' +
        '<input class="finp" data-lf="note" data-lid="'+pl.id+'" value="'+esc(pl.note||'')+'"></div>' +
      '<button class="btn dgr sm" data-delplan="'+pl.id+'">Delete plan</button></div>';
  });
  h += '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
    '<button class="btn pri" data-act="save-plans">Save plans</button>' +
    payDetailsPanel() +
    '<button class="btn" data-act="new-plan">&#43; New plan</button></div>';
  return h;
}

/* One row per payment stage — a collections ledger the office can sort by due date. */
function recordsCSV(){
  var cols = ['ref','enrolled_on','student','highest_educational_attainment','dob','provider','mode',
    'emergency_contact','relationship','mobile','mobile_confirmed','email','address',
    'courses','sessions','first_session','last_session','hours_per_session',
    'gross','discount','discount_label','net','plan',
    'stage','stage_share_pct','due_date','amount_due','if_late','notes'];
  var rows = [cols.join(',')];
  (DB.records || []).forEach(function(rc){
    var d = (rc.sched && rc.sched.dates) || [];
    var names = (rc.courses || []).map(function(id){ var i = itemById(id); return i ? i.n : id; }).join(' | ');
    var t = rc.totals || {};
    var late = +DB.cfg.late || 0;
    var base = [rc.ref, rc.date,
      (rc.student||{}).name, (rc.student||{}).educ, (rc.student||{}).dob,
      (rc.student||{}).provider, (rc.student||{}).mode,
      (rc.guardian||{}).name, (rc.guardian||{}).rel, (rc.guardian||{}).mobile,
      (rc.guardian||{}).verified ? 'yes' : 'no',
      (rc.guardian||{}).email, (rc.guardian||{}).address,
      names, d.length, d[0] || '', d[d.length-1] || '', (rc.sched||{}).dur,
      t.sub == null ? '' : t.sub, t.disc == null ? '' : t.disc, t.promo || '',
      t.net == null ? '' : t.net, t.planName || ''];
    var sch = rc.schedule || [];
    if (!sch.length) { rows.push(base.concat(['','','','','', rc.notes||'']).map(csvCell).join(',')); return; }
    sch.forEach(function(s){
      rows.push(base.concat([s.l, s.p, s.due || '', s.amt == null ? '' : s.amt,
        s.amt == null ? '' : (s.amt * (1 + late/100)), rc.notes || '']).map(csvCell).join(','));
    });
  });
  return rows.join('\r\n');
}

/* case-insensitive match across the fields a registrar would search by */
function recMatches(rc, q){
  if (!q) return true;
  var hay = [rc.ref, rc.student && rc.student.name, rc.student && rc.student.educ,
             rc.guardian && rc.guardian.name, rc.guardian && rc.guardian.mobile,
             rc.guardian && rc.guardian.email, rc.trainer && rc.trainer.name,
             (rc.courses || []).map(function(id){ var i = itemById(id); return i ? i.n : id; }).join(' ')]
            .join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).every(function(w){ return !w || hay.indexOf(w) > -1; });
}

function adminRecs(){
  var all = DB.records || [];
  var recs = all.filter(function(rc){ return recMatches(rc, recQuery); });
  var h = '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap">' +
    '<div style="font-size:12.5px;color:var(--sec)"><b>'+recs.length+'</b>' +
    (recQuery ? ' of ' + all.length : '') + ' saved enrollment' +
    ((recQuery ? recs.length : all.length)===1?'':'s')+'</div>' +
    (recs.length ? '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="btn sm" data-act="recs-csv">&#8595; Download all (CSV)</button>' +
        '<button class="btn dgr sm" data-act="clear-recs">Delete all</button></div>' : '') + '</div>';

  if (retentionBlocked) {
    h += '<div class="alert" style="margin-bottom:14px"><div class="ai">&#128737;</div><div class="at">' +
      '<b>Retention hold \u2014 ' + esc(retentionBlocked.ref) + '.</b> ' +
      esc(retentionNote(retentionBlocked.kind)) +
      ' Under TESDA training regulations this overrides a Data Privacy Act erasure request. ' +
      'Raise a written request with the registrar if removal is genuinely warranted.' +
      ' <button class="btn sm" data-act="ret-ack" style="margin-top:8px">Understood</button></div></div>';
  }
  h += delChallenge();
  if (all.length) {
    h += '<div class="recsearch"><span class="rsico">&#128269;</span>' +
      '<input class="finp" id="recq" type="search" placeholder="Search by student, emergency contact, reference or course…" ' +
      'value="'+esc(recQuery)+'" autocomplete="off">' +
      (recQuery ? '<button class="btn sm" data-act="recq-clear">Clear</button>' : '') + '</div>';
  }
  h += '<div class="note" style="margin-top:0">Records are filed here when a rep presses <b>Save record in app</b> ' +
    'on a generated enrollment form. They live in <b>this browser on this machine</b> — take copies out with ' +
    '<b>CSV &amp; Backup</b> (spreadsheet or PDF). <b>Open</b> shows the printable client copy, <b>Edit</b> reopens ' +
    'the form so details can be corrected and re-saved against the same reference.</div>';
  if (!recs.length) {
    h += '<div style="font-size:12.5px;color:var(--ter);padding:20px 2px">' +
      (recQuery ? 'No enrollment matches &ldquo;' + esc(recQuery) + '&rdquo;.' : 'No enrollments saved yet.') +
      '</div>';
    return h;
  }
  recs.forEach(function(rc){
    var ix = all.indexOf(rc);        // actions address the real record, not the filtered position
    var names = (rc.courses || []).map(function(id){ var i = itemById(id); return i ? i.n : id; });
    var d = (rc.sched && rc.sched.dates) || [];
    h += '<div class="reccard">' +
      '<div class="rch"><div><div class="rcref">'+esc(rc.ref)+'</div>' +
        '<div class="rcname">'+esc(rc.student && rc.student.name ? rc.student.name : 'Unnamed student')+
        (rc.student && rc.student.educ ? ' &middot; '+esc(rc.student.educ) : '')+'</div></div>' +
      '<div class="rcamt mono">'+money(rc.totals ? rc.totals.net : 0)+'</div></div>' +
      '<div class="rcmeta">' +
        '<span>Enrolled '+esc(prettyDate(rc.date))+'</span>' +
        '<span>'+names.length+' course'+(names.length===1?'':'s')+'</span>' +
        '<span>'+esc(rc.totals ? rc.totals.planName : '')+'</span>' +
        (d.length ? '<span>'+d.length+' sessions &middot; '+esc(prettyDate(d[0]))+' &rarr; '+esc(prettyDate(d[d.length-1]))+'</span>' : '') +
        (rc.guardian && rc.guardian.verified ? '<span class="em">&#10003; phone confirmed</span>' : '<span class="am">phone unconfirmed</span>') +
      '</div>' +
      '<div class="rccourses">'+esc(names.join(' · '))+'</div>' +
      '<div class="rcbtns">' +
        '<button class="btn sm" data-recopen="'+ix+'">Open</button>' +
        '<button class="btn sm" data-recedit="'+ix+'">Edit</button>' +
        '<button class="btn sm" data-recprint="'+ix+'">Print</button>' +
        (retentionHeld(rc)
          ? '<button class="btn sm" data-recdel="'+ix+'" title="Retention hold">&#128274; Retained</button>'
          : '<button class="btn dgr sm" data-recdel="'+ix+'">Delete</button>') +
      '</div></div>';
  });
  return h;
}

/* Deleting an enrollment is irreversible and these are student records, so the
   administrator password is required again at the moment of deletion. A browser
   prompt() is blocked in sandboxed frames, so the challenge is inline. */
var pendingDel = null;     // index of the record awaiting confirmation, or 'all'
var retentionBlocked = null;
function askDeletePassword(which){
  if (which !== 'all') {
    var rc0 = (DB.records || [])[which];
    var held0 = retentionHeld(rc0);
    if (held0) {
      pendingDel = null; renderAdmin();
      toast('Retention hold \u2014 this record cannot be deleted', true);
      retentionBlocked = { ref: rc0.ref, kind: held0 };
      renderAdmin();
      return;
    }
  } else {
    var anyHeld = (DB.records || []).filter(function(r){ return retentionHeld(r); });
    if (anyHeld.length) {
      pendingDel = null;
      retentionBlocked = { ref: anyHeld.length + ' record' + (anyHeld.length===1?'':'s'), kind:'financial', bulk:true };
      renderAdmin();
      toast('Retention hold \u2014 ' + anyHeld.length + ' record' + (anyHeld.length===1?'':'s') +
            ' cannot be deleted', true);
      return;
    }
  }
  pendingDel = which;
  renderAdmin();
  var f = document.getElementById('delpw');
  if (f) f.focus();
}
function delChallenge(){
  if (pendingDel === null) return '';
  var what, n = (DB.records || []).length;
  if (pendingDel === 'all') {
    what = '<b>all ' + n + ' enrollment' + (n===1?'':'s') + '</b>';
  } else {
    var rc = (DB.records || [])[pendingDel] || {};
    what = '<b>' + esc((rc.student && rc.student.name) || 'this record') + '</b> &middot; ' + esc(rc.ref || '');
  }
  return '<div class="askbox delbox"><div class="askt">Confirm deletion of ' + what + '</div>' +
    '<div class="asks">This cannot be undone. Enter the administrator password to continue.</div>' +
    '<div class="askb" style="margin-top:11px">' +
      '<input class="finp" id="delpw" type="password" placeholder="Administrator password" ' +
        'autocomplete="off" style="flex:1;min-width:190px">' +
      '<button class="btn dgr" data-act="del-confirm">Delete permanently</button>' +
      '<button class="btn" data-act="del-cancel">Cancel</button>' +
    '</div></div>';
}
async function runDelete(){
  var f = document.getElementById('delpw');
  var given = f ? f.value : '';
  if (!(await verifyAdministratorPassword(given))) {
    if (f) { f.classList.add('bad'); f.value = ''; f.focus(); }
    toast('Wrong password — nothing was deleted', true);
    return;
  }
  if (pendingDel === 'all') {
    var n = (DB.records || []).length;
    DB.records = []; pendingDel = null; save(); renderAdmin();
    toast(n + ' enrollment' + (n===1?'':'s') + ' deleted');
  } else {
    var dref = ((DB.records || [])[pendingDel] || {}).ref || '';
    DB.records.splice(pendingDel, 1); pendingDel = null; save(); renderAdmin();
    toast('Record deleted' + (dref ? ' — ' + dref : ''));
  }
}

/* A trainer typed straight into the form can be promoted into the pool so the next
   enrollment can just pick them. Matches on email so it is never added twice. */
function adoptTypedTrainer(){
  if (!E.trainerCustom || !E.trainerSave) return;
  var nm = (E.trainer.name || '').trim(), em = (E.trainer.email || '').trim();
  if (!nm || em.indexOf('@') < 1) return;
  if (!DB.trainers) DB.trainers = [];
  var found = DB.trainers.filter(function(t){
    return (t.email || '').toLowerCase() === em.toLowerCase();
  })[0];
  if (found) {
    E.trainer = { id:found.id, name:found.name, email:found.email };
  } else {
    var rec = { id:'t'+Date.now().toString(36), name:nm, email:em, mobile:'' };
    DB.trainers.push(rec);
    E.trainer = { id:rec.id, name:rec.name, email:rec.email };
    toast('Trainer added to the pool — ' + nm);
  }
  E.trainerCustom = false;
  E.trainerSave = false;
  save();
}

/* ==========================================================================
   DIGITAL ENTERTAINMENT EXCHANGE — facility rental
   A workstation booking, not an enrollment: no promos, no discounts, no payment
   plan. Time is billed by the hour but pro-rated to the minute, so 1h20m costs
   four-thirds of the hourly rate rather than two hours.
   ========================================================================== */
var RENT_KIT = [
  ['laptop','Laptop'], ['tablet','Wacom tablet'], ['lcable','Laptop cable'],
  ['wcable','Wacom cable'], ['mouse','Mouse'], ['pen','Wacom pen'], ['bag','Bag']
];
var rentTick = null;          // one interval drives every live unit
var rentForm = null;          // { unitId, hrs, name, org, purpose, kit, note } while starting
var rentOpen = null;          // ref of the unit whose detail card is expanded
var rentEdit = null;          // id of the session being edited

function facilityItem(){
  return (DB.items || []).filter(function(i){ return i.facility; })[0] || null;
}
function facilityRate(){ var f = facilityItem(); return f ? (+f.price || 80) : 80; }
function nowHHMM(){
  var d = new Date();
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
function msToHHMM(ms){
  if (!ms) return '';
  var d = new Date(ms);
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
function fmtDuration(mins){
  mins = Math.max(0, Math.round(mins));
  var h = Math.floor(mins/60), m = mins % 60;
  if (!mins) return '0 min';
  return (h ? h + ' hr' + (h===1?'':'s') : '') + (h && m ? ' ' : '') + (m ? m + ' min' : '');
}
function clockOf(secs){
  secs = Math.max(0, Math.round(secs));
  var h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60), x = secs%60;
  return (h ? h + ':' : '') + String(m).padStart(2,'0') + ':' + String(x).padStart(2,'0');
}
function nextRentRef(){
  var d = new Date();
  return 'SSF-' + d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') +
         String(d.getDate()).padStart(2,'0') + '-' + String(DB.cfg.rseq || 1).padStart(4,'0');
}
/* a session is billed on the minutes actually used, pro-rated against the hourly rate */
function minsUsed(se){
  var endMs = se.closedMs || Date.now();
  return Math.max(0, Math.round((endMs - se.startMs) / 60000));
}
function netOf(se){
  return Math.round((+se.rate || facilityRate()) * minsUsed(se) / 60 * 100) / 100;
}
function activeSessions(){
  return (DB.rentals || []).filter(function(x){ return x.status === 'active'; });
}
function sessionOnUnit(unitId){
  return activeSessions().filter(function(x){ return x.unitId === unitId; })[0] || null;
}
function sessionsOn(dateISO){
  return (DB.rentals || []).filter(function(x){ return x.date === dateISO; });
}

/* ---------- the floor console ---------- */
function renderRent(){
  var b = document.getElementById('rBody');
  if (!b) return;
  var f = facilityItem(), rate = facilityRate();
  var live = activeSessions();

  var h = '<div class="note" style="margin-top:0">' + esc((f && f.desc) || '') + '</div>';

  h += '<div class="rstat"><div><span class="rsk">Units deployed</span>' +
       '<span class="rsv">' + (DB.units||[]).length + '</span></div>' +
       '<div><span class="rsk">In use now</span><span class="rsv em">' + live.length + '</span></div>' +
       '<div><span class="rsk">Rate</span><span class="rsv">' + money(rate) + '<small>/hour</small></span></div>' +
       '<div><span class="rsk">Today\u2019s takings</span><span class="rsv">' +
         money(sessionsOn(today()).reduce(function(a,x){ return a + (x.status==='closed' ? x.net : netOf(x)); },0)) +
       '</span></div></div>';

  /* ---- the units + contextual session panel ---- */
  /* On wide screens the selected floor view eases left while the session form enters
     at the right. Narrow screens retain a calm stacked flow. */
  h += '<div class="rentstage'+(rentForm?' choosing':'')+'">';
  h += '<div class="ms rentunits"><div class="msh">Workstations &middot; tap a free unit to begin</div><div class="unitgrid">';
  (DB.units || []).forEach(function(u){
    var se = sessionOnUnit(u.id);
    var nn2 = String(u.name).replace(/^\D+/, '') || u.name;
    if (!se) {
      h += '<button class="ubox free" data-ract="start" data-unit="'+esc(u.id)+'" ' +
        'title="'+esc(u.name)+' — available"><span class="ubn">'+esc(nn2)+'</span>' +
        '<span class="ubs">Free</span></button>';
    } else {
      var leftS = (se.endsMs - Date.now()) / 1000;
      h += '<button class="ubox busy'+(leftS<=0?' over':(leftS<=300?' warn':''))+'" ' +
        'data-ract="open" data-sess="'+esc(se.ref)+'" data-unit="'+esc(u.id)+'" ' +
        'title="'+esc(u.name)+' — '+esc(se.name||'in use')+'">' +
        '<span class="ubn">'+esc(nn2)+'</span>' +
        '<span class="ubs mono" data-clock="'+esc(se.ref)+'">'+clockOf(leftS)+'</span></button>';
    }
  });
  if (!(DB.units||[]).length) {
    h += '<div style="font-size:12.5px;color:var(--ter)">No workstations deployed yet — add them under ' +
      '<b>Admin &rsaquo; Facility</b>.</div>';
  }
  h += '</div></div>';

  /* the unit the attendant has open */
  if (rentOpen) {
    var se3 = (DB.rentals||[]).filter(function(x){ return x.ref === rentOpen && x.status === 'active'; })[0];
    if (se3) {
      var lS = (se3.endsMs - Date.now()) / 1000;
      h += '<div class="ms"><div class="unitcard'+(lS<=0?' over':(lS<=300?' warn':''))+'">' +
        '<div class="uch"><div><div class="un">'+esc(se3.unit)+'<span class="uref">'+esc(se3.ref)+'</span></div>' +
        '<div class="uwho">'+esc(se3.name||'—')+(se3.org?' <span class="sc">\u00b7 '+esc(se3.org)+'</span>':'')+'</div></div>' +
        '<div class="uclock" data-clock="'+esc(se3.ref)+'">'+clockOf(lS)+'</div></div>' +
        '<div class="us">In '+esc(pretty12(se3.inT))+' \u00b7 booked '+fmtDuration(se3.booked||0)+
          ' \u00b7 '+fmtDuration(minsUsed(se3))+' used \u00b7 <b>'+money(netOf(se3))+'</b></div>' +
        (se3.purpose ? '<div class="us">Purpose: '+esc(se3.purpose)+'</div>' : '') +
        (se3.kit ? '<div class="kitline">Kit out: ' + (RENT_KIT.filter(function(k){ return se3.kit[k[0]]; })
            .map(function(k){ return esc(k[1]); }).join(', ') || 'none ticked') + '</div>' : '') +
        (se3.note ? '<div class="kitline">Note: '+esc(se3.note)+'</div>' : '') +
        '<div class="uadd">' +
          '<button class="btn sm" data-ract="add" data-sess="'+esc(se3.ref)+'" data-min="30">+30 min</button>' +
          '<button class="btn sm" data-ract="add" data-sess="'+esc(se3.ref)+'" data-min="60">+1 hr</button>' +
          '<button class="btn sm" data-ract="add" data-sess="'+esc(se3.ref)+'" data-min="120">+2 hrs</button>' +
          '<button class="btn sm" data-ract="edit" data-sess="'+esc(se3.ref)+'">Edit</button>' +
          '<button class="btn sm" data-ract="collapse">Close view</button>' +
        '</div>' +
        '<button class="btn pri blk" data-ract="close" data-sess="'+esc(se3.ref)+'" ' +
          'style="margin-top:10px">End session &amp; bill</button></div></div>';
    }
  }

  /* ---- start / edit panel ---- */
  if (rentForm) {
    var un = (DB.units||[]).filter(function(u){ return u.id === rentForm.unitId; })[0] || {};
    h += '<div class="ms rentformpanel"><div class="askbox"><div class="askq">Start a session on <b>'+esc(un.name||'')+'</b></div>' +
      '<div class="frow"><div class="field"><label class="flab">User\u2019s name <span class="req">*</span></label>' +
        '<input class="finp" id="rf_name" value="'+esc(rentForm.name||'')+'"></div>' +
      '<div class="field"><label class="flab">Office / school</label>' +
        '<input class="finp" id="rf_org" value="'+esc(rentForm.org||'')+'"></div></div>' +
      '<div class="frow"><div class="field"><label class="flab">Purpose</label>' +
        '<input class="finp" id="rf_purpose" value="'+esc(rentForm.purpose||'')+'" ' +
        'placeholder="Encoding, design work, research\u2026"></div>' +
      '<div class="field"><label class="flab">Booked time (hours) <span class="req">*</span></label>' +
        '<select class="finp" id="rf_hrs">' +
        [0.5,1,1.5,2,2.5,3,4,5,6,8].map(function(x){
          return '<option value="'+x+'"'+((rentForm.hrs||1)===x?' selected':'')+'>' +
            (x === 0.5 ? '30 minutes' : x + ' hour' + (x===1?'':'s')) + '</option>';
        }).join('') + '</select></div></div>' +

      '<div class="flab" style="margin-top:4px">Equipment released \u2014 tick what goes out with the unit</div>' +
      '<div class="kitgrid">' + RENT_KIT.map(function(k){
        var on = rentForm.kit && rentForm.kit[k[0]];
        return '<div class="ck kitck'+(on?' on':'')+'" data-kit="'+k[0]+'"><div class="cbox">&#10003;</div>' +
          '<div class="ckt">'+esc(k[1])+'</div></div>';
      }).join('') + '</div>' +
      '<div class="field" style="margin-top:11px"><label class="flab">Notes</label>' +
        '<input class="finp" id="rf_note" value="'+esc(rentForm.note||'')+'" ' +
        'placeholder="Scratch on lid, charger borrowed from Unit 04\u2026"></div>' +

      '<div class="askb"><button class="btn pri" data-ract="start-go">Proceed to Rent &rsaquo;</button>' +
      '<button class="btn" data-ract="start-cancel">Cancel</button></div></div></div>';
  }
  if (!rentForm && !rentOpen) {
    h += '<div class="ms rentformpanel"><div class="askbox" style="min-height:250px;display:grid;place-items:center;text-align:center">' +
      '<div><div class="askq">Start a session</div><div class="sc" style="line-height:1.6">Select a free workstation on the left.<br>The session form will open here.</div></div></div></div>';
  }
  h += '</div>'; /* rentstage */
  if (rentEdit) {
    var se2 = (DB.rentals||[]).filter(function(x){ return x.ref === rentEdit; })[0];
    if (se2) {
      h += '<div class="ms"><div class="askbox"><div class="askq">Edit <b>'+esc(se2.unit)+'</b> &middot; '+esc(se2.ref)+'</div>' +
        '<div class="frow"><div class="field"><label class="flab">User\u2019s name</label>' +
          '<input class="finp" id="re_name" value="'+esc(se2.name||'')+'"></div>' +
        '<div class="field"><label class="flab">Office / school</label>' +
          '<input class="finp" id="re_org" value="'+esc(se2.org||'')+'"></div></div>' +
        '<div class="frow"><div class="field"><label class="flab">Purpose</label>' +
          '<input class="finp" id="re_purpose" value="'+esc(se2.purpose||'')+'"></div>' +
        '<div class="field"><label class="flab">Add / remove minutes</label>' +
          '<input class="finp mono" id="re_adj" type="number" step="5" value="0" placeholder="e.g. 30 or -15"></div></div>' +
        '<div class="askb"><button class="btn pri" data-ract="edit-save">Save changes</button>' +
        '<button class="btn" data-ract="edit-cancel">Cancel</button></div></div></div>';
    }
  }

  /* ---- the day's log ---- */
  var done = sessionsOn(today()).filter(function(x){ return x.status === 'closed'; });
  h += '<div class="ms"><div class="msh">Today\u2019s sessions &middot; ' + done.length + '</div>';
  if (!done.length) {
    h += '<div style="font-size:12.5px;color:var(--ter);padding:2px 2px 10px">Nothing billed yet today.</div>';
  } else {
    h += '<table class="dt duetbl"><thead><tr><th>Ref</th><th>Unit</th><th>User</th>' +
      '<th>In</th><th>Out</th><th class="r">Used</th><th class="r">Net</th><th></th></tr></thead><tbody>';
    done.forEach(function(x){
      h += '<tr><td class="mono sc">'+esc(x.ref)+'</td><td><b>'+esc(x.unit)+'</b></td>' +
        '<td>'+esc(x.name||'—')+'</td><td>'+esc(pretty12(x.inT))+'</td><td>'+esc(pretty12(x.outT))+'</td>' +
        '<td class="r">'+x.mins+' min</td><td class="r mono amtdue">'+money(x.net)+'</td>' +
        '<td class="r"><button class="btn sm" data-ract="slip" data-sess="'+esc(x.ref)+'">Slip</button></td></tr>';
    });
    h += '<tr class="dedtot"><td><b>Total</b></td><td></td><td></td><td></td><td></td>' +
      '<td class="r"><b>'+done.reduce(function(a,x){return a+x.mins;},0)+' min</b></td>' +
      '<td class="r mono grand"><b>'+money(done.reduce(function(a,x){return a+x.net;},0))+'</b></td><td></td></tr>';
    h += '</tbody></table>';
    h += '<button class="btn" data-ract="csv" style="margin-top:11px">&#8595; Download the rental ledger (all days)</button>';
  }
  h += '</div>';

  keepScroll(b, function(){ b.innerHTML = h; });
  ensureRentTick();
}

/* one interval keeps every live unit honest */
function ensureRentTick(){
  if (rentTick) return;
  rentTick = setInterval(function(){
    var live = activeSessions();
    if (!live.length) { clearInterval(rentTick); rentTick = null; return; }
    var open = document.getElementById('rent').classList.contains('on');
    /* the same sessions are mirrored in Admin › Facility, so that view ticks too */
    var inAdmin = document.getElementById('admin').classList.contains('on') && aTab === 'fac';
    live.forEach(function(se){
      var leftS = (se.endsMs - Date.now()) / 1000;
      if (open) {
        var el = document.querySelector('#rBody [data-clock="'+se.ref+'"]');
        if (el) el.textContent = clockOf(leftS);
        var card = document.querySelector('#rBody .unit[data-sess="'+se.ref+'"]');
        if (card) {
          card.classList.toggle('warn', leftS > 0 && leftS <= 300);
          card.classList.toggle('over', leftS <= 0);
        }
      }
      if (inAdmin) {
        var ac = document.querySelector('#aBody [data-clock="'+se.ref+'"]');
        if (ac) {
          ac.textContent = clockOf(leftS);
          ac.className = 'pchip ' + (leftS <= 0 ? 'over' : (leftS <= 300 ? 'part' : 'ok'));
        }
      }
      if (leftS <= 0 && !se.alarmed) {
        se.alarmed = true;
        save();
        soundAlarm();
        toast('Time is up on ' + se.unit + ' \u2014 ' + (se.name || 'user'), true);
      }
    });
  }, 1000);
}
/* a short triple beep, synthesised so the file stays self-contained */
function soundAlarm(){
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    var ctx = new AC();
    [0, 0.45, 0.9].forEach(function(off){
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + off);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + off + 0.32);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + off); o.stop(ctx.currentTime + off + 0.34);
    });
    setTimeout(function(){ try { ctx.close(); } catch(e){} }, 2000);
  } catch(e){ /* audio blocked — the visual alarm and toast still fire */ }
}

function startSession(){
  var g = function(id){ var n = document.getElementById(id); return n ? n.value : ''; };
  var nm = g('rf_name').trim();
  var hrs = parseFloat(g('rf_hrs')) || 1;
  var mins = Math.round(hrs * 60);
  if (!nm) { toast('Enter the user\u2019s name', true); return; }
  if (!mins || mins < 5) { toast('Book at least half an hour', true); return; }
  var u = (DB.units||[]).filter(function(x){ return x.id === rentForm.unitId; })[0];
  if (!u) { toast('That workstation is gone', true); return; }
  if (sessionOnUnit(u.id)) { toast(u.name + ' is already in use', true); return; }
  var nowMs = Date.now();
  var ref = nextRentRef();
  DB.cfg.rseq = (DB.cfg.rseq || 1) + 1;
  DB.rentals.unshift({
    ref: ref, status:'active', date: today(), unitId: u.id, unit: u.name,
    name: nm, org: g('rf_org').trim(), purpose: g('rf_purpose').trim(),
    rate: facilityRate(), booked: mins, bookedHrs: hrs, added: 0, alarmed: false,
    kit: JSON.parse(JSON.stringify((rentForm && rentForm.kit) || {})),
    note: g('rf_note').trim(),
    startMs: nowMs, endsMs: nowMs + mins * 60000, closedMs: null,
    inT: msToHHMM(nowMs), outT: '', mins: 0, net: 0
  });
  save();
  trackEvent('facility_session_started');
  rentForm = null;
  renderRent();
  toast(u.name + ' started \u2014 ' + fmtDuration(mins) + ' booked');
}
function addTime(ref, m){
  var se = (DB.rentals||[]).filter(function(x){ return x.ref === ref; })[0];
  if (!se || se.status !== 'active') return;
  se.endsMs += m * 60000;
  se.added = (se.added || 0) + m;
  if (se.endsMs > Date.now()) se.alarmed = false;      // re-arm if pushed back into the future
  save(); renderRent();
  toast((m > 0 ? '+' : '') + m + ' min on ' + se.unit);
}
function closeSession(ref){
  var se = (DB.rentals||[]).filter(function(x){ return x.ref === ref; })[0];
  if (!se || se.status !== 'active') return;
  se.closedMs = Date.now();
  se.outT = msToHHMM(se.closedMs);
  se.mins = minsUsed(se);
  se.net = netOf(se);
  se.status = 'closed';
  if (rentOpen === se.ref) rentOpen = null;
  save(); renderRent();
  toast(se.unit + ' billed \u2014 ' + money(se.net) + ' for ' + fmtDuration(se.mins));
  printSlip(se.ref);
}
function printSlip(ref){
  var se = (DB.rentals||[]).filter(function(x){ return x.ref === ref; })[0];
  if (!se) return;
  document.getElementById('printarea').innerHTML = buildRentSlip(se);
  var sur = safeFilePart(surnameOf(se.name)).toUpperCase() || 'USER';
  printDoc(sur + '_' + String(se.ref||'').replace(/\D+/g,''));
}

/* ---------- the rental ledger ----------
   One file holding every day ever recorded, each day in its own block with a
   subtotal, oldest first. Nothing is dropped when a new day starts. */
function rentalCSV(){
  var all = (DB.rentals || []).slice();
  var days = {};
  all.forEach(function(x){ (days[x.date] = days[x.date] || []).push(x); });
  var dates = Object.keys(days).sort();                      // chronological, never pruned
  var COLS = ['ref','unit','user','office_school','purpose','equipment','notes',
              'date','time_in','time_out','hours','minutes','rate_per_hour','amount','status'];
  var rows = [];
  rows.push(csvCell('CSDA Digital Entertainment Exchange \u2014 Facility Rental Ledger'));
  rows.push([csvCell('Exported'), csvCell(today()), csvCell('Days on record'), csvCell(dates.length)].join(','));
  rows.push('');

  var gMins = 0, gAmt = 0;
  dates.forEach(function(d){
    var list = days[d].slice().sort(function(a, b){ return (a.startMs||0) - (b.startMs||0); });
    var dMins = 0, dAmt = 0;
    rows.push([csvCell('DATE'), csvCell(d), csvCell(prettyDate(d)),
               csvCell('Sessions'), csvCell(list.length)].join(','));
    rows.push(COLS.join(','));
    list.forEach(function(x){
      var mins = x.status === 'closed' ? x.mins : minsUsed(x);
      var amt  = x.status === 'closed' ? x.net  : netOf(x);
      dMins += mins; dAmt += amt;
      var kit = x.kit ? RENT_KIT.filter(function(k){ return x.kit[k[0]]; })
                                .map(function(k){ return k[1]; }).join('; ') : '';
      rows.push([x.ref, x.unit, x.name, x.org, x.purpose, kit, x.note || '',
                 x.date, x.inT, x.outT || '',
                 (mins / 60).toFixed(2), mins, x.rate, amt.toFixed(2), x.status].map(csvCell).join(','));
    });
    rows.push([csvCell('Day total'), '', '', '', '', '', '', csvCell(d), '', '',
               csvCell((dMins / 60).toFixed(2)), csvCell(dMins), '', csvCell(dAmt.toFixed(2)), ''].join(','));
    rows.push('');
    gMins += dMins; gAmt += dAmt;
  });

  rows.push([csvCell('GRAND TOTAL'), '', '', '', '', '', '', csvCell(dates.length + ' days'), '', '',
             csvCell((gMins / 60).toFixed(2)), csvCell(gMins), '', csvCell(gAmt.toFixed(2)), ''].join(','));
  return rows.join('\r\n');
}
function rentalCSVName(){ return 'CClab_rental_' + today(); }
function downloadRentalCSV(){
  if (!(DB.rentals || []).length) { toast('No rentals recorded yet', true); return; }
  var okdl = download(rentalCSVName() + '.csv', rentalCSV(), 'text/csv;charset=utf-8');
  toast(okdl ? 'Downloaded ' + rentalCSVName() + '.csv' : 'Download blocked by the browser', !okdl);
}

function openRent(){
  trackEvent('facility_opened');
  rentForm = null; rentEdit = null;
  lockPage(); scrim.classList.add('on');
  document.getElementById('rent').classList.add('on');
  openKind = 'rent';
  renderRent();
}

/* ---------- Staff Acceptable Use Guidelines ----------
   Shown once per browser after sign-in; acceptance is recorded with a
   timestamp so there is a record of who agreed and when. */
var AUP_VERSION = '2026-01';
var AUP_TEXT = [
  ['1. Purpose & Scope',
   ['This policy governs the secure handling of student, financial and TESDA assessment data within the CSDA internal application. All administrative, accounting and teaching staff with system access must strictly comply.']],
  ['2. Credential Security',
   ['<b>No account sharing:</b> staff must use their uniquely assigned login credentials. Sharing administrative accounts is strictly prohibited.',
    '<b>Session security:</b> log out of the application immediately when leaving a workstation or device unattended.']],
  ['3. Student & TESDA Data Privacy',
   ['<b>Authorised access only:</b> staff may only view student records, enrollment files and usage metrics necessary to perform their immediate job duties.',
    '<b>No unauthorised downloads:</b> exporting, screenshotting or downloading learner directories, TESDA evaluation sheets or personal details onto personal phones, laptops or external drives is strictly forbidden.',
    '<b>Data confidentiality:</b> student information discovered via app monitoring must never be shared outside official CSDA communication channels.']],
  ['4. Financial Verification & Image Handling',
   ['<b>GCash &amp; bank receipt auditing:</b> staff assigned to payment verification must handle uploaded payment screenshots with strict confidentiality.',
    '<b>Immediate deletion / archiving:</b> once a transaction is manually verified against the school\u2019s official bank / GCash ledger, screenshots must be processed according to CSDA secure accounting protocols and never saved to a staff member\u2019s local downloads folder.']],
  ['5. Audit and System Monitoring',
   ['<b>Activity logging:</b> administrative actions \u2014 modifications to enrollment statuses, data views and payment approvals \u2014 are recorded in this application\u2019s activity trail.',
    '<b>Non-compliance:</b> violating these guidelines compromises school security and violates the <i>Philippine Data Privacy Act</i>. Non-compliance will result in immediate revocation of app access and disciplinary action, up to and including termination.']]
];
function aupAccepted(){ return store.get('csda_aup') === AUP_VERSION; }
function aupPanel(gate){
  var h = '<div class="aupbox">' +
    '<div class="conh">Cordillera School of Digital Arts \u2014 Staff Acceptable Use Guidelines</div>';
  AUP_TEXT.forEach(function(sec){
    h += '<div class="conk">' + esc(sec[0]) + '</div><ul class="auplist">' +
      sec[1].map(function(p){ return '<li>' + p + '</li>'; }).join('') + '</ul>';
  });
  if (gate) {
    h += '<div class="frow" style="margin-top:14px"><div class="field">' +
      '<label class="flab">Your name <span class="req">*</span></label>' +
      '<input class="finp" id="aup_who" value="' + esc(staffName) + '" placeholder="Who is signing in"></div>' +
      '<div class="field"><label class="flab">&nbsp;</label>' +
      '<button class="btn pri blk" data-act="aup-accept">I have read and accept these guidelines</button>' +
      '</div></div>';
  } else {
    var at = store.get('csda_aup_at'), who = store.get('csda_aup_who');
    h += '<div class="okbox" style="margin-top:12px">Accepted' + (who ? ' by <b>' + esc(who) + '</b>' : '') +
      (at ? ' on ' + esc(String(at).slice(0,10)) + ' at ' + esc(String(at).slice(11,16)) : '') +
      ' \u00b7 version ' + AUP_VERSION + '</div>';
  }
  return h + '</div>';
}
function adminPolicies(){
  var exceptions=[];(DB.records||[]).forEach(function(r){(r.operationalHistory||[]).forEach(function(x){if(/policy exception/i.test(x.note||''))exceptions.push({ref:r.ref,student:(r.student||{}).name||'',at:x.at,by:x.by,note:x.note});});});exceptions.sort(function(a,b){return String(b.at||'').localeCompare(String(a.at||''));});
  var h = aupPanel(false)+'<div class="ms"><div class="msh">Policy exception registry · '+exceptions.length+'</div>'+(exceptions.length?exceptions.map(function(x){return '<div class="gate-row"><div><b>'+esc(x.ref)+' · '+esc(x.student)+'</b><br><span class="sc">'+esc(String(x.at||'').replace('T',' ').slice(0,19))+' · '+esc(x.by||'Administrator')+'</span><br>'+esc(x.note)+'</div></div>';}).join(''):'<div class="note">No policy exceptions recorded.</div>')+'</div>';
  h += '<div class="ms"><div class="msh">Activity trail &middot; ' + ((DB.audit||[]).length) + '</div>' +
    '<div class="alert" style="margin-top:0"><div class="ai">&#9888;</div><div class="at">' +
    '<b>This trail is a convenience, not legal audit evidence.</b> It lives in this browser\u2019s storage ' +
    'alongside the records it describes, so anyone with the admin password and developer tools can alter ' +
    'or clear it. A tamper-proof trail of the kind the Data Privacy Act contemplates needs a server with ' +
    'per-staff accounts and append-only storage.</div></div>';
  if (!(DB.audit||[]).length) {
    h += '<div style="font-size:12.5px;color:var(--ter);padding:6px 2px">Nothing recorded yet.</div>';
  } else {
    h += '<table class="dt duetbl"><thead><tr><th>When</th><th>Who</th><th>Action</th></tr></thead><tbody>';
    DB.audit.slice(0, 80).forEach(function(a){
      h += '<tr><td class="sc">' + esc(String(a.at).slice(0,16).replace('T',' ')) + '</td>' +
        '<td>' + esc(a.who) + '</td><td>' + esc(a.what) + '</td></tr>';
    });
    h += '</tbody></table>';
  }
  h += '</div>';
  h += '<div class="ms"><div class="msh">Privacy Policy in force</div>' +
    '<div class="legdoc" style="max-height:260px">' + legalHTML(PRIVACY_POLICY) + '</div></div>';
  h += '<div class="ms"><div class="msh">Terms and Conditions in force</div>' +
    '<div class="legdoc" style="max-height:260px">' + legalHTML(TERMS_CONDITIONS) + '</div></div>';
  h += '<div class="ms"><div class="msh">Parental consent text in force</div>' +
    '<div class="note" style="margin-top:0">Shown automatically whenever an applicant\u2019s birthdate puts ' +
    'them under 18. Reproduced on the printed enrollment form as the consent record.</div>' +
    '<ul class="auplist">' + CONSENT_ITEMS.map(function(it){
      return '<li><b>' + esc(it[1]) + '</b> \u2014 ' + esc(it[2]) + '</li>'; }).join('') +
    '<li><i>' + esc(CONSENT_CERT) + '</i></li></ul></div>';
  return h;
}

/* ==========================================================================
   MASTER LEGAL TEXTS \u2014 Privacy Policy & Terms and Conditions
   Held separately and surfaced as their own tabs: the deployment rule forbids
   merging them, and each carries its own unchecked click-wrap box.
   ========================================================================== */
var DPC_EMAIL = 'contactus.csda@gmail.com';

var PRIVACY_POLICY = [
  ['1. Information We Collect', 'p',
   'To operate the CSDA internal onboarding platform effectively, we collect the following categories of information:'],
  ['', 'ul', [
    '<b>Personal &amp; contact details:</b> full legal name, date of birth, personal email address, primary mobile phone number and physical mailing address.',
    '<b>Academic &amp; enrollment profile data:</b> enrolled tracks, courses (e.g. Animation, Illustration, Graphic Design), course attendance logs, submission timelines and progress metrics.',
    '<b>Financial &amp; transaction metadata:</b> user-uploaded screenshots of payment validation receipts (GCash / bank transfers), reference numbers, date of payment and cash values. <i>We do not collect or store raw card or account credentials.</i>',
    '<b>System usage monitoring logs:</b> hardware / device signatures, IP addresses, application event logs and timestamped actions performed within the admin and student dashboards.']],
  ['2. How Data is Processed and Used', 'p',
   'All collected data is processed strictly for legitimate operational purposes, including:'],
  ['', 'ul', [
    'Validating admissions, course enlistments and managing student registration.',
    'Cross-referencing manual student billing submissions against official school ledgers.',
    'System analytics to audit account activity, optimise platform performance and ensure institutional network security.']],
  ['3. Data Storage, Retention and Security', 'ul', [
    '<b>Security safeguards:</b> student personal data, payment confirmation files and logs are protected using industry-standard database encryption protocols.',
    '<b>Staff restrictions:</b> data is compartmentalised and accessible only to authorised CSDA administrative, registrar and accounting personnel using individual, audited credentials.',
    '<b>Purging ledger:</b> inactive user metadata and processed transaction files are securely archived or destroyed after the academic period or required accounting audit cycle terminates.']],
  ['4. Your Rights Under RA 10173', 'p',
   'As a data subject you maintain the right to inspect, verify, update or ask for the suspension of your personal processing records. Direct all compliance or data security inquiries to the designated CSDA Data Protection Coordinator at <b>' + 'contactus.csda@gmail.com' + '</b>.']
];

var TERMS_CONDITIONS = [
  ['1. Acceptance of Terms &amp; Minor Gateways', 'p',
   'By completing your registration profile or utilising the platform interface, you acknowledge that you have read, understood and agreed to these Terms and Conditions.'],
  ['', 'ul', [
    '<b>Minor registration policy:</b> if an applicant is under 18 years of age, standalone access is legally void. A parent or legally authorised guardian must review and explicitly execute the embedded Emergency Contact &amp; Parental Consent framework during onboarding.']],
  ['2. Account Responsibility &amp; Forbidden Misuse', 'ul', [
    'You are solely liable for safeguarding your active system credentials. Sharing or compromising administrative or learner portals is strictly prohibited.',
    'Bypassing platform architecture boundaries, injecting malicious scripts, executing unauthorised reverse engineering or altering transactional screenshots will result in instantaneous suspension of privileges and referral to institutional disciplinary committees.']],
  ['3. Payment Processing Disclaimers', 'ul', [
    '<b>Provisional account status:</b> submitting a transaction tracking reference number or a financial capture via GCash / bank upload does not validate enrollment. The student account holds a status of &ldquo;Provisional Hold&rdquo; and will remain restricted until accounting personnel manually clear the funds in the institution\u2019s official ledger accounts.',
    '<b>Fraud &amp; deceptive submissions:</b> uploading altered, recycled or falsified payment receipts constitutes a severe breach of this contract. CSDA maintains the legal right to permanently terminate the offending profile and forward digital footprints to proper legal venues.',
    '<b>Transactional network fees:</b> external overhead or transaction convenience charges asserted by banks or network utilities are shouldered solely by the user and are non-refundable.']],
  ['4. Intellectual Property', 'p',
   'All assets, programming code, platform styling, animation frameworks, design curriculums and visual assets built into this service are the exclusive property of Cordillera School of Digital Arts, Inc. Users are granted a non-transferable, revocable licence to utilise these materials exclusively for educational or official internal tracking purposes.'],
  ['5. Legal Venue', 'p',
   'These policies are governed exclusively by the laws of the Republic of the Philippines. Any litigation or formal dispute arising out of platform usage shall be filed solely within the proper courts of Baguio City, Philippines.']
];

function legalHTML(doc){
  return doc.map(function(sec){
    var h = sec[0] ? '<div class="legh">' + sec[0] + '</div>' : '';
    if (sec[1] === 'p')  h += '<p class="legp">' + sec[2] + '</p>';
    if (sec[1] === 'ul') h += '<ul class="auplist">' + sec[2].map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>';
    return h;
  }).join('');
}

/* the click-wrap gate: separate, unchecked, and all required before submit */
function agreementsComplete(){
  var a = (E && E.agree) || {};
  if (!a.privacy || !a.terms) return false;
  if (isMinor() && !consentComplete()) return false;
  return true;
}
function agreementsMissing(){
  var a = (E && E.agree) || {}, out = [];
  if (!a.privacy) out.push('Privacy Policy');
  if (!a.terms) out.push('Terms and Conditions');
  if (isMinor() && !consentComplete()) out.push('Parental Consent');
  return out;
}


