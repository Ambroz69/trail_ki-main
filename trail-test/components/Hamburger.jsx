import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "universal-cookie";
import Modal from "react-bootstrap/Modal";

import MainButton from "./MainButton";

import hamburger_close from "../src/assets/hamburger_close.svg";
import hamburger_logo from "../src/assets/avatar_color.png";
import hamburger_logout from "../src/assets/hamburger_logout.svg";

import styles from "../src/css/Hamburger.module.css";

const cookies = new Cookies();

function Hamburger({ userLoggedIn, menuModalShow, closeMenuModalShow }) {
  const { t } = useTranslation();

  const getUserRole = () => {
    const token = cookies.get("SESSION_TOKEN");

    try {
      if (!token) return "explorer";

      const tokenParts = token.split(".");
      if (tokenParts.length < 2) return "explorer";

      const tokenPayload = JSON.parse(atob(tokenParts[1]));

      return tokenPayload?.userRole || "explorer";
    } catch (error) {
      console.error("Error decoding token:", error);
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

  return (
    <Modal
      show={menuModalShow}
      onHide={closeMenuModalShow}
      centered
      fullscreen="sm-down"
      dialogClassName={styles.dialog}
      contentClassName={styles.content}
      backdropClassName={styles.backdrop}
    >
      <Modal.Body className="d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <img
            src={hamburger_logo}
            alt="hamburger_logo"
            className={styles.logo}
          />

          <button
            type="button"
            className={`btn ${styles.closeButton}`}
            onClick={closeMenuModalShow}
          >
            <img src={hamburger_close} alt="hamburger_close" />
          </button>
        </div>

        <nav className="d-flex flex-column gap-3">
          {userRole === "trail creator" || userRole === "manager" ? (
            <>
              <Link
                to={`${basePath}/homeuser`}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("home")}
              </Link>

              <Link
                to={`${basePath}`}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("trail_management")}
              </Link>

              <Link
                to={`${basePath}/users`}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("user_management")}
              </Link>

              <Link
                to={`${basePath}/homeuser`}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("explore_nav_explore")}
              </Link>
            </>
          ) : (
            <>
              <Link
                to={basePath}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("home")}
              </Link>

              <Link
                to={basePath}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("explore_nav_explore")}
              </Link>
            </>
          )}

          <a
            href="#about"
            onClick={closeMenuModalShow}
            className={styles.navLink}
          >
            {t("explore_nav_about")}
          </a>

          <a
            href="#community"
            onClick={closeMenuModalShow}
            className={styles.navLink}
          >
            {t("explore_nav_community")}
          </a>
        </nav>

        {userLoggedIn && (
          <>
            <div className={styles.divider} />

            <nav className="d-flex flex-column gap-3">
              <Link
                to={`${basePath}/journey`}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("explore_nav_my_journey")}
              </Link>

              <Link
                to={`${basePath}/leaderboard`}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("hall_of_fame")}
              </Link>

              <Link
                to={`${basePath}/certificates`}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("explore_nav_certificates")}
              </Link>

              <Link
                to={`${basePath}/profile`}
                onClick={closeMenuModalShow}
                className={styles.navLink}
              >
                {t("profile")}
              </Link>
            </nav>
          </>
        )}

        <div className="mt-auto">
          <div className={styles.divider} />

          {userLoggedIn ? (
            <Link
              to="/users/login"
              onClick={closeMenuModalShow}
              className="text-decoration-none"
            >
              <button className={`${styles.logoutButton} w-100`}>
                <img
                  src={hamburger_logout}
                  alt="hamburger_logout"
                  className="me-3"
                />
                {t("logout")}
              </button>
            </Link>
          ) : (
            <div className="d-flex justify-content-between">
              <MainButton
                variant="buttonSecondaryDark"
                onClick={closeMenuModalShow}
                width="45%"
                height="3rem"
              >
                <Link
                  to="/users/login"
                  className="text-decoration-none text-reset"
                >
                  {t("login")}
                </Link>
              </MainButton>

              <MainButton
                variant="buttonGreen"
                onClick={closeMenuModalShow}
                width="45%"
                height="3rem"
              >
                <Link
                  to="/users/register"
                  className="text-decoration-none text-reset"
                >
                  {t("get_started")}
                </Link>
              </MainButton>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Hamburger;