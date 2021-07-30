const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { getPrefix } = require("../utils/getPrefix");

const FeeSchema = mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true,
        default: getPrefix("yymmdd", "FEE-"),
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

FeeSchema.plugin(AutoIncrement, { inc_field: "fee_ctr" });

module.exports = mongoose.model("Fees", FeeSchema);
