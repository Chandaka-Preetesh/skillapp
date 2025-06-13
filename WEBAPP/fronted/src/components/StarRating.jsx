import { useState, useEffect } from 'react';
import axios from "../utils/axios.js";

function StarRating({
  initialRating = 0,
  averageRating = 0,
  initialIsLiked = false,
  initialLikeCount = 0,
  size = 'text-xl',
  disabled = false,
  courseid = null,
  doubtid = null
}) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    setRating(initialRating);
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialRating, initialIsLiked, initialLikeCount]);

  const handleRatingClick = (starValue) => {
    if (disabled) return;

    const newRating = rating === starValue ? 0 : starValue;
    setRating(newRating);
    updateRating(newRating);
  };

  const updateRating = async (newRating) => {
    try {
      console.log("came to update functions")
      if (courseid) {
        await axios.post("/api/marketplace/update-course-rating", {
          courseid,
          rating: newRating,
        });
      } else if (doubtid) {
        console.log("reaced api call for doubt post"+newRating)
        await axios.post("/api/doubtplace/update-doubt-rating", {
          doubtid,
          rating: newRating,
        });
      }
    } catch (err) {
      console.error("Failed to update rating:", err);
    }
  };

  const toggleLike = async () => {
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setLikeCount((prev) => prev + (newLikeStatus ? 1 : -1));

    try {
      if (courseid) {
        await axios.post("/api/marketplace/toggle-course-like", {
          courseid,
          isLiked: newLikeStatus,
        });
      } else if (doubtid) {
        await axios.post("/api/doubtplace/toggle-doubt-like", {
          doubtid,
          isLiked: newLikeStatus,
        });
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  return (
    <div className="flex flex-col gap-1 text-gray-700">
      {/* Star Rating */}
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => !disabled && setHover(0)}
            disabled={disabled}
            className={`${size} transition-all duration-150 ${
              disabled 
                ? 'cursor-not-allowed' 
                : 'hover:scale-110 active:scale-95 cursor-pointer'
            } ${
              star <= (hover || rating) 
                ? 'text-yellow-400 drop-shadow-sm' 
                : 'text-gray-300'
            } ${!disabled && 'hover:text-yellow-500'}`}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            ({rating}/5)
          </span>
        )}
      </div>

      {/* Average Rating */}
      <div className="text-sm text-gray-500">
        Avg: {averageRating.toFixed(1)} / 5
      </div>

      {/* Like Button */}
      <div className="flex items-center space-x-2 mt-1">
        <button
          onClick={toggleLike}
          disabled={disabled}
          className={`text-lg ${isLiked ? 'text-red-500' : 'text-gray-400'} ${
            !disabled && 'hover:text-red-600'
          } transition-all`}
        >
          ♥
        </button>
        <span className="text-sm">{likeCount}</span>
      </div>
    </div>
  );
}

export default StarRating;
