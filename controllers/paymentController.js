const request = require("request");
const open = require("open");

const ifameOne = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=`;
const API_KEY = process.env.PAYMOB_API_KEY; // put your api key here
const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;

const paymentAll = async (req, res) => {
  try {
    const items = req.body.items;

    // First request to get token
    const tokenResponse = await createToken();
    const authToken = tokenResponse.token;

    // Second request to make order
    const orderResponse = await createOrder(authToken, items);
    // console.log(orderResponse);

    const orderId = orderResponse.id;

    // Third request to get form link
    const paymentKeyResponse = await createPaymentKey(authToken, orderId);
    // console.log(paymentKeyResponse);
    const paymentToken = paymentKeyResponse.token;

    // Open the browser with the form link
    open(ifameOne + paymentToken);

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

function createOrder(authToken, items) {
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
          items: items,
          shipping_data: {
            apartment: "803",
            email: "claudette09@exa.com",
            floor: "42",
            first_name: "Clifford",
            street: "Ethan Land",
            building: "8028",
            phone_number: "+86(8)9135210487",
            postal_code: "01898",
            extra_description: "8 Ram , 128 Giga",
            city: "Jaskolskiburgh",
            country: "CR",
            last_name: "Nicolas",
            state: "Utah",
          },
          shipping_details: {
            notes: " test",
            number_of_packages: 1,
            weight: 1,
            weight_unit: "Kilogram",
            length: 1,
            width: 1,
            height: 1,
            contents: "product of some sorts",
          },
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
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            apartment: "803",
            email: "claudette09@exa.com",
            floor: "42",
            first_name: "Clifford",
            street: "Ethan Land",
            building: "8028",
            phone_number: "+86(8)9135210487",
            shipping_method: "PKG",
            postal_code: "01898",
            city: "Jaskolskiburgh",
            country: "CR",
            last_name: "Nicolas",
            state: "Utah",
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
      payload,
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};
const webhookResponse = (req, res) => {
  res.json({ message: "Transaction response webhook received successfully" });
};
module.exports = { paymentAll,  webhookProcessed, webhookResponse };
