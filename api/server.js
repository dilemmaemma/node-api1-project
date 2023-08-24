// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')
const server = express()
server.use(express.json())

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users)
            // throw new Error('This is how you make it jump to catch manually')
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting users',
                err: err.message,
                stack: err.stack, // Shows location of error
            })
        })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if(!user) {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist'
                })
            }
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({
                message: `Error fetching user`,
                err: err.message,
                stack: err.stack
            })
        })
})

server.post('/api/users', (req, res) => {
    const user = req.body
    if (!user.name || !user.bio) {
        res.status(400).json({
            message: 'Please provide name and bio for the user'
        })
    } else {
        User.insert(user)
            .then(createdUser => {
                res.status(201).json(createdUser)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Error creating user',
                    err: err.message,
                    stack: err.stack
                })
            })
    }
})

server.put('/api/users/:id', async (req, res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if (!possibleUser) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else {
            if (!req.body.name || !req.body.bio) {
                res.status(400).json({
                    message: 'Please provide name and bio for the user'
                })
            } else {
                const updatedUser = await User.update(
                    req.params.id, 
                    req.body
                )
                res.status(200).json(updatedUser)
            }
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error updating user',
            err: err.message,
            stack: err.stack
        })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if (!possibleUser) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else {
            const deletedUser = await User.remove(possibleUser.id)
            res.status(200).json(deletedUser)
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting user',
            err: err.message,
            stack: err.stack
        })
    }
})

server.use('*', (req, res) => { // Catch all - no other matching input
    res.status(404).json({
        message: 'Error: Not found'
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
