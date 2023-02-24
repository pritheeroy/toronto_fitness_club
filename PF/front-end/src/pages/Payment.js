import { Button, Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function PaymentForm({ token }) {
  const [cardNumber, setCardNumber] = useState(null);
  const [securityCode, setSecurityCode] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [name, setName] = useState(null);
  const [response, setResponse] = useState(null);

  const payment_details = {
    payment_card_number: `${cardNumber}`,
    payment_security_code: `${securityCode}`,
    payment_exp_date: `${expiryDate}`,
    payment_name: `${name}`,
  };
  const location = useLocation();
  let navigate = useNavigate();

  const goBack = () => {
    let path = "/subscriptions";
    navigate(path);
  };
  const goHome = () => {
    let path = "/paymenthistory";
    navigate(path);
  };

  const handleSubmit = (e) => {
    fetch(
      `http://localhost:8000/subscriptions/${location.state.plan_name}/subscribe/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payment_details),
      }
    )
      .then((data) => data.json())
      .then((data) => {
        setResponse(data);
      });
    e.preventDefault();
    goHome();
  };

  return (
    <>
      <br />
      <Card style={{ width: "90%", margin: "auto" }}>
        <Card.Body>
          <Card.Title>
            Your selected plan is {location.state.plan_name}
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cardholder Name"
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                inputmode="numeric"
                pattern="[0-9\s]{13,19}"
                autocomplete="cc-number"
                maxlength="19"
                placeholder="xxxx xxxx xxxx xxxx"
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Card Security Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Code"
                onChange={(e) => setSecurityCode(e.target.value)}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Card Expiration Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="MM/YY"
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </Form.Group>
            <Button variant="danger" onClick={goBack}>
              Back
            </Button>
            <Button
              variant="primary"
              type="submit"
              onSubmit={handleSubmit}
              style={{ float: "right" }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default PaymentForm;
