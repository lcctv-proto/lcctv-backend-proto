const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ApplicationSchema = mongoose.Schema({
    prefix: String,
    date: Date,
    status: String,
    step: Number,
    remarks: String,
    accountID: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
    isDeleted: Boolean,
});

ApplicationSchema.plugin(AutoIncrement, { inc_field: "ref_ctr" });

module.exports = mongoose.model("Applications", ApplicationSchema);
