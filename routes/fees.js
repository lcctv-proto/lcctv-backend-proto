const router = require("express").Router();
const Fee = require("../models/Fee");

router.get("/", async (req, res) => {
    try {
        const fees = await Fee.find();
        res.status(200).json(fees.filter((fee) => !fee.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);

        !fee.isDeleted
            ? res.status(200).json(fee)
            : res.status(404).json({ message: "Fee not found" });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { description, price } = req.body;

    const fee = new Fee({
        prefix: "FEE",
        description: description,
        price: price,
        isDeleted: false,
    });

    try {
        const savedFee = await fee.save();
        res.status(201).json(savedFee);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", async (req, res) => {
    const { description, price } = req.body;

    try {
        const fee = await Fee.findById(req.params.id);

        if (fee.isDeleted) res.status(404).json({ message: "Fee not found" });

        const updatedFee = await Fee.findByIdAndUpdate(req.params.id, {
            $set: { description: description, price: price },
        });

        updatedFee.description = description;
        updatedFee.price = price;

        res.status(200).json(updatedFee);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);

        if (fee.isDeleted) res.status(404).json({ message: "Fee not found" });

        const deletedFee = await Fee.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedFee.isDeleted = true;
        res.status(200).json(deletedFee);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedFee = await Fee.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedFee);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
