const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ChannelSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    assignedNumber: {
        type: String,
        uppercase: true,
        trim: true,
    },
    label: {
        type: String,
        uppercase: true,
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
    isDeleted: Boolean,
});

ChannelSchema.plugin(AutoIncrement, { inc_field: "cha_ctr" });

module.exports = mongoose.model("Channels", ChannelSchema);
