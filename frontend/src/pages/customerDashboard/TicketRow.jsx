import { Button, Badge } from "react-bootstrap";
import moment from "moment";

const statusColors = {
  OPEN: "primary",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "secondary"
};

const priorityColors = {
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "success"
};

const TicketRow = ({ ticket, onView }) => (
  <tr>
    <td>{ticket.id}</td>
    <td>{ticket.title}</td>
    <td>
      <Badge bg={statusColors[ticket.status] || "dark"}>{ticket.status}</Badge>
    </td>
    <td>
      <Badge bg={priorityColors[ticket.priority] || "secondary"}>{ticket.priority}</Badge>
    </td>
    <td>{moment(ticket.createdAt).format("DD MMM YYYY")}</td>
    <td>{ticket.assignedTo?.name || "Unassigned"}</td>
    <td>
      <Button variant="info" size="sm" onClick={() => onView(ticket)}>
        View
      </Button>
    </td>
  </tr>
);

export default TicketRow;
