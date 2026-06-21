const  {createUser,loginUser} = require('../repositories/user.repo');
const {getUserByEmail} = require('../repositories/user.repo')
exports.createUser = async (data) => {
    if (!data) { throw new AppError("no data", 400) }
    if (await getUserByEmail(data.email)) {
        throw new AppError("Email already exists", 400);}
    if(data.password !== data.confirmPassword){
    throw new AppError("Password and confirm password do not match", 400);  }
    return await createUser(data)
    }

exports.loginUser = async (data) => {
    if (!data) { throw new AppError("no data", 400) }  
    return await loginUser(data)
}