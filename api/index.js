const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { WebSocketServer } = require("ws");
const connectDB = require("./config/db");


const app = express();


const userRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const contactRoutes = require("./routes/contactRoutes");
const ticketRoutes = require("./routes/ticketRoutes");


app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

app.use(express.json());

app.use(cookieParser());
app.use(
   cors({
      origin: ["http://localhost:5173", process.env.FRONTEND_URL], 
      credentials: true, 
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);



connectDB();

app.use("/uploads", (req, res, next) => {
      const options = {
         root: path.join(__dirname, "uploads"),
         headers: {
            "Content-Type": "image/jpeg", 
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

app.use("/", userRoutes); 

app.use("/", contactRoutes); 

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });
app.use("/", ticketRoutes(wss)); 
app.use("/", eventRoutes(wss)); 

wss.on("connection", (ws) => {
   console.log("New WebSocket connection");
})