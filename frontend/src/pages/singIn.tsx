import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import PublicRoute from "../components/PublicRoute/PublicRoute";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userFullName", res.data.user.fullName ?? "");
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <h2 className="mb-4">Log In</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-3 text-center">
              <p className="mb-0">
                Don't have an account?{" "}
                <Link to="/signup">Sign up here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default SignIn;
