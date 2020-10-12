const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { app } = require('../src/app')
const User = require('../src/models/user')
const { userOne, setupDatabase, fakeUser } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up new User', async () => {
    const response = await request(app).post('/users').send({
        name: 'Michał',
        email: 'sfedorczyk@gmail.com',
        password: 'Piesek1234!'
    }).expect(201)

    // Database was correctly changed
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Checking the whole Object in Database
    expect(response.body).toMatchObject({
        user: {
            name: 'Michał',
            email: 'sfedorczyk@gmail.com',
        },
        token: user.tokens[0].token
    })

    expect(response.body.user.password).not.toBe('Piesek1234!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body).toMatchObject({
        user: {
            name: 'Michał',
            email: 'michalfedorczyk@gmail.com',
        },
        token: user.tokens[1].token
    })
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

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .send()
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(User.findById(userOne._id)).toBeNull
})

test('Should upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar/')
        .send()
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update user data', async () => {
    const newUserData = {
        name: 'Pies',
        email: 'jamnik@gmail.com',
        age: 12
    }

    const response = await request(app)
        .patch('/users/me')
        .send(newUserData)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(201)

    const user = await User.findById(userOne._id)
    expect(user).toMatchObject(newUserData)
})

test('Should not update invalid user data', async () => {
    const newUserData = {
        name: 'Pies',
        email: 'jamnik@gmail.com',
        age: 12,
        location: 'Bisztynek'
    }

    const response = await request(app)
        .patch('/users/me')
        .send(newUserData)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(400)
})