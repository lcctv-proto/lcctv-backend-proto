const mongoose = require("mongoose");

const InvoiceSchema = mongoose.Schema({
    name: String,
    date: Date,
    amountDue: Number,
    accountID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Invoices", InvoiceSchema);
