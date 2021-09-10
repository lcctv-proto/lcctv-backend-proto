const router = require("express").Router();
const Account = require("../models/Account");
const Package = require("../models/Package");
const crypto = require("crypto");
const path = require("path");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/accounts");
    },
    filename: (req, file, cb) => {
        cb(null, crypto.randomUUID() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Wrong File Type"), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: "2mb",
    },
    fileFilter,
}).fields([
    { name: "governmentIdImageURL", maxCount: 1 },
    { name: "billingImageURL", maxCount: 1 },
]);

router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find({}, "-__v").populate(
            "packageID",
            "-__v"
        );

        res.status(200).json(accounts.filter((account) => !account.isDeleted));
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;

    try {
        if (type === "custom") {
            // 20210729 0001
            const prefix = id.toUpperCase().substring(0, 8);
            const acc_ctr = parseInt(id.toUpperCase().substring(8), 10);

            await Account.findOne({ prefix, acc_ctr }, " -__v")
                .populate("packageID", "-__v")
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
            await Account.findById(id, "-__v")
                .populate("packageID", "-__v")
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

router.post("/", upload, async (req, res) => {
    const {
        accountName,
        additionalInfo,
        serviceAddress,
        contactInfo,
        packageID,
    } = JSON.parse(req.body.payload);
    console.log({ files: req.files });
    console.log(req.body.payload);
    console.log(req.files.governmentIdImageURL[0].path);
    const governmentIdImageURL = req.files.governmentIdImageURL[0].path;
    const billingImageURL = req.files.billingImageURL[0].path;

    const account = new Account({
        accountName,
        additionalInfo,
        serviceAddress,
        contactInfo,
        packageID,
        governmentIdImageURL,
        billingImageURL,
    });

    try {
        await Package.findById(packageID)
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
    const { id } = req.params;

    try {
        await Account.findById(id)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const updatedAccount = await Account.findByIdAndUpdate(id, {
                    $set: {
                        accountName,
                        additionalInfo,
                        contactInfo,
                    },
                });

                res.status(200).json({
                    ...updatedAccount._doc,
                    accountName,
                    additionalInfo,
                    contactInfo,
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

router.patch("/package/:id", async (req, res) => {
    const { packageID } = req.body;
    const { id } = req.params;

    try {
        await Account.findById(id)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                await Package.findById(packageID)
                    .then(async (pkg) => {
                        if (pkg.isDeleted)
                            return res
                                .status(404)
                                .json({ message: "Package not found" });

                        const updatedAccount = await Account.findByIdAndUpdate(
                            id,
                            {
                                $set: { packageID },
                            }
                        );
                        res.status(200).json({
                            ...updatedAccount._doc,
                            packageID,
                        });
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
    const { id } = req.params;

    try {
        await Account.findById(id)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const updatedAccount = await Account.findByIdAndUpdate(id, {
                    $set: { accountStatus },
                });

                res.status(200).json({
                    ...updatedAccount._doc,
                    accountStatus,
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

router.patch("/address/:id", async (req, res) => {
    const { serviceAddress } = req.body;
    const { id } = req.params;

    try {
        await Account.findById(id)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const updatedAccount = await Account.findByIdAndUpdate(id, {
                    $set: { serviceAddress },
                });

                res.status(200).json({
                    ...updatedAccount._doc,
                    serviceAddress,
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

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Account.findById(id)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const deletedAccount = await Account.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedAccount._doc,
                    isDeleted: true,
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

router.delete("/hard/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Account.findById(id)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const deletedAccount = await Account.findByIdAndDelete(id);

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

module.exports = router;
