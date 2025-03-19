import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useParams } from 'react-router-dom';
import styles from '../css/Certificate.module.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

import Cookies from "universal-cookie";

import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';

// SVG imports
import title_page_logo from '../assets/title_page_logo.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Certificate = () => {
  const { id } = useParams();
  const { t } = useTranslation(); // Hook to access translations
  const [user, setUser] = useState(null);
  const [certification, setCertification] = useState(null);
  const [trail, setTrail] = useState(null);

  useEffect(() => {
    // Get user details
    const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;
    if (userId) {
      const configurationUser = {
        method: "get",
        url: `${backendUrl}/users/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      api(configurationUser)
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // Get trail details
    const configurationTrail = {
      method: "get",
      url: `${backendUrl}/trails/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configurationTrail)
      .then((response) => {
        setTrail(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch certification details
    const configurationCert = {
      method: "get",
      url: `${backendUrl}/certifications/certificate/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configurationCert)
      .then((response) => {
        setCertification(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    
  }, [id, token]);

  const handlePrint = () => {
    window.print();
  };

  /*useEffect(() => {
    // Trigger print when the page loads
    const timer = setTimeout(() => {
      window.print();
    }, 2000); // Slight delay ensures content is loaded

    return () => clearTimeout(timer);
  }, []);*/

  return (
    <>
      <NavbarExplorer />
      <div className={`${styles.certificateContainer}`}>
        <div className={styles.certificate}>
          <div className={`py-3 px-0 offset-lg-2 col-lg-8`}>
            <img src={title_page_logo} alt="title_page_logo" className='ps-2' width={110} />
            <h1 className={styles.title}>{t("certificate_of_completion")}</h1>
            <p className={styles.subtitle}>{t("this_is_to_certify")}</p>
            <h2 className={styles.userName}>{user?.name}</h2>
            <p className={styles.text}>
              {t("has_successfully_completed_the_trail")}
            </p>
            <h3 className={styles.trailName}>{trail?.name}</h3>
            <img src={`${backendUrl}/${trail?.thumbnail}`} alt="Trail Thumbnail" className={styles.thumbnail} />
            <p className={styles.text}>
              {t("with_a_score_of")} <strong>{certification?.score}</strong> {t("out_of")} {trail?.points?.reduce((sum, p) => sum + (p.quiz?.points || 0), 0)}
            </p>
            <p className={styles.date}>{t("date")}: {new Date(certification?.completedAt).toLocaleDateString()}</p>
            <button onClick={handlePrint} className={styles.printButton}>{t("print_certificate")}</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Certificate;