const mongoose = require("mongoose");

const PackageSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Packages", PackageSchema);
