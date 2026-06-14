//modules
import { React, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next"; // Import translation hook
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

//styles
import styles from "../css/TitlePage.module.css";

//components
import Footer from "../../components/Footer";
import PhotoSlider from "../../components/PhotoSlider";
import MainButton from "../../components/MainButton";
import CounterCard from "../../components/CounterCard";
import RatingStars from "../../components/RatingStars";
import TitlePageNavbar from "../../components/TitlePageNavbar";
import TestimonialCard from "../../components/TestimonialCard";

//assets
import desc_bullet_point from "../../src/assets/desc_bullet_point.svg";
import svabatar from "../../src/assets/svabatar.png";
import title_page_boxes_left from "../../src/assets/title_page_boxes_left.svg";
import title_page_boxes_right from "../../src/assets/title_page_boxes_right.svg";
import title_page_progress_1 from "../../src/assets/title_page_progress_1.svg";
import title_page_progress_2 from "../../src/assets/title_page_progress_2.svg";
import title_page_progress_3 from "../../src/assets/title_page_progress_3.svg";
import title_page_progress_4 from "../../src/assets/title_page_progress_4.svg";
import title_page_trusted_by_logo_1 from "../../src/assets/title_page_trusted_by_logo_1.png";
import title_page_trusted_by_logo_2 from "../../src/assets/title_page_trusted_by_logo_2.png";
import title_page_trusted_by_logo_3 from "../../src/assets/title_page_trusted_by_logo_3.png";
import teta from "../../src/assets/teta.png";
import ujo from "../../src/assets/ujo.png";
import hipster from "../../src/assets/hipster.png";
import hamburger from "../../src/assets/hamburger.svg";
import trail_experience_sk from "../../src/assets/trail_experience_sk.svg";
import trail_experience_en from "../../src/assets/trail_experience_en.svg";
import trails_available from "../../src/assets/trails_available.svg";
import users from "../../src/assets/users.svg";
import reviews from "../../src/assets/reviews.svg";
import snek_trails from "../../src/assets/snek_trails.svg";
import snek_users from "../../src/assets/snek_users.svg";
import snek_reviews from "../../src/assets/snek_reviews.svg";
import community_stonks_sk from "../../src/assets/community_stonks_sk.svg";
import community_stonks_en from "../../src/assets/community_stonks_en.svg";
import review_star from "../../src/assets/review_star.svg";
import arrow_right from "../../src/assets/arrow_right.svg";
import checkmark from "../../src/assets/checkmark.svg";
import partner_logo_1 from "../../src/assets/partner_logo_1.png";
import partner_logo_2 from "../../src/assets/partner_logo_2.png";
import partner_logo_3 from "../../src/assets/partner_logo_3.png";
import partner_logo_4 from "../../src/assets/partner_logo_4.png";
import partner_logo_5 from "../../src/assets/partner_logo_5.png";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const TitlePage = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({
    registeredUsers: 0,
    publishedTrails: 0,
    doneReviews: 0,
    averageRatings: 0.0,
  });
  const currentLanguage =
    i18n.language || localStorage.getItem("language") || "en";
  const navigate = useNavigate();

  const goTo = (url) => {
    navigate(url);
  };

  const trailExperience = {
    en: trail_experience_en,
    sk: trail_experience_sk,
  };

  const communityStonks = {
    en: community_stonks_en,
    sk: community_stonks_sk,
  };

  const testimonials = [
    {
      photo: teta,
      photoAlt: "teta",
      color: "#D4CCE2",
      text: t("testimonial_1"),
      author: t("testimonial_author_1"),
      description: t("testimonial_desc_1"),
    },
    {
      photo: ujo,
      photoAlt: "ujo",
      color: "#C9CFE3",
      text: t("testimonial_2"),
      author: t("testimonial_author_2"),
      description: t("testimonial_desc_2"),
    },
    {
      photo: hipster,
      photoAlt: "hipster",
      color: "#C3DCE4",
      text: t("testimonial_3"),
      author: t("testimonial_author_3"),
      description: t("testimonial_desc_3"),
    },
    {
      photo: hipster,
      photoAlt: "hipster",
      color: "#C9E8E0",
      text: t("testimonial_3"),
      author: "John Doe",
      description: t("testimonial_desc_3"),
    },
  ];

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${backendUrl}/trails/public-stats`,
    };

    // make the API call
    api(configuration)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setStats({
          registeredUsers: data.registeredUsers ?? 0,
          publishedTrails: data.publishedTrails ?? 0,
          doneReviews: data.doneReviews ?? 0,
          averageRatings: data.averageRatings ?? 0.0,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="text-white px-lg-0">
      <TitlePageNavbar />

      <PhotoSlider>
        <>
          <div className="pt-3 pt-lg-5 pb-3">
            <img
              src={trailExperience[currentLanguage]}
              alt="trail_experience"
              className=""
            />
          </div>
          <h1 className={`${styles.title} mb-2`}>{t("hero_title_1")}</h1>
          <h1 className={`${styles.title} ${styles.title_yellow} mb-4`}>
            {t("hero_title_2")}
          </h1>
          <div className="d-flex justify-content-center align-items-start">
            <img
              src={desc_bullet_point}
              alt="desc_bullet_point"
              className="pe-2 pt-2"
            />
            <p className={`${styles.desc_font}`}>{t("hero_description_1")}</p>
          </div>
          <div className="d-flex justify-content-center align-items-start">
            <img
              src={desc_bullet_point}
              alt="desc_bullet_point"
              className="pe-2 pt-2"
            />
            <p className={`${styles.desc_font}`}>{t("hero_description_2")}</p>
          </div>
          <div className="d-flex justify-content-center justify-content-lg-start mt-5 gap-2">
            <MainButton
              variant="buttonPrimary"
              onClick={() => goTo("users/login")}
              width="12rem"
            >
              {t("explore")}
            </MainButton>
            <MainButton
              variant="buttonSecondary"
              onClick={() => goTo("users/register")}
              width="12rem"
            >
              {t("request_access")}
            </MainButton>
          </div>
        </>
      </PhotoSlider>

      {/* Counter cards Section */}
      <section className="bg-[#FCFCFD] pt-4 pt-lg-5">
        <div className="d-flex justify-content-center pb-2">
          <img
            src={communityStonks[currentLanguage]}
            alt="community_stonks"
            className={`${styles.stonks_icon}`}
          />
        </div>
        <h1
          className={`${styles.title} ${styles.title_black} text-center mb-4`}
        >
          {t("counter_text_primary")}
        </h1>
        <div className="offset-lg-3 col-lg-6 px-5">
          <h4
            className={`${styles.title_text} ${styles.title_grey} text-center mb-4`}
          >
            {t("counter_text_secondary")}
          </h4>
        </div>
        <div className="offset-lg-2 col-lg-8 px-3 px-lg-0 pt-3 pb-1">
          <div className="d-flex flex-column flex-lg-row gap-4 pb-5">
            <CounterCard
              icon={trails_available}
              counter={stats.publishedTrails.toLocaleString()}
              color="#55C2AF"
            >
              {t("counter_card_trails")}
            </CounterCard>
            <CounterCard
              icon={users}
              counter={stats.registeredUsers.toLocaleString()}
              color="#A191D8"
            >
              {t("counter_card_users")}
            </CounterCard>
            <CounterCard
              icon={reviews}
              counter={stats.doneReviews.toLocaleString()}
              color="#8CB7C8"
            >
              {t("counter_card_reviews")}
            </CounterCard>
          </div>
          <div className="">
            <div className={`card shadow border-0 ${styles.ratingCard}`}>
              <div className="card-body d-lg-flex justify-content-between align-items-center p-4">
                <div className="d-flex flex-column flex-lg-row align-items-center text-center text-lg-start">
                  <div className={styles.iconCircle}>
                    <img
                      src={review_star}
                      alt="review_star"
                      className={styles.icon}
                    />
                  </div>
                  <div className="d-flex flex-column ms-lg-4 mt-lg-0 mt-3">
                    <div className={styles.heading}>{t("average_rating")}</div>
                    <div className="d-lg-flex align-items-center mt-2">
                      <span className={styles.rating}>
                        {stats.averageRatings.toLocaleString()}
                      </span>
                      <span className={styles.outOf}>/ 5</span>
                      <div className="ms-lg-3">
                        <RatingStars
                          rating={stats.averageRatings}
                          size="3rem"
                        />
                      </div>
                      <span className={`ms-lg-3 pt-2 ${styles.reviewCount}`}>
                        {t("based_on_reviews", {
                          count: stats.doneReviews.toLocaleString(),
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3 mt-lg-0">
                  <MainButton
                    variant="buttonGreen"
                    onClick={() => goTo("users/register")}
                    height="3rem"
                    width="11rem"
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      {t("discover_trails")}
                      <img
                        src={arrow_right}
                        alt="arrow_right"
                        className={`${styles.arrow_right} ms-3`}
                      />
                    </div>
                  </MainButton>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.title_grey} pt-3 pb-4 py-lg-5 d-flex flex-lg-row flex-column justify-content-lg-around align-items-center`}
          >
            <div className="d-lg-block d-none"></div>
            <div className="d-flex pt-0">
              <img
                src={checkmark}
                alt="checkmark"
                className={`${styles.checkmark} me-2`}
              />
              {t("verified_trails")}
            </div>
            <div className="d-flex pt-2 pt-lg-0">
              <img
                src={checkmark}
                alt="checkmark"
                className={`${styles.checkmark} me-2`}
              />
              {t("active_community")}
            </div>
            <div className="d-flex pt-2 pt-lg-0">
              <img
                src={checkmark}
                alt="checkmark"
                className={`${styles.checkmark} me-2`}
              />
              {t("safe_adventures")}
            </div>
            <div className="d-lg-block d-none"></div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section
        className={`${styles.trusted_by_section} text-center px-lg-0 px-4 py-lg-4 pt-5 pb-3`}
      >
        <h1 className="fs-1 fs-lg-1 pb-4">{t("partners")}</h1>
        {/* DESKTOP */}
        <div
          className={`${styles.partner_logos} d-none d-lg-flex offset-lg-2 col-lg-8 justify-content-center`}
        >
          <img src={partner_logo_1} alt="partner_logo_1" className="" />
          <img src={partner_logo_2} alt="partner_logo_2" className="" />
          <img src={partner_logo_3} alt="partner_logo_3" className="" />
          <img src={partner_logo_4} alt="partner_logo_4" className="" />
          <img src={partner_logo_5} alt="partner_logo_5" className="" />
        </div>
        {/* MOBILE */}
        <div className={`${styles.partner_logos} d-lg-none`}>
          <div className="d-flex justify-content-between mb-4">
            <img src={partner_logo_1} className="col-3" />
            <img src={partner_logo_2} className="col-3" />
            <img src={partner_logo_3} className="col-3" />
          </div>
          <div className="d-flex justify-content-around">
            <img src={partner_logo_4} className="col-3" />
            <img src={partner_logo_5} className="col-3" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white pt-4 py-lg-5 px-3 px-lg-0">
        {/* DESKTOP */}
        <div className="d-none d-lg-flex offset-lg-2 col-lg-8 pt-5">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.author} {...testimonial} />
          ))}
        </div>
        {/* MOBILE */}
        <div className="d-block d-lg-none pt-5">
          {testimonials.map((testimonial) => (
            <div className="pb-5">
              <TestimonialCard key={testimonial.author} {...testimonial} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="bg-[#f0f8f4]">
        <div className=" text-black d-lg-flex offset-lg-2 col-lg-8 pt-5">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default TitlePage;
