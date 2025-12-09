import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (!name.trim() || !email.trim() || !password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      if (res.status === 201 || res.data?.message?.toLowerCase().includes("registered")) {
        setOk("Registered. Redirecting to login...");
        setName(""); setEmail(""); setPassword("");
        setTimeout(() => navigate("/"), 900);
        return;
      }
      setError("Unexpected server response.");
      console.error("register unexpected:", res);
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 480 }}>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: 10 }}>
          <label>Name</label><br />
          <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Email</label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </div>

        <div>
          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </div>
      </form>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      {ok && <p style={{ color: "green", marginTop: 12 }}>{ok}</p>}

      <p style={{ marginTop: 12 }}>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
}
