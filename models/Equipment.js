const mongoose = require("mongoose");

const EquipmentSchema = mongoose.Schema({
    name: String,
    label: String,
    description: String,
    price: Number,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Equipments", EquipmentSchema);
