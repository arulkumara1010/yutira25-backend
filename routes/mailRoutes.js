import nodemailer from "nodemailer";
import { Router } from "express";
import PaymentDetail from "../models/PaymentDetail.js";
import User from "../models/User.js";
import { paymentSuccessTemplate } from "../template-generators/paymentSuccess.js";
import { registrationConfirmTemplate } from "../template-generators/registrationConfirm.js";
import { paymentRemainderTemplate } from "../template-generators/paymentRemainder.js";

// const MAIL_USER = "noreply@psgkriya.in";
// const MAIL_PASSWORD = "#kriya2023";
const router = Router();

const MAIL_USER = "cea.civil@psgtech.ac.in";
const MAIL_PASSWORD = "civil@2025";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

export const sendMail = async (to, subject, html) => {
  const mailOptions = {
    from: "cea.civil@psgtech.ac.in",
    to: to,
    subject: subject,
    html: html,
  };
  return await transporter.sendMail(mailOptions);
};

router.get("/txn/:id", async (req, res) => {
  try {
    const Payment = await PaymentDetail.findOne({
      transactionId: req.params.id,
    });
    if (Payment) {
      res.status(200).json(Payment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/kriya/:id", async (req, res) => {
  try {
    const user = await User.findOne({ kriyaId: req.params.id });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/txn/:id", async (req, res) => {
  try {
    const txn = await PaymentDetail.findOne({
      transactionId: req.params.id,
    });
    if (txn) {
      await sendMail(
        txn.email,
        "Payment Successful",
        paymentSuccessTemplate(
          txn.transactionId,
          txn.kriyaId,
          txn.name,
          txn.email,
          txn.fee,
          txn.type,
          txn.eventId,
          txn.datetime
        )
      );
      return res.status(200).json({ message: "Mail sent" });
    } else {
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/kriya/:id", async (req, res) => {
  try {
    const user = await User.findOne({ kriyaId: req.params.id });
    if (user) {
      await sendMail(
        user.email,
        "Thank you for registering",
        registrationConfirmTemplate(user.name, user.kriyaId)
      );
      return res.status(200).json({ message: "Mail sent" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/send-payment-remainder", async (req, res) => {
  try {
    const mails = req.body.mails;
    const subject = req.body.subject;
    const html = paymentRemainderTemplate();
    for (let i = 0; i < mails.length; i++) {
      await sendMail(mails[i], subject, html);
      console.log(i + 1 + ") Mail sent to " + mails[i]);
    }
    return res.status(200).json({ message: "Mail sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
