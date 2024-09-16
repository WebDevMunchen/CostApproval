const express = require("express");
const {
  createNewApproval,
  getUserApprovals,
  getSingleApproval,
  editApproval,
  deleteApproval,
  getAllApprovals,
  approveInquiry,
  declineInquiry,
  declineLiquidity,
  approveLiqudity,
  getAllLiquidityApprovals,
  setPending,
  postponeInquiry,
  setLiquidityPending,
  updateInquiry,
} = require("../controllers/costApproval-controller");
const { authenticate } = require("../middlewares/authenticate");

const costApprovalRoute = express.Router();

costApprovalRoute
  .route("/createNewApproval")
  .post(authenticate, createNewApproval);

costApprovalRoute
  .route("/getUserApprovals")
  .get(authenticate, getUserApprovals);

costApprovalRoute.route("/getAllApprovals").get(authenticate, getAllApprovals);

costApprovalRoute
  .route("/getAllLiquidityApprovals")
  .get(authenticate, getAllLiquidityApprovals);

costApprovalRoute
  .route("/:id")
  .get(authenticate, getSingleApproval)
  .put(authenticate, editApproval)
  .delete(authenticate, deleteApproval);

costApprovalRoute.route("/updateInquiry/:id").put(authenticate, updateInquiry);

costApprovalRoute
  .route("/approveInquiry/:id")
  .put(authenticate, approveInquiry);

costApprovalRoute
  .route("/declineInquiry/:id")
  .put(authenticate, declineInquiry);

costApprovalRoute.route("/setPending/:id").put(authenticate, setPending);

costApprovalRoute
  .route("/postponeInquiry/:id")
  .put(authenticate, postponeInquiry);

costApprovalRoute
  .route("/declineLiquidity/:id")
  .put(authenticate, declineLiquidity);

costApprovalRoute
  .route("/approveLiquidity/:id")
  .put(authenticate, approveLiqudity);

costApprovalRoute
  .route("/setLiquidityPending/:id")
  .put(authenticate, setLiquidityPending);

module.exports = costApprovalRoute;
