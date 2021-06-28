const mongoose = require("mongoose");

const EquipmentSchema = mongoose.Schema({
    name: String,
    label: String,
    description: String,
    price: Number,
});

module.exports = mongoose.model("Equipments", EquipmentSchema);
