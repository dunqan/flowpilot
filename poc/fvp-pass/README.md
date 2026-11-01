# POC 1 — FVP pass (throwaway)

Hands-on test of the riskiest M0 interaction: the FVP pass rhythm (S2, S7), per `docs/00-vision/experience/experience-overview.md`. Not product code. It is deleted once its findings note exists in `docs/60-research/ux/`.

**Run:** open `index.html` in a browser (no build, no dependencies). On a phone, use the private artifact link from the PR. State is kept in the browser; "⋯ → Restart demo data" resets it.

## What it covers

- Work list (S2 excerpt) and the 55-item Personal list (S7, chain P4 → P15 → P31, scan at P38), plus Mixed. Each keeps its own chain and position (D13). `Alt+1…3` switches.
- Pass keys per D24: `↓`/`j` no, `Space` dot, `Enter` work, `x` done, `r` stop and re-write. `↑`/`k` back. A prompt line names the benchmark and shows the current keys.
- Pinned benchmark when the benchmark row is out of view (D2).
- Item actions at the cursor: `e` fix in place, `r` re-write to end, `x` done, `w` waiting, `s` someday (D5).
- Re-writing with ghost text (D4): type to replace, `Tab` to tweak the original, `Enter`/`Esc`/click away with nothing typed keeps it.
- Reset (`Shift+R`, last-dotted first, D6) and clear done (`Shift+X`), both with an inline confirmation (D25). Undo (`u`/`Ctrl+Z`) for everything.
- Capture bar (`c`, phone: `+`), `[[Project]]` sets the project and context; `Shift+Enter` keeps it open (D27).
- Touch: No / Dot on the cursor row, tap the benchmark (or Work) to work, Done / Stop while working, long-press or right-click for item actions.
- "⋯ → Simulate: benchmark completed elsewhere" shows the D14 notice.

## Deliberate shortcuts

- **The re-write editor sits in the prompt line**, and the new row at the end mirrors it live. This keeps the view still (fluid rule 3) even when the end of the list is off screen. Whether this feels right is one of the questions to answer.
- No overview, summary, waiting screen or focus buffer (`f`); waiting/someday items just leave the list, with a count above it.
- Mixed is Work followed by Personal, not a true interleaved global order.
- Captures without a project go to the current context (Mixed → Work); where they land in files is a task-model question.

## Questions to answer in the session

1. Does the pass feel rhythmic over 15–20 comparisons on the Personal list? Any key that feels wrong?
2. Is the benchmark always clear: pinned bar, row marker, prompt line? Too much or too little?
3. Does resuming after work (done or stop) land where you expect?
4. Re-writing: is keep / replace / tweak obvious? Is editing in the prompt line acceptable, or must it happen in the row?
5. Phone: are No / Dot / Done / Stop and long-press enough without a keyboard?
6. Reset and clear done: is the inline confirmation enough?
