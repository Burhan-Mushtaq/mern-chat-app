const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Message = require("../models/Message");


// 🔥 GET ALL USERS WITH:
// - unread count
// - last message preview
router.get("/:currentUserId", async (req, res) => {
  try {
    const { currentUserId } = req.params;

    // 🔹 Get all users except current user
    const users = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");

    // 🔹 Add unread count + last message
    const usersWithData = await Promise.all(
      users.map(async (user) => {
        
        // 📩 Unread messages count
        const unreadCount = await Message.countDocuments({
          sender: user._id,
          receiver: currentUserId,
          isRead: false,
        });

        // 💬 Last message
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId },
          ],
        })
          .sort({ createdAt: -1 });

        return {
          ...user._doc,
          unreadCount,
          lastMessage: lastMessage?.text || "",
          lastMessageTime: lastMessage?.createdAt || null,
        };
      })
    );

    res.json(usersWithData);

  } catch (err) {
    console.log("User route error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;