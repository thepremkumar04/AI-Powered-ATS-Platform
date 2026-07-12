import { ArrowRight, CheckCircle2, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in">
      
      {/* Hero Section */}
      <section className="w-full text-center py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Smarter Hiring with <span className="text-blue-600">AI-Powered ATS</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10">
            Streamline your recruitment process. Parse resumes, rank candidates automatically, and find the perfect fit using our advanced AI algorithms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login" className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg hover:shadow-xl">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/dashboard" className="bg-white text-gray-800 border border-gray-200 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition shadow-sm">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl px-6 py-16 mb-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Resume Parsing</h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically extract skills, experience, and education from PDF resumes with high NLP accuracy.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart ATS Scoring</h3>
            <p className="text-gray-600 leading-relaxed">
              Match candidate profiles against job descriptions instantly and rank them based on relevance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Management</h3>
            <p className="text-gray-600 leading-relaxed">
              A unified dashboard for recruiters to track applicants, schedule interviews, and make decisions.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;