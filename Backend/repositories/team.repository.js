const Team = require("../models/teams.model");
const User = require("../models/user.model");

async function attachMemberCount(team) {
  if (!team) return team;
  const count = await User.countDocuments({ team: team._id });
  team.number_of_team = count;
  return team;
}

exports.create =async (data)=>{  return await Team.create(data)};

exports.findById = async (id) => {
  const team = await Team.findById(id);
  if (!team) return null;
  const enriched = await attachMemberCount(team);
  const members = await User.find({ team: team._id }, 'name email role').lean();
  return { ...enriched.toObject(), members };
};

exports.findAll = async () => {
  const teams = await Team.find().populate('managerId', 'name email');
  const enriched = await Promise.all(teams.map(attachMemberCount));
  const allUsers = await User.find({}, 'name email team role').lean();
  return enriched.map((team) => ({
    ...team.toObject(),
    members: allUsers.filter(
      (u) => u.team && u.team.toString() === team._id.toString()
    ),
  }));
};

exports.findByManager=async (managerId)=>{
  const teams = await Team.find({managerId});
  const enriched = await Promise.all(teams.map(attachMemberCount));
  return Promise.all(enriched.map(async (team) => {
    const members = await User.find({ team: team._id }, 'name email role').lean();
    return { ...team.toObject(), members };
  }));
};

exports.updata = (id,data)=> Team.findByIdAndUpdate(id,data,
    {returnDocument: 'after', runValidators: true});

exports.delete =(id)=>Team.findByIdAndDelete(id);    
