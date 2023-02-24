import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import styles from "./ClassCard.module.css";

function ClassCard({ name, description, coach, enrolled, date, startTime, endTime, enrolSet, enrolSession, btnSession, btnSet }) {
    return (
        <Card className={styles.card}>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Coach: {coach} Enrolled: {enrolled}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Date: {date} | Start Time: {startTime} | End Time: {endTime}</Card.Subtitle>
                <Card.Text>
                    Description: {description}
                </Card.Text>
                {localStorage.getItem('token') ? (
                    <>
                        <Button variant="danger" onClick={() => enrolSession()}>{btnSession}</Button>
                        <Button variant="danger" onClick={() => enrolSet()}>{btnSet}</Button>
                    </>
                ) : (<> </>)}

            </Card.Body>
        </Card>
    );
}

export default ClassCard;