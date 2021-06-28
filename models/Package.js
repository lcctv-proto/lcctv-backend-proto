const mongoose = require("mongoose");

const PackageSchema = mongoose.Schema({
    Name: String,
    Description: String,
    Price: Number,
    Channels: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model("Packages", PackageSchema);
