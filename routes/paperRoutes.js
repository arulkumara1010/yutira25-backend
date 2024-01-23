import { Router } from "express";
import Paper from "../models/Paper.js";
import User from "../models/User.js";
import PaymentDetail from "../models/PaymentDetail.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const paper = await Paper.find();
    res.json(paper);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/papers-from-user/:id", async (req, res) => {
  try {
    const paper = await Paper.find({
      email: req.params.id,
    });
    res.status(200).json(paper);
    if (!paper) {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/users-from-paper/:id", async (req, res) => {
  try {
    const paper = await Paper.find({
      paperId: req.params.id,
    });

    const users = [];
    for (let i = 0; i < paper.length; i++) {
      const user = await User.findOne({
        email: paper[i].email,
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
    if (!paper) {
      res.status(404).json({ message: "Paper ID not found!" });
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
      const paper = await Paper.create(req.body);
      res.status(201).json(paper);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const paper = await Paper.findOneAndDelete({
      email: req.params.id,
    });
    if (!paper) {
      res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(paper);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const paper = await Paper.findOneAndUpdate(
      {
        email: req.params.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(paper);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
