#!/usr/bin/env node
'use strict';
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const root=path.resolve(__dirname,'..'), file=path.join(root,'index.html');
const html=fs.readFileSync(file,'utf8');
const rows=[];
const re=/data:image\/([^;]+);base64,([A-Za-z0-9+/=]+)/g; let m,n=0;
while((m=re.exec(html))){
  n++; const raw=Buffer.from(m[2],'base64'); const before=html.slice(Math.max(0,m.index-180),m.index);
  let name='embedded-image-'+n;
  if(/rel="icon"[^>]*href="?$/.test(before)) name='inline-favicon';
  else if(/splashappicon[^>]*src="?$/.test(before)) name='splash-cpt-logo';
  else if(/ICON_192\s*=\s*['"]?$/.test(before)) name='runtime-icon-192';
  else if(/ICON_512\s*=\s*['"]?$/.test(before)) name='runtime-icon-512';
  else if(/LOGO_MARK\s*=\s*['"]?$/.test(before)) name='csda-logo-mark';
  else if(/LOGO_FULL\s*=\s*['"]?$/.test(before)) name='csda-logo-full';
  rows.push({name,type:m[1],decodedBytes:raw.length,base64Characters:m[2].length,sha256:crypto.createHash('sha256').update(raw).digest('hex')});
}
const total=rows.reduce((s,r)=>s+r.decodedBytes,0);
const report={generatedAt:new Date().toISOString(),htmlBytes:Buffer.byteLength(html),embeddedDecodedBytes:total,assets:rows};
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports','asset-inventory.json'),JSON.stringify(report,null,2)+'\n');
let md='# Embedded Asset Inventory\n\nGenerated from `index.html`.\n\n| Asset | Format | Decoded bytes | Base64 characters |\n|---|---:|---:|---:|\n';
for(const r of rows) md+=`| ${r.name} | ${r.type} | ${r.decodedBytes.toLocaleString()} | ${r.base64Characters.toLocaleString()} |\n`;
md+=`\n**Total decoded embedded-image bytes:** ${total.toLocaleString()}  \n**HTML bytes:** ${report.htmlBytes.toLocaleString()}\n`;
fs.writeFileSync(path.join(root,'reports','asset-inventory.md'),md);
console.log(`Inventoried ${rows.length} images, ${total} decoded bytes`);
