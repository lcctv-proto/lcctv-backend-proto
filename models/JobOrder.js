const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const JobOrderSchema = mongoose.Schema({
    prefix: String,
    description: String,
    status: String,
    type: String,
    remarks: String,
    equipmentsUsed: [mongoose.Schema.Types.ObjectId],
    inquiryID: mongoose.Schema.Types.ObjectId,
    accountID: mongoose.Schema.Types.ObjectId,
    teamID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

JobOrderSchema.plugin(AutoIncrement, { inc_field: "jo_ctr" });
module.exports = mongoose.model("JobOrders", JobOrderSchema);
