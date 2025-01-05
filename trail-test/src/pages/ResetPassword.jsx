import React, { useState } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from '../css/Main.module.css';
import logo from "../assets/logo.svg";
import footer_logo from "../assets/footer_logo.svg";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5555/users/reset-password', {
        token,
        newPassword,
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
            <h2 className={`${styles.login_header}`}>Reset Password</h2>
            <Form onSubmit={handleReset} className={`${styles.form_width}`}>
              {/* new password */}
              <Form.Group controlId="formBasicPassword" className='mt-3'>
                {/* <Form.Label>Password</Form.Label> */}
                <Form.Control
                  type="password"
                  name="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Set a new Password"
                  required
                />
              </Form.Group>
              {/* submit button */}
              <div className="d-grid mt-1">
                <Button
                  type="submit"
                  className={`${styles.login_button} mt-3 btn-block rounded-3`}
                >
                  Save Password
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

export default ResetPassword;