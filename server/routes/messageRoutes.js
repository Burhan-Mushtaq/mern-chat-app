const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:room" , async (req,res) => {
    try{
        const messages = await Message.find({ room : req.params.room })
            .sort({ createdAt: 1});

        res.json(messages);
    }
    catch (err){
        console.log(err)
        res.status(500).json({error : "Server Error"});
    }
});

module.exports = router;