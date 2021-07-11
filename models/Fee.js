const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const FeeSchema = mongoose.Schema({
    prefix: String,
    description: String,
    price: Number,
    isDeleted: Boolean,
});

FeeSchema.plugin(AutoIncrement, { inc_field: "fee_ctr" });

module.exports = mongoose.model("Fees", FeeSchema);
