const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const docoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: docoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user

        next()
    } catch (error) {
        res.status(404).send({ error: 'Please authenticate' })
    }

    // next()
}

module.exports = auth;