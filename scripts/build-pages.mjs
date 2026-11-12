import {build} from 'vite';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
await build({base:'/elder-care-foundation/',mode:'pages',build:{outDir:'dist-pages'}});
const html=await readFile('dist-pages/index.html','utf8');
for(const route of ['about','our-work','impact','events','news','get-involved','contact']){await mkdir('dist-pages/'+route,{recursive:true});await writeFile('dist-pages/'+route+'/index.html',html);}
await writeFile('dist-pages/404.html',html);
await writeFile('dist-pages/.nojekyll','');
const snapshot=JSON.parse(await readFile('data/snapshot-events.json','utf8'));
await writeFile('dist-pages/calendar.json',JSON.stringify(snapshot));
console.log('GitHub Pages build ready: dist-pages');
