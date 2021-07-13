const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const InquirySchema = mongoose.Schema({
    prefix: String,
    status: String,
    date: Date,
    contactNumber: String,
    email: String,
    type: String,
    description: String,
    accountID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

InquirySchema.plugin(AutoIncrement, { inc_field: "inq_ctr" });
module.exports = mongoose.model("Inquiries", InquirySchema);
