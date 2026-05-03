import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    API.get("/jobs?limit=6").then(({ data }) => {
      setFeaturedJobs(data.jobs);
      setTotal(data.total);
    }).catch(() => {});
    if (user?.role === "user") {
      API.get("/jobs/recommendations").then(({ data }) => setRecommendations(data.jobs)).catch(() => {});
    }
  }, [user]);

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">

        {/* Glowing blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
            🤖 AI-Powered Smart Matching is Live
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
              Dream Job
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              Smarter &amp; Faster
            </span>
          </h1>

          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            🤖 AI matches your skills to the perfect job &nbsp;&bull;&nbsp; See your match % instantly &nbsp;&bull;&nbsp; Apply in one click
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/jobs"
              className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all text-lg shadow-xl hover:-translate-y-0.5 transform">
              🔍 Browse {total}+ Jobs
            </Link>
            {!user && (
              <Link to="/register"
                className="border-2 border-white/50 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-700 transition-all text-lg backdrop-blur-sm hover:-translate-y-0.5 transform">
                🚀 Get Started Free
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 md:gap-20">
            {[
              { value: `${total}+`, label: "Active Jobs",    icon: "💼" },
              { value: "AI",        label: "Skill Matching", icon: "🤖" },
              { value: "100%",      label: "Free to Use",    icon: "🎉" },
              { value: "Live",      label: "Chat System",    icon: "💬" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-3xl font-extrabold text-yellow-300">{s.value}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Land your job in 3 simple steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "👤", title: "Create Profile",   desc: "Sign up and add your skills, bio, and upload your resume PDF.",                        color: "from-blue-500 to-blue-600"   },
              { step: "02", icon: "🤖", title: "AI Matches You",   desc: "Our AI compares your skills with job requirements and shows your match %.",            color: "from-purple-500 to-purple-600"},
              { step: "03", icon: "🚀", title: "Apply & Get Hired",desc: "Apply with one click, chat with recruiters, and track your application status.",      color: "from-green-500 to-green-600"  },
            ].map((s, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {s.icon}
                </div>
                <div className="absolute top-6 right-6 text-5xl font-black text-gray-100 select-none">{s.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOMMENDATIONS ── */}
      {recommendations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🤖</span>
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
          </div>
          <p className="text-gray-500 mb-6 ml-10">Based on your skills — best matches first</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map(job => <JobCard key={job._id} job={job} />)}
          </div>
        </section>
      )}

      {/* ── LATEST JOBS ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">💼 Latest Jobs</h2>
            <p className="text-gray-500 mt-1">Fresh opportunities posted recently</p>
          </div>
          <Link to="/jobs" className="btn-primary">View All &rarr;</Link>
        </div>
        {featuredJobs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>No jobs yet. Be the first to post one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-3">Why SmartHire AI?</h2>
            <p className="text-blue-200 text-lg">Everything LinkedIn and Naukri don't give you — for free</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🤖", title: "AI Skill Matching",     desc: "Get an exact match % for every job based on your skills. No more guessing."          },
              { icon: "📊", title: "Skill Gap Analysis",    desc: "See exactly which skills you're missing for any job. Know what to learn next."       },
              { icon: "💬", title: "Direct Chat",           desc: "Message recruiters directly after applying. No premium needed."                      },
              { icon: "📄", title: "Resume Upload",         desc: "Upload your PDF resume. Recruiters can view it directly from your application."      },
              { icon: "⭐", title: "Smart Recommendations", desc: "Get job recommendations tailored to your exact skill set automatically."             },
              { icon: "🔔", title: "Application Tracking",  desc: "Track every application — Pending, Shortlisted, Hired — all in one dashboard."      },
            ].map((f, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-colors">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="bg-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Ready to find your dream job?</h2>
            <p className="text-gray-500 text-lg mb-8">Join thousands of job seekers using AI to land their perfect role.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all text-lg shadow-lg hover:-translate-y-0.5 transform">
                👤 I'm a Job Seeker
              </Link>
              <Link to="/register"
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all text-lg shadow-lg hover:-translate-y-0.5 transform">
                🏢 I'm a Recruiter
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
