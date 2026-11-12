/* Niche selection organizes supporting tools; it does not grant entitlements. */
(()=>{
 function init(){
 const choices={
  reimaster:{name:'Real Estate Investing',steps:'Find leads → Analyze the deal → Prepare the offer → Follow up',tools:['proshubmaster','universitymaster','creativemaster','businessautomation'],help:'Nationwide U.S. is the target; property and owner-contact coverage depends on the connected data source. Use CRM tools to organize prospects, learning tools to build your process, creative tools for outreach materials, and automation tools for reviewed follow-up work.'},
  mystoremaster:{name:'Ecommerce',steps:'Build your store → Choose products → Connect fulfillment → Reach customers',tools:['creativemaster','proshubmaster','saasmaster','businessautomation','universitymaster'],help:'Use creative tools for product content, CRM tools for customer conversations, website tools for your online presence, and automation tools to organize growth work.'},
  marketsmaster:{name:'Day Trading',steps:'Study the market → Define your setup → Practice → Journal and review',tools:['universitymaster','communitymaster','businessautomation'],help:'Use learning and community tools to develop your process. Automation supports planning and review; it does not activate trades or copy trading.'}
 };
 const home=document.getElementById('mmHome');if(!home)return;
 const box=document.createElement('section');box.className='mm-business-focus mm-panel';box.innerHTML='<div class="mm-section-head"><div><h2>What business are you building?</h2><p>Your supporting Tools will follow your focus. You can change it any time.</p></div></div><div class="mm-focus-choices" role="group" aria-label="Business focus">'+Object.entries(choices).map(([route,c])=>'<button type="button" data-focus="'+route+'" data-mm-nav="1" aria-pressed="false">'+c.name+'</button>').join('')+'</div><p id="mmFocusSteps"></p><p id="mmFocusHelp" class="mm-muted"></p><p id="mmFocusStatus" role="status" class="mm-muted"></p><button type="button" id="mmFocusAll" data-mm-nav="1">Show all Tools</button>';
 home.querySelector('#mmMastersHeading').before(box);
 let selected=null,all=false,epoch=0;
 const key=()=>window.currentUser?.uid?'mm-business-focus:'+window.currentUser.uid:null;
 function render(){
  const choice=choices[selected];box.querySelectorAll('[data-focus]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.focus===selected)));
  document.getElementById('mmFocusSteps').textContent=choice?choice.steps:'Choose a niche to see the tools that support it.';
  document.getElementById('mmFocusHelp').textContent=choice?.help||'';
  document.querySelector('#mmMastersHeading h2').textContent=choice&&!all?'Tools for '+choice.name:'Your Tools';
  document.getElementById('mmFocusAll').textContent=all?'Show recommended Tools':'Show all Tools';
  home.querySelectorAll('.mm-master-card:not(.mm-primary-card)').forEach(c=>{const search=document.getElementById('mmMasterSearch').value.toLowerCase().trim();c.hidden=!!(choice&&!all&&!choice.tools.includes(c.dataset.route))||!c.dataset.search.includes(search);});
  document.getElementById('mmNoMasters').hidden=!!home.querySelector('.mm-master-card:not(.mm-primary-card):not([hidden])');
 }
 box.addEventListener('click',async e=>{const button=e.target.closest('[data-focus]');if(!button)return;selected=button.dataset.focus;all=false;const uid=window.currentUser?.uid,attempt=++epoch;try{if(key())localStorage.setItem(key(),selected);}catch{}render();document.getElementById('mmFocusStatus').textContent='Focus selected for this browser.';
  if(uid&&window.FB){try{const F=window.FB;await F.updateDoc(F.doc(F.db,'users',uid),{businessFocus:selected});if(attempt===epoch&&window.currentUser?.uid===uid){if(window.userData)window.userData.businessFocus=selected;document.getElementById('mmFocusStatus').textContent='Business focus saved to your account.';}}catch{if(attempt===epoch)document.getElementById('mmFocusStatus').textContent='Focus selected here. Account sync is unavailable; try again later.';}}
 });
 document.getElementById('mmFocusAll').addEventListener('click',()=>{all=!all;render();});
 document.getElementById('mmMasterSearch').addEventListener('input',render);
 function restore(){epoch++;selected=choices[window.userData?.businessFocus]?window.userData.businessFocus:null;if(!selected&&key())try{const saved=localStorage.getItem(key());if(choices[saved])selected=saved;}catch{}all=false;document.getElementById('mmFocusStatus').textContent='';render();}
 document.addEventListener('mm:auth',restore);
 restore();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
