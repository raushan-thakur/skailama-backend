const Event = require("../models/Event");
const Profile = require("../models/Profile");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

const createEvent = async (data) => {
  const { profiles, timezone, startDate, endDate } = data;

  if (!Array.isArray(profiles) || profiles.length < 1) {
    throw new Error("Please include at least one profile in the event.");
  }

  if (!timezone) {
    throw new Error("Timezone is required");
  }

  if (!startDate || !endDate) {
    throw new Error("Start and end dates are required");
  }

  const startDateTime = dayjs(startDate);
  const endDateTime = dayjs(endDate);

  if (!startDateTime.isValid() || !endDateTime.isValid()) {
    throw new Error("Invalid date format");
  }

  if (endDateTime.isBefore(startDateTime)) {
    throw new Error("End must be after start");
  }

  const event = new Event({
    profiles,
    timezone,
    startAtUTC: startDateTime.toDate(),
    endAtUTC: endDateTime.toDate(),
    updateLogs: [],
  });

  const saved = await event.save();
  return await Event.findById(saved._id).populate("profiles", "name");
};

const getAllEvents = async () => {
  try {
    return await Event.find()
      .populate("profiles", "name")
      .sort({ startAtUTC: 1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateEvent = async (eventId, data) => {
  const { profiles, timezone, startDate, endDate } = data;

  const event = await Event.findById(eventId).populate("profiles", "name");
  if (!event) throw new Error("Event not found");

  const finalStart = startDate ? dayjs(startDate) : dayjs(event.startAtUTC);
  const finalEnd = endDate ? dayjs(endDate) : dayjs(event.endAtUTC);

  if (!finalStart.isValid() || !finalEnd.isValid()) {
    throw new Error("Invalid date format");
  }
  if (finalEnd.isBefore(finalStart)) {
    throw new Error("End must be after start");
  }

  const logs = [];

  if (
    profiles &&
    JSON.stringify(profiles) !==
      JSON.stringify(event.profiles.map((p) => p._id.toString()))
  ) {
    const oldProfiles = event.profiles.map((p) => ({
      _id: p._id,
      name: p.name,
    }));

    const newProfilesData = await Profile.find(
      { _id: { $in: profiles } },
      "name"
    ).lean();
    const newProfiles = newProfilesData.map((p) => ({
      _id: p._id,
      name: p.name,
    }));

    logs.push({
      field: "profiles",
      oldValue: oldProfiles,
      newValue: newProfiles,
      updatedAt: new Date(),
    });

    event.profiles = profiles;
  }

  if (timezone && timezone !== event.timezone) {
    logs.push({
      field: "timezone",
      oldValue: event.timezone,
      newValue: timezone,
      updatedAt: new Date(),
    });
    event.timezone = timezone;
  }

  if (
    startDate && new Date(startDate).getTime() !== event.startAtUTC.getTime()
  ) {
    logs.push({
      field: "startAtUTC",
      oldValue: event.startAtUTC,
      newValue: finalStart.toDate(),
      updatedAt: new Date(),
    });
    event.startAtUTC = finalStart.toDate();
  }

  if (endDate && new Date(endDate).getTime() !== event.endAtUTC.getTime()
  ) {
    logs.push({
      field: "endAtUTC",
      oldValue: event.endAtUTC,
      newValue: finalEnd.toDate(),
      updatedAt: new Date(),
    });
    event.endAtUTC = finalEnd.toDate();
  }

  if (logs.length) {
    event.updateLogs = event.updateLogs.concat(logs);
  }

  const updated = await event.save();
  const populatedEvent = await Event.findById(updated._id)
    .populate("profiles", "name")
    .lean();

  for (const log of populatedEvent.updateLogs || []) {
    if (log.field === "profiles") {
      const oldIds = log.oldValue.map((p) =>
        typeof p === "string" ? p : p._id
      );
      const newIds = log.newValue.map((p) =>
        typeof p === "string" ? p : p._id
      );

      const [oldProfiles, newProfiles] = await Promise.all([
        Profile.find({ _id: { $in: oldIds } }, "name").lean(),
        Profile.find({ _id: { $in: newIds } }, "name").lean(),
      ]);

      log.oldValue = oldProfiles;
      log.newValue = newProfiles;
    }
  }

  return populatedEvent;
};

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
};
