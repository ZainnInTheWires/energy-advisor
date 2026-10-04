# Smart Electrical Energy Calculator & Advisor

A React + TypeScript + Vite app with two tools:

1. **Energy Calculator**: enter appliance watts, hours and quantity to get daily/monthly kWh, estimated cost, a per-appliance breakdown and saving tips.
2. **AI Tutor**: ask an engineering question, pick subject and difficulty, and get a structured answer (explanation, concepts, formula, example, revision, 3 practice questions).

Works offline in **demo mode**. No database, no login, no backend.

## Run
```bash
npm install
npm run dev
```
Open the URL printed in the terminal (usually http://localhost:5173).

## Build
```bash
npm run build
```

## Connect a real AI later
Copy `.env.example` to `.env`, set `VITE_AI_API_KEY`, and add your provider call at the TODO in `src/tutor.ts` (`askTutor`). Energy advice logic lives in `src/energy.ts` (`advise`).
Note: keys in a frontend app are visible to users. For production, call the AI through a small server function.

## Structure
`src/App.tsx` UI · `src/energy.ts` calculator · `src/tutor.ts` demo engine · `src/index.css` styles

AI Engineering Tutor — GenAI & Agentic AI Project
