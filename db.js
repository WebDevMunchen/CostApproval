const mongoose = require("mongoose");

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((error) => {
    console.log(error);
  });
