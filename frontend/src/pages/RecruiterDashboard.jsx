import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ChatBox from "../components/ChatBox";

const statusColors = {
  pending:     "bg-yellow-100 text-yellow-700",
  reviewed:    "bg-blue-100 text-blue-700",
  shortlisted: "bg-green-100 text-green-700",
  rejected:    "bg-red-100 text-red-600",
  hired:       "bg-purple-100 text-purple-700",
};
const statusIcons = { pending:"⏳", reviewed:"👀", shortlisted:"✅", rejected:"❌", hired:"🎉" };

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState({
    title:"", description:"", company: user?.company || "",
    location:"", salary:"", jobType:"Full-time",
    skillsRequired:"", openings:1, deadline:"",
  });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/jobs/recruiter/myjobs");
      setJobs(data.jobs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchApplications = async (jobId) => {
    try {
      const { data } = await API.get(`/applications/job/${jobId}`);
      setApplications(data.applications);
    } catch (err) { console.error(err); }
  };

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job); setSelectedApp(null);
    fetchApplications(job._id); setTab("applicants");
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, skillsRequired: form.skillsRequired.split(",").map(s => s.trim()).filter(Boolean), openings: Number(form.openings) };
      if (editJob) { await API.put(`/jobs/${editJob._id}`, payload); showMsg("✅ Job updated!"); }
      else { await API.post("/jobs", payload); showMsg("✅ Job posted successfully!"); }
      setTab("jobs"); setEditJob(null); resetForm(); fetchJobs();
    } catch (err) { showMsg("❌ " + (err.response?.data?.message || "Failed"), "error"); }
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setForm({ title:job.title, description:job.description, company:job.company, location:job.location, salary:job.salary, jobType:job.jobType, skillsRequired:job.skillsRequired.join(", "), openings:job.openings, deadline:job.deadline ? job.deadline.split("T")[0] : "" });
    setTab("post");
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job? All applications will also be removed.")) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(prev => prev.filter(j => j._id !== jobId));
      showMsg("🗑️ Job deleted!");
    } catch { showMsg("❌ Delete failed", "error"); }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await API.put(`/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      showMsg(`${statusIcons[status]} Status updated to ${status}!`);
    } catch { showMsg("❌ Failed to update status", "error"); }
  };

  const resetForm = () => setForm({ title:"", description:"", company:user?.company||"", location:"", salary:"", jobType:"Full-time", skillsRequired:"", openings:1, deadline:"" });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">Recruiter Dashboard 🏢</h1>
                <p className="text-purple-100 mt-1">Welcome, {user?.name} &mdash; {user?.company}</p>
              </div>
            </div>
            <button onClick={() => { setEditJob(null); resetForm(); setTab("post"); }}
              className="bg-white text-purple-700 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:-translate-y-0.5 transform">
              + Post New Job
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: "Jobs Posted",      value: jobs.length,                         icon: "💼", bg: "bg-white/10" },
              { label: "Active Jobs",      value: jobs.filter(j => j.isActive).length, icon: "✅", bg: "bg-white/10" },
              { label: "Total Applicants", value: applications.length,                 icon: "👥", bg: "bg-white/10" },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-3xl font-extrabold">{s.value}</div>
                <div className="text-purple-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {message.text && (
          <div className={`px-4 py-3 rounded-xl mb-6 text-sm font-medium ${message.type === "error" ? "bg-red-50 border border-red-200 text-red-600" : "bg-green-50 border border-green-200 text-green-700"}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {[
            { key:"jobs",       label:`My Jobs (${jobs.length})`,                                          icon:"💼" },
            { key:"applicants", label: selectedJob ? `Applicants — ${selectedJob.title}` : "Applicants",  icon:"👥" },
            { key:"post",       label: editJob ? "Edit Job" : "Post Job",                                  icon:"✏️" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${tab === t.key ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── My Jobs Tab ── */}
        {tab === "jobs" && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-500">⏳ Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-7xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs posted yet</h3>
                <p className="text-gray-500 mb-6">Post your first job and start finding talent</p>
                <button onClick={() => setTab("post")} className="btn-primary">+ Post Your First Job</button>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl font-bold text-purple-600">
                          {job.company?.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${job.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                              {job.isActive ? "🟢 Active" : "⚫ Closed"}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">{job.company} &mdash; {job.location}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">💰 {job.salary} &bull; {job.jobType} &bull; {job.openings} opening(s)</p>
                      <div className="flex flex-wrap gap-1">
                        {job.skillsRequired?.slice(0, 5).map((s, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg border border-blue-100">{s}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap shrink-0">
                      <button onClick={() => handleJobSelect(job)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                        👥 Applicants
                      </button>
                      <button onClick={() => handleEdit(job)} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(job._id)} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Applicants Tab ── */}
        {tab === "applicants" && (
          <div>
            {!selectedJob ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-7xl mb-4">👥</div>
                <p className="text-gray-500">Select a job from My Jobs tab to view applicants</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-7xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No applicants yet</h3>
                <p className="text-gray-500">Applications will appear here once candidates apply</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-3xl">👥</span>
                  <div>
                    <p className="font-bold text-purple-800">{applications.length} applicant(s) for <strong>{selectedJob.title}</strong></p>
                    <p className="text-sm text-purple-600">Sorted by best skill match first 🎯</p>
                  </div>
                </div>
                {applications.map(app => (
                  <div key={app._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {app.applicant?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{app.applicant?.name}</h3>
                            <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                          </div>
                        </div>
                        {app.applicant?.bio && <p className="text-sm text-gray-600 mb-2 italic">"{app.applicant.bio}"</p>}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {app.applicant?.skills?.map((s, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg border border-blue-100">{s}</span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${statusColors[app.status]}`}>
                            {statusIcons[app.status]} {app.status}
                          </span>
                          <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full font-semibold">
                            🎯 Match: {app.matchScore}%
                          </span>
                          {app.applicant?.resume && (
                            <a
                              href={app.applicant.resume}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => {
                                // Force open in new tab for PDF viewing
                                e.preventDefault();
                                window.open(app.applicant.resume, "_blank", "noopener,noreferrer");
                              }}
                              className="text-xs text-white font-semibold bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full transition-colors">
                              📄 View Resume
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-fit">
                        <select value={app.status} onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                          className="input text-sm py-2 min-w-36">
                          {["pending","reviewed","shortlisted","rejected","hired"].map(s => (
                            <option key={s} value={s}>{statusIcons[s]} {s.charAt(0).toUpperCase()+s.slice(1)}</option>
                          ))}
                        </select>
                        <button onClick={() => setSelectedApp(selectedApp?._id === app._id ? null : app)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedApp?._id === app._id ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}>
                          {selectedApp?._id === app._id ? "✕ Hide Chat" : "💬 Chat"}
                        </button>
                      </div>
                    </div>
                    {app.coverLetter && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">📝 Cover Letter</p>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{app.coverLetter}</p>
                      </div>
                    )}
                    {selectedApp?._id === app._id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <ChatBox applicationId={app._id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Post / Edit Job Tab ── */}
        {tab === "post" && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl">
                  {editJob ? "✏️" : "➕"}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{editJob ? "Edit Job" : "Post a New Job"}</h2>
              </div>
              <form onSubmit={handleSubmitJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">💼 Job Title *</label>
                    <input required className="input" placeholder="e.g. Frontend Developer"
                      value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">🏢 Company *</label>
                    <input required className="input" placeholder="Company name"
                      value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">📍 Location *</label>
                    <input required className="input" placeholder="e.g. Bangalore, India"
                      value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">💰 Salary</label>
                    <input className="input" placeholder="e.g. 8-12 LPA"
                      value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">⏰ Job Type</label>
                    <select className="input" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
                      {["Full-time","Part-time","Internship","Remote","Contract"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">👥 Openings</label>
                    <input type="number" min="1" className="input"
                      value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">📅 Deadline</label>
                    <input type="date" className="input"
                      value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    🛠️ Skills Required <span className="text-gray-400 font-normal">(comma separated)</span>
                  </label>
                  <input className="input" placeholder="React, Node.js, MongoDB, Express"
                    value={form.skillsRequired} onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">📝 Job Description *</label>
                  <textarea required rows={6} className="input resize-none"
                    placeholder="Describe the role, responsibilities, requirements..."
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1 py-3 text-base">
                    {editJob ? "✅ Update Job" : "🚀 Post Job"}
                  </button>
                  <button type="button" onClick={() => { setTab("jobs"); setEditJob(null); resetForm(); }}
                    className="btn-secondary px-6">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
