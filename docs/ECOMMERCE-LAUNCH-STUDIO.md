# Ecommerce Master launch studio — November 25, 2026

## Observed reference and implementation

The requested https://github.com/AIshihzong/awesome-reverse-engineer-anything is a CC0 curated list, not an installable reverse engineering engine. It was cloned and reviewed as requested. Its evidence-first distinction between observed behavior and unsupported implementation claims guided this original rebuild. No REA binary/CLI was installed or claimed as used.

Public Amboras pages reviewed: https://www.amboras.com/, /ai-seo, /ai-emails, /analytics and /ab-testing. These describe a unified store, creative, email, SEO and experiment workflow. Their authenticated application and backend were not accessed, so marketing statements about infrastructure/performance are not treated as verified implementation. No Amboras code, brand assets or customer content is copied.

## Delivered

Ecommerce Master contains sibling tabs: AI Launch Studio, My Store, Create Product, Marketplace, Website & Store. The existing store/product/marketplace panels retain their content. Website & Store renders its real existing builder/catalog/Shopify controls inside Ecommerce Master. Legacy Website Tools routes reach this nested tab.

Launch Studio: private versioned brand brief, business model/audience/product facts; editable metered store/product/SEO/email/photography drafts using the existing authenticated askAI billing route; evidence fingerprint and stale-draft notice; saved draft transfer to reviewed storefront description; explicit draft save to the existing storefront; margin model with missing-value handling; saved manual experiment observations and raw counts; downloadable JSON kit and conflict/error recovery.

Server actions ecommerceStatus/saveEcommerce use the existing active Elite entitlement boundary and the isolated Standard Firestore database money-masteries-automation. Paths are creativeMembers/{verified uid}/ecommerce/launch; browsers cannot select a different member. Optimistic transactional revisions prevent overwrite from stale windows. No browser localStorage stores briefs.

## Material limits

Email outputs are drafts, not automated sends. Photography outputs are direction/prompts; existing Creative Studio remains the generation/upload route with its existing commercial/pricing gates. Experiment results are manually entered observations, not live traffic splitting, Bayesian significance, winner promotion or order analytics. Website publishing, checkout and Shopify keep their existing setup/approval boundaries. No new native payment, fulfillment, refund or order synchronization engine is claimed. AI billing and provider generation are not exercised by fixture tests.

## Verification

80 unit tests pass, including ownership/entitlement/spoofing, concurrent revisions, bounded drafts/observations and calculator edge cases. New browser workflow test covers five tabs, nested builder, AI consent and editable/saveable output, stale drafts, draft-only storefront handoff, margin and experiment math, download, failure recovery, account switching/sign-out and 320–1400px fit. Existing Creative Studio browser suite also passes. Browser suites use fixture backends. Production acceptance is recorded separately after deployment.

## Production acceptance

mmCreativeStudio deployed successfully. The frontend was merged into railway-migration and published on www.moneymasteries.com. Thirteen production checks passed: unauthenticated/Pro denial, authenticated private save/reopen, other-member isolation, spoofed member rejection, stale revision rejection, direct database denial, signed-in browser reload, five tabs, nested website builder and mobile/desktop fit. Temporary synthetic accounts and their records were removed. No paid AI request or message was submitted.
