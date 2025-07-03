import { Card, Col, Row, Badge } from "react-bootstrap";

const StatsPanel = ({ tickets = [] }) => {
  const validTickets = Array.isArray(tickets) ? tickets : [];

  const totals = {
    total: validTickets.length,
    open: validTickets.filter(t => t.status === "OPEN").length,
    inProg: validTickets.filter(t => t.status === "IN_PROGRESS").length,
    resolved: validTickets.filter(t => t.status === "RESOLVED").length,
    unassigned: validTickets.filter(t => !t.assignedTo).length,
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
        <Card bg="light" className="p-2 shadow">
          <Card.Body>
            <h5>Total</h5>
            <h3>{totals.total}</h3>
          </Card.Body>
        </Card>
      </Col>
      {["open", "inProg", "resolved", "unassigned"].map((key) => (
        <Col key={key}>
          <Card className="p-2 shadow">
            <Card.Body>
              <h5>
                <Badge bg={colorMap[key]}>
                  {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </Badge>
              </h5>
              <h3>{totals[key]}</h3>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsPanel;
