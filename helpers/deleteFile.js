const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const deleteFile = async (data) => {
    if (data !== null) {
        const filePath = `./uploads/${data}`
        await unlinkAsync(filePath)
        console.log('file deleted')
    }
}

module.exports = { deleteFile }