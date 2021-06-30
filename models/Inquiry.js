const mongoose = require("mongoose");

const InquirySchema = mongoose.Schema({
    name: String,
    date: Date,
    contactNumber: String,
    email: String,
    type: String,
    description: String,
    accountID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Inquiries", InquirySchema);
