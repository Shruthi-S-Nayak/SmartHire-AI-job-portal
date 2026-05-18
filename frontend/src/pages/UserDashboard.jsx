import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import ChatBox from "../components/ChatBox";

const statusColors = {
  pending:     "bg-yellow-100 text-yellow-700 border border-yellow-200",
  reviewed:    "bg-blue-100 text-blue-700 border border-blue-200",
  shortlisted: "bg-green-100 text-green-700 border border-green-200",
  rejected:    "bg-red-100 text-red-600 border border-red-200",
  hired:       "bg-purple-100 text-purple-700 border border-purple-200",
};

const statusIcons = { pending: "⏳", reviewed: "👀", shortlisted: "✅", rejected: "❌", hired: "🎉" };

const UserDashboard = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [profile, setProfile] = useState({
    name: user?.name || "", bio: user?.bio || "",
    location: user?.location || "", skills: user?.skills?.join(", ") || "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, profileRes, recRes] = await Promise.all([
        API.get("/applications/my"),
        API.get("/users/profile"),
        API.get("/jobs/recommendations"),
      ]);
      setApplications(appRes.data.applications);
      setSavedJobs(profileRes.data.user.savedJobs || []);
      setRecommendations(recRes.data.jobs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = profile.skills.split(",").map(s => s.trim()).filter(Boolean);
      const { data } = await API.put("/users/profile", { ...profile, skills: skillsArray });
      updateUser(data.user);
      showMsg("✅ Profile updated successfully!");
    } catch (err) { showMsg("❌ " + (err.response?.data?.message || "Update failed"), "error"); }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      await API.post("/users/resume", formData, { headers: { "Content-Type": "multipart/form-data" } });
      showMsg("✅ Resume uploaded successfully!");
    } catch (err) { showMsg("❌ " + (err.response?.data?.message || "Upload failed"), "error"); }
  };

  const handleUnsave = async (jobId) => {
    await API.post(`/users/save/${jobId}`);
    setSavedJobs(prev => prev.filter(j => j._id !== jobId));
  };

  const tabs = [
    { key: "applications",   label: "Applications",   icon: "📋", count: applications.length },
    { key: "saved",          label: "Saved Jobs",      icon: "⭐", count: savedJobs.length },
    { key: "recommendations",label: "Recommended",     icon: "🤖", count: recommendations.length },
    { key: "profile",        label: "Profile",         icon: "👤", count: null },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">⏳</div>
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Hey, {user?.name?.split(" ")[0]}! 👋</h1>
              <p className="text-blue-100 mt-1">📍 {user?.location || "Add your location"} &bull; {user?.skills?.length || 0} skills added</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Applications",  value: applications.length,                                       icon: "📋", bg: "bg-white/10" },
              { label: "Saved Jobs",    value: savedJobs.length,                                          icon: "⭐", bg: "bg-white/10" },
              { label: "Shortlisted",   value: applications.filter(a => a.status === "shortlisted").length,icon: "✅", bg: "bg-white/10" },
              { label: "Recommended",   value: recommendations.length,                                    icon: "🤖", bg: "bg-white/10" },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} backdrop-blur-sm rounded-2xl p-4 border border-white/20`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-3xl font-extrabold">{s.value}</div>
                <div className="text-blue-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Message */}
        {message.text && (
          <div className={`px-4 py-3 rounded-xl mb-6 text-sm font-medium ${message.type === "error" ? "bg-red-50 border border-red-200 text-red-600" : "bg-green-50 border border-green-200 text-green-700"}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${tab === t.key ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"}`}>
              {t.icon} {t.label}
              {t.count !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tab === t.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Applications Tab ── */}
        {tab === "applications" && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-7xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-6">Start applying to jobs to track them here</p>
                <a href="/jobs" className="btn-primary inline-block">🔍 Browse Jobs</a>
              </div>
            ) : (
              applications.map(app => (
                <div key={app._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl font-bold text-blue-600 shrink-0">
                          {app.job?.company?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{app.job?.title}</h3>
                          <p className="text-gray-500">{app.job?.company} &mdash; {app.job?.location}</p>
                          <p className="text-sm text-gray-400 mt-0.5">💰 {app.job?.salary}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${statusColors[app.status]}`}>
                          {statusIcons[app.status]} {app.status}
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full font-semibold">
                          🎯 Match: {app.matchScore}%
                        </span>
                        <span className="text-xs text-gray-400 py-1">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedApp(selectedApp?._id === app._id ? null : app)}
                      className={`shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${selectedApp?._id === app._id ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}>
                      {selectedApp?._id === app._id ? "✕ Hide Chat" : "💬 Chat"}
                    </button>
                  </div>
                  {selectedApp?._id === app._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <ChatBox applicationId={app._id} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Saved Jobs Tab ── */}
        {tab === "saved" && (
          <div>
            {savedJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-7xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No saved jobs</h3>
                <p className="text-gray-500 mb-6">Bookmark jobs you like to find them here</p>
                <a href="/jobs" className="btn-primary inline-block">🔍 Browse Jobs</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.map(job => (
                  <div key={job._id} className="relative">
                    <JobCard job={job} />
                    <button onClick={() => handleUnsave(job._id)}
                      className="absolute top-3 right-3 text-xs bg-red-50 text-red-500 border border-red-100 px-2 py-1 rounded-lg hover:bg-red-100 font-semibold">
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Recommendations Tab ── */}
        {tab === "recommendations" && (
          <div>
            {recommendations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-7xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No recommendations yet</h3>
                <p className="text-gray-500 mb-6">Add skills to your profile to get AI-powered job recommendations</p>
                <button onClick={() => setTab("profile")} className="btn-primary">👤 Update Profile</button>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <span className="text-3xl">🤖</span>
                  <div>
                    <p className="font-bold text-blue-800">AI found {recommendations.length} jobs matching your skills!</p>
                    <p className="text-sm text-blue-600">Sorted by best match percentage</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map(job => <JobCard key={job._id} job={job} />)}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Profile Tab ── */}
        {tab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Edit Profile */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl">👤</div>
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">📍 Location</label>
                  <input className="input" placeholder="City, Country" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">📝 Bio</label>
                  <textarea rows={3} className="input resize-none" placeholder="Tell recruiters about yourself..."
                    value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    🛠️ Skills <span className="text-gray-400 font-normal">(comma separated)</span>
                  </label>
                  <input className="input" placeholder="React, Node.js, Python, MongoDB..."
                    value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary w-full py-3">💾 Save Profile</button>
                {message.text && (
                  <div className={`px-4 py-3 rounded-xl text-sm font-medium ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                    {message.text}
                  </div>
                )}
              </form>
            </div>

            {/* Resume + Skills */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl">📄</div>
                  <h2 className="text-xl font-bold text-gray-900">Resume</h2>
                </div>
                {user?.resume && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-green-700">✅ Resume uploaded</p>
                      <p className="text-xs text-green-600 mt-0.5">PDF file on record</p>
                    </div>
                    <a href={user.resume}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(user.resume, "_blank", "noopener,noreferrer");
                      }}
                      className="text-sm text-white font-semibold bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors">
                      📄 View Resume
                    </a>
                  </div>
                )}
                <form onSubmit={handleResumeUpload} className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload Resume (PDF only, max 5MB)</label>
                  <input type="file" accept=".pdf" className="input py-2 text-sm"
                    onChange={(e) => setResumeFile(e.target.files[0])} />
                  <button type="submit" disabled={!resumeFile} className="btn-primary w-full py-2.5">
                    📤 Upload Resume
                  </button>
                </form>
              </div>

              {/* Skills Display */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">🛠️</div>
                  <h2 className="text-xl font-bold text-gray-900">Your Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.length > 0 ? (
                    user.skills.map((skill, i) => (
                      <span key={i} className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100 font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <div className="text-center w-full py-6">
                      <div className="text-4xl mb-2">🛠️</div>
                      <p className="text-sm text-gray-400">No skills added yet. Edit your profile to add skills.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
