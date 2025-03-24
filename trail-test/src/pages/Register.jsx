import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from '../css/Main.module.css';
import logo from "../assets/avatar_color.png";
import Dropdown from 'react-bootstrap/Dropdown';
import footer_logo from "../assets/footer_logo.svg";
import AlertComponent from '../../components/AlertComponent';
import { useTranslation } from 'react-i18next'; // Import translation hook
import i18n from '../i18n'; // Import i18n config

import sk_flag from '../assets/flag-sk.svg';
import gb_flag from '../assets/flag-gb.svg';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("Slovakia");
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState('Slovak');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook to access translations
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en")

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: `${backendUrl}/users/register`,
      data: {
        name,
        email,
        country,
        primaryLanguage,
        password
      },
    };

    axios(configuration)
      .then((result) => {
        setRegister(true);
        setAlert({ message: `${t('success_registration')}`, type: 'success' });
        // redirect user to the login page
        //setTimeout(() => {
        //  navigate('/');
        //}, 3000);
      })
      .catch((error) => {
        error = new Error();
        setAlert({ message: `${t('error_registration')}`, type: 'error' });
      });
  }

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang); // Store user preference
  };

  const getFlag = (lang) => {
    return lang === 'en' ? gb_flag : sk_flag;
  };

  /*useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 5000); // Hide alert after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [alert.message]);*/

  return (
    <Container fluid className={`${styles.base_font} mt-5 overflow-hidden`}>
      <Row>
        <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 2 }} xl={{ span: 4, offset: 4 }}>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <a href="/"><img src={logo} alt="logo" /></a>
            <h2 className={`${styles.login_header}`}>{t('sing_up')}</h2>
            <Form onSubmit={(e) => handleSubmit(e)} className={`${styles.form_width}`}>
              {/* name */}
              <Form.Group controlId="formBasicName" className='mt-1'>
                {/* <Form.Label>E-mail</Form.Label>*/}
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('display_name')}
                  required
                />
              </Form.Group>

              {/* email */}
              <Form.Group controlId="formBasicEmail" className='mt-3'>
                {/* <Form.Label>E-mail</Form.Label>*/}
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  required
                />
              </Form.Group>

              {/* password */}
              <Form.Group controlId="formBasicPassword" className='mt-3'>
                {/* <Form.Label>Password</Form.Label> */}
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  required
                />
              </Form.Group>
              {/* country */}
              <Form.Group controlId="formBasicCountry" className='mt-3'>
                <Form.Select
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder={t('select_country')}
                  required
                >
                  <option value="Slovakia">{t('slovakia')}</option>
                  <option value="Czech Republic">{t('czech')}</option>
                  <option value="Spain">{t('spain')}</option>
                  <option value="Other">{t('other')}</option>
                </Form.Select>
              </Form.Group>
              {/* primaryLanguage */}
              <Form.Group controlId="formBasicPrimaryLanguage" className='mt-3'>
                <Form.Select
                  name="primaryLanguage"
                  value={primaryLanguage}
                  onChange={(e) => setPrimaryLanguage(e.target.value)}
                  placeholder={t('select_primary_language')}
                  required
                >
                  <option value="Slovak">{t('slovak')}</option>
                  <option value="Czech">{t('czechis')}</option>
                  <option value="Spanish">{t('spanish')}</option>
                  <option value="English">{t('english')}</option>
                  <option value="Other">{t('other')}</option>
                </Form.Select>
              </Form.Group>
              <div className="d-flex flex-row justify-content-between mt-3">
                <div className="form-check d-flex flex-row align-items-center justify-content-center">
                  <input className="form-check-input" type="checkbox" value="" id="checkbox1" required />
                  <label className='form-check-label ms-2 me-1' htmlFor="flexCheckDefault">
                    {t('agree_with')}
                  </label>
                  <a href='#' className={`${styles.forgot_pass_link} ${styles.fix_align}`}>
                    {t('terms')}
                  </a>
                </div>
              </div>
              {alert.message && (
                <AlertComponent message={alert.message} type={alert.type} />
              )}
              {/* submit button */}
              <div className="d-grid mt-1">
                {register ? (
                  <Button
                    type="submit"
                    className={`${styles.login_button} mt-3 btn-block rounded-3`}
                    href="/"
                  >
                    {t('back')}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`${styles.login_button} mt-3 btn-block rounded-3`}
                    onClick={(e) => handleSubmit(e)}
                  >
                    {t('create_account')}
                  </Button>
                )}

              </div>

              <div className='d-flex flex-row align-items-center justify-content-center mt-3'>
                <div>
                  {t('account_exist')}
                </div>
                <div>
                  <a href='/users/login' className={`${styles.forgot_pass_link} ms-1`}>
                    {t('login')}
                  </a>
                </div>
              </div>
              {/*<div className='d-flex flex-row align-items-center justify-content-center mt-3'>
                <Dropdown >
                  <Dropdown.Toggle variant="" size="sm" className="d-flex align-items-center text-black pt-lg-2">
                    <img src={getFlag(selectedLanguage)} width="20px" className="me-2" alt="selected flag" /> {selectedLanguage.toUpperCase()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleLanguageChange('en')} className="d-flex align-items-center"><img src={gb_flag} width="20px" className="me-2" alt="English Flag" />English</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleLanguageChange('sk')} className="d-flex align-items-center"><img src={sk_flag} width="20px" className="me-2" alt="Slovak Flag" />Slovenčina</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>*/}
            </Form>
          </div>
        </Col>
      </Row >
      {/*<Row className={`${styles.footer_width}`}>
        <img src={footer_logo} alt="footer_logo" className={`${styles.footer_img}`} />
      </Row>*/}
    </Container >
  );
};

export default Register;