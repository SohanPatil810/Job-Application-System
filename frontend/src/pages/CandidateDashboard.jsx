import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function CandidateDashboard() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Trusted Companies placeholders
  const trustedCompanies = [
    { name: 'Google', logo: 'https://ui-avatars.com/api/?name=Google&background=random&color=fff' },
    { name: 'Amazon', logo: 'https://ui-avatars.com/api/?name=Amazon&background=random&color=fff' },
    { name: 'Microsoft', logo: 'https://ui-avatars.com/api/?name=Microsoft&background=random&color=fff' },
    { name: 'Apple', logo: 'https://ui-avatars.com/api/?name=Apple&background=random&color=fff' },
    { name: 'Netflix', logo: 'https://ui-avatars.com/api/?name=Netflix&background=random&color=fff' },
  ];

  const categories = ['Engineering', 'Design', 'Marketing', 'Sales', 'Product', 'Customer Support'];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/public/jobs', {
        params: { keyword, location, category }
      });
      setJobs(response.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    if (!user) return;
    try {
      const response = await api.get('/candidate/applications');
      setMyApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, [category, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setActionMessage('Please select a resume (PDF/DOCX) first.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('resume', resume);

      await api.post(`/candidate/jobs/${selectedJob.id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setActionMessage('Application submitted successfully!');
      setIsApplying(false);
      setResume(null);
      fetchMyApplications();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to apply. You may have already applied.');
    }
  };

  const handleSaveJob = async () => {
    try {
      await api.post(`/candidate/jobs/${selectedJob.id}/save`);
      setActionMessage('Job saved successfully!');
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to save job. You may have already saved it.');
    }
  };

  const closeMenu = () => {
    setSelectedJob(null);
    setActionMessage('');
    setIsApplying(false);
    setResume(null);
  };

  const existingApplication = selectedJob ? myApplications.find(app => app.job?.id === selectedJob.id) : null;

  return (
    <div className="candidate-dashboard">
      {/* Purple Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Job Today</h1>
          <p>Thousands of jobs in the computer, engineering and technology sectors are waiting for you.</p>
          
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Job title or keyword" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
            <input 
              type="text" 
              placeholder="City, state or remote" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary search-btn">Search Jobs</button>
          </form>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="trusted-companies">
        <p>Trusted by world-class companies</p>
        <div className="company-logos">
          {trustedCompanies.map((comp, idx) => (
             <img key={idx} src={comp.logo} alt={comp.name} title={comp.name} />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Sidebar Categories */}
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            <li 
              className={category === '' ? 'active' : ''} 
              onClick={() => setCategory('')}
            >
              All Categories
            </li>
            {categories.map((cat, idx) => (
              <li 
                key={idx} 
                className={category === cat ? 'active' : ''}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        {/* Job Cards Grid */}
        <main className="job-grid-container">
          <h2>Latest Jobs</h2>
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs found matching your criteria.</p>
          ) : (
            <div className="job-grid">
              {jobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <img src={`https://ui-avatars.com/api/?name=${job.recruiter?.name || 'Company'}&background=random&color=fff`} alt="Company" className="company-avatar"/>
                    <div>
                      <h3 className="job-title">{job.title}</h3>
                      <p className="company-name">{job.recruiter?.name || 'Anonymous Company'}</p>
                    </div>
                  </div>
                  <div className="job-details">
                    <span className="badge">{job.location}</span>
                    <span className="badge">{job.category}</span>
                  </div>
                  <p className="job-desc">{job.description.substring(0, 100)}...</p>
                  <button className="btn btn-outline apply-btn" onClick={() => setSelectedJob(job)}>View Details</button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={closeMenu}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeMenu}>&times;</button>
            <div className="modal-header">
              <img src={`https://ui-avatars.com/api/?name=${selectedJob.recruiter?.name || 'Company'}&background=random&color=fff`} alt="Company" className="company-avatar-large"/>
              <div>
                <h2 style={{ marginBottom: '0.25rem' }}>{selectedJob.title}</h2>
                <p className="company-name" style={{ fontSize: '1.1rem' }}>{selectedJob.recruiter?.name || 'Anonymous Company'}</p>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="job-meta-grid">
                <div className="meta-item"><strong>Location:</strong> {selectedJob.location}</div>
                <div className="meta-item"><strong>Salary:</strong> {selectedJob.salary || 'Not Disclosed'}</div>
                <div className="meta-item"><strong>Experience:</strong> {selectedJob.experience || 'Not Specified'}</div>
                <div className="meta-item"><strong>Skills:</strong> {selectedJob.skills || 'Not Specified'}</div>
                <div className="meta-item"><strong>Category:</strong> {selectedJob.category}</div>
              </div>

              <h3>Job Description</h3>
              <p className="full-description">{selectedJob.description}</p>

              {actionMessage && (
                <div className={`alert ${actionMessage.includes('success') ? 'alert-success' : 'alert-error'}`}>
                  {actionMessage}
                </div>
              )}

              {existingApplication ? (
                <div className="application-status-container" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#475569' }}>Your Application Status</h4>
                  <span className={`status-badge status-${existingApplication.status.toLowerCase()}`}>
                    {existingApplication.status}
                  </span>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    Applied on {new Date(existingApplication.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : isApplying ? (
                <form className="apply-form" onSubmit={handleApply}>
                  <h4>Upload Resume (PDF/DOCX, Max 5MB)</h4>
                  <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    onChange={(e) => setResume(e.target.files[0])} 
                    required 
                    style={{ marginBottom: '1rem' }}
                  />
                  <div className="modal-actions">
                    <button type="submit" className="btn btn-primary">Submit Application</button>
                    <button type="button" className="btn btn-outline" onClick={() => setIsApplying(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={() => setIsApplying(true)}>Apply Now</button>
                  <button className="btn btn-outline" onClick={handleSaveJob}>Save Job</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
