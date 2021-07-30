const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const EquipmentSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "EQMPNT-"),
    },
    label: {
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
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

EquipmentSchema.plugin(AutoIncrement, { inc_field: "eqpmnt_ctr" });

module.exports = mongoose.model("Equipments", EquipmentSchema);
