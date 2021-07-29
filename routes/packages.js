const router = require("express").Router();
const Package = require("../models/Package");

router.get("/", async (req, res) => {
    try {
        const packages = await Package.find({}, "-isDeleted -__v");
        res.status(200).json(packages.filter((pack) => !pack.isDeleted));
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const type = req.query.type;
        if (type === "custom") {
            // PKG-210729001

            const id = req.params.id;
            const prefix = id.toUpperCase().substring(0, 10);
            const pkg_ctr = parseInt(id.toUpperCase().substring(10), 10);
            await Package.findOne(
                { prefix: prefix, pkg_ctr: pkg_ctr },
                "-isDeleted -__v"
            )
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
            await Package.findById(req.params.id, "-isDeleted -__v")
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

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = today.getFullYear().toString().substr(-2);

    const prefix = `PKG-${yy}${mm}${dd}`;

    const pack = new Package({
        prefix: prefix,
        description: description,
        price: price,
        isDeleted: false,
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

    try {
        await Package.findById(req.params.id, "-isDeleted -__v")
            .then(async (pkg) => {
                if (pkg.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Package not found" });

                const updatedPackage = await Package.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: { description: description, price: price },
                    }
                );

                updatedPackage.description = description;
                updatedPackage.price = price;

                res.status(200).json(updatedPackage);
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
    try {
        await Package.findById(req.params.id, "-isDeleted -__v")
            .then(async (pkg) => {
                if (pkg.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Package not found" });

                const deletedPackage = await Package.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: { isDeleted: true },
                    }
                );
                deletedPackage.isDeleted = true;
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

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedPackage);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
