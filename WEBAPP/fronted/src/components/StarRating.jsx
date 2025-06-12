// StarRating.jsx
import { useState, useEffect } from 'react'
import axios from "../utils/axios.js";
function StarRating({ 
  initialRating = 0,  
  size = 'text-xl',
  disabled = false,
  courseid = null 
}) {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)

  // Update rating when initialRating changes
  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  const handleClick = (starValue) => {
    if (disabled) return
    
    const newRating = rating === starValue ? 0 : starValue
    setRating(newRating)
    
    // Call parent callback with courseid and rating
      onRatingChange(newRating)

  }

  const onRatingChange=async (newRating)=>{
    // to write calls to db.
    if(!courseid) {return ;}
    await axios.post("/api/marketplace/updatecourserating",{courseid,newRating});
  }
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleClick(star)}
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
  )
}

export default StarRating;