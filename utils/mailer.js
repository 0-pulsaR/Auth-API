const MailSlurp = require('mailslurp-client').default;
const apiKey = process.env.MAILSLURP_KEY;
const mailslurp = new MailSlurp({ apiKey });

const sendMail = async (email, subject, HTMLBodyScheme) => { // subject,
    try {
        await mailslurp.sendEmail(process.env.MAILSLURP_INBOX_KEY, {
            to: [email],
            subject: subject,
            body: HTMLBodyScheme,
            charset: "utf8",
            html: true,
        });
    } catch (error) {
        return 'Something went wrong..!'
    }
}

module.exports = sendMail;