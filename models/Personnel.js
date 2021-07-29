const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

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
        trim: true,
    },
    personnelName: NameSchema,
    username: {
        type: String,
        trim: true,
        select: false,
    },
    password: {
        type: String,
        trim: true,
        select: false,
    },
    roleID: { type: mongoose.Schema.Types.ObjectId, ref: "Roles" },
    isDeleted: Boolean,
});

PersonnelSchema.plugin(AutoIncrement, { inc_field: "emp_ctr" });

module.exports = mongoose.model("Personnel", PersonnelSchema);
