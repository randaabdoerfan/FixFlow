const handleError = (err, req, res, next) => {
    const statuscode = err.statuscode || 500
    const message = err.message || "Server Internal Error"
    res.status(statuscode).json({
        failed: true,
        message: message
    })
}
module.exports = handleError