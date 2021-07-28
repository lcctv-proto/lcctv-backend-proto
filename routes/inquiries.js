const router = require("express").Router();
const Inquiry = require("../models/Inquiry");

router.get("/", async (req, res) => {
    try {
        const inquiries = await Inquiry.find().populate(
            "accountID",
            "_id accountName"
        );
        res.status(200).json(inquiries.filter((inquiry) => !inquiry.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id).populate(
            "accountID",
            "_id accountName"
        );

        if (inquiry.isDeleted)
            return res.status(404).json({ message: "Inquiry not found" });

        res.status(200).json(inquiry);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { contactNumber, email, type, description, accountID } = req.body;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    const prefix = `INQ-${yyyy}${mm}${dd}`;

    const inquiry = new Inquiry({
        prefix: prefix,
        date: Date.now(),
        // date: "2000-02-17T00:00:00.000Z",
        status: "PENDING", // "DENIED", "CLOSED(TO JO)", "CLOSED(GEN INQ)", "CLOSED(CASHIER)"
        contactNumber: contactNumber,
        email: email,
        type: type,
        description: description,
        accountID: accountID,
        isDeleted: false,
    });

    try {
        const savedInquiry = await inquiry.save();
        res.status(201).json(savedInquiry);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/status/:id", async (req, res) => {
    const { status } = req.body;

    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (inquiry.isDeleted)
            res.status(404).json({ message: "Inquiry not found" });

        const updatedInquiry = await Inquiry.findByIdAndUpdate(req.params.id, {
            $set: { status: status },
        });
        updatedInquiry.status = status;
        res.status(200).json(updatedInquiry);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (inquiry.isDeleted)
            res.status(404).json({ message: "Inquiry not found" });

        const deletedInquiry = await Inquiry.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedInquiry.isDeleted = true;
        res.status(200).json(deletedInquiry);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedInquiry);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
