import { Router } from "express";
import {
  generateEncryptedPaymentData,
  decryptPaymentDataToJson,
} from "../crypto/index.js";
import PaymentDetail from "../models/PaymentDetail.js";
import { sendMail } from "./mailRoutes.js";
import { paymentSuccessTemplate } from "../template-generators/paymentSuccess.js";
import User from "../models/User.js";
import { FRONTEND_URL, HELPDESK_URL } from "../production.config.js";

const router = Router();

const generateNewTransactionID = async (probe = 0) => {
  try {
    const count = await PaymentDetail.countDocuments({});
    let newId =
      "TXN_YUTIRA_" +
      (count + 42320 + probe * probe).toString().padStart(6, "0");
    const existing = await PaymentDetail.findOne({ transactionId: newId });
    if (existing) {
      console.log("Collision detected");
      console.log("Probe: " + probe, "New ID: " + newId);
      return generateNewTransactionID(probe + 1);
    }
    return Promise.resolve(newId);
  } catch (error) {
    return Promise.reject(error);
  }
};

router.get("/trial-pay", async (req, res) => {
  // const transaction = PaymentDetail.create({});
  // if event_id == -1 => General Payment (Payed to register for all the events);
  // transaction_id must be unique for each transaction
  const url = generateEncryptedPaymentData(
    "TRANSACTIONTdfihjkgdjyST0007",
    "KRIYA0002",
    "abc@gmail.com",
    "abcde",
    5
  );
  return res.json({ url });
});

router.get("/", async (req, res) => {
  const paymentDetails = await PaymentDetail.find();
  return res.json({ paymentDetails });
});

router.post("/pay-general", async (req, res) => {
  try {
    const id = await generateNewTransactionID();
    const user = await User.findOne({ kriyaId: req.body.kriyaId });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const txn = await PaymentDetail.create({
      ...req.body,
      transactionId: id,
      type: "GENERAL",
      datetime: new Date(),
      eventId: "-1",
    });
    // const url = generateEncryptedPaymentData(
    //   id,
    //   req.body.kriyaId,
    //   req.body.email,
    //   req.body.name,
    //   req.body.fee
    // );

    return res.status(200).json({ data: txn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

router.post("/onspot/pay-general", async (req, res) => {
  try {
    const id = await generateNewTransactionID();
    const user = await User.findOne({ kriyaId: req.body.kriyaId });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const txn = await PaymentDetail.create({
      ...req.body,
      transactionId: id,
      type: "GENERAL",
      datetime: new Date(),
      eventId: "-2",
    });
    // const url = generateEncryptedPaymentData(
    //   id,
    //   req.body.kriyaId,
    //   req.body.email,
    //   req.body.name,
    //   req.body.fee
    // );
    return res.status(200).json({ data: txn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/success", async (req, res) => {
  try {
    const paymentDetails = await PaymentDetail.aggregate([
      {
        $match: {
          status: "SUCCESS",
        },
      },
      {
        $group: {
          _id: "$eventId",
          totalFee: { $sum: "$fee" },
        },
      },
    ]);
    return res.json({
      total: paymentDetails.reduce((acc, curr) => {
        return acc + curr.totalFee;
      }, 0),
      paymentDetails,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.post("/pay-workshop/:id", async (req, res) => {
  try {
    const id = await generateNewTransactionID();
    const user = await User.findOne({ kriyaId: req.body.kriyaId });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    // if (!user.isPaid) {
    //   return res.status(405).json({ message: "User has not paid!" });
    // }
    const txn = await PaymentDetail.create({
      ...req.body,
      transactionId: id,
      type: "WORKSHOP",
      datetime: new Date(),
      eventId: req.params.id,
    });
    // const url = generateEncryptedPaymentData(
    //   id,
    //   req.body.kriyaId,
    //   req.body.email,
    //   req.body.name,
    //   req.body.fee
    // );
    return res.status(200).json({ data: txn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

router.get("/workshop-payment-details/:id", async (req, res) => {
  try {
    const workshopPayment = await PaymentDetail.find({
      eventId: req.params.id,
      status: "SUCCESS",
    });

    const users = [];
    for (let i = 0; i < workshopPayment.length; i++) {
      const user = await User.findOne({
        email: workshopPayment[i].email,
      });
      users.push({
        name: user.name,
        kriyaId: user.kriyaId,
        college: user.college,
        dept: user.department,
        year: user.year,
        phone: user.phone,
        email: user.email,
      });
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

router.get("/confirm", async (req, res) => {
  console.log(req, res);
  try {
    const encryptedData = req.query.data;
    const paymentData = decryptPaymentDataToJson(encryptedData);
    if (paymentData.status === 1) {
      const txn = await PaymentDetail.findOneAndUpdate(
        { transactionId: paymentData.transactionid },
        { status: "SUCCESS", datetime: new Date() }
      );
      if (txn.eventId.toString() === "-1" || txn.eventId.toString() === "-2") {
        const user = await User.findOneAndUpdate(
          { kriyaId: txn.kriyaId },
          { isPaid: true }
        );
      }
      sendMail(
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
      if (txn.eventId.toString() === "-1") {
        return res
          .status(200)
          .redirect(
            `${FRONTEND_URL}/payment/success?txn=${txn.transactionId}&redirect=complete_register`
          );
      } else if (txn.eventId.toString() === "-2") {
        return res
          .status(200)
          .redirect(`${HELPDESK_URL}/payment?txn=${txn.transactionId}`);
      } else {
        return res
          .status(200)
          .redirect(
            `${FRONTEND_URL}/payment/success?txn=${txn.transactionId}&redirect=workshop_register`
          );
      }
    } else {
      const txn = await PaymentDetail.findOneAndUpdate(
        { transactionId: paymentData.transactionid },
        { status: "ERROR", datetime: new Date() }
      );
      if (txn.eventId.toString() === "-1") {
        return res
          .status(400)
          .redirect(
            `${FRONTEND_URL}/payment/failure?txn=${txn.transactionId}&redirect=complete_register`
          );
      } else if (txn.eventId.toString() === "-2") {
        return res
          .status(200)
          .redirect(`${HELPDESK_URL}/payment?txn=${txn.transactionId}`);
      } else {
        return res
          .status(400)
          .redirect(
            `${FRONTEND_URL}/payment/failure?txn=${txn.transactionId}&redirect=workshop_register`
          );
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

router.get("/payment-details/:id", async (req, res) => {
  try {
    const paymentDetails = await PaymentDetail.findOne({
      transactionId: req.params.id,
    });
    return res.status(200).json({ data: paymentDetails });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/user-payment-details/:id", async (req, res) => {
  try {
    const paymentDetails = await PaymentDetail.find({
      email: req.params.id,
    });
    return res.status(200).json({ data: paymentDetails });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/random", async (req, res) => {
  try {
    const workshop = await PaymentDetail.aggregate([
      {
        $match: {
          type: "WORKSHOP",
          status: "SUCCESS",
        },
      },
      {
        $project: {
          _id: 0,
          email: 1,
        },
      },
    ]);

    const general = await PaymentDetail.aggregate([
      {
        $match: {
          type: "GENERAL",
          status: "SUCCESS",
        },
      },
      {
        $project: {
          _id: 0,
          email: 1,
        },
      },
    ]);

    const workshopEmails = workshop.map((item) => item.email);
    const generalEmails = general.map((item) => item.email);

    // filter common emails
    const commonEmails = workshopEmails.filter((email) =>
      generalEmails.includes(email)
    );

    // get unique payment success emails
    const uniqueSuccess = await PaymentDetail.aggregate([
      {
        $match: {
          status: "SUCCESS",
        },
      },
      {
        $group: {
          _id: "$email",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      uni: uniqueSuccess.length,
      work: workshopEmails.length,
      gen: generalEmails.length,
      common: commonEmails.length,
      onlyWork: workshopEmails.length - commonEmails.length,
      onlyGen: generalEmails.length - commonEmails.length,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

export default router;
