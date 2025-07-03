import { Card, Col, Row, Badge } from "react-bootstrap";

const StatsPanel = ({ tickets = [] }) => {
  const totals = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "OPEN").length,
    inProg: tickets.filter(t => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter(t => t.status === "RESOLVED").length,
    unassigned: tickets.filter(t => !t.assignedTo).length,
  };

  const colorMap = {
    open: "warning",
    inProg: "info",
    resolved: "success",
    unassigned: "secondary"
  };

  return (
    <Row className="mb-4">
      <Col>
        <Card bg="light" className="p-2 shadow-sm border border-primary">
          <Card.Body>
            <h5>Total</h5>
            <h3>{totals.total}</h3>
          </Card.Body>
        </Card>
      </Col>
      {["open", "inProg", "resolved", "unassigned"].map((key) => (
        <Col key={key}>
          <Card className="p-2 shadow-sm border border-secondary">
            <Card.Body>
              <h5><Badge bg={colorMap[key]}>{key.replace(/([A-Z])/g, ' $1')}</Badge></h5>
              <h3>{totals[key]}</h3>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsPanel;
