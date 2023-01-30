import React, { useEffect } from "react";
import { useState } from "react";
import axios from "../axios";
import "./TicketList.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
//import CardGroup from "react-bootstrap/CardGroup";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import NavBar from "./Nav";
import TicketModal from "./Modal";
import formatDate from "../util";
import { toast } from "react-toastify";

const progressOptions = ["In Progress", "Blocked", "Resolved"];
function TicketList() {
  const [ticketData, setTicketData] = useState({
    data: null,
    staffMembers: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [ticketDeleted, setTicketDeleted] = useState(false);

  useEffect(() => {
    async function getTickets() {
      // console.log("inside getTiclets");
      const tokenData = localStorage.getItem("LoginToken");
      const tokenString = JSON.parse(tokenData);
      const token = tokenString.token;
      const request = await axios.get("tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (request.data.data.tickets) {
        setTicketData((prevState) => ({
          ...prevState,
          data: request.data.data.tickets,
        }));
      }
    }

    getTickets();
  }, [ticketDeleted]);

  useEffect(() => {
    async function getAllStaff() {
      const request = await axios.get("users");
      // console.log(request.data.data.users);
      if (request.data.data.users) {
        // setTicketData({ staffMembers: request.data.data.users });
        setTicketData((prevState) => ({
          ...prevState,
          staffMembers: request.data.data.users,
        }));
      }
    }
    getAllStaff();
  }, []);

  const handleSelectProgressDropdown = (ticketId) => async (e) => {
    // console.log(ticketId);
    const tokenData = localStorage.getItem("LoginToken");
    const tokenString = JSON.parse(tokenData);
    const token = tokenString.token;
    const response = await axios.patch(
      `tickets/${ticketId}`,
      { ticketState: e },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // console.log(response);
    if (response.status === 200) {
      updateTicketState(response.data.data);
      toast.success("Ticket state changed !!", {
        autoClose: 2000,
        position: "top-right",
        theme: "colored",
      });
    }
  };

  const updateTicketState = (data) => {
    const newTicketState = data.ticket.ticketState;
    const ticketId = data.ticket._id;
    // console.log(newTicketState, ticketId);

    setTicketData((prevState) => ({
      ...prevState,
      data: prevState.data.map((ticket) =>
        ticket._id === ticketId
          ? {
              ...ticket,

              ticketState: newTicketState,
            }
          : ticket
      ),
    }));

    // console.log(ticketData);
  };

  const handleCardClick = (e, i) => {
    e.preventDefault();
    setModalData({ ...ticketData.data[i] });

    switch (showModal) {
      case true:
        setShowModal(false);
        break;
      case false:
        setShowModal(true);
        break;
      default:
        setShowModal(false);
        break;
    }
  };

  async function handleDeleteTicket(e, i) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete")) {
      const currentTicket = ticketData.data[i];
      const tokenData = localStorage.getItem("LoginToken");
      const tokenString = JSON.parse(tokenData);
      const token = tokenString.token;
      const response = await axios.delete(`tickets/${currentTicket._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 204) {
        setTicketDeleted(true);
        toast.success("ticket deleted", {
          autoClose: 2000,
        });
      }

      if (ticketDeleted === true) setTicketDeleted(false);
    }
  }

  const updateCommentCallback = (ticketId, incommingComment) => {
    const newComment = incommingComment;
    // console.log(newComment, "newcomment");
    // setTicketData((prevState) => ({
    //   ...prevState,
    //   data: prevState.data.map((ticket) => {
    //     if (ticket._id === ticketId) {
    //       const updatedTicket = {
    //         ...ticket,
    //         comments: [...ticket.comments, newComment],
    //       };
    //       setModalData(updatedTicket);
    //     }
    //     return ticket;
    //   }),
    // }));

    setTicketData((prevState) => ({
      ...prevState,
      data: prevState.data.map((ticket) =>
        ticket._id === ticketId
          ? { ...ticket, comments: [...ticket.comments, newComment] }
          : ticket
      ),
    }));

  };

  const assignTicketCallback = ({ ticketId, ...ticketAssignedDetails }) => {
    setTicketData((prevState) => ({
      ...prevState,
      data: prevState.data.map((ticket) => {
        if (ticket._id === ticketId) {
          const updatedTicket = {
            ...ticket,
            assignedTo: ticketAssignedDetails,
          };
          setModalData(updatedTicket);
        }
        return ticket;
      }),
    }));
  };

  return (
    <>
      <NavBar />

      <Container style={{ marginTop: "10px" }}>
        <Row xs={1} md={3} className="g-4">
          {ticketData.data &&
            ticketData.data.map((ticket, i) => {
              return (
                <Col key={ticket + i}>
                  <Card
                    style={{
                      width: "18rem",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Card.Body>
                      <Card.Title onClick={(e) => handleCardClick(e, i)}>
                        {ticket.title}
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {formatDate(ticket.createdOn)}
                      </Card.Subtitle>
                      <Card.Subtitle className="mb-2 text-muted">
                        {ticket.userEmail}
                      </Card.Subtitle>
                      <Card.Subtitle className="mb-2 text-muted">
                        {ticket.createdBy}
                      </Card.Subtitle>
                      <Card.Text>{`${ticket.description.substring(
                        0,
                        30
                      )}...`}</Card.Text>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Dropdown
                          onSelect={handleSelectProgressDropdown(ticket._id)}
                          name="productType"
                        >
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                          >
                            {ticket.ticketState}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {progressOptions &&
                              progressOptions.map((option, i) => {
                                return (
                                  <Dropdown.Item
                                    key={option + i}
                                    eventKey={option}
                                  >
                                    {option}
                                  </Dropdown.Item>
                                );
                              })}
                          </Dropdown.Menu>
                        </Dropdown>

                        <Button
                          variant="secondary"
                          onClick={(e) => handleDeleteTicket(e, i)}
                          type="submit"
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>

        {
          <TicketModal
            showModal={showModal}
            handleCardClick={handleCardClick}
            ticketData={modalData}
            updateCommentCallback={updateCommentCallback}
            staffMembers={ticketData.staffMembers}
            assignTicketCallback={assignTicketCallback}
          />
        }
      </Container>
    </>
  );
}

export default TicketList;
// const assignTicketCallback = ({ ticketId, ...ticketAssignedDetails }) => {

//   setTicketData((prevState) => ({
//     ...prevState,
//     data: prevState.data.map((ticket) => {
//       console.log(ticket._id, ticketId);
//       return ticket._id === ticketId
//         ? {
//             ...ticket,
//             assignedTo: ticketAssignedDetails,
//           }
//         : ticket;
//     }),
//   }));
// };
