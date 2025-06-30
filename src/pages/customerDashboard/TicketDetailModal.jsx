import { Modal, Form, Button } from "react-bootstrap";
import moment from "moment";

const TicketDetailModal = ({
  ticket,
  onClose,
  comments = [],
  comment = "",
  setComment = () => {},
  submitComment = () => {}
}) => (
  <Modal show onHide={onClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>
        Ticket #{ticket.id}: {ticket.title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p><strong>Description:</strong> {ticket.description}</p>
      <p><strong>Status:</strong> <span className="text-uppercase">{ticket.status}</span></p>
      <p><strong>Priority:</strong> <span className="text-uppercase">{ticket.priority}</span></p>
      <p><strong>Created At:</strong> {moment(ticket.createdAt).format("DD MMM YYYY, h:mm A")}</p>
      <p><strong>Assigned To:</strong> {ticket.assignedTo?.name || "Unassigned"}</p>

      <hr />
      <h5>Comments</h5>
      <ul className="list-group mb-3">
        {comments.length > 0 ? comments.map((c) => (
          <li key={c.id} className="list-group-item">
            <strong>{c.user.name}</strong>: {c.content}
            <small className="text-muted ms-2">
              ({moment(c.createdAt).fromNow()})
            </small>
          </li>
        )) : (
          <li className="list-group-item text-muted">No comments yet.</li>
        )}
      </ul>

      <Form.Control
        as="textarea"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <Button className="mt-2 float-end" onClick={submitComment}>
        Submit Comment
      </Button>
    </Modal.Body>
  </Modal>
);

export default TicketDetailModal;
