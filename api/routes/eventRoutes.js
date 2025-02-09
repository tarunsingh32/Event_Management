const express = require("express");
const Event = require("../models/Event");
const cloudinary = require("../config/cloudinaryConfig");

const router = express.Router();
module.exports = (wss) =>{
router.post("/createEvent", async (req, res) => {
    try {
       const { title, description, organizedBy, eventDate, eventTime, location, Participants, ticketPrice} = req.body;
 
       if (!req.files || !req.files.image) {
          return res.status(400).json({ error: "No image uploaded" });
       }
 
       const imageFile = req.files.image;
 
       // Upload image to Cloudinary
       const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: "events",
       });
 
       const eventData = {
          title,
          description,
          organizedBy,
          eventDate,
          eventTime,
          location,
          Participants: Participants || 0,
          ticketPrice,
        //   Quantity,
          image: cloudinaryResponse.secure_url, // Save Cloudinary image URL
       };
 
       const newEvent = new Event(eventData);
       await newEvent.save();
 
       res.status(201).json(newEvent);
    } catch (error) {
       console.error("Error saving event:", error);
       res.status(500).json({ error: "Failed to save event" });
    }
 });
  
 router.get("/createEvent", async (req, res) => {
    try {
       const events = await Event.find();
       res.status(200).json(events);
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch events from MongoDB" });
    }
 });
 
 router.get("/event/:id", async (req, res) => {
    const { id } = req.params;
    try {
       const event = await Event.findById(id);
       res.json(event);
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch event from MongoDB" });
    }
 });
 
 router.post("/event/:eventId", async (req, res) => {
    const { eventId } = req.params;
    try {
       const event = await Event.findById(eventId);
       if (!event) {
          return res.status(404).json({ message: "Event not found" });
       }
 
       event.likes += 1;
       await event.save();
 
       res.json(event);
       // Notify clients about the updated number of likes or attendees
       wss.clients.forEach(client => {
          if (client.readyState === 1) {
             client.send(JSON.stringify({ eventId, attendees: event.Participants, likes: event.likes }));
          }
       });
    } catch (error) {
       console.error("Error liking the event:", error);
       res.status(500).json({ message: "Server error" });
    }
 });
 router.get("/events", (req, res) => {
    Event.find()
       .then((events) => {
          res.json(events);
       })
       .catch((error) => {
          console.error("Error fetching events:", error);
          res.status(500).json({ message: "Server error" });
       });
 });
 
 router.get("/event/:id/ordersummary", async (req, res) => {
    const { id } = req.params;
    try {
       const event = await Event.findById(id);
       res.json(event);
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch event from MongoDB" });
    }
 });
 
 router.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
    const { id } = req.params;
    try {
       const event = await Event.findById(id);
       res.json(event);
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch event from MongoDB" });
    }
 });
 return router;

};
