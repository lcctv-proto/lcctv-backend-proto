const router = require("express").Router();
const Role = require("../models/Role");

router.get("/", async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles.filter((role) => !role.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        !role.isDeleted
            ? res.status(200).json(role)
            : res.status(404).json({ message: "Role not found" });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { name, description } = req.body;

    const role = new Role({
        name: name,
        description: description,
        isDeleted: false,
    });

    try {
        const savedRole = await role.save();
        res.status(201).json(savedRole);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.put("/:id", async (req, res) => {
    const { name, description } = req.body;

    try {
        const role = await Role.findById(req.params.id);

        if (role.isDeleted) res.status(404).json({ message: "Role not found" });

        const updatedRole = await Role.findByIdAndUpdate(req.params.id, {
            $set: { name: name, description: description },
        });

        updatedRole.name = name;
        updatedRole.description = description;

        res.status(200).json(updatedRole);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (role.isDeleted) res.status(404).json({ message: "Role not found" });

        const deletedRole = await Role.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedRole.isDeleted = true;
        res.status(200).json(deletedRole);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedRole);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
