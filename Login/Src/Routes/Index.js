const express = require("express");
const router = express.Router();
const passport = require("passport");
const Food = require("../Models/food");
var isAuth = false;

router.get("/", async (req, res, next) => {
  const foods = await Food.find();
  res.render("index", { foods });
});

router.get("/signup", (req, res, next) => {
  //if (isAuth) {
  //res.redirect("/");
  //} else {
  res.render("signup");
  //}
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    passReqToCallback: true,
  })
);

router.get("/signin", (req, res, next) => {
  //if (isAuth) {
  //res.redirect("/");
  //} else {
  res.render("signin");
  //}
});

router.post(
  "/signin",
  passport.authenticate("local-signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    passReqToCallback: false,
  })
);

router.post("/webhooks", async (req, res, next) => {
  console.log(req.body);
  if (req.body.action == "Add_Food") {
    const food = new Food();

    food.imageURL = req.body.product_imageURL;
    food.title = req.body.product_title;
    food.price = req.body.product_price;
    food.description = req.body.product_description;

    await food.save();
  }

  res.send({ message: "COMPLETE!", ...req.body });
});

router.get("/logout", isAuthenticated, (req, res, next) => {
  //isAuth = false;
  req.logout();
  res.redirect("/signin");
});

router.get("/newAdmin", isAuthenticated, (req, res, next) => {
  if (req.user.accountType == "Admin") {
    res.render("newAdmin");
  } else {
    res.redirect("/");
  }
});

router.get("/profile", isAuthenticated, (req, res, next) => {
  res.render("profile");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    //isAuth = true;
    return next();
  }
  res.redirect("/");
}

module.exports = router;
