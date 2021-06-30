const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    amountPaid: Number,
    dateIssued: Date,
    referenceNumber: String,
    modeOfPayment: String,
    remarks: String,
    feeID: [mongoose.Schema.Types.ObjectId],
    accountID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Payments", PaymentSchema);
