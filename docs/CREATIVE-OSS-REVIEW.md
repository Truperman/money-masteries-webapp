# Repository review — 2026-11-24

## Video editor: FableCut
Source: https://github.com/ronak-create/FableCut
Reviewed revision: 0a4cb1aeaf35c215f8b2697ccbcc552735851329
License: MIT; retained at assets/vendor/fablecut/LICENSE.

Reviewed source/license/package and server export architecture. Selected only the pure browser editing engine (edit-ops/mask/tracker/motion). Actual editor calls trimToRange; local canvas/MediaRecorder produces the media. The upstream Node filesystem, command execution, FFmpeg and MCP server are not exposed or deployed. This avoids handing member requests access to server files/commands. No upstream dependency package or remote code is loaded at runtime. Imported local media stays in the browser until the member explicitly saves an export. Parent/editor messages check origin, iframe source and a per-instance nonce. All persistent cloud uploads use authenticated owner-scoped routes.

## Zernio reference
Source: https://github.com/zernio-dev/zernio-node
Reviewed revision: a1048b6e5e304a70e727be0a2d9212f9dc413372
License: Apache-2.0. SDK/types inspected as API reference; no package/source copied into the application. Confirmed profileId/externalId, idempotency, scoped usage, connect/ads route, video-ad payload and campaign status API. Calls are server-side and use the existing private Money Masteries account key. Member profiles are created/scoped by the backend; browser-supplied external business/profile IDs are not trusted.

## Platform integration references
- Shopify product CSV: https://help.shopify.com/en/manual/products/import-export/using-csv
- Shopify OAuth: https://shopify.dev/docs/apps/build/authentication-authorization/authenticate-standalone-apps
- Shopify productSet: https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productSet
- Zernio social pricing: https://docs.zernio.com/pricing/social
- Zernio ads pricing: https://docs.zernio.com/pricing/ads
- Zernio multi-tenant publishing: https://docs.zernio.com/multi-tenant/publishing
- Higgsfield API: https://docs.higgsfield.ai/docs

No client-side provider key, owner credentials, stored card or encrypted token is returned in status endpoints. Data lives in the existing private database, whose browser rules deny direct access. Paid entitlement is enforced server-side for every action; site/product/export actions require Elite. Impersonation previews cannot submit paid requests. Provider setup is separate from commercial approval; approval flags default false.
