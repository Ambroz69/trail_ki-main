import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import Cookies from "universal-cookie";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

import styles from "../css/HomeUser.module.css";

import NavbarExplorer from "../NavbarExplorer";
import Footer from "../../components/Footer";
import ExploreFilter from "../../components/ExploreFilter";
import TrailCard from "../../components/TrailCard";

// SVG imports
import backup_trail_image from "../assets/backup_trail_image.png";
import explore_search_button from "../assets/explore_search_button.svg";
import explore_filter_button from "../assets/explore_filter_button.svg";
import sort_button from "../assets/sort_button.svg";
import explore_page_logo from "../../src/assets/explore_page_logo.svg";
import sk_flag from "../assets/flag-sk.svg";
import gb_flag from "../assets/flag-gb.svg";
import profile_photo_placeholder from "../../src/assets/profile_photo_placeholder.svg";
import trail_card_icon from "../../src/assets/trail_card_icon.svg";
import trail_card_time from "../../src/assets/trail_card_time.svg";
import trail_card_location from "../../src/assets/trail_card_location.svg";
import trail_card_arrow_right from "../../src/assets/trail_card_arrow_right.svg";
import title_page_logo from "../../src/assets/title_page_logo.svg";
import svabatar from "../../src/assets/svabatar.png";
import explore_banner from "../../src/assets/explore_banner_2.png";

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const HomeUser = () => {
  const [trails, setTrails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [localityFilter, setLocalityFilter] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const { t } = useTranslation(); // Hook for translations
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;

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
  const basePath =
    userRole === "manager"
      ? "/manager"
      : userRole === "trail creator"
        ? "/creator"
        : "/explorer";

  const languageMap = {
    en: "English",
    sk: "Slovak",
    es: "Spanish",
    cz: "Czech",
  };

  const [userLanguage, setUserLanguage] = useState(
    languageMap[localStorage.getItem("language")] || "English",
  );

  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    setUserLanguage(languageMap[storedLang] || "English");
  }, [localStorage.getItem("language")]);

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${backendUrl}/trails`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    api(configuration)
      .then((response) => {
        const publishedTrails = response.data.data.filter(
          (trail) => trail.published === true,
        );
        setTrails(publishedTrails);
      })
      .catch((error) => {
        setAlert({ message: `${t("error_trail")}`, type: "error" });
        console.log(error);
      });

    // set locality filter based on country
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      setLocalityFilter(tokenPayload?.userCountry || "");
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const goTo = (url) => {
    navigate(url);
  };

  // Create maps for filters
  const trailDifficulties = Array.from(
    new Set(trails.map((t) => t.difficulty)),
  );
  const trailLocalities = Array.from(new Set(trails.map((t) => t.locality)));

  // Filter and sort trails
  const getDisplayedTrails = () => {
    let filtered = trails
      .filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((t) =>
        difficultyFilter ? t.difficulty === difficultyFilter : true,
      )
      .filter((t) => (localityFilter ? t.locality === localityFilter : true));

    switch (sortOption) {
      case "name-asc":
        filtered.sort((t1, t2) => t1.name.localeCompare(t2.name));
        break;
      case "name-desc":
        filtered.sort((t1, t2) => t2.name.localeCompare(t1.name));
        break;
      case "length-asc":
        filtered.sort((t1, t2) => t1.length - t2.length);
        break;
      case "length-desc":
        filtered.sort((t1, t2) => t2.length - t1.length);
        break;
      default:
        break;
    }

    return filtered;
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 400);
  };

  const displayedTrails = getDisplayedTrails();
  const offset = currentPage * itemsPerPage;
  const trailPageData = displayedTrails.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(displayedTrails.length / itemsPerPage);

  return (
    <div className="row d-flex mx-0 px-0">
      {/* Navbar */}
      <NavbarExplorer />

      <section className="col-12 offset-lg-1 col-lg-10 px-3 px-lg-0 pt-4 pt-lg-5">
        <div
          className={`position-relative overflow-hidden rounded-4 ${styles.exploreBanner}`}
        >
          <img
            src={explore_banner}
            alt="Explore trails"
            className={`w-100 h-100 d-block object-fit-cover ${styles.exploreBannerImage}`}
          />

          <div
            className={`position-absolute top-50 translate-middle-y ${styles.exploreBannerContent}`}
          >
            <h1 className={`fw-bold mb-3 ${styles.exploreBannerTitle}`}>
              Explore <span>trails</span> and adventures
            </h1>

            <p className={`mb-0 ${styles.exploreBannerText}`}>
              Discover new places, learn something new, and take on fun
              challenges along the way. Just pick a trail from the list and let
              the adventure begin!
            </p>
          </div>
        </div>
      </section>

      <div className="py-4 px-3 px-lg-0 offset-lg-1 col-lg-10">
        <ExploreFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          localityFilter={localityFilter}
          setLocalityFilter={setLocalityFilter}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          durationFilter={durationFilter}
          setDurationFilter={setDurationFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        {/* Trail Cards */}
        <div className="row row-cols-1 row-cols-lg-3 g-3 g-lg-4 pt-4 align-items-start">
          {trailPageData.map((trail) => {
            const translation = trail.translations?.find(
              (tl) => tl.language === userLanguage,
            );

            const displayName =
              trail.language !== userLanguage && translation
                ? translation.name
                : trail.name;

            const displayDescription =
              trail.language !== userLanguage && translation
                ? translation.description
                : trail.description;

            return (
              <div key={trail._id} className="col">
                <TrailCard
                  trail={trail}
                  displayName={displayName}
                  displayDescription={displayDescription}
                  basePath={basePath}
                  t={t}
                  goTo={goTo}
                />
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="py-3 px-0 offset-lg-2 col-lg-8">
          {displayedTrails.length > itemsPerPage && (
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
      </div>
      {/* Footer */}
      <div className="bg-[#f0f8f4]">
        <div className=" text-black d-lg-flex offset-lg-1 col-lg-10 pt-5">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
