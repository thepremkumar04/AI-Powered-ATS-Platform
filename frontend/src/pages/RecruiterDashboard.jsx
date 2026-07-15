import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Eye, CheckCircle, XCircle, Plus, X, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';

const RecruiterDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Sorting & Filtering States
  const [statusFilter, setStatusFilter] = useState('ALL'); 
  const [sortOrder, setSortOrder] = useState('HIGH_TO_LOW');

  // AI Expandable Row State
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Post Job States
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', description: '' });
  const [jobPosting, setJobPosting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    const token = localStorage.getItem('access_token');
    // 🟢 FIXED: Localhost nunchi Render ki marcham
    axios.get('https://ai-powered-ats-platform-bxqx.onrender.com/api/applications/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((response) => {
        setApplications(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching applications:", error));
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem('access_token');
    try {
      // 🟢 FIXED: Localhost nunchi Render ki marcham
      await axios.patch(`https://ai-powered-ats-platform-bxqx.onrender.com/api/applications/${id}/`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setJobPosting(true);
    const token = localStorage.getItem('access_token');

    try {
      // 🟢 FIXED: Localhost nunchi Render ki marcham
      await axios.post('https://ai-powered-ats-platform-bxqx.onrender.com/api/jobs/', jobForm, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert("✅ Job posted successfully!");
      setShowJobModal(false);
      setJobForm({ title: '', company: '', location: '', description: '' });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("❌ Failed to post job.");
    } finally {
      setJobPosting(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const processedApplications = applications
    .filter((app) => {
      if (statusFilter === 'ALL') return true;
      return app.status.toUpperCase() === statusFilter; 
    })
    .sort((a, b) => {
      if (sortOrder === 'HIGH_TO_LOW') {
        return b.ats_score - a.ats_score;
      } else {
        return a.ats_score - b.ats_score;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruiter Inbox</h1>
            <p className="text-gray-600 mt-1">Review candidates and manage job postings.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 border border-blue-100">
              <Users className="w-5 h-5" />
              Total Applications: {applications.length}
            </div>
            
            <button 
              onClick={() => setShowJobModal(true)}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition shadow-sm flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </button>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-600">Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500 text-sm cursor-pointer"
            >
              <option value="ALL">All Candidates</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-600">Sort By:</label>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-1.5 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500 text-sm cursor-pointer"
            >
              <option value="HIGH_TO_LOW">Highest ATS Score</option>
              <option value="LOW_TO_HIGH">Lowest ATS Score</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
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
                      {/* Main Row */}
                      <tr className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-semibold text-gray-800 capitalize">{app.candidate}</td>
                        <td className="p-4 text-gray-600">
                          {app.job_title} <br/>
                          <span className="text-xs text-gray-400">{app.company_name}</span>
                        </td>
                        <td className="p-4">
                          <a 
                            // 🟢 FIXED: Resume link kooda Render ki marcham
                            href={app.resume.startsWith('http') ? app.resume : `https://ai-powered-ats-platform-bxqx.onrender.com${app.resume}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-md w-fit transition"
                          >
                            <Eye className="w-4 h-4" /> View PDF
                          </a>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded-full border-4 border-blue-100 flex items-center justify-center font-bold text-blue-700 bg-blue-50">
                              {app.ats_score}%
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-3">
                            {/* AI Brain Toggle Button */}
                            <button 
                              onClick={() => toggleRow(app.id)}
                              className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition flex items-center gap-1 font-medium text-sm"
                              title="View AI Insights"
                            >
                              <BrainCircuit className="w-5 h-5" />
                              {expandedRow === app.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            
                            <div className="h-6 w-px bg-gray-200"></div> {/* Divider */}

                            {/* 🟢 FIXED: 'Shortlisted' & 'Rejected' (Capital Letters) */}
                            <button onClick={() => handleStatusUpdate(app.id, 'Shortlisted')} className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition" title="Shortlist">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleStatusUpdate(app.id, 'Rejected')} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition" title="Reject">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Hidden AI Insights Row */}
                      {expandedRow === app.id && (
                        <tr className="bg-purple-50/30 border-b border-purple-100">
                          <td colSpan="6" className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                              
                              <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                                <h3 className="text-sm font-bold text-purple-800 flex items-center gap-2 mb-2">
                                  <BrainCircuit className="w-4 h-4" /> 
                                  AI Resume Analysis
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {app.feedback ? app.feedback : "No feedback available for this candidate."}
                                </p>
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
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">No applications found with this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Post Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fade-in">
            <button 
              onClick={() => setShowJobModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h2>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g. Senior Backend Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input 
                    type="text" 
                    required
                    value={jobForm.company}
                    onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g. TechCorp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g. Hyderabad / Remote"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea 
                  required
                  rows="4"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Write a brief description about the role..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={jobPosting}
                className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-70 mt-4"
              >
                {jobPosting ? 'Publishing...' : 'Publish Job'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;