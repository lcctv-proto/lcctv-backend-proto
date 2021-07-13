const router = require("express").Router();
const Team = require("../models/Team");

router.get("/", async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json(teams.filter((team) => !team.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (team.isDeleted)
            return res.status(404).json({ message: "Team not found" });

        res.status(200).json(team);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { description, areaID } = req.body;

    const team = new Team({
        prefix: "TEAM",
        description: description,
        installations: 0,
        areaID: areaID,
        isDeleted: false,
    });

    try {
        const savedTeam = await team.save();
        res.status(201).json(savedTeam);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/installations/:id", async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (team.isDeleted) res.status(404).json({ message: "Team not found" });

        const incrementedTeam = await Team.findByIdAndUpdate(req.params.id, {
            $inc: { installations: 1 },
        });
        incrementedTeam.installations += 1;
        res.status(200).json(incrementedTeam);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/personnel/:id", async (req, res) => {
    const { personnelIDs } = req.body;

    try {
        const team = await Team.findById(req.params.id);

        if (team.isDeleted) res.status(404).json({ message: "Team not found" });
        const updatedTeam = await Team.findByIdAndUpdate(req.params.id, {
            $set: { personnelIDs: personnelIDs },
        });
        updatedTeam.personnelIDs = personnelIDs;
        res.status(200).json(updatedTeam);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (team.isDeleted) res.status(404).json({ message: "Team not found" });

        const deletedTeam = await Team.findByIdAndUpdate(req.params.id, {
            $set: { isDeleted: true },
        });
        deletedTeam.isDeleted = true;
        res.status(200).json(deletedTeam);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    try {
        const deletedTeam = await Team.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedTeam);
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
