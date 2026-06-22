import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function RecruiterDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('MANAGE_JOBS');
  
  // Data States
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  
  // Form States
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', category: '', salary: '', skills: '', experience: ''
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch Jobs on Load
  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data);
      if(res.data.length > 0 && !selectedJobId) {
          setSelectedJobId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'MANAGE_JOBS' || activeTab === 'VIEW_APPLICATIONS') {
      fetchMyJobs();
    }
  }, [activeTab]);

  // Fetch Applications when a job is selected
  useEffect(() => {
    if (activeTab === 'VIEW_APPLICATIONS' && selectedJobId) {
      fetchApplications(selectedJobId);
    }
  }, [selectedJobId, activeTab]);

  const fetchApplications = async (jobId) => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for Add/Edit Job
  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, formData);
        setMessage('Job updated successfully!');
      } else {
        await api.post('/jobs', formData);
        setMessage('Job created successfully!');
      }
      setFormData({title: '', description: '', location: '', category: '', salary: '', skills: '', experience: ''});
      setEditingJobId(null);
      setTimeout(() => setActiveTab('MANAGE_JOBS'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed');
    }
  };

  const startEditing = (job) => {
    setFormData({
      title: job.title, description: job.description, location: job.location,
      category: job.category, salary: job.salary || '', skills: job.skills || '', experience: job.experience || ''
    });
    setEditingJobId(job.id);
    setActiveTab('ADD_JOB');
    setMessage('');
  };

  // Handlers for Manage Jobs
  const deleteJob = async (id) => {
    if(!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchMyJobs();
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  const toggleVisibility = async (id) => {
    try {
      await api.patch(`/jobs/${id}/toggle-visibility`);
      fetchMyJobs();
    } catch (err) {
      alert("Failed to toggle visibility.");
    }
  };

  // Handlers for Applications
  const updateAppStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      fetchApplications(selectedJobId);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDownloadResume = async (fileName) => {
      try {
          const response = await api.get(`/applications/download-resume/${fileName}`, {
              responseType: 'blob' // important for downloading files
          });
          
          // Create a blob URL and trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
      } catch (err) {
          alert("Failed to download resume.");
      }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h3>Recruiter Menu</h3>
        <ul className="admin-menu">
          <li className={activeTab === 'MANAGE_JOBS' ? 'active' : ''} onClick={() => {setActiveTab('MANAGE_JOBS'); setEditingJobId(null); setMessage('');}}>
            Manage Jobs
          </li>
          <li className={activeTab === 'ADD_JOB' ? 'active' : ''} onClick={() => {setActiveTab('ADD_JOB'); setFormData({title: '', description: '', location: '', category: '', salary: '', skills: '', experience: ''}); setEditingJobId(null); setMessage('');}}>
            {editingJobId ? 'Edit Job' : 'Add New Job'}
          </li>
          <li className={activeTab === 'VIEW_APPLICATIONS' ? 'active' : ''} onClick={() => {setActiveTab('VIEW_APPLICATIONS'); setMessage('');}}>
            View Applications
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        
        {/* TAB 1: ADD / EDIT JOB */}
        {activeTab === 'ADD_JOB' && (
          <div className="admin-card form-container">
            <h2>{editingJobId ? 'Edit Job Posting' : 'Post a New Job'}</h2>
            {message && <div className="alert alert-success">{message}</div>}
            
            <form onSubmit={handleJobSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input type="text" name="category" className="form-control" value={formData.category} onChange={handleInputChange} required placeholder="e.g. Engineering, Design" />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input type="text" name="location" className="form-control" value={formData.location} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input type="text" name="salary" className="form-control" value={formData.salary} onChange={handleInputChange} placeholder="e.g. $80k - $100k" />
                </div>
                <div className="form-group">
                  <label>Required Experience</label>
                  <input type="text" name="experience" className="form-control" value={formData.experience} onChange={handleInputChange} placeholder="e.g. 3-5 Years" />
                </div>
                <div className="form-group">
                  <label>Key Skills</label>
                  <input type="text" name="skills" className="form-control" value={formData.skills} onChange={handleInputChange} placeholder="e.g. React, Node.js" />
                </div>
              </div>
              <div className="form-group" style={{marginTop: '1rem'}}>
                <label>Full Description *</label>
                <textarea name="description" className="form-control" rows="8" value={formData.description} onChange={handleInputChange} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>
                {editingJobId ? 'Save Changes' : 'Publish Job'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: MANAGE JOBS */}
        {activeTab === 'MANAGE_JOBS' && (
          <div className="admin-card">
            <h2>Manage Your Jobs</h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center'}}>No jobs found. Post a new job!</td></tr>
                  ) : (
                    jobs.map(job => (
                      <tr key={job.id}>
                        <td><strong>{job.title}</strong></td>
                        <td>{job.category}</td>
                        <td>{job.location}</td>
                        <td>
                          <span className={`badge ${job.visible ? 'badge-active' : 'badge-inactive'}`}>
                            {job.visible ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-outline" onClick={() => startEditing(job)}>Edit</button>
                            <button className="btn btn-sm btn-warning" onClick={() => toggleVisibility(job.id)}>Toggle Vis</button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteJob(job.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VIEW APPLICATIONS */}
        {activeTab === 'VIEW_APPLICATIONS' && (
          <div className="admin-card">
            <h2>Candidate Applications</h2>
            
            <div className="form-group" style={{maxWidth: '400px', marginBottom: '2rem'}}>
              <label>Select Job to View</label>
              <select className="form-control" value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title} ({job.location})</option>
                ))}
              </select>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Candidate Email</th>
                    <th>Applied At</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center'}}>No applications for this job yet.</td></tr>
                  ) : (
                    applications.map(app => (
                      <tr key={app.id}>
                        <td>{app.candidate.email}</td>
                        <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge status-${app.status.toLowerCase()}`}>{app.status}</span>
                        </td>
                        <td>
                          {app.candidate.resumePath ? (
                            <button className="btn btn-sm btn-outline" onClick={() => handleDownloadResume(app.candidate.resumePath)}>
                              View Resume
                            </button>
                          ) : 'No Resume'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            {app.status === 'PENDING' && (
                              <>
                                <button className="btn btn-sm btn-success" onClick={() => updateAppStatus(app.id, 'SELECTED')}>Select</button>
                                <button className="btn btn-sm btn-danger" onClick={() => updateAppStatus(app.id, 'REJECTED')}>Reject</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
