### Output verification and human-in-the-loop

This exercise puts every module to work in a single task. You will take a feature request from raw requirement to implemented, tested, and reviewed feature — using agents at each stage and keeping yourself in the loop at the decision points.

The lab repository is an expense tracker application. Your task is to add budget category support: users should be able to create budget categories with monthly spending limits, assign expenses to categories, and see a dashboard showing budget versus actual spending for the current month.

The `docs/` folder contains the original feature request. Start there.

## Exercise

> **Tip:** Choose your model deliberately before each step. Exploratory and reasoning-heavy steps (planning, spec review, code review) benefit from a more capable model; straightforward implementation steps can use a faster, cheaper one. If you are unsure which model fits which task, module 4's theory section covers model selection in more detail.

### Setup — clone your copy

Clone your copy of this repository (the one created from the template) to your computer and open it in a terminal:

```
git clone <URL of your copy>
cd <name of your repo>
```

You can copy the URL from the green **Code** button on your repository page.

---

### Step 1 — Scrub the requirement

**Do this step manually, without AI assistance.** The whole point is to build the habit of reviewing data before it reaches any AI tool — using an AI to scrub the document defeats the purpose.

Open `docs/requirement-raw.md`. Read it carefully before doing anything else.

Identify every piece of sensitive information in the document: personal names, contact details, internal project codes, real financial data, credentials. Copy the content into a new file at `docs/requirement-clean.md` and replace or remove each sensitive item. Keep `docs/requirement-raw.md` unchanged — it is your record of what arrived.

Before moving on: make sure the clean version contains the full feature requirement but nothing that should not reach an AI tool.

---

### Step 2 — Generate a specification

Open Plan Mode in Claude Code. Feed in the contents of `docs/requirement-clean.md` and ask Claude to produce a specification for the feature: what it does, what it does not do, the data model, and the API surface.

Read the specification before approving it. If anything drifts from what the requirement asked for, correct it in Plan Mode before proceeding. Save the approved spec to `docs/spec.md`.

Example prompt:
```
I have a feature requirement. Please produce a specification covering:
- What the feature does and does not do
- The data model (new tables and fields)
- The API surface (endpoints, inputs, and outputs)
- Frontend changes needed

[paste contents of requirement-clean.md]
```

Tip: Instead of pasting the file contents, you can reference the file directly by typing `@requirement-clean.md` in the prompt — Claude Code will autocomplete the file name.

---

### Step 3 — Create an implementation plan

Still in Plan Mode, ask Claude to produce a step-by-step implementation plan based on the spec. Each step should name the files to change and describe what done looks like for that step.

Read the plan before approving it. Steps that are too big are harder to review — ask Claude to break them down if needed. Save the approved plan to `docs/plan.md`.

Example prompt:
```
Based on the spec, produce a step-by-step implementation plan. Each step should:
- Name the specific files to create or modify
- Describe what done looks like for that step
Keep each step to a single concern — database, API, or UI — not all three at once.
```

---

### Step 4 — Implement step by step

Exit Plan Mode. Choose your implementation model as covered in Module 4.

Ask Claude to implement the first step of the plan. When it finishes, read the diff before asking it to continue. Look for:
- Anything that does not match the plan
- Changes to files outside the scope of this step
- Type errors or missing imports

Approve and continue, or correct and retry. Repeat for each step in the plan.

---

### Step 5 — Verify with Playwright

Start the application:

```
npm run dev
```

Open a new Claude Code session. With Playwright MCP installed (covered in Module 8), ask Claude to navigate the running app and verify the budget category feature works end to end.

Example prompt:
```
The app is running at http://localhost:5173. Using Playwright:
1. Navigate to the app
2. Create a budget category called "Food" with a monthly limit of €300
3. Add an expense and assign it to the Food category
4. Navigate to the dashboard and confirm the category appears with the correct budget and spending figures
Report what you observe at each step.
```

---

### Step 6 — Generate unit tests

Open a new Claude Code session. Ask Claude to write unit tests for the new backend code added during implementation. Point it at the relevant source files.

When the tests are generated, run them:

```
cd backend && npm test
```

Before moving on, check at least three of the generated tests. For each one, ask: if I introduced a bug in this function, would this test catch it? If the answer is probably not, ask Claude to rewrite that test to verify real behaviour rather than mock calls. Module 7 covers what to look for.

When you commit, these tests go in with the implementation they cover, not as a separate commit: code and the tests that verify it are one unit of work.

---

### Step 7 — Write the PR description

Ask an agent to write a pull request description summarising all the changes made in this exercise. The description should cover what was implemented, why it was needed, and how to verify it works.

Save the output to `docs/pr-description.md`.

---

### Step 8 — Code review

Ask a review agent to inspect the implementation. Rather than listing individual files, give it the full diff so it has complete context:

```
git diff main
```

Example prompt:
```
Please review the implementation of the budget category feature. Here is the full diff of my changes:

[paste output of: git diff main]

Focus on: input validation, error handling, edge cases, and anything that could behave incorrectly in production.
```

Read the findings. For each issue raised, decide: worth fixing now, worth noting for later, or not a real concern in this context. You do not have to fix everything — use your judgment.

---

### Step 9 — Reflect

Answer these questions for yourself. There are no right answers.

- Which manual checkpoint caught something that would have gone wrong without you?
- Was there a step where your review added nothing? What would you automate next time?
- Did the code review surface anything you acted on? What did you decide not to fix, and why?
- Estimate how long this feature would have taken to build entirely without AI assistance.
- What does your personal human-in-the-loop map look like for this kind of task going forward?

### Automated Checks

The CI pipeline will verify:

1. `docs/requirement-raw.md` exists and is unchanged from the original (do not edit or delete it)
2. `docs/requirement-clean.md` exists and is not empty (created in Step 1)
3. `docs/requirement-clean.md` was actually scrubbed — it cannot be identical to
   `docs/requirement-raw.md`, and it must not still contain any personal names, contact
   details (email/phone, including reformatted phone numbers), the internal project code,
   the real spending figures, or the staging credentials from the original requirement
4. `docs/requirement-clean.md` still contains the actual feature requirements — scrubbing
   sensitive details is not the same as deleting the requirement itself
5. Backend typecheck passes
6. Backend unit tests pass

Commit and push your work when you are done — the check runs on every push.

<details>
<summary>Having trouble? 🤷</summary><br/>

 * If Plan Mode generates a spec that misses the mark, iterate — give Claude specific feedback about what to add or change before approving.
 * If an implementation step changes files outside its stated scope, tell Claude: "This step should only touch [specific files]. Undo any changes outside that scope."
 * If `npm test` fails after Claude generates the tests, paste the error output into the session and ask Claude to fix it.
 * If Playwright cannot find an element, check the running app manually first — the feature may need a small fix before Playwright can verify it.
 * If nothing happens for a while after committing your code, or if the tests don't pass, check the [Actions](../actions) tab to see what went wrong.
 * If you are still having trouble, ask for help in the course support channel.

</details>

---

<img alt="Amin 2.0" src="../images/amin2_smile.png" align="right" height="125px" />

Please, follow the steps above.
I'll watch your progress in the background to provide feedback. 🧐
