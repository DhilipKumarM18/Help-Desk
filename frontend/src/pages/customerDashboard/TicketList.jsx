import { Table } from "react-bootstrap";
import TicketRow from "./TicketRow";

const TicketList = ({ tickets, onView }) => (
  <Table bordered hover responsive className="shadow-sm rounded">
    <thead className="table-dark">
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Status</th>
        <th>Priority</th>
        <th>Created At</th>
        <th>Assigned To</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(tickets) && tickets.length > 0 ? (
        tickets.map(ticket => (
          <TicketRow key={ticket.id} ticket={ticket} onView={onView} />
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center text-muted">
            No tickets available.
          </td>
        </tr>
      )}
    </tbody>
  </Table>
);

export default TicketList;
