import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import MainButton from "./MainButton";
import Hamburger from "./Hamburger";

import i18n from "../src/i18n";

import avatar_white from "../src/assets/avatar_white.png";
import sk_flag from "../src/assets/flag-sk.svg";
import gb_flag from "../src/assets/flag-gb.svg";
import hamburger from "../src/assets/hamburger.svg";

import styles from "../src/css/TitlePageNavbar.module.css";

export default function TitlePageNavbar() {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "en",
  );

  const [menuModalShow, setMenuModalShow] = useState(false);
  const [userLoggedIn] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const getFlag = (lang) => {
    return lang === "en" ? gb_flag : sk_flag;
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const goTo = (url) => {
    navigate(url);
  };

  return (
    <>
      <div className={styles.navbarOverlay}>
        <div className="container-fluid">
          <div className="row pt-4">
            <nav className="offset-lg-2 col-lg-8 d-flex justify-content-between align-items-center px-3 px-lg-0">
              <div>
                <img src={avatar_white} alt="avatar_white" className={styles.navbarLogo} />
              </div>

              <div className="d-flex align-items-center gap-2 pt-2">
                <Dropdown className="bg-transparent">
                  <Dropdown.Toggle
                    variant=""
                    size="sm"
                    className="d-flex align-items-center text-white pt-2"
                  >
                    <img
                      src={getFlag(selectedLanguage)}
                      width="20px"
                      className="me-2"
                      alt="selected flag"
                    />
                    {selectedLanguage.toUpperCase()}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleLanguageChange("en")}
                      className="d-flex align-items-center"
                    >
                      <img
                        src={gb_flag}
                        width="20px"
                        className="me-2"
                        alt="English Flag"
                      />
                      English
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => handleLanguageChange("sk")}
                      className="d-flex align-items-center"
                    >
                      <img
                        src={sk_flag}
                        width="20px"
                        className="me-2"
                        alt="Slovak Flag"
                      />
                      Slovenčina
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <div className="d-none d-lg-flex gap-2">
                  <MainButton
                    variant="buttonSecondary"
                    onClick={() => goTo("users/login")}
                  >
                    {t("login")}
                  </MainButton>

                  <MainButton
                    variant="buttonPrimary"
                    onClick={() => goTo("users/register")}
                  >
                    {t("get_started")}
                  </MainButton>
                </div>

                <button
                  type="button"
                  className="btn d-flex d-lg-none"
                  onClick={() => setMenuModalShow(true)}
                >
                  <img src={hamburger} alt="hamburger" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <Hamburger
        userLoggedIn={userLoggedIn}
        menuModalShow={menuModalShow}
        closeMenuModalShow={() => setMenuModalShow(false)}
      />
    </>
  );
}