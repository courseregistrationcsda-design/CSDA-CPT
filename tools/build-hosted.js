#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const CleanCSS=require('clean-css'); const terser=require('terser');
const root=path.resolve(__dirname,'..'), out=path.join(root,'release','hosted'), assets=path.join(out,'assets');
fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(assets,{recursive:true});
const source=fs.readFileSync(path.join(root,'index.html'),'utf8'); let html=source;
const seen=new Map();
html=html.replace(/data:image\/([^;]+);base64,([A-Za-z0-9+/=]+)/g,(all,type,b64)=>{
  if(seen.has(all)) return seen.get(all);
  const raw=Buffer.from(b64,'base64'), ext=type==='svg+xml'?'svg':type;
  const name=`image-${crypto.createHash('sha256').update(raw).digest('hex').slice(0,12)}.${ext}`;
  const url=`assets/${name}`; fs.writeFileSync(path.join(assets,name),raw); seen.set(all,url); return url;
});
// A hosted build downloads the untouched source copy on demand, preserving the true
// self-contained/offline file without carrying all embedded images in first-load HTML.
const old="var ok = download('csda-pricing-toolkit.html', serializeApp(), 'text/html;charset=utf-8');\n    if (ok) retireNudge();\n    toast(ok ? 'Downloaded — keep it somewhere permanent'\n             : 'Your browser blocked the download. Use File \\u203A Save Page As instead.');";
const hosted="fetch('standalone.html').then(function(r){ if(!r.ok) throw new Error('download'); return r.text(); }).then(function(text){ var ok=download('csda-pricing-toolkit.html',text,'text/html;charset=utf-8'); if(ok) retireNudge(); toast(ok?'Downloaded — keep it somewhere permanent':'Your browser blocked the download.'); }).catch(function(){ toast('Could not prepare the offline copy. Try again while connected.',true); });";
if(!html.includes(old)) throw new Error('Download hook not found'); html=html.replace(old,hosted);
(async()=>{
  html=html.replace(/<style>([\s\S]*?)<\/style>/g,(_,css)=>'<style>'+new CleanCSS({level:1}).minify(css).styles+'</style>');
  const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)];
  for(let i=scripts.length-1;i>=0;i--){ const m=scripts[i]; if(!m[2].trim()) continue;
    const min=await terser.minify(m[2],{compress:{passes:1},mangle:false,format:{comments:false}});
    if(min.error) throw min.error; html=html.slice(0,m.index)+`<script${m[1]}>${min.code}</script>`+html.slice(m.index+m[0].length);
  }
  fs.writeFileSync(path.join(out,'index.html'),html);
  fs.writeFileSync(path.join(out,'standalone.html'),source);
  for(const f of ['manifest.webmanifest','favicon.ico']) fs.copyFileSync(path.join(root,f),path.join(out,f));
  /* The hosted page externalizes inline images, so add those generated files and the
     on-demand standalone copy to the install precache. This preserves repeat-load
     offline behavior instead of waiting for each image to enter the runtime cache. */
  let sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  const extra=[...seen.values()].map(x=>'/'+x).concat(['/standalone.html']);
  sw=sw.replace("  '/favicon.ico',", "  '/favicon.ico',\n"+extra.map(x=>`  '${x}',`).join('\n'));
  fs.writeFileSync(path.join(out,'sw.js'),sw);
  fs.cpSync(path.join(root,'icons'),path.join(out,'icons'),{recursive:true});
  const result={sourceBytes:Buffer.byteLength(source),hostedHtmlBytes:Buffer.byteLength(html),standaloneBytes:Buffer.byteLength(source),externalAssets:[...seen.values()],generatedAt:new Date().toISOString()};
  fs.writeFileSync(path.join(out,'build-report.json'),JSON.stringify(result,null,2)+'\n');
  console.log(`Hosted HTML ${result.sourceBytes} -> ${result.hostedHtmlBytes} bytes; ${seen.size} images externalized`);
})().catch(e=>{console.error(e);process.exitCode=1});
