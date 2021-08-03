const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const InvoiceSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "INV-"),
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    amountDue: Number,
    accountID: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

InvoiceSchema.plugin(AutoIncrement, { inc_field: "inv_ctr" });

module.exports = mongoose.model("Invoices", InvoiceSchema);
