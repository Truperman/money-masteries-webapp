import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, initializeAuth, inMemoryPersistence, signInWithCustomToken, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js';

const OWNER = 'Md5xBlA3DTV2RSAaftUEVzCNteI3';
let ownerApp;
const ownerCall = async data => (await httpsCallable(getFunctions(ownerApp), 'mmAdminAccountAccess')(data)).data;
function button(text, action) {
  const el = document.createElement('button');
  el.type = 'button'; el.textContent = text; el.className = 'admin-save-btn'; el.onclick = action;
  return el;
}
function openAccount(uid, newTab = true) {
  const url = new URL(location.origin + location.pathname);
  if (uid !== OWNER) url.searchParams.set('adminMember', uid);
  if (newTab) window.open(url.href, '_blank', 'noopener'); else location.assign(url.href);
}
window.mmAdminOpenAccount = uid => { if (window.isMaster) openAccount(uid); };
export async function initializeMemberSession(config) {
  ownerApp = initializeApp(config);
  const target = new URLSearchParams(location.search).get('adminMember');
  if (!target) return ownerApp;
  try {
    const ownerAuth = getAuth(ownerApp);
    await ownerAuth.authStateReady();
    if (!ownerAuth.currentUser) throw new Error('Sign in to your administrator account first.');
    const result = await ownerCall({ action: 'begin', uid: target });
    const memberApp = initializeApp(config, 'mm-admin-member');
    const memberAuth = initializeAuth(memberApp, { persistence: inMemoryPersistence });
    await signInWithCustomToken(memberAuth, result.token);
    window.mmAdminMemberSession = true;
    const bar = document.createElement('div');
    bar.id = 'mmAdminSessionBar';
    bar.style.cssText = 'position:fixed;bottom:12px;left:12px;right:12px;z-index:100001;padding:12px;background:#17233a;color:#fff;border:2px solid #fbbf24;border-radius:12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;box-shadow:0 3px 20px #0008';
    const label = document.createElement('strong'); label.textContent = 'Admin session: ' + result.email;
    const selector = document.createElement('select'); selector.setAttribute('aria-label', 'Switch member account'); selector.style.cssText = 'max-width:100%;padding:8px;background:#0c1628;color:white;border:1px solid #69758b;border-radius:6px';
    bar.append(label, selector, button('Switch account', () => openAccount(selector.value, false)), button('Return to admin', async () => { await signOut(memberAuth); openAccount(OWNER, false); }));
    document.body.append(bar);
    let pageToken;
    do {
      const page = await ownerCall({ action: 'list', pageToken });
      for (const member of page.members) {
        const option = document.createElement('option'); option.value = member.uid;
        option.textContent = member.email || member.name || member.uid; option.selected = member.uid === target; selector.append(option);
      }
      pageToken = page.pageToken;
    } while (pageToken);
    // Logging out of the owner's session also closes this delegated session.
    ownerAuth.onAuthStateChanged(user => { if (!user || user.uid !== OWNER) signOut(memberAuth).finally(() => location.assign(location.pathname)); });
    return memberApp;
  } catch (error) {
    const panel = document.createElement('div'); panel.style.cssText = 'position:fixed;inset:0;z-index:100002;background:#0c1628;color:#fff;padding:60px;font:18px sans-serif';
    panel.textContent = error.message || 'Could not open this member account.';
    panel.append(document.createElement('br'), button('Return to admin', () => openAccount(OWNER, false)));
    document.body.append(panel); throw error;
  }
}

export function installPasswordControls(auth) {
  if (window.mmAdminMemberSession) return;
  const account = document.querySelector('#screen-account .account-card');
  if (account) account.append(button('Change password', () => showPasswordDialog(auth)));
  auth.onAuthStateChanged(async user => {
    if (!user || window.mmAdminMemberSession) return;
    const token = await user.getIdTokenResult();
    if (token.claims.mmTemporaryPassword) showPasswordDialog(auth, true);
  });
}
function showPasswordDialog(auth, temporary = false) {
  if (document.getElementById('mmPasswordDialog')) return;
  const dialog = document.createElement('dialog'); dialog.id = 'mmPasswordDialog';
  dialog.style.cssText = 'max-width:420px;width:calc(100% - 32px);box-sizing:border-box;background:#102039;color:white;border:1px solid #5c7598;border-radius:16px;padding:24px';
  const title = document.createElement('h2'); title.textContent = temporary ? 'Choose your own password' : 'Change password';
  const text = document.createElement('p'); text.textContent = temporary ? 'You signed in with a temporary password. Set a private password for your account.' : 'Choose a new password with at least 8 characters.';
  const form = document.createElement('form');
  for (const [name, labelText] of [['password', 'New password'], ['confirm', 'Confirm new password']]) {
    const label = document.createElement('label'); label.textContent = labelText;
    const input = document.createElement('input'); input.type = 'password'; input.name = name; input.required = true; input.minLength = 8; input.maxLength = 128; input.autocomplete = 'new-password'; input.style.cssText = 'display:block;box-sizing:border-box;width:100%;padding:12px;margin:6px 0 16px;border-radius:6px';
    label.append(input); form.append(label);
  }
  const status = document.createElement('p'); status.setAttribute('role', 'status');
  const save = document.createElement('button'); save.type = 'submit'; save.textContent = 'Save password'; save.className = 'admin-save-btn';
  form.append(save, button('Later', () => { dialog.close(); dialog.remove(); }), status);
  form.onsubmit = async event => {
    event.preventDefault();
    if (form.elements.password.value !== form.elements.confirm.value) { status.textContent = 'The passwords do not match.'; return; }
    save.disabled = true; status.textContent = 'Saving…';
    try {
      await window.mmCall('mmChangeMemberPassword', { password: form.elements.password.value });
      form.reset(); await signOut(auth); dialog.close(); dialog.remove();
      if (typeof window.showNotifToast === 'function') window.showNotifToast('Password changed', 'Sign in with your new password.');
    } catch (error) { status.textContent = error.message || 'Could not change password.'; save.disabled = false; }
  };
  dialog.append(title, text, form); document.body.append(dialog); dialog.showModal();
}
