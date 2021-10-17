const router = require("express").Router();
const Role = require("../models/Role");
const auth = require("../auth/auth");

router.get("/", auth, async (req, res) => {
    try {
        const roles = await Role.find({}, "-__v");

        res.status(200).json(roles.filter((role) => !role.isDeleted));
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
            // ROLE-210801 001
            const prefix = id.toUpperCase().substring(0, 11);
            const role_ctr = parseInt(id.toUpperCase().substring(11), 10);

            await Role.findOne({ prefix, role_ctr }, "-__v")
                .then((role) => {
                    if (role.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Role not found" });

                    res.status(200).json(role);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Role not found" })
                );
        } else {
            await Role.findById(id, "-__v")
                .then((role) => {
                    if (role.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Role not found" });

                    res.status(200).json(role);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Role not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", auth, async (req, res) => {
    const { description } = req.body;

    const role = new Role({
        description,
    });

    try {
        const savedRole = await role.save();

        res.status(201).json(savedRole);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        await Role.findById(id, "-__v")
            .then(async (role) => {
                if (role.isDeleted)
                    return res.status(404).json({ message: "Role not found" });

                const deletedRole = await Role.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedRole._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Role not found" })
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
        await Role.findById(id, "-__v")
            .then(async (role) => {
                if (role.isDeleted)
                    return res.status(404).json({ message: "Role not found" });

                const deletedRole = await Role.findByIdAndDelete(id);

                res.status(200).json(deletedRole);
            })
            .catch((err) =>
                res.status(404).json({ message: "Role not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
