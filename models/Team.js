const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const TeamSchema = mongoose.Schema({
    prefix: String,
    description: String,
    installations: Number,
    areaID: mongoose.Schema.Types.ObjectId,
    personnelIDs: [mongoose.Schema.Types.ObjectId],
    isDeleted: Boolean,
});

TeamSchema.plugin(AutoIncrement, { inc_field: "team_ctr" });
module.exports = mongoose.model("Teams", TeamSchema);
