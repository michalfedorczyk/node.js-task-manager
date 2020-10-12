const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { app } = require('../src/app')
const User = require('../src/models/user')
const Task = require('../src/models/task')

const { userOne, setupDatabase, fakeUser, taskOne } = require('./fixtures/db')
const { userLeaveMessage } = require('../src/emails/account')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description:'Pies',
            completed: true
        })
        .expect(201)
})