const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const EquipmentSchema = mongoose.Schema({
    prefix: String,
    label: String,
    description: String,
    price: Number,
    isDeleted: Boolean,
});

EquipmentSchema.plugin(AutoIncrement, { inc_field: "eqpmnt_ctr" });

module.exports = mongoose.model("Equipments", EquipmentSchema);
