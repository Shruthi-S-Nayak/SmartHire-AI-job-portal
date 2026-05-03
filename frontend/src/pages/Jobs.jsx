import React, { useState, useEffect } from "react";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(user?.savedJobs || []);
  const [filters, setFilters] = useState({ search: "", location: "", jobType: "" });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => { fetchJobs(); }, [pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: 9, ...filters });
      const { data } = await API.get(`/jobs?${params}`);
      setJobs(data.jobs);
      setPagination(p => ({ ...p, pages: data.pages, total: data.total }));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    fetchJobs();
  };

  const handleSaveToggle = (jobId) => {
    setSavedJobs(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
  };

  const jobTypes = ["Full-time", "Part-time", "Internship", "Remote", "Contract"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-2">🔍 Browse Jobs</h1>
          <p className="text-blue-100 text-lg">
            <span className="font-bold text-yellow-300 text-2xl">{pagination.total}</span> opportunities waiting for you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8 -mt-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input className="input pl-9" placeholder="Search job title or company..."
                value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
              <input className="input pl-9" placeholder="Location..."
                value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
            </div>
            <select className="input" value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
              <option value="">All Types</option>
              {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="btn-primary px-6">🔍 Search Jobs</button>
            <button type="button" className="btn-secondary" onClick={() => { setFilters({ search: "", location: "", jobType: "" }); fetchJobs(); }}>
              ✕ Clear
            </button>
          </div>
        </form>

        {/* Job Type Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[{ label: "All Jobs", value: "" }, ...jobTypes.map(t => ({ label: t, value: t }))].map((t) => (
            <button key={t.value}
              onClick={() => { setFilters(f => ({ ...f, jobType: t.value })); setTimeout(fetchJobs, 100); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${filters.jobType === t.value ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded-lg w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <JobCard key={job._id} job={job} savedJobs={savedJobs} onSaveToggle={handleSaveToggle} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setPagination(p => ({ ...p, page: i + 1 }))}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${pagination.page === i + 1 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
