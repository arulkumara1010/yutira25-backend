import { Router } from "express";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import PaymentDetail from "../models/PaymentDetail.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const register = await Registration.find({});
    res.status(200).json(register);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/many", async (req, res) => {
  try {
    const register = await Registration.insertMany(req.body);
    res.status(200).json(register);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/events-from-user/:id", async (req, res) => {
  try {
    const register = await Registration.find({
      email: req.params.id,
    });
    res.status(200).json(register);
    if (!register) {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/users-from-event/:id", async (req, res) => {
  try {
    const register = await Registration.find({
      eventId: req.params.id,
    });

    const users = [];
    for (let i = 0; i < register.length; i++) {
      const user = await User.findOne({
        email: register[i].email,
      });
      users.push({
        name: user.name,
        kriyaId: user.kriyaId,
        college: user.college,
        dept: user.department,
        year: user.year,
        phone: user.phone,
      });
    }
    res.status(200).json(users);
    if (!register) {
      res.status(404).json({ message: "Event ID not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const isCheck = await User.findOne({
      email: req.body.email,
    });
    const generalPaid = await PaymentDetail.findOne({
      email: req.body.email,
      kriyaId: { $ne: null },
      status: "SUCCESS",
      eventId: "-1",
    });
    if (!isCheck) return res.status(404).json({ message: "User not found!" });
    if (!generalPaid)
      return res.status(405).json({ message: "User has not paid!" });
    if (isCheck) {
      const register = await Registration.create(req.body);
      res.status(201).json(register);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const register = await Registration.findOneAndDelete({
      email: req.params.id,
    });
    if (!register) {
      res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(register);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const register = await Registration.findOneAndUpdate(
      {
        email: req.params.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(register);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/attend", async (req, res) => {
  try {
    const { eventId, kriyaId } = req.body;
    const user = await User.findOne({ kriyaId: `YUTIRA${kriyaId}` });
    if (!user) return res.status(404).json({ message: "User not found!" });
    const register = await Registration.findOneAndUpdate(
      {
        eventId: eventId,
        email: user.email,
      },
      {
        attended: true,
        attendedAt: new Date(),
      },
      { new: true }
    );
    if (!register) {
      const register = await Registration.create({
        eventId: eventId,
        email: user.email,
        attended: true,
        attendedAt: new Date(),
      });
      return res.status(200).json({ register, success: true });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/attend-false", async (req, res) => {
  try {
    const { eventId, email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found!" });
    const register = await Registration.findOneAndUpdate(
      {
        eventId: eventId,
        email: user.email,
      },
      {
        attended: false,
        attendedAt: null,
      },
      { new: true }
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/attendees/:id", async (req, res) => {
  try {
    const attendees = await Registration.aggregate([
      {
        $match: {
          eventId: req.params.id,
          attended: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "user",
        },
      },
      {
        $sort: {
          attendedAt: -1,
        },
      },
    ]);
    if (!attendees) {
      res.status(404).json({ message: "Event not found!" });
    }
    return res.status(200).json(attendees);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
