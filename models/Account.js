const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const NameSchema = mongoose.Schema({
    _id: false,
    firstName: {
        type: String,
        uppercase: true,
        trim: true,
    },
    middleName: {
        type: String,
        uppercase: true,
        trim: true,
    },
    lastName: {
        type: String,
        uppercase: true,
        trim: true,
    },
});

const AdditionalInfoSchema = mongoose.Schema({
    _id: false,
    birthdate: Date,
    nationality: {
        type: String,
        uppercase: true,
        trim: true,
    },
    gender: {
        type: String,
        uppercase: true,
        trim: true,
        enum: ["MALE", "FEMALE"],
    },
    civilStatus: {
        type: String,
        uppercase: true,
        trim: true,
        enum: ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"],
    },
});

const AddressSchema = mongoose.Schema({
    _id: false,
    unit: {
        type: String,
        uppercase: true,
        trim: true,
    },
    street: {
        type: String,
        uppercase: true,
        trim: true,
    },
    barangay: {
        type: String,
        uppercase: true,
        trim: true,
    },
    municipality: {
        type: String,
        uppercase: true,
        trim: true,
    },
    province: {
        type: String,
        uppercase: true,
        trim: true,
    },
    zipCode: {
        type: String,
        uppercase: true,
        trim: true,
    },
    homeOwnership: {
        type: String,
        uppercase: true,
        trim: true,
    },
    residencyYear: Number,
    nearestLandmark: {
        type: String,
        uppercase: true,
        trim: true,
    },
});

const ContactSchema = mongoose.Schema({
    _id: false,
    cellphoneNumber: {
        type: String,
        uppercase: true,
        trim: true,
    },
    telephoneNumber: {
        type: String,
        uppercase: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    motherMaidenName: NameSchema,
    spouseName: NameSchema,
});

const BillingSchema = mongoose.Schema({
    _id: false,
    accountCredit: Number,
    accountDebit: Number,
    startDate: Date,
});

const AccountSchema = mongoose.Schema({
    prefix: String,
    accountName: NameSchema,
    additionalInfo: AdditionalInfoSchema,
    serviceAddress: AddressSchema,
    contactInfo: ContactSchema,
    billingInfo: BillingSchema,
    packageID: { type: mongoose.Schema.Types.ObjectId, ref: "Packages" },
    accountStatus: {
        type: String,
        uppercase: true,
        trim: true,
    },
    governmentIdImageURL: {
        type: String,
        trim: true,
    },
    billingImageURL: {
        type: String,
        trim: true,
    },
    isDeleted: Boolean,
});

AccountSchema.plugin(AutoIncrement, { inc_field: "acc_ctr" });

module.exports = mongoose.model("Accounts", AccountSchema);
