const mongoose = require("mongoose");

const ApplicationSchema = mongoose.Schema({
    referenceNumber: String,
    date: Date,
    status: String,
    step: Number,
    remarks: String,
    accountID: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Applications", ApplicationSchema);
