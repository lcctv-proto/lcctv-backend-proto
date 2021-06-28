const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
    name: String,
    description: String,
});

module.exports = mongoose.model("Roles", RoleSchema);
