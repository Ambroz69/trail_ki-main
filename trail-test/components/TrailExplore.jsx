import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";

import styles from "../src/css/TrailExplore.module.css";

import certificate from "../src/assets/certificate.png";
import trail_certification from "../src/assets/trail_certification.svg";
import trail_qr_code from "../src/assets/trail_qr_code.svg";
import trail_lock from "../src/assets/trail_lock.svg";

const TrailExplore = ({ trail, originURL }) => {
  const { t } = useTranslation();

  return (
    <div className="row g-3 mb-3">
      <div className="col-12 col-lg-7">
        <div className={`${styles.card} shadow h-100 p-4`}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <img src={trail_certification} alt="" width={24} height={24} />
            <h2 className={`${styles.sectionTitle} mb-0`}>
              {t("certification")}
            </h2>
          </div>

          <div className="row g-4 align-items-center">
            <div className="col-12 col-md-5">
              <img
                src={certificate}
                alt="certificate"
                className={styles.certificateImage}
              />
            </div>

            <div className="col-12 col-md-7">
              <h3 className={`${styles.heading} mb-2`}>
                {t("certification_text1") || "You're on your way!"}
              </h3>

              <p className={`${styles.description} mb-4 col-12 col-lg-6 col-xl-5`}>
                {t("certification_text2")}
              </p>

              <div className="row g-3">
                <div className="col-12 col-xl-6">
                  <button
                    type="button"
                    className={`${styles.lockButton} d-flex align-items-center w-100`}
                  >
                    <span className={`${styles.lockIcon} me-3`}>
                      <img src={trail_lock} alt="" />
                    </span>
                    {t("environment_guardian")}
                  </button>
                </div>

                <div className="col-12 col-xl-6">
                  <button
                    type="button"
                    className={`${styles.lockButton} d-flex align-items-center w-100`}
                  >
                    <span className={`${styles.lockIcon} me-3`}>
                      <img src={trail_lock} alt="" />
                    </span>
                    {t("trail_master")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-5">
        <div className={`${styles.card} shadow h-100 p-4`}>
          <div className="d-flex align-items-center gap-2 mb-4">
            <img src={trail_qr_code} alt="" width={24} height={24} />
            <h2 className={`${styles.sectionTitle} mb-0`}>
              {t("scan_explore")}
            </h2>
          </div>

          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
            <div className={styles.qrWrap}>
              <QRCode
                value={`${originURL}/explorer/trails/details/${trail?._id}`}
                className={styles.qrCode}
              />
            </div>

            <div className="col-12 col-lg-6 ps-3">
              <h3 className={`${styles.heading} mb-2`}>
                {t("qr_code_text1") || "Take this trail on the go"}
              </h3>

              <p className={`${styles.description} mb-0`}>
                {t("qr_code_text2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailExplore;
