const mongoose = require("mongoose");

const FeeSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Fees", FeeSchema);
