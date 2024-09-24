require("dotenv/config");
require("./db.js");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler.js");
const userRouter = require("./routes/user-route.js");
const costApprovalRoute = require("./routes/costApproval-route.js");
const budgetRoute = require("./routes/budget-route.js");
const budgetKennzahlenRoute = require("./routes/budgetKennzahlen-route.js");
const kennzahlenRoute = require("./routes/kennzahlen-route.js");
const port = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/user", userRouter);
app.use("/costApproval", costApprovalRoute);
app.use("/budget", budgetRoute);
app.use("/budgetKennzahlen", budgetKennzahlenRoute);
app.use("/kennzahlen", kennzahlenRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
