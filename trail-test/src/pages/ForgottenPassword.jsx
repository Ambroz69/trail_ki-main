import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/Main.module.css';
import logo from "../assets/avatar_color.png";
import footer_logo from "../assets/footer_logo.svg";
import AlertComponent from '../../components/AlertComponent';
import { useTranslation } from 'react-i18next'; // Import translation hook

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ForgottenPassword() {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook to access translations

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/users/forgot-password`, {
        email,
      });
      setAlert({message: `${t('success_reset_password')}`, type: 'success'});
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.log(error);
      setAlert({message: `${t('error_reset_password')}`, type: 'error'});
    }
  };

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 5000); // Hide alert after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  return (
    <Container fluid className={`${styles.base_font} mt-5 overflow-hidden`}>
      <Row>
        <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 2 }} xl={{ span: 4, offset: 4 }}>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <a href="/"><img src={logo} alt="logo" /></a>
            <h2 className={`${styles.login_header}`}>{t('forgotten_password')}</h2>
            <Form onSubmit={handleSubmit} className={`${styles.form_width}`}>
              {/* email */}
              <Form.Group controlId="formBasicPassword" className='mt-3'>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </Form.Group>
              {alert.message && (
                <AlertComponent message={alert.message} type={alert.type} />
              )}
              {/* submit button */}
              <div className="d-grid mt-1">
                <Button
                  type="submit"
                  className={`${styles.login_button} mt-3 btn-block rounded-3`}
                >
                  {t('send_reset_link')}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
      {/*<Row className={`${styles.footer_width}`}>
        <img src={footer_logo} alt="footer_logo" className={`${styles.footer_img}`} />
      </Row>*/}
    </Container>
  )
}

export default ForgottenPassword;