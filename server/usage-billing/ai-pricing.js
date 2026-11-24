'use strict';
// Explicitly supported, provider-verified standard rates. Unknown models never inherit a guessed price.
const RATES=Object.freeze({
 'claude-sonnet-4-5-20250929':Object.freeze({input:3,output:15}),
 'claude-sonnet-4-6':Object.freeze({input:3,output:15}),
});
function priceForModel(model='claude-sonnet-4-5-20250929'){if(!Object.hasOwn(RATES,model)){const error=new Error('Select a supported AI model with a verified usage rate.');error.code='failed-precondition';throw error;}return RATES[model];}
module.exports={priceForModel,RATES};
