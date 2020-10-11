const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { app } = require('../src/app')
const User = require('../src/models/user')


const userOneID = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneID,
    name: 'Michał',
    email: 'sfedorczyk@gmail.com',
    password: 'Piesek1234!',
    tokens: [{
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany({})
    await new User(userOne).save()
})

const fakeUser = {
    name: 'Faker',
    email: 'fake@fake.pl',
    password: 'Fake1234!',
}

test('Should sign up new User', async () => {
    await request(app).post('/users').send({
        name: 'Michał',
        email: 'michalfedorczyk@gmail.com',
        password: 'Piesek1234!'
    }).expect(201)
})

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login nonexisting in database user', async () => {
    await request(app).post('/users/login').send({
        email: fakeUser.email,
        password: fakeUser.password
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(404)
})