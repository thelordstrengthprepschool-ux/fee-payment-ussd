// routes/ussdRoutes.js

const express = require("express");
const router = express.Router();

const ussdController = require("../controllers/ussdController");

// USSD callback route
router.post("/", ussdController.handleUSSD);

// Optional test route
router.get("/", (req, res) => {
  res.send("USSD API is running...");
});

module.exports = router;
