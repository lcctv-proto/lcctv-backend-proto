const router = require("express").Router();
const Payment = require("../models/Payment");

router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments.filter((payment) => !payment.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (payment.isDeleted)
            return res.status(404).json({ message: "Payment not found" });

        res.status(200).json(payment);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
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
        prefix: "PAY",
        date: Date.now(),
        feeIDs: feeIDs,
        amountPaid: amountPaid,
        dateIssued: dateIssued,
        receiptNumber: receiptNumber,
        referenceNumber: referenceNumber,
        modeOfPayment: modeOfPayment,
        issuingBank: issuingBank,
        checkNumber: checkNumber,
        checkAmount: checkAmount,
        remarks: remarks,
        accountID: accountID,
        isDeleted: false,
    });

    try {
        const savedPayment = await payment.save();
        res.status(201).json(savedPayment);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (payment.isDeleted)
            res.status(404).json({ message: "Payment not found" });

        const deletedPayment = await Payment.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedPayment.isDeleted = true;
        res.status(200).json(deletedPayment);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedPayment);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
