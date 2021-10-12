const router = require("express").Router();
const Personnel = require("../models/Personnel");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
    try {
        const personnel_list = await Personnel.find({}, "-__v").populate(
            "roleID",
            "description"
        );

        res.status(200).json(
            personnel_list.filter((personnel) => !personnel.isDeleted)
        );
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
            // EMP-210801 001
            const prefix = id.toUpperCase().substring(0, 10);
            const emp_ctr = parseInt(id.toUpperCase().substring(10), 10);

            await Personnel.findOne({ prefix, emp_ctr }, "-__v")
                .populate("roleID", "description")
                .then((personnel) => {
                    if (personnel.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Personnel not found" });

                    res.status(200).json(personnel);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Personnel not found" })
                );
        } else {
            await Personnel.findById(id, "-__v")
                .populate("roleID", "description")
                .then((personnel) => {
                    if (personnel.isDeleted)
                        return res
                            .status(404)
                            .json({ message: "Personnel not found" });

                    res.status(200).json(personnel);
                })
                .catch((err) =>
                    res.status(404).json({ message: "Personnel not found" })
                );
        }
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/", async (req, res) => {
    const { personnelName, contactNumber, roleID } = req.body;

    const personnel = new Personnel({
        personnelName,
        contactNumber,
        roleID,
    });

    try {
        await Role.findById(roleID)
            .then(async (role) => {
                if (role.isDeleted)
                    return res.status(404).json({ message: "Role not found" });

                const savedPersonnel = await personnel.save();

                res.status(201).json(savedPersonnel);
            })
            .catch((err) =>
                res.status(404).json({ message: "Role not found" })
            );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

const users = [];

router.post("/register/:id", async (req, res) => {
    const { username, password } = req.body;
    const { id } = req.params;

    try {
        await Personnel.findById(id)
            .then(async (personnel) => {
                if (personnel.isDeleted)
                    return res
                        .status(404)
                        .json({ personnel: "Personnel not found" });

                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password, salt);

                const updatedPersonnel = await Personnel.findByIdAndUpdate(id, {
                    $set: { username, password: hashedPassword },
                });

                res.status(200).json({
                    ...updatedPersonnel._doc,
                    username,
                    password: hashedPassword,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Personnel not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.post("/login/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Personnel.findOne(
            { username },
            "_id roleID username password"
        );

        if (!user) return res.status(404).send("Username not found!");

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user._id, username, roleID: user.roleID },
                process.env.TOKEN,
                {
                    expiresIn: "1h",
                }
            );

            return res.status(200).send({ ...user._doc, token });
        }

        res.status(403).send("Wrong password!");
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Personnel.findById(id)
            .then(async (personnel) => {
                if (personnel.isDeleted)
                    return res
                        .status(404)
                        .json({ personnel: "Personnel not found" });

                const deletedPersonnel = await Personnel.findByIdAndUpdate(id, {
                    $set: { isDeleted: true },
                });

                res.status(200).json({
                    ...deletedPersonnel._doc,
                    isDeleted: true,
                });
            })
            .catch((err) =>
                res.status(404).json({ message: "Personnel not found" })
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
        await Personnel.findById(id)
            .then(async (personnel) => {
                if (personnel.isDeleted)
                    return res
                        .status(404)
                        .json({ personnel: "Personnel not found" });

                const deletedPersonnel = await Personnel.findByIdAndDelete(id);

                res.status(200).json(deletedPersonnel);
            })
            .catch((err) =>
                res.status(404).json({ message: "Personnel not found" })
            );
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

module.exports = router;
