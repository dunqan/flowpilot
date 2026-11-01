---
type: design
status: draft            # draft | approved
created: 2026-11-01
milestone: "[[M0]]"
tags: [experience, scenarios]
---

# Sample portfolio and scenarios

The shared test bed for [[M0]]. Every design exploration and POC uses this portfolio and these scenarios, so results stay comparable. It is fictional but realistic. Edit it freely as the idea evolves, but change the data here rather than inventing new data per design.

## FVP refresher (the mechanics we must not lose)

1. One long list. New items go to the **end**.
2. **Dot** the first undone item. Scan forward, asking of each item, "Do I want to do this more than the last dotted item?" Dot it if yes. The dotted items form the **chain**.
3. **Work on the last dotted item.** When you stop, it is done (crossed out) or unfinished (crossed out and **re-entered at the end**).
4. Continue scanning from the item after the one just worked, comparing against the new last dotted item. When the chain empties, start again from the first undone item.

There is no triage, no priority field and no review. The list *is* the system. FlowPilot adds several sources, contexts that filter eligibility, and summaries on top.

## Decisions (user interview, 2026-11-01)

These are inputs to the experience overview. The numbers are stable, so designs and POCs can cite them (e.g. "per D5").

**FVP list and pass**
- **D1 — One global list.** There is a single FVP order across all projects and sources. Contexts are filters over it, Mixed is their union in list order, and capture appends to the end.
- **D2 — Comparison in the list, with a pinned benchmark.** The pass happens in the list itself. The last dotted item stays pinned at the top however far you scroll, and the cursor line is highlighted. One key each: dot, next, work. There is no side-by-side duel.
- **D3 — The item you're working on is the last dotted item.** It gets a light highlight, with no separate focus screen. This mirrors the user's Obsidian practice: `- item` is undotted, `- [ ] item` is dotted, and `- [x] item` is done. (This is input for the Markdown task-model spec.)
- **D4 — Re-entry is re-writing, with ghost text.** The new entry at the end opens in edit mode with the original showing as ghost text. Typing starts a fresh rewrite. Enter, Esc or clicking away saves the original unchanged. Tab pulls the ghost text in to tweak it. Nothing can be added empty. The same model applies everywhere an item is re-written: stopping unfinished, reset, leaving waiting, closing from the focus buffer.
- **D5 — Quick actions inside a pass:**
  - *Fix in place*, for typos and technical fixes only.
  - *Re-write to end*, for any real change. A changed item is a re-entered item.
  - *Done*, which also means "nothing to do with it", so there is no delete.
  - *Waiting* and *someday*, set in one keystroke.
  - There is no merge: mark the duplicate done.
- **D6 — Reset.** One action marks every dotted item done in place and re-writes them at the end, last-dotted first (chain P4 → P15 → P31 appends P31, P15, P4), using the ghost-text model from D4. The chain empties, and the next pass starts at the first undone item.
- **D7 — Done items clear** by a *clear done* action or automatically after a configurable delay (e.g. 4 hours or 1 day). They still count in the summary.
- **D8 — Resume where you stopped.** Opening a list lands at the scan position, with the benchmark pinned.
- **D9 — Old items look like any other.** In FVP, a never-dotted item is simply not wanted yet, so there's no age marker in the list.

**Focus buffer (3T/5T)**
- **D10 — The buffer takes items out of the list.** Moving an item into the 3T/5T buffer crosses it out of the FVP list. Finishing it there marks it done. Closing it from the buffer unfinished re-writes it at the end of the FVP list (D4). The buffer is optional and shares the D3 highlight style.

**Capture, projects, contexts**
- **D11 — A project is an optional wikilink in the item text**, e.g. `- buy shower sealant [[Home]]`. No project is fine. AI may suggest one later (M2).
- **D12 — Context comes from the source, and a project can override it.** Each registered source has a default context, a project may override it, and items without a project follow their source. Nothing is set per item.
- **D13 — Context switch** is an always-visible toggle with one-key shortcuts. Each context keeps its own chain and scan position. Nothing switches automatically.
- **D14 — External changes are applied silently.** A change made elsewhere (e.g. an item completed in Obsidian) is applied with no notice.

**Waiting and dependencies**
- **D15 — Waiting items never come back automatically.** A waiting view lists them with age warnings. Taking one out of waiting re-enters it at the end (D4).
- **D16 — Dependencies are free text only**, written in the item or its notes. They are not modelled.

**Overview and summary**
- **D17 — The overview is its own screen, one key from the list**, and each keeps its own state. Per project it shows last activity, nearest explicit deadline, and open and waiting counts.
- **D18 — Neglect gets quiet emphasis in the overview only.** A project that is idle while a deadline nears stands out in its row. There are no notifications and no badges in the list.
- **D19 — Paused projects** are not eligible in any context. They sit in a collapsed "paused" group in the overview, are never flagged as neglected, and unpause in one action.
- **D20 — The summary is an in-app view** with a period picker. In M1 it shows completions and re-entries per project, with links to the items, plus idle, waiting and deadline signals. Nothing is written to the vault, and there is no time tracking.
- **D21 — Weekly outcomes** are a short Markdown list (e.g. in a week note). They show in the overview and summary, and as a collapsible reminder during a pass. They never filter or order items.

**Deferred to the M1 specs.** These are covered by the Markdown task-model and source-registry specs:
- which file a captured item lands in;
- how dotted, done, re-entered, waiting and someday items map to Markdown;
- what clearing done items (D7) does to the file.

## Sample portfolio

Persona: **Ola**, a freelance software developer with one main client, a side project and a busy personal life. Two sources: a **work vault** (Obsidian) and a **personal folder** (plain Markdown, synced with a phone app).

| Project | Source | Context | State |
|---|---|---|---|
| **Atlas migration** (client) | work vault | Work | Active, the main focus; deadline at the end of the month |
| **Team ops** (client, small recurring stuff) | work vault | Work | Active, noisy |
| **Conference talk** (proposal due in 9 days) | work vault | Work | **No activity for 3 weeks**, the forgotten one |
| **Herb-garden app** (side project) | personal folder | Personal | Active in bursts |
| **Home** (bathroom renovation, errands) | personal folder | Personal | Active, involves waiting on others |
| **Spanish** | personal folder | Personal | **Intentionally paused** until January |

### The list (excerpt in current FVP order, cross-project)

S1–S6 use this short excerpt. The Personal context's full list is much longer (55 items, see [the long Personal list](#appendix--the-long-personal-list-s7)) and is what S7 exercises.

| # | Item | Project | Notes |
|---|---|---|---|
| 1 | ~~Reply to Atlas kickoff email~~ | Atlas | done |
| 2 | Map legacy DB tables to new schema | Atlas | big, re-entered twice already |
| 3 | Review Piotr's PR on auth module | Team ops | |
| 4 | Book plumber for bathroom quote | Home | |
| 5 | Draft talk abstract | Conf. talk | untouched for 3 weeks, deadline in 9 days |
| 6 | Fix CI flake in payments tests | Team ops | |
| 7 | Sketch plant-detail screen | Herb app | |
| 8 | Ask IT for staging DB credentials | Atlas | will become *waiting* |
| 9 | Write migration dry-run script | Atlas | depends on #2 and #8 |
| 10 | Pay electricity bill | Home | due Friday |
| 11 | Update timesheet | Team ops | recurring, weekly |
| 12 | Choose tiles for bathroom | Home | waiting on the contractor's catalogue |
| 13 | Try watering-reminder notification API | Herb app | |
| 14 | Spanish: finish chapter 6 | Spanish | paused, visible but not eligible |
| 15 | Someday: rewrite personal site | — | *someday* state |

## Scenarios

Each scenario has a **story**, what **must feel right**, the **no-maintenance check** (where a GTD-style chore would normally appear, and why none does here), and the **questions it raises** for the overview.

### S1 — Monday morning: where am I?

**Story.** Ola opens FlowPilot with coffee. In a few seconds they see the whole portfolio: Atlas busy, Team ops noisy, Herb app quiet since Thursday, Spanish paused (shown as paused, not as neglected), and the **Conference talk** quietly flagged: *no activity for 3 weeks, proposal due in 9 days*. Ola doesn't plan the week. They pick Work and go straight into FVP.

**Must feel right.** Orientation in under ten seconds without scrolling, and from the overview into FVP in one action. The talk flag is noticeable but not alarming.

**No-maintenance check.** GTD would start with a weekly review. Here the overview *is* the review, it is optional, and it takes seconds.

**Resolved.** D17 (separate overview with last activity, deadline and counts), D18 (quiet emphasis for neglect), D19 (paused projects collapsed).

### S2 — An FVP pass across projects

**Story.** In the Work context, the eligible list is #2, 3, 5, 6, 8, 9, 11 (Home, Herb app and Spanish are hidden). Ola dots #2 (legacy DB mapping). They want #3 (PR review) more, so they dot it. #5 (talk abstract) they want even more, given the deadline, so they dot it. Nothing after #5 beats it. Ola works on the abstract for 40 minutes, then stops unfinished, so it is re-entered at the end. Scanning resumes from #6 against #3.

**Must feel right.** Dotting and comparing are one keystroke or one tap with no dialogs. The question "do I want this more than *that*?" is always visible, with *that* shown clearly. Starting work makes the chosen item the centre of attention, and stopping (done or re-enter) is one action that flows back into scanning.

**Re-entry is re-writing** (D4). When Ola stops the abstract unfinished, a new entry opens at the end of the list in edit mode, with "Draft talk abstract" as ghost text. Clicking away keeps it unchanged. Typing "Tighten abstract to 200 words + pick title" re-writes it. This is part of FVP itself: re-writing keeps items current.

**No-maintenance check.** Nothing to prioritise beforehand. Each item's project shows as context, not as a grouping the user must manage. Items stay current because they get re-written at re-entry, not because of a cleanup session.

**Resolved.** D1 (one global list), D2 (in-list comparison with pinned benchmark), D3 (working item = last dotted, light highlight), D10 (optional 3T/5T buffer).

### S3 — Capture mid-flow

**Story.** While mapping the legacy tables, Ola remembers "ask Marta whether reports need the old IDs" (Atlas) and "buy shower sealant" (Home). They capture both in seconds without leaving the task. Both land at the end of the list: the first in their Work context, the second in Personal. Neither appears in the current pass until scanning reaches the end.

**Must feel right.** Capture is instant and global, its contents are only a sentence, and it never pulls focus away from the current task. The project or context guess is optional and fixable later, in passing.

**No-maintenance check.** No inbox. The item is simply on the list, and if its project is wrong, Ola fixes it when the item comes up in a pass.

**Resolved.** D11 (an optional `[[project]]` wikilink in the text), D12 (context from the source, a project can override). Which file a captured item lands in is deferred to the task-model spec.

### S4 — Something has to wait

**Story.** Scanning reaches #8 (ask IT for staging credentials). Ola sends the request, then marks it **waiting on IT**. It leaves the eligible list and appears in the waiting view. #9 (dry-run script) depends on it, which is noted in its text. Two days later the credentials arrive, Ola takes #8 out of waiting, and it is re-written at the end like any re-entry.

**Must feel right.** Marking something as waiting is as light as dotting. A waiting item never disappears into a list Ola has to remember to check.

**No-maintenance check.** GTD keeps a "Waiting For" list to review weekly. Here waiting is a state with a view you open when you want, and age warnings (in the waiting view, the overview and the summary) surface items that have waited too long.

**Resolved.** D15 (no automatic return, a waiting view with age warnings, re-entry by re-writing), D16 (dependencies are free text).

### S5 — The weekend switch, and edits from elsewhere

**Story.** It is Saturday, and Ola switches to **Personal** with one key. The Work chain (#3, #6) and scan position are kept intact. Personal has its own pass over #4, 7, 10, 12, 13. During the weekend, Ola ticks off "Fix CI flake" (#6) in Obsidian on their phone, because a colleague fixed it. On Monday Ola switches back to Work. #6 is simply gone from the chain, and the benchmark is "Review Piotr's PR".

**Must feel right.** Switching context is instant and lossless. External changes are applied quietly: the list just reflects the files.

**No-maintenance check.** Nothing to reconcile by hand, and no notices to acknowledge.

**Resolved.** D13 (instant toggle, per-context chain and position), D1 (Mixed = union in list order), D14 (silent update).

### S6 — Friday: what actually happened?

**Story.** On Friday afternoon, out of curiosity rather than duty, Ola opens the summary. It says Atlas mapping advanced (re-entered twice, notes grew), the talk abstract got a first draft, Team ops took 30% of completions, Herb app had none, and IT credentials waited two days. The weekly outcome "abstract submitted" has evidence (a draft exists). Ola sets one outcome for next week, "dry-run passes", or none at all.

**Must feel right.** The summary is readable in a minute, and every claim links to its evidence. Setting an outcome is optional and takes seconds.

**No-maintenance check.** There is no review session. The summary is offered and never required, and skipping it costs nothing.

**Resolved.** D20 (in-app view: completions and re-entries per project, plus idle, waiting and deadline signals), D21 (outcomes are a Markdown list, visible, with no effect on FVP). "Notes grew" in the story needs edit tracking, which is beyond D20; it stays an M2 (AI) idea.

### S7 — A long Personal list

**Story.** It is Sunday morning, and Ola opens the **Personal** list: 55 items accumulated over months, many of them typed on the phone in shorthand. The chain from yesterday is still there: dotted P4 (book plumber), then P15 (Kasia's birthday gift), then P31 (insurance photos), and scanning stopped around P38. Ola picks up exactly there, scanning items they barely remember writing: "lightbulb hallway", "dr?", "that thing for Ania". Some items have sat untouched near the top for months (P6, sort out photo backup) and get passed over every time. Two items are clearly the same thing written twice (P31 and P44, insurance). A few were re-entered so often that they cluster at the end. Ola wants to work through 15–20 comparisons quickly, mostly "no, no, no, yes", without losing track of what the current dotted item is, even though it sits 30 items further up.

**Must feel right.** Scanning a long list is fast and rhythmic, with one key per decision and no lag at 50 or 500 items. The benchmark stays pinned in view, however far away it is in the list. On reopening, Ola lands exactly where they stopped. Done items don't bury the live ones. A vague item can be fixed in place (a typo) or re-written to the end (a real change), and a duplicate is simply marked done, all without breaking the pass.

**No-maintenance check.** In GTD this list would demand a cleanup session. Here, cleaning happens one item at a time as the pass reaches it, and the pass never stops for tidying. Old items look like any other (D9), and nothing forces a decision about them.

**Resolved.** D2 (pinned benchmark), D5 (quick actions: fix in place, re-write to end, done, waiting, someday; no merge or delete), D6 (reset: last-dotted first, ghost-text re-write), D7 (clearing done items), D8 (resume at scan position), D9 (no age marker). How a long list shows in the overview is covered by the counts in D17.

## Appendix — the long Personal list (S7)

The Personal context's eligible view in FVP order. Legend: ~~done~~ · **●** dotted (current chain) · ▸ current scan position · *(re ×N)* re-entered N times · *[waiting]* · *[someday]* · *[paused]* visible but not eligible · *(age)* untouched for that long (sample data only; per D9 the UI shows no age marker). Items from the short excerpt carry its number as `#n`.

1. ~~Renew passport~~
2. ~~Call mum about Christmas plans~~
3. ~~Return the wrong-size jacket~~
4. **●** Book plumber for bathroom quote `#4`
5. ~~Set up herb-app repo~~
6. Sort out photo backup *(4 months)*
7. Sketch plant-detail screen `#7`
8. ~~Dentist appointment~~
9. Read DDIA chapter 4 *(3 months)*
10. Pay electricity bill, due Friday `#10`
11. Choose tiles for bathroom *[waiting: contractor's catalogue]* `#12`
12. Try watering-reminder notification API `#13`
13. Spanish: finish chapter 6 *[paused]* `#14`
14. Fix bike brakes
15. **●** Plan Kasia's birthday gift (birthday in 12 days)
16. ~~Cancel unused streaming subscription~~
17. Research standing desks *(2 months)*
18. Clean out garage shelf
19. Ask neighbour about shared fence
20. Herb app: decide on plant database source
21. ~~Book car service~~
22. Update CV *(5 months)*
23. Back up old laptop before selling
24. Sell old laptop
25. lightbulb hallway
26. Write thank-you note to Ania
27. Herb app: pick a name
28. Order contact lenses
29. dr?
30. ~~Pick up parcel from locker~~
31. **●** Insurance: send photos of bathroom water damage
32. Find a running route near the new office
33. Book weekend trip for May
34. that thing for Ania
35. Herb app: write the README
36. ~~Buy shower sealant~~
37. Compare electricity tariffs
38. ▸ Call the bank about the card limit
39. Return library books
40. Plan the balcony planting
41. Herb app: try a dark-mode palette
42. Backup phone photos to NAS (overlaps P6)
43. Repaint the hallway corner
44. Call insurance about bathroom claim (duplicate of P31)
45. Prepare tax documents (deadline April)
46. Sign up for a pottery class *[someday]*
47. Fix the wobbly kitchen chair
48. Rewrite personal site *[someday]* `#15`
49. Check the warranty on the dishwasher
50. Order a birthday cake for Kasia (related to P15)
51. Herb app: onboarding sketch *(re ×3)*
52. Organise the cable drawer *(re ×2)*
53. Clean the bathroom drain
54. Look into a NAS upgrade *(re ×4)*
55. Renew the gym membership

## Coverage

| Surface / mechanic | S1 | S2 | S3 | S4 | S5 | S6 | S7 |
|---|---|---|---|---|---|---|---|
| Portfolio overview | ● | | | ○ | | ○ | ○ |
| FVP pass, chain, re-entry | ○ | ● | ○ | ● | ● | | ● |
| Long lists (scale, position, done-item noise, ageing) | | | | | | | ● |
| Capture | | | ● | | | | |
| Clarify in passing (vague, duplicate items) | | | ○ | | | | ● |
| Item states (waiting, someday, paused) | ○ | | | ● | | ○ | ○ |
| Contexts and eligibility | ○ | ● | ● | | ● | | ○ |
| External edits, stale state | | | | | ● | | |
| Summary and weekly outcomes | ○ | | | ○ | | ● | |

● = main focus · ○ = touched
