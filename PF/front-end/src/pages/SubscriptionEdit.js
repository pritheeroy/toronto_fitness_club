import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import React, { useState, useEffect } from "react";
import Popup from "../components/Popup";
import SubscriptionCard from "../components/Subscriptions/SubscriptionCard";
import SubscriptionDetailCard from "../components/Subscriptions/SubscriptionDetailCard";
import { useNavigate } from "react-router-dom";
import ChangePage from "../components/ClassList/ChangePage";

function SubscriptionEdit({ token }) {
  const [detail, setDetail] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const [updated, setUpdated] = useState([]);
  const [cancel, setCancel] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/subscriptions/user/details/", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) =>
        response.json().then((json) => {
          setDetail(json);
        })
      )
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (isClicked) {
      fetch("http://127.0.0.1:8000/subscriptions/user/cancel/", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) =>
          response.json().then((json) => setCancel(json.results))
        )
        .catch((error) => console.log(error));
      window.location.reload();
    }
  }, [isClicked]);

  const [nextCall, setNextCall] = useState(
    "http://127.0.0.1:8000/subscriptions/all/"
  );
  const [prevCall, setPrevCall] = useState(
    "http://127.0.0.1:8000/subscriptions/all/"
  );
  const [currCall, setCurrCall] = useState(
    "http://127.0.0.1:8000/subscriptions/all/"
  );

  useEffect(() => {
    changePage(currCall);
  }, []);

  const changePage = (call) => {
    fetch(call, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) =>
        response.json().then((json) => {
          setSubscriptions(json.results);
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
  //   fetch("http://127.0.0.1:8000/subscriptions/all/", {
  //     method: "GET",
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //   })
  //     .then((response) =>
  //       response.json().then((json) => setSubscriptions(json.results))
  //     )
  //     .catch((error) => console.log(error));
  // }, []);

  let navigate = useNavigate();

  const subscribePlan = (plan_name) => {
    const new_plan = { plan: `${plan_name}` };
    fetch("http://127.0.0.1:8000/subscriptions/user/update/", {
      method: "PUT",
      body: JSON.stringify(new_plan),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) =>
        response.json().then((json) => setUpdated(json.results))
      )
      .catch((error) => console.log(error));
    window.location.reload();
    navigate("/editsubscription");
  };

  const unsub = () => {
    setIsClicked(true);
  };
  return (
    <>
      <h1>Your Subscription Details</h1>
      <>
        <SubscriptionDetailCard
          // plan_name, plan_period, price, description
          subscription_name={detail.subscription_name}
          future_payment_date={detail.future_payment_date}
          amount={detail.amount}
          unsubscribe={unsub}
        />
      </>

      <ChangePage prev={prevPage} title="Edit Subscription" next={nextPage} />
      {subscriptions.map((subscription) => {
        return (
          <>
            <SubscriptionCard
              // plan_name, plan_period, price, description
              plan_name={subscription.plan_name}
              description={subscription.description}
              plan_period={subscription.plan_period}
              price={subscription.price}
              subscribe_plan={() => subscribePlan(subscription.plan_name)}
            />
          </>
        );
      })}
    </>
  );
}

export default SubscriptionEdit;
