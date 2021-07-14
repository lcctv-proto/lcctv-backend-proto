const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const NameSchema = mongoose.Schema({
    _id: false,
    firstName: String,
    middleName: String,
    lastName: String,
});

const PersonnelSchema = mongoose.Schema({
    prefix: String,
    personnelName: NameSchema,
    username: String,
    password: String,
    roleID: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

PersonnelSchema.plugin(AutoIncrement, { inc_field: "emp_ctr" });

module.exports = mongoose.model("Personnel", PersonnelSchema);
