import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import { useState } from "react";

function NavBar() {
  const [loggedOut, setLoggedOut] = useState(false);

  function handleClick() {
    localStorage.clear();
    if (!localStorage.getItem("LoginToken")) {
      setLoggedOut(true);
    }
  }

  if (loggedOut) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Ticket Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link href="#pricing">
                <Button variant="primary" onClick={handleClick}>
                  Logout
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
