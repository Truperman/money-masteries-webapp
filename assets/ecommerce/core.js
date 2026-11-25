(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.MMEcommerce=factory();})(typeof window==='object'?window:this,()=>{
 'use strict';
 function number(v,label,max=1e6){if(v===''||v==null)return null;const n=Number(v);if(!Number.isFinite(n)||n<0||n>max)throw Error('Check '+label+'.');return n;}
 function margin(d){const v={};for(const k of ['price','cost','shipping','feePct','feeFixed','acquisition'])v[k]=number(d[k],k,k==='feePct'?100:1e6);if(Object.values(v).some(x=>x==null))return null;const fees=v.price*v.feePct/100+v.feeFixed,contribution=v.price-v.cost-v.shipping-fees-v.acquisition;return {fees,contribution,margin:v.price>0?contribution/v.price*100:null,breakEvenCPA:v.price-v.cost-v.shipping-fees};}
 function experiment(d){const n={};for(const k of ['visitsA','visitsB','ordersA','ordersB']){n[k]=number(d[k],k,1e9);if(n[k]==null||!Number.isSafeInteger(n[k]))throw Error('Enter whole visitor and order counts.');}if(n.ordersA>n.visitsA||n.ordersB>n.visitsB)throw Error('Orders cannot exceed visitors.');const a=n.visitsA?n.ordersA/n.visitsA:null,b=n.visitsB?n.ordersB/n.visitsB:null;return {a,b,lift:a>0&&b!=null?(b/a-1)*100:null,message:'Member-entered observations. Traffic is not split here; these rates do not establish a winner or statistical significance.'};}
 function fingerprint(brief){return JSON.stringify(brief);}
 return {margin,experiment,fingerprint};
});
