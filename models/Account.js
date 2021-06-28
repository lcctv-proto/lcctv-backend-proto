const mongoose = require("mongoose");

const NameSchema = mongoose.Schema({
    _id: false,
    firstName: String,
    middleName: String,
    lastName: String,
});

const AdditionalInfoSchema = mongoose.Schema({
    _id: false,
    birthdate: Date,
    nationality: String,
    gender: String,
    civilStatus: String,
});

const AddressSchema = mongoose.Schema({
    _id: false,
    unit: String,
    street: String,
    barangay: String,
    municipality: String,
    province: String,
    zipCode: Number,
    homeOwnership: String,
    residencyYear: Number,
    nearestLandmark: String,
});

const ContactSchema = mongoose.Schema({
    _id: false,
    cellphoneNumber: String,
    telephoneNumber: String,
    email: String,
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
    name: String,
    accountName: NameSchema,
    additionalInfo: AdditionalInfoSchema,
    serviceAddress: AddressSchema,
    contactInfo: ContactSchema,
    billingInfo: BillingSchema,
    packageID: mongoose.Schema.Types.ObjectId,
    accountStatus: String,
    governmentIdImageURL: String,
    billingImageURL: String,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Accounts", AccountSchema);
