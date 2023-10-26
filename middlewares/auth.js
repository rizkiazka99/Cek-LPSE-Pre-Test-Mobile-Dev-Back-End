const { verifyToken } = require('../helpers/jwt.js')

const auth = (request, response, next) => {
    console.log('Auth initiated')
    const access_token = request.headers.access_token

    if (access_token) {
        let verify_token = verifyToken(access_token)
        request.userData = verify_token
        console.log('Auth success')
        next()
    } else {
        response.status(401).json({
            status: false,
            message: 'Access Token wasn\'t found'
        })
        console.log('Auth failed')
    }
}

module.exports = { auth }