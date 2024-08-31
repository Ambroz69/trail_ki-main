import React, { useEffect, useState, } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";
import styles from '../css/Main.module.css';
import logo from "../assets/logo.svg";
import footer_logo from "../assets/footer_logo.svg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: "http://localhost:5555/users/register",
      data: {
        /* ADD NAME TO BACKEND CALL name */
        email,
        password
      },
    };

    axios(configuration)
      .then((result) => {
        setRegister(true);
        // redirect user to the login page
        window.location.href = "/users/login";
      })
      .catch((error) => {
        error = new Error();
      });
  }

  return (
    <Container fluid className={`${styles.base_font} mt-5 overflow-hidden`}>
      <Row>
        <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 2 }} xl={{ span: 4, offset: 4 }}>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <img src={logo} alt="logo" />
            <h2 className={`${styles.login_header}`}>Vytvorenie účtu</h2>
            <Form onSubmit={(e) => handleSubmit(e)} className={`${styles.form_width}`}>
              {/* name */}
              <Form.Group controlId="formBasicName" className='mt-1'>
                {/* <Form.Label>E-mail</Form.Label>*/}
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Meno"
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
                  placeholder="Heslo"
                  required
                />
              </Form.Group>
              <div className="d-flex flex-row justify-content-between mt-3">
                <div className="form-check d-flex flex-row align-items-center justify-content-center">
                  <input className="form-check-input" type="checkbox" value="" id="checkbox1" required />
                  <label className='form-check-label ms-2 me-1' htmlFor="flexCheckDefault">
                    Súhlasím s
                  </label>
                  <a href='#' className={`${styles.forgot_pass_link} ${styles.fix_align}`}>
                    obchodnými podmienkami.
                  </a>
                </div>
              </div>

              {/* submit button */}
              <div className="d-grid mt-1">
                <Button
                  type="submit"
                  className={`${styles.login_button} mt-3 btn-block rounded-3`}
                  onClick={(e) => handleSubmit(e)}
                >
                  Zaregistrovať
                </Button>
              </div>

              <div className='d-flex flex-row align-items-center justify-content-center mt-3'>
                <div>
                  Už máte účet?
                </div>
                <div>
                  <a href='/users/login' className={`${styles.forgot_pass_link} ms-1`}>
                    Prihláste sa
                  </a>
                </div>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
      <Row className={`${styles.footer_width}`}>
        <img src={footer_logo} alt="footer_logo" className={`${styles.footer_img}`} />
      </Row>
    </Container>
  );
};

export default Register;