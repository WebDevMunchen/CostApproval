require("dotenv/config");
require("./db.js");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler.js");
const userRouter = require("./routes/user-route.js");
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/user", userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
