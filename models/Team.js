const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema({
    name: String,
    description: String,
    installations: Number,
    areaID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Teams", TeamSchema);
