import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import styles from '../css/Main.module.css';
import logo from "../assets/avatar_color.png";
import Dropdown from 'react-bootstrap/Dropdown';
import footer_logo from "../assets/footer_logo.svg";
import AlertComponent from '../../components/AlertComponent';
import { useTranslation } from 'react-i18next'; // Import translation hook
import i18n from '../i18n'; // Import i18n config

import sk_flag from '../assets/flag-sk.svg';
import gb_flag from '../assets/flag-gb.svg';

const cookies = new Cookies();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const { t } = useTranslation(); // Hook to access translations
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en")

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: `${backendUrl}/users/login`,
      data: {
        email,
        password
      },
    };

    axios(configuration)
      .then((result) => {
        setLogin(true);
        // set the cookie
        cookies.set("SESSION_TOKEN", result.data.token, {
          path: "/",
        });
        // redirect user to the trails
        window.location.href = "/";
      })
      .catch((error) => {
        setAlert({ message: `${t('error_login')}`, type: 'error' });
        error = new Error();
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

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000); // Hide alert after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  return (
    <Container fluid className={`${styles.base_font} mt-5 overflow-hidden`}>
      <Row>
        <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 2 }} xl={{ span: 4, offset: 4 }}>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <a href="/"><img src={logo} alt="logo" /></a>
            <h2 className={`${styles.login_header}`}>{t('login')}</h2>
            <Form onSubmit={(e) => handleSubmit(e)} className={`${styles.form_width}`}>
              {/* email */}
              <Form.Group controlId="formBasicEmail" className='mt-1'>
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
              <div className="d-flex flex-row justify-content-between mt-3">
                <div className=" form-check col-6">
                  <input className="form-check-input" type="checkbox" value="" id="checkbox1" />
                  <label className='form-check-label' htmlFor="flexCheckDefault">
                    {t('stay_logged_in')}
                  </label>
                </div>
                <div className="col-6 text-end">
                  <a href='/forgot-password' className={`${styles.forgot_pass_link}`}>
                    {t('forgot_password')}
                  </a>
                </div>
              </div>
              {alert.message && (
                <AlertComponent message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
              )}

              {/* submit button */}
              <div className="d-grid mt-1">
                <Button
                  type="submit"
                  className={`${styles.login_button} mt-3 btn-block rounded-3`}
                  onClick={(e) => handleSubmit(e)}
                >
                  {t('login')}
                </Button>
              </div>

              <div className='d-flex flex-row align-items-center justify-content-center mt-3'>
                <div>
                  {t('login_register_text')}
                </div>
                <div>
                  <a href='/users/register' className={`${styles.forgot_pass_link} ms-1`}>
                    {t('sing_up')}
                  </a>
                </div>                
              </div>
              {/*  <div className='d-flex flex-row align-items-center justify-content-center mt-3'>
                <Dropdown >
                  <Dropdown.Toggle variant="" size="sm" className="d-flex align-items-center text-black pt-lg-2">
                    <img src={getFlag(selectedLanguage)} width="20px" className="me-2" alt="selected flag" /> {selectedLanguage.toUpperCase()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleLanguageChange('en')} className="d-flex align-items-center"><img src={gb_flag} width="20px" className="me-2" alt="English Flag" />English</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleLanguageChange('sk')} className="d-flex align-items-center"><img src={sk_flag} width="20px" className="me-2" alt="Slovak Flag" />Slovenčina</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div> */}
              

              {/* {login ? (
                <p className="text-success">You Are Logged in Successfully</p>
              ) : (
                <p className="text-danger">You Are Not Logged in</p>
              )} */}
            </Form>
          </div>
        </Col>
      </Row>
      {/*<Row className={`${styles.footer_width}`}>
        <img src={footer_logo} alt="footer_logo" className={`${styles.footer_img}`} />
      </Row>*/}
    </Container>
  );
};

export default Login;