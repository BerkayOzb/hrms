const { Router } = require('express')

const routes = Router()

routes.use('/users', require('./users'))
routes.use('/employee', require('./employee'))
routes.use('/admin', require('./admin'))



module.exports = routes;
