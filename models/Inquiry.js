const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const InquirySchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "INQ-"),
    },
    status: {
        type: String,
        uppercase: true,
        trim: true,
        default: "PENDING", // "DENIED", "CLOSED(TO JO)", "CLOSED(GEN INQ)", "CLOSED(CASHIER)"
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    contactNumber: {
        type: String,
        uppercase: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    type: {
        type: String,
        uppercase: true,
        trim: true,
    },
    description: {
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

InquirySchema.plugin(AutoIncrement, { inc_field: "inq_ctr" });

module.exports = mongoose.model("Inquiries", InquirySchema);
