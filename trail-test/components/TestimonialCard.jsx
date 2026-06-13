import styles from "../src/css/TestimonialCard.module.css";

export default function TestimonialCard({
  photo,
  photoAlt,
  color,
  text,
  author,
  description,
}) {
  return (
    <div className="col-12 col-lg-3 pe-lg-3 mb-0 pb-3">
      <div
        className={`${styles.card} d-flex flex-column justify-content-between`}
        style={{ "--testimonial-color": color }}
      >
        <div>
          <div className={styles.thumbnailPhoto}>
            <img src={photo} alt={photoAlt} />
          </div>

          <div className={styles.thumbnailPhotoBg} />

          <p className={styles.cardText}>{text}</p>
        </div>

        <div>
          <p className={styles.cardAuthor}>{author}</p>
          <p className={styles.cardAuthor}>{description}</p>
        </div>
      </div>
    </div>
  );
}
