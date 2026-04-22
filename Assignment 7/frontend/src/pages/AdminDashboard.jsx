import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [data, setData] = useState({
    divisions: [],
    subjects: [],
    faculties: [],
    assignments: [],
    feedbacks: [],
    students: []
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const readArrayResponse = async (response) => {
    const payload = await response.json();
    return Array.isArray(payload) ? payload : [];
  };

  const fetchData = async () => {
    if (!token) return;

    try {
      const [divRes, subRes, facRes, assRes, feedRes, stuRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/divisions', { headers }),
        fetch('http://localhost:5000/api/admin/subjects', { headers }),
        fetch('http://localhost:5000/api/admin/faculties', { headers }),
        fetch('http://localhost:5000/api/admin/assignments', { headers }),
        fetch('http://localhost:5000/api/feedback', { headers }),
        fetch('http://localhost:5000/api/admin/students', { headers })
      ]);

      setData({
        divisions: await readArrayResponse(divRes),
        subjects: await readArrayResponse(subRes),
        faculties: await readArrayResponse(facRes),
        assignments: await readArrayResponse(assRes),
        feedbacks: await readArrayResponse(feedRes),
        students: await readArrayResponse(stuRes)
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      await fetch(`http://localhost:5000/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (type, payload) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${type}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) fetchData();
      else alert((await res.json()).message);
    } catch (err) {
      console.error(err);
    }
  };

  // Helper chart data
  const getChartData = () => {
    const facultyScores = {};
    data.feedbacks.forEach(f => {
      if(!f.faculty) return;
      const fName = f.faculty.name;
      const score = (f.ratings.quality + f.ratings.clarity + f.ratings.interaction + f.ratings.overall) / 4;
      if (!facultyScores[fName]) facultyScores[fName] = { total: 0, count: 0 };
      facultyScores[fName].total += score;
      facultyScores[fName].count += 1;
    });

    const labels = Object.keys(facultyScores);
    const chartData = labels.map(l => facultyScores[l].total / facultyScores[l].count);

    return {
      labels,
      datasets: [
        {
          label: 'Average Overall Rating (Out of 5)',
          data: chartData,
          backgroundColor: 'rgba(79, 70, 229, 0.6)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  return (
    <div className="dashboard admin-dash">
      <div className="admin-sidebar">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'divisions' ? 'active' : ''} onClick={() => setActiveTab('divisions')}>Divisions</button>
        <button className={activeTab === 'subjects' ? 'active' : ''} onClick={() => setActiveTab('subjects')}>Subjects</button>
        <button className={activeTab === 'faculties' ? 'active' : ''} onClick={() => setActiveTab('faculties')}>Faculties</button>
        <button className={activeTab === 'assignments' ? 'active' : ''} onClick={() => setActiveTab('assignments')}>Assignments</button>
        <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>Students</button>
        <button className={activeTab === 'feedbacks' ? 'active' : ''} onClick={() => setActiveTab('feedbacks')}>Feedbacks</button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card"><h3>{data.feedbacks.length}</h3><p>Total Feedbacks</p></div>
              <div className="stat-card"><h3>{data.students.length}</h3><p>Registered Students</p></div>
              <div className="stat-card"><h3>{data.faculties.length}</h3><p>Faculties</p></div>
            </div>
            <div className="chart-container">
              {data.feedbacks.length > 0 ? <Bar data={getChartData()} /> : <p>No feedback data to chart</p>}
            </div>
          </div>
        )}

        {/* Similar basic CRUD UI for Divisions, Subjects, Faculties, Assignments */}
        {activeTab === 'divisions' && (
          <ManageSection 
            title="Divisions" 
            items={data.divisions} 
            fields={[{name: 'name', label: 'Division Name'}]}
            onCreate={(payload) => handleCreate('divisions', payload)}
            onDelete={(id) => handleDelete('divisions', id)}
          />
        )}
        
        {activeTab === 'subjects' && (
          <ManageSection 
            title="Subjects" 
            items={data.subjects} 
            fields={[{name: 'name', label: 'Name'}, {name: 'code', label: 'Code'}]}
            onCreate={(payload) => handleCreate('subjects', payload)}
            onDelete={(id) => handleDelete('subjects', id)}
          />
        )}

        {activeTab === 'faculties' && (
          <ManageSection 
            title="Faculties" 
            items={data.faculties} 
            fields={[{name: 'name', label: 'Name'}, {name: 'email', label: 'Email'}]}
            onCreate={(payload) => handleCreate('faculties', payload)}
            onDelete={(id) => handleDelete('faculties', id)}
          />
        )}

        {activeTab === 'assignments' && (
          <div className="manage-section">
            <h2>Manage Assignments</h2>
            <AssignmentForm 
              divisions={data.divisions} subjects={data.subjects} faculties={data.faculties}
              onCreate={(payload) => handleCreate('assignments', payload)}
            />
            <table className="data-table">
              <thead><tr><th>Division</th><th>Subject</th><th>Faculty</th><th>Action</th></tr></thead>
              <tbody>
                {data.assignments.map(a => (
                  <tr key={a._id}>
                    <td>{a.division?.name}</td>
                    <td>{a.subject?.name}</td>
                    <td>{a.faculty?.name}</td>
                    <td><button onClick={() => handleDelete('assignments', a._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="manage-section">
            <h2>Manage Students</h2>
            <table className="data-table">
              <thead><tr><th>PRN</th><th>Name</th><th>Email</th><th>Division</th><th>Action</th></tr></thead>
              <tbody>
                {data.students.map(s => (
                  <tr key={s._id}>
                    <td>{s.prn}</td>
                    <td>{s.fullName}</td>
                    <td>{s.email}</td>
                    <td>
                      <select 
                        value={s.division?._id || ''} 
                        onChange={async (e) => {
                          await fetch(`http://localhost:5000/api/admin/students/${s._id}/division`, {
                            method: 'PUT', headers, body: JSON.stringify({ divisionId: e.target.value })
                          });
                          fetchData();
                        }}
                      >
                        <option value="">Unassigned</option>
                        {data.divisions.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                      </select>
                    </td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'feedbacks' && (
          <div className="manage-section">
            <h2>All Feedbacks</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student (PRN)</th>
                  <th>Faculty</th>
                  <th>Subject</th>
                  <th>Overall</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {data.feedbacks.map(f => (
                  <tr key={f._id}>
                    <td>{f.student?.fullName} ({f.student?.prn})</td>
                    <td>{f.faculty?.name}</td>
                    <td>{f.subject?.name}</td>
                    <td>{f.ratings ? (f.ratings.quality + f.ratings.clarity + f.ratings.interaction + f.ratings.overall)/4 : 'N/A'}</td>
                    <td>{f.comment || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper form for generic creation
function ManageSection({ title, items, fields, onCreate, onDelete }) {
  const [form, setForm] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
    setForm({});
  }

  return (
    <div className="manage-section">
      <h2>Manage {title}</h2>
      <form onSubmit={handleSubmit} className="inline-form">
        {fields.map(f => (
          <input 
            key={f.name} type="text" placeholder={f.label} 
            value={form[f.name] || ''} onChange={e => setForm({...form, [f.name]: e.target.value})} required 
          />
        ))}
        <button type="submit" className="btn-primary">Add</button>
      </form>
      <table className="data-table">
        <thead>
          <tr>{fields.map(f => <th key={f.name}>{f.label}</th>)}<th>Action</th></tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              {fields.map(f => <td key={f.name}>{item[f.name]}</td>)}
              <td><button onClick={() => onDelete(item._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Assignment specific form
function AssignmentForm({ divisions, subjects, faculties, onCreate }) {
  const [form, setForm] = useState({ division: '', subject: '', faculty: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
  }

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <select value={form.division} onChange={e => setForm({...form, division: e.target.value})} required>
        <option value="">Select Division</option>
        {divisions.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
      </select>
      <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required>
        <option value="">Select Subject</option>
        {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>
      <select value={form.faculty} onChange={e => setForm({...form, faculty: e.target.value})} required>
        <option value="">Select Faculty</option>
        {faculties.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
      </select>
      <button type="submit" className="btn-primary">Assign</button>
    </form>
  );
}
