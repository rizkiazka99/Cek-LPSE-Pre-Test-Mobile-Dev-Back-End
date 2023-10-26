const userRoutes = require('express').Router()
const { UserController } = require('../controllers')
const { auth } = require('../middlewares/auth.js')
const { upload } = require('../middlewares/multer.js')

userRoutes.post('/login', UserController.login)
userRoutes.post('/register', UserController.register)
userRoutes.get('/profile', auth, UserController.getProfile)
userRoutes.put('/update_profile/:id', auth, upload.single('profile-picture'), UserController.updateProfile)
userRoutes.post('/verify_password', auth, UserController.verifyPassword)

module.exports = userRoutes