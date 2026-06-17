import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

import styles from "./css/NavbarExplorer.module.css";
import Hamburger from "../components/Hamburger";

import hamburger from "../src/assets/hamburger.svg";
import profile_photo_placeholder from "../src/assets/profile_photo_placeholder.svg";
import sk_flag from "./assets/flag-sk.svg";
import gb_flag from "./assets/flag-gb.svg";
import cz_flag from "./assets/flag-cz.svg";
import es_flag from "./assets/flag-es.svg";
import avatar_white from "./assets/avatar_white.png";

const cookies = new Cookies();

function NavbarExplorer() {
  const { t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "en",
  );
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [menuModalShow, setMenuModalShow] = useState(false);
  const [primaryLanguage, setPrimaryLanguage] = useState("");
  const [token] = useState(cookies.get("SESSION_TOKEN"));
  const [userName, setUserName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const getUserRole = () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload?.userRole || "explorer";
    } catch {
      return "explorer";
    }
  };

  const userRole = getUserRole();

  const basePath =
    userRole === "manager"
      ? "/manager"
      : userRole === "trail creator"
        ? "/creator"
        : "/explorer";

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const getFlag = (lang) => {
    if (lang === "en") return gb_flag;
    if (lang === "sk") return sk_flag;
    if (lang === "cz") return cz_flag;
    if (lang === "es") return es_flag;
    return gb_flag;
  };

  const logout = () => {
    cookies.remove("SESSION_TOKEN", { path: "/" });
    window.location.href = "/";
  };

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  useEffect(() => {
    if (!token) {
      setUserLoggedIn(false);
      return;
    }

    const tokenPayload = JSON.parse(
      decodeURIComponent(escape(atob(token.split(".")[1]))),
    );

    setUserName(tokenPayload?.userName || "");
    setPrimaryLanguage(tokenPayload?.primaryLanguage || "");

    const isExpired =
      Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub;

    setUserLoggedIn(!isExpired);
  }, [token]);

  return (
    <header className={`${styles.navbar} px-0`}>
      <div
        className={`col-12 offset-lg-1 col-lg-10 d-flex align-items-center justify-content-between px-3 px-lg-0 ${styles.navbarInner}`}
      >
        <a
          href={basePath}
          className="d-flex align-items-center text-decoration-none"
        >
          <img src={avatar_white} alt="AVAtar" className={styles.logo} />
        </a>

        <nav
          className={`d-none d-lg-flex align-items-center h-100 ${styles.navLinks}`}
        >
          {(userRole === "trail creator" || userRole === "manager") && (
            <NavLink
              to={basePath}
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              {t("trail_management")}
            </NavLink>
          )}

          {userRole === "manager" && (
            <NavLink
              to={`${basePath}/users`}
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              {t("user_management")}
            </NavLink>
          )}

          <NavLink
            to={`${basePath}/journey`}
            end
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            {t("explore_nav_my_journey")}
          </NavLink>

          <NavLink
            to={
              userRole === "trail creator" || userRole === "manager"
                ? `${basePath}/homeuser`
                : basePath
            }
            end
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            {t("explore_nav_explore")}
          </NavLink>

          <NavLink
            to={`${basePath}/certificates`}
            end
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            {t("explore_nav_certificates")}
          </NavLink>

          <NavLink
            to={`${basePath}/leaderboard`}
            end
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            {t("explore_nav_hall_of_fame")}
          </NavLink>
        </nav>

        <div className="d-flex align-items-center gap-3">
          <Dropdown>
            <Dropdown.Toggle
              variant=""
              size="sm"
              className={`d-flex align-items-center gap-2 fw-semibold border-0 shadow-none ${styles.navDropdownToggle}`}
            >
              <img
                src={getFlag(selectedLanguage)}
                alt=""
                className={styles.flag}
              />
              {selectedLanguage.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleLanguageChange("en")}>
                English
              </Dropdown.Item>

              {primaryLanguage === "Slovak" && (
                <Dropdown.Item onClick={() => handleLanguageChange("sk")}>
                  Slovenčina
                </Dropdown.Item>
              )}

              {primaryLanguage === "Czech" && (
                <Dropdown.Item onClick={() => handleLanguageChange("cz")}>
                  Čeština
                </Dropdown.Item>
              )}

              {primaryLanguage === "Spanish" && (
                <Dropdown.Item onClick={() => handleLanguageChange("es")}>
                  Español
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className={`d-none d-lg-block rounded-circle ${styles.avatar}`}
            />
          ) : (
            <div
              className={`d-none d-lg-flex rounded-circle align-items-center justify-content-center ${styles.avatarPlaceholder}`}
            >
              {getInitials(userName)}
            </div>
          )}

          <Dropdown className="d-none d-lg-block">
            <Dropdown.Toggle
              variant=""
              size="sm"
              className={`fw-semibold border-0 shadow-none ${styles.navDropdownToggle}`}
            >
              {userName}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {(userRole === "trail creator" || userRole === "manager") && (
                <Dropdown.Item>
                  <NavLink to={basePath} className={styles.dropdownLink}>
                    {t("dashboard")}
                  </NavLink>
                </Dropdown.Item>
              )}

              <Dropdown.Item>
                <NavLink
                  to={`${basePath}/profile`}
                  className={styles.dropdownLink}
                >
                  {t("profile")}
                </NavLink>
              </Dropdown.Item>

              <Dropdown.Item onClick={logout}>{t("logout")}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <button
            type="button"
            className="btn d-block d-lg-none border-0 shadow-none"
            onClick={() => setMenuModalShow(true)}
          >
            <img src={hamburger} alt="menu" />
          </button>
        </div>
      </div>

      <Hamburger
        userLoggedIn={userLoggedIn}
        menuModalShow={menuModalShow}
        closeMenuModalShow={() => setMenuModalShow(false)}
      />
    </header>
  );
}

export default NavbarExplorer;
