const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const router = new express.Router()

// router.get('/test', (req,res) => {
//     res.send('form a new file')
// })

// Create 
router.post('/users', async (req, res)=> {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e)=> {
    //     res.status(400).send(e)
    // })
})

router.post('/users/login', async(req, res) => {
    try {
        //model method
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //instance  method
        const token = await user.generateAuthToken()

        res.send({user, token})
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {

        //console.log('tokens',req.user.tokens)

        req.user.tokens = req.user.tokens.filter((token) => {

            //console.log('token object',token)
           // console.log('request token',req.token)
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()        
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send() 
    }
})

// Read
router.get('/users/me', auth, async (req, res) => {
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (error) {
    //     res.status(500).send()
    // }
    res.send(req.user)
})

// router.get('/users/:id', async (req,res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send()
//     }

//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

// Update
router.patch('/users/me', auth, async(req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidaOperation = updates.every((update) =>  allowedUpdates.includes(update))
 
    if (!isValidaOperation) {
        return res.status(400).send({error: "Invalidate updates !"})
    }

    try {

        //const user = await User.findById(req.user._id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        // if (!user) {
        //     return res.status(404).send()
        // }
        
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Delete
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        // console.log(req.user.email)
        // console.log(req.user.name)
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

const upload = multer( {
    //dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb (new Error('Please upload jpb/jpeg/png'))
        }

        cb(undefined,true)
    }
})

// router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
//     res.status(200).send()
// })

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    //console.log(req.file) remove the dest to get buffer
    //console.log(req.user)

    //req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.delete('/users/me/avatar', auth, async (req, res) => {

    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error ()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()        
    }
})

module.exports = router