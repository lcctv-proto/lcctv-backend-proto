const router = require("express").Router();
const Account = require("../models/Account");

router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts.filter((acc) => !acc.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);

        !account.isDeleted
            ? res.status(200).json(account)
            : res.status(404).json({ message: "Account not found" });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const {
        accountName,
        additionalInfo,
        serviceAddress,
        contactInfo,
        billingInfo,
        packageID,
        accountStatus,
        governmentIdImageURL,
        billingImageURL,
    } = req.body;

    const account = new Account({
        name: "ACC-00001",
        accountName: {
            firstName: accountName.firstName,
            middleName: accountName.middleName,
            lastName: accountName.lastName,
        },
        additionalInfo: {
            birthdate: additionalInfo.birthdate,
            nationality: additionalInfo.nationality,
            gender: additionalInfo.gender,
            civilStatus: additionalInfo.civilStatus,
        },
        serviceAddress: {
            unit: serviceAddress.unit,
            street: serviceAddress.street,
            barangay: serviceAddress.barangay,
            municipality: serviceAddress.municipality,
            province: serviceAddress.province,
            zipCode: serviceAddress.zipCode,
            homeOwnership: serviceAddress.homeOwnership,
            residencyYear: serviceAddress.residencyYear,
        },
        contactInfo: {
            cellphoneNumber: contactInfo.cellphoneNumber,
            telephoneNumber: contactInfo.telephoneNumber,
            email: contactInfo.email,
            motherMaidenName: {
                firstName: contactInfo.motherMaidenName.firstName,
                middleName: contactInfo.motherMaidenName.middleName,
                lastName: contactInfo.motherMaidenName.lastName,
            },
            spouseName: {
                firstName: contactInfo.spouseName.firstName,
                middleName: contactInfo.spouseName.middleName,
                lastName: contactInfo.spouseName.lastName,
            },
        },
        billingInfo: {
            accountCredit: 0,
            accountDebit: 0,
            startDate: billingInfo.startDate,
        },
        packageID: packageID,
        accountStatus: accountStatus,
        governmentIdImageURL: governmentIdImageURL,
        billingImageURL: billingImageURL,
        isDeleted: false,
    });

    try {
        const savedAccount = await account.save();
        res.status(201).json(savedAccount);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/:id", (req, res) => {
    res.send(`EDIT ACCOUNT WITH ACCOUNT ID: ${req.params.id}`);
});

router.delete("/:id", async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);

        if (account.isDeleted)
            res.status(404).json({ message: "Account not found" });

        const deletedAccount = await Account.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedAccount.isDeleted = true;
        res.status(200).json(deletedAccount);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
