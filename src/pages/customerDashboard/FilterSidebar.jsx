import { Card, Form } from "react-bootstrap";

const FilterSidebar = ({ tickets, setTickets }) => {
  const handleChange = (e) => {
    const val = e.target.value;
    const filtered = val === "ALL" ? tickets : tickets.filter(t => t.status === val);
    setTickets(filtered);
  };

  return (
    <Card className="p-3 mb-3 shadow-sm border">
      <h5>Filter</h5>
      <Form.Select onChange={handleChange}>
        <option value="ALL">All</option>
        <option value="OPEN">Open</option>
        <option value="RESOLVED">Resolved</option>
      </Form.Select>
    </Card>
  );
};

export default FilterSidebar;
