import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Eye, CheckCircle, XCircle, Plus, X, ChevronDown, ChevronUp, BrainCircuit, AlertCircle } from 'lucide-react';

const RecruiterDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [statusFilter, setStatusFilter] = useState('ALL'); 
  const [sortOrder, setSortOrder] = useState('HIGH_TO_LOW');
  const [expandedRow, setExpandedRow] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', description: '' });
  const [jobPosting, setJobPosting] = useState(false);

  const API_BASE_URL = 'https://ai-powered-ats-platform-bxqx.onrender.com';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    const token = localStorage.getItem('access_token');
    axios.get(`${API_BASE_URL}/api/applications/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((response) => {
        setApplications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        setErrorMsg("Failed to load applications. Check backend connection.");
        setLoading(false);
      });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.patch(`${API_BASE_URL}/api/applications/${id}/`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(error.response?.data?.status ? `Status Error: ${error.response.data.status}` : "Failed to update status.");
    }
  };

  const toggleRow = (id) => setExpandedRow(expandedRow === id ? null : id);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setJobPosting(true);
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(`${API_BASE_URL}/api/jobs/`, jobForm, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("✅ Job posted successfully!");
      setShowJobModal(false);
      setJobForm({ title: '', company: '', location: '', description: '' });
    } catch (error) {
      alert("❌ Failed to post job.");
    } finally {
      setJobPosting(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch(status.toLowerCase()) {
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  // 🟢 FIXED: Added safety checks to prevent crashes during filtering/sorting
  const processedApplications = applications
    .filter((app) => {
      if (statusFilter === 'ALL') return true;
      return (app.status || '').toUpperCase() === statusFilter; 
    })
    .sort((a, b) => {
      const scoreA = a.ats_score || 0;
      const scoreB = b.ats_score || 0;
      return sortOrder === 'HIGH_TO_LOW' ? scoreB - scoreA : scoreA - scoreB;
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruiter Inbox</h1>
            <p className="text-gray-600 mt-1">Review candidates and manage job postings.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowJobModal(true)} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition shadow-sm flex items-center gap-2">
              <Plus className="w-5 h-5" /> Post New Job
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Candidate</th>
                  <th className="p-4 font-medium">Job Title</th>
                  <th className="p-4 font-medium">Resume</th>
                  <th className="p-4 font-medium">ATS Score 🤖</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading candidate data...</td></tr>
                ) : processedApplications.length > 0 ? (
                  processedApplications.map((app) => (
                    <React.Fragment key={app.id}>
                      <tr className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-semibold text-gray-800 capitalize">{app.candidate || 'Unknown'}</td>
                        <td className="p-4 text-gray-600">
                          {app.job_title || 'N/A'} <br/>
                          <span className="text-xs text-gray-400">{app.company_name || ''}</span>
                        </td>
                        <td className="p-4">
                          {/* 🟢 FIXED: Crash proof resume link */}
                          {app.resume ? (
                            <a 
                              href={app.resume.startsWith('http') ? app.resume : `${API_BASE_URL}${app.resume}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-md w-fit transition"
                            >
                              <Eye className="w-4 h-4" /> View PDF
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm italic">No PDF attached</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {/* 🟢 FIXED: Fallback score if AI failed */}
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold ${app.ats_score ? 'border-blue-100 text-blue-700 bg-blue-50' : 'border-gray-100 text-gray-400 bg-gray-50'}`}>
                              {app.ats_score ? `${app.ats_score}%` : 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                            {app.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => toggleRow(app.id)} className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition" title="View AI Insights">
                              <BrainCircuit className="w-5 h-5" />
                            </button>
                            <div className="h-6 w-px bg-gray-200"></div>
                            {/* Actions with exact case matching */}
                            <button onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')} className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expandedRow === app.id && (
                        <tr className="bg-purple-50/30 border-b border-purple-100">
                          <td colSpan="6" className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                              <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                                <h3 className="text-sm font-bold text-purple-800 flex items-center gap-2 mb-2"><BrainCircuit className="w-4 h-4" /> AI Resume Analysis</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">{app.feedback || "AI parsing failed or no feedback available."}</p>
                              </div>
                              <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                                <h3 className="text-sm font-bold text-purple-800 mb-2">Suggested Interview Questions</h3>
                                {app.interview_questions ? (
                                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1.5">
                                    {app.interview_questions.replace(/[\[\]"']/g, '').split('?,').map((q, i) => (
                                      <li key={i} className="leading-relaxed">{q.trim() + (q.endsWith('?') ? '' : '?')}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500 text-sm">No questions generated.</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">No applications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Job Modal logic remains identical... (omitted for length, keep your existing Job Modal here) */}
    </div>
  );
};

export default RecruiterDashboard;