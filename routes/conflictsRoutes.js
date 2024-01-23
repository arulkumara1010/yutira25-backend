import { Router } from "express";
import PaymentDetail from "../models/PaymentDetail.js";
import User from "../models/User.js";

const router = Router();

router.get("/conflicts", async (req, res) => {
  try {
    // await User.deleteMany({ kriyaId: "null" });
    const data = await User.aggregate([
      {
        $group: {
          _id: "$kriyaId",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $ne: null },
          count: { $gt: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/conflicts-trans", async (req, res) => {
  try {
    const data = await PaymentDetail.aggregate([
      {
        $group: {
          _id: "$transactionId",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $ne: null },
          count: { $gt: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    console.log(data);
    // for (let i = 0; i < data.length; i++) {
    //   let oldId = data[i]._id;
    //   console.log("\n\nSTARTING: " + oldId);
    //   for (let j = 0; j < data[i].count - 1; j++) {
    //     const newId = await generateKriyaID();
    //     const user = await User.findOneAndUpdate(
    //       { kriyaId: oldId },
    //       { kriyaId: newId },
    //       { new: true }
    //     );
    //     await sendMail(
    //       user.email,
    //       "Thank you for registering",
    //       registrationConfirmTemplate(user.name, newId)
    //     );
    //     console.log(oldId, newId, user);
    //   }
    // }
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/new-id", async (req, res) => {
  try {
    const data = await generateKriyaID();
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/conflicts-pay", async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $match: {
          isPaid: false,
          kriyaId: { $ne: null },
        },
      },
      {
        $sort: { kriyaId: 1 },
      },
    ]);
    for (let i = 0; i < data.length; i++) {
      const pay = await PaymentDetail.findOne({
        email: data[i].email,
        status: "SUCCESS",
        eventId: "-1",
        type: "GENERAL",
      });
      if (pay) {
        // await User.findOneAndUpdate(
        //   { kriyaId: pay.kriyaId },
        //   { isPaid: true },
        //   { new: true }
        // );
        console.log(pay.kriyaId);
      }
    }
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// import { jsonData } from "./TRANS230322.js";

import jsonData from "../data/Kriya-230201-230323-6-45-pm.js";

router.get("/from-st", async (req, res) => {
  try {
    const pays = await PaymentDetail.find({});
    const notFound = [];
    const stGotButNotUS = [];
    const weGotButNotST = [];
    const stAndUsGot = [];
    const bothNotGot = [];
    for (let i = 0; i < jsonData.length; i++) {
      const pay = pays.find((p) => p.transactionId === jsonData[i].SMTXNID);
      if (pay) {
        if (jsonData[i].STATUS_DESC === "SUCCESS" && pay.status !== "SUCCESS") {
          stGotButNotUS.push(jsonData[i].SMTXNID);
          // const p = await PaymentDetail.findOneAndUpdate(
          //   { transactionId: jsonData[i].SMTXNID },
          //   { status: "SUCCESS" },
          //   { new: true }
          // );
          // console.log(p.kriyaId);
        } else if (
          jsonData[i].STATUS_DESC !== "SUCCESS" &&
          pay.status === "SUCCESS"
        ) {
          weGotButNotST.push(jsonData[i].SMTXNID);
        } else if (
          jsonData[i].STATUS_DESC === "SUCCESS" &&
          pay.status === "SUCCESS"
        ) {
          stAndUsGot.push(jsonData[i].SMTXNID);
        } else {
          bothNotGot.push(jsonData[i].SMTXNID);
        }
      } else {
        notFound.push(jsonData[i].SMTXNID);
      }
    }
    // const txn = [
    //   "TXN_KRIYA_048282",
    //   "TXN_KRIYA_048928",
    //   "TXN_KRIYA_048947",
    //   "TXN_KRIYA_049035",
    //   "TXN_KRIYA_012639",
    //   "TXN_KRIYA_044959",
    //   "TXN_KRIYA_045988",
    //   "TXN_KRIYA_047616",
    //   "TXN_KRIYA_048850",
    //   "TXN_KRIYA_044718",
    //   "TXN_KRIYA_048328",
    // ];

    // let sum = 0;
    // for (let i = 0; i < txn.length; i++) {
    //   const pay = pays.find((p) => p.transactionId === txn[i]);
    //   sum += pay.fee;
    // }

    return res.status(200).json({
      notFound,
      stGotButNotUS,
      weGotButNotST,
      stAndUsGot,
      bothNotGot,
      stGotButNotUSCount: stGotButNotUS.length,
      weGotButNotSTCount: weGotButNotST.length,
      stAndUsGotCount: stAndUsGot.length,
      bothNotGotCount: bothNotGot.length,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/acc", async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $match: {
          accomodation: "Yes",
          kriyaId: { $ne: null },
        },
      },
    ]);
    return res
      .status(200)
      .json({ data: data.map((d) => d.email), length: data.length });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

import data from "./TRANS-22-03-23.js";

router.get("/id-txn-user", async (req, res) => {
  try {
    // const data = await PaymentDetail.aggregate([
    //   {
    //     $match: {
    //       kriyaId: { $ne: null },
    //     },
    //   },
    //   {
    //     $sort: { kriyaId: 1 },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "email",
    //       foreignField: "email",
    //       as: "user",
    //     },
    //   },
    //   {
    //     $match: {
    //       kriyaId: { $ne: "$user.0.kriyaId" },
    //     },
    //   },
    // ]);

    for (let i = 0; i < data.length; i++) {
      if (data[i].kriyaId !== data[i].user[0].kriyaId) console.log(data[i]);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
