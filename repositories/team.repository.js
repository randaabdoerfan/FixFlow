const Team = require("../models/teams.model");

exports.create =async (data)=>{  return await Team.create(data)};

exports.findById = (id)=>Team.findById(id);

exports.findAll = ()=>Team.find();

exports.findByManager=(managerId)=>Team.find({managerId});

exports.updata = (id,data)=> Team.findByIdAndUpdate(id,data,
    {new:true , runValidators:true});

exports.delete =(id)=>Team.findByIdAndDelete(id);    
