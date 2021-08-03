const router = require("express").Router();
const Fee = require("../models/Fee");

router.get("/", async (req, res) => {
    try {
        const fees = await Fee.find({}, "-__v");

        res.status(200).json(fees.filter((fee) => !fee.isDeleted));
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
            // FEE-210729 001
            const prefix = id.toUpperCase().substring(0, 10);
            const fee_ctr = parseInt(id.toUpperCase().substring(10), 10);

            await Fee.findOne({ prefix, fee_ctr }, "-__v")
                .then((fee) => {
                    if (fee.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Fee not found" });

                    res.status(200).json(fee);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Fee not found" })
                );
        } else {
            await Fee.findById(id, "-__v")
                .then((fee) => {
                    if (fee.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Fee not found" });

                    res.status(200).json(fee);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Fee not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { description, price } = req.body;

    const fee = new Fee({
        description,
        price,
    });

    try {
        const savedFee = await fee.save();

        res.status(201).json(savedFee);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", async (req, res) => {
    const { description, price } = req.body;
    const { id } = req.params;

    try {
        await Fee.findById(id)
            .then(async (fee) => {
                if (fee.isDeleted)
                    return res.status(404).json({ message: "Fee not found" });

                const updatedFee = await Fee.findByIdAndUpdate(id, {
                    $set: { description, price },
                });

                res.status(200).json({
                    ...updatedFee._doc,
                    description,
                    price,
                });
            })
            .catch((err) => res.status(404).json({ message: "Fee not found" }));
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Fee.findById(id)
            .then(async (fee) => {
                if (fee.isDeleted)
                    return res.status(404).json({ message: "Fee not found" });

                const deletedFee = await Fee.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedFee._doc,
                    isDeleted: true,
                });
            })
            .catch((err) => res.status(404).json({ message: "Fee not found" }));
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Fee.findById(id)
            .then(async (fee) => {
                if (fee.isDeleted)
                    return res.status(404).json({ message: "Fee not found" });

                const deletedFee = await Fee.findByIdAndDelete(id);

                res.status(200).json(deletedFee);
            })
            .catch((err) => res.status(404).json({ message: "Fee not found" }));
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
