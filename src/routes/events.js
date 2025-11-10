const express = require("express");
const router = express.Router();

const {createEvent, getAllEvents, updateEvent } = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/", getAllEvents);
router.put("/:eventId", updateEvent);

module.exports = router;