import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 border border-white/10 shadow-glow">
          <h2 className="text-3xl font-display font-semibold text-white mb-6 text-center">Create Account</h2>
          
          {error && (
            <div className="mb-4 text-sm text-red-300 bg-red-900/40 px-4 py-3 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-sand/70 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm text-sand/70 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-sand/70 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm text-sand/70 mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50"
                placeholder="+1234567890"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-sand/70">
            Already have an account?{" "}
            <Link to="/login" className="text-sky hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
