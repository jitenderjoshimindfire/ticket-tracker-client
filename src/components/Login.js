import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import axios from "../axios";
import Card from "react-bootstrap/Card";
import LoginNav from "./LoginNav";
import { Navigate } from "react-router-dom";
function Login() {
  const [appLoginDetails, setAppLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState("");

  function handleChange({ target }) {
    const { name, value } = target;

    setAppLoginDetails({ ...appLoginDetails, [name]: value });
    // console.log(appLoginDetails);
  }

  async function handleClick(e) {
    e.preventDefault();
    const loginBodyObject = { ...appLoginDetails };
    const response = await axios.post("users/login", loginBodyObject);
    //console.log(request);
    const { token } = response.data;
    const { user } = response.data.data;
    const userData = { token, ...user };
    setUser(userData);
    localStorage.setItem("LoginToken", JSON.stringify(userData));
    const result = localStorage.getItem("LoginToken");
    //localStorage.clear();
    // console.log(result);
  }

  if (user) {
    return <Navigate to="/tickets" replace />;
  } else {
    return (
      <>
        <LoginNav />
        <Container style={{ marginTop: "90px" }}>
          <Row className="justify-content-center mt-4">
            <Col sm={12} md={8} lg={4}>
              <Card>
                <Card.Header style={{ marginRight: "20px" }}>
                  <Card.Title className="text-center">Admin Login</Card.Title>
                </Card.Header>
                <Form>
                  <Form.Group
                    className="mb-4"
                    controlId="formBasicEmail"
                    style={{ marginRight: "5px" }}
                  >
                    <Form.Label>Email address</Form.Label>
                    <span className="text-danger fw-bold mx-1">*</span>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={appLoginDetails.email}
                      name="email"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId="formBasicPassword"
                    style={{ marginRight: "5px" }}
                  >
                    <Form.Label>Password</Form.Label>
                    <span className="text-danger fw-bold mx-1">*</span>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={appLoginDetails.password}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleClick}
                    style={{ marginBottom: "5px" }}
                  >
                    Submit
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Login;
