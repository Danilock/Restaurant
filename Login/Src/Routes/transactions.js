const express = require("express");
const router = express.Router();
const Transactions = require("../Models/transactions");

router.get("/", async (req, res) => {
  const transactions = await Transactions.find();
  res.render("transactions", { transactions });
});

router.get("/my", async (req, res) => {
  const purchases = await Transactions.find({ email: req.user.email });
  res.render("myPurchases", { purchases });
});

module.exports = router;
