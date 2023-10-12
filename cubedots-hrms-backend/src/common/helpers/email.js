const send = require('../../libs/mailer')
const logger = require('./logger')

const sendEmail = async (toEmail, params, type, subject , content) => {
    const mailBody = {
        type: `${type}`,
        to: `${toEmail}`,
        subject: `${subject}`,
        vars: {
            ...params
        },
        content: content
    }
    logger.debug('Sending an email', { email: `${toEmail}` })
    console.log(mailBody)
    await send(mailBody)
}
module.exports = sendEmail
