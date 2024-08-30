import React, { useEffect, useState, } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from "axios";
import Cookies from "universal-cookie";
import styles from '../css/Main.module.css';
import logo from "../assets/logo.svg";
import footer_logo from "../assets/footer_logo.svg";

const cookies = new Cookies();
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: "http://localhost:5555/users/login",
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
        error = new Error();
      });
  }

  return (
    <Container fluid className={`${styles.base_font} mt-5 overflow-hidden`}>
      <Row>
        <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 2}} xl={{ span: 4, offset: 4 }}>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <img src={logo} alt="logo" />
            <h2 className={`${styles.login_header}`}>Prihlásenie</h2>
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
                />
              </Form.Group>
              <div className="d-flex flex-row justify-content-between mt-3">
                <div className=" form-check col-6">
                  <input className="form-check-input" type="checkbox" value="" id="checkbox1" />
                  <label className='form-check-label' htmlFor="flexCheckDefault">
                    Zapamätať
                  </label>
                </div>
                <div className="col-6 text-end">
                  <a href='#' className={`${styles.forgot_pass_link}`}>
                    Zabudli ste heslo?
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
                  Prihlásiť
                </Button>
              </div>

              <div className='d-flex flex-row align-items-center justify-content-center mt-3'>
                <div>
                  Nemáte účet?
                </div>
                <div>
                  <a href='/users/register' className={`${styles.forgot_pass_link} ms-1`}>
                    Vytvoriť
                  </a>
                </div>
              </div>

              {/* {login ? (
                <p className="text-success">You Are Logged in Successfully</p>
              ) : (
                <p className="text-danger">You Are Not Logged in</p>
              )} */}
            </Form>
          </div>
        </Col>
      </Row>
      <Row className={`${styles.footer_width}`}>
        <img src={footer_logo} alt="footer_logo" className={`${styles.footer_img}`}/>
      </Row>
    </Container>
  );
};

export default Login;