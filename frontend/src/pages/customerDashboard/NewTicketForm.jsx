import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const NewTicketForm = ({ show, onClose, onCreate }) => {
  const { userDetails } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).token;
    try {
      const res = await axios.post(
        "http://localhost:8080/api/tickets/create",
        { title, description, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCreate(res.data);
      onClose();
    } catch (error) {
      console.error("Ticket creation failed:", error);
      alert("Failed to create ticket.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton><Modal.Title>Create New Ticket</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Form.Select>
          </Form.Group>
          <div className="d-grid">
            <Button variant="success" type="submit">Submit Ticket</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewTicketForm;
