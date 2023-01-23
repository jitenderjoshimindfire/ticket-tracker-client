import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import axios from "../axios";
import LoginNav from "./LoginNav";

const productOptions = [
  "Select Product Type",
  "Amazon",
  "Facebook",
  "Google",
  "Microsoft",
];

function TicketForm() {
  const [ticketFormState, setTicketFormState] = useState({
    title: "",
    userEmail: "",
    createdBy: "",
    description: "",
    productType: "Select Product type",
  });

  function handleFormStateChange({ target }) {
    const { name, value } = target;

    setTicketFormState({ ...ticketFormState, [name]: value });

    // console.log(ticketFormState, "ticktet state");
  }

  function handleSelectTicketDropdown(e) {
    const value = e;
    setTicketFormState({ ...ticketFormState, productType: value });
  }

  async function handleClick(e) {
    e.preventDefault();
    const requestObject = { ...ticketFormState };
    //console.log(JSON.stringify(requestObject));

    await axios.post("tickets", requestObject);

    setTicketFormState({
      title: "",
      userEmail: "",
      createdBy: "",
      description: "",
      productType: "Select Product type",
    });
  }

  return (
    <div>
      <LoginNav />
      <Card style={{ maxWidth: "min(90%,30rem)", margin: "2rem auto" }}>
        <Card.Header style={{ marginRight: "20px" }}>
          <Card.Title className="text-center">Create Ticket</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={ticketFormState.title}
                name="title"
                type="text"
                placeholder="Enter Title"
                onChange={handleFormStateChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="userEmail">
              <Form.Label>User Email</Form.Label>
              <Form.Control
                value={ticketFormState.userEmail}
                onChange={handleFormStateChange}
                name="userEmail"
                type="email"
                placeholder="User Email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label>Created By</Form.Label>
              <Form.Control
                value={ticketFormState.createdBy}
                onChange={handleFormStateChange}
                name="createdBy"
                type="text"
                placeholder="Created By"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={ticketFormState.description}
                onChange={handleFormStateChange}
                name="description"
                type="text"
                placeholder="Description"
                as="textarea"
                rows={3}
              />
            </Form.Group>
            <div style={{ display: "flex" }}>
              <Dropdown
                onSelect={handleSelectTicketDropdown}
                name="productType"
              >
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {ticketFormState.productType}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {productOptions &&
                    productOptions.map((option, i) => {
                      return (
                        <Dropdown.Item key={option + i} eventKey={option}>
                          {option}
                        </Dropdown.Item>
                      );
                    })}
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="primary"
                type="submit"
                onClick={handleClick}
                style={{ marginLeft: "10px" }}
              >
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TicketForm;

// title
// "Issue Number 7 "
// userEmail
// "user1@gmai4.com"
// productType
// "Amazon"
// createdOn
// 2023-01-19T14:47:51.589+00:00
// createdBy
// "Abhinav Kumar"
// ticketState
// "InProgress"
// description
// "I am not able to reinstate my microsoft account nee your help for the …"
