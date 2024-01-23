import { Router } from "express";
import Events from "../models/Events.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const events = await Events.find({});
    if (!events) return res.status(400).json({ message: "Events not found" });
    return res.status(200).json({ events });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Events.findOne({ eventId: req.params.id });
    if (!events) return res.status(400).json({ message: "Events not found" });
    return res.status(200).json({ event });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/insert-many", async (req, res) => {
  try {
    const events = await Events.insertMany(req.body);
    if (!events)
      return res.status(400).json({ message: "Error creating events" });
    return res.status(200).json({ events });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/:id", async (req, res) => {
  try {
    const existingEvent = await Events.findOneAndUpdate(
      { eventId: req.params.id },
      req.body
    );
    if (existingEvent) return res.status(200).json({ event: existingEvent });
    const event = await Events.create({ ...req.body, eventId: req.params.id });
    if (!event)
      return res.status(400).json({ message: "Error creating event" });
    return res.status(200).json({ event });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;
