import ProgressBar from "react-bootstrap/ProgressBar";
import { useTranslation } from "react-i18next";

import styles from "../src/css/TrailInfoCard.module.css";

import backup_trail_image from "../src/assets/backup_trail_image.png";
import trail_prepare_certification from "../src/assets/my_journey_certification.svg";
import trail_type from "../src/assets/trail_type.svg";
import trail_length from "../src/assets/trail_length.svg";
import trail_location from "../src/assets/trail_location.svg";
import trail_difficulty from "../src/assets/trail_difficulty.svg";
import trail_language from "../src/assets/trail_language.svg";
import trail_points from "../src/assets/trail_points.svg";
import trail_time from "../src/assets/trail_time.svg";

const TrailInfoCard = ({ trail, backendUrl, inProgressCertifications }) => {
  const { t } = useTranslation();

  const addDefaultImg = (event) => {
    event.target.src = backup_trail_image;
  };

  const metaRows = [
    {
      icon: trail_type,
      label: t("season"),
      value: trail?.season ? t(trail.season.toLowerCase()) : "-",
    },
    {
      icon: trail_language,
      label: t("language"),
      value: trail?.language ? t(trail.language.toLowerCase()) : "-",
    },
    {
      icon: trail_difficulty,
      label: t("trail_difficulty_title"),
      value: trail?.difficulty
        ? t(`trail_difficulty.${trail.difficulty.toLowerCase()}`)
        : "-",
    },
    {
      icon: trail_location,
      label: t("location"),
      value: trail?.locality ? t(trail.locality.toLowerCase()) : "-",
    },
    {
      icon: trail_length,
      label: t("trail_length"),
      value: trail?.length ? `${trail.length.toFixed(2)} km` : "-",
    },
    {
      icon: trail_time,
      label: t("estimated_time"),
      value: trail?.estimatedTime ? `${trail.estimatedTime} min` : "-",
    },
    {
      icon: trail_points,
      label: t("total_points"),
      value: trail?.points?.length ?? "-",
    },
  ];

  return (
    <div className={`${styles.card} shadow p-4 mb-3`}>
      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-2 mt-4 d-flex justify-content-center justify-content-lg-start">
          <img
            src={
              trail?.thumbnail
                ? `${backendUrl}${trail.thumbnail}`
                : backup_trail_image
            }
            alt="trail"
            className={styles.image}
            onError={addDefaultImg}
          />
        </div>

        <div className="col-12 col-lg-5 px-lg-2 px-xl-3 pe-xl-5">
          <img
            src={trail_prepare_certification}
            alt="prepare for certification"
            className="mb-3"
          />

          <h1 className={`${styles.fwBlack} fs-3 mb-0`}>{trail?.name}</h1>

          <p
            className={`${styles.description} mt-3 mb-0`}
            dangerouslySetInnerHTML={{ __html: trail?.description }}
          />

          <div className="mt-4 me-5">
            <h2 className={`${styles.fwBlack} fs-6 mb-2`}>
              {t("overall_progress")}
            </h2>

            {inProgressCertifications?.length > 0 ? (
              inProgressCertifications.map((certificate) => {
                const totalQuest = certificate?.trail?.points?.length || 1;
                const answeredQuest = certificate?.answers?.length || 0;
                const progress = Math.round((answeredQuest / totalQuest) * 100);

                return (
                  <div
                    key={certificate._id}
                    className="d-flex align-items-center gap-2 pe-lg-4"
                  >
                    <ProgressBar
                      now={progress}
                      className={styles.progressBar}
                    />
                    <span className="fs-6">{progress}%</span>
                  </div>
                );
              })
            ) : (
              <div className="d-flex align-items-center gap-2 pe-lg-4">
                <ProgressBar now={0} className={styles.progressBar} />
                <span className="fs-6">0%</span>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-5 px-lg-5">
          {metaRows.map((row, index) => (
            <div
              key={row.label}
              className="d-flex align-items-center gap-xl-4 gap-lg-3 ps-xl-3"
            >
              <img src={row.icon} alt="" width={16} height={16} />

              <div
                className={`
          ${styles.metaContent}
          d-flex
          justify-content-between
          align-items-center
          gap-3
          py-2
          pe-xl-5
          pe-lg-4
          flex-grow-1
          ${index === metaRows.length - 1 ? styles.metaContentLast : ""}
        `}
              >
                <strong>{row.label}</strong>

                <span className={`${styles.metaValue} text-end`}>
                  {row.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrailInfoCard;
