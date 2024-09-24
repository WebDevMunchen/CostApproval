const express = require("express");
const {
  createNew,
  getAllKennzahlenInquiries,
  getUserKennzahlenInquiries,
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

module.exports = kennzahlenRoute;
