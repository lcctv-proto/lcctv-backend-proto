const router = require("express").Router();
const Payment = require("../models/Payment");
const Account = require("../models/Account");
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

router.get("/", auth, async (req, res) => {
    try {
        const payments = await Payment.find({}, "-__v")
            .populate("accountID", "-__v")
            .populate("feeIDs", "name description price");

        res.status(200).json(payments.filter((payment) => !payment.isDeleted));
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
            // PAY-210801 001
            const prefix = id.toUpperCase().substring(0, 10);
            const pay_ctr = parseInt(id.toUpperCase().substring(10), 10);

            await Payment.findOne({ prefix, pay_ctr }, "-__v")
                .populate("accountID", "-__v")
                .populate("feeIDs", "name description price")
                .then((payment) => {
                    if (payment.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Payment not found" });

                    res.status(200).json(payment);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Payment not found" })
                );
        } else {
            await Payment.findById(id, "-__v")
                .populate("accountID", "-__v")
                .populate("feeIDs", "name description price")
                .then((payment) => {
                    if (payment.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Payment not found" });

                    res.status(200).json(payment);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Payment not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", auth, async (req, res) => {
    const {
        feeIDs,
        amountPaid,
        dateIssued,
        receiptNumber,
        referenceNumber,
        modeOfPayment,
        issuingBank,
        checkNumber,
        checkAmount,
        accountID,
        remarks,
    } = req.body;

    const payment = new Payment({
        feeIDs,
        amountPaid,
        dateIssued,
        receiptNumber,
        referenceNumber,
        modeOfPayment,
        issuingBank,
        checkNumber,
        checkAmount,
        accountID,
        remarks,
    });

    try {
        await Account.findById(accountID)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                await Account.findByIdAndUpdate(accountID, {
                    $inc: {
                        "billingInfo.accountDebit": checkAmount
                            ? checkAmount
                            : amountPaid,
                    },
                });

                if (account.isNewAccount) {
                    await Account.findByIdAndUpdate(accountID, {
                        $set: {
                            accountStatus: "ACTIVE",
                            isNewAccount: false,
                        },
                    }).then(() => {
                        email
                            .send({
                                template: "../emails/accounts",
                                message: {
                                    to: [account.contactInfo.email],
                                },
                                locals: {
                                    account,
                                },
                            })
                            .then(console.log)
                            .catch(console.error);
                    });
                }

                const savedPayment = await payment.save();

                console.log(`PAYMENT ID: ${savedPayment._id}`);

                await Payment.findById(savedPayment._id, "-__v")
                    .populate("accountID", "-__v")
                    .populate("feeIDs")
                    .then((payment) => {
                        if (payment.isDeleted)
                            return res
                                .status(404)
                                .json({ message: "Payment not found" });

                        email
                            .send({
                                template: "../emails/payments",
                                message: {
                                    to: [account.contactInfo.email],
                                },
                                locals: {
                                    account,
                                    payment,
                                },
                            })
                            .then(console.log)
                            .catch(console.error);
                    });

                res.status(201).json(savedPayment);
            })
            .catch((err) => {
                res.status(404).json({ message: "Account not found" });
            });
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        await Payment.findById(id)
            .then(async (payment) => {
                if (payment.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Payment not found" });

                const deletedPayment = await Payment.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedPayment._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Payment not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", auth, async (req, res) => {
    try {
        await Payment.findById(id)
            .then(async (payment) => {
                if (payment.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Payment not found" });

                const deletedPayment = await Payment.findByIdAndDelete(
                    req.params.id
                );

                res.status(200).json(deletedPayment);
            })
            .catch((err) =>
                res.status(404).json({ message: "Payment not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
