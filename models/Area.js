const mongoose = require("mongoose");

const AreaSchema = mongoose.Schema({
    name: String,
    description: String,
    imageURL: String,
});

module.exports = mongoose.model("Areas", AreaSchema);
