import { Router } from "express";
import bcrypt from "bcryptjs";
import ConvenorAuth from "../models/ConvenorAuth.js";
import jwt from "jsonwebtoken";

const router = Router();

const SECRET = "kriya";

router.post("/login", async (req, res) => {
  try {
    const user = await ConvenorAuth.findOne({ eventId: req.body.eventId });
    if (user) {
      const auth = bcrypt.compareSync(req.body.password, user.password);
      if (auth) {
        const updated = await ConvenorAuth.findOneAndUpdate(
          { eventId: req.body.eventId },
          { lastVisited: new Date() },
          { new: true }
        );
        return res.status(200).json({
          token: jwt.sign({ _id: user._id }, SECRET),
          rights: user.rights,
        });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const user = await ConvenorAuth.create({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register-many", async (req, res) => {
  try {
    const users = req.body.map((i) => ({
      ...i,
      password: bcrypt.hashSync(i.password, 10),
    }));
    const user = await ConvenorAuth.insertMany(users);
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await ConvenorAuth.find();
    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
