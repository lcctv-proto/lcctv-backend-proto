const router = require("express").Router();
const Application = require("../models/Application");
const Account = require("../models/Account");
const auth = require("../auth/auth");

const nodemailer = require("nodemailer");
const Email = require("email-templates");

const transporter = nodemailer.createTransport({
    host: "us2.smtp.mailhostbox.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: { secureProtocol: "TLSv1_method" },
});

const email = new Email({
    message: {
        from: process.env.EMAIL_USERNAME,
    },
    send: true,
    transport: transporter,
});

router.get("/", auth, async (req, res) => {
    try {
        const applications = await Application.find().populate({
            path: "accountID",
            populate: { path: "packageID", select: "-__v" },
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
    const { id } = req.params;
    const { type } = req.query;

    try {
        if (type === "custom") {
            //REF-210729 002
            const prefix = id.toUpperCase().substring(0, 10);
            const ref_ctr = parseInt(id.toUpperCase().substring(10), 10);

            await Application.findOne({ prefix, ref_ctr }, "-__v")
                .populate({
                    path: "accountID",
                    populate: {
                        path: "packageID",
                        select: "-__v",
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
                        select: "-__v",
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

    const application = new Application({
        remarks,
        accountID,
    });

    try {
        await Account.findById(accountID).then(async (account) => {
            if (account.isDeleted)
                return res.status(404).json({ message: "Account not found" });

            const savedApplication = await application.save();

            email
                .send({
                    template: "../emails/application/",
                    message: {
                        to: [
                            account.contactInfo.email,
                            "vizcocho.gerarddominic@ue.edu.ph",
                        ],
                    },
                    locals: {
                        name: account.accountName,
                        ref_number: `${
                            savedApplication._doc.prefix
                        }${savedApplication._doc.ref_ctr
                            .toString()
                            .padStart(3, "0")}`,
                    },
                })
                .then(res.status(201).json(savedApplication))
                .catch(console.error);
        });
    } catch (err) {
        res.status(500).json({
            message: "Error. Please contact your administrator.",
        });
    }
});

router.patch("/status/:id", auth, async (req, res) => {
    const { status, step } = req.body;
    const { id } = req.params;

    try {
        await Application.findById(id)
            .then(async (application) => {
                if (application.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Application not found" });

                const updatedApplication = await Application.findByIdAndUpdate(
                    id,
                    {
                        $set: { status, step },
                    }
                );

                res.status(200).json({
                    ...updatedApplication._doc,
                    status,
                    step,
                });
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

router.patch("/account/:id", auth, async (req, res) => {
    const { accountID } = req.body;
    const { id } = req.params;

    try {
        await Application.findById(id)
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
                            await Application.findByIdAndUpdate(id, {
                                $set: { accountID },
                            });

                        res.status(200).json({
                            ...updatedApplication._doc,
                            accountID,
                        });
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

router.patch("/remarks/:id", auth, async (req, res) => {
    const { remarks } = req.body;
    const { id } = req.params;

    try {
        await Application.findById(id, "-__v")
            .then(async (application) => {
                if (application.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Application not found" });

                const updatedApplication = await Application.findByIdAndUpdate(
                    id,
                    {
                        $set: { remarks },
                    }
                );

                res.status(200).json({
                    ...updatedApplication._doc,
                    remarks,
                });
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

router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        await Application.findById(id, "-__v")
            .then(async (application) => {
                if (application.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Application not found" });

                const deletedApplication = await Application.findByIdAndUpdate(
                    id,
                    {
                        $set: { isDeleted: true },
                    }
                );

                res.status(200).json({
                    ...deletedApplication._doc,
                    isDeleted: true,
                });
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

router.delete("/hard/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        await Application.findById(id, "-__v")
            .then(async (application) => {
                if (application.isDeleted)
                    return res
                        .status(404)
                        .json({ message: "Application not found" });

                const deletedApplication = await Application.findByIdAndDelete(
                    id
                );

                res.status(200).json(deletedApplication);
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

module.exports = router;
