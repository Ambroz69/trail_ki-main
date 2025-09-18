import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useParams } from "react-router-dom";
import styles from "../css/Certificate.module.css";
import { useTranslation } from "react-i18next"; // Import translation hook

import Cookies from "universal-cookie";

import NavbarExplorer from "../NavbarExplorer";
import Footer from "../../components/Footer";

// SVG imports
import title_page_logo from "../assets/title_page_logo.svg";
import avatar_white from "../../src/assets/avatar_white.png";

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Certificate = () => {
  const { id } = useParams();
  const { t } = useTranslation(); // Hook to access translations
  const [user, setUser] = useState(null);
  const [certification, setCertification] = useState(null);
  const [trail, setTrail] = useState(null);

  const languageMap = {
    en: "English",
    sk: "Slovak",
    es: "Spanish",
    cz: "Czech",
  };

  const storedLang = localStorage.getItem("language") || "en";
  const [userLanguage, setUserLanguage] = useState(
    languageMap[storedLang] || "English"
  );

  useEffect(() => {
    setUserLanguage(languageMap[storedLang] || "English");
  }, [localStorage.getItem("language")]);

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
      url: `${backendUrl}/trails/${id}?lang=${userLanguage}`,
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
  }, [id, userLanguage, token]);

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
      <div className={styles.no_print}>
        <NavbarExplorer />
      </div>
      <div
        className={`justify-content-center align-items-center text-center offset-lg-3 col-lg-6`}
      >
        <div className={`${styles.yes_print}`}>
          <div className={`${styles.cert_header} container-fluid d-flex`}>
            <div className="col-1"></div>
            <div className="col-9 d-flex justify-content-center align-items-center">
              <h1 className={`${styles.cert_title} text-center`}>
                {t("certificate_of_completion")}
              </h1>
            </div>
            <div className="col-2 d-flex flex-column justify-content-start align-items-end">
              <img
                src={avatar_white}
                alt="avatar_white"
                className="pt-4 pe-4"
                width={100}
                height={85}
              />
            </div>
          </div>
          <div className="">
            <div
              className={`${styles.color_bar} ${styles.fancy_header_1}`}
            ></div>
            <div
              className={`${styles.color_bar} ${styles.fancy_header_2} `}
            ></div>
            <div
              className={`${styles.color_bar} ${styles.fancy_header_3} `}
            ></div>
          </div>
        </div>
        <div className={`d-flex flex-column px-2`}>
          <p className={`fs-3 fw-bolder pt-4`}>{t("this_is_to_certify")}</p>
          <h2 className={`fw-bold ${styles.fancy_font}`}>{user?.name}</h2>
          <p className={`fs-5`}>{t("has_successfully_completed_the_trail")}</p>
          <h3 className={`fs-3 fw-bolder pb-3`}>{trail?.name}</h3>
          <img
            src={`${backendUrl}${trail?.thumbnail}`}
            /*src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF5dWZoSvLRtwSK44dptbYidbaQTtWuPf0Gw&s`}*/
            alt=""
            className={`align-self-center pb-3`}
            width={150}
            height={150}
          />
          <p className={`fs-5 mb-1`}>
            {t("with_a_score_of")}{" "}
            <span className="fw-bolder">{certification?.score ?? 0}</span>{" "}
            {t("out_of")}{" "}
            {trail?.points?.reduce((sum, p) => sum + (p.quiz?.points || 0), 0)}
          </p>
          <p className={`fs-5`}>
            <span className="fw-bolder">{t("date")}:</span>{" "}
            {new Date(certification?.completedAt).toLocaleDateString()}
          </p>
          <div
            className={`${styles.no_print} justify-content-center pt-3 pb-5`}
          >
            <button
              onClick={handlePrint}
              className={`${styles.print_cert_button} px-5`}
            >
              {t("print_certificate")}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.no_print}>
        <Footer />
      </div>
    </>
  );
};

export default Certificate;
