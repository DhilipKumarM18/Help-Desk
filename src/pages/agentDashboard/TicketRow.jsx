import { Badge, Button, Form } from "react-bootstrap";

const statusColors = {
  OPEN: "primary",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "secondary",
};

const TicketRow = ({ ticket, onAssign, onStatusChange, onView }) => (
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
    <td>{ticket.createdBy?.name}</td>
    <td>{ticket.assignedTo?.name || "Unassigned"}</td>
    <td>
      <Button
        variant="success"
        size="sm"
        disabled={!!ticket.assignedTo}
        onClick={() => onAssign(ticket.id)}
      >
        Assign
      </Button>

      <Form.Select
        size="sm"
        value={ticket.status}
        onChange={(e) =>
          onStatusChange(ticket.id, e.target.value)
        }
        className="d-inline w-auto mx-1"
      >
        {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </Form.Select>

      <Button
        variant="info"
        size="sm"
        onClick={() => onView(ticket)}
      >
        View
      </Button>
    </td>
  </tr>
);

export default TicketRow;
