const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: 'said.boughefir@cgi.com',
//     from: 'abc@cgi.com',
//     subject: 'This is a test email',
//     text: 'I am testing the email function'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'boss@cgi.com',
        subject: 'Thanks for joining in !',
        text: `Welcome to the app ${name}.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'boss@cgi.com',
        subject: 'Thanks for joining again !',
        text: `Your app has been canceled ${name}.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}