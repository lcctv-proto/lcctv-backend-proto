const router = require("express").Router();
const Account = require("../models/Account");

router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts.filter((acc) => !acc.isDeleted));
    } catch (err) {
        res.status(400).json({ message: err });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);

        !account.isDeleted
            ? res.status(200).json(account)
            : res.status(404).json({ message: "Not Found" });
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.post("/", (req, res) => {
    res.send("CREATE ACCOUNT");
});

router.put("/:id", (req, res) => {
    res.send(`EDIT ACCOUNT WITH ACCOUNT ID: ${req.params.id}`);
});

router.delete("/:id", (req, res) => {
    res.send(`DELETE ACCOUNT WITH ACCOUNT ID: ${req.params.id} \nSOFT DELETE*`);
});

module.exports = router;
