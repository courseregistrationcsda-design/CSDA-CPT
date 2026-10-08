#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'));
const modules=fs.readdirSync(path.join(root,'modules')).filter(f=>f.endsWith('.js')).sort().map(f=>fs.readFileSync(path.join(root,'modules',f)));
const manifest=fs.readFileSync(path.join(root,'manifest.webmanifest'));
const hash=crypto.createHash('sha256').update(index).update(Buffer.concat(modules)).update(manifest).digest('hex').slice(0,12);
const swPath=path.join(root,'sw.js'); let sw=fs.readFileSync(swPath,'utf8');
const next=`csda-toolkit-${hash}`;
if(!/var CACHE = 'csda-toolkit-[^']+';/.test(sw)) throw new Error('CACHE declaration not found');
sw=sw.replace(/var CACHE = 'csda-toolkit-[^']+';/,`var CACHE = '${next}';`);
fs.writeFileSync(swPath,sw);
console.log(next);
