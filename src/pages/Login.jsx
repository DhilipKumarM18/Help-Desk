import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/users.json");
    const users = await res.json();
    const matched = users.find(
      (u) => u.email === email && u.password === password
    );

    if (matched) {
      login(matched);
      localStorage.setItem("user", JSON.stringify(matched));
      if (matched.role === "CUSTOMER") navigate("/customer");
      else if (matched.role === "AGENT") navigate("/agent");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h3 className="text-center mb-4 text-primary">HelpDesk Pro Login</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit">Login</Button>
                </div>

                <p className="text-center mt-3">
                  Don't have an account? <a href="/register">Register</a>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
