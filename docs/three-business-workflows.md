# Money Masteries: three business workspaces

Product direction confirmed November 11, 2026. Real Estate Investing targets nationwide U.S. coverage. This is the implementation contract, not a claim that integrations below are active.

## Shared experience

Members choose Real Estate Investing, Ecommerce, or Day Trading. All three Masters remain accessible. The dashboard recommends supporting Tools for the selected business, with a Show all Tools option. Changing focus changes recommendations only, never billing or access rights. Preferences are private to each account; failed account sync must be visible.

Every workspace should guide a member from setup to useful work to review. Show connected, disconnected, sample, requested, and completed states accurately. Completed actions need persisted records, source attribution, and error recovery. Supporting Tools should accept the workspace's context rather than requiring members to reenter it.

## Real Estate Investing

Outcome: build a sourced pipeline of potential deals, analyze assumptions, prepare an offer package, and organize follow-up.

1. Search nationwide by location, property type, price, and supported investment criteria. Disclose coverage, freshness, provider, and unavailable fields. Unsupported filters must not masquerade as real data.
2. Save properties into a private pipeline: New, Researching, Analyzing, Offer prepared, Negotiating, Closed, Archived. Keep source identifiers, timestamps, notes, and duplicates under control.
3. Enrich owner records through a licensed contact provider. Distinguish owner, agent, and unverified contact; show source and confidence. A phone number is not permission to contact its holder.
4. Analyze acquisition cost, repairs, financing, closing and holding costs, resale or rental assumptions, net proceeds, cash flow, and downside/base/upside scenarios. Every result must show inputs and formula assumptions. Missing inputs stay missing; no promised return.
5. Generate editable call scripts, messages, due-diligence checklists, and offer summaries from the selected property and member strategy. Keep unsupported assertions out of drafts.
6. Offer jurisdiction-specific contract templates with state, version, source/license, and review status. A national offer summary is not an execution-ready contract for every state.
7. Optional AI outreach: explicit channel setup, contact eligibility, recipient review, approval scope, opt-out handling, audit history, and pause/cancel. No outreach is active merely because a draft exists.

Current pieces: property search callables, demo separation, deal analyzer, public-record links. Local workspace code contains saved items/imports and draft generation; its deployment and authenticated persistence remain unverified. Owner-phone enrichment and autonomous outreach are not confirmed connected.

Acceptance: an authenticated member searches a supported market, saves a real sourced property, reopens it after signing in again, reproduces the numbers, edits a script, and exports an offer package with its limitations visible. Another member cannot access it. Nationwide coverage must be verified against the chosen provider rather than inferred from the UI.

## Ecommerce

Outcome: take a store concept through product selection, storefront setup, fulfillment, and a test order.

1. Choose a model: dropshipping, print on demand, or owned inventory.
2. Enter brand and audience; prepare product pages, images, policies for review, and storefront structure.
3. Choose a provider with clear coverage, costs, shipping estimates, supported products, and connection status.
4. Connect the member's platform using its supported authorization flow. Shopify CSV export remains labeled export until a live authenticated integration exists.
5. Preview product cost, shipping, selling price, fees, and estimated contribution margin before publishing.
6. Require review before publishing listings; verify product sync, inventory behavior, a test order, fulfillment status, and refunds separately.

Current pieces: storefront/product UI, Shopify CSV export, supplier/POD surfaces and some backend functions. Live Shopify authorization, provider catalog sync, and end-to-end fulfillment are not verified.

Acceptance: a member connects their own store, selects a real supported product, reviews margin assumptions, publishes one approved listing, and completes a scoped test order with reconciled fulfillment status.

## Day Trading

Outcome: establish an account the member controls, define a repeatable strategy, study market conditions, practice, and review performance.

1. Broker onboarding is a member-completed application, with eligibility, affiliate disclosure, and provider approval. An affiliate click is not an opened or funded account.
2. Keep membership/Stripe payments separate from brokerage funds. Visibility controls only hide/reveal data; they do not move funds or make balances public.
3. Indicators: multi-timeframe direction, volume/delta/CVD, VWAP, prior-day levels, support/resistance, and explicitly sourced order-flow data. Label estimates and unavailable DOM/tape features.
4. Strategy builder: define setup, entry, invalidation, position limits, session, and review rules; separate backtests, simulation, and live results.
5. Journal: trades, notes, screenshots, fees, contract specifications, and reproducible P&L. Basic price move times size is not futures P&L without multipliers and fees.
6. Copy trading is opt-in per member, supported broker/account, and provider rules. Enrollment request is distinct from an active connection. Validate simulation, sizing, protective exits, disconnect behavior, and emergency stop before live activation.
7. Independent community feed, with Discord/Telegram/WhatsApp invitations shown only when supplied and valid.

Current pieces: workspace tabs, journal interface, indicator artifacts, feed, requested enrollment, community preferences, Stripe onboarding entry point. Shared copy execution, brokerage balances, affiliate onboarding, and community invitation links are not activated or verified.

Acceptance: a member can record and reopen a journal entry, inspect honest connection status, use supported indicators, and complete an eligible broker's own onboarding. Copy trading stays inactive until separate provider and account tests pass.

## Delivery sequence

1. Shipped foundation: choose a business and show relevant supporting Tools.
2. Real estate first: verify private saved-deal storage, scenario calculations, and sourced imports/search; then scripts and reviewed offer packages.
3. Choose and connect licensed nationwide property/contact data; verify actual coverage and costs before exposing paid enrichment.
4. Connect ecommerce store/provider flows and validate a test order.
5. Connect an eligible trading onboarding/copy provider and validate simulation before member activation.
6. Add approved outreach and agent execution only after durable job records, spend limits, cancellation, consent, and access isolation are proven.
