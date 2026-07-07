const teamService = require('../services/team.service');

exports.createTeam= async(req,res,next)=>{
    try{
        const team = await teamService.createTeam(req.body);
        res.status(201).json(team);
    }catch(err){
        next(err);
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const { id } = req.params;

        const team = await teamService.findById(id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found",
            });
        }

        res.status(200).json({
            success: true,
            data: team,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


exports.getAllTeams=async(req,res,next)=>{
    try{
        const teams = await teamService.getAllTeams();
        res.status(200).json(teams);
    }catch(err){
        next(err);
    }
};

exports.updateTeam=async(req,res,next)=>{
    try{
        const team = await teamService.updateTeam(req.params.id,req.body,req.user);
        if(!team) return res.status(404).json({message:'team not found'});
        res.status(200).json(team);
    }catch(err){
        next(err);
    }
};

exports.deleteTeam=async(req,res,next)=>{
    try{
        const team = await teamService.deleteTeam(req.params.id,req.user);
        if(!team) return res.status(404).json({message:'team not found'});
        res.status(200).json(team);
    }catch(err){
        next(err);
    }
};