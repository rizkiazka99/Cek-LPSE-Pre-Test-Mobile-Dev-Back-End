const idGenerator = () => {
    const currentDate = new Date()
    const month = currentDate.getMonth() + 1
    const date = currentDate.getDate()
    const year = currentDate.getFullYear()
    const milliseconds = currentDate.getMilliseconds()
    const randomNum = Math.floor(Math.random() * 1000)
    let id = `C${randomNum}${milliseconds}${year}${month}${date}`

    console.log(`ID: ${id}`)
    return id
}

module.exports = { idGenerator }