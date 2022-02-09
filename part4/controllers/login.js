const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    //body = info we got from client
    const body = request.body

    //starts by searching for the user from the database
    //by the username attached to the request
    const user = await User.findOne({ username: body.username })

    //Next, it checks the password, also attached to the request. 
    //Because the passwords themselves are not saved to the database,
    //but hashes calculated from the passwords,
    //the bcrypt.compare method is used to check if the password is correct
    const passwordCorrect = user === null
        ? false
        //body.password = from client, 
        : await bcrypt.compare(body.password, user.passwordHash)

    // if user not found or pw not correct
    if (!(user && passwordCorrect)) {
        // the request is responded to with the status code 401 unauthorized
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }


    const userForToken = {
        username: user.username,
        id: user._id,
    }

    //else aka login correct, a token is created with the method jwt.sign
    // the token contains username and user id

    // token expires in 60*60 seconds, that is, in one hour
    // Once the token expires, the client app needs to get a new token. 
    //Usually this happens by forcing the user to relogin to the app.
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 }
    )

    response
        .status(200)
        //The generated token and the username of the user are sent back in the response body.
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
