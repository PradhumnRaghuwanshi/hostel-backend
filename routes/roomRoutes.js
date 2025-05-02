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

// Get single room by ID
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("students", "name email");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ data: room });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a room
router.post("/", async (req, res) => {
  try {
    const room = new Room(req.body);
    const newRoom = await room.save();
    res.status(201).json({ data: newRoom });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update room by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ data: updatedRoom });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete room
router.delete("/:id", async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
