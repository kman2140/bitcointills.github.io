const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/api/enquiries'){
  if(request.method!=='POST')return json({error:'Method not allowed'},405);
  const origin=request.headers.get('Origin');if(origin&&origin!==url.origin)return json({error:'Please submit from this website.'},403);
  if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'Expected JSON'},415);
  if(Number(request.headers.get('Content-Length')||0)>12000)return json({error:'Your message is too long.'},413);
  let d;try{const raw=await request.text();if(raw.length>12000)return json({error:'Your message is too long.'},413);d=JSON.parse(raw)}catch{return json({error:'Please check the enquiry details.'},400)}
  if(!d||typeof d!=='object'||Array.isArray(d))return json({error:'Please check the enquiry details.'},400);
  const limits={business:120,name:100,email:180,location:140,message:1500};let clean={};
  for(const [key,max]of Object.entries(limits)){if(key==='message'&&d[key]==null){clean[key]='';continue}if(typeof d[key]!=='string'||d[key].trim().length>max||(['business','name','email','location'].includes(key)&&!d[key].trim()))return json({error:'Please check your '+key+' and try again.'},400);clean[key]=d[key].trim();}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)||d.consent!==true||!['yes','no','unsure'].includes(d.pos))return json({error:'Check your email and agree to contact about this enquiry.'},400);
  if(d.website)return json({error:'Your enquiry could not be accepted.'},400);
  if(!env.BUCKET)return json({error:'Enquiries are temporarily unavailable. Please try again later.'},503);
  const id=crypto.randomUUID();const reference='BT-'+id.slice(0,8).toUpperCase();
  try{await env.BUCKET.put('enquiries/'+id+'.json',JSON.stringify({...clean,pos_ready:d.pos,contact_consent:true,reference,created_at:new Date().toISOString(),plan:'business',unit_price_aud:199,monthly_price_aud:20,status:'setup_enquiry',subscription_active:false}),{httpMetadata:{contentType:'application/json'}})}catch{return json({error:'Your enquiry could not be saved. Please try again.'},503)}
  return json({reference},201);
 }
 if(url.pathname!=='/'&&url.pathname!=='/index.html')return new Response('Not found',{status:404});
 return new Response(HTML,{headers:{'Content-Type':'text/html;charset=utf-8','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'"}});
}};
