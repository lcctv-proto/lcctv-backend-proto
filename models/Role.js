const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
    name: String,
    description: String,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Roles", RoleSchema);
