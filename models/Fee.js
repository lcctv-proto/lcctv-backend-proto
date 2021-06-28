const mongoose = require("mongoose");

const FeeSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
});

module.exports = mongoose.model("Fees", FeeSchema);
