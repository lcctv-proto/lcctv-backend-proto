const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const TeamSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        uppercase: true,
        trim: true,
    },
    installations: Number,
    areaID: { type: mongoose.Schema.Types.ObjectId, ref: "Areas" },
    personnelIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Personnel" }],
    isDeleted: Boolean,
});

TeamSchema.plugin(AutoIncrement, { inc_field: "team_ctr" });

module.exports = mongoose.model("Teams", TeamSchema);
