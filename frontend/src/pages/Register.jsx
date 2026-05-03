import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", company: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === "recruiter" ? "/recruiter-dashboard" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 text-center">
          <div className="text-8xl mb-6">🌟</div>
          <h2 className="text-4xl font-extrabold mb-4">Join SmartHire AI</h2>
          <p className="text-emerald-100 text-lg leading-relaxed mb-8">
            Create your profile, add your skills, and let AI find the perfect job match for you.
          </p>
          <div className="space-y-3">
            {[
              { icon: "✅", text: "Free forever — no hidden charges" },
              { icon: "🤖", text: "AI-powered job recommendations" },
              { icon: "📄", text: "Upload resume & apply instantly" },
              { icon: "💬", text: "Chat directly with recruiters" },
              { icon: "📊", text: "Track all your applications" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5 text-left">
                <span className="text-xl">{f.icon}</span>
                <span className="text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">SH</span>
              </div>
              <div className="text-left">
                <div className="font-extrabold text-gray-900">SmartHire</div>
                <div className="text-xs text-blue-600 font-semibold -mt-1">AI Job Portal</div>
              </div>
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Create Account 🎉</h1>
            <p className="text-gray-500 mt-1">Start your journey to your dream job</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                <span>❌</span> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">👤 Full Name</label>
                <input type="text" required className="input" placeholder="John Doe"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">📧 Email Address</label>
                <input type="email" required className="input" placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">🔒 Password</label>
                <input type="password" required className="input" placeholder="Min 6 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { role: "user",      label: "Job Seeker",  icon: "👤", desc: "Find & apply for jobs",  color: "border-blue-500 bg-blue-50 text-blue-700"   },
                    { role: "recruiter", label: "Recruiter",   icon: "🏢", desc: "Post jobs & hire talent", color: "border-purple-500 bg-purple-50 text-purple-700" },
                  ].map((r) => (
                    <button key={r.role} type="button" onClick={() => setForm({ ...form, role: r.role })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${form.role === r.role ? r.color : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      <div className="text-2xl mb-1">{r.icon}</div>
                      <div className="font-bold text-sm">{r.label}</div>
                      <div className="text-xs opacity-70 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {form.role === "recruiter" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">🏢 Company Name</label>
                  <input type="text" className="input" placeholder="Your company name"
                    value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform text-base mt-2">
                {loading ? "⏳ Creating account..." : "Create Account 🚀"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
