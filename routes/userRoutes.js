const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all users (Admin can access this)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE new user (Admin can create students)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, gender, role } = req.body;

    // Create a new User
    const newUser = new User({
      name,
      email,
      password, // Store plain text password (not recommended)
      gender,
      role: role || "student", // Default to student if not provided
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json({ data: savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE user (Admin can update user details)
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// DELETE user (Admin can delete a student)
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// LOGIN route (for student login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare plain text password with stored password
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successfully logged in
    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, role: user.role, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT route (student logout)
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

module.exports = router;
