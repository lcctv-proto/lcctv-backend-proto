const router = require("express").Router();
const Inquiry = require("../models/Inquiry");
const Account = require("../models/Account");

router.get("/", async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}, "-__v").populate(
            "accountID",
            "_id accountName"
        );

        res.status(200).json(inquiries.filter((inquiry) => !inquiry.isDeleted));
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
            // INQ-210729 001
            const prefix = id.toUpperCase().substring(0, 10);
            const inq_ctr = parseInt(id.toUpperCase().substring(10), 10);

            await Inquiry.findOne({ prefix, inq_ctr }, "-__v")
                .populate("accountID", "accountName")
                .then((inquiry) => {
                    if (inquiry.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Inquiry not found" });

                    res.status(200).json(inquiry);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Inquiry not found" })
                );
        } else {
            await Inquiry.findById(id, "-__v")
                .populate("accountID", "accountName")
                .then((inquiry) => {
                    if (inquiry.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Inquiry not found" });

                    res.status(200).json(inquiry);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Inquiry not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { contactNumber, email, type, description, accountID } = req.body;

    const inquiry = new Inquiry({
        contactNumber,
        email,
        type,
        description,
        accountID,
    });

    try {
        await Account.findById(accountID)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const savedInquiry = await inquiry.save();

                res.status(201).json(savedInquiry);
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
    const { status } = req.body;
    const { id } = req.params;

    try {
        await Inquiry.findById(id)
            .then(async (inquiry) => {
                if (inquiry.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Inquiry not found" });

                const updatedInquiry = await Inquiry.findByIdAndUpdate(id, {
                    $set: { status },
                });

                res.status(200).json({
                    ...updatedInquiry._doc,
                    status,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Inquiry not found" })
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
        await Inquiry.findById(id)
            .then(async (inquiry) => {
                if (inquiry.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Inquiry not found" });

                const deletedInquiry = await Inquiry.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedInquiry._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Inquiry not found" })
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
        await Inquiry.findById(id)
            .then(async (inquiry) => {
                if (inquiry.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Inquiry not found" });

                const deletedInquiry = await Inquiry.findByIdAndDelete(id);

                res.status(200).json(deletedInquiry);
            })
            .catch((err) =>
                res.status(404).json({ message: "Inquiry not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
