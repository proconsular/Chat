const express = require('express')
const body_parser = require('body-parser')
const app = express()
const DatabaseManager = require('./models')
const UserController = require('./controllers/UserController')
const bcrypt = require('bcrypt')
const tokens = require('jsonwebtoken')
const Sequelize = require('sequelize')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

class App {
    constructor() {
        this.database = new DatabaseManager()
        this.users = new UserController(this.database)
    }
    
    start() {
        app.use(body_parser.json())

        this.database.connect()

        let publicRouter = express.Router()
        let users = this.database.models["User"]
        let statuses = this.database.models["Status"]
        let chats = this.database.models["Chat"]
        let messages = this.database.models["Message"]
        let userchats = this.database.models["UserChats"]

        publicRouter.post('/accounts', async (req, res) => {
            try {
                let user = req.body
                bcrypt.hash(user.password, 10, (err, hash) => {
                    users.create({username: user.username, password: hash}).then(user => {
                        res.json(user)
                    })
                })
            } catch (err) {
                res.json(err)
            }
        })

        publicRouter.get('/accounts', async (req, res) => {
            try {
                let username = req.query["username"]
                let password = req.query["password"]
                let user = await users.findOne({where: {username: username}})
                bcrypt.compare(password, user.password, (err, match) => {
                    if (match) {
                        let token = tokens.sign({username: user.username, password: user.password}, "123", {expiresIn: "4h"})
                        statuses.findAll({where: {userId: user.id}}).then(records => {
                            let response = {
                                token: token,
                                id: user.id,
                                username: user.username
                            }
                            if (records.length == 0) {
                                statuses.create({token: token, userId: user.id, online: true}).then(record => {
                                    res.json(response)
                                })
                            } else {
                                statuses.update({token: token, userId: user.id, online: true}, {where: {userId: user.id}}).then(record => {
                                    res.json(response)
                                })
                            }
                        })
                    } else {
                        res.json({error: true, message: "Unauthorized."})
                    }
                })
            } catch (err) {
                res.json(err)
            }
        })

        let privateRouter = express.Router()

        let authorize = async (req, res, next) => {
            if (req.headers["authorization"] === undefined) {
                return next('router')
            } else {
                try {
                    let auth = req.headers["authorization"]
                    let token = auth.split(" ")[1]

                    let payload = tokens.verify(token, "123", {expiresIn: "4h"})

                    if (payload.username && payload.password) {
                        let user = await users.findOne({where: {username: payload.username, password:payload.password}})
                        let status = await statuses.findOne({where: {userId: user.id}})
                        if (status.online && status.token === token) {
                            next()
                        } else {
                            throw new Error("Unauthorized.")
                        }
                    }
                } catch (err) {
                    res.json({error: true, message: err.message, stack: err})
                }
            }
        }
        
        privateRouter.all('*', authorize)

        privateRouter.get('/users', async (req, res) => {
            try {
                let records = await users.findAll()
                res.json(records)
            } catch (err) {
                res.json(err.message)
            }
        })

        privateRouter.post('/chats', async (req, res) => {
            try {
                let name = req.body.name
                let ids = req.body.users
                let chat = await chats.create({name})
                for (let id of ids) {
                    let user = await users.findOne({where: {id: id}})
                    chat.addUser(user)
                }
                await chat.save()
                res.json(chat)
            } catch (err) {
                res.json({error: true, message: err.message})
            }
        })

        privateRouter.get('/chats', async (req, res) => {
            try {
                if (Object.keys(req.query).length > 0) {
                    if (req.query.id !== undefined) {
                        let chat = await chats.findOne({where: {id: req.query.id}, include: [users]})
                        res.json(chat)
                    } else if (req.query.userId !== undefined) {
                        let records = await chats.findAll({include: [{model: users, where: {id: req.query.userId}}]})
                        res.json(records)
                    }
                } else {
                    let records = await chats.findAll()
                    res.json(records)
                }
            } catch (err) {
                res.json({error: true, message: err.message})
            }
        })

        privateRouter.put('/chats', async (req, res) => {
            try {
                if (req.query.id) {
                    console.log(req.body)
                    let record = await chats.update(req.body, {where: {id: req.query.id}})
                    res.json(record)
                } else {
                    throw new Error("")
                }
            } catch (err) {
                res.json({error: true, message: err.message})
            }
        })

        privateRouter.delete('/chats', async (req, res) => {
            try {
                if (req.query.id && req.query.userId) {
                    let record = await chats.findOne({where: {id: req.query.id}, include: [users]})
                    let user = await users.findOne({where: {id: req.query.userId}})
                    await record.removeUser(user)
                    await record.save()
                    await user.save()
                    if (record.users.length <= 2) {
                        await chats.destroy({where: {id: record.id}})
                        res.json({object: "chat"})
                    } else {
                        res.json({object: "user"})
                    }
                }
            } catch (err) {
                res.json({error: true, message: err.message})
            }
        })

        privateRouter.post('/messages', async (req, res) => {
            try {
                let message = await messages.create(req.body)
                res.json(message)
            } catch (err) {
                res.json({error: true, message: err.message})
            }
        })

        privateRouter.get('/messages', async (req, res) => {
            try {
                if (req.query.chatId !== undefined) {
                    let records = await messages.findAll({where: {chatId: req.query.chatId}})
                    res.json(records)
                } else {
                    throw new Error("ChatId required.")
                }
            } catch (err) {
                res.json({error: true, message: err.message})
            }
        })

        publicRouter.put('/accounts', async (req, res) => {
            try {
                let username = req.query.username
                let user = await users.findOne({where: {username: username}})
                await statuses.update({online: false}, {where: {userId: user.id}})
                res.json({})
            } catch (err) {
                res.json(err.message)
            }
        })

        app.use('/api', privateRouter, publicRouter, (req, res) => {
            res.sendStatus(404)
        })
    
        io.on('connection', socket => {
            console.log("connected.")
            socket.on('message', async (message) => {
                try {
                    let record = await messages.create(message)
                    io.emit('message', record)
                } catch(err) {

                }
            })
        })

        http.listen(8000)
    }

}

module.exports = App