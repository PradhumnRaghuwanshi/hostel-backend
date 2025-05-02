const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// GET all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("student", "name email");
    res.status(200).json({ data: complaints });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET complaint by ID
router.get("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("student", "name email");
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json({ data: complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST new complaint
router.post("/", async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    const newComplaint = await complaint.save();
    res.status(201).json({ data: newComplaint });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT resolve complaint
router.put("/:id/resolve", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: "resolved", resolvedAt: new Date() },
      { new: true }
    );
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json({ data: complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
