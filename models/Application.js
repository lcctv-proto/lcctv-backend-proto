const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ApplicationSchema = mongoose.Schema({
    prefix: String,
    date: Date,
    status: String,
    step: Number,
    remarks: String,
    accountID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

ApplicationSchema.plugin(AutoIncrement, { inc_field: "ref_ctr" });

module.exports = mongoose.model("Applications", ApplicationSchema);
