# Member access administration

`mmAdminAccountAccess` checks the verified Firebase owner UID and email (`reachdavid.work@gmail.com`), account suspension and token revocation before listing accounts or minting a member login. Every switch writes an audit entry in the private database. The member token carries actor attribution, never an administrator role or usage-billing exemption.

The admin member list's **Log in** button opens a separate tab. A named Firebase app keeps that member session in memory, preserving the administrator's normal session. The persistent banner selects another member or returns to admin. Signing out of the owner session also signs the delegated tab out. Tokens are never placed in URLs or browser storage.

Members see **Change password** under My Account. Temporary-password accounts are prompted on login; they may also use the existing password-reset flow. The change endpoint requires a sign-in within five minutes, removes only the temporary-password claim, revokes previous sessions and asks the member to sign in again. Passwords are never logged or written to Firestore.

Deployment: copy `service.js` to the existing automation codebase as `admin-access.js`, export `require('./admin-access').createExports()` after Admin initialization, and deploy only `money-masteries-automation:mmAdminAccountAccess` and `money-masteries-automation:mmChangeMemberPassword`. Preserve complimentary grants in membership lifecycle synchronization. Do not deploy default Firebase Hosting.
