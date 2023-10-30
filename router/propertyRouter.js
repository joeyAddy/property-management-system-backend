const express = require("express");
const router = express.Router();
const PropertyController = require("../controllers/propertyController");

router.post("/", PropertyController.createProperty);
router.get("/", PropertyController.getAllProperties);
router.get("/agent", PropertyController.getAllPropertiesForAgent);
router.get("/agent/favorite", PropertyController.getFavoritePropertiesForAgent);
router.get("/:id", PropertyController.getPropertyById);
router.delete("/:id", PropertyController.deleteProperty);
router.put("/:id", PropertyController.updateProperty);
router.get("/search", PropertyController.searchProperties);
router.post("/favorite", PropertyController.updatePropertyFavorite);

module.exports = router;
