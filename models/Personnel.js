const mongoose = require("mongoose");

const NameSchema = mongoose.Schema({
    _id: false,
    firstName: String,
    middleName: String,
    lastName: String,
});

const PersonnelSchema = mongoose.Schema({
    name: String,
    personnelName: NameSchema,
    username: String,
    password: String,
    role: mongoose.Schema.Types.ObjectId,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Personnel", PersonnelSchema);
