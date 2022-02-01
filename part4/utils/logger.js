const info = (...params) => {
    // not run during test mode
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...params)
    }
}

module.exports = {
    info, error
}