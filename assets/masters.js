/* Accessible navigation, a guided Masters workspace, and authenticated admin tools. */
(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const money = (cents) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format((Number(cents) || 0) / 100);
  const MASTERS = [
    {
      id: "businessautomation",
      name: "Business Automation",
      category: "OPERATE",
      icon: "◈",
      color: "#edd7a5",
      tag: "+$25 / month",
      text: "Give your agent team a goal. Review the plan, set a budget, and track the work.",
      outcome: "Your business, moving forward",
    },
    {
      id: "universitymaster",
      name: "University Master",
      category: "LEARN",
      icon: "↗",
      color: "#b4cbff",
      tag: "Start here",
      text: "Build a practical skill, then turn what you learn into an offer people can buy.",
      outcome: "Skills into a sellable service",
    },
    {
      id: "mystoremaster",
      name: "My Store Master",
      category: "SELL",
      icon: "▣",
      color: "#f5cb8f",
      tag: "E-commerce",
      text: "Create your storefront, organize products, and share a clear path to checkout.",
      outcome: "A storefront ready to share",
    },
    {
      id: "creativemaster",
      name: "Creative Master",
      category: "CREATE",
      icon: "✳",
      color: "#cbb2ef",
      tag: "Content & video",
      text: "Turn your offer into images, product stories, and videos that explain its value.",
      outcome: "Content for your next launch",
    },
    {
      id: "proshubmaster",
      name: "ProsHub Master",
      category: "GROW",
      icon: "⌘",
      color: "#e5c67e",
      tag: "CRM & outreach",
      text: "Organize your leads, follow up thoughtfully, and keep customer conversations in one place.",
      outcome: "A clearer customer pipeline",
    },
    {
      id: "communitymaster",
      name: "Community Master",
      category: "CONNECT",
      icon: "◎",
      color: "#e5b3c3",
      tag: "Community",
      text: "Learn with other members, join events, and build an audience around your work.",
      outcome: "Relationships that compound",
    },
    {
      id: "reimaster",
      name: "Real Estate Master",
      category: "RESEARCH",
      icon: "▥",
      color: "#d5ce9a",
      tag: "Property tools",
      text: "Research opportunities, organize leads, and evaluate potential property deals.",
      outcome: "Better-informed opportunities",
    },
    {
      id: "marketsmaster",
      name: "Markets Master",
      category: "ANALYZE",
      icon: "⌁",
      color: "#9ebee9",
      tag: "Trading & research",
      text: "Study markets and practice your process. Trading involves risk; returns are never guaranteed.",
      outcome: "Research before decisions",
    },
    {
      id: "saasmaster",
      name: "SaaS Master",
      category: "BUILD",
      icon: "⟨/⟩",
      color: "#d4b3e9",
      tag: "Website services",
      text: "Build a website offering and package it into a useful service for a real customer.",
      outcome: "A service you can demonstrate",
    },
    {
      id: "geniemaster",
      name: "Genie Agent Master",
      category: "ASSIST",
      icon: "✦",
      color: "#f3bb8d",
      tag: "AI agency",
      text: "Explore the agent portal and develop AI services that solve a specific customer problem.",
      outcome: "Useful agents for real needs",
    },
  ];
  let authEpoch = 0;
  let state = null,
    stateUid = null,
    loadingState = null,
    selectedTemplate = null,
    accounts = [],
    workspaceTarget = null;
  const api = async (name, data = {}) => {
    if (typeof window.mmCall !== "function")
      throw new Error(
        "Your account connection is not ready. Sign in and try again.",
      );
    return window.mmCall(name, data);
  };
  function notify(message) {
    let el = $("#mmNotice");
    if (!el) {
      el = document.createElement("div");
      el.id = "mmNotice";
      el.className = "mm-live-notice";
      el.setAttribute("role", "status");
      document.body.append(el);
    }
    el.textContent = message;
    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "mm-toast-close";
    dismiss.textContent = "×";
    dismiss.setAttribute("aria-label", "Dismiss notification");
    dismiss.onclick = () => { el.hidden = true; };
    el.append(dismiss);
    el.hidden = false;
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => {
      el.hidden = true;
    }, 6000);
  }
  function status(id, message, error = false) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = message;
      el.classList.toggle("error", error);
    }
  }
  function id() {
    return crypto.randomUUID();
  }
  function navigate(route) {
    if (route === "saasmaster") {
      window.mmOpenSiteClone?.();
      return;
    }
    if (route === "geniemaster") {
      window.open(
        "https://genie.moneymasteries.com",
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    window.showScreen?.(route);
  }
  function enhanceControls(root = document) {
    root
      .querySelectorAll(".nav-item,.bank-tab,.dash-tab,.auth-tab,.qa-tile,.genie-fab-quick-btn,.nud-item,.nav-brand,.site-lang-btn")
      .forEach((el) => {
        if (el.tagName === "BUTTON" || el.tagName === "A") return;
        el.tabIndex = 0;
        el.setAttribute(
          "role",
          el.classList.contains("bank-tab") || el.classList.contains("dash-tab")
            ? "tab"
            : "button",
        );
        if (el.getAttribute("role") === "tab")
          el.setAttribute(
            "aria-selected",
            String(el.classList.contains("active")),
          );
      });
    root
      .querySelectorAll(".bank-tabs,.dash-tabs")
      .forEach((el) => el.setAttribute("role", "tablist"));
  }
  function home() {
    const area = $("#dpanel-discover");
    if (!area) return;
    const section = document.createElement("div");
    section.id = "mmHome";
    section.className = "mm-home";
    section.innerHTML = `<div class="mm-page-head"><div><div class="mm-eyebrow">YOUR BUSINESS WORKSPACE</div><p id="mmWelcome">Good to see you. Let’s make your next move count.</p></div><span class="mm-tag">Learn · Build · Grow</span></div>
      <section class="mm-hero"><div><div class="mm-eyebrow">SMALL STEPS. REAL PROGRESS.</div><h1>Build something<br>that <span>earns.</span></h1><p>Your ideas deserve a working plan. Use your Masters to learn a skill, create an offer, and build a business—one useful step at a time.</p><div class="mm-actions"><button class="mm-btn primary" data-mm-action="navigate" data-route="businessautomation">Meet your agent team <span>↗</span></button><button class="mm-btn" data-mm-action="explore">Explore the Masters ↓</button></div></div><div class="mm-scene" aria-hidden="true"><div class="mm-scene-stack"><div class="mm-slab">M<span style="font-size:25px;align-self:center">↗</span></div><div class="mm-slab"></div><div class="mm-slab"></div></div><div class="mm-orbit-label a"><i></i>Ideas → action</div><div class="mm-orbit-label b">A team behind your next move</div></div></section>
      <div class="mm-overview"><article><small>Your membership</small><strong id="mmPlan">—</strong><span>Tools for your next stage</span></article><article><small>Recorded earnings</small><strong id="mmEarned">$0.00</strong><span>From your account history</span></article><article><small>Your next move</small><strong>One clear goal</strong><span>Start small. Measure the result.</span></article></div>
      <div class="mm-section-head"><div><h2>From idea to your first offer</h2><p>A practical path through the tools.</p></div></div><div class="mm-path"><button data-mm-action="navigate" data-route="universitymaster"><span class="step">01 / LEARN</span><strong>Choose a useful skill</strong><small>Start with University Master →</small></button><button data-mm-action="navigate" data-route="creativemaster"><span class="step">02 / CREATE</span><strong>Make your offer tangible</strong><small>Build with Creative Master →</small></button><button data-mm-action="navigate" data-route="mystoremaster"><span class="step">03 / LAUNCH</span><strong>Give customers a next step</strong><small>Open My Store Master →</small></button><button data-mm-action="navigate" data-route="businessautomation"><span class="step">04 / GROW</span><strong>Build a repeatable process</strong><small>Plan with Business Automation →</small></button></div>
      <div class="mm-section-head" id="mmMastersHeading"><div><h2>Your Masters</h2><p>The right tool for what you’re building.</p></div><label><span class="sr-only" style="position:absolute;clip:rect(0,0,0,0)">Find a Master</span><input class="mm-search" id="mmMasterSearch" placeholder="Find a Master…" type="search"></label></div><div class="mm-master-grid">${MASTERS.map((m) => `<button class="mm-master-card" data-mm-action="navigate" data-route="${m.id}" data-search="${esc((m.name + " " + m.text).toLowerCase())}" style="--icon-color:${m.color}"><span class="mm-card-top"><span class="mm-master-icon" aria-hidden="true">${m.icon}</span><span class="mm-tag ${m.id === "businessautomation" ? "featured" : ""}">${m.tag}</span></span><h3>${m.name}</h3><p>${m.text}</p><span class="mm-card-bottom"><span>${m.category}</span><span aria-hidden="true">↗</span></span></button>`).join("")}</div><p id="mmNoMasters" class="mm-muted" hidden>No Masters match your search.</p>`;
    area.prepend(section);
    $("#mmMasterSearch").addEventListener("input", (e) => {
      let visible = 0;
      section.querySelectorAll(".mm-master-card").forEach((card) => {
        card.hidden = !card.dataset.search.includes(
          e.target.value.toLowerCase().trim(),
        );
        if (!card.hidden) visible++;
      });
      $("#mmNoMasters").hidden = visible > 0;
    });
  }
  function automationScreen() {
    const main = $("#appLayout>.main");
    const screen = document.createElement("section");
    screen.id = "screen-businessautomation";
    screen.className = "screen mm-page";
    screen.dataset.sbg = "businessautomation";
    screen.innerHTML = `<header class="mm-page-head"><div><div class="mm-eyebrow">YOUR NEXT MASTER</div><h1>Business Automation</h1><p>A goal. A focused agent team. Work you can review.</p></div><span class="mm-tag featured">Powered by Paperclip</span></header><div id="mmAutomationContent"><div class="mm-panel"><p>Connect your account to see your workspace.</p><button class="mm-btn" data-mm-action="refresh-automation">Check access</button></div></div><p class="mm-status" id="mmAutomationStatus" role="status"></p>`;
    main.append(screen);
    const nav = document.createElement("button");
    nav.id = "nav-businessautomation";
    nav.type = "button";
    nav.className = "nav-item master-tool-item";
    nav.dataset.mmAction = "navigate";
    nav.dataset.route = "businessautomation";
    nav.style.width = "100%";
    nav.style.textAlign = "left";
    nav.innerHTML =
      '<span class="nav-item-icon">◈</span><span class="nav-item-textcol"><span>Business Automation</span><span class="nav-item-niche">Agent teams · $25/month + usage</span></span>';
    $("#toolsDropdown").prepend(nav);
  }
  async function refreshState() {
    const uid = window.currentUser?.uid;
    if (!uid) {
      state = null;
      stateUid = null;
      updateAdminVisibility();
      return null;
    }
    if (stateUid !== uid) {
      state = null;
      stateUid = uid;
    }
    if (loadingState) return loadingState;
    const expected = uid;
    const pending = api("mmAutomationGetState")
      .then((result) => {
        if (window.currentUser?.uid !== expected) return null;
        state = result;
        updateAdminVisibility();
        return result;
      })
      .finally(() => {
        if (loadingState === pending) loadingState = null;
      });
    loadingState = pending;
    return pending;
  }
  function updateAdminVisibility() {
    const allowed =
      state?.admin === true && stateUid === window.currentUser?.uid;
    document.querySelectorAll(".mm-admin-only").forEach((el) => {
      el.hidden = !allowed;
    });
  }
  function drawAutomation() {
    const wrap = $("#mmAutomationContent");
    if (!state) {
      wrap.innerHTML =
        '<div class="mm-panel"><h2>Sign in to your workspace</h2><p>Membership and add-on access are checked securely when you sign in.</p></div>';
      return;
    }
    if (!state.entitled) {
      wrap.innerHTML = `<div class="mm-hero"><div><div class="mm-eyebrow">A BUSINESS TEAM, ON YOUR TERMS</div><h1>Make room<br>for <span>growth.</span></h1><p>Set a business goal, assign work to agents, and approve the next step. Your subscription unlocks the workspace; agent usage is billed separately.</p><div class="mm-actions"><button class="mm-btn primary" data-mm-action="${state.isPaying ? "checkout" : "navigate"}" ${state.isPaying ? "" : 'data-route="plans"'}>${state.isPaying ? "Add Business Automation — $25/month" : "Choose a paid membership"} ↗</button></div></div><div><h2 style="font-size:58px;margin:0;color:#e7bf70">$25<span style="font-size:16px;color:#d1cab8"> / month</span></h2><p>Added to your paid Money Masteries membership.</p><ul style="color:#d7d0c0;padding-left:18px;font-size:13px"><li>Your own business workspace</li><li>Goals, tasks, and agent progress</li><li>Review work before taking action</li><li>A monthly usage budget you control</li></ul></div></div><div class="mm-callout">Usage is charged separately at ${esc(state.usageLabel || "the published provider rate")}. Review the rate and set a budget before starting agents. Free and complimentary memberships do not include this add-on.</div>${state.isPaying ? '<label class="mm-checkbox mm-muted" style="display:flex;gap:10px;font-size:13px"><input type="checkbox" id="mmBillingConsent"> I agree to the $25 recurring monthly add-on and separate usage charges. I can manage or cancel the add-on in billing.</label>' : ""}`;
      return;
    }
    wrap.innerHTML = `<div class="mm-overview"><article><small>Workspace</small><strong>${state.admin ? "Platform admin" : "Active"}</strong><span>${state.connected ? "Paperclip connected" : "Connection setup needed"}</span></article><article><small>Usage this month</small><strong>${money(state.usageCents)}</strong><span>${esc(state.usageLabel || "Provider cost")}</span></article><article><small>Monthly usage budget</small><strong>${money(state.budgetCents)}</strong><span>Separate from the monthly add-on</span></article></div>
      ${!state.connected ? '<div class="mm-callout">Your workspace is waiting for its Paperclip connection. You can save goals now; agents can run once the workspace is connected.</div>' : ""}
      <div class="mm-panel"><div class="mm-section-head" style="margin-top:0"><div><h2>What should your team work toward?</h2><p>Describe a useful result. Start with one focused goal.</p></div></div><form id="mmGoalForm" class="mm-form"><label class="full">Goal title<input name="title" required maxlength="140" placeholder="Build a repeatable lead follow-up process"></label><label class="full">Success looks like<textarea name="description" required maxlength="4000" placeholder="What business do you run, who do you serve, and what would a useful outcome be?"></textarea></label><label>Focus<select name="category"><option value="growth">Business growth</option><option value="marketing">Marketing & content</option><option value="operations">Operations</option><option value="research">Customer research</option>${state.admin ? '<option value="platform">Platform improvement</option>' : ""}</select></label><div class="mm-actions" style="align-self:end"><button class="mm-btn primary" type="submit">Save goal & review plan ↗</button></div></form></div>
      <div class="mm-panel"><div class="mm-section-head" style="margin-top:0"><div><h2>Goals & agent work</h2><p>Saved goals stay in draft until you choose Approve & run.</p></div><button class="mm-btn small" data-mm-action="load-work">Refresh</button></div><div id="mmWorkList" class="mm-empty">Loading your workspace…</div></div>
      <div class="mm-panel"><h2>Spending & billing</h2><p>New work pauses at your usage limit. Already-running work can finish and add cost; review the live usage total before increasing your budget.</p><form id="mmBudgetForm" class="mm-form"><label>Monthly usage budget (USD)<input name="budget" type="number" min="0" max="10000" step="1" value="${Math.round((state.budgetCents || 0) / 100)}" required></label><div class="mm-actions" style="align-self:end"><button class="mm-btn" type="submit">Save budget</button>${!state.admin ? '<button class="mm-btn" type="button" data-mm-action="billing-portal">Manage subscription</button>' : ""}</div></form></div>`;
    $("#mmGoalForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const b = e.submitter;
      b.disabled = true;
      try {
        const f = new FormData(e.currentTarget);
        await api("mmAutomationCreateGoal", {
          title: f.get("title"),
          description: f.get("description"),
          category: f.get("category"),
          requestId: id(),
          ...(workspaceTarget ? { targetUid: workspaceTarget } : {}),
        });
        e.target.reset();
        notify("Goal saved. Review the plan before starting agents.");
        await loadWork();
      } catch (err) {
        status("mmAutomationStatus", err.message, true);
      } finally {
        b.disabled = false;
      }
    });
    $("#mmBudgetForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.submitter.disabled = true;
      try {
        const budget = Number(new FormData(e.target).get("budget"));
        await api("mmAutomationSetBudget", {
          monthlyBudgetCents: Math.round(budget * 100),
          ...(workspaceTarget ? { targetUid: workspaceTarget } : {}),
        });
        notify("Usage budget saved.");
        await refreshState();
      } catch (err) {
        status("mmAutomationStatus", err.message, true);
      } finally {
        e.submitter.disabled = false;
      }
    });
    loadWork();
  }
  async function showAutomation() {
    try {
      status("mmAutomationStatus", "Checking membership and workspace…");
      await refreshState();
      drawAutomation();
      status("mmAutomationStatus", "");
    } catch (e) {
      status("mmAutomationStatus", e.message, true);
    }
  }
  async function loadWork() {
    const epoch = authEpoch;
    const el = $("#mmWorkList");
    if (!el) return;
    try {
      const result = await api(
        "mmAutomationListWork",
        workspaceTarget ? { targetUid: workspaceTarget } : {},
      );
      if (epoch !== authEpoch || !el.isConnected) return;
      el.className = "";
      el.innerHTML = result.goals?.length
        ? result.goals
            .map(
              (goal) =>
                `<article class="mm-task"><div><span class="mm-tag">${esc(goal.status || "draft")}</span><strong style="display:block;margin-top:8px">${esc(goal.title)}</strong><p>${esc(goal.description)}</p>${goal.plan ? `<p><b>Proposed work:</b> ${esc(goal.plan)}</p>` : ""}${goal.error ? `<p>${esc(goal.error)}</p>` : ""}</div><div class="mm-actions">${goal.status === "draft" || goal.status === "failed" ? `<button class="mm-btn small primary" data-mm-action="run-goal" data-id="${esc(goal.id)}" ${state?.connected ? "" : "disabled"}>Approve & run</button>` : ""}${goal.issueUrl ? `<span class="mm-tag">Task ${esc(goal.issueIdentifier || "created")}</span>` : ""}</div></article>`,
            )
            .join("")
        : '<div class="mm-empty">Your first goal starts here. Save a goal above to create a plan for your team.</div>';
      if (result.tasks?.length)
        el.innerHTML +=
          '<h3 style="margin-top:22px">Paperclip tasks</h3>' +
          result.tasks
            .map(
              (t) =>
                `<article class="mm-task"><div><strong>${esc(t.title)}</strong><p>${esc(t.description || "")}</p></div><span class="mm-tag">${esc(t.status)}</span></article>`,
            )
            .join("");
    } catch (e) {
      el.textContent = e.message;
      el.className = "mm-empty";
    }
  }
  function adminPanels() {
    const admin = $("#screen-admin");
    const tabs = $(":scope>.bank-tabs", admin);
    if (!tabs) return;
    for (const [key, label] of [
      ["growth", "Video email studio"],
      ["automation", "Accounts & automation"],
    ]) {
      const button = document.createElement("button");
      button.id = "admtab-" + key;
      button.className = "bank-tab mm-admin-only";
      button.hidden = true;
      button.dataset.mmAction = "admin-tab";
      button.dataset.tab = key;
      button.textContent = label;
      tabs.append(button);
      const panel = document.createElement("div");
      panel.id = "admpanel-" + key;
      panel.className = "bank-panel mm-admin-only mm-page";
      panel.hidden = true;
      admin.append(panel);
    }
  }
  async function emailStudio() {
    const epoch = authEpoch;
    const el = $("#admpanel-growth");
    if (state?.admin !== true) {
      el.replaceChildren();
      return;
    }
    el.innerHTML = '<div class="mm-panel">Loading admin templates…</div>';
    try {
      const r = await api("mmAdminEmailTemplates");
      if (epoch !== authEpoch || !state?.admin) return;
      const templates = r.templates;
      el.innerHTML = `<div class="mm-page-head"><div><div class="mm-eyebrow">ADMIN / MEMBERSHIP GROWTH</div><h1>Video email studio</h1><p>A clear offer. A short video. One next step.</p></div><span class="mm-tag">Admin only</span></div><div class="mm-template-list">${templates.map((t, i) => `<button class="mm-btn small" data-mm-action="email-template" data-template="${i}">${esc(t.name)}</button>`).join("")}</div><div class="mm-email-layout"><div class="mm-panel" style="margin:0"><form id="mmEmailForm" class="mm-form"><label class="full">Subject<input name="subject" id="mmEmailSubject" maxlength="160" required></label><label class="full">Preheader<input name="preheader" id="mmEmailPreheader" maxlength="200"></label><label class="full">Headline<input name="headline" id="mmEmailHeadline" maxlength="140" required></label><label class="full">Message<textarea name="body" id="mmEmailBody" maxlength="6000" required></textarea></label><label class="full">Video URL<input name="videoUrl" type="url" placeholder="https://…" required></label><label class="full">Video thumbnail URL<input name="thumbnailUrl" type="url" placeholder="https://…/thumbnail.jpg" required></label><label>Button text<input name="ctaLabel" id="mmEmailCta" maxlength="50" required></label><label>Membership page<input name="ctaUrl" type="url" value="https://www.moneymasteries.com/" required></label><label class="full">Sender / business postal address<input name="postalAddress" maxlength="300" required placeholder="Your business mailing address"></label><label class="full">Unsubscribe URL or email-platform merge tag<input name="unsubscribeUrl" required placeholder="https://… or {{unsubscribe_url}}"></label><div class="full mm-actions"><button type="submit" class="mm-btn primary">Preview video email</button><button type="button" class="mm-btn" data-mm-action="save-email">Save template</button><button type="button" class="mm-btn" data-mm-action="download-email" id="mmDownloadEmail" disabled>Download HTML</button></div></form><p class="mm-status" id="mmEmailStatus" role="status"></p></div><div><iframe id="mmEmailPreview" class="mm-email-preview" sandbox="" title="Email preview"></iframe><p class="mm-muted" style="font-size:11px">The video thumbnail opens your hosted video. This format works in email clients that do not play embedded video. Export to your email platform to send to your opted-in audience.</p></div></div>`;
      el._templates = templates;
      selectTemplate(0);
      $("#mmEmailForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        await previewEmail();
      });
    } catch (e) {
      el.textContent = e.message;
    }
  }
  function selectTemplate(index) {
    selectedTemplate = $("#admpanel-growth")._templates[index];
    if (!selectedTemplate) return;
    for (const [field, selector] of Object.entries({
      subject: "#mmEmailSubject",
      preheader: "#mmEmailPreheader",
      headline: "#mmEmailHeadline",
      body: "#mmEmailBody",
      ctaLabel: "#mmEmailCta",
    }))
      $(selector).value = selectedTemplate[field] || "";
    for (const field of [
      "videoUrl",
      "thumbnailUrl",
      "ctaUrl",
      "postalAddress",
      "unsubscribeUrl",
    ]) {
      const input = $("#mmEmailForm [name=" + field + "]");
      if (selectedTemplate[field]) input.value = selectedTemplate[field];
    }
    $("#mmEmailPreview").srcdoc =
      '<div style="font:15px/1.6 system-ui;padding:35px;color:#2d2a23"><h2>' +
      esc(selectedTemplate.name) +
      "</h2><p>" +
      esc(selectedTemplate.body) +
      "</p><p>Add your video, thumbnail, and sender details, then preview your email.</p></div>";
    $("#mmDownloadEmail").disabled = true;
  }
  function emailFields() {
    return Object.fromEntries(new FormData($("#mmEmailForm")).entries());
  }
  async function previewEmail() {
    const epoch = authEpoch;
    if (!$("#mmEmailForm").reportValidity()) return;
    try {
      status("mmEmailStatus", "Rendering…");
      const r = await api("mmAdminRenderEmail", emailFields());
      if (epoch !== authEpoch || !state?.admin) return;
      $("#mmEmailPreview").srcdoc = r.html;
      $("#mmEmailPreview")._html = r.html;
      $("#mmDownloadEmail").disabled = false;
      status("mmEmailStatus", "Preview ready. No emails have been sent.");
    } catch (e) {
      status("mmEmailStatus", e.message, true);
    }
  }
  async function adminAccounts() {
    const epoch = authEpoch;
    const el = $("#admpanel-automation");
    if (state?.admin !== true) {
      el.replaceChildren();
      return;
    }
    el.innerHTML = `<div class="mm-page-head"><div><div class="mm-eyebrow">ADMIN / CONTROL CENTER</div><h1>Accounts & automation</h1><p>Manage membership access and the agent workspace for your platform.</p></div><button class="mm-btn primary" data-mm-action="platform-workspace">Open platform workspace ↗</button></div><div class="mm-panel"><h2>Member accounts</h2><p>Complimentary memberships never grant Business Automation. Paid add-on access is checked separately.</p><label>Find an account <input class="mm-search" id="mmAccountSearch" type="search" placeholder="Email or name"></label><div class="mm-admin-table-wrap"><table class="mm-admin-table"><thead><tr><th>Member</th><th>Membership</th><th>Automation</th><th>Account</th><th>Manage</th></tr></thead><tbody id="mmAccountRows"></tbody></table></div><button class="mm-btn small" data-mm-action="more-accounts" id="mmMoreAccounts" hidden>Load more accounts</button></div><div class="mm-panel"><h2>Paperclip workspace setup</h2><p>Create an isolated company for a member or the platform, then connect its lead agent. Paperclip credentials stay on the server.</p><form id="mmWorkspaceForm" class="mm-form"><label>Member UID (blank = platform)<input name="targetUid" maxlength="128"></label><label>Company name<input name="companyName" maxlength="120" placeholder="Money Masteries growth team" required></label><label class="full">Lead agent ID (optional for initial setup)<input name="agentId" maxlength="80" placeholder="Set after hiring agents in Paperclip"></label><div class="full"><button class="mm-btn" type="submit">Create or connect workspace</button></div></form></div><p id="mmAdminStatus" class="mm-status" role="status"></p>`;
    accounts = [];
    await loadAccounts();
    if (epoch !== authEpoch || !state?.admin) return;
    $("#mmAccountSearch").addEventListener("input", drawAccounts);
    $("#mmWorkspaceForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      e.submitter.disabled = true;
      try {
        const fields = Object.fromEntries(new FormData(e.target));
        await api("mmAdminProvisionWorkspace", fields);
        status(
          "mmAdminStatus",
          "Workspace connected. Add a goal and review it before starting work.",
        );
        await refreshState();
      } catch (err) {
        status("mmAdminStatus", err.message, true);
      } finally {
        e.submitter.disabled = false;
      }
    });
  }
  let accountCursor;
  async function loadAccounts(more = false) {
    const epoch = authEpoch;
    try {
      const r = await api(
        "mmAdminListAccounts",
        more && accountCursor ? { cursor: accountCursor } : {},
      );
      if (epoch !== authEpoch || !state?.admin) return;
      accounts = more ? accounts.concat(r.accounts) : r.accounts;
      accountCursor = r.cursor;
      $("#mmMoreAccounts").hidden = !accountCursor;
      drawAccounts();
    } catch (e) {
      status("mmAdminStatus", e.message, true);
    }
  }
  function drawAccounts() {
    const term = ($("#mmAccountSearch")?.value || "").toLowerCase();
    $("#mmAccountRows").innerHTML = accounts
      .filter((a) => (a.email + " " + a.name).toLowerCase().includes(term))
      .map(
        (a) =>
          `<tr><td><strong>${esc(a.name || "Member")}</strong><br>${esc(a.email)}</td><td>${esc(a.plan)}${a.complimentary ? " · complimentary" : ""}</td><td>${a.automation ? "Active" : "Locked"}</td><td>${a.disabled ? "Disabled" : "Enabled"}</td><td><button class="mm-btn small" data-mm-action="account-edit" data-id="${esc(a.uid)}">Manage</button></td></tr>`,
      )
      .join("");
  }
  function editAccount(uid) {
    const account = accounts.find((a) => a.uid === uid);
    if (!account) return;
    let dialog = $("#mmAccountDialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "mmAccountDialog";
      dialog.className = "mm-page mm-panel";
      dialog.style.cssText =
        "max-width:min(560px,calc(100vw - 28px));width:100%;color:#f2f0eb;position:fixed;";
      document.body.append(dialog);
    }
    dialog.innerHTML = `<h2>Manage ${esc(account.name || account.email)}</h2><p>${esc(account.email)}</p><form id="mmAccountForm" class="mm-form"><label class="full">Display name<input name="displayName" value="${esc(account.name)}" required maxlength="120"></label><label>Complimentary membership<select name="complimentaryPlan"><option value="">Keep current access</option value="free">Free</option><option value="pro">Complimentary Pro</option><option value="elite">Complimentary Elite</option></select></label><label>Account status<select name="disabled"><option value="false" ${account.disabled ? "" : "selected"}>Enabled</option><option value="true" ${account.disabled ? "selected" : ""}>Disabled</option></select></label><p class="full mm-muted">Business Automation remains a separate paid entitlement. Disabling an account revokes its sessions; subscription cancellation is managed in billing.</p><div class="full mm-actions"><button class="mm-btn primary" type="submit">Save account</button><button class="mm-btn" type="button" data-mm-action="close-account">Cancel</button></div><p class="mm-status full" id="mmAccountStatus"></p></form>`;
    dialog.showModal();
    $("#mmAccountForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      e.submitter.disabled = true;
      try {
        const values = Object.fromEntries(new FormData(e.target));
        await api("mmAdminUpdateAccount", {
          uid,
          displayName: values.displayName,
          disabled: values.disabled === "true",
          complimentaryPlan: values.complimentaryPlan,
        });
        dialog.close();
        await loadAccounts();
        notify("Account updated.");
      } catch (err) {
        status("mmAccountStatus", err.message, true);
      } finally {
        e.submitter.disabled = false;
      }
    });
  }
  function navigation() {
    const nav = $("#mainNav");
    const actions = document.createElement("details");
    actions.className = "mm-header-actions";
    actions.innerHTML =
      '<summary>Quick actions <span aria-hidden="true">⌄</span></summary><div class="mm-header-actions-panel"></div>';
    nav.insertBefore(actions, $(".nav-right", nav));
    nav.insertBefore($("#genieFab"), actions);
    const actionPanel = $(".mm-header-actions-panel", actions);
    [
      ".nav-center-actions",
      "#mmTryNewBtn",
      "#mmHelpMeBtn",
      "#themeToggleBtn",
      ".site-lang",
    ].forEach((selector) => {
      const el = $(selector, nav);
      if (el) actionPanel.append(el);
    });
    $("#themeToggleBtn")?.append(document.createTextNode(" Appearance"));
    for (const [containerSelector, menuId, label] of [
      ["#navUser", "navUserDropdown", "Account menu"],
      [".notif-bell-wrap", "notifDropdown", "Notifications"],
    ]) {
      const container = $(containerSelector, nav), menu = $("#" + menuId);
      if (!container || !menu) continue;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mm-header-toggle";
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-controls", menuId);
      button.setAttribute("aria-expanded", "false");
      const handler = container.onclick;
      container.removeAttribute("onclick");
      [...container.children].filter((child) => child !== menu).forEach((child) => button.append(child));
      container.prepend(button);
      button.onclick = (event) => {
        actions.open = false;
        nav.querySelectorAll(".nav-user-dropdown,.notif-dropdown").forEach((other) => {
          if (other !== menu) other.classList.remove("open");
        });
        handler?.call(container, event);
      };
      new MutationObserver(() => button.setAttribute("aria-expanded", String(menu.classList.contains("open"))))
        .observe(menu, { attributes: true, attributeFilter: ["class"] });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menu.classList.contains("open")) {
          menu.classList.remove("open");
          button.focus();
          event.preventDefault();
        }
      });
    }
    document.addEventListener("click", (e) => {
      if (!actions.contains(e.target)) actions.open = false;
    });
    actions.addEventListener("toggle", () => {
      if (actions.open) {
        window.closeNavUserDropdown?.();
        $("#notifDropdown")?.classList.remove("open");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && actions.open) {
        actions.open = false;
        $("summary", actions).focus();
        e.preventDefault();
      }
    });
    const sb = $("#appLayout .sidebar");
    const close = document.createElement("button");
    close.className = "mm-sidebar-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Close navigation");
    close.dataset.mmAction = "close-menu";
    sb.prepend(close);
    sb.setAttribute("aria-label", "Master tools");
    const open = document.createElement("button");
    open.className = "mm-btn mm-menu-button";
    open.type = "button";
    open.textContent = "☰";
    open.setAttribute("aria-label", "Open navigation");
    open.setAttribute("aria-expanded", "false");
    open.dataset.mmAction = "menu";
    $("#mainNav").prepend(open);
    const bar = document.createElement("nav");
    bar.className = "mm-mobile-bar";
    bar.setAttribute("aria-label", "Quick navigation");
    bar.hidden = true;
    bar.innerHTML =
      '<button data-mm-action="navigate" data-route="dashboard"><span>⌂</span>Home</button><button data-mm-action="menu"><span>▦</span>Masters</button><button data-mm-action="navigate" data-route="businessautomation"><span>◈</span>Automate</button><button data-mm-action="genie" aria-label="Ask Genie" aria-controls="genieFabPanel" aria-expanded="false"><span>✧</span>Genie</button><button data-mm-action="navigate" data-route="account"><span>◎</span>Account</button>';
    document.body.append(bar);
    const original = window.toggleSidebar;
    let previousFocus = null;
    window.toggleSidebar = function (force) {
      const was = sb.classList.contains("open");
      original?.(force);
      const expanded = sb.classList.contains("open");
      document.body.classList.toggle("mm-menu-open", expanded);
      open.setAttribute("aria-expanded", String(expanded));
      if (expanded && !was) {
        previousFocus = document.activeElement;
        close.focus();
      }
      if (!expanded && was) previousFocus?.focus?.();
    };
    const show = window.showScreen;
    window.showScreen = function (route) {
      if (
        route === "admin" &&
        !(
          window.currentUser?.emailVerified &&
          window.currentUser?.email?.toLowerCase() ===
            "reachdavid.work@gmail.com"
        )
      ) {
        notify("This area is available to the verified administrator.");
        return;
      }
      show?.(route);
      window.scrollTo({ top: 0, behavior: "instant" });
      window.toggleSidebar(false);
      document
        .querySelectorAll(".mm-mobile-bar button[data-route]")
        .forEach((b) =>
          b.classList.toggle("active", b.dataset.route === route),
        );
      enhanceControls();
      if (route === "businessautomation") showAutomation();
      if (route === "admin") refreshState().catch((e) => notify(e.message));
    };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !e.defaultPrevented) window.toggleSidebar(false);
      if (
        (e.key === "Enter" || e.key === " ") &&
        e.target.matches("[role=button],[role=tab]") &&
        !e.target.matches("button,a,input,textarea")
      ) {
        e.preventDefault();
        e.target.click();
      }
      if (
        e.key === "Tab" &&
        sb.classList.contains("open") &&
        innerWidth <= 920
      ) {
        const focusable = [
          ...sb.querySelectorAll('button,[tabindex="0"],a'),
        ].filter((el) => el.getClientRects().length);
        const first = focusable[0],
          last = focusable.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    });
    const observer = new MutationObserver(() => {
      const logged =
        $("#appLayout").style.display !== "none" && !!window.currentUser;
      document.body.classList.toggle("mm-workspace", logged);
      bar.hidden = !logged;
    });
    observer.observe($("#appLayout"), {
      attributes: true,
      attributeFilter: ["style"],
    });
    window.addEventListener("resize", () => {
      if (innerWidth > 920) window.toggleSidebar(false);
    });
  }
  function floatingControls() {
    const panel = $("#genieFabPanel");
    const fab = $("#genieFab");
    const nav = $("#mainNav");
    if (!panel || !fab) return;
    const toast = $("#notifToast");
    if (toast) {
      toast.setAttribute("role", "status");
      const dismiss = document.createElement("button");
      dismiss.className = "mm-toast-close";
      dismiss.type = "button";
      dismiss.textContent = "×";
      dismiss.setAttribute("aria-label", "Dismiss notification");
      dismiss.onclick = () => { toast.style.display = "none"; };
      toast.append(dismiss);
    }
    // A body-level panel has a stable viewport, independent of tool transforms.
    document.body.append(panel);
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Genie assistant");
    fab.setAttribute("aria-controls", panel.id);
    fab.setAttribute("aria-expanded", "false");
    $("#genieFabInput").setAttribute("aria-label", "Message Genie");
    $("#genieFabLog").setAttribute("role", "log");
    $("#genieFabLog").setAttribute("aria-label", "Conversation with Genie");
    panel.querySelectorAll("button[title]").forEach((button) => {
      button.setAttribute("aria-label", button.title);
    });
    let previousFocus;
    const toggle = window.toggleGenieFab;
    const menus = [
      ["genieFabLangMenu", "genieFabLangBtn"],
      ["genieFabVoiceMenu", "genieFabVoicePickBtn"],
    ];
    const closePickers = () => menus.forEach(([id]) => $("#" + id).classList.remove("open"));
    window.toggleGenieFab = function (force) {
      const wasOpen = panel.classList.contains("open");
      if (!wasOpen) previousFocus = document.activeElement;
      toggle?.(force);
      const open = panel.classList.contains("open");
      document.body.classList.toggle("mm-genie-open", open);
      fab.setAttribute("aria-expanded", String(open));
      $(".mm-mobile-bar [data-mm-action=genie]").setAttribute("aria-expanded", String(open));
      if (open) {
        $(".mm-header-actions").open = false;
        window.toggleSidebar(false);
      } else {
        closePickers();
        if (wasOpen && previousFocus?.isConnected) previousFocus.focus();
      }
      fitViewport();
    };
    // Eligibility updates may also close the legacy panel directly.
    new MutationObserver(() => {
      const open = panel.classList.contains("open");
      document.body.classList.toggle("mm-genie-open", open);
      fab.setAttribute("aria-expanded", String(open));
      $(".mm-mobile-bar [data-mm-action=genie]").setAttribute("aria-expanded", String(open));
      if (!open) document.body.classList.remove("mm-keyboard-open");
    }).observe(panel, { attributes: true, attributeFilter: ["class"] });
    for (const [functionName, otherId] of [
      ["genieFabToggleLangMenu", "genieFabVoiceMenu"],
      ["genieFabToggleVoiceMenu", "genieFabLangMenu"],
    ]) {
      const original = window[functionName];
      window[functionName] = function (event) {
        $("#" + otherId).classList.remove("open");
        original?.(event);
      };
    }
    menus.forEach(([menuId, buttonId]) => {
      const menu = $("#" + menuId), button = $("#" + buttonId);
      button.setAttribute("aria-controls", menuId);
      button.setAttribute("aria-expanded", "false");
      new MutationObserver(() => button.setAttribute("aria-expanded", String(menu.classList.contains("open"))))
        .observe(menu, { attributes: true, attributeFilter: ["class"] });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || event.defaultPrevented || !panel.classList.contains("open")) return;
      const picker = menus.find(([id]) => $("#" + id).classList.contains("open"));
      if (picker) {
        closePickers();
        $("#" + picker[1]).focus();
      } else window.toggleGenieFab(false);
      event.preventDefault();
    });
    function fitViewport() {
      const viewport = window.visualViewport;
      const height = viewport?.height || innerHeight;
      const bottom = Math.max(0, innerHeight - height - (viewport?.offsetTop || 0));
      panel.style.setProperty("--mm-viewport-height", `${height}px`);
      panel.style.setProperty("--mm-viewport-bottom", `${bottom}px`);
      panel.classList.toggle("mm-chat-compact", height < 600);
      document.body.classList.toggle("mm-keyboard-open", panel.classList.contains("open") && bottom > 120);
    }
    window.addEventListener("resize", fitViewport);
    window.visualViewport?.addEventListener("resize", fitViewport);
    window.visualViewport?.addEventListener("scroll", fitViewport);
    new ResizeObserver(() => {
      if (nav.getBoundingClientRect().height) {
        document.documentElement.style.setProperty("--mm-header", `${Math.ceil(nav.getBoundingClientRect().height)}px`);
      }
    }).observe(nav);
    document.addEventListener("mm:auth", () => {
      if (!window.currentUser) window.toggleGenieFab(false);
    });
    new MutationObserver(() => {
      if ($("#appLayout").style.display === "none") window.toggleGenieFab(false);
    }).observe($("#appLayout"), { attributes: true, attributeFilter: ["style"] });
    fitViewport();
  }
  function updateHome() {
    const data = window.userData || {};
    $("#mmWelcome").textContent =
      "Welcome back" +
      (window.currentUser?.displayName
        ? ", " + window.currentUser.displayName.split(" ")[0]
        : "") +
      ". Your next move starts here.";
    document.querySelectorAll("#navAvatar,#sidebarAvatar").forEach((img) => {
      if (!window.currentUser?.photoURL) {
        img.src =
          "data:image/svg+xml," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="#3d3930"/><text x="32" y="42" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#e7bf70">' +
              esc((window.currentUser?.displayName || "M")[0].toUpperCase()) +
              "</text></svg>",
          );
      }
    });
    $("#mmPlan").textContent =
      { free: "Free", basic: "Basic", pro: "Pro", elite: "Elite" }[data.plan] ||
      "Free";
    $("#mmEarned").textContent = money((Number(data.totalEarned) || 0) * 100);
  }
  function init() {
    if (!$("#appLayout")) return;
    home();
    automationScreen();
    adminPanels();
    navigation();
    floatingControls();
    enhanceControls();
    document.addEventListener("mm:auth", () => {
      authEpoch++;
      state = null;
      stateUid = null;
      loadingState = null;
      workspaceTarget = null;
      accounts = [];
      selectedTemplate = null;
      document
        .querySelectorAll(".mm-admin-only.bank-panel")
        .forEach((el) => el.replaceChildren());
      $("#mmAccountDialog")?.remove();
      $("#mmAutomationContent").replaceChildren();
      updateAdminVisibility();
      updateHome();
      if (window.currentUser) refreshState().catch(() => {});
      else
        document
          .querySelectorAll(".mm-admin-only.bank-panel")
          .forEach((el) => el.replaceChildren());
    });
    document.addEventListener("click", async (e) => {
      const button = e.target.closest("[data-mm-action]");
      if (!button || button.disabled) return;
      const action = button.dataset.mmAction;
      try {
        if (action === "navigate") navigate(button.dataset.route);
        else if (action === "explore")
          $("#mmMastersHeading").scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
              ? "auto"
              : "smooth",
          });
        else if (action === "menu") window.toggleSidebar();
        else if (action === "genie") window.toggleGenieFab();
        else if (action === "close-menu") window.toggleSidebar(false);
        else if (action === "refresh-automation") await showAutomation();
        else if (action === "load-work") await loadWork();
        else if (action === "checkout") {
          if (!$("#mmBillingConsent")?.checked) {
            notify(
              "Review and accept the recurring price and separate usage charges first.",
            );
            return;
          }
          button.disabled = true;
          const r = await api("mmAutomationCheckout", {
            consent: true,
            requestId: id(),
          });
          location.assign(r.url);
        } else if (action === "billing-portal") {
          const r = await api("mmAutomationPortal");
          location.assign(r.url);
        } else if (action === "run-goal") {
          button.disabled = true;
          await api("mmAutomationRunGoal", {
            goalId: button.dataset.id,
            requestId: id(),
            ...(workspaceTarget ? { targetUid: workspaceTarget } : {}),
          });
          notify("Task sent to your Paperclip team.");
          await loadWork();
        } else if (action === "admin-tab") {
          await refreshState();
          if (!state?.admin) throw new Error("Verified admin access required.");
          window.switchAdminTab(button.dataset.tab);
          if (button.dataset.tab === "growth") await emailStudio();
          else await adminAccounts();
        } else if (action === "email-template")
          selectTemplate(Number(button.dataset.template));
        else if (action === "save-email") {
          if (!$("#mmEmailForm").reportValidity()) return;
          await api("mmAdminSaveEmailTemplate", {
            ...emailFields(),
            id: selectedTemplate?.id,
          });
          status("mmEmailStatus", "Template saved for the administrator.");
        } else if (action === "download-email") {
          const html = $("#mmEmailPreview")._html;
          if (!html) return;
          const url = URL.createObjectURL(
            new Blob([html], { type: "text/html" }),
          );
          const a = document.createElement("a");
          a.href = url;
          a.download = "money-masteries-video-email.html";
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else if (action === "more-accounts") await loadAccounts(true);
        else if (action === "account-edit") editAccount(button.dataset.id);
        else if (action === "close-account") $("#mmAccountDialog").close();
        else if (action === "platform-workspace") {
          workspaceTarget = "platform";
          navigate("businessautomation");
        }
      } catch (error) {
        notify(
          error.message || "Could not complete this action. Please try again.",
        );
      } finally {
        if (button.isConnected) button.disabled = false;
      }
    });
    const tabSwitch = window.switchAdminTab;
    window.switchAdminTab = function (id) {
      tabSwitch?.(id);
      enhanceControls();
    };
    updateHome();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
