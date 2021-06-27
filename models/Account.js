const mongoose = require("mongoose");

const NameSchema = mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
});

const AdditionalInfoSchema = mongoose.Schema({
    birthdate: Date,
    nationality: String,
    gender: String,
    civilStatus: String,
});

const AddressSchema = mongoose.Schema({
    unit: String,
    street: String,
    barangay: String,
    municipality: String,
    province: String,
    zipCode: Number,
    homeOwnership: String,
    residencyYear: Number,
});

const ContactSchema = mongoose.Schema({
    cellphoneNumber: String,
    telephoneNumber: String,
    email: String,
    motherMaidenName: NameSchema,
    spouseName: NameSchema,
});

const BillingSchema = mongoose.Schema({
    accountCredit: Number,
    accountDebit: Number,
    startDate: Date,
});

const AccountSchema = mongoose.Schema({
    accountName: NameSchema,
    additionalInfo: AdditionalInfoSchema,
    serviceAddress: AddressSchema,
    contactInfo: ContactSchema,
    billingInfo: BillingSchema,
    packageID: mongoose.Schema.Types.ObjectId,
    accountStatus: String,
    isDeleted: Boolean,
});

module.exports = mongoose.model("Accounts", AccountSchema);
