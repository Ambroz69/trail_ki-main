import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import styles from '../css/Main.module.css';
import logo from "../assets/avatar_color.png";
import footer_logo from "../assets/footer_logo.svg";
import AlertComponent from '../../components/AlertComponent';
import { useTranslation } from 'react-i18next'; // Import translation hook

const RegisterSuccess = () => {

  const { t } = useTranslation(); // Hook to access translations
  const [alert, setAlert] = useState({ message: `${t('success_registration')}`, type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/users/login", {
        replace: true,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container fluid className={`${styles.base_font} mt-5 overflow-hidden`}>
      <Row>
        <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 2 }} xl={{ span: 4, offset: 4 }}>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <a href="/"><img src={logo} alt="logo" /></a>
            <h2 className={`${styles.login_header}`}>{t('sing_up')}</h2>
            <div className={`${styles.form_width}`}>
              <AlertComponent message={alert.message} type={alert.type} />
              <div className="d-grid mt-1">
                <Button
                  type="submit"
                  className={`${styles.login_button} mt-3 btn-block rounded-3`}
                  href="/"
                >
                  {t('home')}
                </Button>
              </div>
              <div className='d-flex flex-row align-items-center justify-content-center mt-3'>
                <div>
                  <a href='/users/login' className={`${styles.forgot_pass_link} ms-1`}>
                    {t('login')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default RegisterSuccess;