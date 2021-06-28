const mongoose = require("mongoose");

const JobOrderSchema = mongoose.Schema({
    name: String,
    description: String,
    status: String,
    type: String,
    remarks: String,
    equipmentsUsed: [mongoose.Schema.Types.ObjectId],
    inquiryID: mongoose.Schema.Types.ObjectId,
    accountID: mongoose.Schema.Types.ObjectId,
    teamID: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("JobOrders", JobOrderSchema);
