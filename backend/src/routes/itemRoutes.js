import express from "express";
import { Item } from "../models/itemModel.js";
import { User } from "../models/userModel.js";
import authenticate from "../middleware/authenticate.js";

const ageCalculator = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const itemRouter = express.Router();

// GET: Fetch all items for the logged-in user
itemRouter.get("/", authenticate, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });

    const itemsWithAge = items.map((item) => ({
      ...item._doc,
      age: ageCalculator(item.dob),
    }));

    res.status(200).json(itemsWithAge);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});

// POST: Add a new item
itemRouter.post("/", authenticate, async (req, res) => {
  const { name, dob } = req.body;
  if (!name || !dob) {
    return res
      .status(400)
      .json({ message: "Name and date of birth are required" });
  }

  try {
    const newItem = await Item.create({ user: req.user.id, name, dob });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item" });
  }
});

// PUT: Update an item
itemRouter.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, dob } = req.body;

  try {
    const item = await Item.findOne({ _id: id, user: req.user.id });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.name = name;
    item.dob = dob;
    const updatedItem = await item.save();

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
});

// DELETE: Remove an item
itemRouter.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findOneAndDelete({ _id: id, user: req.user.id });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item" });
  }
});

export default itemRouter;
