const express = require("express");
const {
  createNewApproval,
  getUserApprovals,
  getSingleApproval,
  editApproval,
  deleteApproval,
} = require("../controllers/costApproval-controller");
const { authenticate } = require("../middlewares/authenticate");

const costApprovalRoute = express.Router();

costApprovalRoute
  .route("/createNewApproval")
  .post(authenticate, createNewApproval);

costApprovalRoute
  .route("/getUserApprovals")
  .get(authenticate, getUserApprovals);

costApprovalRoute
  .route("/:id")
  .get(authenticate, getSingleApproval)
  .put(authenticate, editApproval)
  .delete(authenticate, deleteApproval);

module.exports = costApprovalRoute;
