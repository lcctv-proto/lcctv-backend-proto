const router = require("express").Router();
const Equipment = require("../models/Equipment");
const auth = require("../auth/auth");

router.get("/", auth, async (req, res) => {
    try {
        const equipments = await Equipment.find({}, "-__v");

        res.status(200).json(
            equipments.filter((equipment) => !equipment.isDeleted)
        );
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
            //EQPMNT-210731 001
            const prefix = id.toUpperCase().substring(0, 13);
            const eqpmnt_ctr = parseInt(id.toUpperCase().substring(13), 10);

            await Equipment.findOne({ prefix, eqpmnt_ctr }, "-__v")
                .then((equipment) => {
                    if (equipment.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Equipment not found" });

                    res.status(200).json(equipment);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Equipment not found" })
                );
        } else {
            await Equipment.findById(id, "-__v")
                .then((equipment) => {
                    if (equipment.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Equipment not found" });

                    res.status(200).json(equipment);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Equipment not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", auth, async (req, res) => {
    const { description, label, price } = req.body;

    const equipment = new Equipment({
        description,
        label,
        price,
    });

    try {
        const savedEquipment = await equipment.save();

        res.status(201).json(savedEquipment);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", auth, async (req, res) => {
    const { description, label, price } = req.body;
    const { id } = req.params;

    try {
        await Equipment.findById(id)
            .then(async (equipment) => {
                if (equipment.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Equipment not found" });

                const updatedEquipment = await Equipment.findByIdAndUpdate(id, {
                    $set: {
                        description,
                        label,
                        price,
                    },
                });

                res.status(200).json({
                    ...updatedEquipment._doc,
                    description,
                    label,
                    price,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Equipment not found" })
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
        await Equipment.findById(id)
            .then(async (equipment) => {
                if (equipment.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Equipment not found" });

                const deletedEquipment = await Equipment.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedEquipment._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Equipment not found" })
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
        await Equipment.findById(id)
            .then(async (equipment) => {
                if (equipment.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Equipment not found" });

                const deletedEquipment = await Equipment.findByIdAndDelete(id);

                res.status(200).json(deletedEquipment);
            })
            .catch((err) =>
                res.status(404).json({ message: "Equipment not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
