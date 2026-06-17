import { useEffect, useRef, useState } from "react";

import MainButton from "./MainButton";

import styles from "../src/css/TrailCard.module.css";

import backup_trail_image from "../src/assets/backup_trail_image.png";
import trailIcon from "../src/assets/trail_card_icon.svg";
import durationIcon from "../src/assets/duration.svg";
import locationIcon from "../src/assets/location.svg";
import difficultyEasyIcon from "../src/assets/difficulty_easy.svg";
import difficultyMediumIcon from "../src/assets/difficulty_medium.svg";
import difficultyHardIcon from "../src/assets/difficulty_hard.svg";
import arrowRightIcon from "../src/assets/trail_card_arrow_right.svg";

const difficultyConfig = {
  easy: { label: "Easy", icon: difficultyEasyIcon },
  moderate: { label: "Medium", icon: difficultyMediumIcon },
  difficult: { label: "Hard", icon: difficultyHardIcon },
};

const stripHtml = (html = "") => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.replace(/\s+/g, " ").trim() || "";
};

const TrailCard = ({
  trail,
  displayName,
  displayDescription,
  basePath,
  t,
  goTo,
}) => {
  const getImageSrc = (image) => {
    if (!image) return backup_trail_image;
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return image;

    return `/${image}`;
  };
  const imageSrc = getImageSrc(trail.image || trail.thumbnail);
  const difficultyKey = trail.difficulty?.toLowerCase();
  const difficulty = difficultyConfig[difficultyKey] || {
    label: trail.difficulty,
    icon: difficultyMediumIcon,
  };
  const titleRef = useRef(null);
  const [titleLines, setTitleLines] = useState(1);
  const plainDescription = stripHtml(displayDescription);

  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const lineHeight = parseFloat(getComputedStyle(titleEl).lineHeight);
    const lines = Math.round(titleEl.scrollHeight / lineHeight);

    setTitleLines(Math.min(lines, 2));
  }, [displayName]);

  return (
    <div className={`card shadow overflow-hidden ${styles.trailCard}`}>
      <div className="d-flex h-100">
        <div className={`p-3 pe-0 flex-shrink-0 ${styles.imageColumn}`}>
          <div className={styles.imageBox}>
            <img
              src={imageSrc}
              alt="trail_thumbnail"
              onError={() => {
                console.error(
                  `Failed to load image for trail "${displayName}":`,
                  imageSrc,
                );
              }}
              className="w-100 h-100 object-fit-cover"
            />
          </div>
        </div>

        <div className="flex-grow-1 min-w-0">
          <div className="card-body h-100 d-flex flex-column p-3">
            <img
              src={trailIcon}
              alt=""
              className={`mb-2 ${styles.trailTypeIcon}`}
            />

            <h3 ref={titleRef} className={`mb-2 ${styles.trailTitle}`}>
              {displayName}
            </h3>

            <p
              className={`mb-2 ${styles.trailDescription} ${
                titleLines > 1 ? styles.descTwoLines : styles.descThreeLines
              }`}
            >
              {plainDescription}
            </p>

            <div className="mt-auto">
              <div
                className={`d-flex align-items-center flex-wrap column-gap-4 row-gap-2 mb-3 ${styles.trailMeta}`}
              >
                <span className="d-flex align-items-center gap-1">
                  <img src={durationIcon} alt="" className={styles.metaIcon} />
                  {trail.estimatedTime} min
                </span>

                <span className="d-flex align-items-center gap-1">
                  <img src={locationIcon} alt="" className={styles.metaIcon} />
                  {t(`trail_location.${trail.locality.toLowerCase()}`)}
                </span>

                <span className="d-flex align-items-center gap-1">
                  <img
                    src={difficulty.icon}
                    alt=""
                    className={styles.metaIcon}
                  />
                  {difficulty.label}
                </span>
              </div>

              <div className="row g-3">
                <div className="col">
                  <MainButton
                    variant="buttonSecondaryGrey"
                    width="100%"
                    height="2.25rem"
                    onClick={() =>
                      goTo(`${basePath}/trails/details/${trail._id}`)
                    }
                  >
                    {t("see_details")}
                  </MainButton>
                </div>

                <div className="col">
                  <MainButton
                    variant="buttonPrimary"
                    width="100%"
                    height="2.25rem"
                    onClick={() =>
                      goTo(`${basePath}/trails/certification/${trail._id}`)
                    }
                  >
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      {t("start_trail")}
                      <img
                        src={arrowRightIcon}
                        alt=""
                        className={styles.arrowIcon}
                      />
                    </span>
                  </MainButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailCard;
