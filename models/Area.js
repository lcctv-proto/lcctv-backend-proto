const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const AreaSchema = mongoose.Schema({
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
    imageURL: {
        type: String,
        trim: true,
    },
    isDeleted: Boolean,
});

AreaSchema.plugin(AutoIncrement, { inc_field: "area_ctr" });

module.exports = mongoose.model("Areas", AreaSchema);
