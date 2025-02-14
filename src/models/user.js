const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Password cannot contain password')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true,
}
)


//defining a relationshiop between user and tasks not actaully saving task in user table but linking them
userSchema.virtual('task', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// returing user public profile means removing password and tokens
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// generate token and save to data base and return in the response
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//check email and password if exist
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await Users.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password.toString(), user.password.toString())
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user;
}

//middlware for saving encrypted password 
userSchema.pre('save', async function (next) {
    const user = this
    const password = user.password.toString();

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(password, 8)
    }

    next()
})

//middlware for removing the associated tasks to user 
userSchema.pre('remove', async function (next) {
    const user = this
    await task.deleteMany({ owner: user._id });
    next()
})

// user model
const Users = mongoose.model('Users', userSchema)

module.exports = Users
