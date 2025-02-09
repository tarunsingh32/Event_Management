const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizedBy: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    }, 
    ticketPrice: {
      type: Number,
      default: 0, // 0 means free
    },
    Participants: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
