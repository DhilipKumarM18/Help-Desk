import React from "react";
import { Card, Form } from "react-bootstrap";

const statuses = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const priorities = ["ALL", "HIGH", "MEDIUM", "LOW"];
const assignedOptions = ["ALL", "ASSIGNED", "UNASSIGNED"];

const FilterSidebar = ({ filters, setFilters, onFilter }) => {
  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilter(updated);
  };

  return (
    <Card className="p-3 shadow-sm border">
      <h5 className="mb-3">Filter</h5>

      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Priority</Form.Label>
        <Form.Select
          value={filters.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Assignment</Form.Label>
        <Form.Select
          value={filters.assigned}
          onChange={(e) => handleChange("assigned", e.target.value)}
        >
          {assignedOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Card>
  );
};

export default FilterSidebar;
