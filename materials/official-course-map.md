# Source map - learn-ai-pm-with-phoebe

What this course teaches, where each idea comes from, and what it deliberately does not cover.

## The 80% bar

Each session teaches roughly 80% of the working content of its sources - the part a PM uses on a
Tuesday. Certification material, framework taxonomies for their own sake, and vendor tool tours
stay with the originals, and every page says so.

## The boundary, stated on every page that touches it

```
learn-ai-pm                        ->   learn-ai-project-management
discovery to DECISION                   decision to DELIVERY
problem, research, spec, priority,      charter, milestones, WBS, critical path,
metric, trade-off, roadmap narrative    risk register, status reporting, rollout
```

This is the hard scope line of the course. AI + Project Management is already live and owns
delivery; duplicating it would be the easiest mistake to make here, so b10 ends with an explicit
handoff artifact rather than a plan. The two courses are designed as a pair and say so.

Adjacent, deliberately not re-taught:
[learn-metric-decomposition](https://phoebefu6.github.io/learn-metric-decomposition-with-phoebe/)
goes deeper than b7 on driver trees;
[learn-experimentation](https://phoebefu6.github.io/learn-experimentation-with-phoebe/) goes
deeper than b8 on statistics.

## Primary sources

| Source | What we take from it | Where |
|--------|---------------------|-------|
| PRD and spec practice (the spec as a decision record) | what a spec must contain to be signable; sections are where decisions live, not the decisions | b5, a3 |
| Jobs to be done | the job as the unit of demand; why a feature request is not a job | b4 |
| Opportunity-solution-tree thinking (continuous discovery) | outcome to opportunity to solution to experiment; writing down the branch you cut | b4, b2 |
| Continuous-discovery interviewing practice | story-based interviewing, why "would you use it" is not evidence | b2, b3 |
| Research-quality literature (sampling, representativeness, confirmation bias) | why eight friendly interviews pass a completeness check and still mislead | b3, a2 |
| Prioritisation frameworks (RICE, WSJF, cost of delay) | frameworks as lenses; the inputs they quietly require and AI quietly invents | b6, a4 |
| North Star / HEART-style metric frameworks, guardrail metrics | leading vs lagging, the guardrail, one primary metric per decision | b7, a5 |
| Experiment practice (stopping rules, minimum detectable effect, honest readouts) | deciding the rule before the data; the readout that says no | b8, a5 |
| Strategy narrative and roadmap-as-argument practice | the roadmap that survives three stakeholders; dates as consequences not promises | b9 |
| AI-assisted knowledge work: verification cost, automation bias, disclosure | where drafting help is real, where verification exceeds the saving | a1, a2, a6, b1 |

**Re-verify before delivery:** the AI-tooling specifics move fastest. The craft sources above are
stable; anything on this site about what a particular assistant can do should be checked before
teaching from it. Nothing in this course depends on a named vendor.

## Session coverage

Legend: ✓ taught to the 80% bar · ◐ touched, pointer given · - out of scope by design

### Leader track (6 x 45 min, no code)

| # | Session | AI in the job | Evidence | Specs | Priority | Metrics | Org |
|---|---------|---------------|----------|-------|----------|---------|-----|
| a1 | What AI changes in product | ✓ | ◐ | ◐ | - | - | ◐ |
| a2 | The evidence standard | ◐ | ✓ | ◐ | - | - | ◐ |
| a3 | Specs, decisions, accountability | ◐ | ◐ | ✓ | ◐ | ◐ | ◐ |
| a4 | Prioritisation without theatre | ◐ | ◐ | ◐ | ✓ | ◐ | - |
| a5 | Metrics and the honest readout | ◐ | ◐ | - | ◐ | ✓ | ◐ |
| a6 | The AI-assisted product org | ✓ | ◐ | ◐ | - | ◐ | ✓ |

### PM track (10 x 45 min, b10 60)

| # | Session | Discovery | Spec | Priority | Metrics | Ships |
|---|---------|-----------|------|----------|---------|-------|
| b1 | The job, and a governed setup | ◐ | ◐ | - | - | the delegate / never-delegate line, the Cadence brief |
| b2 | From a vague ask to an evidenced problem | ✓ | ◐ | ◐ | ◐ | opportunity brief for the three asks |
| b3 | Research synthesis, and the trap | ✓ | - | - | - | verified themes + the two failures found |
| b4 | Jobs to be done, opportunity tree | ✓ | ◐ | ◐ | - | the tree, with the cut branches written down |
| b5 | The spec, and the scorer | ◐ | ✓ | - | ◐ | a scored, signable PRD |
| b6 | Prioritisation and trade-offs | ◐ | ◐ | ✓ | ◐ | scored backlog + the stated trade-off |
| b7 | Metrics and instrumentation | - | ◐ | ◐ | ✓ | North Star, guardrail, event spec |
| b8 | Experiments and honest readouts | ◐ | - | ◐ | ✓ | the test design + a readout that says no |
| b9 | Roadmap narrative and alignment | ◐ | ◐ | ◐ | ◐ | the narrative + three stakeholder answers |
| b10 | Capstone: one decision, end to end | ✓ | ✓ | ✓ | ✓ | your own item through five checkpoints |

## Not covered, by design

- **Delivery.** Charters, milestones, WBS, critical path, risk registers, status reports, rollout.
  All of it is AI + Project Management, and b10 hands over rather than starting it.
- **Statistical depth on experiments.** b8 teaches the stopping rule and the honest readout.
  Power, variance reduction and sequential testing are learn-experimentation.
- **Metric-tree depth.** b7 sets one North Star and its guardrails; decomposition into driver
  trees is learn-metric-decomposition.
- **Design and UX craft.** Named where it matters and left to the design courses.
- **Pricing and packaging.** A commercial decision with its own literature; b1 explicitly puts
  pricing material on the never-paste list, which is as far as this course goes.
- **Vendor tool tours.** No screenshots of an assistant UI. Anything shown would be stale before
  delivery, and none of the craft depends on which tool you use.
- **Prompt technique.** The sessions show what to put IN (evidence, metric definitions,
  constraints, non-goals) because that is a product decision. Prompt craft is
  learn-prompt-engineering.

## The running project: Cadence

The AI note-taker from the sibling aidm courses - already branded (AI + Branding), campaigned
(AI + Marketing), content-engined (AI + Content) and modelled financially (AI + Finance). Self-serve
plus team and enterprise motions. This course adds the **product-side canon**, used consistently on
every page:

- **Segment in focus:** team admins on paid workspaces of 5 to 50 seats. Explicitly not solo
  self-serve users, whose calls are short enough to skim.
- **The three competing asks:** sales wants live in-meeting notes ("every demo asks for it",
  3 lost deals offered as evidence); support wants post-meeting summaries (214 tickets in 3 months
  tagged "cannot find what was decided", the second most common tag); the CEO wants an agent
  (no evidence offered, hardest to say no to).
- **Signals available on day one:** 8 interviews with paid-workspace admins, 6 of whom never
  reopen a transcript; week-1 transcript revisit rate at 11% of recorded meetings, no target ever
  set; 68% of surveyed admins still take their own notes during meetings.
- **Guardrail:** transcript accuracy complaints currently 1.4% of meetings.
- **The decision the course reaches:** post-meeting summaries over live notes, at the cost of the
  demo moment sales wanted, because the research locates the pain after the meeting rather than
  during it - and live notes need a streaming pipeline that does not exist.

## Verified facts used on the pages

The spec scorer is the one measured artifact, and its numbers come from running it:

- six checks: problem evidenced, user named, success measurable, non-goals stated, edge cases
  decided, trade-off explicit
- the five-rung ladder scores **15 / 35 / 55 / 70 / 100**, and only the top rung is signable
- rung 2 (research) gains *problem evidenced* and *user named*; rung 3 (metric definitions) gains
  *success measurable*; rung 4 (constraints) gains *edge cases decided*; rung 5 (non-goals) gains
  *non-goals stated* **and** *trade-off explicit* - one input fixing two checks
- the three-line "dark mode" spec used in b5's practice section scores **0 of 100**

## Honesty rails used on the pages

- The **drafting** in the lab is recorded, not live: five specs, one per rung, because there is no
  model call on the page. The **scoring is real** - it parses the spec text, which is why "score
  your own spec" works on a PRD the page has never seen.
- The checks catch **absence, not quality**. A complete spec for the wrong problem scores 100, and
  b5 says so in its own self-study card. Judgement is not scoreable, and that is the point.
