const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const PaymentSchema = mongoose.Schema({
    prefix: String,
    date: Date,
    feeIDs: [mongoose.Schema.Types.ObjectId],
    amountPaid: Number,
    dateIssued: Date, // For Check, GCash, PayMaya, ShopeePay, BayadCenter, dragonPay
    receiptNumber: String, // For Cash, Check,
    referenceNumber: String, // For GCash, PayMaya, ShopeePay, BayadCenter, dragonPay,
    modeOfPayment: String, // Can be Cash, Check, GCash, PayMaya, ShopeePay, BayadCenter, dragonPay
    issuingBank: String, // For Check
    checkNumber: String, // For Check
    checkAmount: Number, // For Check
    remarks: String,
    accountID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

PaymentSchema.plugin(AutoIncrement, { inc_field: "pay_ctr" });

module.exports = mongoose.model("Payments", PaymentSchema);
