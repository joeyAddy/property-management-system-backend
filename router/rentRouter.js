const express = require("express");
const router = express.Router();
const RentRecordController = require("../controllers/rentController");

router.post("/", RentRecordController.createRentRecord);
router.get("/", RentRecordController.getAllRentRecords);
router.get("/:id", RentRecordController.getRentRecordById);
router.delete("/:id", RentRecordController.deleteRentRecord);
router.put("/:id", RentRecordController.updateRentRecord);

module.exports = router;
