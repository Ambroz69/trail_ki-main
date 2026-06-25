import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";

import RatingStars from "./RatingStars";
import TrailReviewCard from "./TrailReviewCard";
import styles from "../src/css/TrailReview.module.css";

import trail_rating from "../src/assets/trail_rating.svg";
import arrowRightIcon from "../src/assets/trail_card_arrow_right.svg";

const TrailReview = ({ reviews = [] }) => {
  const { t } = useTranslation();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviews.length
      : 0;

  const reviewLabel = reviews.length === 1 ? "review" : "reviews";

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section
      id="ratings"
      className={`${styles.card} bg-white border rounded-4 shadow mb-3 p-4`}
    >
      <div className="row g-4 align-items-center">
        <div className="col-12 col-lg-3">
          <div className={`${styles.summary} d-flex align-items-start gap-3`}>
            <img src={trail_rating} alt="" width={24} height={24} />

            <div>
              <h2 className={`${styles.sectionTitle} mb-4`}>
                {t("ratings_reviews") || "Ratings & Reviews"}
              </h2>

              {reviews.length > 0 ? (
                <>
                  <p className={`${styles.averageText} mb-1`}>
                    {averageRating.toFixed(1)} out of 5
                  </p>

                  <RatingStars rating={averageRating} size="2.7rem" />

                  <p className={`${styles.reviewCount} mt-3 mb-0`}>
                    ({reviews.length} {t(reviewLabel) || reviewLabel})
                  </p>
                </>
              ) : (
                <p className={`${styles.description} mb-0`}>
                  {t("no_reviews")}
                </p>
              )}
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="col-12 col-lg-9">
            <div className="d-flex align-items-center gap-3">
              <div className={styles.viewport} ref={emblaRef}>
                <div className={styles.container}>
                  {reviews.map((review) => (
                    <div className={styles.slide} key={review._id}>
                      <TrailReviewCard review={review} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-none d-lg-flex flex-column gap-3">
                <button
                  type="button"
                  className={`${styles.arrowButton} d-flex align-items-center justify-content-center ${
                    selectedIndex === 0 ? styles.arrowButtonDisabled : ""
                  }`}
                  onClick={() => emblaApi?.scrollPrev()}
                  disabled={selectedIndex === 0}
                >
                  <img
                    src={arrowRightIcon}
                    alt=""
                    className={styles.prevIcon}
                  />
                </button>

                <button
                  type="button"
                  className={`${styles.arrowButton} d-flex align-items-center justify-content-center ${
                    selectedIndex === scrollSnaps.length - 1
                      ? styles.arrowButtonDisabled
                      : ""
                  }`}
                  onClick={() => emblaApi?.scrollNext()}
                  disabled={selectedIndex === scrollSnaps.length - 1}
                >
                  <img src={arrowRightIcon} alt="" />
                </button>
              </div>
            </div>

            <div className="d-flex d-lg-none justify-content-center gap-2 mt-3">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.dot} ${
                    index === selectedIndex ? styles.dotActive : ""
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrailReview;
