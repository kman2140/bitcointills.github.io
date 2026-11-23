import fs from 'node:fs';
const html=fs.readFileSync('web/index.html','utf8');
const api=fs.readFileSync('worker/api.js','utf8');
fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});
fs.writeFileSync('worker/index.js','const HTML = '+JSON.stringify(html)+';\n'+api);
fs.copyFileSync('worker/index.js','dist/server/index.js');fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
// The managed preview serves this static copy. Hosted traffic is handled by the Worker.
fs.writeFileSync('dist/index.html',html);
console.log('Built self-contained BitcoinTills Worker.');
