const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const paymentRoute  = require("./routes/paymentRouter");
app.use("/paymob", paymentRoute);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
