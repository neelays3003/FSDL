import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function FeedbackFormPage() {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const assign = location.state?.assign;

  const [ratings, setRatings] = useState({
    quality: 0,
    clarity: 0,
    interaction: 0,
    overall: 0
  });
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!assign) {
    return <div>Invalid Request</div>;
  }

  const handleRatingClick = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(ratings).some(val => val === 0)) {
      setError('Please provide a rating for all questions');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          faculty: assign.faculty._id,
          subject: assign.subject._id,
          ratings,
          comment
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        alert('Feedback submitted successfully!');
        navigate('/student');
      }
    } catch (err) {
      setError('Error submitting feedback');
    }
  };

  const questions = [
    { key: 'quality', label: 'Quality of content delivery' },
    { key: 'clarity', label: 'Clarity of explanation' },
    { key: 'interaction', label: 'Interaction level' },
    { key: 'overall', label: 'Overall satisfaction' }
  ];

  return (
    <div className="feedback-form-container">
      <div className="glass-panel form-panel">
        <h2>Feedback Form</h2>
        <div className="subject-info">
          <p><strong>Subject:</strong> {assign.subject.name}</p>
          <p><strong>Faculty:</strong> {assign.faculty.name}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {questions.map(q => (
            <div key={q.key} className="rating-group">
              <label>{q.label}</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= ratings[q.key] ? 'active' : ''}`}
                    onClick={() => handleRatingClick(q.key, star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className="form-group">
            <label>Additional Comments (Optional)</label>
            <textarea 
              rows="4" 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share any other thoughts here..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/student')}>Cancel</button>
            <button type="submit" className="btn-primary">Submit Feedback</button>
          </div>
        </form>
      </div>
    </div>
  );
}
