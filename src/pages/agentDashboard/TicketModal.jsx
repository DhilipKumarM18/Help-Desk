import { Modal, Button } from "react-bootstrap";

const TicketModal = ({ ticket, onClose }) => {
  return (
    <Modal show onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ticket #{ticket.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Title:</strong> {ticket.title}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        <p><strong>Created By:</strong> {ticket.createdBy?.name || "Unknown"}</p>
        <p><strong>Assigned To:</strong> {ticket.assignedTo?.name|| "Unassigned"}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TicketModal;
