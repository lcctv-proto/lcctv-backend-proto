const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const PackageSchema = mongoose.Schema({
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
    price: Number,
    isDeleted: Boolean,
});

PackageSchema.plugin(AutoIncrement, { inc_field: "pkg_ctr" });

module.exports = mongoose.model("Packages", PackageSchema);
