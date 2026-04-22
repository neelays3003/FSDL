import { useState } from 'react';

const FeedbackForm = ({ onAddFeedback }) => {
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('');
  const [rating, setRating] = useState('5');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName || !subject || !message) {
      alert('Please fill all fields');
      return;
    }

    const newFeedback = {
      studentName,
      subject,
      rating: parseInt(rating),
      message
    };

    onAddFeedback(newFeedback);

    // Reset form
    setStudentName('');
    setSubject('');
    setRating('5');
    setMessage('');
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name</label>
          <input 
            type="text" 
            value={studentName} 
            onChange={(e) => setStudentName(e.target.value)} 
            placeholder="Enter your name"
          />
        </div>
        
        <div className="form-group">
          <label>Subject</label>
          <input 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            placeholder="Enter subject name"
          />
        </div>

        <div className="form-group">
          <label>Rating (1-5)</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Feedback Message</label>
          <textarea 
            rows="4"
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Write your feedback..."
          ></textarea>
        </div>

        <button type="submit" className="btn">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
