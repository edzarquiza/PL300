# Deployment Guide — PL-300 Exam Simulator

## Deploying to Vercel

### First-time setup

1. Push the project to a GitHub repository (public or private).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New → Project** and import your repository.
4. Vercel auto-detects Vite. Leave all defaults — no environment variables required.
5. Click **Deploy**.

The `vercel.json` in the project root handles SPA routing so direct URLs like `/results` or `/reviewer` work correctly on refresh.

### Every subsequent deploy

Push to the connected GitHub branch (usually `main`). Vercel rebuilds automatically within ~30 seconds.

To deploy without pushing: use the Vercel CLI.

```bash
npm install -g vercel
vercel --prod
```

---

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build (local test)

```bash
npm run build
npm run preview
```

Open `http://localhost:4173`. This runs the exact build Vercel will deploy.

---

## Adding questions

Questions live in `src/data/questions.json`. Each entry follows this schema:

```json
{
  "id": 210,
  "type": "single",
  "domain": "Model the data",
  "subtopic": "CALCULATE function",
  "difficulty": "Medium",
  "question": "...",
  "choices": ["A", "B", "C", "D"],
  "correctAnswer": 1,
  "explanation": "...",
  "tags": ["DAX", "CALCULATE"],
  "questionGroupId": "calculate_filter_context"
}
```

Supported `type` values: `single`, `multiple`, `true_false`, `drag_drop`, `rearrange_steps`, `multi_part`.

After adding questions, push to GitHub and Vercel redeploys automatically.

---

## Adding reviewer cards

Reviewer cards live in `src/data/reviewers/`. Each JSON file is one category. Example card:

```json
{
  "id": "my_card_id",
  "concept": "Card Title",
  "summary": "Core explanation...",
  "keyInsight": "The critical thing to remember.",
  "commonTrap": "What people get wrong.",
  "miniQuiz": {
    "question": "Quick check question?",
    "choices": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Why A is correct."
  }
}
```

Import the new file in `src/pages/ReviewerPage.jsx` and add it to the `CATEGORIES` array.

---

## Adding case studies

Case studies live in `src/data/caseStudies.json`. Each entry has a scenario block and 2–4 sub-questions. Sub-questions share the same schema as regular questions, plus a `caseStudyId` field.

---

## Environment

No environment variables are needed. All data is local JSON and localStorage.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Blank page on direct URL (e.g. `/results`) | Confirm `vercel.json` is present in the repo root |
| Build fails | Run `npm run build` locally and fix errors before pushing |
| Questions not updating | Hard-refresh the deployed URL (Ctrl+Shift+R) to bust browser cache |
| localStorage full | Unlikely — question bank is JSON-static; only exam history is stored |
