const router = require("express").Router();
const Package = require("../models/Package");

router.get("/", async (req, res) => {
    try {
        const packages = await Package.find({}, "-__v");

        res.status(200).json(packages.filter((pack) => !pack.isDeleted));
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
            // PKG-210729 001
            const prefix = id.toUpperCase().substring(0, 10);
            const pkg_ctr = parseInt(id.toUpperCase().substring(10), 10);

            await Package.findOne({ prefix: prefix, pkg_ctr: pkg_ctr }, "-__v")
                .then((pkg) => {
                    if (pkg.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Package not found" });

                    res.status(200).json(pkg);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Package not found" })
                );
        } else {
            await Package.findById(id, "-__v")
                .then((pkg) => {
                    if (pkg.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Package not found" });

                    res.status(200).json(pkg);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Package not found" })
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

    const pack = new Package({
        description: description,
        price: price,
    });

    try {
        const savedPackage = await pack.save();

        res.status(201).json(savedPackage);
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
        await Package.findById(id, "-__v")
            .then(async (pkg) => {
                if (pkg.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Package not found" });

                const updatedPackage = await Package.findByIdAndUpdate(id, {
                    $set: { description: description, price: price },
                });

                res.status(200).json({
                    ...updatedPackage._doc,
                    description: description,
                    price: price,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Package not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Package.findById(id)
            .then(async (pkg) => {
                if (pkg.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Package not found" });

                const deletedPackage = await Package.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedPackage._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Package not found" })
            );
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Package.findById(id)
            .then(async (pkg) => {
                if (pkg.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Package not found" });

                const deletedPackage = await Package.findByIdAndDelete(id);

                res.status(200).json(deletedPackage);
            })
            .catch((err) =>
                res.status(404).json({ message: "Package not found" })
            );
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
