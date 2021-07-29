const router = require("express").Router();
const Account = require("../models/Account");
const Package = require("../models/Package");

router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find({}, "-isDeleted -__v").populate(
            "packageID",
            "-isDeleted -__v"
        );

        res.status(200).json(accounts.filter((account) => !account.isDeleted));
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const type = req.query.type;
        if (type === "custom") {
            // 202107290001
            const id = req.params.id;
            const prefix = id.toUpperCase().substring(0, 8);
            const acc_ctr = parseInt(id.toUpperCase().substring(8), 10);
            await Account.findOne(
                { prefix: prefix, acc_ctr: acc_ctr },
                "-isDeleted -__v"
            )
                .populate("packageID", "-isDeleted -__v")
                .then((account) => {
                    if (account.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Account not found" });

                    res.status(200).json(account);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Account not found" })
                );
        } else {
            await Account.findById(req.params.id, "-isDeleted -__v")
                .populate("packageID", "-isDeleted -__v")
                .then((account) => {
                    if (account.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Account not found" });
                    res.status(200).json(account);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Account not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
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
        startDate,
        packageID,
        governmentIdImageURL,
        billingImageURL,
    } = req.body;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    const prefix = `${yyyy}${mm}${dd}`;

    const account = new Account({
        prefix: prefix,
        accountName: accountName,
        additionalInfo: additionalInfo,
        serviceAddress: serviceAddress,
        contactInfo: contactInfo,
        billingInfo: {
            accountCredit: 0,
            accountDebit: 0,
            startDate: startDate,
        },
        packageID: packageID,
        accountStatus: "PENDING",
        governmentIdImageURL: governmentIdImageURL,
        billingImageURL: billingImageURL,
        isDeleted: false,
    });

    try {
        await Package.findById(packageID, "-_id -isDeleted -__v")
            .then(async (pkg) => {
                if (pkg.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Package not found" });

                const savedAccount = await account.save();

                res.status(201).json(savedAccount);
            })
            .catch((err) => {
                return res.status(404).json({ message: "Package not found" });
            });
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", async (req, res) => {
    const { accountName, additionalInfo, contactInfo } = req.body;

    try {
        await Account.findById(req.params.id, "-isDeleted -__v")
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const updatedAccount = await Account.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: {
                            accountName: accountName,
                            additionalInfo: additionalInfo,
                            contactInfo: contactInfo,
                        },
                    }
                );

                updatedAccount.accountName = accountName;
                updatedAccount.additionalInfo = additionalInfo;
                updatedAccount.contactInfo = contactInfo;

                res.status(200).json(updatedAccount);
            })
            .catch((err) =>
                res.status(404).json({ message: "Account not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/package/:id", async (req, res) => {
    const { packageID } = req.body;

    try {
        await Account.findById(req.params.id, "-isDeleted -__v")
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                await Package.findById(packageID, "-_id -isDeleted -__v")
                    .then(async (pkg) => {
                        if (pkg.isDeleted)
                            return res
                                .status(404)
                                .json({ message: "Package not found" });

                        const updatedAccount = await Account.findByIdAndUpdate(
                            req.params.id,
                            {
                                $set: { packageID: packageID },
                            }
                        );

                        updatedAccount.packageID = packageID;
                        res.status(200).json(updatedAccount);
                    })
                    .catch((err) => {
                        return res
                            .status(404)
                            .json({ message: "Package not found" });
                    });
            })
            .catch((err) =>
                res.status(404).json({ message: "Account not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/status/:id", async (req, res) => {
    const { accountStatus } = req.body;

    try {
        await Account.findById(req.params.id, "-isDeleted -__v")
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const updatedAccount = await Account.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: { accountStatus: accountStatus },
                    }
                );
                updatedAccount.accountStatus = accountStatus;
                res.status(200).json(updatedAccount);
            })
            .catch((err) =>
                res.status(404).json({ message: "Account not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/address/:id", async (req, res) => {
    const { serviceAddress } = req.body;

    try {
        await Account.findById(req.params.id, "-isDeleted -__v")
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const updatedAccount = await Account.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: { serviceAddress: serviceAddress },
                    }
                );

                updatedAccount.serviceAddress = serviceAddress;
                res.status(200).json(updatedAccount);
            })
            .catch((err) =>
                res.status(404).json({ message: "Account not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Account.findById(req.params.id, "-isDeleted -__v")
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const deletedAccount = await Account.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: { isDeleted: true },
                    }
                );
                deletedAccount.isDeleted = true;
                res.status(200).json(deletedAccount);
            })
            .catch((err) =>
                res.status(404).json({ message: "Account not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedAccount = await Account.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedAccount);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
