"use strict";
const {PRODUCTS}=require('./membership-access');
// Only paid membership line items earn commission. AI meters, taxes and unrelated products do not.
async function membershipAmount(stripe,id){
 const invoice=await stripe.invoices.retrieve(id);if(invoice.status!=='paid')throw Error('Commission requires a paid invoice');
 let amount=0;for await(const line of stripe.invoices.listLineItems(id,{limit:100})){
  const product=line.price?.product||line.pricing?.price_details?.product;
  if(PRODUCTS[typeof product==='string'?product:product?.id])amount+=(line.amount_excluding_tax??line.amount??0)-(line.discount_amounts||[]).reduce((s,d)=>s+d.amount,0);
 }
 return Math.max(0,Math.min(invoice.amount_paid||0,amount));
}
module.exports={membershipAmount};
