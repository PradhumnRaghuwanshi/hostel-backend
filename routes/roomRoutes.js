const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().populate("students", "name email");
    res.status(200).json({ data: rooms });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a room (with duplicate check and validation)
router.post("/", async (req, res) => {
  try {
    const {
      roomNumber,
      type,
      acType,
      capacity,
      occupied,
      rent,
      photo,
      facilities
    } = req.body;

    console.log("Incoming room data:", req.body); // Debugging

    // Validation
    if (!roomNumber || !type || !acType || capacity === undefined || rent === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Duplicate roomNumber check
    const existing = await Room.findOne({ roomNumber });
    if (existing) {
      return res.status(400).json({
        code: 11000,
        message: "Room with this number already exists"
      });
    }

    const newRoom = new Room({
      roomNumber,
      type: type.toLowerCase(),
      acType: acType.toLowerCase(),
      capacity: Number(capacity),
      occupied: Number(occupied) || 0,
      rent: Number(rent),
      photo: photo || "",
      facilities: facilities || []
    });

    const saved = await newRoom.save();
    res.status(201).json({ message: "Room created", data: saved });
  } catch (err) {
    console.error("POST /rooms error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update room
router.put("/:id", async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete room
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
