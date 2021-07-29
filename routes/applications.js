const router = require("express").Router();
const Application = require("../models/Application");
const Account = require("../models/Account");

router.get("/", async (req, res) => {
    try {
        const applications = await Application.find().populate({
            path: "accountID",
            populate: { path: "packageID", select: "-pkg_ctr -__v" },
            select: "-__v",
        });
        res.status(200).json(
            applications.filter((application) => !application.isDeleted)
        );
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
            //REF-210729002
            const id = req.params.id;
            const prefix = id.toUpperCase().substring(0, 10);
            const ref_ctr = parseInt(id.toUpperCase().substring(10), 10);
            await Application.findOne(
                { prefix: prefix, ref_ctr: ref_ctr },
                "-__v"
            )
                .populate({
                    path: "accountID",
                    populate: {
                        path: "packageID",
                        select: "-pkg_ctr -__v",
                    },
                    select: "-__v",
                })
                .then((application) => {
                    if (application.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Application not found" });
                    res.status(200).json(application);
                })
                .catch((err) => {
                    res.status(404).json({ message: "Application not found" });
                });
        } else {
            await Application.findById(req.params.id, "-__v")
                .populate({
                    path: "accountID",
                    populate: {
                        path: "packageID",
                        select: "-pkg_ctr -__v",
                    },
                    select: "-__v",
                })
                .then((application) => {
                    if (application.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Application not found" });
                    res.status(200).json(application);
                })
                .catch((err) => {
                    res.status(404).json({ message: "Application not found" });
                });
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { remarks, accountID } = req.body;

    const today = new Date();
    const dd = String(today.getUTCDate()).padStart(2, "0");
    const mm = String(today.getUTCMonth() + 1).padStart(2, "0");
    const yy = today.getFullYear().toString().substr(-2);

    const prefix = `REF-${yy}${mm}${dd}`;

    const application = new Application({
        prefix: prefix,
        date: Date.now(),
        status: "PENDING PAYMENT",
        step: 1,
        remarks: remarks,
        accountID: accountID,
        isDeleted: false,
    });

    try {
        await Account.findById(accountID)
            .then(async (account) => {
                if (account.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Account not found" });

                const savedApplication = await application.save();

                res.status(201).json(savedApplication);
            })
            .catch((err) =>
                res.status(404).json({ message: "Account not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/status/:id", async (req, res) => {
    const { status, step } = req.body;

    try {
        await Application.findById(req.params.id, "-__v")
            .then(async (application) => {
                if (application.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Application not found" });

                const updatedApplication = await Application.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: { status: status, step: step },
                    }
                );

                updatedApplication.status = status;
                updatedApplication.step = step;
                res.status(200).json(updatedApplication);
            })
            .catch((err) => {
                res.status(404).json({ message: "Application not found" });
            });
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/account/:id", async (req, res) => {
    const { accountID } = req.body;

    try {
        await Application.findById(req.params.id, "-__v")
            .then(async (application) => {
                if (application.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Application not found" });

                await Account.findById(accountID)
                    .then(async (account) => {
                        if (account.isDeleted)
                            return res
                                .status(404)
                                .json({ message: "Account not found" });

                        const updatedApplication =
                            await Application.findByIdAndUpdate(req.params.id, {
                                $set: { accountID: accountID },
                            });

                        updatedApplication.accountID = accountID;
                        res.status(200).json(updatedApplication);
                    })
                    .catch((err) =>
                        res.status(404).json({ message: "Account not found" })
                    );
            })
            .catch((err) => {
                res.status(404).json({ message: "Application not found" });
            });
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/remarks/:id", async (req, res) => {
    const { remarks } = req.body;

    try {
        await Application.findById(req.params.id, "-__v")
            .then(async (application) => {
                if (application.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Application not found" });

                const updatedApplication = await Application.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: { remarks: remarks },
                    }
                );

                updatedApplication.remarks = remarks;
                res.status(200).json(updatedApplication);
            })
            .catch((err) => {
                res.status(404).json({ message: "Application not found" });
            });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Application.findById(req.params.id, "-__v")
            .then(async (application) => {
                if (application.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Application not found" });

                const deletedApplication = await Application.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: { isDeleted: true },
                    }
                );
                deletedApplication.isDeleted = true;
                res.status(200).json(deletedApplication);
            })
            .catch((err) => {
                res.status(404).json({ message: "Application not found" });
            });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedApplication = await Application.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json(deletedApplication);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
