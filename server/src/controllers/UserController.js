
class UserController {

    constructor(database) {
        this.database = database
    }

    async create(req, res) {
        try {
            let user = await this.database.models["User"].create(req.body)
            res.json(user)
        } catch (err) {
            console.log(err)
            res.json({err: true, message: err})
        }
    }

}

module.exports = UserController