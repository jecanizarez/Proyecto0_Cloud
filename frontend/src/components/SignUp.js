import React,{useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {post_register} from '../services/User';
import { useHistory } from "react-router-dom";
import '../css/LoginCss.css'

export default function SignUp(){
    const history = useHistory();
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);

    function validateForm() {
      return email.length > 0 && password.length > 0;
    }
  
    async function handleSubmit(event) {
      event.preventDefault();
      let data = {"email": email, "password":password}; 
      await post_register(data);
      history.push("/");
    }
    return(
        <div className="Login justify-content-center center text-center col-4">
        <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Register
        </Button>
      </Form>
    </div>
    )
}