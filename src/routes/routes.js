const express = require("express");
const router = express.Router();
const profilesRoute = require("./profiles");
const eventRoutes = require("./events");

router.use("/profiles", profilesRoute);
router.use("/events", eventRoutes);

module.exports = router;