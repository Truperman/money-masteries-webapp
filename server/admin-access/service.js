'use strict';
const { HttpsError } = require('firebase-functions/v2/https');
const OWNER = 'Md5xBlA3DTV2RSAaftUEVzCNteI3';
function createService({ auth, audit, now = Date.now }) {
  async function identity(r) {
    if (!r.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in again.');
    const user = await auth.getUser(r.auth.uid);
    if (user.disabled || (r.auth.token?.auth_time || 0) < Date.parse(user.tokensValidAfterTime || '1970-01-01') / 1000)
      throw new HttpsError('unauthenticated', 'Sign in again.');
    return user;
  }
  async function owner(r) {
    const user = await identity(r);
    if (user.uid !== OWNER || user.email !== 'reachdavid.work@gmail.com' || !user.emailVerified || r.auth.token?.adminActorUid)
      throw new HttpsError('permission-denied', 'Administrator access required.');
    return user;
  }
  return {
    async mmAdminAccountAccess(r) {
      const actor = await owner(r);
      if (r.data?.action === 'list') {
        const page = await auth.listUsers(1000, r.data.pageToken || undefined);
        return { members: page.users.filter(u => !u.disabled).map(u => ({ uid: u.uid, email: u.email || '', name: u.displayName || '' })), pageToken: page.pageToken || null };
      }
      if (r.data?.action !== 'begin' || typeof r.data.uid !== 'string' || !r.data.uid || r.data.uid.length > 128)
        throw new HttpsError('invalid-argument', 'Choose a member account.');
      const target = await auth.getUser(r.data.uid);
      if (target.disabled) throw new HttpsError('failed-precondition', 'This member account is suspended.');
      if (target.uid === OWNER) throw new HttpsError('invalid-argument', 'Return to your administrator account.');
      // No admin role or billing exemption is granted to the member session.
      const token = await auth.createCustomToken(target.uid, { adminActorUid: actor.uid, adminSessionStartedAt: now() });
      await audit({ action: 'admin_member_login', actorUid: actor.uid, targetUid: target.uid, createdAt: now() });
      return { token, email: target.email || '', uid: target.uid };
    },
    async mmChangeMemberPassword(r) {
      const user = await identity(r);
      if (r.auth.token?.adminActorUid) throw new HttpsError('permission-denied', 'Members change their own passwords. Return to admin to manage accounts.');
      if (!Number.isFinite(r.auth.token?.auth_time) || now() / 1000 - r.auth.token.auth_time > 300)
        throw new HttpsError('unauthenticated', 'Sign out and sign in again before changing your password.');
      const password = r.data?.password;
      if (typeof password !== 'string' || password.length < 8 || password.length > 128 || password.toLowerCase() === 'password')
        throw new HttpsError('invalid-argument', 'Choose a new password with at least 8 characters.');
      await auth.updateUser(user.uid, { password });
      const claims = { ...user.customClaims };
      delete claims.mmTemporaryPassword;
      await auth.setCustomUserClaims(user.uid, claims);
      await auth.revokeRefreshTokens(user.uid);
      await audit({ action: 'member_password_changed', targetUid: user.uid, createdAt: now() });
      return { changed: true, signInAgain: true };
    }
  };
}
function createExports() {
  const { getAuth } = require('firebase-admin/auth');
  const { getFirestore } = require('firebase-admin/firestore');
  const { getApp } = require('firebase-admin/app');
  const { onCall } = require('firebase-functions/v2/https');
  const db = getFirestore(getApp(), 'money-masteries-automation');
  const service = createService({ auth: getAuth(), audit: row => db.collection('adminAccessAudit').add(row) });
  return Object.fromEntries(Object.entries(service).map(([name, fn]) => [name, onCall({ region: 'us-central1', invoker: 'public', maxInstances: 3 }, fn)]));
}
module.exports = { createService, createExports, OWNER };
