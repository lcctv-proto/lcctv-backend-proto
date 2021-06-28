const mongoose = require("mongoose");

const ChannelSchema = mongoose.Schema({
    name: String,
    description: String,
    assignedNumber: String,
    label: String,
    bannerImageURL: String,
    videoURL: String,
    channelImages: [String],
});

module.exports = mongoose.model("Channels", ChannelSchema);
