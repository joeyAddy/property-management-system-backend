const express = require("express");
const router = express.Router();
const BuyoutController = require("../controllers/buyOutController");

router.post("/", BuyoutController.createBuyOut);
router.get("/", BuyoutController.getAllBuyOuts);
router.get("/:id", BuyoutController.getBuyOutById);
router.delete("/:id", BuyoutController.deleteBuyOut);

module.exports = router;
