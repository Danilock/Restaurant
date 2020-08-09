const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_y1Dp3Ug31yFyA5k97drzZlqd008lyWNzot");
const Food = require("../Models/food");
const Transactions = require("../Models/transactions");
const User = require("../Models/user");

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const shopElement = await Food.findById(id);
  trs = new Transactions();

  const customer = await stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
  });
  const charge = await stripe.charges.create({
    amount: shopElement.price * 100,
    currency: "usd",
    description: "example-charge",
    customer: customer.id,
  });

  trs.dish = shopElement.title;
  trs.amount = shopElement.price;
  trs.user = req.user.name;
  trs.email = req.user.email;
  trs.status = true;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  trs.date = today;
  await trs.save();

  res.redirect("/");
});

//Food id
router.get("/fiao/:id", async (req, res) => {
  const { id } = req.params;
  const food = await Food.findById(id);
  res.render("fiao", {
    food,
  });
});

router.post("/fiao/:id", async (req, res) => {
  const { id } = req.params;
  const shopElement = await Food.findById(id);
  trs = new Transactions();

  trs.imageURL = shopElement.imageURL;
  trs.dish = shopElement.title;
  trs.amount = shopElement.price;
  trs.user = req.user.name;
  trs.email = req.user.email;
  trs.status = false;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  trs.date = today;

  var actualDebt = parseInt(req.user.debt);
  var sum = parseInt(trs.amount) + actualDebt;

  const newDebt = await User.update(
    { email: req.user.email },
    { $set: { debt: sum } }
  );

  await trs.save();

  res.redirect("/");
});

router.post("/payDebt/:id", async (req, res) => {
  const { id } = req.params;
  const shopElement = await Transactions.findById(id);

  const customer = await stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
  });
  const charge = await stripe.charges.create({
    amount: shopElement.amount * 100,
    currency: "usd",
    description: "example-charge",
    customer: customer.id,
  });

  var actualDebt = parseInt(req.user.debt);
  var rest = actualDebt - parseInt(shopElement.amount);

  await Transactions.update({ _id: id }, { status: true });
  await User.update({ email: req.user.email }, { $set: { debt: rest } });

  res.redirect("/");
});

router.get("/tax", async (req, res) => {
  const transactions = await Transactions.find();
  res.render("tax", {
    transactions,
  });
});

module.exports = router;
