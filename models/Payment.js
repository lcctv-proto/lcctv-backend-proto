const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const PaymentSchema = mongoose.Schema({
    prefix: String,
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

PaymentSchema.plugin(AutoIncrement, { inc_field: "pay_ctr" });

module.exports = mongoose.model("Payments", PaymentSchema);
