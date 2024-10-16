const jwt = require("jsonwebtoken")
const User = require("../models/User")

const verifyToken = async (req, res, next) => {

    const authorization = req.headers;

    if(!authorization){
        return res.status(401).json({error: "authorization token required"})
    }

    const token = authorization.spilt(" ")[1]

    try {
        const { _id } = await jwt.verify(token, process.env.SECRET)

        req.user = await User.findOne({ _id }).select('_id')
        next()

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' })
    }

}