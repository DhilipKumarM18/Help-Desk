import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";

const Admin_Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'AGENT',
  });
  const [pass,setPass] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(form.role == 'AGENT' && pass == 'HELPDESK')
      {
        const response = await axios.post("http://localhost:8080/api/auth/register", form);
      alert("Registration successful. Please login.");
      navigate("/login");
      console.log(response)
      }
      else
      {
        alert("Invalid Passkey")
      }
      
      
    } catch (err) {
      console.error(err);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h3 className="text-center mb-4 text-success">HelpDesk Pro Register</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    name="name"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.role}
                    disabled
                  />
                </Form.Group>
               
               {form.role == 'AGENT' && 
                <Form.Group className="mb-3">
                  <Form.Label>PassKey For Agent</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="PassKey"
                    onChange={(e)=>setPass(e.target.value)}
                    required
                  />
                </Form.Group>
               }
                

                <div className="d-grid gap-2">
                  <Button variant="success" type="submit">Register</Button>
                </div>

                <p className="text-center mt-3">
                  Already have an account? <a href="/login" style={{textDecoration:'none'}}>Login</a>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin_Register;
