/* Two public membership offers. Account creation is not a free subscription. */
(()=>{'use strict';function init(){
 const allowed=p=>p==='pro'||p==='elite';
 try{delete MM_TIER_LABELS.basic;delete MM_MEMBERSHIP_PRICES.basic;delete ACCT_PLAN_META.basic;delete MEMBERSHIP_PAYMENT_LINKS.basic;for(const p of ['pro','elite'])delete MEMBERSHIP_PAYMENT_LINKS[p].yearly;}catch{}
 const notice=()=>window.showNotifToast?.('Choose a membership','Only Pro at $50/month and Elite at $97/month are available.');
 const checkout=window.openMembershipCheckout;window.openMembershipCheckout=function(plan){if(!allowed(plan)){notice();window.showScreen?.('plans');return;}window.mmBillingInterval='monthly';return checkout?.(plan);};
 const upgrade=window.openUpgradeModal;window.openUpgradeModal=function(plan){if(plan&&!allowed(plan)){notice();plan=undefined;}window.mmBillingInterval='monthly';upgrade?.(plan);prune();};
 window.checkoutMembershipWithPromo=function(plan,input,error){if(!allowed(plan)){notice();return;}if(document.getElementById(input)?.value.trim()){const e=document.getElementById(error);if(e){e.style.display='block';e.textContent='Discount codes are not enabled for these membership options yet.';}return;}window.openMembershipCheckout(plan);};
 const share=window.sharePlan;window.sharePlan=function(plan,button){if(!allowed(plan)){notice();return;}return share?.(plan,button);};
 const interval=window.mmSetBillingInterval;window.mmSetBillingInterval=function(value,group,kind){if(kind==='genie')return interval?.(...arguments);window.mmBillingInterval='monthly';window.mmUpdateMembershipButtons?.(group);};
 function prune(){
  document.querySelectorAll('#pricingCards .feat-card').forEach(c=>{const title=c.querySelector('.feat-title');if(title&&/^free$|^basic$/i.test(title.textContent.trim()))c.remove();});
  document.querySelectorAll('#screen-plans .comp-tier.free,#screen-plans .comp-tier.basic,#upgradeModal [data-mm-tier-row="free"],#upgradeModal [data-mm-tier-row="basic"],[data-mm-plan-btn="basic"]').forEach(e=>e.remove());
  document.querySelectorAll('#mmToggle_pp,#mmToggle_um').forEach(e=>e.hidden=true);
  document.querySelectorAll('#screen-plans .comp-tier-grid').forEach(e=>e.style.gridTemplateColumns='repeat(auto-fit,minmax(min(280px,100%),1fr))');
  document.querySelectorAll('#screen-plans .comp-tier.elite .comp-tier-price').forEach(e=>e.innerHTML='$97<sub>/mo</sub>');
  document.querySelectorAll('#screen-plans .comp-tier.elite button').forEach(e=>{if(e.textContent.includes('$99'))e.textContent=e.textContent.replace('$99','$97');});
  const title=document.querySelector('#secPricing .lsec-title');if(title)title.textContent='Choose Pro or Elite';const sub=document.querySelector('#secPricing .lsec-sub');if(sub)sub.textContent='Pro is $50/month. Elite is $97/month. Activated services and usage are billed separately.';
  document.querySelectorAll('#pricingCards button').forEach(e=>{e.textContent='Create account to enroll →';});
  document.querySelectorAll('.pricing-limited-badge').forEach(e=>e.remove());
 }
 prune();const render=window.renderAcctMembership;window.renderAcctMembership=function(){render?.();const pill=document.getElementById('acctCurrentPlanPill');if(pill&&!allowed(window.userData?.plan))pill.textContent='No paid membership';};
 const previous=window.showScreen;window.showScreen=function(){previous?.apply(this,arguments);prune();};
 document.addEventListener('mm:auth',()=>{prune();window.renderAcctMembership?.();});
 }if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();})();
