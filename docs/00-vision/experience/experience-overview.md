---
type: design
status: draft            # draft | approved
created: 2026-11-01
milestone: "[[M0]]"
tags: [experience, overview]
---

# Experience overview

What using FlowPilot feels like: the interaction model, the surfaces and how they connect, and what "fluid" means in practice. It builds on decisions D1–D21 in [[scenarios]] and adds D22–D29 below. It is the UX source for the [[M1]] specs. Designs (M0 G3) and POCs (M0 G4) are checked against it, and their findings fold back in before sign-off.

## Decisions (interview, 2026-11-01)

These continue the numbering in [[scenarios]].

- **D22 — Desktop and phone from the start.** The desktop browser is keyboard-first, with full mouse parity. The phone gets a responsive layout driven by touch. Each scenario is designed for both.
- **D23 — Four screens, one key each:** List (home), Overview, Summary and Waiting. Someday is a filter on the list, not a screen. Each screen keeps its own state (D17).
- **D24 — Pass keys:**
  - `↓`/`j` means no, move to the next item.
  - `Space` dots the item.
  - `Enter` works on the last dotted item.
  - While working, `x` marks it done, and `r` stops and re-writes it to the end.
  - A legend of the keys that apply right now is always visible.
- **D25 — Undo everywhere; confirm only bulk actions.** Every action can be undone for the rest of the session. Only reset (D6) and clear done (D7) ask first, and they ask inline (see [Safety](#safety)), not with a modal dialog.
- **D26 — "Fluid" is judged by feel, not by numbers.** There are no numeric response targets. Fluidity is defined by the interaction rules below and judged in hands-on POC sessions that use the scenarios.
- **D27 — Capture is an in-app key with a bar.** `c` opens a one-line capture bar from any screen; on the phone, a floating button does the same. The bar closes back to exactly where you were. An OS-wide hotkey is deferred as a technical question.
- **D28 — A dense text list.** The list looks like the Markdown it came from, with the project as a muted tag on the right. There are no tiles in the list. The overview may use tiles if a design shows they help.
- **D29 — Motion is minimal and explanatory.** Short transitions (≤150 ms) appear only where they explain a change, such as an item sliding to the end on re-entry or the benchmark swapping. Nothing is decorative.

## Principles

1. **The list is the product.** Everything else (overview, summary, waiting) is a view you visit and leave. You always come back to the list, at the place you left it (D8).
2. **One question at a time.** During a pass, the screen asks only "do I want this more than *the benchmark*?", and the answer is one key or one tap.
3. **No maintenance rituals.** Nothing ever has to be processed, triaged or reviewed before work can continue ([[flowpilot-concept]] principle 6). Tidying happens one item at a time, as the pass reaches it.
4. **Re-writing keeps items alive.** Every re-entry is a chance to re-write the item, and keeping it unchanged costs nothing (D4).
5. **Quiet by default.** No notifications and no badges. Signals live in the overview and summary (D18). The list announces one thing only: a change to the benchmark (D14).
6. **Never lose the user's place or work.** Undo is always there (D25), and the files stay the source of truth.

## Surfaces and how they connect

| Screen | Key | Purpose | Arrive from / return to |
|---|---|---|---|
| **List** (home) | `1` | The FVP list for the current context: pass, work, re-write, capture | Opens at the scan position, with the benchmark pinned (D8) |
| **Overview** | `2` | The portfolio: per project, last activity, nearest deadline, open and waiting counts, quiet neglect emphasis, and a collapsed paused group (D17–D19) | One key from anywhere; `1` or `Esc` returns to the list unchanged |
| **Summary** | `3` | What happened in a period: completions and re-entries per project, plus idle, waiting and deadline signals, and weekly outcomes (D20, D21) | On demand; nothing waits for it to be read |
| **Waiting** | `4` | Waiting items with age warnings; taking one out re-writes it at the end (D15) | One key; warnings also appear in the overview and summary |

The **context toggle** (Work · Personal · Mixed, plus custom contexts) is always visible in the header, and each context keeps its own chain and scan position (D13). The **capture bar** sits over every screen (D27). The **focus buffer** (3T/5T, optional, D10) is a small strip above the list, showing only when it holds items.

On the phone, the four screens become a bottom tab bar, and the context toggle stays in the header.

## The list and the pass

### What is on screen

```
 Work ▾   Personal   Mixed                           ⌕   + capture
──────────────────────────────────────────────────────────────────
 ● Review Piotr's PR on auth module                    Team ops    ← benchmark, pinned
──────────────────────────────────────────────────────────────────
   Map legacy DB tables to new schema                  Atlas
 ● Review Piotr's PR on auth module                    Team ops
 ▸ Fix CI flake in payments tests                      Team ops    ← cursor
   Ask IT for staging DB credentials                   Atlas
   Write migration dry-run script                      Atlas
   Update timesheet                                    Team ops
──────────────────────────────────────────────────────────────────
 Want this more than "Review Piotr's PR"?   ↓ no · Space dot · Enter work on benchmark
```

- **The benchmark** (the last dotted item) is pinned under the header while it is out of view, so the comparison is always visible (D2).
- **The cursor** marks the item being compared, with a highlighted line.
- **Dotted items** show a dot, matching `- [ ]` in Obsidian (D3). Done items are struck through and dimmed until cleared (D7).
- **The prompt line** at the bottom names the benchmark and shows only the keys that apply right now (D24).
- **Old items look like any other** (D9). Waiting and someday items are not in the eligible list, and paused projects never are (D19).

### Keys (provisional; the FVP-pass POC confirms them)

| Situation | Key | Action |
|---|---|---|
| Scanning | `↓` / `j` | No: move to the next item |
| | `↑` / `k` | Move back without changing anything |
| | `Space` | Dot: this becomes the benchmark |
| | `Enter` | Work on the benchmark |
| Any item at the cursor | `e` | Fix in place (typos and technical fixes) |
| | `r` | Re-write to end (any real change) |
| | `x` | Done (also "nothing to do with it") |
| | `w` / `s` | Waiting / someday |
| | `f` | Move to the focus buffer |
| Working | `x` | Done; scanning resumes after it |
| | `r` | Stop unfinished: re-write it at the end; scanning resumes after it |
| Anywhere | `c` | Capture |
| | `1`–`4` | Switch screens |
| | `u` / `Ctrl+Z` | Undo |
| | `?` | Show all keys |
| List | `Shift+R` | Reset the chain (D6) |
| | `Shift+X` | Clear done items (D7) |
| Context | `Alt+1`…`Alt+9` | Switch context, in toggle order |

The item actions (`e r x w s f`) never interrupt the pass. They act on the cursor item, and the cursor moves on.

### Touch (phone)

- The cursor row shows two large buttons, **No** and **Dot**.
- Tap the pinned benchmark to work on it. While working, the row shows **Done** and **Stop**.
- Long-press any row to get its quick actions: fix, re-write, done, waiting, someday, focus.
- Swiping is not used, so nothing triggers by accident.

### Working

`Enter` moves the cursor to the benchmark and gives it a light focus highlight. There is no separate screen and no timer (D3, D20). The rest of the list stays visible but dimmed. Capture and screen switches still work. When you stop:

- **`x` Done.** The item is struck through. The new benchmark is the previous dotted item, and scanning resumes after the item you just finished.
- **`r` Stop unfinished.** The item is struck through, and a new entry opens at the end in edit mode, with the original as ghost text (D4). Scanning then resumes after the item you just stopped.

### Re-writing (D4), on both devices

- Start typing to replace the item.
- `Enter`, `Esc` or clicking away keeps the original unchanged.
- `Tab` (on the phone, tapping the ghost text) pulls the original into the editor so you can tweak it.
- An empty entry is never added.
- The new entry slides to the end (D29), and the view stays where you were. It doesn't scroll to the end.

### Safety

Undo covers every action. Reset and clear done also ask first, inline and without a modal. The prompt line becomes, for example, *"Reset 3 dotted items to the end? Enter yes · Esc no"*. Reset then opens the re-writes one after another, last-dotted first (D6). Any of them can be kept unchanged with `Enter`.

## Capture

`c` (or the floating button on the phone) opens a one-line bar. Type a sentence, optionally with a `[[project]]` link (D11), and press `Enter`. The item lands at the end of the list, in the context that follows from its source or project (D12). The bar closes and focus returns to exactly where it was, even mid-work. `Shift+Enter` keeps the bar open for another item. Nothing in the current pass changes until scanning reaches the end (S3).

## Contexts

The header toggle shows the active context. Switching is instant, and each context keeps its chain, scan position and benchmark (D13). Mixed is the union in list order (D1). If an external edit changed the benchmark while you were away, a one-line notice appears on return, and it dismisses itself (D14).

## Waiting and someday

`w` marks the cursor item as waiting. An optional short note ("on IT") goes inline in the text. The item leaves the eligible list. The Waiting screen lists items oldest first, with a quiet age warning past a threshold. `Enter` on a waiting item takes it out, and it is re-written at the end (D15). Someday works the same way, but as a list filter (D23).

## Overview, summary and outcomes

- **Overview.** One row per project, readable in seconds without scrolling for a typical portfolio (S1). Neglect shows as quiet emphasis in the row, never as an alert (D18). Paused projects are collapsed and can be unpaused in one action (D19). `Enter` on a project opens the list filtered to it, and `Esc` returns.
- **Summary.** A period picker (this week by default), then a short readable page in which every claim links to its items (D20).
- **Outcomes.** A short list from a Markdown week note, shown in the overview and summary, and as a collapsible reminder above the list (D21). Outcomes never filter or order items.

## What "fluid" means

There are no numeric targets (D26). Fluid means these rules hold, and a POC session through the scenarios *feels* instant:

1. **One key or one tap** for every pass decision and every item action.
2. **No modal dialogs.** The only questions asked are the two inline confirmations (D25).
3. **The screen never jumps.** Items changing (re-entry, external edits, clearing) never move the view or the cursor.
4. **Focus is never stolen.** Capture, notices and external changes leave the cursor and the current item alone.
5. **You always know where you are.** The benchmark, cursor and context are always visible.
6. **Leaving and coming back is free.** Every screen and context reopens exactly as it was left.
7. **Nothing to wait for.** Actions show their result immediately; there are no loading states in a pass.
8. **Each device is complete on its own.** Nothing on the desktop needs the mouse, and nothing on the phone needs a keyboard, except for typing.

## What the designs and POCs must test

| Risk | Tested by | Scenarios |
|---|---|---|
| The pass rhythm: keys, pinned benchmark, prompt line, resuming after work | POC 1: FVP pass (desktop and phone) | S2, S7 |
| Re-writing with ghost text: keep vs rewrite vs tweak, and reset | POC 2: re-entry and reset | S2, S7 |
| Capture mid-work and the context switch without losing place | POC 3, or part of POC 1 if it stays small | S3, S5 |
| Overview readable in seconds; neglect quiet but noticeable | Design | S1 |
| Waiting and summary: light, never a chore | Design | S4, S6 |

Every design covers both the desktop and the phone (D22). Every POC runs on the sample portfolio in [[scenarios]].

## Deferred

- **To the M1 specs:** the Markdown mapping of states and where captures land (see [[scenarios]]), and the exact key map, after POC 1.
- **Technical questions:** an OS-wide capture hotkey, and whether the phone layout needs a native app.
