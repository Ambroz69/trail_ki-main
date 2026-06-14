import { useTranslation } from "react-i18next";
import styles from "../src/css/Footer.module.css";

import eu_flag from "../src/assets/eu_flag.png";
import avatar_color from "../src/assets/avatar_color.png";
import information from "../src/assets/information.svg";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.euFooter}>
      <div className="container-fluid px-0 pb-3">
        <div className="d-flex flex-column flex-lg-row align-items-stretch">
          <div className="col-12 col-lg-3 d-flex justify-content-center align-items-center pb-4 py-lg-4">
            <img
              src={avatar_color}
              alt="avatar_color"
              className={styles.footerLogo}
            />
          </div>

          <div
            className={`col-12 col-lg-5 d-flex flex-column justify-content-center px-4 px-lg-5 py-4 ${styles.footerMiddle}`}
          >
            <p className={`${styles.footerTextBold} mb-2`}>
              PROJECT AVATAR - caring for All Vulnerable Animals Through an
              Active Relationship with nature
            </p>

            <p className={`${styles.footerText} mb-0`}>
              Contract number: 2023-1-SK01-KA220-SCH-000155430
            </p>
          </div>

          <div className="col-12 col-lg-4 d-flex justify-content-center align-items-center py-4">
            <img src={eu_flag} alt="eu_flag" className={styles.euLogo} />
          </div>
        </div>

        <div className={`${styles.disclaimerRow} px-4 px-lg-5 py-4 mt-4`}>
          <div className="d-flex align-items-lg-start align-items-center gap-4">
            <div
              className={`d-flex justify-content-center align-items-center ${styles.infoIcon}`}
            >
              <img
                src={information}
                alt="information"
                className={styles.infoIconImg}
              />
            </div>

            <p className={`${styles.footerText} mb-0`}>
              Funded by the European Union. Views and opinions expressed are
              however those of the author(s) only and do not necessarily reflect
              those of the European Union or SAAIC - the National Agency for the
              Erasmus+ Programme for Education and Training Sectors. Neither the
              European Union nor the granting authority can be held responsible
              for them.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
