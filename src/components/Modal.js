import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "../axios";
import CommentList from "./comments/CommentList";
import formatDate from "../util";
function TicketModal(props) {
  const [commentState, setCommentState] = useState({
    comment: "",
  });
  console.log({ assignedTo: props.ticketData.assignedTo }, "kkkkk");
  const [assignedToValue, setAssignedToValue] = useState("");
  console.log({ assignedToValue }, "lllll");
  function handleClose(e) {
    props.handleCardClick(e);
  }

  function handleStateChange({ target }) {
    const { name, value } = target;

    setCommentState({ ...commentState, [name]: value });
    console.log(commentState);
  }

  async function handleClick(e) {
    e.preventDefault();
    //console.log(props.ticketData);
    const ticketId = props.ticketData._id;
    const tokenData = localStorage.getItem("LoginToken");
    const tokenString = JSON.parse(tokenData);
    const token = tokenString.token;
    const requestObject = { ...commentState, userId: tokenString._id };
    //console.log(requestObject);
    const response = await axios.post(
      `tickets/${ticketId}/comments`,
      requestObject,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log(response.data.data);

    if (response.status === 200) {
      props.updateCommentCallback(ticketId, response.data.data);
    }

    setCommentState({
      comment: "",
    });
  }

  const onChangeHandler = async (e) => {
    //console.log(props.ticketData);
    const ticketId = props.ticketData._id;
    const tokenData = localStorage.getItem("LoginToken");
    const tokenString = JSON.parse(tokenData);
    const token = tokenString.token;
    const assignedToEmailId = e.target.value;
    const response = await axios.post(
      `tickets/${ticketId}/assign`,
      { email: assignedToEmailId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { email, name, _id } = response.data.data;
    console.log(response);

    if (response.status === 200) {
      setAssignedToValue(email);
      props.assignTicketCallback({
        email,
        name,
        _id,
        ticketId: ticketId,
      });
    }
  };

  return (
    <div>
      {console.log(props)}
      <Modal show={props.showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{props.ticketData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold">Author : {props.ticketData.createdBy}</p>
          <p className="fw-bold">
            Created On : {formatDate(props.ticketData.createdOn)}
          </p>
          <p className="fw-bold">Author Email : {props.ticketData.userEmail}</p>
          <p className="fw-bold">
            Ticket Descripton : {props.ticketData.description}
          </p>
        </Modal.Body>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
          }}
        >
          {" "}
          <p style={{ marginLeft: "15px" }} className="fw-bold">
            Assign To :{" "}
          </p>
          {console.log(props.staffMembers)}
          <Form.Select
            className="w-auto"
            style={{ marginLeft: "5px" }}
            onChange={onChangeHandler}
            value={
              assignedToValue !== ""
                ? assignedToValue
                : props.ticketData.assignedTo?.email
            }
          >
            {console.log(assignedToValue)}
            {props.staffMembers.map((staffMember) => (
              <option key={staffMember._id} value={staffMember.email}>
                {staffMember.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="fw-bold">Ticket Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={commentState.comment}
                name="comment"
                type="text"
                onChange={handleStateChange}
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleClick}>
              save comments
            </Button>
          </Form>
          {props.ticketData.comments?.length > 0 ? (
            <CommentList comments={props.ticketData.comments} />
          ) : null}
          {props.ticketData.comments?.length === 0 ? <p>No Comments</p> : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} type="submit">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TicketModal;
