const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const TeamSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "TEAM-"),
    },
    description: {
        type: String,
        uppercase: true,
        trim: true,
    },
    installations: Number,
    areaID: { type: mongoose.Schema.Types.ObjectId, ref: "Areas" },
    personnelIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Personnel" }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

TeamSchema.plugin(AutoIncrement, { inc_field: "team_ctr" });

module.exports = mongoose.model("Teams", TeamSchema);
