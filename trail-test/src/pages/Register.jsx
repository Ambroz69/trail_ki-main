import React, { useEffect, useState, } from 'react';
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: "http://localhost:5555/users/register",
      data: {
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
    <Container className="mt-5">
      <Row>
        <Col xs={{ span: 6, offset: 3 }}>
          <h2>Register New Account</h2>
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
              Register
            </Button>

            {register ? (
              <p className="text-success">You Are Registered Successfully</p>
            ) : (
              <p className="text-danger">You Are Not Registered</p>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;