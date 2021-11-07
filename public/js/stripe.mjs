/* eslint-disable */
import { showAlert, hideAlert } from './alerts.mjs';
const stripe = Stripe(
  'pk_test_51JkCNOSCsYpDEKNnU0bQ3OtGQ51n6o1sqnifCo6b1cdjwRFcJ7kyYDYg9ZdpxI376y7U2tenj3qZ7vYY9GcoJZ3T00whnbtNTF'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from the API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) create checkout form + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch {
    console.log(err);
    showAlert('error', err);
  }
};
