const FeedbackItem = ({ feedback, onDelete }) => {
  return (
    <div className="card feedback-item">
      <div className="feedback-content">
        <h3>
          {feedback.studentName} 
          <span className="rating-badge">&#9733; {feedback.rating} / 5</span>
        </h3>
        <p className="feedback-meta">Subject: {feedback.subject} | Date: {new Date(feedback.createdAt).toLocaleDateString()}</p>
        <p>{feedback.message}</p>
      </div>
      <button 
        className="btn btn-danger" 
        onClick={() => onDelete(feedback._id)}
      >
        Delete
      </button>
    </div>
  );
};

export default FeedbackItem;
