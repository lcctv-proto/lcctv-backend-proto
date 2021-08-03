const router = require("express").Router();
const Team = require("../models/Team");

router.get("/", async (req, res) => {
    try {
        const teams = await Team.find({}, "-__v")
            .populate("areaID", "-_id description imageURL")
            .populate("personnelIDs", "personnelName");

        res.status(200).json(teams.filter((team) => !team.isDeleted));
    } catch (err) {
        res.status(400).json({
            message: err,
        });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;

    try {
        if (type === "custom") {
            // TEAM-210801 001
            const prefix = id.toUpperCase().substring(0, 11);
            const team_ctr = parseInt(id.toUpperCase().substring(11), 10);

            await Team.findOne({ prefix, team_ctr }, "-__v")
                .populate("areaID", "-_id description imageURL")
                .populate("personnelIDs", "personnelName")
                .then((team) => {
                    if (team.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Team not found" });

                    res.status(200).json(team);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Team not found" })
                );
        } else {
            await Team.findById(id, "-__v")
                .populate("areaID", "-_id description imageURL")
                .populate("personnelIDs", "personnelName")
                .then((team) => {
                    if (team.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Team not found" });

                    res.status(200).json(team);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Team not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { description, areaID } = req.body;

    const team = new Team({
        description,
        areaID,
    });

    try {
        const savedTeam = await team.save();

        res.status(201).json(savedTeam);
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/installations/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Team.findById(id)
            .then(async (team) => {
                if (team.isDeleted)
                    return res.status(404).json({ message: "Team not found" });

                const incrementedTeam = await Team.findByIdAndUpdate(id, {
                    $inc: { installations: 1 },
                });

                res.status(200).json({
                    ...incrementedTeam._doc,
                    installations: installations + 1,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Team not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/personnel/:id", async (req, res) => {
    const { personnelIDs } = req.body;
    const { id } = req.params;

    try {
        await Team.findById(id).then(async (team) => {
            if (team.isDeleted)
                return res.status(404).json({ message: "Team not found" });

            const updatedTeam = await Team.findByIdAndUpdate(id, {
                $set: { personnelIDs },
            });

            res.status(200).json({
                ...updatedTeam._doc,
                personnelIDs,
            });
        });
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Team.findById(id).then(async (team) => {
            if (team.isDeleted)
                return res.status(404).json({ message: "Team not found" });

            const deletedTeam = await Team.findByIdAndUpdate(id, {
                $set: { isDeleted: true },
            });

            res.status(200).json({
                ...deletedTeam._doc,
                isDeleted: true,
            });
        });
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/hard/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Team.findById(id).then(async (team) => {
            if (team.isDeleted)
                return res.status(404).json({ message: "Team not found" });

            const deletedTeam = await Team.findByIdAndDelete(id);

            res.status(200).json(deletedTeam);
        });
    } catch (err) {
        res.status(400).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
