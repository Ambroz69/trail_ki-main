import React, { useState } from "react";

import rating_star from '../src/assets/rating_star.svg';
import rating_star_gold from '../src/assets/rating_star_gold.svg';

const StarRating = ({ onRate }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (star) => {
    setRating(star);
    onRate(star);
  };

  return (
    <div className="d-flex flex-row justify-content-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <img
          src={star <= rating ? rating_star_gold : rating_star }
          placeholder="rating_star"
          key={star}
          onClick={() => handleRating(star)}
          width={48}
          style={{ fontSize: "48px", cursor: "pointer",  }}
        >
        </img>
      ))}
    </div>
  );
};

export default StarRating;