const Sequelize = require('sequelize')

class DatabaseManager {

    constructor() {
        this.mysql = null
        this.models = {}
    }

    connect() {
        this.mysql = new Sequelize('chat', 'root', 'root', {
            host: process.env.DATABASE_HOST || 'localhost',
            dialect: 'mysql'
        })
        this.setupModels()
    }

    setupModels() {
        this.models["User"] = this.mysql.define('user', {
            username: Sequelize.STRING,
            password: Sequelize.STRING
        })
        this.models["Status"] = this.mysql.define('status', {
            online: Sequelize.BOOLEAN,
            token: Sequelize.STRING
        })
        this.models["Status"].belongsTo(this.models["User"])

        this.models["Chat"] = this.mysql.define('chat', {
            name: Sequelize.STRING,
        })

        this.models["Message"] = this.mysql.define('message', {
            contents: Sequelize.STRING,
        })
        this.models["Message"].belongsTo(this.models["User"], {as: 'sender'})
        
        this.models["Chat"].hasMany(this.models["Message"])

        this.models["UserChats"] = this.mysql.define('userchats', {
        })

        this.models["Chat"].belongsToMany(this.models["User"], {through: this.models["UserChats"]})

        for (let model of Object.values(this.models)) {
            model.sync()
        }
    }

}

module.exports = DatabaseManager