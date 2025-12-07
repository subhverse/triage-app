import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.requestWithToken({ url: "/user/profile", method: "get" });
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          age: res.data.age || "",
          gender: res.data.gender || "",
          conditions: (res.data.conditions || []).join(", "),
          allergies: (res.data.allergies || []).join(", "),
          emergencyContactName: res.data.emergencyContactName || "",
          emergencyContactNumber: res.data.emergencyContactNumber || ""
        });
      } catch (err) {
        console.error("profile error", err.response?.status, err.response?.data);
        if (err.response?.status === 401) navigate("/");
      }
    };
    load();
  }, []);

  if (!user) return <div style={{ padding: 20 }}>Loading profile...</div>;

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const payload = {
        name: form.name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender ? Number(form.gender) : null,
        conditions: form.conditions ? form.conditions.split(",").map(s => s.trim()).filter(Boolean) : [],
        allergies: form.allergies ? form.allergies.split(",").map(s => s.trim()).filter(Boolean) : [],
        emergencyContactName: form.emergencyContactName,
        emergencyContactNumber: form.emergencyContactNumber
      };
      const res = await api.requestWithToken({ url: "/user/profile", method: "put", data: payload });
      setUser(res.data);
      setEditing(false);
      setMsg("Profile updated");
    } catch (err) {
      console.error("update error", err.response?.data || err.message);
      setMsg(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 720 }}>
      <h1>Dashboard</h1>

      {!editing && (
        <>
          <h2>Welcome, {user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Age:</strong> {user.age ?? "-"}</p>
          <p><strong>Gender (0=Male,1=Female):</strong> {user.gender ?? "-"}</p>
          <p><strong>Conditions:</strong> {(user.conditions || []).join(", ") || "-"}</p>
          <p><strong>Allergies:</strong> {(user.allergies || []).join(", ") || "-"}</p>
          <p><strong>Emergency contact:</strong> {user.emergencyContactName || "-"} {user.emergencyContactNumber ? `(${user.emergencyContactNumber})` : ""}</p>

          <div style={{ marginTop: 16 }}>
            <button onClick={() => setEditing(true)}>Edit Profile</button>{" "}
            <button onClick={() => navigate("/triage")}>Start Triage</button>{" "}
            <button onClick={() => navigate("/history")}>History</button>
          </div>
        </>
      )}

      {editing && (
        <form onSubmit={handleSave} style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 8 }}>
            <label>Name</label><br />
            <input value={form.name} onChange={(e) => onChange("name", e.target.value)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Age</label><br />
            <input value={form.age} onChange={(e) => onChange("age", e.target.value)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Gender (0=Male,1=Female)</label><br />
            <input value={form.gender} onChange={(e) => onChange("gender", e.target.value)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Conditions (comma-separated)</label><br />
            <input value={form.conditions} onChange={(e) => onChange("conditions", e.target.value)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Allergies (comma-separated)</label><br />
            <input value={form.allergies} onChange={(e) => onChange("allergies", e.target.value)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Emergency contact name</label><br />
            <input value={form.emergencyContactName} onChange={(e) => onChange("emergencyContactName", e.target.value)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Emergency contact number</label><br />
            <input value={form.emergencyContactNumber} onChange={(e) => onChange("emergencyContactNumber", e.target.value)} />
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit">Save</button>{" "}
            <button type="button" onClick={() => { setEditing(false); setMsg(""); }}>Cancel</button>
          </div>
        </form>
      )}

      {msg && <p style={{ color: msg === "Profile updated" ? "green" : "red" }}>{msg}</p>}
    </div>
  );
}
