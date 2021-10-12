const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const NameSchema = mongoose.Schema({
    _id: false,
    firstName: {
        type: String,
        uppercase: true,
        trim: true,
    },
    middleName: {
        type: String,
        uppercase: true,
        trim: true,
    },
    lastName: {
        type: String,
        uppercase: true,
        trim: true,
    },
});

const PersonnelSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "EMP-"),
    },
    personnelName: NameSchema,
    dateEmployed: {
        type: Date,
        default: Date.now(),
    },
    contactNumber: {
        type: String,
        uppercase: true,
        trim: true,
    },
    username: {
        type: String,
        trim: true,
        select: false,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        select: false,
    },
    roleID: { type: mongoose.Schema.Types.ObjectId, ref: "Roles" },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

PersonnelSchema.plugin(AutoIncrement, { inc_field: "emp_ctr" });

module.exports = mongoose.model("Personnel", PersonnelSchema);
