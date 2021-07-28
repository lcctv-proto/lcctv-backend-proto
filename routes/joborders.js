const router = require("express").Router();
const JobOrder = require("../models/JobOrder");

router.get("/", async (req, res) => {
    try {
        const jos = await JobOrder.find()
            .populate("accountID", "_id accountName")
            .populate({
                path: "teamID",
                populate: { path: "personnelIDs", select: "personnelName" },
                select: "personnelIDs description",
            })
            .populate("applicationID", "date status")
            .populate(
                "inquiryID",
                "-_id -prefix -date -isDeleted -inq_ctr -__v -accountID"
            )
            .populate({
                path: "equipmentsUsed",
                populate: { path: "equipmentID", select: "description price" },
            });
        res.status(200).json(jos.filter((jo) => !jo.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const jo = await JobOrder.findById(req.params.id)
            .populate("accountID", "_id accountName")
            .populate({
                path: "teamID",
                populate: { path: "personnelIDs", select: "personnelName" },
                select: "personnelIDs description",
            })
            .populate("applicationID", "date status")
            .populate(
                "inquiryID",
                "-_id -prefix -date -isDeleted -inq_ctr -__v -accountID"
            )
            .populate({
                path: "equipmentsUsed",
                populate: { path: "equipmentID", select: "description price" },
            });

        if (jo.isDeleted)
            return res.status(404).json({ message: "Job Order not found" });

        res.status(200).json(jo);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/installation/", async (req, res) => {
    const { type, remarks, applicationID, accountID } = req.body;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    const prefix = `JO-${yyyy}${mm}${dd}`;

    const jo = new JobOrder({
        prefix: prefix,
        date: Date.now(),
        status: "PENDING",
        type: type,
        remarks: remarks,
        applicationID: applicationID,
        accountID: accountID,
        isDeleted: false,
    });

    try {
        const savedJO = await jo.save();
        res.status(201).json(savedJO);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/maintenance/", async (req, res) => {
    const { type, remarks, inquiryID, accountID } = req.body;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    const prefix = `JO-${yyyy}${mm}${dd}`;

    const jo = new JobOrder({
        prefix: prefix,
        date: Date.now(),
        status: "PENDING",
        type: type,
        remarks: remarks,
        inquiryID: inquiryID,
        accountID: accountID,
        isDeleted: false,
    });

    try {
        const savedJO = await jo.save();
        res.status(201).json(savedJO);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/:id", async (req, res) => {
    const { jobDate, status, branch, teamID } = req.body;

    try {
        const jo = await JobOrder.findById(req.params.id);

        if (jo.isDeleted)
            res.status(404).json({ message: "Job Order not found" });

        const updatedJobOrder = await JobOrder.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    jobDate: jobDate,
                    status: status,
                    branch: branch,
                    teamID: teamID,
                },
            }
        );

        updatedJobOrder.jobDate = jobDate;
        updatedJobOrder.status = status;
        updatedJobOrder.branch = branch;
        updatedJobOrder.teamID = teamID;

        res.status(200).json(updatedJobOrder);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/equipments/:id", async (req, res) => {
    const { equipmentsUsed } = req.body;

    try {
        const jo = await JobOrder.findById(req.params.id);

        if (jo.isDeleted)
            res.status(404).json({ message: "Job Order not found" });

        const updatedJobOrder = await JobOrder.findByIdAndUpdate(
            req.params.id,
            {
                $set: { equipmentsUsed: equipmentsUsed },
            }
        );

        updatedJobOrder.equipmentsUsed = equipmentsUsed;
        res.status(200).json(updatedJobOrder);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const jo = await JobOrder.findById(req.params.id);

        if (jo.isDeleted)
            res.status(404).json({ message: "Job Order not found" });

        const deletedJobOrders = await JobOrder.findByIdAndUpdate(
            req.params.id,
            {
                $set: { isDeleted: true },
            }
        );
        deletedJobOrders.isDeleted = true;
        res.status(200).json(deletedJobOrders);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedJobOrders = await JobOrder.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json(deletedJobOrders);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
