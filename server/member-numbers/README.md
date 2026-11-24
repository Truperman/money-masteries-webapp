# Permanent member numbers

Money Masteries project: money-masteries-2cc76. Private Standard database: money-masteries-automation. Default-database client profiles are not the numbering authority.

`allocator` transaction reads the member record and global counter, reserves the next integer, creates an immutable index and member record, then advances the counter. Repeated calls return the original assignment. Display uses at least three digits; 1000 remains 1000. Numbers are never released when an account is deleted. Authentication uses the caller's verified UID, ignores body UID, and checks disabled/revoked users. Admin listing/backfill require the verified platform owner UID and email.

Initial backfill: 26 existing Authentication accounts in creation-time order (UID tie-breaker), assigned 001–026. All assignments were reread; no duplicates. Ten simultaneous repeat requests returned the original first number without advancing the counter. Directory exported outside public hosting at outputs/member-number-directory.csv in the task workspace.

Deployment: deployed only mmEnsureMemberNumber, mmAdminMemberNumbers and mmAdminBackfillMemberNumbers from the existing Node 22 automation codebase, using firebase.automation.json. Add `Object.assign(exports, require('./member-numbers').createExports());` after Admin initialization. Existing private database client rules deny all direct access. Do not change them or deploy default Firebase Hosting (unrelated ProsHub site).

Public checkout now exposes only Pro $50/month and Elite $97/month. Retired Basic, old Elite prices and annual membership prices/links are archived/deactivated for new sales. Existing subscriptions and account login access were not canceled or deleted. Complimentary accounts remain administrative access states, not an offered free subscription. Metered services remain separate.
