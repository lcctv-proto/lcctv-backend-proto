const router = require("express").Router();
const JobOrder = require("../models/JobOrder");
const Account = require("../models/Account");
const Application = require("../models/Application");
const Inquiry = require("../models/Inquiry");
const Team = require("../models/Team");

router.get("/", async (req, res) => {
    try {
        const jos = await JobOrder.find({}, "-__v")
            .populate("accountID", "_id accountName")
            .populate({
                path: "teamID",
                populate: { path: "personnelIDs", select: "personnelName" },
                select: "personnelIDs description",
            })
            .populate("applicationID", "date status")
            .populate(
                "inquiryID",
                "-_id -prefix -date -inq_ctr -__v -accountID"
            )
            .populate({
                path: "equipmentsUsed",
                populate: { path: "equipmentID", select: "description price" },
            });

        res.status(200).json(jos.filter((jo) => !jo.isDeleted));
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
            // JO-210801 001
            const prefix = id.toUpperCase().substring(0, 9);
            const jo_ctr = parseInt(id.toUpperCase().substring(9), 10);

            await JobOrder.findOne({ prefix, jo_ctr }, "-__v")
                .populate("accountID", "_id accountName")
                .populate({
                    path: "teamID",
                    populate: { path: "personnelIDs", select: "personnelName" },
                    select: "personnelIDs description",
                })
                .populate("applicationID", "date status")
                .populate(
                    "inquiryID",
                    "-_id -prefix -date -inq_ctr -__v -accountID"
                )
                .populate({
                    path: "equipmentsUsed",
                    populate: {
                        path: "equipmentID",
                        select: "description price",
                    },
                })
                .then((jo) => {
                    if (jo.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Job Order not found" });

                    res.status(200).json(jo);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Job Order not found" })
                );
        } else {
            await JobOrder.findById(id, "-__v")
                .populate("accountID", "_id accountName")
                .populate({
                    path: "teamID",
                    populate: { path: "personnelIDs", select: "personnelName" },
                    select: "personnelIDs description",
                })
                .populate("applicationID", "date status")
                .populate(
                    "inquiryID",
                    "-_id -prefix -date -inq_ctr -__v -accountID"
                )
                .populate({
                    path: "equipmentsUsed",
                    populate: {
                        path: "equipmentID",
                        select: "description price",
                    },
                })
                .then((jo) => {
                    if (jo.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Job Order not found" });

                    res.status(200).json(jo);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Job Order not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/installation", async (req, res) => {
    const { type, remarks, applicationID, accountID } = req.body;

    const jo = new JobOrder({
        type,
        remarks,
        applicationID,
        accountID,
    });

    try {
        const account = await Account.findById(accountID)
            .then((account) => {
                if (account.isDeleted) return false;
                return true;
            })
            .catch((err) => false);

        const application = await Application.findById(applicationID)
            .then((application) => {
                if (application.isDeleted) return false;
                return true;
            })
            .catch((err) => false);

        if (!account)
            return res.status(404).json({ message: "Account not found" });
        if (!application)
            return res.status(404).json({ message: "Application not found" });

        const savedJO = await jo.save();

        res.status(201).json(savedJO);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/maintenance", async (req, res) => {
    const { type, remarks, inquiryID, accountID } = req.body;

    const jo = new JobOrder({
        type,
        remarks,
        inquiryID,
        accountID,
    });

    try {
        const account = await Account.findById(accountID)
            .then((account) => {
                if (account.isDeleted) return false;
                return true;
            })
            .catch((err) => false);

        const inquiry = await Inquiry.findById(inquiryID)
            .then((inquiry) => {
                if (inquiry.isDeleted) return false;
                return true;
            })
            .catch((err) => false);

        if (!account)
            return res.status(404).json({ message: "Inquiry not found" });
        if (!inquiry)
            return res.status(404).json({ message: "Application not found" });

        const savedJO = await jo.save();

        res.status(201).json(savedJO);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/:id", async (req, res) => {
    const { jobDate, status, branch, teamID } = req.body;
    const { id } = req.params;

    try {
        await JobOrder.findById(id, "-__v")
            .then(async (jo) => {
                if (jo.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Job Order not found" });

                await Team.findById(id).then(async (team) => {
                    if (team.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Team not found" });

                    const updatedJobOrder = await JobOrder.findByIdAndUpdate(
                        id,
                        {
                            $set: {
                                jobDate,
                                status,
                                branch,
                                teamID,
                            },
                        }
                    );

                    res.status(200).json({
                        ...updatedJobOrder._doc,
                        jobDate,
                        status,
                        branch,
                        teamID,
                    });
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Job Order not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/equipments/:id", async (req, res) => {
    const { equipmentsUsed } = req.body;
    const { id } = req.params;

    try {
        await JobOrder.findById(id)
            .then(async (jo) => {
                if (jo.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Job Order not found" });

                const updatedJobOrder = await JobOrder.findByIdAndUpdate(id, {
                    $set: { equipmentsUsed },
                });

                res.status(200).json({
                    ...updatedJobOrder._doc,
                    equipmentsUsed,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Job Order not found" })
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
        await JobOrder.findById(id)
            .then(async (jo) => {
                if (jo.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Job Order not found" });

                const deletedJobOrder = await JobOrder.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedJobOrder._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Job Order not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await JobOrder.findById(id)
            .then(async (jo) => {
                if (jo.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Job Order not found" });

                const deletedJobOrder = await JobOrder.findByIdAndDelete(id);

                res.status(200).json(deletedJobOrder);
            })
            .catch((err) =>
                res.status(404).json({ message: "Job Order not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
