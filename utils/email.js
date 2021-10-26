const domain = process.env.EMAIL_DOMAIN;
const apiKey = process.env.EMAIL_API_KEY;

const mailgun = require("mailgun-js")({
    domain,
    apiKey,
});

mailgun
    .messages()
    .send({
        from: `test@${domain}`,
        to: "vizcochogerard@yahoo.com",
        subject: "Hello from Mailgun",
        text: "This is a test asdasdasda woohoo!",
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
