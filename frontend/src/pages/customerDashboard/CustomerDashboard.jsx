import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CustomerLayout from "./CustomerLayout";
import TicketList from "./TicketList";
import TicketDetailModal from "./TicketDetailModal";
import NewTicketForm from "./NewTicketForm";
import StatsPanel from "./StatsPanel";
import FilterSidebar from "./FilterSidebar";
import { useTheme } from "../agentDashboard/ThemeContext";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerDashboard = () => {
  const { dark } = useTheme();
  const { userDetails } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const [filters, setFilters] = useState({
    status: "ALL",
    priority: "ALL",
    assigned: "ALL",
  });

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const fetchMyTickets = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tickets/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enriched = await Promise.all(
        res.data.map(async (ticket) => {
          try {
            const detailRes = await axios.get(
              `http://localhost:8080/api/tickets/${ticket.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return detailRes.data;
          } catch (err) {
            console.error(`Error enriching ticket ${ticket.id}`, err);
            return ticket;
          }
        })
      );

      setTickets(enriched);
      setFiltered(enriched);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handleFilter = (filters) => {
    let result = [...tickets];

    if (filters.status !== "ALL") {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.priority !== "ALL") {
      result = result.filter((t) => t.priority === filters.priority);
    }
    if (filters.assigned === "ASSIGNED") {
      result = result.filter((t) => t.assignedTo !== null);
    } else if (filters.assigned === "UNASSIGNED") {
      result = result.filter((t) => t.assignedTo === null);
    }

    setFilters(filters);
    setFiltered(result);
  };

  const handleNewTicket = (newTicket) => {
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    setFiltered(updated);
  };

  return (
    <div className={`${dark ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
      <CustomerLayout>
        <Container fluid className="py-4">
          <Row className="align-items-center mb-4">
            <Col>
              <h3 className="fw-bold text-xl sm:text-2xl">Welcome, {userDetails?.name || "Customer"}!</h3>
            </Col>
            <Col className="text-end">
              <Button
                onClick={() => setShowNewForm(true)}
                variant="success"
                className="shadow-sm px-4 py-2 text-sm"
              >
                ➕ New Ticket
              </Button>
            </Col>
          </Row>

          <Row>
            <Col md={9}>
              <div className="mb-4">
                <StatsPanel tickets={filtered} />
              </div>
              <div className="rounded-lg shadow bg-white dark:bg-gray-800 p-3">
                <TicketList tickets={filtered} onView={(t) => setSelectedTicket(t)} />
              </div>
            </Col>

            <Col md={3}>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded shadow-sm">
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  onFilter={handleFilter}
                />
              </div>
            </Col>
          </Row>
        </Container>

        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}

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
