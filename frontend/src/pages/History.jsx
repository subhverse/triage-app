import { useEffect, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setErr("");
      try {
        // cookie-based auth: api.requestWithToken will send cookie (or header fallback)
        const res = await api.requestWithToken({ url: "/triage/history", method: "get" });
        setLogs(res.data || []);
      } catch (e) {
        console.error("history load error", e.response?.status, e.response?.data || e.message);
        if (e.response?.status === 401) {
          // not logged in — send to login
          navigate("/");
        } else {
          setErr(e.response?.data?.error || "Failed to load history");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading history...</div>;
  if (err) return <div style={{ padding: 20, color: "red" }}>{err}</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h1>Triage History</h1>
      {(!logs || logs.length === 0) && <div>No history found.</div>}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {logs && logs.map((log) => (
          <div key={log._id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <strong>{new Date(log.createdAt).toLocaleString()}</strong>
                <div style={{ color: "#666" }}>{(log.calculatedSeverity || "UNKNOWN")}</div>
              </div>
              <div>
                <button onClick={() => navigate("/triage")}>New</button>{" "}
                <button onClick={() => {
                  // show details inline modal-ish (simple)
                  const detail = JSON.stringify(log, null, 2);
                  alert(detail);
                }}>View JSON</button>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div><strong>Symptoms:</strong> {(log.symptomCodes || []).join(", ") || "-"}</div>
              {log.answers && Object.keys(log.answers).length > 0 && (
                <div style={{ marginTop: 6 }}>
                  <strong>Follow-ups:</strong>
                  <ul>
                    {Object.entries(log.answers).map(([k,v]) => (
                      <li key={k}><code>{k}</code>: {String(v)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
