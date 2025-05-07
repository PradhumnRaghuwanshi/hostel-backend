const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Room = require("../models/Room");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("roomAllocated");
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("roomAllocated");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      phoneNumber,
      roomAllocated,
      feeStatus,
      detailPhotos
    } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      gender,
      phoneNumber,
      roomAllocated: roomAllocated || null,
      feeStatus: feeStatus || "unpaid",
      detailPhotos: {
        rentAgreement: detailPhotos?.rentAgreement || [],
        aadharPhotos: detailPhotos?.aadharPhotos || [],
        passportPhoto: detailPhotos?.passportPhoto || ""
      }
    });

    const room = await Room.findById(roomAllocated)

    if(!room){
      return res.status(404).json({message: "Room Not Found"})
    }

    if(room.capacity > room.occupied){
      await newUser.save();
    } else {
      return res.status(404).json({message: "Room is fully occupied"})
    }
  
    room.occupied = room.occupied + 1
    await room.save()


    res.status(201).json({ data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (email/password)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        roomAllocated: user.roomAllocated,
        phoneNumber: user.phoneNumber,
        feeStatus: user.feeStatus,
        detailPhotos: user.detailPhotos,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT (dummy handler)
router.post("/logout", (req, res) => {
  req.session?.destroy?.(() => {
    res.status(200).json({ message: "Logout successful" });
  });
});

module.exports = router;
