const sgmail = require('@sendgrid/mail')


sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'umar.rasheed.mebest@gmail.com',
        subject: 'Thank you for joining in',
        text: `Welcome to TechSaaz ${name}.`,
    }

    sgmail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}


module.exports = {
    sendWelcomeEmail
}