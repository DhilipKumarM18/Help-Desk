import { Table } from "react-bootstrap";
import TicketRow from "./TicketRow";

const TicketTable = ({ tickets, onAssign, onStatusChange, onView }) => (
  <Table bordered hover responsive>
    <thead className="table-light">
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Status</th>
        <th>Priority</th>
        <th>Created By</th>
        <th>Assigned To</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {tickets.map(t => (
        <TicketRow
          key={t.id}
          ticket={t}
          onAssign={onAssign}
          onStatusChange={onStatusChange}
          onView={onView}
        />
      ))}
    </tbody>
  </Table>
);

export default TicketTable;
