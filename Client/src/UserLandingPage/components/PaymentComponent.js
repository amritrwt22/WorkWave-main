import "./App.css";
import axios from "axios";
import React, { useState } from "react";

function Payment() {
  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    email: "",
  });
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createRazorpayOrder = () => {
    const amount = formData.amount;

    if (!amount) {
      alert("Please enter a valid amount");
      return;
    }

    const data = JSON.stringify({
      amount: amount * 100,
      currency: "INR",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3002/orders",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        handleRazorpayScreen(response.data.amount);
      })
      .catch((error) => {
        console.log("Error at createRazorpayOrder:", error);
      });
  };

  const handleRazorpayScreen = async (amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "API KEY",
      amount: amount,
      currency: "INR",
      name: formData.name || "Anonymous",
      description: "Test Transaction",
      image: "https://papayacoders.com/demo.png",
      handler: function (response) {
        setResponseId(response.razorpay_payment_id);
      },
      prefill: {
        name: formData.name || "Anonymous",
        email: formData.email || "test@example.com",
      },
      theme: {
        color: "#F4C430",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  return (
    <div className="App">
      <h1>Dynamic Payment Form</h1>
      <form>
        <div>
          <label>Amount: </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </div>
        <button type="button" onClick={createRazorpayOrder}>
          Pay Now
        </button>
      </form>

      {responseId && <p>Payment ID: {responseId}</p>}

      <h1>Payment Verification</h1>
      <form onSubmit={paymentFetch}>
        <input type="text" name="paymentId" placeholder="Enter Payment ID" />
        <button type="submit">Fetch Payment</button>
        {responseState.length !== 0 && (
          <ul>
            <li>Amount: {responseState.amount / 100} Rs.</li>
            <li>Currency: {responseState.currency}</li>
            <li>Status: {responseState.status}</li>
            <li>Method: {responseState.method}</li>
          </ul>
        )}
      </form>
    </div>
  );
}

export default Payment;
