const express = require("express");
const {
  paymentAll,
  webhookProcessed,
  webhookResponse,
} = require("../controllers/paymentController");
const router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));

router.post("/visa", paymentAll);
router.post("/webhook/processed", webhookProcessed);

router.get("/webhook/response", webhookResponse);
module.exports = router;
