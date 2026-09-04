/*
 * WCAG 2.2 AA Triage — application logic.
 *
 * Pure client-side. The whole mechanic is: collect a feature profile, then
 * "show criteria whose feature flag is on, sorted by priority."
 */
(function () {
  "use strict";

  var DATA = window.A11Y_DATA;

  // ---- app state ------------------------------------------------------
  var state = {
    platform: "building",
    types: {},         // type id -> bool (multi-select; a tool can be several)
    features: {},      // feature id -> bool
    presetSources: {}, // feature id -> [type labels that pre-checked it]
    userSet: {},       // feature id -> bool, only for features the user set by hand
    includeNew: true   // include the four criteria added in WCAG 2.2
  };
  Object.keys(DATA.types).forEach(function (t) { state.types[t] = (t === "chart"); });
  DATA.features.forEach(function (f) { state.features[f.id] = false; });

  // ---- tiny DOM helpers ----------------------------------------------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  // ---- STEP 1: render frame choices ----------------------------------
  // inputType is "radio" (single-select, e.g. platform) or "checkbox"
  // (multi-select, e.g. type — a tool can be a chart AND a map AND a story).
  //
  // The whole card is a <label> so any click on it toggles the control, but
  // that would fold the supporting note into the control's accessible name
  // ("Computational notebook Students run or edit code cells, checkbox").
  // aria-labelledby pins the name to the label text alone; the note is
  // announced as a description instead (4.1.2).
  function buildChoiceCard(inputType, group, value, label, note, checked) {
    var id = group + "-" + value;
    var attrs = { type: inputType, id: id, value: value, "aria-labelledby": id + "-label" };
    if (inputType === "radio") attrs.name = group;
    if (note) attrs["aria-describedby"] = id + "-note";
    var input = el("input", attrs);
    if (checked) input.checked = true;
    var card = el("label", { class: "radio-card", for: id }, [
      input,
      el("span", { class: "radio-card-body" }, [
        el("span", { class: "radio-card-label", id: id + "-label", text: label })
      ].concat(note ? [el("span", { class: "radio-card-note", id: id + "-note", text: note })] : []))
    ]);
    return card;
  }

  function renderStep1() {
    var pWrap = $("#platform-choices");
    pWrap.innerHTML = "";
    Object.keys(DATA.platforms).forEach(function (key) {
      pWrap.appendChild(
        buildChoiceCard("radio", "platform", key, DATA.platforms[key].label, null, key === state.platform)
      );
    });

    var tWrap = $("#type-choices");
    tWrap.innerHTML = "";
    Object.keys(DATA.types).forEach(function (key) {
      var card = buildChoiceCard("checkbox", "type", key, DATA.types[key].label,
        DATA.types[key].note, !!state.types[key]);
      card.querySelector("input").addEventListener("change", function (e) {
        var before = {};
        DATA.features.forEach(function (f) { before[f.id] = state.features[f.id]; });
        state.types[key] = e.target.checked;
        recomputePreset();
        renderFeatures();
        announceInventoryChange(DATA.types[key].label, before);
      });
      tWrap.appendChild(card);
    });
  }

  // ---- feature inventory (lives on page 1, under the frame questions) ----
  function renderFeatures() {
    var list = $("#feature-list");
    list.innerHTML = "";
    DATA.features.forEach(function (f) {
      var id = "feat-" + f.id;
      var why = state.presetSources[f.id];

      // name = the feature label; hint and preset reason are descriptions.
      var input = el("input", {
        type: "checkbox", id: id, value: f.id,
        "aria-labelledby": id + "-label",
        "aria-describedby": id + "-hint" + (why ? " " + id + "-why" : "")
      });
      input.checked = !!state.features[f.id];

      var text = [
        el("span", { class: "toggle-label", id: id + "-label", text: f.label }),
        el("span", { class: "toggle-hint", id: id + "-hint", text: f.hint })
      ];
      // One chip per contributing type: six of the nine type labels contain a
      // slash, so a comma-joined string reads as an undifferentiated smear.
      // The chips lose the separators when flattened for the description,
      // hence the aria-label carrying the sentence form.
      if (why) {
        text.push(el("span", {
          class: "feature-why", id: id + "-why",
          "aria-label": "Because you selected " + why.join(", ")
        }, [el("span", { class: "why-lead", text: "Because you selected" })].concat(
          why.map(function (label) {
            return el("span", { class: "why-chip", text: label });
          })
        )));
      }

      // A hand-toggled feature is an override: it survives later type changes,
      // in either direction, until the user clears it themselves.
      input.addEventListener("change", function (e) {
        state.features[f.id] = e.target.checked;
        state.userSet[f.id] = e.target.checked;
      });

      var item = el("li", { class: "feature-item" }, [
        el("label", { class: "toggle", for: id }, [
          input,
          el("span", { class: "toggle-text" }, text)
        ])
      ]);
      list.appendChild(item);
    });
  }

  // ---- build the active criteria set ---------------------------------
  // Priority: AA before A; stable within by id.
  function collectCriteria() {
    var reasons = {}; // scId -> Set of source labels
    var notes = {};   // scId -> [{ label, text }] context notes from features

    function add(scId, source) {
      if (!reasons[scId]) reasons[scId] = {};
      reasons[scId][source] = true;
    }

    DATA.baseline.forEach(function (id) { add(id, "Baseline"); });

    DATA.features.forEach(function (f) {
      if (state.features[f.id]) {
        f.criteria.forEach(function (id) { add(id, f.label); });
        // a module may attach a context-specific note to a criterion,
        // sharpening the generic wording for this feature (e.g. what
        // "No Keyboard Trap" means inside a code editor).
        if (f.notes) Object.keys(f.notes).forEach(function (id) {
          if (!notes[id]) notes[id] = [];
          notes[id].push({ label: f.noteLabel || f.label, text: f.notes[id] });
        });
      }
    });

    var ids = Object.keys(reasons).filter(function (id) {
      return state.includeNew || !DATA.criteria[id].isNew;
    });
    ids.sort(function (a, b) {
      var ca = DATA.criteria[a], cb = DATA.criteria[b];
      // AA before A (AA is the conformance frontier being taught)
      var la = ca.level === "AA" ? 0 : 1, lb = cb.level === "AA" ? 0 : 1;
      if (la !== lb) return la - lb;
      return a.localeCompare(b, "en", { numeric: true });
    });

    return ids.map(function (id) {
      return {
        c: DATA.criteria[id],
        sources: Object.keys(reasons[id]),
        notes: notes[id] || []
      };
    });
  }

  // ---- ownership label -----------------------------------------------
  // The criterion carries a default owner; a platform may reassign it, since
  // who owns "Focus Visible" depends entirely on who wrote the focus styles.
  function ownerFor(c, plat) {
    return (plat.owners && plat.owners[c.id]) || c.owner;
  }

  function ownerBadge(owner, isBuilding) {
    if (isBuilding) return null; // no vendor split when you build it yourself
    var map = {
      author: { text: "You own this", cls: "owner-author" },
      vendor: { text: "Platform's job", cls: "owner-vendor" },
      shared: { text: "Shared — verify", cls: "owner-shared" }
    };
    var m = map[owner] || map.shared;
    return el("span", { class: "owner " + m.cls, text: m.text });
  }

  // ---- page 2: render output -----------------------------------------
  function renderResults() {
    var items = collectCriteria();
    var plat = DATA.platforms[state.platform];

    // platform note: framing, then what you own, what bites you here, and
    // where the vendor documents its own conformance.
    var note = $("#platform-note");
    note.innerHTML = "";
    note.appendChild(el("h2", { text: plat.label }));
    note.appendChild(el("p", { text: plat.note }));

    function bullets(title, items, build) {
      if (!items || !items.length) return;
      note.appendChild(el("h3", { text: title }));
      var ul = el("ul", { class: "plat-list" });
      items.forEach(function (item) { ul.appendChild(build(item)); });
      note.appendChild(ul);
    }

    bullets("What you are responsible for", plat.responsibilities, function (t) {
      return el("li", { text: t });
    });
    bullets("Gotchas specific to " + plat.label, plat.gotchas, function (t) {
      return el("li", { text: t });
    });
    bullets("Vendor accessibility documentation", plat.links, function (l) {
      return el("li", null, [
        el("a", { href: l.url, target: "_blank", rel: "noopener", text: l.label })
      ]);
    });

    $("#s2-h").textContent = "Your WCAG " + (state.includeNew ? "2.2" : "2.1") + " AA obligations";

    // summary
    var activeFeatures = DATA.features.filter(function (f) { return state.features[f.id]; })
      .map(function (f) { return f.label; });
    var typeLabels = Object.keys(DATA.types)
      .filter(function (t) { return state.types[t]; })
      .map(function (t) { return DATA.types[t].label.toLowerCase(); });
    var typePhrase = typeLabels.length ? typeLabels.join(" + ") : "interactive data tool";

    var summary = $("#result-summary");
    summary.innerHTML = "";
    summary.appendChild(el("strong", {
      text: items.length + " success criteria apply"
    }));
    summary.appendChild(document.createTextNode(
      " to your " + typePhrase +
      (activeFeatures.length ? " with " + activeFeatures.join(", ").toLowerCase() : "") + "."
    ));

    var groups = $("#result-groups");
    groups.innerHTML = "";
    groups.appendChild(renderGroup(null, null, items, plat, "group-all"));
  }

  function renderGroup(title, blurb, items, plat, cls) {
    var isBuilding = !!plat.custom;
    var section = el("section", { class: "crit-group " + cls });
    if (title) section.appendChild(el("h3", { text: title }));
    if (blurb) section.appendChild(el("p", { class: "group-blurb", text: blurb }));

    var list = el("ol", { class: "crit-list" });
    items.forEach(function (item) {
      var c = item.c;
      var header = el("div", { class: "crit-header" }, [
        el("span", { class: "crit-id", text: c.id }),
        el("span", { class: "crit-name", text: c.name }),
        el("span", { class: "level-badge level-" + c.level, text: "Level " + c.level })
      ]);
      var badge = ownerBadge(ownerFor(c, plat), isBuilding);
      if (badge) header.appendChild(badge);

      var li = el("li", { class: "crit" }, [
        header,
        el("p", { class: "crit-plain", text: c.plain })
      ]);

      // context-specific notes contributed by active feature modules
      (item.notes || []).forEach(function (n) {
        li.appendChild(el("p", { class: "crit-context" }, [
          el("span", { class: "crit-context-label", text: n.label + ": " }),
          document.createTextNode(n.text)
        ]));
      });

      li.appendChild(el("p", { class: "crit-check" }, [
        el("span", { class: "crit-check-label", text: "How to check it: " }),
        document.createTextNode(c.check)
      ]));
      li.appendChild(el("p", { class: "crit-why" }, [
        el("span", { class: "crit-why-label", text: "Applies because: " }),
        document.createTextNode(item.sources.join(", "))
      ]));
      list.appendChild(li);
    });
    section.appendChild(list);
    return section;
  }

  // ---- navigation ----------------------------------------------------
  function showStep(n) {
    [1, 2].forEach(function (i) {
      $("#step-" + i).hidden = (i !== n);
    });
    // progress indicator
    document.querySelectorAll(".steps li").forEach(function (li) {
      var s = Number(li.getAttribute("data-step"));
      li.classList.toggle("done", s < n);
      if (s === n) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    var panel = $("#step-" + n);
    panel.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function readStep1() {
    var p = document.querySelector('input[name="platform"]:checked');
    if (p) state.platform = p.value;
    state.includeNew = $("#include-22").checked;
  }

  // The inventory sits on the same page as the type checkboxes, so the preset
  // is recomputed live rather than applied once on a page transition. It is
  // derived, never accumulated: the union of every ticked type's features,
  // with the user's own toggles layered on top. That makes unticking a type
  // withdraw exactly what it contributed and nothing a second type still
  // claims, and it means an explicit choice is never silently overwritten.
  // Ticking a type rewrites the inventory further down the page. Nothing marks
  // that visually — the chips under each feature carry it — so the change is
  // announced into a visually hidden live region (4.1.3), the criterion this
  // page puts in everyone's baseline list.
  function announceInventoryChange(typeLabel, before) {
    var added = [], removed = [];
    DATA.features.forEach(function (f) {
      if (state.features[f.id] && !before[f.id]) added.push(f.label.toLowerCase());
      if (!state.features[f.id] && before[f.id]) removed.push(f.label.toLowerCase());
    });
    var parts = [];
    if (added.length) parts.push("added " + added.join(", "));
    if (removed.length) parts.push("removed " + removed.join(", "));
    $("#feature-status").textContent = parts.length
      ? typeLabel + " " + parts.join("; ") + "."
      : typeLabel + " changed nothing — your inventory already covered it.";
  }

  function recomputePreset() {
    var pre = {};
    Object.keys(DATA.types).forEach(function (t) {
      if (state.types[t]) (DATA.types[t].pre || []).forEach(function (fid) {
        (pre[fid] = pre[fid] || []).push(DATA.types[t].label);
      });
    });
    state.presetSources = pre;
    DATA.features.forEach(function (f) {
      state.features[f.id] = (f.id in state.userSet) ? state.userSet[f.id] : !!pre[f.id];
    });
  }

  // ---- wire up --------------------------------------------------------
  function init() {
    renderStep1();
    recomputePreset();  // the default type is ticked, so its features are too
    renderFeatures();

    $("#to-step-2").addEventListener("click", function () {
      readStep1();
      renderResults();
      showStep(2);
    });

    $("#back-to-1").addEventListener("click", function () {
      showStep(1);
    });

    $("#print-btn").addEventListener("click", function () { window.print(); });

    $("#restart-btn").addEventListener("click", function () {
      state.platform = "building";
      Object.keys(DATA.types).forEach(function (t) { state.types[t] = (t === "chart"); });
      state.userSet = {};
      state.includeNew = true;
      $("#include-22").checked = true;
      $("#feature-status").textContent = "";
      renderStep1();
      recomputePreset();
      renderFeatures();
      showStep(1);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
