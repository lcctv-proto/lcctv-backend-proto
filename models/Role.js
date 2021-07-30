const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const RoleSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "ROLE-"),
    },
    description: {
        type: String,
        uppercase: true,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

RoleSchema.plugin(AutoIncrement, { inc_field: "role_ctr" });

module.exports = mongoose.model("Roles", RoleSchema);
