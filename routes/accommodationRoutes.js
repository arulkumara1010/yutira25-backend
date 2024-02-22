import { Router } from "express";
import Accommodation from "../models/Accommodation.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.status(200).json({ accommodations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get paid users
router.get("/paid", async (req, res) => {
  try {
    const malePaid = await Accommodation.find({ payment: true, gender: "Male" });
    const femalePaid = await Accommodation.find({ payment: true, gender: "Female"});
    res.status(200).json({ malePaid, femalePaid });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/email/:email", async (req, res) => {
  try {
    const accommodations = await Accommodation.findOne({ email: req.params.email });
    res.status(200).json({ accommodations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/kriyaId/:kriyaId", async (req, res) => {
  try {
    const accommodations = await Accommodation.findOne({ kriyaId: req.params.kriyaId });
    res.status(200).json({ accommodations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const accommodation = await Accommodation.create(req.body);
    res.status(200).json({ accommodation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/email/:email", async (req, res) => {
  try {
    const accommodation = await Accommodation.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    res.status(200).json({ accommodation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ accommodation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const maleStats = await Accommodation.aggregate([
      {
        $match: {
          gender: "Male",
        },
      },
      {
        $group: {
          _id: "$roomType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          roomType: "$_id",
          count: 1,
        },
      },
    ]);

    const femaleStats = await Accommodation.aggregate([
      {
        $match: {
          gender: "Female",
        },
      },
      {
        $group: {
          _id: "$roomType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          roomType: "$_id",
          count: 1,
        },
      },
    ]);

    const breakfast1 = await Accommodation.aggregate([
      {
        $match: {
          breakfast1: true,
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    const breakfast2 = await Accommodation.aggregate([
      {
        $match: {
          breakfast2: true,
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    const breakfast3 = await Accommodation.aggregate([
      {
        $match: {
          breakfast3: true,
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    const lunch1 = await Accommodation.aggregate([
      {
        $match: {
          lunch1: true,
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    const lunch2 = await Accommodation.aggregate([
      {
        $match: {
          lunch2: true,
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    const lunch3 = await Accommodation.aggregate([
      {
        $match: {
          lunch3: true,
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    const dinner1 = await Accommodation.aggregate([
      {
        $match: {
          dinner1: true,
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    const dinner2 = await Accommodation.aggregate([
      {
        $match: {
          dinner2: true,
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    

    const amenities = await Accommodation.aggregate([
      {
        $match: {
          amenities: "Yes",
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    const maleAmenities = await Accommodation.aggregate([
      {
        $match: {
          amenities: "Yes",
          gender: "Male",
        },
      },
      {
        $group: {
          _id: { from: "$from", to: "$to" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          from: "$_id.from",
          to: "$_id.to",
          count: 1,
        },
      },
      {
        $sort: {
          from: 1,
          to: 1,
        },
      },
    ]);

    const femaleAmenities = await Accommodation.aggregate([
      {
        $match: {
          amenities: "Yes",
          gender: "Female",
        },
      },
      {
        $group: {
          _id: { from: "$from", to: "$to" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          from: "$_id.from",
          to: "$_id.to",
          count: 1,
        },
      },
      {
        $sort: {
          from: 1,
          to: 1,
        },
      },
    ]);

    const daysSplit = await Accommodation.aggregate([
      {
        $group: {
          _id: "$days",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          days: "$_id",
          count: 1,
        },
      },
    ]);

    const fromTo = await Accommodation.aggregate([
      {
        $group: {
          _id: { from: "$from", to: "$to" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          from: "$_id.from",
          to: "$_id.to",
          count: 1,
        },
      },
    ]);

    const maleDetails = await Accommodation.aggregate([
      {
        $match: {
          gender: "Male",
        },
      },
      {
        $group: {
          _id: { from: "$from", to: "$to", roomType: "$roomType"},
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          from: "$_id.from",
          to: "$_id.to",
          roomType: "$_id.roomType",
          count: 1,
        },
      },
    ]);

    const femaleDetails = await Accommodation.aggregate([
      {
        $match: {
          gender: "Female",
        },
      },
      {
        $group: {
          _id: { from: "$from", to: "$to", roomType: "$roomType"},
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          from: "$_id.from",
          to: "$_id.to",
          roomType: "$_id.roomType",
          count: 1,
        },
      },
    ]);

    const totalRooms = await Accommodation.countDocuments();

    res.status(200).json({ maleStats, femaleStats, breakfast1, breakfast2, breakfast3,lunch1,lunch2,lunch3, dinner1, dinner2, amenities, maleAmenities, femaleAmenities, daysSplit, fromTo, maleDetails, femaleDetails, totalRooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
