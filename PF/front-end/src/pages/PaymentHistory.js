import React, { useState, useEffect } from "react";
import PaymentHistoryCard from "../components/Subscriptions/PaymentHistoryCard";
import ChangePage from "../components/ClassList/ChangePage";
// import { useNavigate } from "react-router-dom";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  const [nextCall, setNextCall] = useState(
    "http://127.0.0.1:8000/subscriptions/payment/history/"
  );
  const [prevCall, setPrevCall] = useState(
    "http://127.0.0.1:8000/subscriptions/payment/history/"
  );
  const [currCall, setCurrCall] = useState(
    "http://127.0.0.1:8000/subscriptions/payment/history/"
  );

  useEffect(() => {
    changePage(currCall);
  }, []);

  const changePage = (call) => {
    // console.log(localStorage.getItem("token"));
    fetch(call, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) =>
        response.json().then((json) => {
          setPayments(json.results);
          setCurrCall(call);
          setPrevCall(json.previous);
          setNextCall(json.next);
        })
      )
      .catch((error) => console.log(error));
  };
  const nextPage = () => {
    if (nextCall != null) {
      changePage(nextCall);
    }
  };
  const prevPage = () => {
    if (prevCall != null) {
      changePage(prevCall);
    }
  };

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/subscriptions/payment/history/", {
  //     method: "GET",
  //     headers: {
  //       "Content-type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   })
  //     .then((response) =>
  //       response.json().then((json) => setPayments(json.results))
  //     )
  //     .catch((error) => console.log(error));
  // }, []);

  return (
    <>
      <ChangePage prev={prevPage} title="Payment History" next={nextPage} />

      {payments.map((payment) => {
        return (
          <>
            <PaymentHistoryCard
              plan={payment.plan}
              amount={payment.amount}
              payment_card_number={payment.payment_card_number}
              payment_name={payment.payment_name}
              payment_date={payment.payment_date}
              future_payment_date={payment.future_payment_date}
            />
          </>
        );
      })}
    </>
  );
}
export default PaymentHistory;
