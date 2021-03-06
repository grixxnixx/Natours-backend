/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  `pk_test_51It78nFoM1eA12uzYXOlSqP3dJtOKyJDHk4vNbkcyOzwmfowWCoUJQ8lpLn0AxGEppBPx6BqFcoKjFFj89TsD7Tb00jtHsczxR`
);

export const booktour = async tourId => {
  try {
    // get session from the API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // craete session + charge card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
