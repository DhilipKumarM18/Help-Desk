import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CustomerLayout from "./CustomerLayout";
import TicketList from "./TicketList";
import TicketDetailModal from "./TicketDetailModal";
import NewTicketForm from "./NewTicketForm";
import StatsPanel from "./StatsPanel";
import FilterSidebar from "./FilterSidebar";
import { useTheme } from "../agentDashboard/ThemeContext";
import { mockTickets } from "../agentDashboard/mockTickets"; // Replace with customer-specific mock or API

const CustomerDashboard = () => {
  const { dark } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    // Filter only tickets created by this user (mock example)
    const userTickets = mockTickets.filter(t => t.createdBy.name === "Customer");
    setTickets(userTickets);
    setFiltered(userTickets);
  }, []);

  const handleFilter = (filters) => {
    let result = [...tickets];
    if (filters.status !== "ALL") {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters.priority !== "ALL") {
      result = result.filter(t => t.priority === filters.priority);
    }
    setFiltered(result);
  };

  const handleNewTicket = (newTicket) => {
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    setFiltered(updated);
  };

  return (
    <div className={dark ? "dark-theme" : "light-theme"}>
      <CustomerLayout>
        <Container fluid>
          <Row className="align-items-center mb-3">
            <Col><h3 className="fw-bold">Welcome, Customer!</h3></Col>
            <Col className="text-end">
              <Button onClick={() => setShowNewForm(true)} variant="success">➕ New Ticket</Button>
            </Col>
          </Row>

          <Row>
            <Col md={9}>
              <StatsPanel tickets={filtered} />
              <TicketList tickets={filtered} onView={(t) => setSelectedTicket(t)} />
            </Col>
            <Col md={3}>
              <FilterSidebar onFilter={handleFilter} />
            </Col>
          </Row>
        </Container>

        {/* Modal: View Ticket */}
        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}

        {/* Modal: New Ticket Form */}
        {showNewForm && (
          <NewTicketForm
            show={showNewForm}
            onClose={() => setShowNewForm(false)}
            onCreate={handleNewTicket}
          />
        )}
      </CustomerLayout>
    </div>
  );
};

export default CustomerDashboard;
