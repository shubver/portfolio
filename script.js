(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var RESUME = 'assets/Shubham_Verma_Resume_2026.pdf';
  var EMAIL = 'shubham.sv.ver@gmail.com';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function cssVar(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }

  /* ───────────── Theme ───────────── */
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  $('.theme-toggle').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    document.dispatchEvent(new Event('themechange'));
  });

  /* ───────────── Mobile nav ───────────── */
  var burger = $('.nav-burger');
  var mobileNav = $('#mobile-nav');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav.hidden = !open;
  }
  burger.addEventListener('click', function () { setMenu(mobileNav.hidden); });
  $$('a', mobileNav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); burger.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!mobileNav.hidden && !e.target.closest('#site-nav')) setMenu(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });

  /* ───────────── Audience switch ───────────── */
  var AUDIENCES = {
    recruiter: {
      title: 'Lead Data Scientist who builds production AI <em>end to end.</em>',
      bio: "Six years of building AI for industrial asset monitoring. I designed and led the platforms that train, evaluate, deploy and retire thousands of equipment-health models automatically. In 2026 I built the company's agent platform single-handedly and shipped 13 LLM agents in five weeks.",
      primary: { label: 'Download résumé', href: RESUME },
      secondary: { label: 'LinkedIn profile', href: 'https://linkedin.com/in/shubver' }
    },
    developer: {
      title: 'Platforms where reliability comes from <em>configuration, not code.</em>',
      bio: 'My agents are assembled from GraphKit units, our in-house framework over LangGraph, Deep Agents, LiteLLM and Temporal, so every step is durable, traced and costed by default. A Ray job bridge survives head-node crashes. An NER model moved to ONNX Runtime with a custom decoder runs 5× faster at ~50 MB instead of 1 GB. 3,400+ offline tests hold it all in place.',
      primary: { label: 'GitHub profile', href: 'https://github.com/shubver' },
      secondary: { label: 'See the systems', href: '#work' }
    },
    client: {
      title: 'Equipment-health models, <em>from request to running in hours.</em>',
      bio: 'Each model costs about $0.08 of compute to create, is checked against live data before it ships, and is retrained only when it truly degrades. LLM agents write the reports your operators read, and customer data is de-identified before it reaches any model or stored state.',
      primary: { label: 'Email me', href: 'mailto:' + EMAIL },
      secondary: { label: 'LinkedIn', href: 'https://linkedin.com/in/shubver' }
    },
    visitor: {
      title: 'A mechanical engineer who <em>teaches machines to watch machines.</em>',
      bio: 'I studied mechanical engineering, then joined Mechademy in 2020 to work on the health of turbines, pumps and compressors. I went from ML engineer to leading a team of 8, and now I design the systems that keep thousands of equipment models honest.',
      primary: { label: 'Explore the work', href: '#work' },
      secondary: { label: 'Say hello', href: 'mailto:' + EMAIL }
    }
  };

  var heroCopy = $('.hero-copy');
  var audButtons = $$('.audience-options button');

  function setLink(el, cfg) {
    el.textContent = cfg.label;
    el.setAttribute('href', cfg.href);
    var external = /^https?:/.test(cfg.href) || /\.pdf$/.test(cfg.href);
    if (external) { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener noreferrer'); }
    else { el.removeAttribute('target'); el.removeAttribute('rel'); }
  }

  function applyAudience(key, animate) {
    var a = AUDIENCES[key] || AUDIENCES.recruiter;
    audButtons.forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.aud === key)); });
    var render = function () {
      $('.hero-title', heroCopy).innerHTML = a.title;
      $('.hero-bio', heroCopy).textContent = a.bio;
      setLink($('[data-cta="primary"]', heroCopy), a.primary);
      setLink($('[data-cta="secondary"]', heroCopy), a.secondary);
    };
    if (!animate || reduceMotion) { render(); return; }
    heroCopy.classList.add('is-swapping');
    setTimeout(function () { render(); heroCopy.classList.remove('is-swapping'); }, 220);
  }

  audButtons.forEach(function (b, i) {
    b.addEventListener('click', function () {
      applyAudience(b.dataset.aud, true);
      try {
        var url = new URL(window.location.href);
        url.searchParams.set('for', b.dataset.aud);
        history.replaceState(null, '', url);
      } catch (e) {}
    });
    // Arrow-key navigation for the radio group.
    b.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = audButtons[(i + dir + audButtons.length) % audButtons.length];
      next.focus(); next.click();
    });
  });
  function syncRovingTabindex() {
    audButtons.forEach(function (b) { b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1; });
  }
  var initialAud = 'recruiter';
  try { initialAud = new URL(window.location.href).searchParams.get('for') || 'recruiter'; } catch (e) {}
  if (!AUDIENCES[initialAud]) initialAud = 'recruiter';
  applyAudience(initialAud, false);
  syncRovingTabindex();
  audButtons.forEach(function (b) { b.addEventListener('click', syncRovingTabindex); });

  /* ───────────── Wordmark + scroll reveal ───────────── */
  var wordmark = $('.wordmark');
  $$('span', wordmark).forEach(function (s, i) { s.style.setProperty('--i', i); });
  requestAnimationFrame(function () { wordmark.classList.add('is-in'); });

  // Stagger siblings that reveal together.
  $$('.stats, .work-grid, .principles, .seasons, .skill-bands').forEach(function (group) {
    $$('[data-reveal]', group).forEach(function (el, i) { el.style.setProperty('--d', (i % 4) * 80 + 'ms'); });
  });
  $$('.hero [data-reveal]').forEach(function (el, i) { el.style.setProperty('--d', 420 + i * 90 + 'ms'); });

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    $$('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ───────────── Active nav link ───────────── */
  var navLinks = $$('.nav-links a');
  if ('IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { secIO.observe(s); });
  }

  /* ───────────── Generative motifs for the work cards ───────────── */
  function grid() {
    var s = '';
    for (var x = 40; x < 400; x += 40) s += '<line class="m-grid" x1="' + x + '" y1="0" x2="' + x + '" y2="225"/>';
    for (var y = 45; y < 225; y += 45) s += '<line class="m-grid" x1="0" y1="' + y + '" x2="400" y2="' + y + '"/>';
    return s;
  }

  var MOTIFS = {
    // Six-stage loop around a control plane.
    agents: function () {
      var cx = 200, cy = 112, r = 76;
      var labels = ['declare', 'test', 'publish', 'run', 'observe', 'judge'];
      var pts = labels.map(function (_, i) {
        var a = -Math.PI / 2 + i * Math.PI / 3;
        return [cx + Math.cos(a) * r * 1.35, cy + Math.sin(a) * r];
      });
      var s = grid();
      s += '<ellipse class="m-app m-flow" cx="' + cx + '" cy="' + cy + '" rx="' + (r * 1.35) + '" ry="' + r + '" stroke-width="1.4"/>';
      pts.forEach(function (p) { s += '<line class="m-soft" x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke-width=".8" stroke-dasharray="2 4"/>'; });
      s += '<rect class="m-bg m-app" x="' + (cx - 34) + '" y="' + (cy - 16) + '" width="68" height="32" stroke-width="1.2"/>';
      s += '<text x="' + cx + '" y="' + (cy + 3) + '" text-anchor="middle">control</text>';
      pts.forEach(function (p, i) {
        s += '<rect class="m-fill m-pulse" style="animation-delay:' + i * .4 + 's" x="' + (p[0] - 5) + '" y="' + (p[1] - 5) + '" width="10" height="10"/>';
        var below = p[1] > cy + 1, above = p[1] < cy - 1;
        var ty = below ? p[1] + 20 : above ? p[1] - 12 : p[1] + 3;
        var tx = p[0] + (Math.abs(p[1] - cy) < r * 0.6 ? (p[0] > cx ? 14 : -14) : 0);
        var anchor = Math.abs(p[1] - cy) < r * 0.6 ? (p[0] > cx ? 'start' : 'end') : 'middle';
        s += '<text x="' + tx + '" y="' + ty + '" text-anchor="' + anchor + '">' + labels[i] + '</text>';
      });
      return s;
    },
    // A sensor trace with drift, and retrain markers where degradation is real.
    mlloop: function () {
      var s = grid();
      var d = '', band = '', base = [];
      for (var x = 0; x <= 400; x += 4) {
        var drift = x > 250 ? (x - 250) * 0.16 : 0;
        var y = 120 + Math.sin(x / 19) * 13 + Math.sin(x / 7.3) * 4 - drift;
        base.push([x, 120 + Math.sin(x / 19) * 13]);
        d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
      }
      base.forEach(function (p, i) { band += (i ? 'L' : 'M') + p[0] + ' ' + (p[1] - 14).toFixed(1); });
      for (var i = base.length - 1; i >= 0; i--) band += 'L' + base[i][0] + ' ' + (base[i][1] + 14).toFixed(1);
      s += '<path d="' + band + 'Z" class="m-fill" opacity=".08"/>';
      s += '<path d="' + d + '" class="m-app" stroke-width="1.8"/>';
      s += '<line class="m-soft" x1="250" y1="30" x2="250" y2="200" stroke-dasharray="3 4"/>';
      s += '<text x="256" y="40">drift detected</text>';
      s += '<rect class="m-fill m-pulse" x="318" y="93" width="10" height="10"/>';
      s += '<text x="312" y="84" text-anchor="end">retrain</text>';
      s += '<text x="14" y="214">~$0.08 / model</text>';
      [80, 150, 210].forEach(function (x) { s += '<circle class="m-ink" cx="' + x + '" cy="' + (120 + Math.sin(x / 19) * 13 + Math.sin(x / 7.3) * 4).toFixed(1) + '" r="2.4"/>'; });
      return s;
    },
    // Features flow through two gates; a judge decides.
    automl: function () {
      var s = grid();
      s += '<line class="m-soft m-flow" x1="20" y1="112" x2="380" y2="112" stroke-width="1"/>';
      [130, 230].forEach(function (x, k) {
        s += '<line class="m-app" x1="' + (x - 5) + '" y1="52" x2="' + (x - 5) + '" y2="172" stroke-width="1.6"/>';
        s += '<line class="m-app" x1="' + (x + 5) + '" y1="52" x2="' + (x + 5) + '" y2="172" stroke-width="1.6"/>';
        s += '<text x="' + x + '" y="44" text-anchor="middle">' + (k ? 'held-out' : 'gain') + '</text>';
      });
      var seed = [0.2, 0.7, 0.4, 0.9, 0.1, 0.55, 0.8, 0.3, 0.65, 0.45];
      seed.forEach(function (v, i) { s += '<circle class="m-ink" cx="' + (26 + i * 9.5) + '" cy="' + (70 + v * 84).toFixed(0) + '" r="2.6" opacity=".75"/>'; });
      [0, 1, 2, 3, 4, 5].forEach(function (i) {
        var dropped = i === 1 || i === 4;
        s += '<circle class="' + (dropped ? 'm-soft' : 'm-ink') + '" cx="' + (152 + i * 11) + '" cy="' + (dropped ? 186 : 92 + (i % 3) * 14) + '" r="2.6" ' + (dropped ? 'stroke-width="1"' : '') + '/>';
      });
      [0, 1, 2].forEach(function (i) { s += '<circle class="m-fill" cx="' + (256 + i * 12) + '" cy="' + (104 + i * 8) + '" r="3"/>'; });
      s += '<rect class="m-bg m-app" x="312" y="88" width="56" height="48" stroke-width="1.2"/>';
      s += '<circle class="m-app" cx="340" cy="112" r="9" stroke-width="1.2"/><circle class="m-fill m-pulse" cx="340" cy="112" r="3.5"/>';
      s += '<text x="340" y="152" text-anchor="middle">vlm judge</text>';
      return s;
    },
    // Calibrated axes with intersecting performance curves.
    curves: function () {
      var s = grid();
      s += '<path d="M48 22 V190 H372" class="m-soft" stroke-width="1.2"/>';
      for (var t = 0; t <= 5; t++) {
        s += '<line class="m-soft" x1="' + (48 + t * 64) + '" y1="190" x2="' + (48 + t * 64) + '" y2="195"/>';
        s += '<line class="m-soft" x1="43" y1="' + (190 - t * 32) + '" x2="48" y2="' + (190 - t * 32) + '"/>';
      }
      function curve(f) { var d = ''; for (var x = 48; x <= 360; x += 4) d += (x === 48 ? 'M' : 'L') + x + ' ' + f(x).toFixed(1); return d; }
      s += '<path d="' + curve(function (x) { return 50 + Math.pow((x - 48) / 312, 2) * 120; }) + '" class="m-soft" stroke-width="1.4"/>';
      s += '<path d="' + curve(function (x) { return 170 - Math.sin((x - 48) / 312 * Math.PI) * 120; }) + '" class="m-app" stroke-width="2"/>';
      s += '<path d="' + curve(function (x) { return 150 - (x - 48) * 0.28; }) + '" class="m-soft" stroke-width="1.2" stroke-dasharray="5 4"/>';
      for (var x = 64; x <= 352; x += 24) {
        var y = 170 - Math.sin((x - 48) / 312 * Math.PI) * 120;
        s += '<rect class="m-ink" x="' + (x - 2) + '" y="' + (y - 2).toFixed(1) + '" width="4" height="4"/>';
      }
      s += '<text x="372" y="208" text-anchor="end">flow →</text>';
      s += '<text x="56" y="18">R² ≥ 0.95</text>';
      return s;
    }
  };

  $$('svg.motif[data-motif]').forEach(function (svg) { svg.innerHTML = MOTIFS[svg.dataset.motif](); });

  /* ───────────── Case studies ───────────── */
  var CASES = {
    agents: {
      num: '01', kind: 'GenAI platform',
      title: 'Agent Lifecycle Loop',
      meta: 'May 2026 – present · Architect & sole lead engineer',
      challenge: 'Operators needed agents that review model health, diagnostic rules and customer value, across many tenants and without leaking a single client, equipment or sensor name to a model. Built one at a time, every agent would have re-solved hosting, tenancy, privacy, logging and cost on its own.',
      bet: 'Solve those once, in the platform. An agent is a declaration of its prompt, skills, granted tools and permitted tenants, and the platform supplies durability, tracing, cost metering, access control and de-identification from configuration. AI engineers design the flow, and GraphKit takes care of everything else. The first agents were read-only reviewers, where a wrong answer costs a second look rather than a bad action, which let the platform prove itself in production before agents were trusted with more.',
      layers: [
        ['Composition runtime', 'GraphKit', 'Our in-house agent framework: a harness with strict integrations over LangChain, LangGraph, Deep Agents, Langfuse, LiteLLM and Temporal. Every step runs durably and retries on its own.'],
        ['Agent fleet', '13 agents in production', 'From model-health triage to diagnostic-rule review and per-customer value reports, delivered as Markdown, Slack and email, and branded PDF reports.'],
        ['Capability governance', 'Tools through MCP', 'Diagnostic rules, sensor data, events and service requests, and model performance and drift from the data lake. Each agent sees only the tools and tenants it is granted.'],
        ['Control plane', 'Registry, ledger, dashboard', 'An agent registry and a ledger of every run in Postgres, with versioned configs, skills and artifacts in S3. Traces and per-token cost go to Langfuse through LiteLLM.']
      ],
      steps: [
        ['Declare', 'An AI engineer composes the flow from GraphKit units or a prebuilt recipe, then declares its prompts, skills, granted tools and permitted tenants as versioned configuration.'],
        ['Test', '3,400+ offline tests run against the declaration, and cookbook examples execute in CI.'],
        ['Publish', 'The governance layer grants exactly the tools and tenants the agent declared, and nothing else.'],
        ['Run', 'Durable steps retry on their own; customer data is de-identified at the tool boundary before any model sees it.'],
        ['Observe', 'Every run lands in the run ledger, with traces and per-token cost attributed to an owner.'],
        ['Judge', 'Outputs are evaluated, and every production failure becomes a recorded decision and a test.']
      ],
      toolkit: {
        label: 'Built on GraphKit',
        intro: 'GraphKit is the agent framework we built for ourselves. Agents are assembled from prebuilt units, and recipes combine those units into common agent shapes, so building an agent means designing its flow rather than its plumbing.',
        units: ['ReactUnit', 'DeepAgentUnit', 'LLMUnit', 'HumanGateUnit', 'MCPUnit'],
        handles: ['Logging and traces to Langfuse', 'Durable execution on Temporal', 'Artifact handling', 'Memory management', 'Prompt management', 'Cost management through LiteLLM']
      },
      decisions: [
        ['Where privacy lives', 'At the tool boundary, not inside each agent.', 'Every tool call crosses the MCP layer, so de-identification there cannot be skipped by an agent that forgets it. A standalone airlock covers the few paths that do not go through MCP.'],
        ['How tenancy is enforced', 'Three checks that must all agree.', 'A tenant list in each agent\'s config, multi-tenant authentication at the MCP layer, and PII redaction at the same layer. No single misconfiguration exposes another tenant\'s data.'],
        ['What goes where', 'Metadata in Postgres, everything else versioned in S3.', 'The agent registry and run ledger stay small and queryable, while configs, skills and run artifacts stay immutable and cheap, referenced by URL.'],
        ['Runtime vs. dashboard', 'Deployed separately.', 'Agent execution scales and ships on its own schedule, independent of the dashboard UI.'],
        ['How agents are built', 'Assembled from GraphKit units, not written from scratch.', 'Every agent shares one tested harness, so a fix to logging, retries or cost tracking lands in every agent at once, and a new agent is mostly a new flow.'],
        ['What not to build yet', 'No vector store or knowledge base in phase one.', 'The first agents were reviewers with no retrieval need, so retrieval infrastructure was deferred until an agent actually requires it.']
      ],
      impact: [
        '<strong>13 production agents in five weeks</strong>, 8 of them delivering branded PDF reports.',
        'Customer data is de-identified <strong>before it reaches any model or stored state</strong>.',
        'Privacy NER moved to ONNX Runtime with a custom decoder: <strong>5× faster, ~50 MB instead of 1 GB</strong>, identical output.',
        '<strong>Every token has an owner and a price</strong>; every agent step retries on its own.',
        '<strong>64 architecture decision records</strong> and <strong>3,400+ offline tests</strong>.'
      ],
      stack: ['Python', 'GraphKit (in-house)', 'LangChain', 'LangGraph', 'Deep Agents', 'Temporal', 'MCP', 'LiteLLM', 'Langfuse', 'Django', 'Next.js', 'Postgres', 'S3', 'GLiNER / Presidio', 'ONNX Runtime', 'Helm / EKS'],
      color: ['--app-blue', '--app-blue-ink']
    },
    mlloop: {
      num: '02', kind: 'MLOps platform',
      title: 'ML Lifecycle Loop',
      meta: 'Self-running platform · Design & engineering lead',
      challenge: 'Each equipment-health model needed an engineer to derive features, pick training data and babysit runs. Headcount grew with model count, and turnaround was measured in weeks.',
      bet: 'Turn model creation from an engineer-bound problem into a compute-bound one. Encode domain expertise once, as SME-validated feature definitions in a feature store, so onboarding a new client becomes a lookup instead of a fresh derivation. Compute is cheap and expert time is not, so spend compute on iteration and keep people for the cases that need judgement.',
      steps: [
        ['Feature definitions', 'SME-validated, reusable feature definitions served from a feature store.'],
        ['Regime selection', 'Choosing the operating regimes to train on is a first-class step and the biggest single accuracy lever.'],
        ['Distributed training', 'Jobs reach a Ray cluster through a crash-resilient bridge, so multi-hour runs survive head-node failures.'],
        ['Validate & deploy', 'Every model is checked before it ships (see Evaluation-Driven AutoML).'],
        ['Drift backbone', 'Four statistical tests in a layered decision: ignore transient blips, correct systematic bias without retraining, retrain only on real degradation.'],
        ['Retrain', 'The loop closes itself, and people are pulled in only when needed.']
      ],
      impact: [
        '<strong>~$0.08 of compute per model</strong>; headcount no longer scales with model count.',
        'Regime selection: <strong>roughly 30–50% better than generic AutoML</strong>.',
        'Model turnaround cut <strong>from weeks to hours</strong>.',
        'Multi-hour training runs survive head-node failures.'
      ],
      stack: ['Python', 'Ray (KubeRay)', 'Dagster', 'MLflow', 'XGBoost', 'LightGBM', 'PyTorch', 'TimescaleDB', 'Iceberg on S3', 'Gemini'],
      color: ['--app-teal', '--app-teal-ink']
    },
    automl: {
      num: '03', kind: 'Evaluation',
      title: 'Evaluation-Driven AutoML',
      meta: 'AutoML where evaluation decides · Design lead',
      challenge: "Some features look strong at training time and fall apart on held-out data. Some models pass every numeric metric and still visibly mistrack live equipment. Plain AutoML ships both.",
      bet: 'Let evaluation decide what survives at every stage. Separate how much a feature helps in training from whether it generalises, add physical domain judgement without exposing client identifiers, and make every model pass a reviewer that looks at its predictions against live data the way an engineer would.',
      steps: [
        ['Gate 1: training gain', 'Rank candidate features by how much they help the model during training.'],
        ['Gate 2: generalisation', 'Keep only features that hold up under cross-validation on held-out data.'],
        ['LLM feature selection', 'Multiple passes add physical domain judgement, reasoning only over masked, generic feature types.'],
        ['Train', 'Gradient-boosted models on the surviving features.'],
        ['VLM as judge', 'A vision-language model reviews each model against recent live data.'],
        ['Route', 'Deploy, retrain or escalate to a person.']
      ],
      impact: [
        'Cuts features that <strong>look strong but fail on held-out data</strong>.',
        'Catches models that <strong>pass numeric metrics but visibly mistrack</strong>.',
        'LLMs never see client or facility identifiers.'
      ],
      stack: ['Python', 'Gemini', 'XGBoost', 'LightGBM', 'scikit-learn', 'Ray', 'MLflow'],
      color: ['--app-violet', '--app-violet-ink']
    },
    curves: {
      num: '04', kind: 'Computer vision',
      title: 'Curve Digitizer',
      meta: 'Production CV pipeline · Design & engineering lead',
      challenge: 'Critical engineering data, such as equipment performance curves, existed only as scanned graphs. Digitising them by hand blocked downstream models and simulations, and off-the-shelf digitisers fail when curves intersect.',
      bet: 'Use a foundation model for each sub-problem instead of one model for everything, wrap them in deterministic signal processing, and accept nothing that fails a hard numeric gate.',
      steps: [
        ['Calibrate', 'A vision-LLM reads the axes and units.'],
        ['Segment', 'SAM lifts each curve out of the scan.'],
        ['Process', 'A 10-stage signal-processing chain turns pixels into clean numeric series.'],
        ['Separate', 'Direction-aware separation untangles intersecting curves.'],
        ['Gate', 'Output is accepted only at R² ≥ 0.95.'],
        ['Fallback', 'A fast human-in-the-loop path handles whatever is left.']
      ],
      impact: [
        'Unlocked engineering data that <strong>existed only as scanned graphs</strong>.',
        'Removed a manual digitisation step that <strong>blocked downstream models and simulations</strong>.',
        'Handles <strong>intersecting curves</strong>, where off-the-shelf digitisers fail.'
      ],
      stack: ['Python', 'SAM', 'Gemini', 'OpenCV', 'FastAPI', 'AWS EKS'],
      color: ['--app-coral', '--app-coral-ink']
    }
  };

  var dialog = $('.case');
  var lastTrigger = null;

  function el(tag, html) { var e = document.createElement(tag); e.innerHTML = html; return e; }

  function openCase(key, trigger) {
    var c = CASES[key];
    if (!c) return;
    dialog.style.setProperty('--app', 'var(' + c.color[0] + ')');
    dialog.style.setProperty('--app-ink', 'var(' + c.color[1] + ')');
    $('.case-num', dialog).textContent = c.num;
    $('.case-kind', dialog).textContent = c.kind;
    $('.case-title', dialog).textContent = c.title;
    $('.case-meta', dialog).textContent = c.meta;
    $('.case-challenge-text', dialog).textContent = c.challenge;
    $('.case-bet', dialog).textContent = c.bet;
    $('.case-motif', dialog).innerHTML = MOTIFS[key]();

    var pipe = $('.pipeline', dialog); pipe.innerHTML = '';
    c.steps.forEach(function (s) {
      var li = document.createElement('li');
      var d = document.createElement('div'); d.className = 'step';
      var b = document.createElement('b'); b.textContent = s[0];
      var sp = document.createElement('span'); sp.textContent = s[1];
      d.appendChild(b); d.appendChild(sp); li.appendChild(d); pipe.appendChild(li);
    });
    var imp = $('.impact', dialog); imp.innerHTML = '';
    c.impact.forEach(function (h) { imp.appendChild(el('li', '<span>' + h + '</span>')); });
    function text(tag, cls, t) { var e = document.createElement(tag); if (cls) e.className = cls; e.textContent = t; return e; }

    // Optional sections: only rendered for cases that define them.
    var layersBlock = $('.case-layers-block', dialog), layers = $('.layers', dialog);
    layers.innerHTML = '';
    layersBlock.hidden = !c.layers;
    (c.layers || []).forEach(function (l) {
      var d = document.createElement('div'); d.className = 'layer';
      d.appendChild(text('p', 'hud-label', l[0]));
      d.appendChild(text('b', '', l[1]));
      d.appendChild(text('p', '', l[2]));
      layers.appendChild(d);
    });
    var kitBlock = $('.case-toolkit-block', dialog);
    kitBlock.hidden = !c.toolkit;
    if (c.toolkit) {
      $('.toolkit-label', kitBlock).textContent = c.toolkit.label;
      $('.toolkit-intro', kitBlock).textContent = c.toolkit.intro;
      var units = $('.toolkit-units', kitBlock); units.innerHTML = '';
      c.toolkit.units.forEach(function (u) { units.appendChild(text('li', '', u)); });
      units.appendChild(text('li', 'more', '+ more'));
      var handles = $('.toolkit-handles', kitBlock); handles.innerHTML = '';
      c.toolkit.handles.forEach(function (h) { handles.appendChild(text('li', '', h)); });
    }

    var decBlock = $('.case-decisions', dialog), decs = $('.decisions', dialog);
    decs.innerHTML = '';
    decBlock.hidden = !c.decisions;
    (c.decisions || []).forEach(function (q) {
      var li = document.createElement('li'); li.className = 'decision';
      li.appendChild(text('p', 'hud-label decision-q', q[0]));
      li.appendChild(text('p', 'decision-a', q[1]));
      li.appendChild(text('p', 'decision-why', q[2]));
      decs.appendChild(li);
    });

    var st = $('.case-stack', dialog); st.innerHTML = '';
    c.stack.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; st.appendChild(li); });

    lastTrigger = trigger || null;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    document.body.classList.add('no-scroll');
    var scroller = $('.case-scroll', dialog);
    scroller.scrollTop = 0;
    // Focus the content rather than the close button, so no focus ring flashes on open
    // and arrow keys / Page Down scroll the case study straight away.
    scroller.focus({ preventScroll: true });
    try { history.replaceState(null, '', '#case-' + key); } catch (e) {}
  }

  function closeCase() {
    if (dialog.open) { if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); }
  }
  dialog.addEventListener('close', function () {
    document.body.classList.remove('no-scroll');
    try { history.replaceState(null, '', window.location.pathname + window.location.search + '#work'); } catch (e) {}
    if (lastTrigger) lastTrigger.focus();
  });
  $('.case-close', dialog).addEventListener('click', closeCase);
  dialog.addEventListener('click', function (e) { if (e.target === dialog) closeCase(); });

  $$('.work-card').forEach(function (card) {
    var btn = $('.card-open', card);
    card.addEventListener('click', function () { openCase(card.dataset.project, btn); });
  });

  var hashCase = (window.location.hash.match(/^#case-(\w+)/) || [])[1];
  if (hashCase && CASES[hashCase]) openCase(hashCase, $('.work-card[data-project="' + hashCase + '"] .card-open'));

  /* ───────────── Blog ─────────────
     Add posts here, newest first. While this list is empty the section
     shows its "on the way" state. Example entry:
     { title: 'Retries are a platform concern', url: 'https://…',
       date: '2026-11-02', summary: 'Why agent steps should never own their own retry logic.',
       tags: ['Temporal', 'Agents'], readTime: '8 min' } */
  var POSTS = [];

  function renderPosts() {
    var wrap = $('.posts');
    if (!wrap || !POSTS.length) return;
    var grid = document.createElement('div');
    grid.className = 'posts-grid';
    POSTS.forEach(function (p, i) {
      var a = document.createElement('a');
      a.className = 'post';
      a.href = p.url;
      if (/^https?:/.test(p.url)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }

      var meta = document.createElement('div');
      meta.className = 'post-meta hud-label';
      var d = document.createElement('span');
      d.textContent = p.date ? new Date(p.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : String(i + 1).padStart(2, '0');
      var rt = document.createElement('span');
      rt.className = 'faint';
      rt.textContent = p.readTime || '';
      meta.appendChild(d); meta.appendChild(rt);

      var h = document.createElement('h3'); h.className = 'h3'; h.textContent = p.title;
      a.appendChild(meta); a.appendChild(h);
      if (p.summary) { var s = document.createElement('p'); s.className = 'muted'; s.textContent = p.summary; a.appendChild(s); }
      if (p.tags && p.tags.length) {
        var ul = document.createElement('ul'); ul.className = 'chips';
        p.tags.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
        a.appendChild(ul);
      }
      var more = document.createElement('span'); more.className = 'post-read';
      more.innerHTML = 'Read post <span aria-hidden="true">→</span>';
      a.appendChild(more);
      grid.appendChild(a);
    });
    wrap.innerHTML = '';
    wrap.appendChild(grid);
    var count = $('.blog-count');
    if (count) count.textContent = POSTS.length + (POSTS.length === 1 ? ' post' : ' posts');
  }
  renderPosts();

  /* ───────────── Copy email ───────────── */
  var toast = $('.toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 1800);
  }
  $$('.copy-email').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.dataset.email;
      var done = function () { showToast('Address copied'); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { showToast(text); });
      else showToast(text);
    });
  });

  $$('.year').forEach(function (y) { y.textContent = new Date().getFullYear(); });

  /* ───────────── Hero canvas: drifting sensor traces ───────────── */
  var canvas = $('.hero-canvas');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, DPR = 1, colors = {};
  var traces = [];

  function readColors() {
    colors = { line: cssVar('--line'), strong: cssVar('--line-strong'), accent: cssVar('--accent'), faint: cssVar('--faint') };
  }
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var n = W < 640 ? 4 : 6;
    traces = [];
    for (var i = 0; i < n; i++) {
      traces.push({
        y: H * (0.12 + 0.76 * (i + 0.5) / n),
        amp: 8 + (i % 3) * 5,
        f1: 0.006 + i * 0.0013, f2: 0.021 + i * 0.002,
        speed: 0.35 + (i % 4) * 0.12,
        phase: i * 1.7,
        anomalyAt: 0.25 + ((i * 0.37) % 0.6)
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    // Vertical rulers, like a chart recorder.
    ctx.strokeStyle = colors.line; ctx.lineWidth = 1;
    var off = reduceMotion ? 0 : (t * 0.02) % 80;
    for (var x = -off; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(Math.round(x) + .5, 0); ctx.lineTo(Math.round(x) + .5, H); ctx.stroke(); }

    traces.forEach(function (tr, k) {
      var shift = reduceMotion ? 0 : t * 0.03 * tr.speed;
      ctx.beginPath();
      ctx.strokeStyle = colors.strong; ctx.lineWidth = 1.1;
      var spikeX = (((tr.anomalyAt * W) - shift * 0.6) % (W + 200) + W + 200) % (W + 200) - 100;
      for (var x = 0; x <= W; x += 3) {
        var u = x + shift;
        var y = tr.y + Math.sin(u * tr.f1 + tr.phase) * tr.amp + Math.sin(u * tr.f2) * tr.amp * 0.3;
        var dx = x - spikeX;
        y -= Math.exp(-(dx * dx) / 180) * 26;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Anomaly marker.
      if (spikeX > 0 && spikeX < W) {
        var sy = tr.y + Math.sin((spikeX + shift) * tr.f1 + tr.phase) * tr.amp - 26;
        ctx.fillStyle = colors.accent;
        ctx.fillRect(spikeX - 3, sy - 14, 6, 6);
        ctx.font = '500 9px "Geist Mono", ui-monospace, monospace';
        ctx.fillStyle = colors.faint;
        ctx.fillText('CH-' + String(k + 1).padStart(2, '0') + ' Δ', spikeX + 8, sy - 8);
      }
    });
  }

  var running = true, raf;
  function loop(t) { draw(t); if (running) raf = requestAnimationFrame(loop); }
  readColors(); resize();
  if (reduceMotion) { draw(0); }
  else {
    raf = requestAnimationFrame(loop);
    // Pause when the hero is off-screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!vis) { running = false; cancelAnimationFrame(raf); }
      }).observe(canvas);
    }
  }
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { resize(); if (reduceMotion) draw(0); }, 120); });
  var onTheme = function () { readColors(); if (reduceMotion) draw(0); };
  document.addEventListener('themechange', onTheme);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onTheme);
})();
