const express = require("express");
const router = express.Router();
const { createProfile, listProfiles, getProfileById } = require("../controllers/profileController");

router.post("/", createProfile);
router.get("/", listProfiles);
router.get("/:id", getProfileById);


module.exports = router;