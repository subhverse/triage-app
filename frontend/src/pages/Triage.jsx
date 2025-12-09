import { useEffect, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Triage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [followUps, setFollowUps] = useState({}); // { key: { text, type } }
  const [answers, setAnswers] = useState({}); // { key: value }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/symptoms");
        setSymptoms(res.data || []);
      } catch (err) {
        console.error("Failed to load symptoms", err);
        setError("Failed to load symptoms");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // toggle a symptom code in the selected set
  const toggle = (code) => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setSelected(next);
    buildFollowUps(next);
  };

  // build follow-up questions from currently selected symptoms
  const buildFollowUps = (selectedSet) => {
    const map = {};
    for (const s of symptoms) {
      if (!selectedSet.has(s.code)) continue;
      if (!Array.isArray(s.followUpQuestions)) continue;
      for (const q of s.followUpQuestions) {
        if (!q || !q.key) continue;
        // keep first occurrence (text/type) if duplicate key
        if (!map[q.key]) map[q.key] = { text: q.text || q.key, type: q.type || "boolean" };
      }
    }
    setFollowUps(map);

    // clear answers for questions that were removed
    setAnswers(prev => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (!map[k]) delete next[k];
      }
      return next;
    });
  };

  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError("");
    setResult(null);

    if (selected.size === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    setSubmitting(true);
    try {
      const symptomCodes = Array.from(selected);
      const payload = { symptomCodes, answers };
      // Use token-protected request:
      const res = await api.requestWithToken({ url: "/triage", method: "post", data: payload });
      setResult(res.data);
      // optionally navigate to history or save id
    } catch (err) {
      console.error("Triage submit failed", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Triage failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading symptoms...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h1>Triage</h1>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Left: symptoms list */}
        <div style={{ flex: 1 }}>
          <h3>Select symptoms</h3>
          <div style={{ maxHeight: 420, overflow: "auto", border: "1px solid #ddd", padding: 10 }}>
            {symptoms.length === 0 && <div>No symptoms found.</div>}
            {symptoms.map(s => (
              <label key={s.code} style={{ display: "block", marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={selected.has(s.code)}
                  onChange={() => toggle(s.code)}
                />{" "}
                <strong>{s.name}</strong> <small style={{ color: "#666" }}>{s.category ? `(${s.category})` : ""}</small>
                {s.description ? <div style={{ color: "#444", marginLeft: 22 }}>{s.description}</div> : null}
              </label>
            ))}
          </div>
        </div>

        {/* Right: follow-ups & submit */}
        <div style={{ width: 420 }}>
          <h3>Follow-up questions</h3>

          {Object.keys(followUps).length === 0 && (
            <div style={{ color: "#666" }}>Select symptoms to see follow-up questions.</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 10 }}>
              {Object.entries(followUps).map(([key, q]) => {
                const val = answers[key];
                if (q.type === "boolean") {
                  return (
                    <div key={key}>
                      <label>
                        <input
                          type="checkbox"
                          checked={!!val}
                          onChange={(e) => setAnswer(key, e.target.checked)}
                        />{" "}
                        {q.text}
                      </label>
                    </div>
                  );
                }

                // fallback numeric/text
                if (q.type === "number") {
                  return (
                    <div key={key}>
                      <label>{q.text}</label>
                      <input
                        type="number"
                        value={val ?? ""}
                        onChange={(e) => setAnswer(key, Number(e.target.value))}
                      />
                    </div>
                  );
                }

                // default text
                return (
                  <div key={key}>
                    <label>{q.text}</label>
                    <input
                      type="text"
                      value={val ?? ""}
                      onChange={(e) => setAnswer(key, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 14 }}>
              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Run Triage"}
              </button>{" "}
              <button type="button" onClick={() => { setSelected(new Set()); setFollowUps({}); setAnswers({}); setResult(null); }}>Reset</button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          {/* Result area */}
          {result && (
            <div style={{ marginTop: 18, padding: 12, border: "1px solid #ccc", borderRadius: 6 }}>
              <h3>Result</h3>
              <p><strong>Severity:</strong> {result.severity}</p>
              <p><strong>Reason:</strong> {result.reason}</p>

              {result.guide && (
                <>
                  <h4>First-aid</h4>
                  <p><strong>{result.guide.title}</strong></p>
                  <ol>
                    {result.guide.steps.map((s,i) => <li key={i}>{s}</li>)}
                  </ol>
                </>
              )}

              {Array.isArray(result.hospitals) && result.hospitals.length > 0 && (
                <>
                  <h4>Nearby hospitals</h4>
                  <ul>
                    {result.hospitals.map(h => (
                      <li key={h._id}>
                        <strong>{h.name}</strong>{h.city ? ` — ${h.city}` : ""} {h.phone ? `(${h.phone})` : ""}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <p style={{ color: "#666" }}>Log id: {result.triageLogId}</p>

              <div style={{ marginTop: 8 }}>
                <button onClick={() => navigate("/history")}>View History</button>{" "}
                <button onClick={() => { setResult(null); }}>Close Result</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
