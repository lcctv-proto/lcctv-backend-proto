const router = require("express").Router();
const Personnel = require("../models/Personnel");

router.get("/", async (req, res) => {
    try {
        const personnel_list = await Personnel.find().populate(
            "roleID",
            "description"
        );
        res.status(200).json(
            personnel_list.filter((personnel) => !personnel.isDeleted)
        );
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const personnel = await Personnel.findById(req.params.id);

        if (personnel.isDeleted)
            return res.status(404).json({ message: "Personnel not found" });

        res.status(200).json(personnel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { personnelName, roleID } = req.body;

    const personnel = new Personnel({
        prefix: "EMP",
        personnelName: personnelName,
        username: "",
        password: "",
        roleID: roleID,
        isDeleted: false,
    });

    try {
        const savedPersonnel = await personnel.save();
        res.status(201).json(savedPersonnel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/register/:id", async (req, res) => {
    const { username, password } = req.body;

    try {
        const personnel = await Personnel.findById(req.params.id);

        if (personnel.isDeleted)
            res.status(404).json({ message: "Personnel not found" });

        const updatedPersonnel = await Personnel.findByIdAndUpdate(
            req.params.id,
            {
                $set: { username: username, password: password },
            }
        );
        updatedPersonnel.username = username;
        updatedPersonnel.password = password;
        res.status(200).json(updatedPersonnel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const personnel = await Personnel.findById(req.params.id);

        if (personnel.isDeleted)
            res.status(404).json({ message: "Personnel not found" });

        const deletedPersonnel = await Personnel.findByIdAndUpdate(
            req.params.id,
            {
                $set: { isDeleted: true },
            }
        );
        deletedPersonnel.isDeleted = true;
        res.status(200).json(deletedPersonnel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedPersonnel = await Personnel.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json(deletedPersonnel);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
