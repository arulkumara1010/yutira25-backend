import { Router } from "express";
import User from "../models/User.js";
import PaymentDetail from "../models/PaymentDetail.js";
import Registration from "../models/Registration.js";
import Paper from "../models/Paper.js";
import { sendMail } from "./mailRoutes.js";
import { registrationConfirmTemplate } from "../template-generators/registrationConfirm.js";

const router = Router();

const generateKriyaID = async (probe = 0) => {
  try {
    const count = await User.countDocuments({ kriyaId: { $ne: null } });
    let newId =
      "YUTIRA" + (count - 1000 + probe * probe).toString().padStart(4, "0");
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

router.get("/", async (req, res) => {
  try {
    const userCount = await User.countDocuments({ kriyaId: { $ne: null } });

    const psgUserCount = await User.countDocuments({
      kriyaId: { $ne: null },
      email: { $regex: /@psgtech.ac.in/ },
    });

    const paidUserCount = await User.countDocuments({
      isPaid: true,
      kriyaId: { $ne: null },
    });

    const paidPsgUserCount = await User.countDocuments({
      isPaid: true,
      kriyaId: { $ne: null },
      email: { $regex: /@psgtech.ac.in/ },
    });

    const totalEventCount = await Registration.countDocuments({
      eventId: { $ne: null },
      email: { $ne: null },
    });

    const psgEventCount = await Registration.countDocuments({
      eventId: { $ne: null },
      email: { $ne: null } && { $regex: /@psgtech.ac.in/ },
    });

    const totalWorkshopCount = await PaymentDetail.countDocuments({
      status: "SUCCESS",
      kriyaId: { $ne: null },
      eventId: { $ne: "-1" },
    });

    const psgWorkshopCount = await PaymentDetail.countDocuments({
      status: "SUCCESS",
      kriyaId: { $ne: null },
      eventId: { $ne: "-1" },
      email: { $regex: /@psgtech.ac.in/ },
    });

    const totalPaperCount = await Paper.countDocuments({
      email: { $ne: null },
      paperId: { $ne: null },
    });

    const psgPaperCount = await Paper.countDocuments({
      email: { $ne: null } && { $regex: /@psgtech.ac.in/ },
      paperId: { $ne: null },
    });

    const accommodationCount = await User.countDocuments({
      kriyaId: { $ne: null },
      accomodation: { $ne: null } && "Yes",
    });

    const referralCount = await User.countDocuments({
      kriyaId: { $ne: null },
      referral: { $ne: null },
    });

    return res.status(200).json({
      userCount,
      psgUserCount,
      paidUserCount,
      paidPsgUserCount,
      totalEventCount,
      psgEventCount,
      totalWorkshopCount,
      psgWorkshopCount,
      totalPaperCount,
      psgPaperCount,
      accommodationCount,
      referralCount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/psg-participants", async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          email: { $regex: /@psgtech.ac.in/ },
        },
      },
    ]);
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/non-paid", async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          isPaid: false,
        },
      },
      {
        $group: {
          _id: "$email",
        },
      },
    ]);
    return res.status(200).json({ data: data.map((d) => d._id) });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/participants", async (req, res) => {
  try {
    const data = await PaymentDetail.find({
      status: "SUCCESS",
      kriyaId: { $ne: null },
      eventId: "-1",
    });
    return res.status(200).json({
      data: data.map((d) => ({
        email: d.email,
        name: d.name,
        kriyaId: d.kriyaId,
      })),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/by-year", async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          college:
            "PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004",
        },
      },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    return res.status(200).json({ data, count: data.length });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/by-year-paid", async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          college:
            "PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004",
          isPaid: true,
        },
      },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    return res.status(200).json({ data, count: data.length });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/workshop-but-no-general", async (req, res) => {
  try {
    const data2 = await PaymentDetail.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          status: "SUCCESS",
          eventId: "-1",
        },
      },
      {
        $group: {
          _id: "$kriyaId",
          count: { $sum: 1 },
        },
      },
    ]);

    const data3 = await PaymentDetail.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          status: "SUCCESS",
          eventId: { $ne: "-1" },
        },
      },
      {
        $project: {
          kriyaId: 1,
          email: 1,
        },
      },
      {
        $group: {
          _id: "$kriyaId",
          count: { $sum: 1 },
        },
      },
    ]);

    const data4 = await PaymentDetail.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          status: "SUCCESS",
          eventId: { $ne: "-1" },
        },
      },
      {
        $project: {
          kriyaId: 1,
          email: 1,
        },
      },
      {
        $group: {
          _id: "$kriyaId",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    const data2Mod = data2.map((item) => item._id);
    const data3Mod = data3.map((item) => item._id);
    const data4Mod = data4.map((item) => item._id);

    // console.log(data2Mod);
    // console.log(data3Mod);

    const bothWSandGEN = data2Mod.filter((item) => data3Mod.includes(item));
    const WSbutNotGEN = data3Mod.filter((item) => !bothWSandGEN.includes(item));

    const bothWSandGENGt1 = data2Mod.filter((item) => data4Mod.includes(item));
    const WSbutNotGENGt1 = data4Mod.filter(
      (item) => !bothWSandGENGt1.includes(item)
    );

    return res.status(200).json({
      bothWSandGEN,
      WSbutNotGEN,
      count: WSbutNotGEN.length,
      needed: WSbutNotGENGt1.length,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/workshop-today", async (req, res) => {
  try {
    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    const workshops = await PaymentDetail.aggregate([
      {
        $match: {
          status: "SUCCESS",
          kriyaId: { $ne: null },
          datetime: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$eventId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const total = await PaymentDetail.countDocuments({
      status: "SUCCESS",
      kriyaId: { $ne: null },
      datetime: { $gte: start, $lt: end },
      eventId: { $ne: "-1" },
    });
    return res.status(200).json({ workshops, total });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/college-stats", async (req, res) => {
  try {
    const collegeWiseCount = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          college: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$college",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const paidCollegeWiseCount = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: "$college",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // const nullCollege = await User.find( { kriyaId: { $ne: null }, college: null } );
    return res.status(200).json({ collegeWiseCount, paidCollegeWiseCount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/event-stats", async (req, res) => {
  try {
    const eventWiseCount = await Registration.aggregate([
      {
        $match: {
          eventId: { $ne: null },
          email: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$eventId",
          count: { $sum: 1 },
          psgCount: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$email", regex: /@psgtech.ac.in/ } },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json({ eventWiseCount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/dept-wise", async (req, res) => {
  try {
    const deptWiseCount = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          isPaid: true,
          college:
            "PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004",
        },
      },
      {
        $group: {
          _id: { department: "$department", year: "$year" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return res.status(200).json({ deptWiseCount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/workshop-stats", async (req, res) => {
  try {
    const workshopWiseCount = await PaymentDetail.aggregate([
      {
        $match: {
          status: "SUCCESS",
          kriyaId: { $ne: null },
          eventId: { $ne: "-1" },
        },
      },
      {
        $group: {
          _id: "$eventId",
          count: { $sum: 1 },
          psgCount: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$email", regex: /@psgtech.ac.in/ } },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return res.status(200).json({ workshopWiseCount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/paper-stats", async (req, res) => {
  try {
    const paperWiseCount = await Paper.aggregate([
      {
        $match: {
          email: { $ne: null },
          paperId: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$paperId",
          count: { $sum: 1 },
          psgCount: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$email", regex: /@psgtech.ac.in/ } },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return res.status(200).json({ paperWiseCount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/accommodation-details", async (req, res) => {
  try {
    const accommodationDetails = await User.find({
      kriyaId: { $ne: null },
      accomodation: { $ne: null } && "Yes",
    }).select("name email college phone");
    return res.status(200).json({ accommodationDetails });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/referral-stats", async (req, res) => {
  try {
    const referralStats = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          referral: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$referral",
          count: { $sum: 1 },
          paidCount: {
            $sum: {
              $cond: [{ $eq: ["$isPaid", true] }, 1, 0],
            },
          },
          // college: { $first: "$college" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    // const referralStats = await User.find({
    //   kriyaId: { $ne: null },
    //   referral: { $ne: null },
    // }).select("name college referral");

    return res.status(200).json({ referralStats });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/graph-stats/:hr", async (req, res) => {
  try {
    const hr = parseInt(req.params.hr);
    const totalData = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            $toDate: {
              $subtract: [
                { $subtract: ["$lastVisited", new Date("1970-01-01")] },
                {
                  $mod: [
                    { $subtract: ["$lastVisited", new Date("1970-01-01")] },
                    1000 * 60 * hr * 60,
                  ],
                },
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const paidData = await User.aggregate([
      {
        $match: {
          kriyaId: { $ne: null },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $toDate: {
              $subtract: [
                { $subtract: ["$lastVisited", new Date("1970-01-01")] },
                {
                  $mod: [
                    { $subtract: ["$lastVisited", new Date("1970-01-01")] },
                    1000 * 60 * hr * 60,
                  ],
                },
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    if (!totalData || !paidData)
      return res.status(404).json({ message: "No data found" });
    return res.status(200).json({
      totalData,
      paidData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/workshop-deets/:id", async (req, res) => {
  try {
    const wsid = req.params.id;
    const wsData = await PaymentDetail.aggregate([
      {
        $match: { status: "SUCCESS", eventId: wsid },
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
    return res.status(200).json(wsData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/certificate/:date", async (req, res) => {
  try {
    const date = Number(req.params.date);
    const attendees = await Registration.find({
      attended: true,
    });

    const dateFiltered = attendees.filter((attendee) => {
      const attendedDate = new Date(attendee.attendedAt);
      return attendedDate.getDate() === date;
    });

    const userDetails = await Promise.all(
      dateFiltered.map(
        async (attendee) => await User.findOne({ email: attendee.email })
      )
    );

    return res.status(200).json(userDetails.map((user) => ({
      name: user.name,
      kriyaId: user.kriyaId,
      email: user.email,
      college: user.college,
      department: user.department,
      phone: user.phone,
      year: user.year,
    })));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
