const teamRepo = require('../repositories/team.repository');
const AppError = require('../utilities/appError');

exports.createTeam= async(data)=>{
    // if (User.role!=='admin') throw new AppError('Only manager can create team',400);
    return await teamRepo.create(data);
};
exports.findById = async (id) => {
    const team = await teamRepo.findById(id);
    return team;
};

exports.updateTeam= async(id,data)=>{
    const team = await teamRepo.findById(id);
    if(!team) return null;

    //if ( User.role!=='admin') throw new AppError('Only admin can update team',400);
    return teamRepo.updata(id,data); 
};

exports.deleteTeam= async(id)=>{
   // if ( User.role!=='admin') throw new AppError('Only admin can delete team',400);
    return teamRepo.delete(id); 
};

exports.getAllTeams = ()=>teamRepo.findAll();
exports.getTeam = (id)=>teamRepo.findById(id);

