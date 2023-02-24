import Card from "react-bootstrap/Card";
import styles from "./SubscriptionCard.module.css";
import Button from "react-bootstrap/Button";

function SubscriptionCard({
  plan_name,
  plan_period,
  price,
  description,
  subscribe_plan,
}) {
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title class="text-capitalize h4">
          <b>{plan_name}</b>
        </Card.Title>
        <Card.Text>
          <b>Price:</b> ${price}
        </Card.Text>
        <Card.Text class="text-capitalize">
          <b>Plan Term:</b> {plan_period}
        </Card.Text>
        <Card.Text>
          <b> Description:</b> {description}
        </Card.Text>
        <Button variant="danger" onClick={() => subscribe_plan(plan_name)}>
          Subscribe
        </Button>
      </Card.Body>
    </Card>
  );
}

export default SubscriptionCard;
