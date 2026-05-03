import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "recruiter" ? "/recruiter-dashboard" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        {/* Blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10 text-center">
          <div className="text-8xl mb-6">🚀</div>
          <h2 className="text-4xl font-extrabold mb-4">Welcome Back!</h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Your dream job is just one login away. Let AI match you with the perfect opportunity.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { icon: "🤖", text: "AI Skill Matching" },
              { icon: "📊", text: "Skill Gap Analysis" },
              { icon: "💬", text: "Direct Recruiter Chat" },
              { icon: "⭐", text: "Smart Recommendations" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <span className="text-xl">{f.icon}</span>
                <span className="text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">SH</span>
              </div>
              <div className="text-left">
                <div className="font-extrabold text-gray-900">SmartHire</div>
                <div className="text-xs text-blue-600 font-semibold -mt-1">AI Job Portal</div>
              </div>
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Sign In 👋</h1>
            <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                <span>❌</span> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">📧 Email Address</label>
                <input type="email" required className="input" placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">🔒 Password</label>
                <input type="password" required className="input" placeholder="Enter your password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform text-base">
                {loading ? "⏳ Signing in..." : "Sign In 🚀"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline font-semibold">Create one free →</Link>
              </p>
            </div>
          </div>

          {/* Demo accounts */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">🧪 Demo Accounts</p>
            <div className="space-y-1 text-xs text-blue-600">
              <p>👤 Job Seeker: <span className="font-mono">rahul@gmail.com</span> / password123</p>
              <p>🏢 Recruiter: <span className="font-mono">recruiter@techcorp.com</span> / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
