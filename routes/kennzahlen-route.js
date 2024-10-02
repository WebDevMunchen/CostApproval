const express = require("express");
const {
  createNew,
  getAllKennzahlenInquiries,
  getUserKennzahlenInquiries,
  approveKennzahlenInquiry,
  declineKennzahlenInquiry,
  setKennzahlenInquiryPending,
} = require("../controllers/kennzahlen-controller");
const { authenticate } = require("../middlewares/authenticate");

const kennzahlenRoute = express.Router();

kennzahlenRoute
  .route("/getAllUserKennzahlenInquiries")
  .get(authenticate, getUserKennzahlenInquiries);

kennzahlenRoute
  .route("/getAllKennzahlenInquiries")
  .get(authenticate, getAllKennzahlenInquiries);

kennzahlenRoute.route("/createNewEntry").post(authenticate, createNew);
kennzahlenRoute
  .route("/approveKennzahlenInquiry/:id")
  .put(authenticate, approveKennzahlenInquiry);
kennzahlenRoute
  .route("/declineKennzahlenInquiry/:id")
  .put(authenticate, declineKennzahlenInquiry);
kennzahlenRoute
  .route("/setKennzahlenInquiryPending/:id")
  .put(authenticate, setKennzahlenInquiryPending);

module.exports = kennzahlenRoute;
