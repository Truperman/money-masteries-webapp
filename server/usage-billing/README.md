# Money Masteries separate member usage

Deployed November 24, 2026. This does not change the $50 Pro/$97 Elite memberships or their 30%/50% direct membership commission rules. It does not grant free provider usage with Elite, a complimentary membership, or the ProsHub offer.

## Member flow

Plans → Money Masteries Usage & billing (also available in Genie's voice controls). The member reviews rates and exposure limit, explicitly accepts the separate usage terms, and saves a payment method using Stripe Setup Checkout. A signed webhook verifies the completed, owned SetupIntent before activating one usage-only subscription. Merely returning to the site does not activate billing. An uncompleted setup costs $0 and creates no subscription/invoice. Members can manage their dedicated usage invoices in the billing portal.

Each immutable Firebase UID owns a private usage account and a dedicated Stripe customer tagged `platform=money_masteries`, `purpose=usage_v2`, `memberUid=<uid>`. This customer is distinct from membership customers and all ProsHub customers. A client-supplied UID, tier, Stripe customer, balance or claimed receipt never selects the payer. Account revocation and private member identity are checked server-side. Stored records can be exported without buying new usage or reopening a locked niche.

## Collection

Only `money-masteries-automation/usageAccounts/{uid}/events` drives new collection. Global receipt claims reject a receipt attributed to another UID or changed amounts. Amounts are safe integer nano-USD; fractional cents accumulate rather than rounding each small request upward. A durable outbox submits whole cents to the existing Stripe Billing Meter with a stable identifier and idempotency key. Uncertain batches stop for reconciliation before Stripe's deduplication window expires. Invoice webhooks update payment state and deduplicate by invoice identity. Payment failures/exposure limits pause new paid work.

Old direct per-vertical meter reports and the old business unbilled-amount collector no longer collect new usage. The old $19 Genie-access trigger is not called. Historical balances were not silently moved, forgiven or back-charged; they need receipt reconciliation before any collection.

## Speech

Signed-in Genie speech uses `mmGenieSpeak`, never anonymous funnel narration. A request ID binds one text/voice/model to the signed-in UID. Funds exposure is held before generation. Only explicit provider `character-cost` and `request-id` receipts are rated, using the verified Creator USD monthly credit contract ($22/121,000 credits) and the existing 5× AI multiplier. Voice costs/multipliers and current provider plan are validated. Cached same-member replay does not generate or charge again. Unknown outcomes are held for review instead of regenerating. Short-lived audio is private and expired clips are cleaned up. Text chat remains available when speech is blocked.

Current catalog: David (default), Sarah, James/British; language-matching readout remains multilingual. A deleted old female voice was replaced with the verified available Sarah voice. Anonymous welcome narration and static/free education are operator-funded; they are not charged to an unidentified member. Course playback, navigation, local calculators and owned-record CSV downloads do not generate AI/provider usage charges.

## Provider readiness

Existing verified AI/lead/video/phone rate cards retain their configured prices. Signed carrier events meter actual SMS parts/call duration; phone AI tokens and generated speech also enter the member ledger. Provider event identities prevent callback replay from regenerating paid work. Impersonation previews and cross-member paid actions are blocked.

New Money Masteries phone-number activation is paused until recurring carrier rental settlement and messaging approval are verified. Existing signed communication receipts still retain their member attribution. Use ProsHub’s independently activated and funded phone service.

Property lookup/valuation and social operations have no verified unit-price configuration in this installation and remain paused before incurring provider work. Their server rate records require `verified: true`, a finite `provider_cost_usd`, `pricing_method: multiplier`, a valid `multiplier` and a pricing version, at the appropriate `config/pricingEngine/services/{service}`. Missing provider credentials remain unavailable. These pauses are visible setup requirements; a deployment is not proof that a provider is activated. Independent-agent tool calls and legacy independent-agent/embedded ProsHub AI endpoints lacking verifiable tenant receipts are paused; the main metered Ask Genie and modern proshub.io are separate.

No outbound call, email, WhatsApp message, trade or ad campaign was sent during verification. No member card was charged.

## ProsHub Elite benefit

Code is always **21571**. Offer is ProsHub's existing **$17 every 14 days**, with separately funded ProsHub usage. Money Masteries exposes `mmProsHubEliteCode` to its authenticated members, and `mmProsHubEliteEligibility` to a fresh verified ProsHub Firebase identity. The same verified email must have an active Elite entitlement in Money Masteries. The ProsHub server must verify eligibility at redemption, select its own approved price, and keep its own payment authorization and usage wallet. The browser's code/claimed tier cannot grant access. The user assigned the code-entry UI to their ProsHub chat; that field is not part of this release. See the operator handoff document in work/usage-production.

## Verification

17 focused unit cases cover duplicate/concurrent receipts, cross-member/platform rejection, fractional cents, lost meter responses, unsafe retries, funding gates, speech receipts/replay, SetupIntent ownership/state, one usage subscription, invoice dedup and out-of-order events, and provider callback replay. A real Firestore contention test confirmed one charge under twelve concurrent identical receipts and rejected cross-member reassignment; synthetic records were removed. Nineteen live checks covered authentication, payer spoofing, owned exports, cross-project Elite eligibility, forged webhooks, live zero-charge hosted setup, and denial of activation before authorization. Temporary Authentication/Firestore/Stripe fixtures were removed. Actual member-card collection after a real completed funding authorization has not been charged as a test.

## AI connection repair

The invalid legacy environment credential was replaced for funded AI handlers using the existing verified Railway credential in Secret Manager (never client code or git). Explicit supported Sonnet 4.5/4.6 model prices replace guessed family pricing. Provider message IDs are recorded and claimed individually, including multi-call batches; a changed batch cannot charge the same message twice. An operator-funded live inference verified the connection without charging a member.

## Surplus property and calling workflow - local, awaiting activation

New `surplus-data`, `surplus-calling` and `surplus-exports` modules add per-member property previews, paid lead lists, exact property lookups, named former-owner skip traces, private favorites and human callback-first calling. Each provider action binds the authenticated Real Estate member to a private operation and Money Masteries usage account. Quote holds, actual receipts, replay protection and unknown-outcome review prevent automatic duplicate purchases. ProsHub usage funds and charges are not used. No-result data lookups cost zero. New lead contacts export to CSV for ProsHub import.

Backend data and immediate skip-trace payment functions are deployed. Firebase authentication is restored. The funded Tracerfy account passed real list, property and instant-trace checks; operator QA used 20 credits ($0.40), leaving 980 credits. No member was billed for these tests. Calling remains disabled pending a valid complete Telnyx secret, dedicated routing and controlled call verification.

Skip traces use owner-approved pricing: $1.00 per successful match, $0.10 provider cost, $0.90 markup before processing fees; misses cost $0. Stripe Checkout authorizes the quoted amount before provider work and captures immediately after a verified match. Misses/errors cancel the authorization. Paid immediate receipts never enter monthly usage totals. Member identity, entitlement, customer, operation and provider receipt are checked server-side; retries cannot repeat purchases. The webhook and scheduled reconciliation recover interrupted browser returns.

Install the exact alias in the authoritative Functions package before deploying: `npm install --save-exact stripe-immediate@npm:stripe@23.2.0`. See runtime-dependencies.json. Legacy Stripe SDK consumers remain unchanged. All 44 unit cases pass, along with isolated Firestore concurrency tests and 15 live checkout/identity checks. Live checkout was left unpaid and expired; an actual member-card capture has not been tested. The Surplus UI passes four viewport widths, Spanish, account reset and pending-carrier controls with zero JavaScript errors.

Owner changed outreach scope: Money Masteries telephony is disabled. The dedicated carrier application/profile are inactive; no number was purchased. Surplus workspace links existing members to ProsHub sign-in and new members to separate subscription setup; lead export remains available. ProsHub outreach and usage are separate.


ProsHub direct transfer: `proshub-connection.js` exports the authenticated begin/status/disconnect/transfer callables and the server handshake callback. Approval binds matching verified emails through a ten-minute single-use challenge. The scoped contact-import credential stays in the private server database, never in browser storage or responses. Transfers read only member-owned Real Estate/Surplus records, freeze each batch for retries and preserve current CRM edits/permissions. ProsHub independently rechecks the destination account and membership access. Disconnect revokes the scope. This connection cannot call, message or change billing. Fifteen disposable live checks passed; no real member records, payments or communications were used.
