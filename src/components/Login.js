import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import axios from "../axios";
import Card from "react-bootstrap/Card";
import LoginNav from "./LoginNav";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const mailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function Login() {
  const [appLoginDetails, setAppLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});

  const [user, setUser] = useState("");

  function handleChange({ target }) {
    const { name, value } = target;

    setAppLoginDetails({ ...appLoginDetails, [name]: value });

    if (!!error[name]) setError({ ...error, [name]: null });
  }

  async function handleClick(e) {
    e.preventDefault();

    const newErrors = findLoginFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
    } else {
      const loginBodyObject = { ...appLoginDetails };
      const response = await axios.post("users/login", loginBodyObject);

      if (response.status === 200) {
        toast.success("Login successfull", {
          autoClose: 2000,
          position: "top-right",
          theme: "colored",
        });
      }

      const { token } = response.data;
      const { user } = response.data.data;
      const userData = { token, ...user };
      setUser(userData);
      localStorage.setItem("LoginToken", JSON.stringify(userData));
    }
  }

  const findLoginFormErrors = () => {
    const { email, password } = appLoginDetails;
    const newErrors = {};
    if (!email || email === "") {
      newErrors.email = "user email cannot be empty";
    } else if (!email.match(mailRegex)) {
      newErrors.email = "please provide valid email";
    }

    if (!password || password === "")
      newErrors.password = "please enter the password";

    console.log(email, "eeeee", password);

    return newErrors;
  };

  if (user) {
    return <Navigate to="/tickets" replace />;
  } else {
    return (
      <div>
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
                      isInvalid={!!error.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error.email}
                    </Form.Control.Feedback>
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
                      isInvalid={!!error.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error.password}
                    </Form.Control.Feedback>
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
      </div>
    );
  }
}

export default Login;
