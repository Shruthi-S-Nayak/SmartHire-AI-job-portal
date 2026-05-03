import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import SkillBadge from "../components/SkillBadge";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchJob();
    if (user?.role === "user") fetchMatch();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await API.get(`/jobs/${id}`);
      setJob(data.job);
    } catch {
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchMatch = async () => {
    try {
      const { data } = await API.get(`/jobs/${id}/match`);
      setMatch(data);
    } catch {}
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await API.post(`/applications/${id}`, { coverLetter });
      setApplied(true);
      setShowApplyForm(false);
      setMessage("Application submitted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );

  if (!job) return null;

  const matchLabel = match
    ? match.matchPercent >= 70
      ? "Great match!"
      : match.matchPercent >= 40
      ? "Decent match"
      : "Low match — consider upskilling"
    : "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/jobs" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
        &larr; Back to Jobs
      </Link>

      {message && (
        <div className={`px-4 py-3 rounded-lg mb-6 text-sm ${applied ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
          {message}
        </div>
      )}

      {/* Job Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600 font-medium mb-4">{job.company}</p>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1 text-gray-600 text-sm">&#128205; {job.location}</span>
              <span className="flex items-center gap-1 text-gray-600 text-sm">&#128176; {job.salary}</span>
              <span className="flex items-center gap-1 text-gray-600 text-sm">&#128101; {job.openings} opening(s)</span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                job.jobType === "Full-time" ? "bg-green-100 text-green-700" :
                job.jobType === "Remote"    ? "bg-purple-100 text-purple-700" :
                "bg-blue-100 text-blue-700"}`}>
                {job.jobType}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {user?.role === "user" && !applied && (
              <button onClick={() => setShowApplyForm(!showApplyForm)} className="btn-primary px-8 py-3">
                {showApplyForm ? "Cancel" : "Apply Now"}
              </button>
            )}
            {applied && (
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                &#10003; Applied
              </span>
            )}
            {!user && (
              <Link to="/login" className="btn-primary px-8 py-3 text-center">Login to Apply</Link>
            )}
          </div>
        </div>
      </div>

      {/* Skill Match */}
      {match && user?.role === "user" && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Skill Match</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-blue-600">{match.matchPercent}%</div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${match.matchPercent}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{matchLabel}</p>
            </div>
          </div>
          {match.matchedSkills?.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">&#10003; Skills you have:</p>
              <div className="flex flex-wrap gap-2">
                {match.matchedSkills.map((s, i) => <SkillBadge key={i} skill={s} type="matched" />)}
              </div>
            </div>
          )}
          {match.missingSkills?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">&#10007; Skills you need:</p>
              <div className="flex flex-wrap gap-2">
                {match.missingSkills.map((s, i) => <SkillBadge key={i} skill={s} type="missing" />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Apply Form */}
      {showApplyForm && (
        <div className="card mb-6 border-2 border-blue-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Application</h2>
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
              <textarea
                rows={4}
                className="input resize-none"
                placeholder="Tell the recruiter why you are a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
            <button type="submit" disabled={applying} className="btn-primary px-8 py-3">
              {applying ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      )}

      {/* Job Description */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
      </div>

      {/* Skills Required */}
      {job.skillsRequired?.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Required</h2>
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired.map((skill, i) => <SkillBadge key={i} skill={skill} />)}
          </div>
        </div>
      )}

      {/* Job Info */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Posted By", value: job.postedBy?.name },
            { label: "Company",   value: job.postedBy?.company || job.company },
            { label: "Job Type",  value: job.jobType },
            { label: "Location",  value: job.location },
            { label: "Salary",    value: job.salary },
            { label: "Openings",  value: job.openings },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</p>
              <p className="font-medium text-gray-900 mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
