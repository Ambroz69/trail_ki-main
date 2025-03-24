import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Button from 'react-bootstrap/Button';
import Cookies from "universal-cookie";
import styles from '../css/TrailGrid.module.css';
import { useTranslation } from 'react-i18next';
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';
import ReactPaginate from 'react-paginate';

// SVG imports
import my_journey_apply from '../../src/assets/my_journey_apply.svg';
import my_journey_complete from '../../src/assets/my_journey_complete.svg';
import my_journey_mission from '../../src/assets/my_journey_mission.svg';
import my_journey_trail_star from '../../src/assets/my_journey_trail_star.svg';


const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CertificatesLibrary = () => {
  const [certifications, setCertifications] = useState([]);
  const { t } = useTranslation(); // Hook for translations
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;


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
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)); // sort by most recent
        setCertifications(completedCertifications);
      })
      .catch((error) => {
        setAlert({ message: `${t('error_trail')}`, type: 'error' });
        console.log(error);
      });
  }, []);

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

  const offset = currentPage * itemsPerPage;
  const currentPageData = certifications.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(certifications.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0);
  };

  return (
    <div className='row d-flex mx-0 px-0'>
      {/* Navbar */}
      <NavbarExplorer />
      <div className={`${styles.show_trail_bg}`}>
        <div className={`py-4 px-0 offset-lg-2 col-lg-8`}>
          {/* Completed Trails & Certificates */}
          <h2 className="d-flex flex-row fs-5 pb-2">
            <img src={my_journey_mission} alt="my_journey_mission" className='me-3' width={16}></img>
            {t("mission_accomplished")}
          </h2>
          {/* Certificates */}
          <div className='d-none d-lg-block'>
            {certifications.length > 0 ? (
              (currentPageData).map((certificate) => (
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
              ))) : (
              <div className={`${styles.my_journey_card} card d-flex flex-row p-3 p-lg-4 mb-3`}>
                <div className="rounded-circle d-flex align-items-center justify-content-center me-4"
                  style={{ minWidth: "50px", height: "50px", backgroundColor: "#67C4A7" }}>
                  <img className="text-white fs-5" src={my_journey_apply} placeholder="my_journey_apply"></img>
                </div>
                <p className={`${styles.my_journey_body_text} m-0`}>{t("no_certificates")}</p>
              </div>
            )}

            {/* Pagination */}
            {certifications.length > itemsPerPage && (
              <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                breakLabel={"..."}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center mt-4"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
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
              ))) : (
              <div className={`${styles.my_journey_card} card d-flex flex-column p-3 mb-3`}>
                <div className='d-flex flex-column justify-content-center'>
                  <p className={`${styles.my_journey_body_text} m-0`}>{t("no_certificates")}</p>
                </div>
              </div>
            )}
          </div>
        </div >
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CertificatesLibrary;