/* Saved launch briefs are private; experiments contain member-entered observations only. */
'use strict';
const {text}=require('./core'),{fail}=require('../usage-billing/service');
const tasks=['store','product','seo','email','photo'];
function normalize(d){
 const brief={};for(const [key,max] of Object.entries({brand:120,audience:600,idea:3000,headline:200,description:5000,product:160,details:4000}))brief[key]=text(d.brief?.[key]||'',max);
 if(!['inventory','dropshipping','pod','digital'].includes(d.brief?.model))fail('invalid-argument','Choose a business model.');brief.model=d.brief.model;
 const drafts={};for(const k of tasks)if(d.drafts?.[k]){const v=d.drafts[k];drafts[k]={text:text(v.text,24000),basedOn:text(v.basedOn||'',16000),updatedAt:text(v.updatedAt||'',40),origin:v.origin==='ai'?'ai':'member'};}
 const margin={};for(const key of ['price','cost','shipping','feePct','feeFixed','acquisition']){const raw=d.margin?.[key];if(raw==null||raw===''){margin[key]='';continue;}const v=Number(raw);if(!Number.isFinite(v)||v<0||v>(key==='feePct'?100:1000000))fail('invalid-argument','Check margin assumptions.');margin[key]=v;}
 if(!Array.isArray(d.experiments)||d.experiments.length>30)fail('invalid-argument','Keep up to 30 experiments.');
 const experiments=d.experiments.map(x=>{const row={name:text(x.name,160),a:text(x.a,500),b:text(x.b,500)};if(!row.name)fail('invalid-argument','Name the experiment.');for(const k of ['visitsA','visitsB','ordersA','ordersB']){const n=Number(x[k]);if(!Number.isSafeInteger(n)||n<0||n>1e9)fail('invalid-argument','Enter whole, nonnegative experiment counts.');row[k]=n;}if(row.ordersA>row.visitsA||row.ordersB>row.visitsB)fail('invalid-argument','Orders cannot exceed visitors in this conversion experiment.');return row;});
 return {brief,drafts,margin,experiments};
}
function createEcommerce({db,now=Date.now}){const ref=uid=>db.doc('creativeMembers/'+uid+'/ecommerce/launch');return {
 async status(uid){return {workspace:(await ref(uid).get()).data()||{revision:0,brief:{model:'inventory'},drafts:{},margin:{},experiments:[]}};},
 async save(uid,d){const value=normalize(d);if(!Number.isSafeInteger(d.revision)||d.revision<0)fail('invalid-argument','Workspace revision required.');return db.runTransaction(async tx=>{const old=(await tx.get(ref(uid))).data();if((old?.revision||0)!==d.revision)fail('aborted','This launch workspace changed in another window. Download your work, then reload before saving.');const workspace={...value,uid,revision:d.revision+1,updatedAt:now()};tx.set(ref(uid),workspace);return {workspace};});}
 };}
module.exports={createEcommerce,normalize};
