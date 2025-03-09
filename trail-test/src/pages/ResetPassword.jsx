import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../css/Main.module.css';
import logo from "../assets/avatar_color.png";
import footer_logo from "../assets/footer_logo.svg";
import AlertComponent from '../../components/AlertComponent';
import { useTranslation } from 'react-i18next'; // Import translation hook

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [alert, setAlert] = useState({message: '', type: ''});
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook to access translations

  const handleReset = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/users/reset-password`, {
        token,
        newPassword,
      });
      setAlert({message: `${t('success_reset')}`, type: 'success'});
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.log(error);
      setAlert({message: `${t('error_reset')}`, type: 'error'});
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
        <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 2}} xl={{ span: 4, offset: 4 }}>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <a href="/"><img src={logo} alt="logo" /></a>
            <h2 className={`${styles.login_header}`}>{t('reset_password')}</h2>
            <Form onSubmit={handleReset} className={`${styles.form_width}`}>
              {/* new password */}
              <Form.Group controlId="formBasicPassword" className='mt-3'>
                {/* <Form.Label>Password</Form.Label> */}
                <Form.Control
                  type="password"
                  name="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('new_password')}
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
                  {t('save_password')}
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

export default ResetPassword;