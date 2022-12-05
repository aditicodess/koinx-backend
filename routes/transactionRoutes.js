const express = require("express");
const transactionController = require("../controllers/transactionController");
const router = express.Router();

router.post("/", transactionController.addTransaction);
router.get("/:id", transactionController.balanceAndPrice);

module.exports = router;
