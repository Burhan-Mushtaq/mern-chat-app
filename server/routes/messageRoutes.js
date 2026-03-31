const express = require("express");
const router = express.Router();
const Message = require('../models/Message');

router.post("/", async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    const newMessage = new Message({
      sender,
      receiver,
      text,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:userId", async (req, res) => {
  try {
    const currentUser = req.user?.id || req.headers.userid; // fallback

    const messages = await Message.find({
      $or: [
        { sender: currentUser, receiver: req.params.userId },
        { sender: req.params.userId, receiver: currentUser },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/read/:sender/:receiver", async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    await Message.updateMany(
      { sender, receiver, isRead: false },
      { isRead: true }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;