const express = require("express");
const mongoose = require("mongoose");
const Notes = require("../modules/Notes.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// Create a note
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // comes from JWT
   console.log("Decoded user from token:", req.user);
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = new Notes({ title, content, userId });
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
});

// Get all notes for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Notes.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
});

// Get single note by ID (must belong to user)
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Notes.findOne({ _id: id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error fetching note", error: error.message });
  }
});

// Update note (only if owned by user)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const updatedNote = await Notes.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // check ownership
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedNote) return res.status(404).json({ message: "Note not found or not authorized" });

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
});

// Delete note (only if owned by user)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const deletedNote = await Notes.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedNote) return res.status(404).json({ message: "Note not found or not authorized" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
});


module.exports = router;
