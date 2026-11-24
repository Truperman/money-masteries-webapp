'use strict';
const {hash}=require('./service');
const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])])):value;
async function runProviderEvent({db,provider,eventId,data,handler,req,res,now=Date.now}){
 const fingerprint=hash(JSON.stringify(stable(data))),ref=db.doc('usageProviderEvents/'+hash(provider+':'+eventId));
 const state=await db.runTransaction(async tx=>{const old=await tx.get(ref);if(old.exists){if(old.data().fingerprint!==fingerprint)return 'conflict';if(old.data().state==='completed')return 'completed';if(old.data().state==='processing'&&now()-old.data().at<120000)return 'processing';return 'needs_review';}tx.create(ref,{provider,eventId,fingerprint,state:'processing',at:now()});return 'new';});
 if(state!=='new'){res.status(state==='completed'?200:state==='conflict'?403:503).json({received:state==='completed',state});return;}
 const originalJson=res.json;let body;
 res.json=function(value){body=value;return res;};
 try{await handler(req,res);const successful=res.statusCode<400;await ref.set({state:successful?'completed':'needs_review',finishedAt:now()},{merge:true});res.json=originalJson;res.status(successful?res.statusCode:503).json(body||{received:successful});}
 catch{res.json=originalJson;await ref.set({state:'needs_review',finishedAt:now()},{merge:true}).catch(()=>{});res.status(503).json({received:false,state:'needs_review'});}
 finally{res.json=originalJson;}
}
module.exports={runProviderEvent};
