const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cookieParser = require("cookie-parser");
// const cloudinary = require("./config/cloudinaryConfig");
const fileUpload = require("express-fileupload");
const { WebSocketServer } = require("ws");
const connectDB = require("./config/db");


const app = express();


const userRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
// const ticketRoutes = require("./routes/ticketRoutes");
const contactRoutes = require("./routes/contactRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
// const Ticket = require("./models/Ticket");
// const Event = require("./models/Event");


app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

app.use(express.json());

app.use(cookieParser());
app.use(
   cors({
      origin: ["http://localhost:5173", process.env.FRONTEND_URL], // Set explicit frontend origins
      credentials: true, // Allow credentials (cookies, authorization headers)
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);



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

app.use("/", userRoutes); // Authentication Routes
// app.use("/", eventRoutes); // Event Routes
app.use("/", contactRoutes); // Contact Support Routes

// app.post("/createEvent", async (req, res) => {
//    try {
//       const { title, description, organizedBy, eventDate, eventTime, location, Participants, ticketPrice, Quantity } = req.body;

//       if (!req.files || !req.files.image) {
//          return res.status(400).json({ error: "No image uploaded" });
//       }

//       const imageFile = req.files.image;

//       // Upload image to Cloudinary
//       const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.tempFilePath, {
//          folder: "events",
//       });

//       const eventData = {
//          title,
//          description,
//          organizedBy,
//          eventDate,
//          eventTime,
//          location,
//          Participants,
//          ticketPrice,
//          Quantity,
//          image: cloudinaryResponse.secure_url, // Save Cloudinary image URL
//       };

//       const newEvent = new Event(eventData);
//       await newEvent.save();

//       res.status(201).json(newEvent);
//    } catch (error) {
//       console.error("Error saving event:", error);
//       res.status(500).json({ error: "Failed to save event" });
//    }
// });
 
// app.get("/createEvent", async (req, res) => {
//    try {
//       const events = await Event.find();
//       res.status(200).json(events);
//    } catch (error) {
//       res.status(500).json({ error: "Failed to fetch events from MongoDB" });
//    }
// });

// app.get("/event/:id", async (req, res) => {
//    const { id } = req.params;
//    try {
//       const event = await Event.findById(id);
//       res.json(event);
//    } catch (error) {
//       res.status(500).json({ error: "Failed to fetch event from MongoDB" });
//    }
// });

// app.post("/event/:eventId", async (req, res) => {
//    const { eventId } = req.params;
//    try {
//       const event = await Event.findById(eventId);
//       if (!event) {
//          return res.status(404).json({ message: "Event not found" });
//       }

//       event.likes += 1;
//       await event.save();

//       res.json(event);
//       // Notify clients about the updated number of likes or attendees
//       wss.clients.forEach(client => {
//          if (client.readyState === 1) {
//             client.send(JSON.stringify({ eventId, attendees: event.Participants, likes: event.likes }));
//          }
//       });
//    } catch (error) {
//       console.error("Error liking the event:", error);
//       res.status(500).json({ message: "Server error" });
//    }
// });
// app.get("/events", (req, res) => {
//    Event.find()
//       .then((events) => {
//          res.json(events);
//       })
//       .catch((error) => {
//          console.error("Error fetching events:", error);
//          res.status(500).json({ message: "Server error" });
//       });
// });

// app.get("/event/:id/ordersummary", async (req, res) => {
//    const { id } = req.params;
//    try {
//       const event = await Event.findById(id);
//       res.json(event);
//    } catch (error) {
//       res.status(500).json({ error: "Failed to fetch event from MongoDB" });
//    }
// });

// app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
//    const { id } = req.params;
//    try {
//       const event = await Event.findById(id);
//       res.json(event);
//    } catch (error) {
//       res.status(500).json({ error: "Failed to fetch event from MongoDB" });
//    }
// });

// app.post("/tickets", async (req, res) => {
//    try {
//       const ticketDetails = req.body;
//       const newTicket = new Ticket(ticketDetails);

//       const event = await Event.findById(ticketDetails.eventId);
//       if (event) {
//          event.Participants += 1;
//          await event.save();

//          wss.clients.forEach(client => {
//             if (client.readyState === 1) {
//                client.send(JSON.stringify({ eventId: event._id, attendees: event.Participants }));
//             }
//          });
//       }

//       await newTicket.save();
//       return res.status(201).json({ ticket: newTicket });
//    } catch (error) {
//       console.error("Error creating ticket:", error);
//       return res.status(500).json({ error: "Failed to create ticket" });
//    }
// });

// app.get("/tickets/:id", async (req, res) => {
//    try {
//       const tickets = await Ticket.find();
//       res.json(tickets);
//    } catch (error) {
//       console.error("Error fetching tickets:", error);
//       res.status(500).json({ error: "Failed to fetch tickets" });
//    }
// });

// app.get("/tickets/user/:userId", (req, res) => {
//    const userId = req.params.userId;

//    Ticket.find({ userid: userId })
//       .then((tickets) => {
//          res.json(tickets);
//       })
//       .catch((error) => {
//          console.error("Error fetching user tickets:", error);
//          res.status(500).json({ error: "Failed to fetch user tickets" });
//       });
// });

// app.delete("/tickets/:id", async (req, res) => {
//    try {
//       const ticketId = req.params.id;
//       await Ticket.findByIdAndDelete(ticketId);
//       res.status(204).send();
//    } catch (error) {
//       console.error("Error deleting ticket:", error);
//       res.status(500).json({ error: "Failed to delete ticket" });
//    }
// });

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });
app.use("/", ticketRoutes(wss)); // Ticket Routes
app.use("/", eventRoutes(wss)); // Event Routes

wss.on("connection", (ws) => {
   console.log("New WebSocket connection");
})