import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Cookies from "universal-cookie";
import styles from '../css/TrailGrid.module.css';
import { useTranslation } from 'react-i18next';
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';

// SVG imports
import title_page_logo from '../../src/assets/title_page_logo.svg';
import trail_prepare_certification from '../../src/assets/trail_prepare_certification.svg';
import my_journey_apply from '../../src/assets/my_journey_apply.svg';
import my_journey_arrow from '../../src/assets/my_journey_arrow.svg';
import my_journey_ava_trail from '../../src/assets/my_journey_ava_trail.svg';
import my_journey_complete from '../../src/assets/my_journey_complete.svg';
import my_journey_hall_of_fame from '../../src/assets/my_journey_hall_of_fame.svg';
import my_journey_keep_up from '../../src/assets/my_journey_keep_up.svg';
import my_journey_mission from '../../src/assets/my_journey_mission.svg';
import my_journey_practice from '../../src/assets/my_journey_practice.svg';
import my_journey_rating from '../../src/assets/my_journey_rating.svg';
import my_journey_trail_star from '../../src/assets/my_journey_trail_star.svg';
import my_journey_certification from '../../src/assets/my_journey_certification.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ExplorerJourney = () => {
  const [certifications, setCertifications] = useState([]);
  const [inProgressCertifications, setInProgressCertifications] = useState([]);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const { t } = useTranslation(); // Hook for translations

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
        const allCertifications = response.data.data;
        const completedCertifications = allCertifications
          .filter(cert => cert.status === "Passed")
          .reduce((unique, cert) => {
            const existing = unique.find(item => item.trail._id === cert.trail._id);
            if (!existing || cert.score > existing.score) {
              return unique.filter(item => item.trail._id !== cert.trail._id).concat(cert);
            }
            return unique;
          }, [])
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)) // sort by most recent
          .slice(0, 3); // limit to last 3 certificates
        const inProgress = allCertifications.filter(cert => cert.status === null);
        const latestInProgress = inProgress.length > 1
          ? inProgress.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0] : null;
        setCertifications(completedCertifications);
        setInProgressCertifications(latestInProgress || inProgress);
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
      <div className={`${styles.show_trail_bg} py-4 px-0`}>
        <div className={`offset-lg-2 col-lg-8 px-3 px-lg-0`}>
          <h2 className="d-flex flex-row fs-5 pb-2">
            <img src={my_journey_ava_trail} alt="my_journey_ava_trail" className='me-3' width={16}></img>
            {t("your_journey")}
          </h2>
          {/* Trail Journey Highlights */}
          <div className={`${styles.my_journey_card} card d-none d-lg-flex flex-row p-4 mb-3`}>
            <div className="rounded-circle d-flex align-items-center justify-content-center me-4"
              style={{ minWidth: "50px", height: "50px", backgroundColor: "#00A6CF" }}>
              <img className="text-white fs-5" src={my_journey_hall_of_fame} placeholder="my_journey_hall_of_fame"></img>
            </div>
            <div className='d-flex flex-column justify-content-center'>
              <h5 className={`${styles.my_journey_header_text}`}>
                {t("hall_of_fame")}
              </h5>
              <p className={`${styles.my_journey_body_text} m-0`}>{t("celebrate_achievements")}</p>
            </div>
            <div className='ms-auto d-flex align-items-center'>
              <Button className={`${styles.my_journey_button} align-self-center px-5 py-2`} href={`${basePath}/leaderboard`}>{t("leaderboard")}</Button>
            </div>
          </div>
          {/* Trail Journey Highlights  MOBILE */}
          <div className={`${styles.my_journey_card} card d-flex d-lg-none p-3 mb-3`}>
            <div className='d-flex flex-row'>
              <div className="rounded-circle d-flex align-items-center justify-content-center me-4 align-self-center"
                style={{ minWidth: "50px", height: "50px", backgroundColor: "#00A6CF" }}>
                <img className="text-white fs-5" src={my_journey_hall_of_fame} placeholder="my_journey_hall_of_fame"></img>
              </div>
              <div>
                <h5 className={`${styles.my_journey_header_text}`}>
                  {t("hall_of_fame")}
                </h5>
                <p className={`${styles.my_journey_body_text} m-0`}>{t("celebrate_achievements")}</p>
              </div>
            </div>
            <div className='d-flex'>
              <Button className={`${styles.my_journey_button} flex-fill py-1 mt-3`} href={`${basePath}/leaderboard`}>{t("leaderboard")}</Button>
            </div>
          </div>

          <div className="d-flex flex-column flex-lg-row gap-3 mb-4">
            {/* Rating Card */}
            <Button className={`${styles.my_journey_card_button} flex-fill card p-0 m-0`} href={`#`}>
              <div className={`${styles.my_journey_card} d-flex flex-row p-3 p-lg-4 pe-2`}>
                <div className="rounded-circle d-flex align-items-center justify-content-center me-4"
                  style={{ minWidth: "50px", height: "50px", backgroundColor: "#9465A9" }}>
                  <img className="text-white fs-5" src={my_journey_rating} placeholder="my_journey_rating"></img>
                </div>
                <div className='d-flex flex-column justify-content-center'>
                  <h5 className={`${styles.my_journey_header_text} mb-1 text-start`}>{t("rating")}</h5>
                  <p className={`${styles.my_journey_body_text} m-0`}>{t("review_trail_highlights")}</p>
                </div>
                <div className='ms-auto d-flex align-items-center'>
                  <img className="text-white fs-5" src={my_journey_arrow} placeholder="my_journey_arrow" width={32}></img>
                </div>
              </div>
            </Button>

            {/* Apply Card */}
            <Button className={`${styles.my_journey_card_button} flex-fill card p-0 m-0`} href={`#`}>
              <div className={`${styles.my_journey_card} d-flex flex-row p-3 p-lg-4 pe-2`}>
                <div className="rounded-circle d-flex align-items-center justify-content-center me-4"
                  style={{ minWidth: "50px", height: "50px", backgroundColor: "#67C4A7" }}>
                  <img className="text-white fs-5" src={my_journey_apply} placeholder="my_journey_apply"></img>
                </div>
                <div className='d-flex flex-column justify-content-center'>
                  <h5 className={`${styles.my_journey_header_text} mb-1 text-start`}>{t("apply")}</h5>
                  <p className={`${styles.my_journey_body_text} m-0`}>{t("apply_text")}</p>
                </div>
                <div className='ms-auto d-flex align-items-center'>
                  <img className="text-white fs-5" src={my_journey_arrow} placeholder="my_journey_arrow" width={32}></img>
                </div>
              </div>
            </Button>
            {/* Practice Card */}
            <Button className={`${styles.my_journey_card_button} flex-fill card p-0 m-0`} href={`${basePath}/practice`}>
              <div className={`${styles.my_journey_card} d-flex flex-row p-3 p-lg-4 pe-2`}>
                <div className="rounded-circle d-flex align-items-center justify-content-center me-4"
                  style={{ minWidth: "50px", height: "50px", backgroundColor: "#4783B5" }}>
                  <img className="text-white fs-5" src={my_journey_practice} placeholder="my_journey_practice"></img>
                </div>
                <div className='d-flex flex-column justify-content-center'>
                  <h5 className={`${styles.my_journey_header_text} mb-1 text-start`}>{t("practice")}</h5>
                  <p className={`${styles.my_journey_body_text} m-0`}>{t("practice_text")}</p>
                </div>
                <div className='ms-auto d-flex align-items-center'>
                  <img className="text-white fs-5" src={my_journey_arrow} placeholder="my_journey_arrow" width={32}></img>
                </div>
              </div>
            </Button>
          </div>
          {/* Current Certification Progress */}
          <h2 className="d-flex flex-row fs-5 pb-2">
            <img src={my_journey_keep_up} alt="my_journey_keep_up" className='me-3' width={16}></img>
            {t("keep_up_the_great_work")}
          </h2>
          <div className={`${styles.my_journey_card} card d-flex p-3 ps-lg-5 pe-lg-4 py-lg-4 mb-4`}>
            <div>
              <img src={my_journey_certification} alt="my_journey_certification" className='' />
            </div>
            {inProgressCertifications.length > 0 ? (
              (inProgressCertifications).map((certificate) => {
                const totalQuest = certificate?.trail?.points?.length || 1;
                const answeredQuest = certificate?.answers?.length;
                const progress = Math.round((answeredQuest / totalQuest) * 100);
                return (
                  <>
                    <div className='d-flex my-3 mb-lg-4 '>
                      <img src={certificate?.trail?.thumbnail ? `${backendUrl}/${certificate?.trail?.thumbnail}` : certificate.thumbnail} alt="trail_img" style={{ width: '5rem', height: '5rem', borderRadius: '0.5rem' }} className='me-2' />
                      <h2 className={`${styles.trail_heading} font-bold ps-2 col-lg-8 align-self-center`}>{inProgressCertifications.length > 0 ? certificate?.trail?.name : certificate.name}</h2>
                    </div>
                    <p className='mb-1 font-bold'>{t("overall_progress")}</p>
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start mb-2">
                      <ProgressBar now={progress || 10} label={`${progress || 10}%`} className="col-12 col-lg-8 mb-3 m-lg-0" />
                      <Button className={`${styles.my_journey_button} px-4 py-2`} href={`${basePath}/trails/certification/${certificate?.trail?._id}`}>
                        {t("keep_making_progress")}
                      </Button>
                    </div>
                  </>
                )
              })) : (
              <>
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start mb-2 py-4">
                  <Button className={`${styles.my_journey_button} px-4 py-2`} href={`${basePath}/homeuser`}>
                    {t("explore_nav_explore")}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Completed Trails & Certificates */}
          <h2 className="d-flex flex-row fs-5 pb-2">
            <img src={my_journey_mission} alt="my_journey_mission" className='me-3' width={16}></img>
            {t("mission_accomplished")}
            <a href={`${basePath}/certificates`} className={`${styles.my_journey_library_link} ms-auto me-lg-4`}>
              {t("see_all_in_my_library")}
            </a>
          </h2>
          {/* Certificates */}
          <div className='d-none d-lg-block'>
            {certifications.length > 0 ? (
              (certifications).map((certificate) => (
              <div key={certificate._id} className={`${styles.my_journey_card} card d-flex flex-row p-3 p-lg-4 mb-3`}>
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3 align-self-center"
                  style={{ minWidth: "50px", height: "50px", backgroundColor: "#4D938B" }}>
                  <img className="text-white fs-5" src={my_journey_trail_star} placeholder="my_journey_trail_star"></img>
                </div>
                <div>
                  <h5 className={`${styles.my_journey_header_text} mb-0`}>
                    {t("trail_upper")}
                  </h5>
                  <p className={`${styles.my_journey_body_text_2} my-1`}>{certifications.length > 0 ? certificate.trail.name : certificate.name}</p>
                  <h5 className={`${styles.my_journey_header_text_2} d-flex mb-0`}>
                    <img className="text-white fs-5 me-1" src={my_journey_complete} placeholder="my_journey_complete"></img> {t("complete")}
                  </h5>
                </div>
                <div className='ms-auto d-flex align-items-center'>
                  <Button className={`${styles.my_journey_button_certificate} px-4 py-2`} onClick={() => window.open(`${basePath}/certificate/${certificate?.trail?._id}`, "_blank")} >{t("get_certificate")}</Button>
                </div>
              </div>
            ))):(
              <div className={`${styles.my_journey_card} card d-flex flex-row p-3 p-lg-4 mb-3`}>
                <div className="rounded-circle d-flex align-items-center justify-content-center me-4"
                  style={{ minWidth: "50px", height: "50px", backgroundColor: "#67C4A7" }}>
                  <img className="text-white fs-5" src={my_journey_apply} placeholder="my_journey_apply"></img>
                </div>
                <p className={`${styles.my_journey_body_text} m-0`}>{t("no_certificates")}</p>
              </div>
            )}
          </div>
          {/* Certificates MOBILE */}
          <div className='d-block d-lg-none'>            
            {certifications.length > 0 ? (
            (certifications).map((certificate) => (
              <div key={certificate.id} className={`${styles.my_journey_card} card d-flex flex-column p-3 mb-3`}>
                <div className='d-flex flex-row mb-3'>
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3 align-self-center"
                    style={{ minWidth: "50px", height: "50px", backgroundColor: "#4D938B" }}>
                    <img className="text-white fs-5" src={my_journey_trail_star} placeholder="my_journey_trail_star"></img>
                  </div>
                  <div>
                    <h5 className={`${styles.my_journey_header_text} mb-0`}>
                      {t("trail_upper")}
                    </h5>
                    <p className={`${styles.my_journey_body_text_2} my-1`}>{certifications.length > 0 ? certificate.trail.name : certificate.name}</p>
                    <h5 className={`${styles.my_journey_header_text_2} d-flex mb-0`}>
                      <img className="text-white fs-5 me-1" src={my_journey_complete} placeholder="my_journey_complete"></img> {t("complete")}
                    </h5>
                  </div>
                </div>
                <div className='d-flex align-items-center'>
                  <Button className={`${styles.my_journey_button_certificate} px-4 py-2`} onClick={() => window.open(`${basePath}/certificate/${certificate?.trail?._id}`, "_blank")}>{t("get_certificate")}</Button>
                </div>
              </div>
            ))):(
              <div className={`${styles.my_journey_card} card d-flex flex-column p-3 mb-3`}>
                <div className='d-flex flex-column justify-content-center'>
                  <p className={`${styles.my_journey_body_text} m-0`}>{t("no_certificates")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExplorerJourney;