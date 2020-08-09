const mongoose = require("mongoose");
const { mongodb } = require("./Keys");

mongoose
  .connect(mongodb.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(db => {
    console.log("Database Connected!");
  });
