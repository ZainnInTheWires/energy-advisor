import { useState } from "react";
import { PRESETS, calculate, type Appliance } from "./energy";
import { EXAMPLES, askTutor, type Answer } from "./tutor";

const SUBJECTS = ["Electronics", "Electrical Engineering", "Industrial Automation", "Embedded Systems", "Programming", "Signals & Systems", "Power Electronics", "Communication Systems"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
let nextId = 10;

function Calculator() {
  const [items, setItems] = useState<Appliance[]>(PRESETS.slice(0, 4).map((p, i) => ({ ...p, id: i })));
  const [tariff, setTariff] = useState(50);
  const [days, setDays] = useState(30);
  const [error, setError] = useState("");
  const [shown, setShown] = useState(() => calculate(items, tariff, days));

  const update = (id: number, f: keyof Appliance, v: string) =>
    setItems((l) => l.map((a) => (a.id === id ? { ...a, [f]: f === "name" ? v : Math.max(0, Number(v) || 0) } : a)));

  const run = () => {
    if (!items.length) return setError("Add at least one appliance.");
    if (tariff <= 0 || days <= 0) return setError("Tariff and days must be greater than zero.");
    setError("");
    setShown(calculate(items, tariff, days));
  };

  return (
    <div className="grid">
      <section className="panel">
        <h2>Your appliances</h2>
        <div className="chips">
          {PRESETS.map((p) => (
            <button key={p.name} className="chip" onClick={() => setItems((l) => [...l, { ...p, id: nextId++ }])}>+ {p.name}</button>
          ))}
        </div>
        {items.map((a) => (
          <div className="row" key={a.id}>
            <input aria-label="Name" value={a.name} onChange={(e) => update(a.id, "name", e.target.value)} />
            <label>Watts<input type="number" value={a.watts} onChange={(e) => update(a.id, "watts", e.target.value)} /></label>
            <label>Hours/day<input type="number" value={a.hours} onChange={(e) => update(a.id, "hours", e.target.value)} /></label>
            <label>Qty<input type="number" value={a.qty} onChange={(e) => update(a.id, "qty", e.target.value)} /></label>
            <button className="icon" aria-label="Remove" onClick={() => setItems((l) => l.filter((x) => x.id !== a.id))}>✕</button>
          </div>
        ))}
        <div className="row">
          <label>Price per kWh<input type="number" value={tariff} onChange={(e) => setTariff(Number(e.target.value))} /></label>
          <label>Days<input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} /></label>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="actions">
          <button className="primary" onClick={run}>Calculate</button>
          <button className="ghost" onClick={() => { setItems([]); setShown(calculate([], tariff, days)); }}>Reset</button>
        </div>
      </section>
      <section className="panel">
        <h2>Results</h2>
        <div className="stats">
          <div><b>{shown.dailyKwh.toFixed(2)}</b><span>kWh per day</span></div>
          <div><b>{shown.monthlyKwh.toFixed(1)}</b><span>kWh per period</span></div>
          <div><b>{shown.monthlyCost.toFixed(0)}</b><span>estimated cost</span></div>
        </div>
        {shown.rows.map((r) => (
          <div className="bar" key={r.name + r.kwh}>
            <span>{r.name}</span>
            <div className="track"><div style={{ width: `${r.share}%` }} /></div>
            <em>{r.share.toFixed(0)}%</em>
          </div>
        ))}
        <h3>Advisor</h3>
        <ul>{shown.tips.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>
    </div>
  );
}

function Tutor() {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ans, setAns] = useState<Answer | null>(null);

  const ask = async (text = q) => {
    if (!text.trim()) return setError("Type an engineering topic or question first.");
    setError(""); setLoading(true); setAns(null);
    try { setAns(await askTutor(text, subject, level)); }
    catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid">
      <section className="panel">
        <h2>Ask the tutor</h2>
        <textarea rows={3} placeholder="e.g. Explain PID controller" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="row">
          <label>Subject<select value={subject} onChange={(e) => setSubject(e.target.value)}>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label>Difficulty<select value={level} onChange={(e) => setLevel(e.target.value)}>{LEVELS.map((s) => <option key={s}>{s}</option>)}</select></label>
        </div>
        <div className="chips">{EXAMPLES.map((e) => <button key={e} className="chip" onClick={() => { setQ(e); ask(e); }}>{e}</button>)}</div>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="actions">
          <button className="primary" onClick={() => ask()} disabled={loading}>Ask AI Tutor</button>
          <button className="ghost" onClick={() => { setQ(""); setAns(null); setError(""); }}>Clear</button>
        </div>
      </section>
      <section className="panel">
        <h2>Answer</h2>
        {loading && <div className="loader" aria-label="Loading" />}
        {!loading && !ans && <p className="muted">Pick an example or type a question to begin.</p>}
        {ans && (
          <div className="answer">
            <h3>Simple explanation</h3><p>{ans.explanation}</p>
            <h3>Key concepts</h3><ul>{ans.concepts.map((c) => <li key={c}>{c}</li>)}</ul>
            <h3>Important formula</h3><code>{ans.formula}</code>
            <h3>Practical example</h3><p>{ans.example}</p>
            <h3>Quick revision</h3><p>{ans.revision}</p>
            <h3>Practice questions</h3><ol>{ans.questions.map((c) => <li key={c}>{c}</li>)}</ol>
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<"energy" | "tutor">("energy");
  return (
    <div className="app">
      <header>
        <h1>Smart Electrical Energy Calculator &amp; Advisor</h1>
        <p>Estimate appliance energy and cost, then learn the engineering behind it.</p>
        <nav>
          <button className={tab === "energy" ? "tab on" : "tab"} onClick={() => setTab("energy")}>Energy Calculator</button>
          <button className={tab === "tutor" ? "tab on" : "tab"} onClick={() => setTab("tutor")}>AI Tutor</button>
        </nav>
      </header>
      <main>{tab === "energy" ? <Calculator /> : <Tutor />}</main>
      <footer>AI Engineering Tutor — GenAI &amp; Agentic AI Project</footer>
    </div>
  );
}
