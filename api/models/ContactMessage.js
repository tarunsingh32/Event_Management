const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true },
   issue: { type: String, required: true },
   createdAt: { type: Date, default: Date.now }
});

const ContactMessage = mongoose.model("ContactMessage", contactSchema);

module.exports = ContactMessage;
