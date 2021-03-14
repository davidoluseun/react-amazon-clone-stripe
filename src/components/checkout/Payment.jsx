import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import useStateValue from "../../hooks/useStateValue";
import getCartTotal from "../../utils/getCartTotal";
import { db } from "../../firebase";
import http from "../../services/httpService";
import "../../styles/checkout/payment.css";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();

  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [{ cart, user }, dispatch] = useStateValue();

  useEffect(() => {
    let isSubscribed = true;

    const getClientSecret = async () => {

      const response = await http.post(
        `/payments/create?total=${Math.round(getCartTotal(cart) * 100)}`
      );

      setClientSecret(response.data.clientSecret);
    };

    if (isSubscribed) getClientSecret();

    return () => (isSubscribed = false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);

      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      db.collection("users")
        .doc(user?.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          cart,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
          orderId: paymentIntent.id,
        });

      setProcessing(false);
      dispatch({ type: "EMPTY_CART" });
      history.replace("/orders");
    } catch (e) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleChange = (e) => {
    if (e.complete === true) {
      setDisabled(false);
      setError("");
    }
    if (e.error) {
      setDisabled(true);
      setError(e.error.message);
    }
  };

  return (
    <form className="payment" onSubmit={handleSubmit}>
      <CurrencyFormat
        renderText={(value) => <h3>Order Total: {value}</h3>}
        decimalScale={2}
        value={getCartTotal(cart)}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
      <CardElement onChange={handleChange} />
      {error && <div className="invalid-feedback">{error}</div>}

      <button className="btn-primary" disabled={disabled || processing}>
        {processing ? "Processing" : "Buy Now"}
      </button>
    </form>
  );
};

export default Payment;
