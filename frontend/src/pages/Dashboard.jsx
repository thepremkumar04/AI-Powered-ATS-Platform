import { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, CheckCircle, Clock, FileText, User, Upload, X } from 'lucide-react';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(true);
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');

  // 🟢 LIVE SERVER URL
  const API_BASE_URL = 'https://ai-powered-ats-platform-bxqx.onrender.com';

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = () => {
    // 🟢 FIXED: Localhost nunchi Render ki marcham
    axios.get(`${API_BASE_URL}/api/jobs/`)
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false); // 🟢 FIXED: Error vachina loading aagipovali
      });
  };

  const fetchMyApplications = () => {
    const token = localStorage.getItem('access_token');
    // 🟢 FIXED: Localhost nunchi Render ki marcham
    axios.get(`${API_BASE_URL}/api/applications/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((response) => {
        setApplications(response.data);
        setAppsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        setAppsLoading(false); // 🟢 FIXED: Error vachina loading aagipovali
      });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setApplyMessage("Please select a resume file (PDF).");
      return;
    }

    setApplyLoading(true);
    setApplyMessage('');

    const formData = new FormData();
    formData.append('job', selectedJob.id);
    formData.append('resume', resumeFile);

    try {
      const token = localStorage.getItem('access_token');
      // 🟢 FIXED: Localhost nunchi Render ki marcham
      await axios.post(`${API_BASE_URL}/api/applications/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setApplyMessage("✅ Successfully applied for the job!");
      setResumeFile(null);
      
      fetchMyApplications(); 
      setTimeout(() => setSelectedJob(null), 2000); 

    } catch (error) {
      console.error(error);
      setApplyMessage("❌ Failed to apply. Please try again.");
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
            <p className="text-gray-600 mt-1">Find your next role and track your applications.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2 w-fit">
            <User className="w-5 h-5" />
            Profile
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<Briefcase />} label="Total Jobs Available" value={jobs.length} color="bg-blue-50 text-blue-600" />
          <StatCard icon={<FileText />} label="Jobs Applied" value={applications.length} color="bg-purple-50 text-purple-600" />
          <StatCard icon={<Clock />} label="In Review" value={applications.filter(a => a.status === 'APPLIED').length} color="bg-yellow-50 text-yellow-600" />
        </div>

        {/* My Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> My Applications
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm">
                  <th className="p-4 font-medium">Job Title</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Applied Date</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appsLoading ? (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading your applications...</td></tr>
                ) : applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 font-semibold text-gray-800">{app.job_title}</td>
                      <td className="p-4 text-gray-600">{app.company_name}</td>
                      <td className="p-4 text-gray-500">{new Date(app.applied_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-500">You haven't applied to any jobs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Jobs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Available Jobs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm">
                  <th className="p-4 font-medium">Job Title</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading jobs...</td></tr>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 font-semibold text-gray-800">{job.title}</td>
                      <td className="p-4 text-gray-600">{job.company}</td>
                      <td className="p-4 text-gray-600">{job.location}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => { setSelectedJob(job); setApplyMessage(''); }}
                          className="bg-green-50 text-green-700 px-4 py-1.5 rounded-lg font-medium hover:bg-green-100 transition text-sm"
                        >
                          Apply Now
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-500">No jobs available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Apply Job Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
            <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for Role</h2>
            <p className="text-gray-600 mb-6">Applying for <span className="font-semibold">{selectedJob.title}</span> at {selectedJob.company}.</p>
            <form onSubmit={handleApply} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <label className="block text-sm font-medium text-gray-700 cursor-pointer">
                  Upload Resume (PDF)
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
                </label>
                <p className="text-xs text-gray-500 mt-1">{resumeFile ? resumeFile.name : "Click to select a file"}</p>
              </div>
              {applyMessage && (
                <p className={`text-sm text-center font-medium ${applyMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {applyMessage}
                </p>
              )}
              <button type="submit" disabled={applyLoading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70">
                {applyLoading ? 'Uploading...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;