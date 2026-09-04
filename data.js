/*
 * WCAG 2.2 AA Triage — mapping data
 *
 * The knowledge core of the tool: the map from "feature present" to
 * "criteria that switch on," expressed in data-visualization language.
 *
 * Loaded as a plain script (not fetched) so the tool works when opened
 * directly from the filesystem (file://), with no server — which suits
 * the OER distribution model.
 *
 * Each criterion object:
 *   id        WCAG success criterion number
 *   name      Official short name
 *   level     "A" or "AA" (all are in-scope for AA conformance)
 *   isNew     true if new in WCAG 2.2 (★ — where data tools trip)
 *   plain     What it means for a DATA TOOL specifically
 *   check     How to check it (with manual vs. automated notes)
 *   owner     Who typically owns it on a third-party platform:
 *             "author" | "vendor" | "shared"
 */
window.A11Y_DATA = {
  // ---- criteria library, keyed by SC id -------------------------------
  criteria: {
    "1.1.1": {
      id: "1.1.1", name: "Non-text Content", level: "A", isNew: false,
      plain: "The chart, map, or image needs a text alternative that conveys its message — not just a label like \"bar chart.\" Say what the visual shows (\"Emissions fell 40% after 2010, then plateaued\"), and offer the underlying data as a table.",
      check: "Manual. Read the alt text (or figure caption / linked data table) with the visual hidden. Ask: could a student who cannot see the chart learn the same finding? A scanner can only tell you alt text is missing, never whether it's meaningful.",
      owner: "author"
    },
    "1.2.1": {
      id: "1.2.1", name: "Audio-only and Video-only (Prerecorded)", level: "A", isNew: false,
      plain: "Audio-only clips (a narrated explainer) need a text transcript; silent video-only clips need a text or audio description of what happens.",
      check: "Manual. Confirm a transcript or equivalent exists and is reachable near the media.",
      owner: "author"
    },
    "1.2.2": {
      id: "1.2.2", name: "Captions (Prerecorded)", level: "A", isNew: false,
      plain: "Any prerecorded video with sound (a walkthrough of your dashboard) needs synchronized captions.",
      check: "Manual. Play the video with sound off and confirm captions carry the spoken content and relevant sounds. Auto-generated captions must be corrected.",
      owner: "author"
    },
    "1.2.5": {
      id: "1.2.5", name: "Audio Description (Prerecorded)", level: "AA", isNew: false,
      plain: "If a video shows meaningful visuals the narration doesn't mention (data appearing on screen, an on-map animation), provide audio description of that visual information.",
      check: "Manual. Watch with the screen off; note anything important you'd miss. If gaps exist, an audio description track (or a described version) is required.",
      owner: "author"
    },
    "1.3.1": {
      id: "1.3.1", name: "Info and Relationships", level: "A", isNew: false,
      plain: "Structure conveyed visually must exist in the markup: real headings, list markup, and — for data tables — real header cells tied to their data. A dashboard's visual grouping means nothing to a screen reader unless it's coded.",
      check: "Partly automated. Scanners catch missing table headers and some heading issues. Manual pass needed to confirm the reading structure matches the visual structure.",
      owner: "shared"
    },
    "1.3.2": {
      id: "1.3.2", name: "Meaningful Sequence", level: "A", isNew: false,
      plain: "The DOM reading order must match the intended narrative order. In scrollytelling this is where things break: the visual sequence of chapters must equal the order assistive tech reads them.",
      check: "Manual. Tab through, and read with a screen reader, confirming content arrives in the order the story intends. Disabling CSS is a quick sanity check.",
      owner: "shared"
    },
    "1.3.5": {
      id: "1.3.5", name: "Identify Input Purpose", level: "AA", isNew: false,
      plain: "Inputs collecting known information about the user (name, email) should declare their purpose via autocomplete, so browsers and assistive tech can autofill.",
      check: "Partly automated. A scanner can flag common fields missing autocomplete; confirm the values are correct by hand.",
      owner: "author"
    },
    "1.4.1": {
      id: "1.4.1", name: "Use of Color", level: "A", isNew: false,
      plain: "Color must never be the only thing carrying meaning. Series distinguished by hue alone fail — add direct labels, patterns, textures, or shapes. Red/green map choropleths are the classic offender.",
      check: "Manual. View in grayscale (or simulate color-blindness). Can you still tell the series/regions apart and read the legend? Scanners cannot judge this.",
      owner: "author"
    },
    "1.4.2": {
      id: "1.4.2", name: "Audio Control", level: "A", isNew: false,
      plain: "If audio plays automatically for more than 3 seconds, provide a way to pause or stop it (or lower its volume independently).",
      check: "Manual. Load the tool; if anything autoplays, confirm an obvious control stops it.",
      owner: "shared"
    },
    "1.4.3": {
      id: "1.4.3", name: "Contrast (Minimum)", level: "AA", isNew: false,
      plain: "Text — including axis labels, legends, tooltips, and data labels — needs 4.5:1 contrast against its background (3:1 for large text). Light-gray annotation text is a frequent miss.",
      check: "Partly automated. Scanners check text contrast well, but often miss text baked into canvas/SVG charts — check those manually with a contrast tool.",
      owner: "shared"
    },
    "1.4.4": {
      id: "1.4.4", name: "Resize Text", level: "AA", isNew: false,
      plain: "Text must remain readable and functional when zoomed to 200%. Chart labels shouldn't clip or overlap into unreadability at that zoom.",
      check: "Manual. Zoom the browser to 200% and confirm nothing is lost or clipped.",
      owner: "shared"
    },
    "1.4.10": {
      id: "1.4.10", name: "Reflow", level: "AA", isNew: false,
      plain: "Content must reflow to a 320px-wide viewport without two-dimensional scrolling. Wide dashboards and fixed-width chart layouts often force horizontal scrolling on phones.",
      check: "Manual. Narrow the window to ~320px (or 400% zoom) and confirm no horizontal scroll for the main content.",
      owner: "shared"
    },
    "1.4.11": {
      id: "1.4.11", name: "Non-text Contrast", level: "AA", isNew: false,
      plain: "Meaningful graphics and UI need 3:1 contrast: chart lines/bars against the background and each other, the boundaries of adjacent regions, and control states (focus rings, toggle borders, slider handles).",
      check: "Manual. Use a contrast tool on data marks and control edges. Scanners rarely evaluate graphical contrast.",
      owner: "shared"
    },
    "1.4.13": {
      id: "1.4.13", name: "Content on Hover or Focus", level: "AA", isNew: false,
      plain: "Tooltips and hover popups (the heart of most interactive charts) must be dismissable without moving the pointer (Esc), hoverable (you can move onto them), and persistent (they don't vanish on their own).",
      check: "Manual. Hover a data point, then move toward the tooltip — does it stay? Press Esc — does it close? Does it persist until you dismiss it?",
      owner: "shared"
    },
    "2.1.1": {
      id: "2.1.1", name: "Keyboard", level: "A", isNew: false,
      plain: "Everything operable by mouse must work by keyboard: focusing data points, opening tooltips, moving sliders, panning/zooming a map, advancing a story. This is the single biggest failure in custom data tools.",
      check: "Manual. Unplug the mouse. Can you reach and operate every control and data interaction with Tab, arrows, Enter, and Space?",
      owner: "shared"
    },
    "2.1.2": {
      id: "2.1.2", name: "No Keyboard Trap", level: "A", isNew: false,
      plain: "Keyboard focus must be able to leave any component. A modal chart detail or an embedded map must not trap focus with no way out.",
      check: "Manual. Tab into each widget and confirm you can Tab (or Esc) back out.",
      owner: "shared"
    },
    "2.2.1": {
      id: "2.2.1", name: "Timing Adjustable", level: "A", isNew: false,
      plain: "If content auto-advances or has a time limit (an auto-playing story, a session timeout), let users turn it off, adjust it, or extend it.",
      check: "Manual. Identify any timing; confirm the user can pause, extend, or disable it.",
      owner: "shared"
    },
    "2.2.2": {
      id: "2.2.2", name: "Pause, Stop, Hide", level: "A", isNew: false,
      plain: "Any moving, blinking, scrolling, or auto-updating content lasting more than 5 seconds (an animated transition loop, a live-updating chart) needs an obvious pause/stop control.",
      check: "Manual. Find the auto-motion; confirm a control pauses or stops it. Also honor prefers-reduced-motion.",
      owner: "shared"
    },
    "2.3.1": {
      id: "2.3.1", name: "Three Flashes or Below Threshold", level: "A", isNew: false,
      plain: "Nothing flashes more than three times per second — relevant to fast animated transitions or rapidly cycling data frames.",
      check: "Manual. Watch transitions; if anything flashes rapidly, slow it or remove the flash.",
      owner: "shared"
    },
    "2.4.3": {
      id: "2.4.3", name: "Focus Order", level: "A", isNew: false,
      plain: "Focus should move in an order that preserves meaning. As a story advances or a panel opens, focus should land somewhere sensible rather than jumping to the top or vanishing.",
      check: "Manual. Tab through and confirm the order is logical; test focus after dynamic changes (new chapter, opened dialog).",
      owner: "shared"
    },
    "2.4.6": {
      id: "2.4.6", name: "Headings and Labels", level: "AA", isNew: false,
      plain: "Headings and control/field labels must describe their topic or purpose. \"Chart 1\" and \"Filter\" are weaker than \"CO₂ by decade\" and \"Filter by region.\"",
      check: "Manual. Read headings and labels in isolation — are they descriptive?",
      owner: "author"
    },
    "2.4.7": {
      id: "2.4.7", name: "Focus Visible", level: "AA", isNew: false,
      plain: "The keyboard focus indicator must be visible on every focusable thing — including custom chart points, map controls, and slider handles, where default outlines are often removed.",
      check: "Manual. Tab through and confirm you can always see where focus is. Watch for CSS that sets outline:none without a replacement.",
      owner: "shared"
    },
    "2.4.11": {
      id: "2.4.11", name: "Focus Not Obscured (Minimum)", level: "AA", isNew: true,
      plain: "When something receives focus, it must not be entirely hidden by other content. Sticky StoryMap chapter headers and floating toolbars commonly cover the focused element.",
      check: "Manual. Tab through with sticky headers/overlays present; confirm the focused item is never fully hidden behind them.",
      owner: "shared"
    },
    "2.5.1": {
      id: "2.5.1", name: "Pointer Gestures", level: "A", isNew: false,
      plain: "Multi-point or path-based gestures (pinch-zoom a map, swipe a story) must have a single-pointer alternative like buttons.",
      check: "Manual. For every gesture, confirm a simple tap/click alternative exists.",
      owner: "shared"
    },
    "2.5.2": {
      id: "2.5.2", name: "Pointer Cancellation", level: "A", isNew: false,
      plain: "Actions should fire on pointer-up, not pointer-down, so a user can slide off to cancel — important for draggable handles and map controls.",
      check: "Manual. Press on a control, drag away, and release; confirm the action is abandoned.",
      owner: "shared"
    },
    "2.5.7": {
      id: "2.5.7", name: "Dragging Movements", level: "AA", isNew: true,
      plain: "Any function that uses dragging — panning a map, dragging a slider or a brush selection, reordering — must offer a non-drag alternative (buttons, click-to-set, keyboard). Draggable maps and range sliders are the prime cases.",
      check: "Manual. For each drag interaction, confirm you can achieve the same result without dragging (e.g., +/- buttons, arrow keys, or clicking a target).",
      owner: "shared"
    },
    "2.5.8": {
      id: "2.5.8", name: "Target Size (Minimum)", level: "AA", isNew: true,
      plain: "Interactive targets must be at least 24×24 CSS px (or have enough spacing). Small map pins, dense legend toggles, and tightly packed chart controls routinely fail.",
      check: "Partly automated. Some scanners flag small targets; verify pins, close buttons, and clustered controls by measuring them.",
      owner: "shared"
    },
    "3.3.1": {
      id: "3.3.1", name: "Error Identification", level: "A", isNew: false,
      plain: "When a user enters a value the tool rejects (out-of-range model input, malformed number), the error must be described in text, not just a red border.",
      check: "Manual. Submit bad input; confirm a clear text error names the field and problem.",
      owner: "author"
    },
    "3.3.2": {
      id: "3.3.2", name: "Labels or Instructions", level: "A", isNew: false,
      plain: "Inputs where students enter or select values to model need visible labels and any needed instructions (units, expected range).",
      check: "Manual. Confirm each field has a persistent visible label (placeholder text alone is not enough).",
      owner: "author"
    },
    "3.3.3": {
      id: "3.3.3", name: "Error Suggestion", level: "AA", isNew: false,
      plain: "When the tool knows how to fix an input error, suggest the correction (\"Enter a value between 0 and 100\").",
      check: "Manual. Trigger errors; confirm the message suggests a fix when one is known.",
      owner: "author"
    },
    "3.3.7": {
      id: "3.3.7", name: "Redundant Entry", level: "A", isNew: true,
      plain: "In a multi-step modeling widget or wizard, don't make users re-enter information they already gave — auto-populate it or let them pick it, within the same session.",
      check: "Manual. Walk a multi-step flow; confirm earlier answers are not requested again (except passwords / security-sensitive re-entry).",
      owner: "author"
    },
    "4.1.2": {
      id: "4.1.2", name: "Name, Role, Value", level: "A", isNew: false,
      plain: "Every custom control (slider, filter toggle, tab, map button) must expose an accessible name, role, and current value/state to assistive tech — usually via correct native elements or ARIA. Custom SVG/canvas widgets need this added deliberately.",
      check: "Partly automated. Scanners catch missing names/roles on standard patterns; custom widgets need manual screen-reader testing to confirm role and value are announced.",
      owner: "shared"
    },
    "4.1.3": {
      id: "4.1.3", name: "Status Messages", level: "AA", isNew: false,
      plain: "When the view updates without a page reload — filtering a chart, \"showing 42 results,\" a loaded/error state — announce it to assistive tech via a live region so screen-reader users learn what changed.",
      check: "Manual. Trigger dynamic updates with a screen reader running; confirm the change is announced without moving focus.",
      owner: "shared"
    }
  },

  // ---- baseline: applies to any operable interactive visual ------------
  baseline: [
    "1.1.1", "1.3.1", "1.3.2", "1.4.3", "1.4.4", "1.4.10", "1.4.11",
    "2.1.1", "2.1.2", "2.4.3", "2.4.7", "2.4.11", "4.1.2", "4.1.3"
  ],

  // ---- feature modules: flag -> criteria that switch on ----------------
  features: [
    { id: "color",     label: "Color-encoded data",
      hint: "Series, categories, or regions distinguished by color",
      criteria: ["1.4.1", "1.4.11"] },
    { id: "controls",  label: "Custom interactive controls",
      hint: "Sliders, filters, tooltips, zoom, custom buttons",
      criteria: ["2.5.8", "1.4.13", "4.1.2", "4.1.3"] },
    { id: "drag",      label: "Drag interactions",
      hint: "Panning, dragging a slider or brush, reordering",
      criteria: ["2.5.7", "2.5.1", "2.5.2"] },
    { id: "map",       label: "A map / geospatial view",
      hint: "Interactive map, choropleth, pins, geographic layers",
      criteria: ["2.5.7", "2.5.8", "1.4.1", "1.1.1"] },
    { id: "animation", label: "Animation, motion, or scroll transitions",
      hint: "Animated transitions, scrollytelling, moving elements",
      criteria: ["2.2.2", "2.3.1", "2.4.3"] },
    { id: "timed",     label: "Auto-advancing or timed content",
      hint: "Auto-play, timeouts, content that advances on its own",
      criteria: ["2.2.1", "2.2.2"] },
    { id: "video",     label: "Video",
      hint: "Prerecorded video, with or without sound",
      criteria: ["1.2.2", "1.2.5", "1.4.2"] },
    { id: "audio",     label: "Audio",
      hint: "Narration, sound clips, or any audio track",
      criteria: ["1.2.1", "1.4.2"] },
    { id: "entry",     label: "User data entry",
      hint: "Typing or selecting values to model or explore",
      criteria: ["1.3.5", "3.3.1", "3.3.2", "3.3.3", "3.3.7"] },
    { id: "code",      label: "Editable or executable code",
      hint: "Runnable code cells, live editors, student-editable scripts",
      criteria: ["2.1.2", "4.1.2", "3.3.2", "1.4.1", "4.1.3"],
      // context notes sharpen the generic criterion wording for a code cell
      noteLabel: "In a code cell",
      notes: {
        "2.1.2": "Code editors (CodeMirror, Monaco, ipywidgets) capture Tab for indentation, which traps keyboard users inside the cell. Provide and document an escape — commonly Esc then Tab — and confirm focus can actually leave the editor.",
        "4.1.2": "Expose the editor as a labeled text region with a role and accessible name, not an unlabeled div, so screen readers announce what it is.",
        "3.3.2": "Tell users how to run the code and how to move focus out of the editor. A code cell with no instructions strands keyboard and screen-reader users.",
        "1.4.1": "Syntax highlighting must not be the only signal of meaning, and highlighted tokens still need 4.5:1 contrast against the editor background — low-contrast comment colors are a frequent miss.",
        "4.1.3": "When running the code produces new output or an error, announce it via a live region so screen-reader users know execution finished and what it produced."
      } },
    { id: "math",      label: "Mathematical notation",
      hint: "Rendered equations \u2014 MathJax, KaTeX, LaTeX in markdown",
      criteria: ["1.3.1", "1.1.1", "1.4.10", "1.4.4", "2.1.1"],
      noteLabel: "In an equation",
      notes: {
        "1.3.1": "A screen reader needs the structure of an expression \u2014 numerator over denominator, subscript, matrix row \u2014 not a stream of glyphs. MathJax and KaTeX can emit MathML alongside the visual rendering; confirm yours does, because CSS-positioned spans alone read as nonsense.",
        "1.1.1": "Math baked into an image \u2014 a LaTeX-generated PNG, or an equation drawn inside a matplotlib figure \u2014 needs the expression spelled out in words in its alt text (\"x equals negative b, plus or minus the square root of...\"), never \"equation 3\" or the raw LaTeX source.",
        "1.4.10": "A long derivation overflows sideways at 320px and forces two-directional scrolling. Let a wide equation scroll inside its own container, or break it across lines, so the page itself never scrolls horizontally.",
        "1.4.4": "Image-rendered math pixelates or clips at 200% zoom while the text around it grows. MathJax and KaTeX size in em units and scale with their surroundings \u2014 verify your equations do too.",
        "2.1.1": "MathJax's expression explorer lets a keyboard user walk an equation term by term, but only when the rendered node is focusable and the feature is switched on. Check that a keyboard user can enter and traverse an equation, not merely tab past it."
      } },
    { id: "tables",    label: "Data tables",
      hint: "Tabular data shown alongside or instead of a chart",
      criteria: ["1.3.1", "2.4.6"] }
  ],

  // ---- type presets: pre-check the likely feature set ------------------
  // Between them these should reach every feature module — an orphaned module
  // is one a user can only find by scrolling step 2 and guessing.
  types: {
    chart: {
      label: "Chart / dashboard",
      note: "A prepared view students read and interpret",
      pre: ["color", "controls", "tables"]
    },
    explorer: {
      label: "Data explorer / query builder",
      note: "Students filter, sort, or subset the data themselves",
      pre: ["color", "controls", "tables", "entry"]
    },
    map: {
      label: "Map / geospatial",
      note: "Anything with a basemap, pins, or shaded regions",
      pre: ["color", "controls", "drag", "map"]
    },
    timeseries: {
      label: "Animated time-series",
      note: "Playback over time, with autoplay or play/pause",
      pre: ["color", "controls", "animation", "timed"]
    },
    simulation: {
      label: "Simulation / model explorer",
      note: "Students set parameters and watch the model respond",
      pre: ["color", "controls", "animation", "entry"]
    },
    exercise: {
      label: "Guided exercise or quiz",
      note: "Students submit answers and get feedback",
      pre: ["entry", "tables"]
    },
    story: {
      label: "Scrollytelling narrative",
      note: "A narrative that advances as the reader scrolls",
      pre: ["animation"]
    },
    media: {
      label: "Video or narrated explainer",
      note: "Screencasts, walkthroughs, or narrated audio",
      pre: ["video", "audio"]
    },
    notebook: {
      label: "Computational notebook",
      note: "Students run or edit code cells",
      pre: ["code", "color", "tables", "math"]
    }
  },

  // ---- platform presets for the using-vs-building split ----------------
  // `custom: true` means the author owns conformance end-to-end (no vendor
  // split, no report link). Otherwise a vendor handles a share and `vpat`
  // points to their accessibility conformance report.
  //
  // `owners` re-assigns individual criteria for that platform, overriding the
  // criterion's default `owner`. Only list a criterion the platform genuinely
  // settles (or genuinely hands back) regardless of what the author does —
  // when it depends on authoring choices, leave it as the default "shared".
  platforms: {
    building: {
      label: "Building something custom",
      custom: true,
      note: "You own the technical conformance end-to-end. Custom D3 / Leaflet / React widgets fail hardest on keyboard operation, focus, and non-visual alternatives — the manual-testing items below are non-negotiable.",
      vpat: null
    },
    arcgis: {
      label: "ArcGIS StoryMaps",
      note: "Esri handles most technical conformance. You still own: alt text on media, narrative prose and headings, color choices in your maps, and reading order of your blocks.",
      vpat: "https://www.esri.com/en-us/legal/accessibility/conformance-reports",
      // Esri builds and ships the template chrome, media player and map
      // widgets; you only pour content into them.
      owners: {
        "1.3.5": "vendor", "1.4.2": "vendor", "1.4.4": "vendor",
        "1.4.10": "vendor", "2.1.1": "vendor", "2.1.2": "vendor",
        "2.4.7": "vendor", "2.4.11": "vendor", "2.5.1": "vendor",
        "2.5.2": "vendor", "2.5.7": "vendor", "2.5.8": "vendor",
        "4.1.2": "vendor", "4.1.3": "vendor",
        // ...but block order is a thing only you can get right.
        "1.3.2": "author"
      }
    },
    observable: {
      label: "Observable",
      custom: true,
      note: "Observable renders your code, so conformance is largely yours as the author — treat it closer to a custom build for the interactive parts, plus your content choices.",
      vpat: null
    },
    notebooks: {
      label: "Jupyter Notebooks",
      custom: true,
      note: "You author the code and its output, so treat rendered and interactive cells like a custom build. You own: alt text on plots, markdown heading structure, color choices, and keeping any ipywidgets keyboard-operable and labeled. Exported HTML also needs its reading order to match your narrative.",
      vpat: null
    },
    rshiny: {
      label: "R Shiny",
      custom: true,
      note: "Shiny gives you input widgets with some built-in semantics, but the app's accessibility is largely yours as the author. You own: input labels and instructions, color choices, plot alt text (and offering the data as a table), keyboard operation of custom outputs, and announcing reactive updates.",
      vpat: null
    },
    quarto: {
      label: "Quarto",
      note: "Quarto generates semantic HTML with strong structural defaults (headings, reflow, real tables). You still own: alt text conveying each figure's finding, color choices, descriptive titles and labels, and captions or transcripts on embedded media.",
      vpat: "https://quarto.org/docs/output-formats/html-accessibility.html",
      // Quarto only ships the theme and the HTML it generates, so its share is
      // small: everything inside a figure or a code cell is still yours.
      owners: {
        "1.4.4": "vendor", "1.4.10": "vendor", "2.4.7": "vendor"
      }
    },
    leaflet: {
      label: "Leaflet",
      custom: true,
      note: "Leaflet is a mapping library, so the map is a custom build and its conformance is yours. Maps fail hardest here: you own keyboard pan/zoom, adequately sized markers and controls, a non-drag alternative, and a text or tabular equivalent of what the map conveys.",
      vpat: null
    }
  }
};
