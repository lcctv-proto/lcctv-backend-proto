const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const InvoiceSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        trim: true,
    },
    date: Date,
    amountDue: Number,
    accountID: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
    isDeleted: Boolean,
});

InvoiceSchema.plugin(AutoIncrement, { inc_field: "inv_ctr" });

module.exports = mongoose.model("Invoices", InvoiceSchema);
