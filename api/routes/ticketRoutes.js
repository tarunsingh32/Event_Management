const express = require("express");
const TicketModel = require("../models/Ticket");
const Event = require("../models/Event");
// const { WebSocketServer } = require("ws");


const router = express.Router();

module.exports = (wss) => {
    router.post("/tickets", async (req, res) => {
        try {
            const ticketDetails = req.body;
            const newTicket = new TicketModel(ticketDetails);

            const event = await Event.findById(ticketDetails.eventId);
            if (event) {
                event.Participants = (event.Participants || 0) + 1;
                await event.save();

                if (wss) {
                    wss.clients.forEach(client => {
                        if (client.readyState === 1) {
                            client.send(JSON.stringify({ eventId: event._id, attendees: event.Participants }));
                        }
                    });
                }
            }

            await newTicket.save();
            return res.status(201).json({ ticket: newTicket });
        } catch (error) {
            console.error("Error creating ticket:", error);
            return res.status(500).json({ error: "Failed to create ticket" });
        }
    });

    router.get("/tickets/:id", async (req, res) => {
        try {
            const tickets = await TicketModel.find();
            res.json(tickets);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            res.status(500).json({ error: "Failed to fetch tickets" });
        }
    });

    router.get("/tickets/user/:userId", (req, res) => {
        const userId = req.params.userId;

        TicketModel.find({ userid: userId })
            .then((tickets) => {
                res.json(tickets);
            })
            .catch((error) => {
                console.error("Error fetching user tickets:", error);
                res.status(500).json({ error: "Failed to fetch user tickets" });
            });
    });

    router.delete("/tickets/:id", async (req, res) => {
        try {
            const ticketId = req.params.id;
            await TicketModel.findByIdAndDelete(ticketId);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting ticket:", error);
            res.status(500).json({ error: "Failed to delete ticket" });
        }
    });

    return router;
};