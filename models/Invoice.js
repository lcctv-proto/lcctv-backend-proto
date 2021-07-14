const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const InvoiceSchema = mongoose.Schema({
    prefix: String,
    date: Date,
    amountDue: Number,
    accountID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

InvoiceSchema.plugin(AutoIncrement, { inc_field: "inv_ctr" });

module.exports = mongoose.model("Invoices", InvoiceSchema);
