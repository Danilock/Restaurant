const express = require("express");
const app = express();
const engine = require("ejs-mate");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const Passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

//Initializations
require("./Databases");
require("./Passport/local-auth");

//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "myname",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(bodyParser.json());
app.use(Passport.initialize());
app.use(Passport.session());

app.use((req, res, next) => {
  app.locals.signupMessage = req.flash("signupMessage");
  app.locals.signinMessage = req.flash("signinMessage");
  app.locals.user = req.user;
  next();
});

//Routes
app.use("/", require("./Routes/Index"));
app.use("/food", require("./Routes/food"));
app.use("/checkout", require("./Routes/pay"));
app.use("/transactions", require("./Routes/transactions"));

//Settings
app.set("views", path.join(__dirname, "views")); //Buscando la ruta de las vistas
app.engine("ejs", engine);
app.set("view engine", "ejs"); //Definiendo ejs como motor de platillas
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log("Listen to Port:" + app.get("port"));
});
