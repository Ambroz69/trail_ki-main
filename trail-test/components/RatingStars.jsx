import styles from "../src/css/RatingStars.module.css";

function getStarFill(value) {
  if (value <= 0.1) return 0;
  if (value <= 0.35) return 35;
  if (value <= 0.65) return 50;
  if (value <= 0.9) return 65;
  return 100;
}

export default function RatingStars({
  rating,
  size = "2rem",
}) {
  if (rating < 0 || rating > 5) {
    throw new Error(
      `RatingStars: rating must be between 0 and 5. Received ${rating}.`
    );
  }

  return (
    <div
      className={styles.stars}
      style={{ "--star-size": size }}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const starValue = rating - (star - 1);
        const fillPercentage = getStarFill(starValue);

        return (
          <span
            key={star}
            className={styles.star}
            style={{ "--star-fill": `${fillPercentage}%` }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
