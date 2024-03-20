import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import _ from "lodash";
import { sendMail } from "./mailRoutes.js";
import {
  signAccessToken,
  signVerificationToken,
  verifyVerificationToken,
} from "../jwt/index.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { registrationConfirmTemplate } from "../template-generators/registrationConfirm.js";
import { FRONTEND_URL } from "../production.config.js";
import { verifyEmailTemplate } from "../template-generators/verifyEmail.js";
import PaymentDetail from "../models/PaymentDetail.js";

const router = Router();

const generateKriyaID = async (probe = 0) => {
  try {
    const count = await User.countDocuments({ kriyaId: { $ne: null } });
    let newId =
      "YUTIRA" + (count + 1000 + probe * probe).toString().padStart(4, "0");
    const existing = await User.findOne({ kriyaId: newId });
    if (existing) {
      console.log("Collision detected");
      console.log("Probe: " + probe, "New ID: " + newId);
      return generateKriyaID(probe + 1);
    }
    return Promise.resolve(newId);
  } catch (error) {
    return Promise.reject(error);
  }
};

router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;
    const payload = await verifyVerificationToken(token);
    if (!payload)
      return res.status(400).json({ error: "Invalid verification." });
    const user = await User.findOneAndUpdate(
      { email: payload.aud },
      { verified: true }
    );
    return res.status(200).json({
      user: _.omit(user, ["password", "role"]),
      message: "User successfully verified.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = null;
    if (username.includes("@")) {
      user = await User.findOne({ email: username });
    } else {
      user = await User.findOne({ kriyaId: username });
    }
    if (user) {
      if (!user.verified) {
        return res.status(301).json({ error: "User not verified" });
      }
      const auth = bcrypt.compareSync(password, user.password);
      if (auth) {
        res.status(200).json({
          token: jwt.sign({ user: user._id }, user.email),
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login-google", async (req, res) => {
  try {
    const { email, googleId } = req.body;
    // googleId = CryptoJS.AES.decrypt(googleId, "kriya_google").toString.toString(
    //   CryptoJS.enc.Utf8
    // );
    const user = await User.findOne({ email: email, googleId: googleId });
    if (user) {
      if (!user.verified) {
        return res.status(301).json({ error: "User not verified" });
      }
      return res.status(200).json({
        token: jwt.sign({ user: user._id }, user.email),
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/login-verify/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      user.email,
      (err, decoded) => {
        if (err) {
          res.status(401).json({ error: "Invalid token" });
        } else {
          res.status(200).json({ success: true, data: user });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/user-details", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json({ user: _.omit(user, ["password", "role"]) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/user-details/:kriyaId", async (req, res) => {
  try {
    const { kriyaId } = req.params;
    const user = await User.findOne({ kriyaId });
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json({ user: _.omit(user, ["password", "role"]) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/convert-to-psg", async (req, res) => {
  try {
    const { fromEmail, toEmail } = req.body;
    const fromUser = await User.findOne({ email: fromEmail });
    const toUser = await User.findOne({ email: toEmail });
    if (fromUser) {
      if (toUser) {
        if (toUser.kriyaId === null) {
          const deleteUser = await User.findOneAndDelete({ email: toEmail });
          const user = await User.findOneAndUpdate(
            { email: fromEmail },
            { email: toEmail }
          );
          return res
            .status(200)
            .json({ user: _.omit(user, ["password", "role"]) });
        } else {
          return res.status(400).json({ error: "Email already registered" });
        }
      } else {
        const user = await User.findOneAndUpdate(
          { email: fromEmail },
          { email: toEmail }
        );
        return res
          .status(200)
          .json({ user: _.omit(user, ["password", "role"]) });
      }
    } else {
      if (toUser) {
        return res
          .status(200)
          .json({ user: _.omit(toUser, ["password", "role"]) });
      } else {
        return res.status(400).json({ error: "User not found" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/user-details/:email", async (req, res) => {
  try {
    if (req.params.email === "create") {
      const newUser = await User.create({ ...req.body, source: "email" });
      return res.status(201).json({ user: newUser });
    }
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      const newUser = await User.create({ ...req.body, source: "email" });
      return res.status(201).json({ user: newUser });
    }
    const emailUser = await User.findOne({ email: req.body.email });
    if (req.params.email !== req.body.email && emailUser)
      return res.status(400).json({ error: "Email already exists" });
    if (req.body.password)
      return res.status(400).json({ error: "Password cannot be set" });
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ user: _.omit(updatedUser, ["password", "role"]) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/verify-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    await sendMail(
      email,
      "Verify your mail",
      verifyEmailTemplate(user.name, `${FRONTEND_URL}/verify/${user._id}`)
    );
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/verify-confirm/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json({ user: _.omit(user, ["password", "role"]) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/user-password/:email", async (req, res) => {
  try {
    const id = await generateKriyaID();
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { password: bcrypt.hashSync(req.body.password, 10), kriyaId: id },
      { new: true }
    );
    if (!user) return res.status(400).json({ error: "User not found" });
    await sendMail(
      user.email,
      "Thank you for registering",
      registrationConfirmTemplate(user.name, user.kriyaId)
    );
    return res.status(200).json({
      user: _.omit(user, ["password", "role"]),
      token: jwt.sign({ user: user._id }, user.email),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get all verified users
router.get("/verified-users", async (req, res) => {
  try {
    const users = await User.find({ verified: true });
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/paid-users", async (req, res) => {
  try {
    const users = await User.find({ verified: true, isPaid: true });
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/unpaid-users", async (req, res) => {
  try {
    const users = await User.find({ kriyaId: { $ne: null }, isPaid: false });
    res.status(200).json({ users: users.map((user) => user.email) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/kriya-id/:id", async (req, res) => {
  try {
    const user = await User.findOne({ kriyaId: req.params.id });
    if (!user) return res.status(400).json({ error: "User not found" });

    const paymentDetails = await PaymentDetail.aggregate([
      { $match: { kriyaId: req.params.id, status: "SUCCESS" } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $project: { _id: 0, type: "$_id" } },
    ]);
    const payment = paymentDetails.map((item) => item.type);

    res.status(200).json({ user: _.omit(user, ["password", "role"]), payment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/onspot/register', async (req, res) => {
  try {

    let _user = await User.findOne({ email: req.body.email });
    if (_user) {
      if (!_user.kriyaId) {
        await User.deleteOne({ email: req.body.email });
        if (!req.body.email || !req.body.name || !req.body.college || !req.body.year || !req.body.phone || !req.body.department) {
          return res.status(400).json({ error: "Bad request check all fields" });
        }
    
        const user = await User.create({
          kriyaId: await generateKriyaID(),
          ...req.body,
          password: bcrypt.hashSync(req.body.password, 10)
        });
    
        if (!user) return res.status(400).json({ error: "user wasn't created" });
        return res.status(200).json({ user: _.omit(user, ["password", "role"]) });
      }
      return res.status(409).json({ error: "User already exists", user: _.omit(_user, ["password", "role"]) });
    } else {
      if (!req.body.email || !req.body.name || !req.body.college || !req.body.year || !req.body.phone || !req.body.department) {
        return res.status(400).json({ error: "Bad request check all fields" });
      }
  
      const user = await User.create({
        kriyaId: await generateKriyaID(),
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10)
      });
  
      if (!user) return res.status(400).json({ error: "user wasn't created" });
      res.status(200).json({ user: _.omit(user, ["password", "role"]) });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-user/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { kriyaId: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/kit-done", async (req, res) => {
  try {
    const users = await User.find({ kit: true });
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/non-psg-email", async (req, res) => {
  try {
    const users = await User.find({
      email: {
        // $ne: "PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004",
        $not: { $regex: /@psgtech.ac.in/ },
      },
    });

    res
      .status(200)
      .json({ email: users.map((e) => e.email), count: users.length });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/non-psg-email-paid", async (req, res) => {
  try {
    const users = await PaymentDetail.aggregate([
      {
        $match: {
          status: "SUCCESS",
          email: {
            // $ne: "PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004",
            $not: { $regex: /@psgtech.ac.in/ },
          },
        },
      },
      {
        $group: {
          _id: "$email",
        },
      },
    ]);

    res
      .status(200)
      .json({ email: users.map((e) => e._id), count: users.length });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/workshop-and-general/:wid", async (req, res) => {
  try {
    const data = await PaymentDetail.aggregate([
      {
        $match: {
          eventId: req.params.wid,
          status: "SUCCESS",
          type: "WORKSHOP",
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
    ]);
    return res.status(200).json(
      data.filter((d) => d.user[0].isPaid).length
      // .map((d) => ({
      //   kriyaId: d.user[0].kriyaId,
      //   email: d.email,
      //   name: d.user[0].name,
      //   workshop: d.eventId,
      //   phone: d.user[0].phone,
      // }))
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
