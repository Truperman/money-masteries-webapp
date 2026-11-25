# Shopify public-distribution readiness — November 25, 2026

Canonical local-review requirements fetched through Shopify CLI: 100. Evaluated core requirements: 31. Likely passing: 24. Needs review: 7. Likely failing: 0. Category requirements skipped: 69 across 10 groups.

This is a local review of the selected locally checkable criteria, not Shopify approval or an App Store submission. Public connections remain disabled.

## Items needing review

### 1.1.2 Use Shopify checkout

The Money Masteries site builder uses external checkout links for its independent storefronts; the Shopify connector exports only drafts and does not create Shopify orders or route Shopify checkout payments. Shopify should confirm the separation and applicable checkout policy.

### 1.1.4 Use only factual information

No App Store listing has been submitted. Broader Money Masteries marketing and income-target copy need human review before a listing or public distribution submission.

### 1.2.1 Use Shopify App Pricing or the Shopify Billing API

The connector currently requires an existing externally billed Elite Money Masteries account. Shopify must accept this existing-service arrangement or an explicit exemption; no Shopify billing path or exemption is currently recorded.

### 1.2.2 Implement Shopify App Pricing or the Shopify Billing API correctly

If Shopify requires billing for the integration, Shopify App Pricing/Billing and reinstall charge handling must be implemented before public launch. Existing Pro/Elite prices and external contracts were not changed.

### 1.2.3 Allow pricing plan changes

Money Masteries offers its own plan management. Applicability of Shopify-billed app plan changes depends on Shopify accepting the connector billing arrangement.

### 2.2.3 Use the latest version of Shopify App Bridge

The app is explicitly non-embedded and has no deployed Admin UI extension. Verify Shopify App Bridge applicability with the review team for this standalone integration.

### 2.3.3 Redirect to the app UI after installation

Callback-to-Money-Masteries UI and explicit account linking are implemented and tested with fixtures. A live merchant browser OAuth/linking run remains to be witnessed.

## Core requirement ledger

| Requirement | Local result |
|---|---|
| 1.1.1 Use session tokens for authentication | Likely passing within connector scope |
| 1.1.2 Use Shopify checkout | Needs review |
| 1.1.3 Direct merchants to the Shopify Theme Store | Likely passing within connector scope |
| 1.1.4 Use only factual information | Needs review |
| 1.1.6 Build single-merchant storefronts. Marketplaces should be sales channels | Likely passing within connector scope |
| 1.1.7 Always build Payment Gateway apps using the Payments API and after obtaining authorization | Likely passing within connector scope |
| 1.1.8 Build apps for Shopify POS only, not third-party systems | Likely passing within connector scope |
| 1.1.9 Obtain explicit buyer consent before adding charges | Likely passing within connector scope |
| 1.1.10 Maintain the cheapest shipping option as default | Likely passing within connector scope |
| 1.1.13 Duplicate only authorized product information | Likely passing within connector scope |
| 1.1.14 Don't connect merchants to external agencies and developers | Likely passing within connector scope |
| 1.1.15 Process refunds only through the original payment processor | Likely passing within connector scope |
| 1.1.16 Don't provide capital lending | Likely passing within connector scope |
| 1.2.1 Use Shopify App Pricing or the Shopify Billing API | Needs review |
| 1.2.2 Implement Shopify App Pricing or the Shopify Billing API correctly | Needs review |
| 1.2.3 Allow pricing plan changes | Needs review |
| 2.2.1 Use Shopify APIs | Likely passing within connector scope |
| 2.2.3 Use the latest version of Shopify App Bridge | Needs review |
| 2.2.4 Use the GraphQL Admin API | Likely passing within connector scope |
| 2.2.6 Don't display promotions or advertisements in admin extensions | Likely passing within connector scope |
| 2.2.7 Only launch Max modal with merchant interaction | Likely passing within connector scope |
| 2.3.1 Initiate installation from a Shopify-owned surface | Likely passing within connector scope |
| 2.3.2 Authenticate immediately after install | Likely passing within connector scope |
| 2.3.3 Redirect to the app UI after installation | Needs review |
| 2.3.4 Require OAuth authentication immediately after reinstall | Likely passing within connector scope |
| 3.1.1 Use a valid TLS/SSL certificate | Likely passing within connector scope |
| 3.2.1 Request read_all_orders access scope only if it provides necessary app functionality | Likely passing within connector scope |
| 3.2.2 Request write_payment_mandate scope only if it provides necessary app functionality | Likely passing within connector scope |
| 3.2.3 Request write_checkout_extensions_apis scope only if it provides necessary app functionality | Likely passing within connector scope |
| 3.2.4 Request read_advanced_dom_pixel_events scope only if it provides necessary app functionality | Likely passing within connector scope |
| 3.2.5 Request read_checkout_extensions_chat scope only when required | Likely passing within connector scope |

Positive evidence: Shopify GraphQL Admin API 2026-10 product operations; real owned-store draft export with correct price/SKU/image; repeat export without duplication; owner-scoped products and encrypted credentials; Shopify SDK HMAC verification; browser nonce and authenticated member binding; signed Shopify-owned installation before account linking; explicit confirmation on unbound installs; narrow product scopes; HTTPS; mandatory privacy/uninstall webhooks; no Shopify customer/order/payment, theme, POS, checkout, shipping-rate, refund, capital-lending or marketplace operations in the connector.

## Skipped category groups

- Group 5.1 Online store — No corresponding Shopify extension type or subscription scope in the released app.
- Group 5.2 Payment — No corresponding Shopify extension type or subscription scope in the released app.
- Group 5.3 Payment facilitator — Opt-in category review not requested for this connector.
- Group 5.4 Purchase option — No corresponding Shopify extension type or subscription scope in the released app.
- Group 5.5 Product sourcing — Opt-in category review not requested for this connector.
- Group 5.6 Checkout customization — No corresponding Shopify extension type or subscription scope in the released app.
- Group 5.7 Sales channel — No corresponding Shopify extension type or subscription scope in the released app.
- Group 5.8 Post purchase — No corresponding Shopify extension type or subscription scope in the released app.
- Group 5.9 Mobile app builders — Opt-in category review not requested for this connector.
- Group 5.10 Donation — Opt-in category review not requested for this connector.

All requirements inside those groups are skipped; they are not silently counted as passing. The scaffold App Home/FAQ extensions were quarantined outside the deployed app and were not released.

## Remaining submission work

- Confirm the existing Elite billing arrangement with Shopify; preserve the approved $50/$97 Money Masteries memberships and separate usage billing unless the owner explicitly approves a change.
- Complete live browser OAuth and linking on the owned development store. API export success does not prove browser OAuth.
- Prepare the final App Store listing/support/privacy materials and any required registration, account/security and review steps in Shopify Dev Dashboard. No registration fee has been approved or paid.
- Obtain actual distribution approval and an assigned installation URL before the owner enables public connections.
- Affiliate acceptance is a separate process. A reconsideration email was sent at the owner's instruction; no affiliate link has been approved.

References:
https://shopify.dev/docs/apps/launch/app-store-review/app-store-ai-self-review-requirements
https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements
https://shopify.dev/docs/apps/launch/billing
https://shopify.dev/docs/apps/launch/distribution

## Additional current security prerequisite
Shopify's November 5, 2026 changelog requires all public apps to have an enabled API IP allowlist by November 20, 2026. The Dev Dashboard supports hosting-provider ASNs constrained to countries for serverless hosting, so a static-IP infrastructure purchase is not automatically necessary. Money Masteries runs these functions in Google Cloud us-central1. The actual provider network/country rules must be verified against recent app traffic and enabled in the app's security settings before installations outside the organization are enabled. This dashboard configuration is not yet verified or complete. No broad allow-all rule was configured.

Sources:
https://shopify.dev/changelog/posts/ip-allowlists-are-now-required-for-public-apps
https://shopify.dev/changelog/posts/app-ip-allowlists-now-support-apps-with-serverless-hosting
