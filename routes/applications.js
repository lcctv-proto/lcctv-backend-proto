const router = require("express").Router();
const Application = require("../models/Application");

router.get("/", async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json(
            applications.filter((application) => !application.isDeleted)
        );
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        !application.isDeleted
            ? res.status(200).json(application)
            : res.status(404).json({ message: "Application not found" });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { remarks, accountID } = req.body;

    const application = new Application({
        prefix: "REF",
        // date: Date.now(),
        date: "2000-02-17T00:00:00.000Z",
        status: "PENDING PAYMENT",
        step: 1,
        remarks: remarks,
        accountID: accountID,
        isDeleted: false,
    });

    try {
        const savedApplication = await application.save();
        res.status(201).json(savedApplication);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/status/:id", async (req, res) => {
    const { status, step } = req.body;

    try {
        const application = await Application.findById(req.params.id);

        if (application.isDeleted)
            res.status(404).json({ message: "Application not found" });

        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            {
                $set: { status: status, step: step },
            }
        );

        updatedApplication.status = status;
        updatedApplication.step = step;
        res.status(200).json(updatedApplication);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/account/:id", async (req, res) => {
    const { accountID } = req.body;

    try {
        const application = await Application.findById(req.params.id);

        if (application.isDeleted)
            res.status(404).json({ message: "Application not found" });

        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            {
                $set: { accountID: accountID },
            }
        );

        updatedApplication.accountID = accountID;
        res.status(200).json(updatedApplication);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/remarks/:id", async (req, res) => {
    const { remarks } = req.body;

    try {
        const application = await Application.findById(req.params.id);

        if (application.isDeleted)
            res.status(404).json({ message: "Application not found" });

        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            {
                $set: { remarks: remarks },
            }
        );

        updatedApplication.remarks = remarks;
        res.status(200).json(updatedApplication);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (application.isDeleted)
            res.status(404).json({ message: "Application not found" });

        const deletedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            {
                $set: { isDeleted: true },
            }
        );
        deletedApplication.isDeleted = true;
        res.status(200).json(deletedApplication);
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
