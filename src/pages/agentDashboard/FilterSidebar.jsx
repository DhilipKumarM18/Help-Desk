import { Form, Card } from "react-bootstrap";

const statuses = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const priorities = ["ALL", "HIGH", "MEDIUM", "LOW"];

const defaultFilters = {
  status: "ALL",
  priority: "ALL",
  assigned: "ALL"
};

const FilterSidebar = ({ filters = defaultFilters, setFilters }) => (
<Card className="p-3 mb-4 shadow-sm border filter-sidebar-card">
    <h5>Filters</h5>

    <Form.Group className="mb-2">
      <Form.Label>Status</Form.Label>
      <Form.Select
        name="status"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        {statuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-2">
      <Form.Label>Priority</Form.Label>
      <Form.Select
        name="priority"
        value={filters.priority}
        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
      >
        {priorities.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-2">
      <Form.Label>Assigned</Form.Label>
      <Form.Select
        name="assigned"
        value={filters.assigned}
        onChange={(e) => setFilters({ ...filters, assigned: e.target.value })}
      >
        <option>ALL</option>
        <option>ASSIGNED</option>
        <option>UNASSIGNED</option>
      </Form.Select>
    </Form.Group>
  </Card>
);

export default FilterSidebar;
