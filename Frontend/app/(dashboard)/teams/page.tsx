"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import API_URL from "../../lib/api"

export default function Teams() {
  const [teams, setTeams] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return;
    axios.get(API_URL + "/teams/getAllTeams", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (Array.isArray(res.data)) setTeams(res.data)
    }).catch(console.log)
  }, [])

  return (
<div className="flex justify-center">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-fit">
              {teams.map((team: any) => (
                   <div key={team._id}
                    className="w-80 p-6 shadow-lg rounded-2xl bg-white"
                >
                 <img
                      className="m-auto p-7 bg-[#10335646] rounded-full rounded-base mb-4 md:mb-0"
                      src={`../../assets/${team.name === "Developers" ? "hugeicons_developer.png" : team.name === "Financial" ? "fa_users.png" : "streamline-plump_customer-support-7-solid.png"}`}
                      alt=""
                   />
                   <div className="flex flex-col items-center justify-between md:p-4 leading-normal">
                      <h5 className="mb-2 text-3xl tracking-tight text-center sm:text-start text-heading">
                        {team.number_of_team || 0}
                      </h5>
                      <p className="mb-1 text-2xl text-[#808080]">{team.name}</p>
                      <p className="text-sm text-[#808080]">Manager: {team.managerId?.name || "—"}</p>
                      {team.members && team.members.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1">
                          {team.members.map((m: any) => (
                            <span key={m._id} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                              {m.name}
                            </span>
                          ))}
                        </div>
                      )}
                   </div>
                </div>
              ))}
              {teams.length === 0 && (
                <p className="col-span-full text-center text-gray-400 py-20">No teams found</p>
              )}
            </div>
        </div>
  )
}
