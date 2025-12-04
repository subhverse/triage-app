const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // optional — keep or remove based on requirement
const { runTriage } = require("../controllers/triageController");

// For now allow both logged-in users and anonymous users.
// If you want only authenticated users, use `auth` middleware.
router.post("/", auth, runTriage); // protects route; if you want public route, change to: router.post("/", runTriage);

module.exports = router;
