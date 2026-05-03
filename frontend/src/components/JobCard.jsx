import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const JobCard = ({ job, onSaveToggle, savedJobs = [] }) => {
  const { user } = useAuth();
  const isSaved = savedJobs.map(id => id?.toString()).includes(job._id?.toString());

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await API.post(`/users/save/${job._id}`);
      if (onSaveToggle) onSaveToggle(job._id);
    } catch (err) {
      console.error(err);
    }
  };

  const typeColors = {
    "Full-time":  "bg-green-100 text-green-700",
    "Part-time":  "bg-yellow-100 text-yellow-700",
    "Internship": "bg-blue-100 text-blue-700",
    "Remote":     "bg-purple-100 text-purple-700",
    "Contract":   "bg-orange-100 text-orange-700",
  };

  return (
    <div className="card hover:shadow-md transition-shadow group">
      {/* Title + Save */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Link
            to={`/jobs/${job._id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors group-hover:text-blue-600"
          >
            {job.title}
          </Link>
          <p className="text-gray-600 font-medium mt-0.5">{job.company}</p>
        </div>
        {user && user.role === "user" && (
          <button
            onClick={handleSave}
            title={isSaved ? "Unsave" : "Save job"}
            className={`ml-3 p-2 rounded-lg transition-colors text-lg leading-none ${
              isSaved ? "text-yellow-500 bg-yellow-50" : "text-gray-300 hover:text-yellow-500 hover:bg-yellow-50"
            }`}
          >
            {isSaved ? "\u2605" : "\u2606"}
          </button>
        )}
      </div>

      {/* Location / Salary / Type */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
          </svg>
          {job.salary}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[job.jobType] || "bg-gray-100 text-gray-600"}`}>
          {job.jobType}
        </span>
      </div>

      {/* Skills */}
      {job.skillsRequired?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {job.skillsRequired.slice(0, 4).map((skill, i) => (
            <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{skill}</span>
          ))}
          {job.skillsRequired.length > 4 && (
            <span className="text-xs text-gray-400">+{job.skillsRequired.length - 4} more</span>
          )}
        </div>
      )}

      {/* Skill Match Bar */}
      {job.matchPercent !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Skill Match</span>
            <span className="font-semibold text-blue-600">{job.matchPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${job.matchPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</span>
        <Link to={`/jobs/${job._id}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
