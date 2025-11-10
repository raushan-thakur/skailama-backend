const mongoose = require("mongoose");

const UpdateLogSchema = new mongoose.Schema({
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    updatedAt: Date,
  });
  
const EventSchema = new mongoose.Schema(
  {
    profiles: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Profile", 
        required: true 
      },
    ],
    timezone: { 
      type: String, 
      required: true 
    },
    startAtUTC: { 
      type: Date, 
      required: true 
    },
    endAtUTC: { 
      type: Date,
      required: true 
    },
    updateLogs: [UpdateLogSchema],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
