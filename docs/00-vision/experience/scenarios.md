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

Re-entering is **re-writing**, as on paper: writing the item out again is a chance to restate it as it now stands. FlowPilot prefills the new entry with the old text, so Enter re-adds it unchanged, and editing it first is just as quick (details in S2).

FlowPilot additions decided so far (details in S7): done items clear on request or automatically after a set delay; the last dotted item stays pinned in view while scanning; and a **reset** marks every dotted item done and re-writes them at the end in reverse order.

There is no triage, no priority field and no review. The list *is* the system. FlowPilot adds several sources, contexts that filter eligibility, and summaries on top.

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

**Questions.** How does a neglected project get noticed without a nag? Does the overview show items or only projects? Is it a separate screen, or the "zoomed-out" state of the FVP list?

### S2 — An FVP pass across projects

**Story.** In the Work context, the eligible list is #2, 3, 5, 6, 8, 9, 11 (Home, Herb app and Spanish are hidden). Ola dots #2 (legacy DB mapping). They want #3 (PR review) more, so they dot it. #5 (talk abstract) they want even more, given the deadline, so they dot it. Nothing after #5 beats it. Ola works on the abstract for 40 minutes, then stops unfinished, so it is re-entered at the end. Scanning resumes from #6 against #3.

**Must feel right.** Dotting and comparing are one keystroke or one tap with no dialogs. The question "do I want this more than *that*?" is always visible, with *that* shown clearly. Starting work makes the chosen item the centre of attention, and stopping (done or re-enter) is one action that flows back into scanning.

**Re-entry is re-writing (decided, user 2026-11-01).** When Ola stops the abstract unfinished, the re-entry opens at the end of the list **prefilled with the original text, fully editable**. Enter re-adds it as it was. A few keystrokes turn it into what the task has become, e.g. "Draft talk abstract" becomes "Tighten abstract to 200 words + pick title". This is part of FVP itself: re-writing keeps items current. It uses prefilled text rather than a greyed-out hint, because a hint would make Enter add an empty item.

**No-maintenance check.** Nothing to prioritise beforehand. Each item's project shows as context, not as a grouping the user must manage. Items stay current because they get re-written at re-entry, not because of a cleanup session.

**Questions.** How is the "current comparison" shown: two items side by side, or a highlighted line in the list? What does "working on it" look like (focus mode, timer, notes)? Is cross-project order one merged list, or are per-project lists interleaved? Is the focus buffer needed at all in M1?

### S3 — Capture mid-flow

**Story.** While mapping the legacy tables, Ola remembers "ask Marta whether reports need the old IDs" (Atlas) and "buy shower sealant" (Home). They capture both in seconds without leaving the task. Both land at the end of the list: the first in their Work context, the second in Personal. Neither appears in the current pass until scanning reaches the end.

**Must feel right.** Capture is instant and global, its contents are only a sentence, and it never pulls focus away from the current task. The project or context guess is optional and fixable later, in passing.

**No-maintenance check.** No inbox. The item is simply on the list, and if its project is wrong, Ola fixes it when the item comes up in a pass.

**Questions.** How is the project or context inferred (a typed prefix, the current task's project, nothing)? Which Markdown file does a captured item land in? What happens to an item with no project?

### S4 — Something has to wait

**Story.** Scanning reaches #8 (ask IT for staging credentials). Ola sends the request, then marks it **waiting on IT**. It leaves the eligible list but stays visible on the Atlas project. #9 (dry-run script) depends on it. Two days later the credentials arrive, Ola clears the waiting state in one action, and the item re-enters at the end like any new item.

**Must feel right.** Marking something as waiting is as light as dotting. A waiting item never disappears into a list Ola has to remember to check.

**No-maintenance check.** GTD keeps a "Waiting For" list to review weekly. Here waiting is a state, and the summary (S6) and attention signals surface items that have waited too long.

**Questions.** Does a waiting item resurface by itself (a date, or a nudge after N days)? Are dependencies (#9 on #8) modelled at all in M1, or just written in the notes?

### S5 — The weekend switch, and edits from elsewhere

**Story.** It is Saturday, and Ola switches to **Personal**. The Work session (chain: #3, #6) is put aside intact. Personal starts its own pass over #4, 7, 10, 12, 13. During the weekend, Ola ticks off "Fix CI flake" (#6) in Obsidian on their phone, because a colleague fixed it. On Monday Ola switches back to Work, and FlowPilot shows plainly: *"Fix CI flake" was completed elsewhere and dropped from your chain; you are now comparing against "Review Piotr's PR".*

**Must feel right.** Switching context is instant and lossless. A change made elsewhere is explained once, briefly, and never silently rearranges things.

**No-maintenance check.** Nothing to reconcile by hand. The explanation is information, not a task.

**Questions.** What does a context switch look like: a toggle, a different "space", a schedule? How should Mixed context order items from both lists? How much explanation of stale state is enough?

### S6 — Friday: what actually happened?

**Story.** On Friday afternoon, out of curiosity rather than duty, Ola opens the summary. It says Atlas mapping advanced (re-entered twice, notes grew), the talk abstract got a first draft, Team ops took 30% of completions, Herb app had none, and IT credentials waited two days. The weekly outcome "abstract submitted" has evidence (a draft exists). Ola sets one outcome for next week, "dry-run passes", or none at all.

**Must feel right.** The summary is readable in a minute, and every claim links to its evidence. Setting an outcome is optional and takes seconds.

**No-maintenance check.** There is no review session. The summary is offered and never required, and skipping it costs nothing.

**Questions.** Which deterministic facts are enough for M1 (completions, re-entries, edits, waiting times)? Where do weekly outcomes live, and do they affect FVP at all (for example, by being visible during comparisons)? Is the summary a screen, a Markdown note written into the vault, or both?

### S7 — A long Personal list

**Story.** It is Sunday morning, and Ola opens the **Personal** list: 55 items accumulated over months, many of them typed on the phone in shorthand. The chain from yesterday is still there: dotted P4 (book plumber), then P15 (Kasia's birthday gift), then P31 (insurance photos), and scanning stopped around P38. Ola picks up exactly there, scanning items they barely remember writing: "lightbulb hallway", "dr?", "that thing for Ania". Some items have sat untouched near the top for months (P6, sort out photo backup) and get passed over every time. Two items are clearly the same thing written twice (P31 and P44, insurance). A few were re-entered so often that they cluster at the end. Ola wants to work through 15–20 comparisons quickly, mostly "no, no, no, yes", without losing track of what the current dotted item is, even though it sits 30 items further up.

**Must feel right.** Scanning a long list is fast and rhythmic, with one key per decision and no lag at 50 or 500 items. The item being compared against stays in view, however far away it is in the list. The current position is never lost: on reopening, Ola lands exactly where they stopped. Done items don't bury the live ones. A vague or duplicate item can be fixed in passing (rewrite, merge, set to someday, delete) without breaking the pass.

**No-maintenance check.** In GTD this list would demand a cleanup session. Here, cleaning happens one item at a time as the pass reaches it, and the pass never stops for tidying. Long-ignored items may be *shown* as old, but nothing forces a decision about them.

**Decided (user, 2026-11-01).**
- **Clearing done items.** Done items can be removed from the list in two ways: a *clear done* action that removes them all at once, or **automatic removal after a configurable delay** (e.g. 4 hours or 1 day), so you can still see what you just finished. Removing an item from the list doesn't erase it: completions still count in the summary (S6), and the Markdown keeps its record.
- **Pinned benchmark.** While scanning, the **last dotted item stays pinned at the top** of the list, however far down you scroll. The question "do I want this more than *that*?" always has *that* in view.
- **Reset the list.** One action restarts selection. Every dotted item is **marked done in place and re-written at the end of the list in reverse order**, and the chain is emptied. Example: with the chain P4 → P15 → P31, a reset crosses out P4, P15 and P31 and appends P56 = P31 (insurance photos), P57 = P15 (Kasia's gift), P58 = P4 (plumber). The next pass starts from the first undone item. The crossed-out copies then clear like any other done items.

**Still open.** Should an item skipped for months look different, and is that a hint or noise? Are merge, rewrite and someday quick actions inside the pass, or edits? Is there a "jump to where I was" action, or is landing back at the scan position automatic? How does a 55-item list look in the overview: as a count, a density, or an age profile? For reset: is "reverse order" meant as last-dotted first, as in the example? Does a reset offer the prefilled re-write (S2) for each item, or append them unchanged with a quick way to edit afterwards?

## Appendix — the long Personal list (S7)

The Personal context's eligible view in FVP order. Legend: ~~done~~ · **●** dotted (current chain) · ▸ current scan position · *(re ×N)* re-entered N times · *[waiting]* · *[someday]* · *[paused]* visible but not eligible · *(age)* untouched for that long. Items from the short excerpt carry its number as `#n`.

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
| Clarify or merge in passing (vague, duplicate items) | | | ○ | | | | ● |
| Item states (waiting, someday, paused) | ○ | | | ● | | ○ | ○ |
| Contexts and eligibility | ○ | ● | ● | | ● | | ○ |
| External edits, stale state | | | | | ● | | |
| Summary and weekly outcomes | ○ | | | ○ | | ● | |

● = main focus · ○ = touched
