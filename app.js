const express = require("express");
const request = require("request");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const paymentRoute = require("./routes/paymentRouter");
app.use("/paymob", paymentRoute);
setInterval(function () {
  request.get(
    "http://localhost:3000/paymob",
    {
      headers: { "Content-Type": "application/json" },
    },
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response.body);
      }
    },
  );
}, 300000);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
