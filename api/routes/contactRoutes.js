const express = require("express");
const ContactMessage = require("../models/ContactMessage");

const router = express.Router();

router.post("/contact-support", async (req, res) => {
    try {
       const { name, email, issue } = req.body;
       const newMessage = new ContactMessage({ name, email, issue });
       await newMessage.save();
       res.status(201).json({ message: "Your request has been submitted." });
    } catch (error) {
       console.error("Error saving contact message:", error);
       res.status(500).json({ error: "Failed to submit request." });
    }
 });
 
 router.get("/contact-support", async (req, res) => {
    try {
       const messages = await ContactMessage.find();
       res.status(200).json(messages);
    } catch (error) {
       console.error("Error fetching contact messages:", error);
       res.status(500).json({ error: "Failed to fetch messages." });
    }
 });

module.exports = router;
