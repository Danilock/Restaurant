const express = require("express");
const router = express.Router();
const Food = require("../Models/food");

router.get("/", isAuthenticated, (req, res, next) => {
  res.render("addFood");
});

router.post("/addFood", isAuthenticated, async (req, res) => {
  const food = new Food();

  food.imageURL = req.body.imageURL;
  food.title = req.body.foodTitle;
  food.description = req.body.foodDescription;
  food.price = req.body.foodPrice;

  await food.save();
  res.redirect("/");
});

router.post("/rotocton", async (req, res) => {
  const food = new Food();

  food.imageURL = req.body.product_imageURL;
  food.title = req.body.product_title;
  food.price = req.body.product_price;
  food.description = req.body.product_description;

  await food.save();
  res.send({ message: "COMPLETE!", ...req.body });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
