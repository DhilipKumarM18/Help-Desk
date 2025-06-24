import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AgentLayout from "./AgentLayout";
import StatsPanel from "./StatsPanel";
import FilterSidebar from "./FilterSidebar";
import TicketTable from "./TicketTable";
import TicketModal from "./TicketModal";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeContext";
import { fetchTickets, updateTicket, fetchCommentsByTicket, addComment } from "../../api/api";

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const { dark } = useTheme();

  // Fetch tickets on load
  useEffect(() => {
    fetchTickets()
      .then(res => {
        setTickets(res.data);
        setFilteredTickets(res.data);
      })
      .catch(err => console.error("Error loading tickets:", err));
  }, []);

  // Fetch comments for a selected ticket
  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    fetchCommentsByTicket(ticket.id)
      .then(res => setComments(res.data))
      .catch(err => console.error("Error loading comments:", err));
  };

  // Assign/Unassign
  const toggleAssign = async (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    const updatedData = {
      ...ticket,
      assignedTo: ticket.assignedTo ? null : { name: "You" },
    };
    await updateTicket(ticketId, updatedData);
    refreshTickets();
  };

  // Update status
  const updateStatus = async (ticketId, newStatus) => {
    const ticket = tickets.find(t => t.id === ticketId);
    const updatedData = { ...ticket, status: newStatus };
    await updateTicket(ticketId, updatedData);
    refreshTickets();
  };

  // Filter tickets
  const applyFilters = (filters) => {
    const filtered = tickets.filter(ticket => {
      return (
        (filters.status === "ALL" || ticket.status === filters.status) &&
        (filters.priority === "ALL" || ticket.priority === filters.priority) &&
        (filters.assigned === "ALL" ||
          (filters.assigned === "ASSIGNED" && ticket.assignedTo) ||
          (filters.assigned === "UNASSIGNED" && !ticket.assignedTo))
      );
    });
    setFilteredTickets(filtered);
  };

  // Submit comment
  const submitComment = () => {
    if (!comment.trim()) return;
    addComment(selectedTicket.id, {
      content: comment,
      user: { name: "Agent" }
    })
      .then(() => {
        setComment("");
        handleView(selectedTicket); // Refresh comments
      })
      .catch(err => console.error("Error submitting comment:", err));
  };

  const refreshTickets = () => {
    fetchTickets()
      .then(res => {
        setTickets(res.data);
        setFilteredTickets(res.data);
      });
  };

  return (
    <div className={dark ? "dark-theme" : "light-theme"}>
      <AgentLayout>
        <Container fluid>
          <Row>
            <Col md={9}>
              <Row className="align-items-center mb-3">
                <Col><h3 className="text-primary fw-bold">Agent Ticket Dashboard</h3></Col>
                <Col className="text-end"><ThemeToggle /></Col>
              </Row>

              <StatsPanel tickets={filteredTickets} />
              <TicketTable
                tickets={filteredTickets}
                onUpdate={(id, data) => {
                  if (data.status) updateStatus(id, data.status);
                  if (data.assignedTo !== undefined) toggleAssign(id);
                }}
                onView={handleView}
              />
            </Col>

            <Col md={3}>
              <FilterSidebar onFilter={applyFilters} />
            </Col>
          </Row>
        </Container>

        {selectedTicket && (
          <TicketModal
            show={!!selectedTicket}
            onHide={() => setSelectedTicket(null)}
            ticket={selectedTicket}
            comments={comments}
            comment={comment}
            setComment={setComment}
            submitComment={submitComment}
          />
        )}
      </AgentLayout>
    </div>
  );
};

export default AgentDashboard;
