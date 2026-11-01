---
type: design
status: draft            # draft | approved
created: 2026-11-01
milestone: "[[M0]]"
tags: [experience, design]
---

# Design briefs

One brief per scenario in [[scenarios]], ready to paste into Claude Design. They turn the [[experience-overview]] into concrete screens, so M0 G3 can be checked. Every brief asks for a **desktop** and a **phone** frame (D22).

## How to use

1. Paste the [shared preamble](#shared-preamble) and then one brief into Claude Design. The brief names the frames to produce.
2. Judge the result against the brief's **Must feel right** and **No-maintenance check**. A design that needs a step the user must process, triage or review fails M0 G5.
3. After the user has reviewed a design, add its link and a one-line verdict to the [[experience-overview]] (section "What the designs and POCs must test"). That table is the M0 G3 evidence. Findings that change a decision go back into the overview as edits, not into this file.
4. If a design shows that a fixed point below is wrong, note it in the review and change the decision in the overview first. These briefs follow the overview; they never override it.

## Shared preamble

Paste this before any brief.

> **Product.** FlowPilot is a local-first task app built on Final Version Perfected (FVP). There is one long list. You dot the first undone item, then scan forward asking "do I want this more than the last dotted item?" and dot it if yes. You work on the last dotted item. When you stop, it is done, or it is re-written at the end of the list. There is no inbox, no triage, no priority field and no weekly review. Summaries replace reviews.
>
> **Persona.** Ola, a freelance developer. Work projects: Atlas migration, Team ops, Conference talk. Personal projects: Herb-garden app, Home, Spanish (paused). Two sources: a work Obsidian vault and a personal Markdown folder.
>
> **Visual direction.**
> - A dense text list that looks like the Markdown it came from. One line per item. The project is a muted tag on the right. No tiles, cards or avatars in the list (the overview may use tiles if they help).
> - Dotted items show a dot (●). Done items are struck through and dimmed. The cursor line is highlighted. The item being worked on gets a light focus highlight, and the rest of the list dims.
> - Quiet: no notifications, no badges, no colour alarms. Emphasis is typographic.
> - Motion is minimal and explanatory (≤150 ms), only where it explains a change, e.g. an item sliding to the end on re-entry. Nothing decorative.
> - Show light theme; dark theme optional.
>
> **Structure.** Four screens, one key each: **List** `1` (home), **Overview** `2`, **Summary** `3`, **Waiting** `4`. Someday is a filter on the list, not a screen. The header always shows the context toggle (Work · Personal · Mixed) and a capture button. On the phone the four screens become a bottom tab bar, and the context toggle stays in the header.
>
> **Keys (desktop, keyboard-first, full mouse parity).** Scanning: `↓`/`j` no, `↑`/`k` back, `Space` dot, `Enter` work on the benchmark. Item at cursor: `e` fix in place, `r` re-write to end, `x` done, `w` waiting, `s` someday, `f` focus buffer. Working: `x` done, `r` stop and re-write. Anywhere: `c` capture, `1`–`4` screens, `u` undo, `?` all keys. A prompt line at the bottom names the benchmark and shows only the keys that apply right now.
>
> **Touch (phone).** The cursor row shows two large buttons, **No** and **Dot**. Tapping the pinned benchmark starts work; while working the row shows **Done** and **Stop**. Long-press a row for quick actions (fix, re-write, done, waiting, someday, focus). No swipes. A floating button opens capture.
>
> **Never.** No modal dialogs (only two inline confirmations exist: reset and clear done). The view never jumps when items change. Focus is never stolen.

## B1 — The list and the FVP pass (S2, S7)

**Goal.** Show what a pass looks and feels like on a short cross-project list and on a long list, on both devices. This is the core of the product.

**Sample data.**
- *Work context, S2:* eligible items in order: Map legacy DB tables to new schema (Atlas) · Review Piotr's PR on auth module (Team ops) · Draft talk abstract (Conf. talk) · Fix CI flake in payments tests (Team ops) · Ask IT for staging DB credentials (Atlas) · Write migration dry-run script (Atlas) · Update timesheet (Team ops). Ola dots Map legacy DB, then Review Piotr's PR, then Draft talk abstract, and works on the abstract.
- *Personal context, S7:* the full 55-item list from the [[scenarios]] appendix ("The long Personal list"), with the chain P4 Book plumber for bathroom quote → P15 Plan Kasia's birthday gift → P31 Insurance: send photos of bathroom water damage, and the scan position at P38 Call the bank about the card limit. Keep done items (P1–3, 5, 8, 16, 21, 30, 36) struck through. Waiting (P11), someday (P46, P48) and paused (P13) items are not in the eligible list; show them only where the frame calls for it.

**Must honour.** D1 one list, D2 pinned benchmark and highlighted cursor, D3 working item = last dotted with a light highlight and no separate screen, D5 quick actions, D8 open at scan position, D9 no age markers, D24 keys and legend, D25 inline confirm, D28 dense list, D29 motion.

**Frames (desktop and phone each).**
1. *Scanning, benchmark in view* (S2): cursor on Fix CI flake, benchmark Review Piotr's PR visible in the list, prompt line "Want this more than 'Review Piotr's PR'?".
2. *Scanning, benchmark pinned* (S7): cursor at P38, benchmark P31 scrolled out of view and pinned under the header.
3. *Working* (S2): Draft talk abstract highlighted, rest dimmed, prompt line shows `x` done · `r` stop; phone shows Done and Stop.
4. *Re-write with ghost text* (S2): after stopping, a new entry at the end in edit mode with "Draft talk abstract" as ghost text, and a variant where Ola has typed "Tighten abstract to 200 words + pick title". The view stays where it was; show how the user knows the entry was added below.
5. *Resumed scanning*: cursor on the item after the one just worked, benchmark now the previous dotted item.
6. *Inline reset confirmation* (S7): prompt line "Reset 3 dotted items to the end? Enter yes · Esc no", then the first of the three re-writes (P31 first, last-dotted first per D6).
7. *Quick actions* (S7): phone long-press menu on "dr?"; desktop fix-in-place editing of "lightbulb hallway"; P44 marked done as a duplicate of P31.
8. *Keys overlay* (`?`), desktop only.

**Explore.** How the pinned benchmark is set apart from the list without looking like a second list. How the prompt line and phone buttons sit together with the bottom tab bar. How re-entry at the end is acknowledged without scrolling. How done items stay unobtrusive on a long list.

**Fixed.** No tiles in the list. No side-by-side duel. No timer. No delete or merge.

**Must feel right.** Dotting and comparing are one key or one tap. "More than *what*?" is always visible. Starting and stopping work flows straight back into scanning. A long list scans with a "no, no, no, yes" rhythm, and the benchmark never gets lost.

**No-maintenance check.** Nothing to prioritise before a pass. Vague items, duplicates and old items are dealt with one at a time as the pass reaches them; no frame shows a cleanup step.

## B2 — Monday overview (S1)

**Goal.** Orientation across the whole portfolio in seconds, then into FVP in one action.

**Sample data.** Atlas migration (active, main focus, deadline end of month), Team ops (active, noisy), Conference talk (no activity for 3 weeks, proposal due in 9 days), Herb-garden app (quiet since Thursday), Home (active, waiting on others), Spanish (paused until January). Per project: last activity, nearest deadline, open and waiting counts. Invent counts consistent with the list excerpt in [[scenarios]].

**Must honour.** D17 own screen with last activity, deadline and counts; D18 quiet neglect emphasis in the overview only; D19 paused group collapsed, never flagged, unpause in one action; D21 weekly outcomes shown; D23 key `2`; D28 tiles allowed here.

**Frames (desktop and phone each).**
1. Overview with all projects visible without scrolling, the talk row quietly emphasised, Spanish in a collapsed paused group.
2. The same as a tile layout, so the two can be compared (desktop at least).
3. Paused group expanded, with the unpause action.
4. `Enter` on Conference talk: the list filtered to that project, with a clear way back (`Esc`).

**Explore.** Rows versus tiles. How "idle while a deadline nears" reads as noticeable but not alarming. Where the one action into FVP lives.

**Fixed.** No progress scores, percentages or raw-count alerts. No badges or notifications.

**Must feel right.** Ten seconds to know where things stand. The talk flag is noticed without alarm. One action to get to work.

**No-maintenance check.** The overview replaces the weekly review. It is optional, and nothing on it asks for a decision.

## B3 — Capture mid-flow (S3)

**Goal.** Capture two thoughts while working without losing the current task.

**Sample data.** Ola is working on Map legacy DB tables to new schema (Atlas, Work context). They capture `ask Marta whether reports need the old IDs [[Atlas]]` and `buy shower sealant [[Home]]`.

**Must honour.** D11 optional `[[project]]` link in the text, D12 context follows source or project, D27 `c` opens a one-line bar, `Shift+Enter` keeps it open, closes back to exactly where you were.

**Frames (desktop and phone each).**
1. Working state with the capture bar open over it (phone: floating button pressed, bar open with keyboard).
2. Second item typed with `Shift+Enter` keeping the bar open.
3. After closing: back in the working state, unchanged, with a quiet acknowledgement that the Home item went to Personal.

**Explore.** How a project link is suggested or completed while typing without slowing capture. How the acknowledgement for an item that went to another context reads.

**Fixed.** No inbox, no "process later" list, no required fields.

**Must feel right.** Instant, a sentence long, and focus never leaves the task.

**No-maintenance check.** The item is just on the list. A wrong project gets fixed in passing when the item comes up.

## B4 — Waiting (S4)

**Goal.** Marking waiting is as light as dotting, and waiting items never vanish.

**Sample data.** Scanning reaches Ask IT for staging DB credentials (Atlas). Ola marks it waiting "on IT". Write migration dry-run script notes the dependency in its text. Other waiting item: Choose tiles for bathroom (waiting on the contractor's catalogue). Two days later the credentials arrive.

**Must honour.** D15 no automatic return, waiting view with age warnings, leaving waiting re-writes at the end (D4); D16 dependencies are free text; D23 key `4`.

**Frames (desktop and phone each).**
1. List with `w` just pressed: inline note "on IT", item leaving the eligible list, cursor moving on.
2. Waiting screen, oldest first, with a quiet age warning on one item.
3. Taking the IT item out: the re-write at the end of the list with the original as ghost text.

**Explore.** Where the short waiting note is typed without a dialog. How the age warning stays quiet.

**Fixed.** Waiting items do not come back on their own. No dependency graph.

**Must feel right.** One key to mark, one key to take out. Ola trusts the waiting screen without having to check it on a schedule.

**No-maintenance check.** There is no "Waiting For" review. Age warnings in the waiting view, overview and summary do that job.

## B5 — Weekend switch and edits from elsewhere (S5)

**Goal.** Switching context is instant and lossless, and external changes are quiet except for the benchmark.

**Sample data.** Saturday: Ola switches from Work (chain Review Piotr's PR → Fix CI flake) to Personal, which has its own pass over Book plumber for bathroom quote, Sketch plant-detail screen, Pay electricity bill (due Friday), Choose tiles for bathroom, Try watering-reminder notification API. Over the weekend, Fix CI flake is ticked off in Obsidian. Monday: back to Work.

**Must honour.** D1 Mixed is the union in list order, D13 always-visible toggle with one-key switch and per-context chain and position, D14 silent external edits with one dismissable notice when the benchmark changed.

**Frames (desktop and phone each).**
1. Work list with the chain, toggle in the header.
2. Personal list right after switching, with its own benchmark and position.
3. Monday back in Work: the one-line notice "'Fix CI flake' was completed elsewhere; now comparing against 'Review Piotr's PR'", and the state after it dismisses itself.
4. Mixed context, showing both projects' items in list order with project tags.

**Explore.** How the toggle shows which context is active at a glance. Where the notice sits so it never covers the cursor.

**Fixed.** No automatic context switching. No reconcile step. Other external edits get no notice.

**Must feel right.** One key, and everything is where it was left. The only thing that announces itself is a change to the comparison.

**No-maintenance check.** Nothing to reconcile by hand; the notice is information, not a task.

## B6 — Friday summary (S6)

**Goal.** A summary that is readable in a minute, where every claim links to its evidence, and setting next week's outcome is optional.

**Sample data.** This week: Atlas mapping re-entered twice; Draft talk abstract re-entered once (first draft exists); Team ops 30% of completions; Herb app no completions; Ask IT for staging credentials waited two days. Weekly outcome "abstract submitted", with evidence of a draft. Next week's candidate outcome: "dry-run passes".

**Must honour.** D20 in-app view with a period picker, completions and re-entries per project with item links, idle, waiting and deadline signals, nothing written to the vault, no time tracking; D21 outcomes are a short Markdown list that never filters or orders items; D23 key `3`.

**Frames (desktop and phone each).**
1. Summary for "this week", with per-project completions and re-entries, signals and the outcome with its evidence.
2. A claim expanded or followed to its items.
3. Adding one outcome for next week, and the same frame with none added.

**Explore.** Sentence-style summary versus a compact table. How outcome evidence is shown without implying a score.

**Fixed.** No time tracking, no charts of hours, no "review complete" state. "Notes grew" is out of scope (it needs edit tracking, M2).

**Must feel right.** Read in a minute out of curiosity. Every claim is one click from its items.

**No-maintenance check.** Skipping the summary costs nothing, and nothing waits on it being read.

## Coverage

| Brief | Scenarios | Screens |
|---|---|---|
| B1 | S2, S7 | List (pass, working, re-write, reset, quick actions) |
| B2 | S1 | Overview |
| B3 | S3 | Capture bar over List |
| B4 | S4 | List, Waiting |
| B5 | S5 | List, context toggle, notice |
| B6 | S6 | Summary |
