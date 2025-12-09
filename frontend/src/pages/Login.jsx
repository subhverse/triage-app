import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // With cookie flow the server sets an httpOnly cookie.
      // The response will contain a message only (no token).
      const res = await api.post("/auth/login", { email, password });

      // If server responded 200 and message exists -> success
      if (res.status === 200 && (res.data?.message || "").toLowerCase().includes("login")) {
        // Clear sensitive inputs
        setEmail("");
        setPassword("");

        // Navigate to dashboard (protected route will fetch profile using cookie)
        navigate("/dashboard");
        return;
      }

      // Unexpected success shape
      setError("Login failed: unexpected server response.");
      console.error("Unexpected login response:", res);
    } catch (err) {
      // Show meaningful message
      console.error("LOGIN ERROR:", err.response?.status, err.response?.data || err.message);
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      if (serverMsg) setError(serverMsg);
      else if (err.message) setError("Network or server error");
      else setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: 420 }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

      <p style={{ marginTop: 12 }}>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
