const router = require("express").Router();
const Invoice = require("../models/Invoice");

router.get("/", async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices.filter((invoice) => !invoice.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (invoice.isDeleted)
            return res.status(404).json({ message: "Invoice not found" });

        res.status(200).json(invoice);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { amountDue, accountID } = req.body;

    const invoice = new Invoice({
        prefix: "INV",
        // date: Date.now(),
        date: "2000-02-17T00:00:00.000Z",
        amountDue: amountDue,
        accountID: accountID,
        isDeleted: false,
    });

    try {
        const savedInvoice = await invoice.save();
        res.status(201).json(savedInvoice);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (invoice.isDeleted)
            res.status(404).json({ message: "Invoice not found" });

        const deletedInvoice = await Invoice.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedInvoice.isDeleted = true;
        res.status(200).json(deletedInvoice);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedInvoice);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
