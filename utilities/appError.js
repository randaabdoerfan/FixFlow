const AppError =(message,statuscode)=>{
    err = new Error(message)
    err.statuscode = statuscode
    return err
}
module.exports = AppError