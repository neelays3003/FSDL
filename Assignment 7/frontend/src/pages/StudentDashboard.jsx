import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, User } from 'lucide-react';

export default function StudentDashboard() {
  const { user, token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, feedRes] = await Promise.all([
          fetch('http://localhost:5000/api/student/assignments', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/feedback', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (assignRes.ok) {
          const assignData = await assignRes.json();
          setAssignments(assignData);
        }
        if (feedRes.ok) {
          const feedData = await feedRes.json();
          setFeedbacks(feedData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard student-dash">
      <header className="dash-header">
        <h2>My Subjects</h2>
        <p>Select a subject to provide your feedback for the faculty.</p>
      </header>
      
      {assignments.length === 0 ? (
        <div className="empty-state">
          <p>You have not been assigned to a division or no subjects are mapped to you yet.</p>
        </div>
      ) : (
        <div className="card-grid">
          {assignments.map(assign => {
            // Check if feedback already submitted for this assignment
            const isSubmitted = feedbacks.some(
              f => f.faculty._id === assign.faculty._id && f.subject._id === assign.subject._id
            );

            return (
              <div key={assign._id} className={`glass-card ${isSubmitted ? 'submitted-card' : ''}`}>
                <div className="card-content">
                  <h3><BookOpen size={20}/> {assign.subject.name}</h3>
                  <p><User size={16}/> {assign.faculty.name}</p>
                  
                  {isSubmitted ? (
                    <div className="status badge-success">Feedback Submitted</div>
                  ) : (
                    <button 
                      className="btn-primary" 
                      onClick={() => navigate(`/student/feedback/${assign._id}`, { state: { assign } })}
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
