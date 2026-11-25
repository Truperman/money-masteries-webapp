# Money Masteries Commerce — submission packet

Prepared November 25, 2026. The app is created, configured and connected to the owner's development store. This packet has not been submitted for Shopify App Store review. Do not label it approved.

Organization: Haven Homes, 226189504. App: gid://shopify/App/451974135809. Client ID: fec0c46621786eebe98ba9fec43b861c (public identifier, not a secret).
App home: https://us-central1-money-masteries-2cc76.cloudfunctions.net/mmShopifyInstall
Privacy/support page: https://www.moneymasteries.com/shopify-privacy.html
Support contact: reachdavid.work@gmail.com
OAuth callback: https://us-central1-money-masteries-2cc76.cloudfunctions.net/mmShopifyCallback
Privacy/uninstall webhook: https://us-central1-money-masteries-2cc76.cloudfunctions.net/mmShopifyWebhook
API version: 2026-10. Scopes: read_products,write_products. No orders, customers, payment, checkout or payout scopes.

## Proposed listing description
Money Masteries Commerce connects an existing eligible Money Masteries account to Shopify. Select products from your own catalog and create Shopify drafts with product descriptions, prices, SKUs and creative media. Review the drafts in Shopify before publishing. Repeat exports preserve products you already exported or edited in Shopify.

## Proposed feature bullets
- Export products that belong to your own Money Masteries member catalog.
- Transfer product names, descriptions, prices, SKUs and selected creative media.
- Create drafts for merchant review instead of publishing products automatically.
- Preserve previously exported products on repeat exports.
- Disconnect your store from Money Masteries at any time.

## Pricing disclosure — requires Shopify acceptance
The current workflow requires an existing $97/month Money Masteries Elite membership, billed outside Shopify as part of the wider Money Masteries program. Activated provider usage is separate. The connector adds no separate charge during installation/export. This is not a claim of exemption from Shopify billing requirements. Review notes must explain the existing-service model and obtain Shopify's acceptance or an explicit exemption. If Shopify requires Shopify App Pricing/Billing, the owner must approve the corresponding implementation before public launch. Do not describe it as usable for free without the existing paid account.

## Review notes
This standalone, non-embedded connector authenticates a signed launch from Shopify, performs the authorization-code grant and then asks the authenticated Elite member to confirm linking the authorized store. Product permissions are granted for this app's own client ID. Credentials are encrypted on the server, renewed with expiring offline-token refresh, and cleared on disconnect/uninstall/store redaction. Public member installs are disabled until approval and an assigned Shopify installation link are recorded.

Owned-store QA created a synthetic product through the actual deployed member endpoint. Shopify returned the expected DRAFT status, price, SKU and ready product image; repeat export did not duplicate it. Synthetic records were cleaned up. The owner separately completed the browser connection to the development store; the server confirmed that owner's link and encrypted refresh credential. Test data is not sales, traffic, earnings or customer performance.

## Outstanding submission fields and checks
- Local security work: see `SHOPIFY-SECURITY-SETUP.md` for the current focused scan, recorded checks, coverage limits and dashboard handoff. Local scan results are not a submitted review.
- Shopify API network/IP allowlist: configure and verify appropriate hosting-provider networks/countries in Dev Dashboard, then enable enforcement. Do not guess ASNs or use an unrestricted rule.
- Confirm the paid-account/billing arrangement with Shopify, including handling new merchants acquired through an App Store listing.
- Verify the final listing name, icon, screenshots and any required demonstration/reviewer account. Supply actual business/contact/legal fields requested by Shopify; none have been fabricated here.
- Complete any app-registration fee and legal agreement review with the owner if Shopify presents them. No fee has been approved or paid.
- Submit public distribution/App Store review and record the actual confirmation/status. Enable member install links only after approval.
- The approved Shopify affiliate referral link is a separate field. The reconsideration email sent November 25 is awaiting Shopify's response; no approved referral link exists yet.
