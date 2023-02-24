import Button from 'react-bootstrap/Button';
import styles from "./ChangePage.module.css";

function ChangePage({ prev, title, next }) {
    return (
        <>
            {/* <Button variant="primary" className={styles.btn}>&lt;</Button>{' '}
            <Button variant="primary" className={styles.btn}>&gt;</Button>{' '} */}
            <div className={styles.changePage}>
                <Button className={styles.btn} variant="secondary" onClick={prev}>{'\u2190'}</Button>
                <h1 style={{ padding: 0, color: "white" }}><b>{title}</b></h1>
                <Button className={styles.btn} variant="secondary" onClick={next}>{'\u2192'}</Button>
            </div>
        </>
    );
}


export default ChangePage;