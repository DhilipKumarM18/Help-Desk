import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, ListGroup, Badge } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

const TicketDetailModal = ({ ticket, onClose, onUpdate }) => {
  const { userDetails } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    if (ticket?.id) fetchComments();
  }, [ticket]);

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
    if (!onUpdate) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/tickets/${ticket.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(res.data); 
    } catch (err) {
      console.error("Failed to fetch latest ticket", err);
    }
  };

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
      await refreshTicket(); 
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c.id !== commentId));
      await refreshTicket(); 
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
      await refreshTicket(); 
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const canEditOrDelete = (comment) => {
    return comment.user.role === "CUSTOMER" && userDetails?.id === comment.user?.id;
  };

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Ticket Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="fw-bold">{ticket.title}</h5>
        <p>{ticket.description}</p>
        <p>
          <strong>Status:</strong> <Badge bg="info">{ticket.status}</Badge>
        </p>
        <p>
          <strong>Priority:</strong>{" "}
          <Badge
            bg={
              ticket.priority === "HIGH"
                ? "danger"
                : ticket.priority === "MEDIUM"
                ? "warning"
                : "success"
            }
          >
            {ticket.priority}
          </Badge>
        </p>

       
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
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TicketDetailModal;
