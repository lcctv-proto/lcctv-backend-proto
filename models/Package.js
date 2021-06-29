const mongoose = require("mongoose");

const PackageSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    channels: [mongoose.Schema.Types.ObjectId],
    isDeleted: Boolean,
});

module.exports = mongoose.model("Packages", PackageSchema);
