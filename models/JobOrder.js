const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const EquipmentUsed = mongoose.Schema({
    _id: false,
    equipmentID: { type: mongoose.Schema.Types.ObjectId, ref: "Equipments" },
    quantity: Number,
});

const JobOrderSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "JO-"),
    },
    date: Date,
    jobDate: Date,
    branch: {
        type: String,
        uppercase: true,
        trim: true,
    },
    status: {
        type: String,
        uppercase: true,
        trim: true,
        enum: ["PENDING", "ONGOING", "CLOSED"],
    }, // Can be "PENDING", "ONGOING", "CLOSED"
    type: {
        type: String,
        uppercase: true,
        trim: true,
        enum: ["INSTALLATION", "MAINTENANCE"],
    }, // Can be "INSTALLATION", "MAINTENANCE"
    remarks: {
        type: String,
        uppercase: true,
        trim: true,
    },
    equipmentsUsed: [EquipmentUsed],
    inquiryID: { type: mongoose.Schema.Types.ObjectId, ref: "Inquiries" }, // For MAINTENANCE JOs only
    applicationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Applications",
    }, // For INSTALLATIONS JOs only
    accountID: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
    teamID: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

JobOrderSchema.plugin(AutoIncrement, { inc_field: "jo_ctr" });

module.exports = mongoose.model("JobOrders", JobOrderSchema);
