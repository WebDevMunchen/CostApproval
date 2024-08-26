const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { createNewApproval, getUserApprovals } = require("../controllers/costApproval-controller");

const costApprovalRoute = express.Router();

costApprovalRoute
  .route("/createNewApproval")
  .post(authenticate, createNewApproval);

  costApprovalRoute.route("/getUserApprovals").get(authenticate, getUserApprovals)

module.exports = costApprovalRoute;
