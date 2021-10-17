const router = require("express").Router();
const Invoice = require("../models/Invoice");
const Account = require("../models/Account");
const auth = require("../auth/auth");

router.get("/", auth, async (req, res) => {
    try {
        const invoices = await Invoice.find({}, "-__v").populate(
            "accountID",
            "_id accountName"
        );

        res.status(200).json(invoices.filter((invoice) => !invoice.isDeleted));
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
            // INV-210801 001
            const prefix = id.toUpperCase().substring(0, 10);
            const inv_ctr = parseInt(id.toUpperCase().substring(10), 10);

            await Inquiry.findOne({ prefix, inv_ctr }, "-__v")
                .populate("accountID", "accountName")
                .then((invoice) => {
                    if (invoice.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Invoice not found" });

                    res.status(200).json(invoice);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Invoice not found" })
                );
        } else {
            await Invoice.findById(id, "-__v")
                .populate("accountID", "accountName")
                .then((invoice) => {
                    if (invoice.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Invoice not found" });

                    res.status(200).json(invoice);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Invoice not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", auth, async (req, res) => {
    const { amountDue, accountID } = req.body;

    const invoice = new Invoice({
        amountDue,
        accountID,
    });

    try {
        await Account.findById(accountID)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                await Account.findByIdAndUpdate(accountID, {
                    $inc: { "billingInfo.accountCredit": amountDue },
                });

                const savedInvoice = await invoice.save();

                res.status(201).json(savedInvoice);
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
        await Invoice.findById(id)
            .then(async (invoice) => {
                if (invoice.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Invoice not found" });

                const deletedInvoice = await Invoice.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedInvoice._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Invoice not found" })
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
        const deletedInvoice = await Invoice.findByIdAndDelete(id);

        res.status(200).json(deletedInvoice);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
