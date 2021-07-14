const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const EquipmentUsed = mongoose.Schema({
    _id: false,
    equipmentID: mongoose.Schema.Types.ObjectId,
    quantity: Number,
});

const JobOrderSchema = mongoose.Schema({
    prefix: String,
    date: Date,
    jobDate: Date,
    branch: String,
    status: String, // Can be "PENDING", "ONGOING", "CLOSED"
    type: String, // Can be "INSTALLATION", "MAINTENANCE"
    remarks: String,
    equipmentsUsed: [EquipmentUsed],
    inquiryID: mongoose.Schema.Types.ObjectId, // For MAINTENANCE JOs only
    applicationID: mongoose.Schema.Types.ObjectId, // For INSTALLATIONS JOs only
    accountID: mongoose.Schema.Types.ObjectId,
    teamID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

JobOrderSchema.plugin(AutoIncrement, { inc_field: "jo_ctr" });

module.exports = mongoose.model("JobOrders", JobOrderSchema);
