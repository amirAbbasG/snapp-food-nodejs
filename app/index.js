const express = require('express')
require('express-async-errors')
require('winston-mongodb')
const winston = require('winston')
const mongoose = require('mongoose')
const cors = require('cors')

const {errorHandler} = require('./http/middlewares/ErrorHandler')
const api = require('./routes')

const app = express()

class App {
    constructor() {
        this.setupErrorHandlers()
        this.setupMongoDB()
        this.setupRoutesAndMiddlewares()
        this.setupExpressServer()
    }

    setupErrorHandlers(){
        winston.add( new winston.transports.File({filename: 'error_logs.log'}))
        winston.add(new winston.transports.MongoDB({
            db: 'mongodb://127.0.0.1:27017/snapFood',
            level: 'error'
        }))
        process.on('unhandledRejection', (err) => {
            console.log(err)
            winston.error(err.message)
        })
        process.on('uncaughtException', (err) => {
            console.log(err)
            winston.error(err.message)
        })
    }

    setupMongoDB(){
        mongoose.connect('mongodb://127.0.0.1:27017/snapFood',{
            useUnifiedTopology: true,
            useNewUrlParser: true,

        })

        mongoose.connection.on('connected', () => {
            console.log('connected to db')
        })
        mongoose.connection.on('error', (error) => {
            console.log(error)
        })
        mongoose.connection.on('disconnected', () => {
            console.log('db disconnected')
        })
    }

    setupRoutesAndMiddlewares(){
        // middlewares
        app.use(cors())
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
        app.use(express.static('public'))
        // routes
        app.use('/api', api)
        // error middleware
        app.use(errorHandler)
    }

    setupExpressServer() {
        const port = process.env.myEnve || 4000
        app.listen(port, (error) => {
            if (error){
                console.log(error)
            }else {
                console.log(`listen to port ${port}`)
            }
        })
    }
}

module.exports = App
