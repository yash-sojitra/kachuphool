const mongoose = require("mongoose")
const validator = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.statics.signup = async function (username, email, password) {
    if (!username || !email || !password) {
        throw Error("All fields are required")
    }
    if (!validator.isEmail(email)) {
        throw Error("not a valid email address")
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("strong password required")
    }

    const exists = await this.findOne({ email })    
    if (exists) {
        throw Error("user already exists")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await this.create({ username, email, password: hashedPassword })
    return user
}

userSchema.statics.login = async function (email, password) {

    if (!email || !password) {
        throw Error("all fields are required")
    }
    if (!validator.isEmail(email)) {
        throw Error("not a valid email address")
    }

    const user = await this.findOne({ email })
    if(!user) {
        throw Error("incorrect email")
    }

    const match = bcrypt.compare(password, user.password)

    if(!match){
        throw Error("incorrect password")
    }

    return user
}

module.exports = mongoose.model('User', userSchema);
