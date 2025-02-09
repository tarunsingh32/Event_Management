const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
require("dotenv").config();

const router = express.Router();
const bcryptSalt = bcrypt.genSaltSync(10);


router.post("/register", async (req, res) => {
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
 
 router.post("/login", async (req, res) => {
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
       process.env.JWT_SECRET,
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
 
 
 router.get("/profile", (req, res) => {
    const { token } = req.cookies;
    if (token) {
       jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
          if (err) throw err;
          const { name, email, _id } = await UserModel.findById(userData.id);
          res.json({ name, email, _id });
       });
    } else {
       res.json(null);
    }
 });
 
 router.post("/logout", (req, res) => {
    res.cookie("token", "", {
       httpOnly: true,   
       secure: true,     
       sameSite: "None", 
       expires: new Date(0), 
    }).json({ message: "Logged out successfully" });
 });
 
 module.exports = router;
