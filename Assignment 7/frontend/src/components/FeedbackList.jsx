import FeedbackItem from './FeedbackItem';

const FeedbackList = ({ feedbacks, onDelete }) => {
  if (!feedbacks || feedbacks.length === 0) {
    return <p className="empty-message">No feedback yet. Be the first to add one!</p>;
  }

  return (
    <div className="feedback-list">
      {feedbacks.map((feedback) => (
        <FeedbackItem 
          key={feedback._id} 
          feedback={feedback} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default FeedbackList;
