import Card from "react-bootstrap/Card";
import styles from "./PaymentCard.module.css";

function PaymentCard({ payment_name, payment_card_number }) {
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title>
          Card ending in •••• {payment_card_number.slice(-4)}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Cardholder Name: {payment_name}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}

export default PaymentCard;
