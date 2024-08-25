import React, { useEffect, useState, } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from "axios";
import Cookies from "universal-cookie";

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
    <Container className="mt-5">
      <Row>
        <Col xs={{ span: 6, offset: 3 }}>
          <h2>Log Into Existing Account</h2>
          <Form onSubmit={(e) => handleSubmit(e)}>
            {/* email */}
            <Form.Group controlId="formBasicEmail" className='mt-3'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />

            </Form.Group>

            {/* password */}
            <Form.Group controlId="formBasicPassword" className='mt-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>

            {/* submit button */}
            <Button
              variant="success"
              type="submit"
              className='mt-3'
              onClick={(e) => handleSubmit(e)}
            >
              Log In
            </Button>
            <Row>
              <Link to='/users/register'>
                Don't have account yet? Register here.
              </Link>
            </Row>

            {login ? (
              <p className="text-success">You Are Logged in Successfully</p>
            ) : (
              <p className="text-danger">You Are Not Logged in</p>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;