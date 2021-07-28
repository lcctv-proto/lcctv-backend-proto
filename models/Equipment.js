const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const EquipmentSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        trim: true,
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
    isDeleted: Boolean,
});

EquipmentSchema.plugin(AutoIncrement, { inc_field: "eqpmnt_ctr" });

module.exports = mongoose.model("Equipments", EquipmentSchema);
