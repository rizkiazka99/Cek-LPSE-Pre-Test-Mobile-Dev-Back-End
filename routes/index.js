const route = require('express').Router()
const userRoutes = require('./userRoutes.js')

route.get('/api', (request, response) => {
    response.status(200).json({
        message: 'Welcome to Cek LPSE Pre-Test Mobile Dev API'
    })
})

route.use('/api/users', userRoutes)

module.exports = route