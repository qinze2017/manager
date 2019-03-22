const express = require('express')
require('./db/mongoose.js')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT


// // file upload
// const multer = require('multer')
// const upload = multer( {
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {

//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb (new Error('Please upload a PDF'))
//         }

//         cb (undefined, true)
//         // cb( new Error ('File must be a PDF'))
//         // cb( undefined, true)
//         // cb( undefined, false)

//     }
// })

// const errorMiddleware = (req, res, next) => {
//     throw new Error('From middleware')
// }

// app.post('/upload', errorMiddleware, (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({
//         error: error.message
//     })
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({
//         error: error.message
//     })
// })

//middleware function
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down, check later!')        
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server port : ' + port)
})

// const bcrypt = require('bcryptjs')

// const jwt = require('jsonwebtoken')


// const pet = {
//     name: 'well'
// }

// pet.toJSON = function () {
//     // console.log(this)
//     // return this
//     return {}
// }

// console.log(JSON.stringify(pet))

// const myFunction = async () => {
//     // const password = 'Abc12345!'
//     // const hashedPassword = await bcrypt.hash(password, 8)

//     // console.log(password)
//     // console.log(hashedPassword)

//     // const isMatch = await bcrypt.compare('Abc12345!', hashedPassword) 
//     // console.log(isMatch)

//     const token = jwt.sign({ _id: 'abc123' }, 'secretpk', {expiresIn: '7 days'})
//     console.log(token)

//     const data = jwt.verify(token,'secretpk')
//     console.log(data)

// }

// myFunction()

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5c93a1c18458dc3f7cffa898')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     // const user = await User.findById('5c93a1828458dc3f7cffa895')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)
// }

// main()