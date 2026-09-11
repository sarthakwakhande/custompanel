/** Server-side Pterodactyl gateway: application tokens never reach a browser. */
export class PterodactylGateway {
 constructor(private readonly base=process.env.PTERODACTYL_URL!, private readonly applicationKey=process.env.PTERODACTYL_APPLICATION_KEY!, private readonly clientKey=process.env.PTERODACTYL_CLIENT_KEY!) {}
 async application(path:string, init:RequestInit={}) { return this.request('/api/application'+path, this.applicationKey, init); }
 async client(path:string, init:RequestInit={}) { return this.request('/api/client'+path, this.clientKey, init); }
 private async request(path:string,key:string,init:RequestInit) { const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),10_000); try { const r=await fetch(this.base+path,{...init,signal:controller.signal,headers:{Accept:'Application/vnd.pterodactyl.v1+json',Authorization:`Bearer ${key}`,...init.headers}}); if(!r.ok) throw Object.assign(new Error('Pterodactyl request failed'),{statusCode:502}); return r.status===204?null:await r.json(); } finally { clearTimeout(timer); } }
}
