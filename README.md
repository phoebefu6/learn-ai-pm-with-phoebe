<!-- phoebe header -->

[![Open the live course](https://img.shields.io/badge/%E2%96%B6%20open%20the%20live%20course-1f6feb?style=for-the-badge)](https://phoebefu6.github.io/learn-ai-pm-with-phoebe/)
[![Star this repo](https://img.shields.io/github/stars/phoebefu6/learn-ai-pm-with-phoebe?style=for-the-badge&label=star%20this%20repo&color=444444)](https://github.com/phoebefu6/learn-ai-pm-with-phoebe/stargazers)
[![Free courses](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fphoebefu6.github.io%2Flearn-with-phoebe%2Fstats.json&query=%24.courses_live&label=free%20courses&style=for-the-badge&color=111111)](https://phoebefu6.github.io/learn-with-phoebe/)

### ▶︎ [Open the live course →](https://phoebefu6.github.io/learn-ai-pm-with-phoebe/)

Free, runs in your browser. No install, no login.

> 📚 Part of **[Learn with Phoebe](https://phoebefu6.github.io/learn-with-phoebe/)** - free, hands-on courses on AI, data, and the craft around them. **[Browse every course ↗](https://phoebefu6.github.io/learn-with-phoebe/)**

<!-- /phoebe header -->
# learn ai product management with phoebe

Decide what to build, and why. A two-track, 16-session course on product management when drafting
is free: a leader track on what AI actually changes and what it cannot touch, and a PM track that
takes one real decision from a vague stakeholder ask to a signable spec with a metric, a boundary
and a stated trade-off.

**Live course:** https://phoebefu6.github.io/learn-ai-pm-with-phoebe/

- **Leader track** (6 x 45 min, no code): what AI changes in product, the evidence standard, specs
  and accountability, prioritisation without theatre, metrics and the honest readout, and the
  AI-assisted product org.
- **PM track** (10 x 45 min, bring a real backlog item): the job and a governed setup, the
  evidenced problem, research synthesis and its trap, jobs to be done and the opportunity tree,
  the spec and the scorer, prioritisation and trade-offs, metrics and instrumentation, experiments
  and honest readouts, the roadmap narrative, and a capstone on your own decision.

## The signature lab: a spec scorer where the scoring is real

Six checks that predict whether a build goes well - **problem evidenced · user named · success
measurable · non-goals stated · edge cases decided · trade-off explicit** - run over the actual
text of a spec.

Five rungs, each adding one kind of input to what the drafter was given:

| Rung | Given | Score | What it gained |
|------|-------|------:|----------------|
| 1 | one sentence | **15** | the baseline: 1 of 6 |
| 2 | + research quotes | **35** | problem evidenced, user named |
| 3 | + metric definitions | **55** | success measurable |
| 4 | + constraints | **70** | edge cases decided |
| 5 | + non-goals | **100** | non-goals stated **and** trade-off explicit |

That last row is the lesson: one input fixes two checks, because writing down what you are not
doing is what forces the trade-off into the open. The two checks that survive longest are the two
that require somebody to give something up.

**The honest split:** the drafting is recorded (five specs, one per rung - there is no model call
on the page). The scoring is real - it parses the spec text, which is why **"Score your own spec"
works on a PRD the page has never seen**. A three-line "dark mode" spec scores 0 of 100; a
genuinely complete one scores 100.

And the checks catch *absence, not quality*. A perfectly complete spec for the wrong problem
scores 100, which session b5 says on its own page. Judgement is not scoreable, and that is the
point of putting the lab inside a course rather than shipping it as a tool.

## The scope line, and why it exists

```
learn-ai-pm                     ->   learn-ai-project-management
discovery to DECISION                decision to DELIVERY
problem, research, spec,             charter, milestones, WBS, critical path,
priority, metric, trade-off          risk register, status reporting, rollout
```

The delivery course is already live and owns all of that, so duplicating it would have been the
easiest mistake here. Session b10 ends with a handoff artifact rather than a plan. The two courses
are designed as a pair and say so on the pages.

Adjacent and deliberately not re-taught: [learn-metric-decomposition](https://phoebefu6.github.io/learn-metric-decomposition-with-phoebe/)
goes deeper than b7 on driver trees, and [learn-experimentation](https://phoebefu6.github.io/learn-experimentation-with-phoebe/)
goes deeper than b8 on statistics.

## The running project: Cadence

The AI note-taker from the sibling applied-AI courses - already branded, marketed, content-engined
and financially modelled elsewhere in the series. This course adds the product-side canon:

- **Segment:** team admins on paid workspaces of 5 to 50 seats. Explicitly not solo self-serve.
- **Three competing asks:** sales wants live in-meeting notes (3 lost deals offered as evidence);
  support wants post-meeting summaries (214 tickets in 3 months tagged "cannot find what was
  decided", the second most common tag); the CEO wants an agent (no evidence offered, hardest to
  refuse).
- **Day-one signals:** 8 interviews where 6 of 8 admins never reopen a transcript; week-1
  transcript revisit rate at 11% with no target ever set; 68% of surveyed admins still take their
  own notes in meetings.
- **The decision the course reaches:** summaries over live notes, at the cost of the demo moment
  sales wanted - because the research locates the pain after the meeting, not during it.

Two of the three asks do not survive being made comparable, which is the process working rather
than failing.

## Repository layout

```
courses/           16 session pages (a1-a6 leader, b1-b10 PM)
assets/
  spec-live.js     the spec scorer: six checks, five rungs, and score-your-own
  style.css        editorial-bold, slate + signal yellow (yellow marks decisions only)
  app.js           progress bar, section dots, journey strip, quizzes, projector zoom
  mindmap.js       the landing-page knowledge map
materials/official-course-map.md   source map, per-session coverage, honest out-of-scope list
```

## Sources

Built from PRD and spec practice, jobs-to-be-done, opportunity-solution-tree thinking, continuous
discovery interviewing, the research-quality literature, prioritisation frameworks as lenses,
North Star and guardrail metric practice, experiment stopping rules, roadmap-as-argument writing,
and the work on verification cost and automation bias in AI-assisted knowledge work. Full mapping
and the deliberate out-of-scope list in
[materials/official-course-map.md](materials/official-course-map.md).

by Phoebe Fu · part of [Learn with Phoebe](https://phoebefu6.github.io/learn-with-phoebe/)
