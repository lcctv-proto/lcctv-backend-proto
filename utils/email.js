const nodemailer = require("nodemailer");
const Email = require("email-templates");

// const transporter = nodemailer.createTransport({
//     host: "us2.smtp.mailhostbox.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: "applications@lakecommunity.tech",
//         pass: "OZt$apO6",
//     },
//     tls: { secureProtocol: "TLSv1_method" },
// });

// const email = new Email({
//     message: {
//         from: "applications@lakecommunity.tech",
//     },
//     send: true,
//     transport: transporter,
// });

// email
//     .send({
//         template: "../emails/application/",
//         message: {
//             to: [
//                 "vizcochogerard@yahoo.com",
//                 "umali.charlesedward@ue.edu.ph",
//                 "vizcocho.gerarddominic@ue.edu.ph",
//                 "reguyal.jonjester@ue.edu.ph",
//             ],
//         },
//         locals: {
//             name: "Gerard Vizcocho",
//             ref_number: "REF-211116001",
//         },
//     })
//     .then(console.log("Success! "))
//     .catch(console.error);

exports.email = email;
