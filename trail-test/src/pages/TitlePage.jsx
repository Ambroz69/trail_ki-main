import {React, useState} from "react";
import Button from 'react-bootstrap/Button';
import { Dropdown } from "react-bootstrap";
import { useTranslation } from 'react-i18next'; // Import translation hook
import sk_flag from '../assets/flag-sk.svg';
import gb_flag from '../assets/flag-gb.svg';

const TitlePage = () => {

  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en")
  const { t } = useTranslation();

  const getFlag = (lang) => {
    return lang === 'en' ? gb_flag : sk_flag;
  };

  return (
    <div className="bg-[#2E8B75] text-white min-h-screen">
      {/* TUTO bude novy Navbar a toto zmaž */}
      <nav className="flex justify-between items-center px-8 py-4 bg-transparent">
        <div className="text-2xl font-bold">AVA Trail</div>
        <div className="flex items-center space-x-4">
          {/* Language Dropdown */}
          <Dropdown>
            <Dropdown.Toggle variant="secondary" size="sm" className="d-flex align-items-center">
              <img src={getFlag(selectedLanguage)} width="20px" className="me-2" alt="selected flag" /> {selectedLanguage.toUpperCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleLanguageChange('en')} className="d-flex align-items-center"><img src={gb_flag} width="20px" className="me-2" alt="English Flag" /> English</Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange('sk')} className="d-flex align-items-center"><img src={sk_flag} width="20px" className="me-2" alt="Slovak Flag" /> Slovak</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <a href="/users/login"><Button variant="outline">{t("login")}</Button></a>
          <Button variant="primary">{t("get_started")}</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex justify-between items-center px-12 py-16">
        <div className="w-1/2">
          <h1 className="text-5xl font-bold mb-4">{t("hero_title")}</h1>
          <p className="text-lg mb-6">{t("hero_description_1")}</p>
          <p className="text-lg mb-6">{t("hero_description_2")}</p>
          <div className="flex space-x-4">
            <Button variant="primary">{t("explore")}</Button>
            <a href="/users/login"><Button variant="outline">{t("request_access")}</Button></a>
          </div>
        </div>
        <div className="w-1/2">
          <div className="h-80 w-80 bg-gray-300 rounded-full mx-auto">
            {/* Placeholder for mascot image */}
            <span className="text-center block mt-32">Mascot Image</span>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white text-gray-800 py-12 px-8 text-center">
        <h2 className="text-3xl font-bold">{t("how_it_works")}</h2>
        <div className="flex justify-center space-x-8 mt-8">
          {[1, 2, 3, 4].map((step, index) => (
            <div key={index} className="text-center max-w-xs">
              <div className="h-16 w-16 bg-green-500 rounded-full mx-auto"></div>
              <p className="mt-4">{t(`how_step_${index + 1}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-[#DDEDE7] py-12 text-center">
        <h2 className="text-3xl font-bold">{t("trusted_by")}</h2>
        <div className="flex justify-center space-x-12 mt-6">
          {[1, 2, 3].map((logo, index) => (
            <div key={index} className="h-16 w-32 bg-gray-300"></div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white text-gray-800 py-12 px-8 text-center">
        <h2 className="text-3xl font-bold">{t("testimonials")}</h2>
        <div className="flex justify-center space-x-8 mt-8">
          {[1, 2, 3].map((testimonial, index) => (
            <div key={index} className="max-w-md bg-gray-100 p-6 rounded-lg">
              <div className="h-12 w-12 bg-gray-400 rounded-full mx-auto"></div>
              <p className="mt-4">{t(`testimonial_${index + 1}`)}</p>
              <p className="text-sm mt-2 text-gray-500">{t(`testimonial_author_${index + 1}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2E8B75] text-white py-8 text-center">
        <h2 className="text-xl font-bold">AVA Trail</h2>
        <p>{t("footer_description")}</p>
        <p className="mt-2 text-sm">© 2024 AVA Trail | {t("university_name")}</p>
      </footer>
    </div>
  )
};

export default TitlePage;