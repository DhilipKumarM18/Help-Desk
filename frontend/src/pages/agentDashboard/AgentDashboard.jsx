import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import AgentLayout from "./AgentLayout";
import StatsPanel from "../customerDashboard/StatsPanel";
import FilterSidebar from "./FilterSidebar";
import TicketTable from "./TicketTable";
import { useTheme } from "./ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import TicketModal from "./TicketModal";

const AgentDashboard = () => {
  const { dark } = useTheme();
  const { user, userDetails } = useContext(AuthContext);

  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [admins, setAdmins] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    status: "ALL",
    priority: "ALL",
    assigned: "ALL",
  });

  const token = user?.token;

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tickets/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.map(ticket => {
        if (ticket.status === "CLOSED") return { ...ticket, assignedTo: null };
        return ticket;
      });

      setTickets(data);
      setFiltered(data);

      const assigned = {};
      data.forEach(t => {
        if (t.assignedTo && t.status !== "CLOSED") {
          assigned[t.assignedTo] = true;
        }
      });
      setAdmins(assigned);
    } catch (error) {
      console.error("Error fetching tickets", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleFilter = (filters) => {
    let result = [...tickets];

    if (filters.status !== "ALL") {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters.priority !== "ALL") {
      result = result.filter(t => t.priority === filters.priority);
    }

    if (filters.assigned === "ASSIGNED") {
      result = result.filter(t => t.assignedTo?.id === userDetails?.id);
    } else if (filters.assigned === "UNASSIGNED") {
      result = result.filter(t => !t.assignedTo);
    }

    // Apply search after filtering
    if (searchQuery.trim() !== "") {
      result = result.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilters(filters);
    setFiltered(result);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    let result = [...tickets];

    if (filters.status !== "ALL") {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters.priority !== "ALL") {
      result = result.filter(t => t.priority === filters.priority);
    }

    if (filters.assigned === "ASSIGNED") {
      result = result.filter(t => t.assignedTo?.id === userDetails?.id);
    } else if (filters.assigned === "UNASSIGNED") {
      result = result.filter(t => !t.assignedTo);
    }

    if (query.trim() !== "") {
      result = result.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFiltered(result);
  };

  const assignTicket = async (ticketId, agentId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    const alreadyAssigned = tickets.some(
      t => t.assignedTo?.id === agentId && t.status !== "CLOSED"
    );
    if (alreadyAssigned) {
      alert("This agent is already assigned to an active ticket.");
      return;
    }

    const payload = {
      status: ticket.status,
      priority: ticket.priority,
      assignedTo: agentId,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/tickets/${ticketId}/update`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedTicket = response.data;
      setTickets(prev => prev.map(t => (t.id === ticketId ? updatedTicket : t)));
      setFiltered(prev => prev.map(t => (t.id === ticketId ? updatedTicket : t)));
    } catch (err) {
      console.error("Error assigning ticket", err);
    }
  };

  const updateStatus = async (ticketId, newStatus) => {
    const ticket = tickets.find(t => t.id === ticketId);
    const payload = {
      status: newStatus,
      priority: ticket.priority,
      assignedTo: ticket.assignedTo?.id || null,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/tickets/${ticketId}/update`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTicket = response.data;
      setTickets(prev => prev.map(t => (t.id === ticketId ? updatedTicket : t)));
      setFiltered(prev => prev.map(t => (t.id === ticketId ? updatedTicket : t)));
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(prev => prev.filter(t => t.id !== ticketId));
      setFiltered(prev => prev.filter(t => t.id !== ticketId));
    } catch (err) {
      console.error("Error deleting ticket", err);
      alert("Failed to delete ticket.");
    }
  };

  const fetchTicketDetails = async (ticket) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/tickets/${ticket.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTicket(res.data);
    } catch (err) {
      console.error("Error fetching ticket details", err);
    }
  };

  return (
    <div className={`${dark ? "dark-theme bg-gray-900 text-white" : "light-theme bg-white text-black"} min-h-screen`}>
      <AgentLayout>
        <Container fluid className="px-4 py-3">
          <Row className="align-items-center mb-3">
            <Col>
              <h3 className="fw-bold text-xl sm:text-2xl">Welcome, {userDetails?.name || "Agent"}!</h3>
            </Col>
          </Row>

          {/* 🔍 Search Bar */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search tickets by title..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </Col>
          </Row>

          <Row>
            <Col md={9} className="mb-4 md:mb-0">
              <div className="bg-white dark:bg-gray-800 rounded shadow p-3 mb-4">
                <StatsPanel tickets={filtered} />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded shadow p-3">
                <TicketTable
                  tickets={filtered}
                  onAssign={assignTicket}
                  onStatusChange={updateStatus}
                  onView={fetchTicketDetails}
                  onDelete={deleteTicket}
                />
              </div>
            </Col>
            <Col md={3}>
              <div className="bg-white dark:bg-gray-800 rounded shadow p-3">
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  onFilter={handleFilter}
                />
              </div>
            </Col>
          </Row>

          {selectedTicket && (
            <TicketModal
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
            />
          )}
        </Container>
      </AgentLayout>
    </div>
  );
};

export default AgentDashboard;
