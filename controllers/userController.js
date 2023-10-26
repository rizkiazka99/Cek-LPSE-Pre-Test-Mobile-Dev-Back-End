const { User } = require('../models')
const { decryptPassword, encryptPassword } = require('../helpers/bcrypt.js')
const { generateToken } = require('../helpers/jwt.js')
const { idGenerator } = require('../helpers/idGenerator.js')
const { deleteFile } = require('../helpers/deleteFile')

class UserController {
    static async register(request, response) {
        try {
            const { email, username, password, gender } = request.body

            let duplicateAccountEmail = await User.findOne({
                where: { email }
            })

            let duplicateAccountUsername = await User.findOne({
                where: { username }
            })

            if (duplicateAccountEmail) {
                response.status(403).json({
                    status: false,
                    message: 'This e-mail address has been registered to another account'
                })
            } else if (duplicateAccountUsername) {
                response.status(403).json({
                    status: false,
                    message: 'This username is not available'
                })
            } else {
                let id = idGenerator()

                await User.create({
                    id, email, username, password, gender
                })

                response.status(201).json({
                    status: true,
                    message: 'Successfully created your account'
                })
            }
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err)
            })
        }
    }

    static async login(request, response) {
        try {
            const { username, password } = request.body;

            let doesAccountExist = await User.findOne({
                where: { username }
            })

            if (doesAccountExist) {
                const isPasswordCorrect = decryptPassword(password, doesAccountExist.password)
                
                if (isPasswordCorrect) {
                    let access_token = generateToken(doesAccountExist)

                    response.status(200).json({
                        status: true,
                        message: 'Login successful',
                        access_token: access_token
                    })
                } else {
                    response.status(403).json({
                        status: false,
                        message: 'Invalid username or password',
                        access_token: null
                    })
                }
            } else {
                response.status(404).json({
                    status: false,
                    message: 'Account with this username doesn\'t exist',
                    access_token: null
                })
            }
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err),
                access_token: null
            })
        }
    }

    static async getProfile(request, response) {
        try {
            const id = request.userData.id

            let account = await User.findOne({
                where: { id }
            })

            if (account) {
                response.status(200).json({
                    status: true,
                    message: 'Profile retrieved',
                    data: account
                })
            } else {
                response.status(404).json({
                    status: false,
                    message: 'Couldn\'t find the profile',
                    data: null
                })
            }
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err),
                data: null
            })
        }
    }

    static async updateProfile(request, response) {
        try {
            const id = request.params.id
            const idAuth = request.userData.id
            const { email, username, password } = request.body
            let result;

            if (id !== idAuth) {
                response.status(403).json({
                    status: false,
                    message: 'You are not the authorized user'
                })
            } else {
                let defaultData = await User.findByPk(id)

                if (request.file) {
                    let profilePicture = request.file.filename

                    result = await User.update({
                        email: email === undefined || ''
                            ? defaultData.email
                            : email,
                        username: username === undefined || ''
                            ? defaultData.username
                            : username,
                        password: password === undefined || ''
                            ? defaultData.password
                            : encryptPassword(password),
                        profile_picture: profilePicture
                    }, {
                        where: { id }
                    })
                } else {
                    result = await User.update({
                        email: email === undefined || ''
                            ? defaultData.email
                            : email,
                        username: username === undefined || ''
                            ? defaultData.username
                            : username,
                        password: password === undefined || ''
                            ? defaultData.password
                            : encryptPassword(password),
                        profile_picture: defaultData.profile_picture
                    }, {
                        where: { id }
                    })
                }

                if (result[0] === 1) {
                    if (request.file) {
                        if (defaultData.profile_picture !== 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png'
                                && defaultData.profile_picture !== 'https://cdn-icons-png.flaticon.com/512/7127/7127281.png'
                        ) {
                            deleteFile(defaultData.profile_picture)
                        }
                    }

                    response.status(200).json({
                        status: true,
                        message: 'Successfully updated your profile'
                    })
                } else {
                    response.status(400).json({
                        status: true,
                        message: 'Failed to update your profile'
                    })
                }
            }
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err)
            })
        }
    }

    static async verifyPassword(request, response) {
        try {
            const { username, password } = request.body

            let account = await User.findOne({
                where: { username }
            })

            const isPasswordCorrect = decryptPassword(password, account.password)

            if (isPasswordCorrect) {
                response.status(200).json({
                    status: true,
                    message: 'Password verified'
                })
            } else {
                response.status(403).json({
                    status: false,
                    message: 'Incorrect password'
                })
            }
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err)
            })
        }
    }
}

module.exports = UserController