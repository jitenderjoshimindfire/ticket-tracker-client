import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import axios from "../axios";
import LoginNav from "./LoginNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const productOptions = [
  "Select Product Type",
  "Amazon",
  "Facebook",
  "Google",
  "Microsoft",
];
const mailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function TicketForm() {
  const [ticketFormState, setTicketFormState] = useState({
    title: "",
    userEmail: "",
    createdBy: "",
    description: "",
    productType: "Select Product type",
  });

  const [error, setError] = useState({});

  function handleFormStateChange({ target }) {
    const { name, value } = target;

    setTicketFormState({ ...ticketFormState, [name]: value });

    if (!!error[name])
      setError({
        ...error,
        [name]: null,
      });
  }

  function handleSelectTicketDropdown(e) {
    const value = e;
    setTicketFormState({ ...ticketFormState, productType: value });

    if (value !== "Select Product type")
      setError({
        ...error,
        productType: null,
      });
  }

  async function handleClick(e) {
    console.log("inside handle click");
    e.preventDefault();
    const requestObject = { ...ticketFormState };

    const newErrors = findFormErrors();
    console.log(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      console.log(error);
    } else {
      const response = await axios.post("tickets", requestObject);

      if (response.status === 201) {
        toast.success("The form submitted successfully", {
          autoClose: 2000,
          theme: "colored",
        });
      }

      setTicketFormState({
        title: "",
        userEmail: "",
        createdBy: "",
        description: "",
        productType: "Select Product type",
      });
    }
  }

  const findFormErrors = () => {
    console.log("inside form error");
    const { title, userEmail, createdBy, description, productType } =
      ticketFormState;
    const newErrors = {};

    if (!title || title === "") {
      newErrors.title = "Title cannot be blank";
    } else if (title.length > 30) {
      newErrors.title = "Title cannot be more than 30 characters";
    }

    if (!userEmail || userEmail === "") {
      newErrors.userEmail = "User email cannot be empty";
    } else if (!userEmail.match(mailRegex)) {
      newErrors.userEmail = "Please provide valid email";
    }

    if (!createdBy || createdBy === "") {
      newErrors.createdBy = "Created By cannot be blank";
    } else if (createdBy.length > 20) {
      newErrors.createdBy = "Created By cannot be more than 50 characters";
    }

    if (!description || description === "") {
      newErrors.description = "Description cannot be blank";
    } else if (description.length > 100) {
      newErrors.description = "Description cannot be more than 50 characters";
    }

    if (productType === "Select Product type") {
      newErrors.productType = "Select a product";
    }
    return newErrors;
  };

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
              <span className="text-danger fw-bold mx-1">*</span>
              <Form.Control
                value={ticketFormState.title}
                name="title"
                type="text"
                placeholder="Enter Title"
                onChange={handleFormStateChange}
              />
              <Form.Text className="text-danger fw-bold mx-1" type="invalid">
                {error.title}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="userEmail">
              <Form.Label>User Email</Form.Label>
              <span className="text-danger fw-bold mx-1">*</span>
              <Form.Control
                value={ticketFormState.userEmail}
                onChange={handleFormStateChange}
                name="userEmail"
                type="email"
                placeholder="User Email"
              />
              <Form.Text className="text-danger fw-bold mx-1" type="invalid">
                {error.userEmail}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label>Created By</Form.Label>
              <span className="text-danger fw-bold mx-1">*</span>
              <Form.Control
                value={ticketFormState.createdBy}
                onChange={handleFormStateChange}
                name="createdBy"
                type="text"
                placeholder="Created By"
              />
              <Form.Text className="text-danger fw-bold mx-1" type="invalid">
                {error.createdBy}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label>Description</Form.Label>
              <span className="text-danger fw-bold mx-1">*</span>
              <Form.Control
                value={ticketFormState.description}
                onChange={handleFormStateChange}
                name="description"
                type="text"
                placeholder="Description"
                as="textarea"
                rows={3}
              />
              <Form.Text className="text-danger fw-bold mx-1" type="invalid">
                {error.description}
              </Form.Text>
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
                <span className="text-danger fw-bold mx-1">*</span>
                <Form.Text className="text-danger fw-bold mx-1" type="invalid">
                  {error.productType}
                </Form.Text>
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
