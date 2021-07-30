const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const AreaSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "AREA-"),
    },
    description: {
        type: String,
        uppercase: true,
        trim: true,
    },
    imageURL: {
        type: String,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

AreaSchema.plugin(AutoIncrement, { inc_field: "area_ctr" });

module.exports = mongoose.model("Areas", AreaSchema);
