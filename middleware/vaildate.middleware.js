const Vaildate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.vaildate(req.body)
        if (error) {
            res.status(400).json({
                message: error.details[0].message
            }
            )
        }
        next()
    }
}
module.exports = Vaildate