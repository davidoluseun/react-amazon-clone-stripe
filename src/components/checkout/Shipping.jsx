import React from "react";
import Form from "../common/Form";
import ShippingDetail from "./ShippingDetail";
import ShippingForm from "./ShippingForm";
import Payment from "./Payment";
import { auth, db } from "../../firebase";

export class Shipping extends Form {
  state = {
    data: {
      name: "",
      email: "",
      address: "",
      zipcode: "",
      city: "",
      state: "",
      country: "",
      phonenumber: "",
    },
    errors: {},
    isSubmitted: false,
    isSubscribed: true,
  };

  async componentDidMount() {
    if (this.state.isSubscribed) {
      try {
        const querySnapshot = await db
          .collection("users")
          .doc(auth.currentUser?.uid)
          .collection("orders")
          .get();

        const docsLength = querySnapshot.docs.length;

        if (docsLength) {
          const docRef = db.collection("users").doc(auth.currentUser.uid);
          const doc = await docRef.get();
          const data = doc.data();

          this.setState({ data, isSubmitted: true });
        } else {
          const data = { ...this.state.data };

          const docRef = db.collection("users").doc(auth.currentUser.uid);
          const doc = await docRef.get();

          data.name = doc.data().name;
          data.email = doc.data().email;

          this.setState({ data });
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }

  componentWillUnmount() {
    this.setState({
      isSubscribed: false,
    });
  }

  doSubmit = async () => {
    try {
      await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .update({ ...this.state.data });

      this.setState({ isSubmitted: true });
    } catch (e) {
      console.log(e.message);
    }
  };

  handleClick = () => {
    this.setState({ isSubmitted: false });
  };

  render() {
    const { isSubmitted, data } = this.state;

    return (
      <section className="shipping">
        {isSubmitted ? (
          <ShippingDetail data={data} handleClick={this.handleClick} />
        ) : (
          <ShippingForm
            renderFormTitle={this.renderFormTitle}
            renderInput={this.renderInput}
            renderCountrySelect={this.renderCountrySelect}
            renderSubmitBotton={this.renderSubmitBotton}
            handleSubmit={this.handleSubmit}
          />
        )}

        {isSubmitted && <Payment />}
      </section>
    );
  }
}

export default Shipping;
