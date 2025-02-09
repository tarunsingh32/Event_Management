const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const multer = require("multer");
const path = require("path");

const Ticket = require("./models/Ticket");
const ContactMessage = require("./models/ContactMessage");
const { log } = require("console");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const { WebSocketServer } = require("ws");
const connectDB = require("./config/db");

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "bsbsfbrnsftentwnnwnwn";

// cloudinary.config({
//    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//    api_key: process.env.CLOUDINARY_API_KEY,
//    api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Middleware to handle file uploads
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: ["http://localhost:5173",process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);

// mongoose
//    .connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//    })
//    .then(() => console.log("Connected to MongoDB ✅"))
//    .catch((err) => console.error("MongoDB connection error ❌:", err));
connectDB();

app.use("/uploads", (req, res, next) => {
      const options = {
         root: path.join(__dirname, "uploads"),
         headers: {
            "Content-Type": "image/jpeg", // Default to jpeg, adjust as needed
         },
      };
      res.sendFile(req.path, options, (err) => {
         if (err) {
            next();
         }
      });
   });   
app.get("/test", (req, res) => {
   res.json("test ok");
});

app.post("/register", async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
   } catch (e) {
      res.status(422).json(e);
   }
});

app.post("/login", async (req, res) => {
   const { email, password } = req.body;
   const userDoc = await UserModel.findOne({ email });

   if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
   }

   const passOk = bcrypt.compareSync(password, userDoc.password);
   if (!passOk) {
      return res.status(401).json({ error: "Invalid password" });
   }

   jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      { expiresIn: "7d" }, // Token expires in 7 days
      (err, token) => {
         if (err) {
            return res.status(500).json({ error: "Failed to generate token" });
         }

         res.cookie("token", token, {
            httpOnly: true,   // Prevents XSS attacks
            secure: true,     // Only send over HTTPS
            sameSite: "None", // Allows cross-site requests
         }).json(userDoc);
      }
   );
});


app.get("/profile", (req, res) => {
   const { token } = req.cookies;
   if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
         if (err) throw err;
         const { name, email, _id } = await UserModel.findById(userData.id);
         res.json({ name, email, _id });
      });
   } else {
      res.json(null);
   }
});

app.post("/logout", (req, res) => {
   res.cookie("token", "", {
      httpOnly: true,   // Prevents JavaScript access
      secure: true,     // Works only on HTTPS
      sameSite: "None", // Allows cross-site requests
      expires: new Date(0), // Expire immediately
   }).json({ message: "Logged out successfully" });
});


const eventSchema = new mongoose.Schema({
   owner: String,
   title: String,
   description: String,
   organizedBy: String,
   eventDate: Date,
   eventTime: String,
   location: String,
   Participants: { type: Number, default: 0 },
   Count: Number,
   Income: Number,
   ticketPrice: Number,
   Quantity: Number,
   image: String,
   likes: Number,
   Comment: [String],
});

const Event = mongoose.model("Event", eventSchema);

app.post("/createEvent", async (req, res) => {
   try {
      const { title, description, organizedBy, eventDate, eventTime, location, Participants, ticketPrice, Quantity } = req.body;

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
         Participants,
         ticketPrice,
         Quantity,
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
 
app.get("/createEvent", async (req, res) => {
   try {
      const events = await Event.find();
      res.status(200).json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events from MongoDB" });
   }
});

app.get("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.post("/event/:eventId", async (req, res) => {
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
app.get("/events", (req, res) => {
   Event.find()
      .then((events) => {
         res.json(events);
      })
      .catch((error) => {
         console.error("Error fetching events:", error);
         res.status(500).json({ message: "Server error" });
      });
});

app.get("/event/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.post("/tickets", async (req, res) => {
   try {
      const ticketDetails = req.body;
      const newTicket = new Ticket(ticketDetails);

      const event = await Event.findById(ticketDetails.eventId);
      if (event) {
         event.Participants += 1;
         await event.save();

         wss.clients.forEach(client => {
            if (client.readyState === 1) {
               client.send(JSON.stringify({ eventId: event._id, attendees: event.Participants }));
            }
         });
      }

      await newTicket.save();
      return res.status(201).json({ ticket: newTicket });
   } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ error: "Failed to create ticket" });
   }
});

app.get("/tickets/:id", async (req, res) => {
   try {
      const tickets = await Ticket.find();
      res.json(tickets);
   } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
   }
});

app.get("/tickets/user/:userId", (req, res) => {
   const userId = req.params.userId;

   Ticket.find({ userid: userId })
      .then((tickets) => {
         res.json(tickets);
      })
      .catch((error) => {
         console.error("Error fetching user tickets:", error);
         res.status(500).json({ error: "Failed to fetch user tickets" });
      });
});

app.delete("/tickets/:id", async (req, res) => {
   try {
      const ticketId = req.params.id;
      await Ticket.findByIdAndDelete(ticketId);
      res.status(204).send();
   } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ error: "Failed to delete ticket" });
   }
});

// Route to handle contact form submission
app.post("/contact-support", async (req, res) => {
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

// Route to fetch all contact messages (for admin/support)
app.get("/contact-support", async (req, res) => {
   try {
      const messages = await ContactMessage.find();
      res.status(200).json(messages);
   } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ error: "Failed to fetch messages." });
   }
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
   console.log("New WebSocket connection");
})