# FlowPilot — Product Concept and Design Brief

**Status:** Concept draft  
**Working name:** FlowPilot  
**Purpose of this document:** Capture the product idea and establish the brief for separate product-design and technical-specification phases. This is not an implementation specification.

## Part I — Product concept

### 1. Vision

FlowPilot is a **Markdown-native personal work and attention orchestration system** for people managing several concurrent projects and personal commitments.

It combines:
- **Final Version Perfected (FVP)** as a human-directed method for selecting work;
- **selected GTD principles** for capturing, clarifying, tracking, and reviewing commitments;
- **weekly goals and portfolio visibility** for maintaining direction across projects; and
- **AI assistance** for understanding progress, surfacing overlooked work, and suggesting improvements.

The guiding promise is: **Stay aware of everything that matters without having to focus on everything at once.**

The system should support productive switching between projects, rather than forcing a single-project workflow or treating every switch as a failure.

### 2. Problem to solve

FVP works well as a task-selection method, but becomes harder to use when tasks are spread across multiple project-specific FVP lists, workspaces, or Markdown folders.

Common difficulties include:
- No dependable overall view of tasks and commitments across projects.
- Visibility bias: projects that are opened frequently receive attention, while others quietly disappear.
- A strict 3T/5T pool is too small to represent all important streams, yet enlarging it can weaken focus.
- Context changes, such as workdays versus personal weekends, call for different eligible tasks without losing selection progress.
- Project notes and work history contain useful signals that are not reflected in a task list.

The fundamental need is to **separate visibility, eligibility, selection, and concentration**.

### 3. Product principles

1. **Markdown remains primary.** Existing notes and task files stay readable, editable, portable, and usable without FlowPilot or Obsidian.
2. **FVP remains human-directed.** Preserve its actual selection and continuation mechanics; AI should not silently replace intuitive comparisons with priority rankings.
3. **One overview, multiple contexts.** Bring together many sources while allowing Work, Personal, Mixed, or custom selection contexts.
4. **Switching is legitimate.** Support natural interleaving of work across projects while helping detect unproductive fragmentation.
5. **Visibility is not obligation.** A project can remain visible without being selected for work; intentional pauses should be respected.
6. **GTD informs organization, not bureaucracy.** Borrow useful concepts without requiring adoption of the entire methodology.
7. **AI advises; the user decides.** Suggestions are explainable, linked to source material where possible, and subject to approval before changes.
8. **Local-first and durable.** Files remain accessible, and essential functionality works without AI or a cloud service.

### 4. Core conceptual model

| Concern | Question | Primary mechanism |
|---|---|---|
| Capture | What has arrived or occurred to me? | Inbox and Markdown notes |
| Organization | What is an actionable next step, a project, or something waiting? | Lightweight GTD concepts |
| Visibility | What is happening across all commitments? | God's-eye overview |
| Direction | What outcomes matter this week? | Weekly goals and reviews |
| Eligibility | What work fits my current context? | Context and workspace filters |
| Selection | What should I work on next? | FVP selection session |
| Concentration | What deserves repeated attention right now? | Optional flexible 3T/5T-style focus buffer |
| Reflection | What is stalled, forgotten, or connected? | Activity signals and AI-assisted review |

These mechanisms should complement each other, not become competing task-priority systems.

### 5. Main user experiences

#### A. God's-eye overview

A unified portfolio view of projects and personal areas across multiple Markdown sources. Show meaningful recent activity, commitments, next actions, blockers, waiting items, deadlines, intentional pauses, and potential attention gaps. Enable a drill-down from the whole portfolio to a project, note, or action.

The purpose is to answer: **What is happening, what needs attention, and what might I be overlooking?** It should avoid misleading progress scores or alerts based only on raw task counts.

#### B. Weekly cockpit

A lightweight place to define and review a few **outcomes for the week**, potentially spanning several projects. Weekly outcomes guide attention without imposing a rigid schedule or replacing FVP's task selection. Projects without weekly goals remain visible and can still receive work.

Support a simple review rhythm: review recent progress, identify commitments and risks, choose or revise weekly outcomes, and reflect on what actually advanced.

#### C. FVP workspace

An authentic FVP task-selection experience over eligible actions drawn from multiple projects. It should preserve ordered selection, comparisons, chain/session progress, and relevant re-entry/continuation behavior.

Users should be able to work across projects naturally. Context-specific sessions (e.g. Work, Personal, Mixed) may be paused and resumed. If eligibility or underlying tasks change, the application must handle potentially stale selection state transparently rather than silently changing a chain.

An optional 3T/5T-inspired **focus buffer** may support sustained effort, but is not the complete inventory of important work or a requirement to cover every project equally.

#### D. Projects, knowledge, and capture

Read and edit existing Markdown documents, maintain project outcomes and next actions, and offer lightweight GTD-inspired Inbox, Waiting For, and Someday/Maybe concepts. A project may span more than one folder or source. FlowPilot should coexist with Obsidian, but not require it.

#### E. AI assistance

AI acts as an **attention and knowledge assistant**, not an autonomous manager. Potential uses include:
- Summarizing what changed in a project or across the portfolio.
- Preparing weekly reviews and suggesting candidate weekly outcomes.
- Detecting missing next actions, ambiguous tasks, neglected commitments, or possible blockers.
- Pointing out related work, dependencies, and opportunities to combine efforts across projects.
- Answering questions over authorized Markdown sources with evidence links.

Basic facts such as file changes, elapsed time, and explicit due dates should be handled deterministically. AI-generated interpretations should be identifiable as suggestions, not facts or automatic priorities.

### 6. Illustrative workflow

1. Capture tasks and notes in existing Markdown files or through FlowPilot.
2. A persistent engine notices edits and keeps a unified view current.
3. Open the God's-eye overview to assess the whole portfolio.
4. Set or revisit a few weekly outcomes; intentionally pause others where appropriate.
5. Choose a context (e.g. Work on weekdays, Personal on weekends).
6. Use FVP to select actions from currently eligible work across projects.
7. Switch between projects at natural stopping points; optionally keep a small focus buffer.
8. Use periodic reviews and AI insights to discover gaps and adjust the next actions or goals.

## Part II — Brief for subsequent design phases

### 7. Product design brief

Design an approachable interface with **three primary surfaces**:

- **God's-eye overview:** portfolio-wide situation awareness and drill-down.
- **Weekly cockpit:** outcomes, progress evidence, and reflection.
- **FVP workspace:** faithful, low-friction selection and execution across eligible tasks.

Supporting surfaces may include capture/inbox, project and document views, source management, and AI review.

The design phase should explore:
- How to keep many projects visible without creating dashboard noise.
- How work/personal/custom contexts affect eligibility and ongoing FVP sessions.
- How users compare tasks in FVP without losing the method's original character.
- How weekly outcomes guide activity without becoming forced task rankings.
- How AI suggestions communicate evidence, uncertainty, and user control.
- How a focus buffer can encourage completion without becoming a restrictive pool.

**Expected design outputs:** key user journeys, information architecture, interaction principles, principal screens, and a prioritized MVP experience. Detailed UI patterns and visual design are deferred.

### 8. Implementation and architecture direction (provisional)

Favor a **local-first, Markdown-native application** with two separable parts:

- A **persistent engine/service** that reads and writes Markdown, watches registered folders, maintains a unified index and optimized runtime state, implements FVP and planning logic, and exposes an API.
- A **web application** that consumes the engine API for interactive views, selection sessions, review, and editing. Other clients could be added later.

Key architectural directions to explore, not yet prescribe:

- **Multiple sources:** register several Obsidian vaults or ordinary Markdown folders, including read-only sources; represent them in one logical portfolio without moving files. Handle overlapping paths and identity across sources.
- **Safe synchronization:** keep original files authoritative for document/task content; support external edits, file watching, reconciliation, and conflict-safe writes.
- **Efficient state:** use an in-memory index/cache for responsiveness and durable storage for indexes, events, and FVP session state as needed. Define ownership of each kind of data to avoid conflicting sources of truth.
- **Structured interfaces:** provide an API for tasks, projects, source registration, sessions, goals, reviews, and change notifications; enable future CLI, Obsidian, and agent clients.
- **AI isolation:** make AI an optional, permission-controlled capability; support clear source boundaries, explainable recommendations, and potentially local or remote model providers.
- **Extensibility:** keep project/task domain logic independent of the initial UI and avoid making Obsidian a required runtime dependency.

**Candidate direction for evaluation:** a Node.js/TypeScript engine and browser UI, with Markdown files plus a small local database. Exact framework, database, parser, watcher, API style, and deployment choices belong to a separate architecture specification.

### 9. Suggested MVP boundary

Validate the core idea with a narrow end-to-end slice:

1. Connect at least two independent Markdown folders or vaults.
2. Discover tasks/projects and display a unified portfolio view.
3. Reflect edits made externally and safely update original files from the app.
4. Run and resume an authentic cross-project FVP session.
5. Switch between at least Work and Personal contexts without discarding state.
6. Add a minimal weekly-outcomes view and basic attention signals.

AI summaries and suggestions are a natural next increment once task identity, file synchronization, and session semantics are reliable. Avoid complex agent automation, scheduling, and elaborate priority scoring initially.

### 10. Open questions for separate specifications

- Which exact FVP/FVP-derived rules should be faithfully implemented, including chain state, task re-entry, and continuation?
- What is the canonical representation of task identity, project association, status, and ordering in Markdown?
- How should changes in eligible tasks reconcile with saved FVP sessions?
- Which information belongs in Markdown versus durable app-specific storage?
- How are weekly outcomes linked to projects, actions, and progress evidence?
- What constitutes meaningful attention or progress, and how are intentional pauses represented?
- How should multiple local folders, external sync tools, permissions, and conflicting edits be handled?
- What data may AI read, and what approvals are required before it can write?
- How will the product be packaged and accessed locally or remotely?

### 11. Success criteria

The concept succeeds if it lets the user:

- See all important commitments across separate Markdown locations in one place.
- Select work intuitively across multiple projects without losing the benefits of FVP.
- Exclude work during personal time, then resume it without organizational friction.
- Make tangible progress toward weekly outcomes while remaining free to interleave projects.
- Notice neglected projects and unclear commitments early, without excessive alerts or administration.
- Continue to own and use the Markdown files independently of the app.

---

**Positioning:** FlowPilot is not intended to be another general-purpose task manager. Its distinguishing feature is the combination of **portfolio awareness, context-sensitive FVP selection, lightweight commitment management, and optional AI reflection** on top of portable Markdown knowledge.
