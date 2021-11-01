const router = require("express").Router();
const Inquiry = require("../models/Inquiry");
const Account = require("../models/Account");
const auth = require("../auth/auth");

router.get("/", auth, async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}, "-__v").populate({
            path: "accountID",
            populate: {
                path: "packageID",
                select: "-__v",
            },
            select: "-__v",
        });

        res.status(200).json(inquiries.filter((inquiry) => !inquiry.isDeleted));
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
            // INQ-210729 001
            const prefix = id.toUpperCase().substring(0, 10);
            const inq_ctr = parseInt(id.toUpperCase().substring(10), 10);

            await Inquiry.findOne({ prefix, inq_ctr }, "-__v")
                .populate({
                    path: "accountID",
                    populate: {
                        path: "packageID",
                        select: "-__v",
                    },
                    select: "-__v",
                })
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
                .populate({
                    path: "accountID",
                    populate: {
                        path: "packageID",
                        select: "-__v",
                    },
                    select: "-__v",
                })
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
    });

    try {
        await Account.findOne({
            prefix: accountID.toString().toUpperCase().substring(0, 8),
            acc_ctr: parseInt(
                accountID.toString().toUpperCase().substring(8),
                10
            ),
        })
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });
                inquiry.accountID = account._id;

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

router.patch("/status/:id", auth, async (req, res) => {
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

router.delete("/:id", auth, async (req, res) => {
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

router.delete("/hard/:id", auth, async (req, res) => {
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
