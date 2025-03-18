import React, { useState } from "react";

const StarRating = ({ onRate }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (star) => {
    setRating(star);
    onRate(star);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRating(star)}
          style={{ fontSize: "24px", cursor: "pointer", color: star <= rating ? "gold" : "gray" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;