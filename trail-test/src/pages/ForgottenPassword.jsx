import React, { useState } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from 'axios';
import styles from '../css/Main.module.css';
import logo from "../assets/logo.svg";
import footer_logo from "../assets/footer_logo.svg";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ForgottenPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/users/forgot-password`, {
        email,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
      setMessage(error.respone?.data?.message || 'Error reseting password.');
    }
  };

  return (
    <Container fluid className={`${styles.base_font} mt-5 overflow-hidden`}>
      <Row>
        <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 2}} xl={{ span: 4, offset: 4 }}>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <img src={logo} alt="logo" />
            <h2 className={`${styles.login_header}`}>Forgotten Password</h2>
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
              {/* submit button */}
              <div className="d-grid mt-1">
                <Button
                  type="submit"
                  className={`${styles.login_button} mt-3 btn-block rounded-3`}
                >
                  Send Reset Link
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
      <Row className={`${styles.footer_width}`}>
        <img src={footer_logo} alt="footer_logo" className={`${styles.footer_img}`}/>
      </Row>
    </Container>
  )
}

export default ForgottenPassword;