const eventService = require("../service/Event");

const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const getAllEvents = async (req, res) => { 
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const updateEvent = async (req, res) => {
  try {
    const event = await eventService.updateEvent(req.params.eventId, req.body);
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
};