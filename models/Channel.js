const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ChannelSchema = mongoose.Schema({
    prefix: String,
    description: String,
    assignedNumber: String,
    label: String,
    bannerImageURL: String,
    videoURL: String,
    channelImages: [String],
    packages: [mongoose.Schema.Types.ObjectId],
    isDeleted: Boolean,
});

ChannelSchema.plugin(AutoIncrement, { inc_field: "cha_ctr" });

module.exports = mongoose.model("Channels", ChannelSchema);
