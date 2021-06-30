const mongoose = require("mongoose");

const AreaSchema = mongoose.Schema({
    name: String,
    description: String,
    imageURL: String,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Areas", AreaSchema);
