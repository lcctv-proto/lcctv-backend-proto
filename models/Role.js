const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RoleSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        uppercase: true,
        trim: true,
    },
    isDeleted: Boolean,
});

RoleSchema.plugin(AutoIncrement, { inc_field: "role_ctr" });

module.exports = mongoose.model("Roles", RoleSchema);
