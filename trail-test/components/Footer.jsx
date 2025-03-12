import { useTranslation } from 'react-i18next';
import styles from '../src/css/TrailGrid.module.css';

// SVG imports
import title_page_logo from '../src/assets/title_page_logo.svg';

function Footer() {

  const { t } = useTranslation(); // Hook for translations

  return (
    <footer className={`bg-white px-0`}>
      <div className={`${styles.footer_bg} py-5 px-3 px-lg-0`}>
        <div className={`offset-lg-2`}>
          <div className="d-flex">
            <img src={title_page_logo} alt="title_page_logo" className='ps-2' width={110} />
            <div className="col-lg-3 pe-5">
              <p className={`${styles.footer_text} pt-3 ps-4 text-white`}>{t("footer_description")}</p>
            </div>
          </div>
          <p className="mt-5 mb-0 text-white">© 2024 AVAtar | {t("university_name")}</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;