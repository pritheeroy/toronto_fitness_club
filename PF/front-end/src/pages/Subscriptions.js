import React, { useState, useEffect } from "react";
import SubscriptionCard from "../components/Subscriptions/SubscriptionCard";
import { useNavigate } from "react-router-dom";
import ChangePage from "../components/ClassList/ChangePage";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

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
  // const refresh = () => {
  //   setpopUpShow(false);
  //   changePage(currCall);
  // };

  let navigate = useNavigate();
  const subscribePlan = (plan_name) => {
    let path = "/payment";
    navigate(path, {
      state: {
        plan_name: plan_name,
      },
    });
  };

  return (
    <>
      <ChangePage prev={prevPage} title="Subscription" next={nextPage} />
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
export default Subscriptions;
