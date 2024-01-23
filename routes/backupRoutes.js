import { Router } from "express";
import PaymentDetail from "../models/PaymentDetail.js";
import User from "../models/User.js";
import Registration from "../models/Registration.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const payments = await PaymentDetail.find({});
    const users = await User.find({});
    const registrations = await Registration.find({});
    if (!payments || !users || !registrations) {
      return res.status(404).json({ message: "No data found" });
    }
    const paymentsJson = JSON.stringify(payments);
    const usersJson = JSON.stringify(users);
    const registrationsJson = JSON.stringify(registrations);
    
    return res.status(200).json({ payments, users, registrations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
