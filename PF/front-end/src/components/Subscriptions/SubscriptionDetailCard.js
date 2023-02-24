import Card from "react-bootstrap/Card";
import styles from "./SubscriptionDetailCard.module.css";
import Button from "react-bootstrap/Button";

function SubscriptionDetailCard({
  subscription_name,
  future_payment_date,
  amount,
  plan_expiry_date,
  unsubscribe,
}) {
  var sliced_date = "";
  var statement = "";
  if (future_payment_date != null) {
    sliced_date = future_payment_date.slice(0, 10);
    statement = `Your next payment date is: <b>${sliced_date}</b>.`;
  } else {
    sliced_date = "Not Planned";
  }
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title class="text-capitalize h4">
          Your current plan is: <b>{subscription_name}</b>.
        </Card.Title>
        <Card.Subtitle class="text-capitalize h4">
          The price you are paying is: <b>${amount}</b>.
        </Card.Subtitle>
        <Card.Subtitle class="text-capitalize h4">
          Your next payment date is: <b>{sliced_date}</b>.
        </Card.Subtitle>

        {future_payment_date ? (
          <>
            <Button variant="danger" onClick={() => unsubscribe()}>
              Click me to Unsubscribe
            </Button>
          </>
        ) : (
          <> </>
        )}
      </Card.Body>
    </Card>
  );
}

export default SubscriptionDetailCard;
