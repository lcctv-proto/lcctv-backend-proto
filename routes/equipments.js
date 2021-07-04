const router = require("express").Router();
const Equipment = require("../models/Equipment");

router.get("/", async (req, res) => {
    try {
        const equipments = await Equipment.find();
        res.status(200).json(
            equipments.filter((equipment) => !equipment.isDeleted)
        );
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        !equipment.isDeleted
            ? res.status(200).json(equipment)
            : res.status(404).json({ message: "Equipment not found" });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { name, description, label, price } = req.body;

    const equipment = new Equipment({
        name: name,
        label: label,
        description: description,
        price: price,
        isDeleted: false,
    });

    try {
        const savedEquipment = await equipment.save();
        res.status(201).json(savedEquipment);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", async (req, res) => {
    const { name, description, label, price } = req.body;

    try {
        const equipment = await Equipment.findById(req.params.id);

        if (equipment.isDeleted)
            res.status(404).json({ message: "Equipment not found" });

        const updatedEquipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: name,
                    description: description,
                    label: label,
                    price: price,
                },
            }
        );

        updatedEquipment.name = name;
        updatedEquipment.description = description;
        updatedEquipment.label = label;
        updatedEquipment.price = price;

        res.status(200).json(updatedEquipment);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (equipment.isDeleted)
            res.status(404).json({ message: "Equipment not found" });

        const deletedEquipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            {
                $set: { isDeleted: true },
            }
        );
        deletedEquipment.isDeleted = true;
        res.status(200).json(deletedEquipment);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
