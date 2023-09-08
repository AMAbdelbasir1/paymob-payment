const request = require("request");
const open = require("open");

const ifameOne = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=`;
const API_KEY = process.env.PAYMOB_API_KEY; // put your api key here
const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;

const paymentAll = async (req, res) => {
  try {
    // First request to get token
    const tokenResponse = await createToken();
    const authToken = tokenResponse.token;

    // Second request to make order
    const orderResponse = await createOrder(authToken);

    // console.log(orderResponse);
    const orderId = orderResponse.id;

    // Third request to get form link
    const paymentKeyResponse = await createPaymentKey(authToken, orderId);
    // console.log(paymentKeyResponse);
    const paymentToken = paymentKeyResponse.token;

    // Open the browser with the form link
    // open(ifameOne + paymentToken);
    if (!paymentToken) {
      return res.status(400).json({ error: paymentKeyResponse });
    }
    // Return the form link in the response
    res.status(200).json({ url: ifameOne + paymentToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
function createToken() {
  return new Promise((resolve, reject) => {
    request.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: API_KEY }),
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(response.body));
        }
      },
    );
  });
}

function createOrder(authToken) {
  return new Promise((resolve, reject) => {
    request.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: "false",
          amount_cents: "100",
          currency: "EGP",
          // merchant_order_id: "21334",
          items: [],
          shipping_data: {
            email: "ahmed.abdelbasir140@gmail.com",
            first_name: "ahmed abdelbasir",
            last_name: "none",
            phone_number: "012345684",
          },
          user_id: "dfqfqfqq",
        }),
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(response.body));
        }
      },
    );
  });
}

function createPaymentKey(authToken, orderId) {
  return new Promise((resolve, reject) => {
    request.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: "100",
          expiration: 60,
          order_id: orderId,
          billing_data: {
            email: "claudette09@exa.com",
            first_name: "ahmed",
            phone_number: "0123456789",
            last_name: "abdelbasir",
            street: "NA",
            building: "NA",
            floor: "NA",
            apartment: "NA",
            city: "NA",
            country: "NA",
          },
          currency: "EGP",
          integration_id: INTEGRATION_ID,
          lock_order_when_paid: "false",
        }),
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(response.body));
        }
      },
    );
  });
}

const webhookProcessed = (req, res) => {
  try {
    const payload = req.body.obj;
    console.log(payload);
    res.json({
      message: "Transaction processed webhook received successfully",
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};
const webhookResponse = (req, res) => {
  res.json({ message: "Transaction response webhook received successfully" });
};
module.exports = { paymentAll, webhookProcessed, webhookResponse };
