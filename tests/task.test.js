const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, 
    userOne, 
    setupDatabase,  
    userTwoId, 
    userTwo, 
    taskOne, 
    taskTwo, 
    taskThree } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description:'my test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})


test('Should length of response array is 2', async() => {
    const response = await request(app).get('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toBe(2)
})


//
// Task Test Ideas
//
// Should not create task with invalid description/completed
test('Should not create task with invalid description/completed', async () => {
    await request(app).post('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description: {
            type: Number
        },
        completed: {
            type: String
        }
    })
    .expect(400)
})

// Should not update task with invalid description/completed
test('Should not update task with invalid description/completed', async () => {
    await request(app).patch(`/tasks/${taskOne._id}`)
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description: {
            type: Number
        },
        completed: {
            type: String
        }
    })
    .expect(400)
})
// Should delete user task
test('Should delete user task', async () => {
    await request(app).delete(`/tasks/${taskOne._id}`)
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})
// Should not delete task if unauthenticated
test('Should not delete task if unauthenticated', async () => {
    await request(app).delete(`/tasks/${taskThree._id}`)
    .send()
    .expect(401)
})
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks