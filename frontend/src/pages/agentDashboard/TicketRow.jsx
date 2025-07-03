import { Badge, Button, Form } from "react-bootstrap";
import { useState } from "react";

const statusColors = {
  OPEN: "primary",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "secondary",
};

const agentOptions = [
  { id: 20, label: "Agent 1" },
  { id: 21, label: "Agent 2" },
  { id: 27, label: "Agent 3" },
];

const TicketRow = ({ ticket, onAssign, onStatusChange, onView, onDelete }) => {
  const [selectedAgent, setSelectedAgent] = useState("");

  const handleAssign = () => {
    if (!selectedAgent) {
      alert("Please select an agent");
      return;
    }
    onAssign(ticket.id, parseInt(selectedAgent));
    setSelectedAgent("");
  };

  const isAssignable = !ticket.assignedTo || ticket.status === "CLOSED";

  return (
    <tr>
      <td>{ticket.id}</td>
      <td>{ticket.title}</td>
      <td>
        <Badge bg={statusColors[ticket.status]}>
          {ticket.status}
        </Badge>
      </td>
      <td>
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
      </td>
      <td>{ticket.createdBy?.name || "Unknown"}</td>
      <td>{ticket.assignedTo?.name || "Unassigned"}</td>
      <td>
        {isAssignable && (
          <div className="d-flex align-items-center mb-1">
            <Form.Select
              size="sm"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="me-1"
            >
              <option value="">Assign Agent</option>
              {agentOptions.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.label}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="success"
              size="sm"
              onClick={handleAssign}
            >
              Assign
            </Button>
          </div>
        )}

        <Form.Select
          size="sm"
          value={ticket.status}
          onChange={(e) => onStatusChange(ticket.id, e.target.value)}
          className="mb-1"
        >
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Form.Select>

        <Button
          variant="info"
          size="sm"
          onClick={() => onView(ticket)}
          className="me-1"
        >
          View
        </Button>

        
      </td>
      <td>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(ticket.id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default TicketRow;
