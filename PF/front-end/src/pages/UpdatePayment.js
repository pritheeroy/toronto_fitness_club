import { Button, Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, { useState, useEffect } from "react";
import PaymentCard from "../components/Subscriptions/PaymentCard";
import { useNavigate } from "react-router-dom";

function UpdatePaymentForm({ token }) {
  const [payments, setPayments] = useState([]);

  const [cardNumber, setCardNumber] = useState(null);
  const [securityCode, setSecurityCode] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [name, setName] = useState(null);
  const [response, setResponse] = useState(null);

  let navigate = useNavigate();

  const payment_details = {
    payment_card_number: `${cardNumber}`,
    payment_security_code: `${securityCode}`,
    payment_exp_date: `${expiryDate}`,
    payment_name: `${name}`,
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/subscriptions/payment/view/", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) =>
        // response.json().then((json) => setPayments(json.results))
        response.json().then((json) => setPayments([json]))
      )
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (e) => {
    fetch("http://127.0.0.1:8000/subscriptions/payment/update/", {
      method: "PUT",
      body: JSON.stringify(payment_details),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) =>
        // response.json().then((json) => setPayments(json.results))
        response.json().then((json) => setPayments(payment_details))
      )
      .catch((error) => console.log(error));

    navigate("/updatepayment");
  };

  const goBack = () => {
    let path = "/subscriptions";
    navigate(path);
  };

  return (
    <>
      <h1>Current Card</h1>
      {payments.map((payment) => {
        return (
          <>
            <PaymentCard
              // payment_name, payment_card_number
              payment_name={payment.payment_name}
              payment_card_number={payment.payment_card_number}
            />
          </>
        );
      })}
      <h1>Update Card</h1>
      <Card style={{ width: "90%", margin: "auto" }}>
        <Card.Body>
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
              Update Card
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {/* <h1>Update Card</h1> */}
    </>
  );
}

export default UpdatePaymentForm;
