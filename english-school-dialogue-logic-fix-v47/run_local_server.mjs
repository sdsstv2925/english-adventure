import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = '/mnt/data/fix_v42';
const clientRoot = path.join(root, 'client');
const workerMod = await import(pathToFileURL(path.join(root,'worker','index.js')));
const worker = workerMod.default;

const mime = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.wav':'audio/wav', '.mp3':'audio/mpeg', '.json':'application/json', '.txt':'text/plain; charset=utf-8'
};
const ASSETS = {
  async fetch(req){
    const u = new URL(req.url);
    let p = decodeURIComponent(u.pathname);
    if (p === '/') p = '/index.html';
    const file = path.normalize(path.join(clientRoot, p));
    if (!file.startsWith(clientRoot)) return new Response('forbidden',{status:403});
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return new Response('not found',{status:404});
    const data = fs.readFileSync(file);
    return new Response(data,{status:200, headers:{'content-type': mime[path.extname(file)] || 'application/octet-stream'}});
  }
};
const env = { ASSETS, IMAGES: { input(){ return { transform(){ return { output(){ return { response(){ return new Response('noimg',{status:501}); } }; } }; } }; } } };

const server = http.createServer(async (req,res)=>{
  try{
    const url = `http://127.0.0.1:8787${req.url}`;
    const headers = new Headers();
    for (const [k,v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k,v);
    const body = ['GET','HEAD'].includes(req.method) ? undefined : req;
    const request = new Request(url, { method:req.method, headers, body, duplex:'half' });
    const response = await worker.fetch(request, env, {});
    res.statusCode = response.status;
    response.headers.forEach((v,k)=>res.setHeader(k,v));
    if (req.method === 'HEAD') return res.end();
    const buf = Buffer.from(await response.arrayBuffer());
    res.end(buf);
  }catch(err){
    console.error(err);
    res.statusCode = 500;
    res.end(String(err.stack||err));
  }
});
server.listen(8787, ()=>console.log('server listening'));
