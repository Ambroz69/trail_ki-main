import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Cookies from "universal-cookie";
import styles from '../css/TrailGrid.module.css';
import { useTranslation } from 'react-i18next';
import NavbarExplorer from '../NavbarExplorer';

// SVG imports
import title_page_logo from '../../src/assets/title_page_logo.svg';
import trail_prepare_certification from '../../src/assets/trail_prepare_certification.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ExplorerJourney = () => {
  const [certifications, setCertifications] = useState([]);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const { t } = useTranslation(); // Hook for translations
  const [progress, setProgress] = useState(58);

  // Dummy certificates data
  const dummyCertificates = [
    { id: 1, name: "Bratislava Zoo Wildlife Adventure" },
    { id: 2, name: "Bojnice Zoo Adventure" },
    { id: 3, name: "Discover Nitra: A Journey Through History and Nature" },
  ];

  const dummyProgress = [
    { id: 1, name: "Bratislava Zoo Wildlife Adventure", thumbnail: "uploads\\1735493628497-trailforrest.jpg" }
  ]

  const getUserRole = () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload?.userRole || "explorer";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "explorer"; // Default role
    }
  };

  const userRole = getUserRole();
  const basePath = userRole === "manager" ? "/manager" : userRole === "trail creator" ? "/creator" : "/explorer";

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${backendUrl}/certifications`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    api(configuration)
      .then((response) => {
        setCertifications(response.data.data);
      })
      .catch((error) => {
        setAlert({ message: `${t('error_trail')}`, type: 'error' });
        console.log(error);
      });
  }, []);

  return (
    <div className='row d-flex mx-0 px-0'>
      {/* Navbar */}
      <NavbarExplorer />

      <div className={`${styles.show_trail_bg} py-3 px-0 offset-lg-2 col-lg-8`}>
        <h2 className="mb-4">
          <span className="me-2"></span> {/* Placeholder for your journey icon */}
          {t("your_journey")}
        </h2>

        {/* Trail Journey Highlights */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card p-3">
              <h5>
                <span className="me-2"></span> {/* Placeholder for hall of fame icon */}
                {t("hall_of_fame")}
              </h5>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <p>{t("celebrate_achievements")}</p>
                <Button variant="danger">{t("leaderboard")}</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-12 d-flex flex-column flex-lg-row justify-content-between align-items-center">
          {/* Rating Card */}
          <div className="col-md-4">
            <div className="card p-3 mb-3 d-flex flex-row align-items-center shadow-sm">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3 bg-dark"
                style={{ width: "50px", height: "50px" }}>
                <span className="text-white fs-5">:)</span> {/* Placeholder for icon */}
              </div>
              <div className="flex-grow-1">
                <h6 className="text-uppercase text-muted fw-bold mb-1">{t("rating")}</h6>
                <p className="mb-0 text-dark">{t("review_trail_highlights")}</p>
              </div>
              <span className="text-muted fs-4">➝</span> {/* Arrow icon */}
            </div>
          </div>
          {/* Apply Card */}
          <div className="col-md-4">
            <div className="card p-3 mb-3 d-flex flex-row align-items-center shadow-sm">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "50px", height: "50px", backgroundColor: "#26A69A" }}>
                <span className="text-white fs-5">:)</span> {/* Placeholder for icon */}
              </div>
              <div className="flex-grow-1">
                <h6 className="text-uppercase text-muted fw-bold mb-1">{t("apply")}</h6>
                <p className="mb-0 text-dark">{t("apply_text")}</p>
              </div>
              <span className="text-muted fs-4">➝</span> {/* Arrow icon */}
            </div>
          </div>
          {/* Practice Card */}
          <div className="col-md-4">
            <div className="card p-3 mb-3 d-flex flex-row align-items-center shadow-sm">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "50px", height: "50px", backgroundColor: "#1E88E5" }}>
                <span className="text-white fs-5">:(</span> {/* Placeholder for icon */}
              </div>
              <div className="flex-grow-1">
                <h6 className="text-uppercase text-muted fw-bold mb-1">{t("practice")}</h6>
                <p className="mb-0 text-dark">{t("practice_text")}</p>
              </div>
              <span className="text-muted fs-4">➝</span> {/* Arrow icon */}
            </div>
          </div>
        </div>

        {/* Current Certification Progress - musím opraviť certifikáciu, aby som robil medziprogress, zatiaľ dummyMe */}
        <h3>
          <span className="me-2"></span> {/* Placeholder for certification progress icon */}
          {t("keep_up_the_great_work")}
        </h3>
        <div className="card p-3 mb-4">
          <div>
            <img src={trail_prepare_certification} alt="trail_prepare_certification" className='pe-2' />
          </div>
          {(certifications.length > 0 ? certifications : dummyProgress).map((certificate) => (
            <>
              <div className='d-flex mt-3'>
                <img src={certificate?.trail?.thumbnail ? `${backendUrl}/${certificate?.trail?.thumbnail}` : certificate.thumbnail} alt="trail_img" style={{ width: '5rem', height: '5rem', borderRadius: '0.5rem' }} className='me-2' />
                <h2 className={`${styles.trail_heading} ms-2`}>{certifications.length > 0 ? certificate?.trail?.name : certificate.name}</h2>
              </div>
              <p><strong>{t("overall_progress")}</strong></p>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <ProgressBar now={progress} label={`${progress}%`} className="col-md-8 mb-3" />
                <Button variant="danger">{t("keep_making_progress")}</Button>
              </div>
            </>
          ))}
        </div>

        {/* Completed Trails & Certificates */}
        <h4 className="d-flex align-items-center">
          <span className="me-2"></span> {/* Placeholder for mission accomplished icon */}
          {t("mission_accomplished")}
          <a href="#" className="ms-auto text-primary text-decoration-none text-sm">
            {t("see_all_in_my_library")}
          </a>
        </h4>
        <div className="card p-3">
          {(certifications.length > 0 ? certifications : dummyCertificates).map((certificate) => (
            <div key={certificate.id} className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-dark d-flex align-items-center justify-content-center me-3"
                  style={{ width: "40px", height: "40px" }}>
                  {/* Placeholder for icon */}
                </div>
                <div>
                  <span className="text-sm">{t("trail_upper")}</span>
                  <h5>{certifications.length > 0 ? certificate.trail.name : certificate.name}</h5>
                  <span className="text-success">✔ {t("complete")}</span>
                </div>
              </div>
              <Button variant="outline-dark">{t("get_certificate")}</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className={`bg-white px-0`}>
        <div className={`${styles.footer_bg} py-5 px-3 px-lg-0`}>
          <div className={`offset-lg-2`}>
            <div className="d-flex">
              <img src={title_page_logo} alt="title_page_logo" className='ps-2' />
              <div className="col-lg-3 pe-5">
                <p className={`${styles.footer_text} pt-3 ps-4 text-white`}>{t("footer_description")}</p>
              </div>
            </div>
            <p className="mt-5 mb-0 text-white">© 2024 AVA Trail | {t("university_name")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExplorerJourney;