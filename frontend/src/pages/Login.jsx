import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email,
      password,
    });

    const user = response.data;
    login(user);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("Logged-in user:", user);
        console.log(atob(user.token.split('.')[1]))
    if (user.role == 'AGENT') {
      navigate("/agent");
    } else if(user.role == 'CUSTOMER') {
      navigate("/customer");
    }
  } catch (err) {
    console.error(err);
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
                  Don't have an account? <a href="/register" style={{textDecoration:'none'}}>Register</a>
                </p>
              </Form>
            </Card.Body>
            <center>
            <Card.Footer>
              <h6>Agent Registration : <a href="/ad_register" style={{textDecoration:'none'}}>Admin_Register</a> </h6>
            </Card.Footer>
            </center>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
