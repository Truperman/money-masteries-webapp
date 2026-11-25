# Money Masteries Commerce security setup — November 25, 2026

App: Money Masteries Commerce, Haven Homes (226189504), app 451974135809.

## Completed local work

- Shopify CLI 5.1.0, ruleset app-security-rules@5.1.0, scanned 21 source files, including the deployed connector implementation and Creative Studio client directory.
- Recorded 19 focused semantic check outcomes through `shopify app security record`: 18 executed without a verified finding and one React Router-specific check marked inapplicable to the standalone Firebase implementation. Expiring access and refresh credentials were inspected in the custom implementation.
- The combined report has zero active or suppressed findings after adding weekly Dependabot checks to the app scaffold and the main application repository. This configuration enables update checks when hosted on GitHub; a successful hosted Dependabot run has not been observed.
- Validated the released app configuration: valid, zero issues. API version 2026-10, product permissions only, standalone mode, HTTPS callbacks, all three privacy topics and uninstall handling.
- Inspected signed OAuth launch, single-use browser-bound state, authenticated member confirmation, encrypted server-only credentials, refresh locking, member-scoped export and owner-only setup, and raw-body webhook signature plus payload-domain binding.

This is a focused security check, not a complete audit or Shopify approval. Twelve additional semantic checks remain unrecorded in the CLI report, including upload/preview rendering, dependency reachability, and SSRF across the wider Creative Studio. The scanner's framework-specific deterministic coverage gaps must not be treated as proof of full coverage.

Local evidence is under the app scaffold's ignored `.shopify/app-security/shopify.app/` directory. No secrets or credentials are copied into this report.

## Network restriction — requires dashboard completion

Open https://dev.shopify.com/dashboard/226189504/apps/451974135809 and choose Settings → IP allowlist → Manage.

The connector's Shopify requests originate from Firebase/Google Cloud functions in us-central1. Use the source addresses actually shown in this app's recent API logs to establish the hosting-provider ASN rules. Do not substitute the laptop's network, assume an ASN from the company name, allow every address, or block all requests: this connector needs the Admin API.

1. Inspect recent production function traffic and confirm the relevant provider networks and countries.
2. Enter only those networks; constrain network rules to the verified deployment country.
3. Run Shopify's recent-traffic test and resolve any legitimate addresses that would be blocked.
4. Enable enforcement, save, and reopen to verify the persisted setting.
5. Verify an allowed server-side request succeeds and a request from outside the allowlist fails with 403. Use the owned development store only.

No network rules were saved, no enforcement test was performed, and no public-review submission was made in this work. The CLI has no supported command for those dashboard actions, and this chat currently has no connected browser automation tool. A browser integration was requested to complete them.

## Review submission

Use `SHOPIFY-APP-SUBMISSION-PACKET.md` for the truthful listing text and disclosures. The externally billed existing Elite membership needs explicit treatment in the review; no Shopify billing exemption is recorded. Complete required business fields, reviewer access and listing assets from real information. Record the actual submission confirmation before reporting that the app is under review. Keep public member installation disabled until Shopify approval and its assigned installation URL are recorded.

Source verified through Shopify's documentation tools on November 25, 2026:
https://shopify.dev/docs/apps/build/dev-dashboard/ip-allowlist
