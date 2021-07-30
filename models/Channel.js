const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const ChannelSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "CHA-"),
    },
    description: {
        type: String,
        uppercase: true,
        trim: true,
    },
    assignedNumber: {
        type: String,
        uppercase: true,
        trim: true,
    },
    label: {
        type: String,
        trim: true,
    },
    bannerImageURL: {
        type: String,
        trim: true,
    },
    videoURL: {
        type: String,
        trim: true,
    },
    channelImages: [
        {
            type: String,
            trim: true,
        },
    ],
    packages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Packages" }],
    isDeleted: { type: Boolean, default: false },
});

ChannelSchema.plugin(AutoIncrement, { inc_field: "cha_ctr" });

module.exports = mongoose.model("Channels", ChannelSchema);
