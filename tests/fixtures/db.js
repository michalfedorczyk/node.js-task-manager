const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')

const userOneID = new mongoose.Types.ObjectId()
const taskOneID = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneID,
    name: 'Michał',
    email: 'michalfedorczyk@gmail.com',
    password: 'Piesek1234!',
    tokens: [{
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }]
}

const fakeUser = {
    name: 'Faker',
    email: 'fake@fake.pl',
    password: 'Fake1234!',
}

const taskOne = {
    description: 'Pies',
    completed: false
}

const setupDatabase = async () => {
    await User.deleteMany({})
    await new User(userOne).save()
}

module.exports = {
    userOne,
    fakeUser,
    setupDatabase,
}