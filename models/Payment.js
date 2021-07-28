const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const PaymentSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        trim: true,
    },
    date: Date,
    feeIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fees" }],
    amountPaid: Number,
    dateIssued: Date, // For Check, GCash, PayMaya, ShopeePay, BayadCenter, dragonPay
    receiptNumber: {
        type: String,
        trim: true,
    }, // For Cash, Check,
    referenceNumber: {
        type: String,
        trim: true,
    }, // For GCash, PayMaya, ShopeePay, BayadCenter, dragonPay,
    modeOfPayment: {
        type: String,
        uppercase: true,
        trim: true,
        enum: [
            "CASH",
            "CHECK",
            "GCASH",
            "PAYMAYA",
            "SHOPEEPAY",
            "BAYADCENTER",
            "DRAGONPAY",
        ],
    }, // Can be Cash, Check, GCash, PayMaya, ShopeePay, BayadCenter, dragonPay
    issuingBank: {
        type: String,
        uppercase: true,
        trim: true,
    }, // For Check
    checkNumber: {
        type: String,
        trim: true,
    }, // For Check
    checkAmount: Number, // For Check
    remarks: {
        type: String,
        uppercase: true,
        trim: true,
    },
    accountID: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
    isDeleted: Boolean,
});

PaymentSchema.plugin(AutoIncrement, { inc_field: "pay_ctr" });

module.exports = mongoose.model("Payments", PaymentSchema);
