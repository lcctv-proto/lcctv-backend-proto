const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RoleSchema = mongoose.Schema({
    prefix: String,
    description: String,
    isDeleted: Boolean,
});

RoleSchema.plugin(AutoIncrement, { inc_field: "role_ctr" });

module.exports = mongoose.model("Roles", RoleSchema);
