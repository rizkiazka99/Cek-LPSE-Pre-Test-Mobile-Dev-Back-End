const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, './uploads')
    },
    filename: (request, file, cb) => {
        cb(
            null, 
            path.basename(file.originalname, path.extname(file.originalname))
                + '-'
                + Date.now()
                + Math.floor(Math.random() * 1000)
                + path.extname(file.originalname)
        )
    }
})

const upload = multer({ storage: storage })

module.exports = { upload }