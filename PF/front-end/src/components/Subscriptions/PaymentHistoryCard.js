import Card from "react-bootstrap/Card";
import styles from "./PaymentHistoryCard.module.css";

function PaymentHistoryCard({
  plan,
  amount,
  payment_card_number,
  payment_name,
  payment_date,
  future_payment_date,
}) {
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title>Payment Date: {payment_date.slice(0, 10)}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Plan: {plan}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Amount: ${amount}
        </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Cardholder Name: {payment_name}
        </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Card ending in •••• {payment_card_number.slice(-4)}
        </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Next Payment: {future_payment_date.slice(0, 10)}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}

export default PaymentHistoryCard;
