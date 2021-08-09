const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const PaymentSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "PAY-"),
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    feeIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fees" }],
    amountPaid: Number, // Not needed for Check
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
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

PaymentSchema.plugin(AutoIncrement, { inc_field: "pay_ctr" });

module.exports = mongoose.model("Payments", PaymentSchema);
