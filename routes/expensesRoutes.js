const express = require("express");
const router = express.Router();
const Expenses = require("../models/Expenses");

// Get all expensess
router.get("/", async (req, res) => {
  try {
    const expensess = await Expenses.find().populate("students", "name email");
    res.status(200).json({ data: expensess });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single expenses by ID
router.get("/:id", async (req, res) => {
  try {
    const expenses = await Expenses.findById(req.params.id).populate("students", "name email");
    if (!expenses) {
      return res.status(404).json({ message: "Expenses not found" });
    }
    res.status(200).json({ data: expenses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a expenses
router.post("/", async (req, res) => {
  try {
    const expenses = new Expenses(req.body);
    const newExpenses = await expenses.save();
    res.status(201).json({ data: newExpenses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update expenses by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedExpenses = await Expenses.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExpenses) {
      return res.status(404).json({ message: "Expenses not found" });
    }
    res.status(200).json({ data: updatedExpenses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete expenses
router.delete("/:id", async (req, res) => {
  try {
    const deletedExpenses = await Expenses.findByIdAndDelete(req.params.id);
    if (!deletedExpenses) {
      return res.status(404).json({ message: "Expenses not found" });
    }
    res.status(200).json({ message: "Expenses deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
