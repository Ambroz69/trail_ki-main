import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useParams } from "react-router-dom";
import ReactCardFlip from "react-card-flip";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";
import NavbarExplorer from "../NavbarExplorer";
import Footer from "../../components/Footer";
import Button from "react-bootstrap/Button";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import ProgressBar from "react-bootstrap/ProgressBar";
import Cookies from "universal-cookie";

import TrailMap from "../../components/TrailMap";
import TrailInfoCard from "../../components/TrailInfoCard";
import TrailActionsCard from "../../components/TrailActionsCard";
import TrailExplore from "../../components/TrailExplore";
import TrailReview from "../../components/TrailReview";

import styles from "../css/TrailShow.module.css";

//svg+png import
import backup_trail_image from "../../src/assets/backup_trail_image.png";
import trail_certification_img from "../../src/assets/trail_certification_img.png";
import trail_apply from "../../src/assets/trail_apply.svg";
import trail_length from "../../src/assets/trail_length.svg";
import trail_location from "../../src/assets/trail_location.svg";
import trail_certification from "../../src/assets/trail_certification.svg";
import trail_difficulty from "../../src/assets/trail_difficulty.svg";
import trail_language from "../../src/assets/trail_language.svg";
import trail_lock from "../../src/assets/trail_lock.svg";
import trail_points from "../../src/assets/trail_points.svg";
import trail_practice from "../../src/assets/trail_practice.svg";
import trail_prepare_certification from "../../src/assets/my_journey_certification.svg";
import trail_qr_code from "../../src/assets/trail_qr_code.svg";
import trail_time from "../../src/assets/trail_time.svg";
import trail_type from "../../src/assets/trail_type.svg";

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ShowTrailUser = () => {
  const [trail, setTrail] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const { id } = useParams();
  const [cardFlipped, setCardFlipped] = useState(false);
  const { t } = useTranslation(); // Hook to access translations
  const [reviews, setReviews] = useState([]);
  const [inProgressCertifications, setInProgressCertifications] =
    useState(null);

  const getUserRole = () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload?.userRole || "explorer";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "explorer"; // Default role
    }
  };

  const languageMap = {
    en: "English",
    sk: "Slovak",
    es: "Spanish",
    cz: "Czech",
  };

  const storedLang = localStorage.getItem("language") || "en";
  const [userLanguage, setUserLanguage] = useState(
    languageMap[storedLang] || "English",
  );

  useEffect(() => {
    setUserLanguage(languageMap[storedLang] || "English");
  }, [localStorage.getItem("language")]);

  const userRole = getUserRole();
  const basePath =
    userRole === "manager"
      ? "/manager"
      : userRole === "trail creator"
        ? "/creator"
        : "/explorer";
  const originURL = window.location.hostname;

  useEffect(() => {
    // set configurations for the API call here
    const configuration = {
      method: "get",
      url: `${backendUrl}/trails/${id}?lang=${userLanguage}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    api(configuration)
      .then((response) => {
        setTrail(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    const configurationRW = {
      method: "get",
      url: `${backendUrl}/reviews/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    api(configurationRW)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    const configurationCert = {
      method: "get",
      url: `${backendUrl}/certifications`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    api(configurationCert)
      .then((response) => {
        const allCertifications = response.data.data;
        const filteredCerts = allCertifications
          .filter((cert) => cert.trail)
          .filter((cert) => cert.status === null);
        const trailCerts = filteredCerts.filter(
          (item) => item.trail._id === id,
        );
        setInProgressCertifications(trailCerts || null);
      })
      .catch((error) => {
        //setAlert({ message: `${t('error_trail')}`, type: 'error' });
        console.log(error);
      });
  }, [id, userLanguage]);

  const addDefaultImg = (event) => {
    event.target.src = backup_trail_image;
  };

  const handleCardFlip = (e) => {
    e.preventDefault();
    setCardFlipped(!cardFlipped);
  };

  return (
    <>
      {/* Navbar */}
      <NavbarExplorer />
      <div
        className={`${styles.show_trail_bg} d-flex container-fluid mx-0 px-0`}
      >
        <div className={`offset-lg-1 col-lg-10 px-0 mx-lg-auto m-3 mt-lg-5`}>
          <div className={`p-0`}>
            <div className="mx-lg-0">
              <ReactCardFlip isFlipped={cardFlipped} flipDirection="horizontal">
                <TrailInfoCard
                  trail={trail}
                  backendUrl={backendUrl}
                  inProgressCertifications={inProgressCertifications}
                />
                <div
                  /* BACK CARD */ onClick={(e) => handleCardFlip(e)}
                  className={cardFlipped ? "d-flex" : "d-none"}
                >
                  {/* <-- fix for Safari */}
                  <TrailMap
                    points={trail?.points}
                    height="15rem"
                    editable={false}
                    useGPT={false}
                  />
                </div>
              </ReactCardFlip>

              <TrailActionsCard basePath={basePath} trailId={trail?._id} />

              <TrailExplore trail={trail} originURL={originURL} />

              <TrailReview reviews={reviews} />
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="bg-[#f0f8f4]">
        <div className=" text-black d-lg-flex offset-lg-1 col-lg-10 pt-5">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ShowTrailUser;
