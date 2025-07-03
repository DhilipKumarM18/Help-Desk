import { Modal, Button, Form, ListGroup, Badge } from "react-bootstrap";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

const TicketModal = ({ ticket, onClose, onUpdate }) => {
  const { userDetails, user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const token = user?.token;

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/tickets/${ticket.id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const refreshTicket = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/tickets/${ticket.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate?.(res.data); // 🔄 notify parent to update UI
    } catch (err) {
      console.error("Error refreshing ticket", err);
    }
  };

  useEffect(() => {
    if (ticket?.id) {
      fetchComments();
    }
  }, [ticket]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:8080/api/tickets/${ticket.id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      setComments([res.data, ...comments]);
      refreshTicket(); // 🟡 Refresh after comment add
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter(c => c.id !== commentId));
      refreshTicket(); // 🟡 Refresh after delete
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/comments/${editingCommentId}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = comments.map((c) =>
        c.id === editingCommentId ? res.data : c
      );
      setComments(updated);
      setEditingCommentId(null);
      setEditContent("");
      refreshTicket(); // 🟡 Refresh after edit
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const canEditOrDelete = (comment) =>
    comment.user.role === 'AGENT' && comment.user.id === userDetails?.id;

  return (
    <Modal show onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ticket #{ticket.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Title:</strong> {ticket.title}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Priority:</strong> <Badge bg="warning">{ticket.priority}</Badge></p>
        <p><strong>Status:</strong> <Badge bg="info">{ticket.status}</Badge></p>
        <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        <p><strong>Created By:</strong> {ticket.createdBy?.name || "Unknown"}</p>
        <p><strong>Assigned To:</strong> {ticket.assignedTo?.name || "Unassigned"}</p>

        <hr />
        <h6>Comments</h6>
        <Form className="mb-3">
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button className="mt-2" onClick={handleAddComment} variant="primary">
            Post
          </Button>
        </Form>

        <ListGroup>
          {comments.map((comment) => (
            <ListGroup.Item key={comment.id}>
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <strong>{comment.user.name}</strong>{" "}
                  <span className="text-muted small">
                    {moment(comment.createdAt).fromNow()}
                  </span>

                  {editingCommentId === comment.id ? (
                    <>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="mt-2"
                      />
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={handleSaveEdit}
                          className="me-2"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="mb-0 mt-1">{comment.content}</p>
                  )}
                </div>

                {canEditOrDelete(comment) && (
                  <div className="ms-2 mt-1 text-nowrap">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(comment)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TicketModal;
