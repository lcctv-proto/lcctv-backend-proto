const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const FeeSchema = mongoose.Schema({
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

FeeSchema.plugin(AutoIncrement, { inc_field: "fee_ctr" });

module.exports = mongoose.model("Fees", FeeSchema);
