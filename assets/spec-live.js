/* spec-live.js - the spec-quality scorer (PM session b5)

   Five levers, one PRD, six checks. Each lever adds one kind of input to what the drafter is
   given; the lab then SCORES the resulting spec against the six things that actually predict
   whether a build goes well:

     1. problem evidenced      is there a real signal, with a source, or just an assertion?
     2. user named             a specific segment, or "users"?
     3. success measurable     a named metric with a baseline and a target, or "improve engagement"?
     4. non-goals stated       is the boundary written down?
     5. edge cases decided     are the awkward paths answered, or left to the engineer at 4pm?
     6. trade-off explicit     does it say what is being given up, or does everything win?

   Honesty rail: the DRAFTING is scripted - five recorded specs, one per lever rung, because
   there is no model call in this page. The SCORING is real: it parses the spec text against the
   six checks below, and it will score anything you paste into the box - your own PRD included.
   That is the point of the "score your own" mode.

   Markup: <div id="spec-lab"></div>
*/

(function () {
  var host = document.getElementById("spec-lab");
  if (!host) return;

  /* ---------------------------------------------------------------- the six checks

     Each check is a real test over the spec text. They are deliberately shallow - a regex
     cannot judge whether your metric is the RIGHT metric - and the page says so. What they can
     do reliably is catch absence, which is what the ungrounded drafts suffer from.            */

  var CHECKS = [
    {
      id: "evidenced",
      label: "Problem evidenced",
      weight: 20,
      why: "A problem with no signal behind it cannot be prioritised against anything else.",
      fail: "The problem is asserted, not evidenced. No source, no number, no quote.",
      pass: "The problem cites a signal you could go and check.",
      test: function (text) {
        var hasSource = /(interview|ticket|survey|analytics|support|churn survey|sales call|data|nps|log|session recording)/i.test(text);
        var hasNumber = /\b\d+(\.\d+)?\s*(%|percent|of \d+|users|customers|accounts|respondents|tickets|interviews)\b/i.test(text);
        var hasQuote = /["“][^"”]{18,}["”]/.test(text);
        var n = (hasSource ? 1 : 0) + (hasNumber ? 1 : 0) + (hasQuote ? 1 : 0);
        return { hit: n >= 2, detail: n === 0 ? "no source, no number, no quote"
                 : n === 1 ? "one weak signal only" : "source plus a number or a verbatim" };
      }
    },
    {
      id: "user",
      label: "User named",
      weight: 15,
      why: "\"Users\" is not a segment. If you cannot name who, you cannot say who it is not for.",
      fail: "The user is generic - \"users\", \"customers\", \"people\".",
      pass: "A specific segment, in the words the business uses.",
      test: function (text) {
        var generic = /\b(users|customers|people|everyone|our users)\b/i;
        var specific = /(team admin|workspace admin|solo consultant|self-serve|free-tier|trial user|enterprise buyer|account owner|team lead|first-time|power user|contractor|recruiter|consultant)/i;
        var hasSpecific = specific.test(text);
        var onlyGeneric = generic.test(text) && !hasSpecific;
        return { hit: hasSpecific, detail: hasSpecific ? "a named segment appears"
                 : onlyGeneric ? "only generic nouns for the user" : "no user named at all" };
      }
    },
    {
      id: "measurable",
      label: "Success measurable",
      weight: 20,
      why: "A target without a baseline is a wish. A metric without a number is a mood.",
      fail: "Success is directional - improve, increase, better - with nothing to measure it against.",
      pass: "A named metric with a baseline and a target.",
      test: function (text) {
        var metric = /(activation rate|retention|conversion|time to|completion rate|churn|adoption|d7|d30|week-1|nps|csat|tickets per|% of \w+ who)/i.test(text);
        var baseline = /(today|currently|baseline|now at|from)\s*[^.]{0,24}\d/i.test(text);
        var target = /(to|reach|target of|at least)\s*[^.]{0,18}\d+(\.\d+)?\s*(%|pp|percentage points|days|hours|minutes|seconds)/i.test(text);
        var vague = /(improve|increase|better|boost|enhance) (engagement|experience|satisfaction|usage)/i.test(text);
        var n = (metric ? 1 : 0) + (baseline ? 1 : 0) + (target ? 1 : 0);
        return { hit: n >= 2 && !(n < 3 && vague),
                 detail: n === 0 ? "no metric, no baseline, no target"
                   : n === 3 ? "metric, baseline and target all present"
                   : "partial - " + (metric ? "metric named" : "no metric named") +
                     (baseline ? ", baseline given" : ", no baseline") };
      }
    },
    {
      id: "nongoals",
      label: "Non-goals stated",
      weight: 15,
      why: "The boundary is the cheapest scope control there is, and it costs one paragraph.",
      fail: "No non-goals. Everything adjacent is now arguably in scope.",
      pass: "An explicit not-doing list.",
      test: function (text) {
        var hit = /(non-goal|not in scope|out of scope|we are not|will not|explicitly not|deliberately not)/i.test(text);
        return { hit: hit, detail: hit ? "an explicit boundary is written down" : "nothing marked out of scope" };
      }
    },
    {
      id: "edges",
      label: "Edge cases decided",
      weight: 15,
      why: "Undecided edges get decided by whoever is coding at 4pm on Friday, silently.",
      fail: "The happy path only. The awkward paths are left open.",
      pass: "The awkward paths are answered in the spec.",
      test: function (text) {
        var markers = /(edge case|what happens if|if the user|when there is no|empty state|offline|fails|expired|duplicate|permission|over the limit|first run)/gi;
        var hits = (text.match(markers) || []).length;
        return { hit: hits >= 3, detail: hits === 0 ? "no edge cases mentioned"
                 : hits + " edge condition" + (hits === 1 ? "" : "s") + " addressed" };
      }
    },
    {
      id: "tradeoff",
      label: "Trade-off explicit",
      weight: 15,
      why: "A spec where nothing is given up is a spec that has not been decided yet.",
      fail: "No trade-off. Every option wins, which means none was chosen.",
      pass: "It says what is being given up, and why that is acceptable.",
      test: function (text) {
        var hit = /(trade-?off|we chose|instead of|at the cost of|we are accepting|rejected|we considered .{0,40} but|in exchange for|sacrific)/i.test(text);
        return { hit: hit, detail: hit ? "a choice and its cost are stated" : "no alternative considered or rejected" };
      }
    }
  ];

  /* ---------------------------------------------------------------- the five rungs

     Each rung is a recorded spec: what the drafter produces when you give it that much and no
     more. They get longer, but length is not what moves the score - what moves it is that each
     new input lets the draft answer a question it previously had to invent an answer to.       */

  var RUNGS = [
    {
      id: "idea",
      label: "Raw idea only",
      given: "One sentence from a stakeholder. Nothing else.",
      prompt: "\"We should add AI meeting summaries to Cadence.\"",
      spec:
"# PRD: AI Meeting Summaries\n\n" +
"## Problem\n" +
"Users struggle to remember what was discussed in their meetings. Reviewing full transcripts is\n" +
"time-consuming and many users never return to their notes at all. This is a significant pain\n" +
"point that limits the value users get from Cadence.\n\n" +
"## Solution\n" +
"Add AI-generated meeting summaries. After each recorded meeting, Cadence will produce a concise\n" +
"summary with key points, decisions and action items. Users will be able to read the summary\n" +
"instead of the full transcript.\n\n" +
"## Success\n" +
"This feature will improve engagement and increase user satisfaction. We expect better retention\n" +
"as users find more value in the product.\n\n" +
"## Requirements\n" +
"- Generate a summary automatically after each meeting\n" +
"- Show key points, decisions and action items\n" +
"- Allow the user to copy the summary\n" +
"- Support the languages Cadence already supports\n"
    },
    {
      id: "research",
      label: "+ research quotes",
      given: "Eight interview snippets and the support-ticket tag counts.",
      prompt: "the same sentence, plus 8 interview snippets and 3 months of ticket tags",
      spec:
"# PRD: AI Meeting Summaries\n\n" +
"## Problem\n" +
"In 8 interviews with team admins on paid workspaces, 6 said they never reopen a transcript once\n" +
"the meeting ends. Support tagged 214 tickets as \"cannot find what was decided\" in the last 3\n" +
"months, the second most common tag. One admin put it as: \"I record everything and read none of\n" +
"it, so I still take my own notes in the meeting, which is the thing I was trying to stop doing.\"\n\n" +
"## Solution\n" +
"Add AI-generated meeting summaries. After each recorded meeting, Cadence will produce a summary\n" +
"with key points, decisions and action items, shown above the transcript.\n\n" +
"## Success\n" +
"This feature will improve engagement and increase user satisfaction. We expect better retention\n" +
"as users find more value in the product.\n\n" +
"## Requirements\n" +
"- Generate a summary automatically after each meeting\n" +
"- Show key points, decisions and action items\n" +
"- Allow the user to copy the summary\n"
    },
    {
      id: "metrics",
      label: "+ metric definitions",
      given: "The instrumentation doc: what each metric means, and today's number.",
      prompt: "the above, plus the metric definitions and current baselines",
      spec:
"# PRD: AI Meeting Summaries\n\n" +
"## Problem\n" +
"In 8 interviews with team admins on paid workspaces, 6 said they never reopen a transcript once\n" +
"the meeting ends. Support tagged 214 tickets as \"cannot find what was decided\" in the last 3\n" +
"months, the second most common tag. One admin put it as: \"I record everything and read none of\n" +
"it, so I still take my own notes in the meeting.\"\n\n" +
"## Who this is for\n" +
"Team admins on paid workspaces of 5 to 50 seats. Not solo self-serve users, whose meetings are\n" +
"mostly one-to-one calls where the transcript is short enough to skim.\n\n" +
"## Solution\n" +
"An AI summary shown above the transcript, generated automatically after each recorded meeting.\n\n" +
"## Success\n" +
"Primary: week-1 transcript revisit rate, currently 11% of recorded meetings, target 30%.\n" +
"Secondary: self-reported note-taking during meetings, currently 68% of surveyed admins.\n" +
"Guardrail: transcript accuracy complaints must not rise above today's 1.4% of meetings.\n\n" +
"## Requirements\n" +
"- Generate a summary automatically after each meeting\n" +
"- Show key points, decisions and action items above the transcript\n" +
"- Copy to clipboard\n"
    },
    {
      id: "constraints",
      label: "+ constraints",
      given: "The engineering constraints doc and the retention policy.",
      prompt: "the above, plus platform constraints, cost ceiling and the data-retention policy",
      spec:
"# PRD: AI Meeting Summaries\n\n" +
"## Problem\n" +
"In 8 interviews with team admins on paid workspaces, 6 said they never reopen a transcript once\n" +
"the meeting ends. Support tagged 214 tickets as \"cannot find what was decided\" in the last 3\n" +
"months. One admin: \"I record everything and read none of it.\"\n\n" +
"## Who this is for\n" +
"Team admins on paid workspaces of 5 to 50 seats. Not solo self-serve users.\n\n" +
"## Solution\n" +
"An AI summary above the transcript, generated after each recorded meeting.\n\n" +
"## Success\n" +
"Primary: week-1 transcript revisit rate, currently 11%, target 30%.\n" +
"Guardrail: accuracy complaints stay at or below today's 1.4% of meetings.\n\n" +
"## Decisions on the awkward paths\n" +
"- Meeting under 5 minutes: no summary. The transcript is already shorter than the summary.\n" +
"- Summary generation fails: show the transcript with a retry, never a half-written summary.\n" +
"- What happens if the meeting has no clear decisions: the decisions block is omitted rather\n" +
"  than filled with something invented. This is the one we will get complaints about.\n" +
"- Workspaces on the 30-day retention setting: the summary is deleted with the transcript.\n" +
"- Empty state for a workspace with no recordings yet: no summary panel at all.\n\n" +
"## Cost\n" +
"At the current cost ceiling this runs at roughly 0.02 per meeting, inside the per-seat margin.\n"
    },
    {
      id: "nongoals",
      label: "+ non-goals",
      given: "The scope decision from the product review, written down.",
      prompt: "the above, plus the explicit not-doing list agreed in review",
      spec:
"# PRD: AI Meeting Summaries\n\n" +
"## Problem\n" +
"In 8 interviews with team admins on paid workspaces, 6 said they never reopen a transcript once\n" +
"the meeting ends. Support tagged 214 tickets as \"cannot find what was decided\" in the last 3\n" +
"months, the second most common tag. One admin: \"I record everything and read none of it, so I\n" +
"still take my own notes in the meeting.\"\n\n" +
"## Who this is for\n" +
"Team admins on paid workspaces of 5 to 50 seats. Not solo self-serve users, whose calls are\n" +
"short enough to skim.\n\n" +
"## Solution\n" +
"An AI summary above the transcript, generated after each recorded meeting.\n\n" +
"## Success\n" +
"Primary: week-1 transcript revisit rate, currently 11%, target 30%.\n" +
"Secondary: self-reported in-meeting note-taking, currently 68% of surveyed admins.\n" +
"Guardrail: accuracy complaints stay at or below today's 1.4% of meetings.\n\n" +
"## Non-goals\n" +
"- We are not doing action-item assignment or due dates. That is a task-management feature and\n" +
"  it would put us against the tools these teams already pay for.\n" +
"- Not in scope: summarising across multiple meetings, or any cross-meeting search.\n" +
"- We will not summarise live, mid-meeting. Post-meeting only.\n\n" +
"## Decisions on the awkward paths\n" +
"- Meeting under 5 minutes: no summary. The transcript is shorter than the summary would be.\n" +
"- What happens if generation fails: transcript plus a retry, never a partial summary.\n" +
"- If the user's meeting has no clear decisions: omit the decisions block rather than invent one.\n" +
"  This is the one we will get complaints about, and we are choosing it deliberately.\n" +
"- Workspaces on the 30-day retention setting: the summary is deleted with the transcript.\n" +
"- Empty state before any recording exists: no panel at all.\n\n" +
"## The trade-off we are making\n" +
"We chose post-meeting summaries over live in-meeting notes, at the cost of the demo moment that\n" +
"sales asked for. Live notes need a streaming pipeline we do not have, and the research says the\n" +
"pain is after the meeting, not during it. We are accepting that this launches without the\n" +
"feature the sales team wanted most.\n"
    }
  ];

  var state = { rung: 0, custom: false, customText: "" };

  /* ---------------------------------------------------------------- scoring */

  function score(text) {
    var results = CHECKS.map(function (c) {
      var r = c.test(text);
      return { id: c.id, label: c.label, weight: c.weight, hit: r.hit, detail: r.detail,
               why: c.why, msg: r.hit ? c.pass : c.fail };
    });
    var total = results.reduce(function (sum, r) { return sum + (r.hit ? r.weight : 0); }, 0);
    return { results: results, total: total, passed: results.filter(function (r) { return r.hit; }).length };
  }

  /* ---------------------------------------------------------------- UI */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  var wrap = el("div", "lab");

  var bar = el("div", "lab-bar");
  bar.appendChild(el("span", "lab-dot"));
  bar.appendChild(el("span", "lab-title", "Spec-quality scorer - the scoring is real"));
  bar.appendChild(el("span", "lab-spacer"));
  var ownBtn = el("button", "lab-btn", "Score your own spec");
  var ladderBtn = el("button", "lab-btn primary", "Run the whole ladder");
  ownBtn.type = ladderBtn.type = "button";
  bar.appendChild(ownBtn); bar.appendChild(ladderBtn);
  wrap.appendChild(bar);

  var levers = el("div", "lab-levers");
  var leverInputs = [];
  RUNGS.forEach(function (rung, i) {
    var label = el("label", "lab-lever");
    var input = document.createElement("input");
    input.type = "radio"; input.name = "spec-rung"; input.value = String(i);
    input.checked = i === 0;
    leverInputs.push(input);
    label.appendChild(input);
    var body = el("span", "lab-lever-body");
    body.appendChild(el("b", null, (i + 1) + " · " + rung.label));
    body.appendChild(el("span", null, rung.given));
    label.appendChild(body);
    input.addEventListener("change", function () {
      state.rung = i; state.custom = false; render();
    });
    levers.appendChild(label);
  });
  wrap.appendChild(levers);

  var customBox = el("div", "lab-custom");
  customBox.style.display = "none";
  var ta = document.createElement("textarea");
  ta.className = "lab-textarea";
  ta.rows = 12;
  ta.spellcheck = false;
  ta.placeholder = "Paste a real PRD here - yours, or one from your team - and press Score. " +
    "The six checks below run over the actual text.";
  var scoreOwnBtn = el("button", "lab-btn primary", "Score this");
  scoreOwnBtn.type = "button";
  customBox.appendChild(el("span", "lab-block-label", "Your spec"));
  customBox.appendChild(ta);
  customBox.appendChild(scoreOwnBtn);
  wrap.appendChild(customBox);

  var out = el("div", "lab-output");
  wrap.appendChild(out);

  var ladder = el("div", "lab-scorecard");
  wrap.appendChild(ladder);

  wrap.appendChild(el("p", "lab-rail",
    "The drafting is recorded, not live: five specs, one per rung, because there is no model " +
    "call on this page. The scoring is real - it parses the spec text against the six checks, " +
    "which is why \"Score your own spec\" works on a PRD this page has never seen. And the " +
    "checks are deliberately shallow: they catch absence, not quality. A regex cannot tell you " +
    "whether your metric is the right metric. That judgement is the job."));

  host.appendChild(wrap);

  function renderScore(text, heading) {
    var s = score(text);
    out.innerHTML = "";
    out.appendChild(el("p", "lab-q", heading));

    var band = s.total >= 85 ? "win" : s.total >= 50 ? "" : "lose";
    var head = el("div", "lab-score-head");
    var box = el("div", "lab-scorebox " + (s.total >= 85 ? "ok" : "bad"));
    box.appendChild(el("span", "lab-scorebox-label", "Spec score"));
    box.appendChild(el("span", "lab-scorebox-value", s.total + "/100"));
    box.appendChild(el("span", "lab-scorebox-note",
      s.passed + " of 6 checks passed · " + text.split("\n").length + " lines of spec"));
    head.appendChild(box);
    var box2 = el("div", "lab-scorebox " + (s.passed === 6 ? "ok" : "bad"));
    box2.appendChild(el("span", "lab-scorebox-label", "Signable?"));
    box2.appendChild(el("span", "lab-scorebox-value", s.passed === 6 ? "yes" : "not yet"));
    box2.appendChild(el("span", "lab-scorebox-note", s.passed === 6
      ? "an engineer could start on this without guessing"
      : "someone downstream will have to invent " + (6 - s.passed) + " decision" +
        (6 - s.passed === 1 ? "" : "s")));
    head.appendChild(box2);
    out.appendChild(head);

    var list = el("div", "lab-score-list");
    s.results.forEach(function (r) {
      var row = el("div", "lab-score-row " + (r.hit ? "ok" : "bad"));
      row.appendChild(el("span", "lab-score-id", r.hit ? "pass" : "FAIL"));
      var mid = el("span", "lab-score-q");
      mid.appendChild(el("b", null, r.label + " "));
      mid.appendChild(document.createTextNode("(" + r.weight + " pts) - " + r.msg));
      row.appendChild(mid);
      row.appendChild(el("span", "lab-score-note", r.detail));
      list.appendChild(row);
    });
    out.appendChild(list);

    var verdict = el("div", "lab-verdict " + band);
    if (s.passed === 6) {
      verdict.textContent = "All six. Nothing here has to be invented by somebody else: the " +
        "problem has a source, the user is named, success has a baseline and a target, the " +
        "boundary is written down, the awkward paths are decided, and the spec says what is " +
        "being given up. That last one is what makes it a decision rather than a wish list.";
    } else if (s.total < 50) {
      verdict.textContent = "This reads like a spec and is not one. It is fluent, confident, " +
        "correctly formatted, and it contains almost no decisions - which is exactly what a " +
        "drafting tool produces when you give it a sentence and ask for a document.";
    } else {
      verdict.textContent = s.passed + " of 6. Each remaining failure is a decision that will " +
        "get made anyway, by whoever hits it first, without you in the room.";
    }
    out.appendChild(verdict);

    var specBlock = el("div", "lab-block");
    specBlock.appendChild(el("span", "lab-block-label", "The spec being scored"));
    specBlock.appendChild(el("pre", "lab-sql", text));
    out.appendChild(specBlock);
    return s;
  }

  function render() {
    customBox.style.display = state.custom ? "" : "none";
    levers.style.display = state.custom ? "none" : "";
    if (state.custom) {
      if (state.customText.trim()) {
        renderScore(state.customText, "Your spec, scored");
      } else {
        out.innerHTML = "";
        out.appendChild(el("p", "lab-note",
          "Paste a spec above and press Score this. Nothing is sent anywhere - the checks run " +
          "in your browser, on the text in the box."));
      }
      return;
    }
    var rung = RUNGS[state.rung];
    renderScore(rung.spec, "Rung " + (state.rung + 1) + " · given " + rung.prompt);
  }

  function runLadder() {
    ladder.innerHTML = "";
    ladder.appendChild(el("p", "lab-note",
      "All five rungs scored against the same six checks:"));
    var head = el("div", "lab-score-head");
    RUNGS.forEach(function (rung, i) {
      var s = score(rung.spec);
      if (i === 0 || i === RUNGS.length - 1) {
        var box = el("div", "lab-scorebox " + (i === 0 ? "bad" : "ok"));
        box.appendChild(el("span", "lab-scorebox-label", i === 0 ? "Rung 1 · raw idea" : "Rung 5 · everything"));
        box.appendChild(el("span", "lab-scorebox-value", s.total + "/100"));
        box.appendChild(el("span", "lab-scorebox-note", s.passed + " of 6 checks"));
        head.appendChild(box);
      }
    });
    ladder.appendChild(head);

    var list = el("div", "lab-score-list");
    RUNGS.forEach(function (rung, i) {
      var s = score(rung.spec);
      var prev = i ? score(RUNGS[i - 1].spec) : null;
      var gained = prev ? s.results.filter(function (r, j) { return r.hit && !prev.results[j].hit; })
        .map(function (r) { return r.label; }) : [];
      var row = el("div", "lab-score-row " + (s.passed === 6 ? "ok" : "bad"));
      row.appendChild(el("span", "lab-score-id", s.total + ""));
      row.appendChild(el("span", "lab-score-q", (i + 1) + " · " + rung.label));
      row.appendChild(el("span", "lab-score-note", i === 0
        ? "the baseline: " + s.passed + " of 6"
        : gained.length ? "gained: " + gained.join(", ") : "no new check passed"));
      list.appendChild(row);
    });
    ladder.appendChild(list);
    ladder.appendChild(el("p", "lab-note",
      "Read the gained column, not the score. Each input does one specific job: research makes " +
      "the problem checkable, metric definitions make success measurable, constraints force the " +
      "edges to be decided, and the non-goals list is what finally makes the trade-off explicit. " +
      "The drafter was equally fluent at every rung - what changed is what it was able to stop " +
      "guessing about."));
  }

  ownBtn.addEventListener("click", function () {
    state.custom = !state.custom;
    ownBtn.textContent = state.custom ? "Back to the ladder" : "Score your own spec";
    if (!state.custom) leverInputs[state.rung].checked = true;
    render();
  });
  scoreOwnBtn.addEventListener("click", function () {
    state.customText = ta.value; render();
  });
  ladderBtn.addEventListener("click", runLadder);

  render();
})();
