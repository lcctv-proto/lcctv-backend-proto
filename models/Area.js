const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const AreaSchema = mongoose.Schema({
    prefix: String,
    description: String,
    imageURL: String,
    isDeleted: Boolean,
});

AreaSchema.plugin(AutoIncrement, { inc_field: "area_ctr" });

module.exports = mongoose.model("Areas", AreaSchema);
