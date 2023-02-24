import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Studios from "./pages/Studios";
import Classes from "./pages/Classes";
import Subscriptions from "./pages/Subscriptions";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import User from "./pages/User";
import PaymentForm from "./pages/Payment";
import UpdatePaymentForm from "./pages/UpdatePayment";
import SubscriptionEdit from "./pages/SubscriptionEdit";
import PaymentHistory from "./pages/PaymentHistory";
import UserSchedule from "./pages/UserSchedule";
import StudioDetail from "./pages/StudioDetail";

function App() {

  return (
    <>
      <Router>
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studios" element={<Studios />} />
          <Route path="/studios/:id/" element={<StudioDetail />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/updatepayment" element={<UpdatePaymentForm />} />
          <Route path="/editsubscription" element={<SubscriptionEdit />} />
          <Route path="/paymenthistory" element={<PaymentHistory />} />
          <Route path="/userschedule" element={<UserSchedule />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<User />} />
        </Routes>
        {/* <Route path="/login" element={currentForm === 'login' ? <Login onFormSwitch={toggleForm} userLogin={userLogin} /> : <Register onFormSwitch={toggleForm} />} /> */}
      </Router>
    </>
  );
}

export default App;
