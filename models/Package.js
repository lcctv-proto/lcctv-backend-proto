const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const PackageSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "PKG-"),
    },
    description: {
        type: String,
        uppercase: true,
        trim: true,
    },
    price: Number,
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

PackageSchema.plugin(AutoIncrement, { inc_field: "pkg_ctr" });

module.exports = mongoose.model("Packages", PackageSchema);
