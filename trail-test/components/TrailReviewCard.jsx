import RatingStars from "./RatingStars";
import styles from "../src/css/TrailReviewCard.module.css";

const TrailReviewCard = ({ review }) => {
  const userName = review?.userId?.name || "User";
  const profilePhoto = review?.userId?.profilePhoto || null;

  const fallbackComment =
    "Amazing trail! The content is well-structured and full of interesting facts.";

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <article className="bg-white border rounded-3 h-100 p-3">
      <div className="d-flex align-items-start gap-3 mb-3">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={userName}
            className={`d-block rounded-circle ${styles.avatar}`}
          />
        ) : (
          <div
            className={`d-flex rounded-circle align-items-center justify-content-center ${styles.avatarPlaceholder}`}
          >
            {getInitials(userName)}
          </div>
        )}

        <div>
          <p className={`${styles.reviewerName} mb-1`}>{userName}</p>
          <RatingStars rating={Number(review.rating || 0)} size="1.3rem" />
        </div>
      </div>

      <p className={`${styles.reviewText} mb-0`}>
        {review.comment || fallbackComment}
      </p>
    </article>
  );
};

export default TrailReviewCard;
