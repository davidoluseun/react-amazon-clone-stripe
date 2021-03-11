import React from "react";
import { useHistory } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import getCartTotal from "../../utils/getCartTotal";
import useStateValue from "../../hooks/useStateValue";
import "../../styles/cart/subtotal.css";

const Subtotal = () => {
  const history = useHistory();
  const [{ cart, user }] = useStateValue();

  const handleProceedToCheckout = () => {
    if (user) history.push("/checkout");
    else history.push("/sign-in");
  };

  return (
    <div className="subtotal">
      <div className="subtotal-title">
        <CurrencyFormat
          renderText={(value) => (
            <>
              <div>
                Subtotal ({cart.length} items): <strong>{value}</strong>
              </div>
              <label className="subtotal-gift">
                <input type="checkbox" /> This order contains a gift
              </label>
            </>
          )}
          decimalScale={2}
          value={getCartTotal(cart)}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />
      </div>
      <button
        className="btn-primary subtotal-btn"
        onClick={handleProceedToCheckout}
      >
        Proceed to checkout
      </button>
    </div>
  );
};

export default Subtotal;
