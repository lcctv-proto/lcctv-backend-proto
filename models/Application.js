const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const ApplicationSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "REF-"),
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    status: {
        type: String,
        uppercase: true,
        default: "PENDING PAYMENT",
    },
    step: {
        type: Number,
        default: 1,
    },
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

ApplicationSchema.plugin(AutoIncrement, { inc_field: "ref_ctr" });

module.exports = mongoose.model("Applications", ApplicationSchema);
