const router = require("express").Router();
const Account = require("../models/Account");
const Package = require("../models/Package");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const multerAzure = require("multer-azure");
const auth = require("../auth/auth");

const nodemailer = require("nodemailer");
const Email = require("email-templates");

const transporter = nodemailer.createTransport({
    host: "us2.smtp.mailhostbox.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: { secureProtocol: "TLSv1_method" },
});

const email = new Email({
    message: {
        from: process.env.EMAIL_USERNAME,
    },
    send: true,
    transport: transporter,
});

const storage = multerAzure({
    connectionString: process.env.AZURE_CONN_STRING,
    account: process.env.AZURE_ACCOUNT,
    key: process.env.AZURE_KEY,
    container: "images",
    blobPathResolver: function (req, file, cb) {
        const blobPath = crypto.randomUUID() + path.extname(file.originalname);
        cb(null, blobPath);
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

router.get("/", auth, async (req, res) => {
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

router.get("/:id", auth, async (req, res) => {
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

router.get("/billing/:id", auth, async (req, res) => {
    const { id } = req.params;

    await Account.findById(id, "-__v")
        .populate("packageID", "-__v")
        .then(async (account) => {
            if (account.isDeleted)
                return res.status(404).json({ message: "Account not found" });

            const payments = await Payment.find({ accountID: id });
            const invoices = await Invoice.find({ accountID: id });

            res.status(200).json({
                payments,
                invoices,
            });
        })
        .catch((err) => res.status(404).json({ message: "Account not found" }));
});

router.post("/", upload, async (req, res) => {
    const {
        accountName,
        additionalInfo,
        serviceAddress,
        contactInfo,
        packageID,
    } = JSON.parse(req.body.payload);

    const governmentIdImageURL = req.files.governmentIdImageURL[0].url;
    const billingImageURL = req.files.billingImageURL[0].url;

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

                email
                    .send({
                        template: "../emails/accounts",
                        message: {
                            to: [
                                savedAccount.contactInfo.email,
                                "vizcocho.gerarddominic@ue.edu.ph",
                            ],
                        },
                        locals: {
                            name: accountName,
                        },
                    })
                    .then(res.status(201).json(savedAccount))
                    .catch(console.error);
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

router.put("/:id", auth, async (req, res) => {
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

router.patch("/package/:id", auth, async (req, res) => {
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

router.patch("/status/:id", auth, async (req, res) => {
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

router.patch("/oldaccount/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        await Account.findById(id)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const updatedAccount = await Account.findByIdAndUpdate(id, {
                    $set: { isNewAccount: false },
                });

                res.status(200).json({
                    ...updatedAccount._doc,
                    isNewAccount: false,
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

router.patch("/address/:id", auth, async (req, res) => {
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

router.delete("/:id", auth, async (req, res) => {
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

router.delete("/hard/:id", auth, async (req, res) => {
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
