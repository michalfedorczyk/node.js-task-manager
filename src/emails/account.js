const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMessage = (email, name) => {
    sgMail.send({
        to: email,
        from: 'michalfedorczyk@gmail.com',
        subject: 'Thank you for registration',
        text: `Hi there, is very nice to meet you ${name}.`
    })
}

const userLeaveMessage = (email, name) => {
    sgMail.send({
        to: email,
        from: 'michalfedorczyk@gmail.com',
        subject: 'Bye bye',
        text: `We are sorry, you are leaving us ${name}`
    })
}

module.exports = {
    sendWelcomeMessage,
    userLeaveMessage
}